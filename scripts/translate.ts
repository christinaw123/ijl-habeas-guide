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

class QuotaExceededError extends Error {}

async function translateOne(text: string, target: string): Promise<string> {
  const params = new URLSearchParams({ q: text, langpair: `en|${target}` });
  if (EMAIL) params.set("de", EMAIL);

  const res = await fetch(`https://api.mymemory.translated.net/get?${params}`);

  if (res.status === 403 || res.status === 429) throw new QuotaExceededError();
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);

  const json = await res.json();
  const status = Number(json.responseStatus);

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

async function translateLang(lang: string): Promise<"done" | "blocked"> {
  const outPath = resolve("public/locales", `${lang}.json`);
  const existing = loadExisting(outPath);
  const missing = Object.keys(STRINGS).filter((k) => !(k in existing));

  if (missing.length === 0) {
    console.log(`  ${lang}: already complete, skipping.`);
    return "done";
  }

  const done = Object.keys(existing).length;
  console.log(`  ${lang}: ${missing.length} remaining${done > 0 ? ` (${done} already done)` : ""}`);

  const partial = { ...existing };
  let translated = 0;
  let consecutiveErrors = 0;

  for (const key of missing) {
    process.stdout.write(`\r  ${lang}: ${translated + 1}/${missing.length} `);
    try {
      partial[key] = await translateOne(STRINGS[key], lang);
      writeFileSync(outPath, JSON.stringify(partial, null, 2) + "\n");
      translated++;
      consecutiveErrors = 0;
      await sleep(DELAY_MS);
    } catch (e) {
      process.stdout.write("\n");
      if (e instanceof QuotaExceededError) {
        console.log(`  ${lang}: quota/blocked after ${translated} strings — progress saved.`);
        return "blocked";
      }
      // Unexpected error: log it, skip this string, keep going.
      // After 3 consecutive failures assume the API is down/blocked.
      consecutiveErrors++;
      console.warn(`  Warning (${consecutiveErrors}/3): ${(e as Error).message}`);
      if (consecutiveErrors >= 3) {
        console.log(`  ${lang}: stopping after 3 consecutive errors — progress saved.`);
        return "blocked";
      }
      await sleep(DELAY_MS * 4);
    }
  }

  process.stdout.write("\n");
  console.log(`  ${lang}: done ✓`);
  return "done";
}

async function main() {
  mkdirSync(resolve("public/locales"), { recursive: true });

  const onlyLang = process.argv[2];
  const langs = onlyLang ? [onlyLang] : TARGET_LANGS;

  if (!EMAIL) {
    console.log(
      "Note: MYMEMORY_EMAIL not set — daily limit is ~1,000 words.\n" +
      "Register free at mymemory.translated.net and set MYMEMORY_EMAIL for ~10,000 words/day.\n"
    );
  }

  for (const lang of langs) {
    const result = await translateLang(lang);
    if (result === "blocked") {
      console.log("\nRun again tomorrow to continue.");
      return; // exit 0 — GitHub Actions will still commit whatever was saved
    }
  }

  console.log("\nAll translations complete.");
}

main().catch((e) => {
  // Only reached for setup errors (bad import, missing file, etc.) — not API errors.
  console.error("Fatal:", e.message);
  process.exit(1);
});
