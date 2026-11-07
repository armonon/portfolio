// Consistency check: every app, project, case study and flagship on the site must resolve to
// one registry entry, and catalogue counts must agree. Run: npx tsx scripts/check-registry.ts
import { appCatalogue, flagships, fullApps } from "../src/showcase";
import { caseStudies } from "../src/cases";
import { projects } from "../src/data/projects";
import { registry, entry, appCounts } from "../src/registry";

let bad = 0;
const fail = (m: string) => { bad++; console.error("✗ " + m); };
const ids = new Set<string>();
for (const e of registry) { if (ids.has(e.id)) fail(`duplicate id ${e.id}`); ids.add(e.id); }
for (const a of appCatalogue) if (!entry(a.name)) fail(`catalogue app not in registry: ${a.name}`);
const appIds = new Set(appCatalogue.map((a) => entry(a.name)?.id));
for (const e of registry.filter((r) => r.type === "app")) if (!appIds.has(e.id)) fail(`registry app not in catalogue: ${e.name}`);
if (appCounts.total !== appCatalogue.length) fail(`appCounts.total ${appCounts.total} != catalogue ${appCatalogue.length}`);
for (const f of flagships) if (!entry(f.slug)) fail(`flagship not in registry: ${f.slug}`);
for (const f of fullApps) if (!entry(({ form: "form-studio", luma: "luma-studio" } as Record<string, string>)[f.id] ?? f.id)) fail(`full app not in registry: ${f.id}`);
for (const c of caseStudies) if (!entry(c.slug) && !entry(c.title)) console.warn(`· case study without registry entry: ${c.slug}`);
for (const p of projects) if (!entry(String(p.id)) && !entry(p.title)) console.warn(`· project without registry entry: ${p.id}`);
console.log(`${registry.length} entries · apps ${JSON.stringify(appCounts)}`);
if (bad) { console.error(`${bad} problem(s)`); process.exit(1); }
console.log("registry OK");
