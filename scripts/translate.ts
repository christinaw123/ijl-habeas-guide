import { STRINGS } from "../lib/i18n/strings";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { resolve } from "path";

const TARGET_LANGS = ["es", "ar", "ht", "vi", "pt", "zh-CN"];

// MyMemory free limits (register free at mymemory.translated.net):
//   No email  → ~1,000 words/day
//   With email → ~10,000 words/day  (set MYMEMORY_EMAIL in .env or CI secrets)
const EMAIL = process.env.MYMEMORY_EMAIL ?? "";
const DELAY_MS = 150;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Thrown when the daily word quota is hit — distinguished from real errors so
// the caller can stop cleanly without writing bad data to disk.
class QuotaExceededError extends Error {}

async function translateOne(text: string, target: string): Promise<string> {
  const params = new URLSearchParams({ q: text, langpair: `en|${target}` });
  if (EMAIL) params.set("de", EMAIL);

  const res = await fetch(`https://api.mymemory.translated.net/get?${params}`);

  // HTTP 403/429 at the network level = quota or IP block — treat same as quota.
  if (res.status === 403 || res.status === 429) throw new QuotaExceededError();
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);

  const json = await res.json();
  const status = Number(json.responseStatus);

  // MyMemory also signals quota exhaustion inside the JSON body.
  if (status === 429 || status === 403 || json.quotaFinished === true) {
    throw new QuotaExceededError();
  }
  if (status !== 200) {
    throw new Error(`MyMemory status ${status}: ${json.responseDetails ?? ""}`);
  }

  return (json.responseData?.translatedText as string) || text;
}

function loadExisting(path: string): Record<string, string> {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return {};
  }
}

async function translateLang(lang: string): Promise<"done" | "quota"> {
  const outPath = resolve("public/locales", `${lang}.json`);
  const existing = loadExisting(outPath);
  const missing = Object.keys(STRINGS).filter((k) => !(k in existing));

  if (missing.length === 0) {
    console.log(`  ${lang}: already complete, skipping.`);
    return "done";
  }

  console.log(
    `  ${lang}: ${missing.length} remaining` +
      (existing && Object.keys(existing).length > 0
        ? ` (${Object.keys(existing).length} already done)`
        : "")
  );

  const partial = { ...existing };
  let translated = 0;

  for (const key of missing) {
    process.stdout.write(`\r  ${lang}: ${translated + 1}/${missing.length} `);
    try {
      partial[key] = await translateOne(STRINGS[key], lang);
      // Write after every string — interrupted runs lose at most one entry.
      writeFileSync(outPath, JSON.stringify(partial, null, 2) + "\n");
      translated++;
      await sleep(DELAY_MS);
    } catch (e) {
      if (e instanceof QuotaExceededError) {
        process.stdout.write("\n");
        console.log(`  ${lang}: quota reached after ${translated} strings — progress saved.`);
        return "quota";
      }
      throw e;
    }
  }

  process.stdout.write("\n");
  console.log(`  ${lang}: done ✓`);
  return "done";
}

async function main() {
  mkdirSync(resolve("public/locales"), { recursive: true });

  // Allow targeting a single language: npm run translate -- es
  const onlyLang = process.argv[2];
  const langs = onlyLang ? [onlyLang] : TARGET_LANGS;

  if (!EMAIL) {
    console.warn(
      "Warning: MYMEMORY_EMAIL not set — daily limit is ~1,000 words.\n" +
        "Register free at mymemory.translated.net and set MYMEMORY_EMAIL to get ~10,000 words/day.\n"
    );
  }

  for (const lang of langs) {
    const result = await translateLang(lang);
    if (result === "quota") {
      console.log("\nDaily quota reached. Run again tomorrow to continue.");
      // Exit 0 so GitHub Actions still commits whatever was saved.
      process.exit(0);
    }
  }

  console.log("\nAll translations complete.");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
