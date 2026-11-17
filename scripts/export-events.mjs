// Writes scripts/events.json from src/events.ts so the PDF script reads the same event data as the site.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const src = readFileSync("src/events.ts", "utf8");
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
mkdirSync(".tmp", { recursive: true });
writeFileSync(".tmp/events.mjs", js);
const m = await import(pathToFileURL(".tmp/events.mjs").href);
writeFileSync("scripts/events.json", JSON.stringify({ site: m.SITE_URL, couple: m.COUPLE, wedding: m.WEDDING_MOMENT, events: m.EVENTS }, null, 2));
console.log("events:", m.EVENTS.map((e) => e.slug).join(", "));
