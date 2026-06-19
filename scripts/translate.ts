import { STRINGS } from "../lib/i18n/strings";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { createHash } from "crypto";
import { resolve } from "path";

const TARGET_LANGS = ["es", "ar", "ht", "vi", "pt", "zh-CN"];

// MyMemory free limits (register free at mymemory.translated.net):
//   No email  → ~1,000 words/day
//   With email → ~10,000 words/day  (set MYMEMORY_EMAIL in .env or CI secrets)
const EMAIL = process.env.MYMEMORY_EMAIL ?? "";
const DELAY_MS = 150;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Hashes of the English source text, stored per lang so the script can detect
// when a string's value changed and re-translate only that string.
// Structure: { [lang]: { [key]: hash } }
type HashStore = Record<string, Record<string, string>>;
const HASHES_PATH = resolve("public/locales/.hashes.json");

function srcHash(text: string): string {
  return createHash("md5").update(text).digest("hex").slice(0, 8);
}

function loadJson<T>(path: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

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

async function translateLang(lang: string, hashes: HashStore): Promise<"done" | "blocked"> {
  const outPath = resolve("public/locales", `${lang}.json`);
  const existing = loadJson<Record<string, string>>(outPath, {});
  const langHashes = hashes[lang] ?? {};

  // Keys that need translation: new, or source text changed since last run.
  const toTranslate = Object.keys(STRINGS).filter(
    (k) => !(k in existing) || langHashes[k] !== srcHash(STRINGS[k])
  );

  // Keys removed from STRINGS since last run — drop from the locale file too.
  const removed = Object.keys(existing).filter((k) => !(k in STRINGS));

  if (toTranslate.length === 0 && removed.length === 0) {
    console.log(`  ${lang}: up to date ✓`);
    return "done";
  }

  const parts = [
    toTranslate.filter((k) => !(k in existing)).length > 0 &&
      `${toTranslate.filter((k) => !(k in existing)).length} new`,
    toTranslate.filter((k) => k in existing).length > 0 &&
      `${toTranslate.filter((k) => k in existing).length} changed`,
    removed.length > 0 && `${removed.length} removed`,
  ].filter(Boolean);
  console.log(`  ${lang}: ${parts.join(", ")}`);

  const partial = { ...existing };
  const partialHashes = { ...langHashes };

  // Apply removals immediately.
  for (const key of removed) {
    delete partial[key];
    delete partialHashes[key];
  }

  let translated = 0;
  let consecutiveErrors = 0;

  for (const key of toTranslate) {
    process.stdout.write(`\r  ${lang}: ${translated + 1}/${toTranslate.length} `);
    try {
      partial[key] = await translateOne(STRINGS[key], lang);
      partialHashes[key] = srcHash(STRINGS[key]);
      // Write both files after every string so an interrupted run loses at most one entry.
      writeFileSync(outPath, JSON.stringify(partial, null, 2) + "\n");
      hashes[lang] = partialHashes;
      writeFileSync(HASHES_PATH, JSON.stringify(hashes, null, 2) + "\n");
      translated++;
      consecutiveErrors = 0;
      await sleep(DELAY_MS);
    } catch (e) {
      process.stdout.write("\n");
      if (e instanceof QuotaExceededError) {
        console.log(`  ${lang}: quota/blocked after ${translated} — progress saved.`);
        return "blocked";
      }
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

  const hashes = loadJson<HashStore>(HASHES_PATH, {});

  for (const lang of langs) {
    const result = await translateLang(lang, hashes);
    if (result === "blocked") {
      console.log("\nRun again tomorrow to continue.");
      return;
    }
  }

  console.log("\nAll translations up to date.");
}

main().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
