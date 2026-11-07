// Build-time content guard: fails the build if baked answers or data files contain
// model "context" leaks or banned sources. Whole phrases only (no loose substring matches).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const files = ["lib/answers-baked.json", "lib/data.js"];
const banned = [
  /\bthe context\b/i,
  /\bprovided context\b/i,
  /\bknowledge base\b/i,
  /\b(data )?chunks\b/i,
  /\bPotatoPro\b/i,
  /\bPotato ?News ?Today\b/i,
  /\bFreshPlaza\b/i,
  /\bTimesCA\b/i,
];

let bad = 0;
for (const f of files) {
  const text = readFileSync(join(root, f), "utf8");
  for (const re of banned) {
    const m = re.exec(text);
    if (m) {
      const line = text.slice(0, m.index).split("\n").length;
      const ctx = text.slice(Math.max(0, m.index - 50), m.index + 70).replace(/\s+/g, " ");
      console.error(`check-content: ${f}:${line} matches ${re} ... ${ctx}`);
      bad++;
    }
  }
}
if (bad) {
  console.error(`check-content: ${bad} problem(s). Fix the text (plain expert voice, named publishers, no banned sources).`);
  process.exit(1);
}
console.log("check-content: ok");
