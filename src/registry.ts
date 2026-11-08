// Single source of truth for project status, category and verified links.
//
// Every place on the site that shows a status (cards, catalogue, case studies,
// counts in the hero) reads it from here. Statuses are deliberately conservative:
// anything its own product page labels "alpha", "public testing" or "preview"
// is a Public Beta; nothing is called Live / Released unless it is a production
// client site or a finished deliverable.

export type Status = "live" | "beta" | "prototype" | "development" | "private";

export const STATUS: Record<Status, { label: string; short: string; description: string; dot: string }> = {
  live: { label: "Live / Released", short: "Live", description: "In production and publicly available.", dot: "#5f9a00" },
  beta: { label: "Public Beta", short: "Public beta", description: "Public and usable; still labelled alpha, beta or public testing by its own product page.", dot: "#c79a00" },
  prototype: { label: "Prototype", short: "Prototype", description: "A working build or demo that is not yet a product.", dot: "#7b6fd6" },
  development: { label: "In Development", short: "In development", description: "Being built; not publicly usable yet.", dot: "#d26a2c" },
  private: { label: "Private Build", short: "Private build", description: "Runs privately; no public download or link.", dot: "#77756d" }
};

export const STATUS_ORDER: Status[] = ["live", "beta", "prototype", "development", "private"];

export type Family = "products" | "creative" | "ai";

export const FAMILY: Record<Family, { label: string; short: string }> = {
  products: { label: "Digital Products", short: "Products" },
  creative: { label: "Creative Technology", short: "Creative tech" },
  ai: { label: "AI & Automation", short: "AI" }
};

export type Entry = {
  id: string;
  name: string;
  status: Status;
  family: Family;
  /** "app" counts toward the app catalogue; "client" = client/brand site; "work" = other deliverable */
  type: "app" | "client" | "work";
  live?: string;
  /** Only public repositories (visibility verified on GitHub) */
  source?: string;
  /** Other names the same project is listed under elsewhere on the site */
  aliases?: string[];
  /** Why the status is what it is (evidence), for maintainers */
  evidence?: string;
};

const GH = "https://github.com/armonon/";

export const registry: Entry[] = [
  // ── Flagship products (thecreateco) ───────────────────────────────
  { id: "luma-studio", name: "Luma Studio", status: "beta", family: "products", type: "app", live: "https://luma.thecreatingco.com", source: `${GH}luma-studio`, aliases: ["Luma"], evidence: "Listed as public testing; README describes a local-first web + Tauri desktop editor." },
  { id: "form-studio", name: "Form Studio", status: "beta", family: "creative", type: "app", live: "https://form.thecreatingco.com", aliases: ["Form"], evidence: "README: 'Form Studio 0.40 … an active beta, not yet a signed commercial release'. Repo is private." },
  { id: "scenepilot", name: "ScenePilot", status: "beta", family: "creative", type: "app", live: "https://scenepilot.thecreatingco.com", source: `${GH}scenepilot-studio`, aliases: ["ScenePilot Studio", "scenepilot-studio"], evidence: "Public testing on Momentous; v0.1.6 in package.json." },
  { id: "stemdeck", name: "StemDeck", status: "beta", family: "creative", type: "app", live: "https://stemdeck.thecreatingco.com", evidence: "Early access / public testing." },
  { id: "librarian", name: "Librarian", status: "beta", family: "products", type: "app", live: "https://librarian.thecreatingco.com", source: `${GH}librarian`, evidence: "Public testing." },
  { id: "reclaim", name: "Reclaim", status: "beta", family: "products", type: "app", live: "https://thecreatingco.com/products/reclaim/", evidence: "'Free Mac public alpha'; README: 'storage-review and reversible-quarantine alpha'." },
  { id: "converter", name: "Converter", status: "beta", family: "products", type: "app", live: "https://thecreatingco.com/forma/", evidence: "Free and public; no release label on its page, so kept at Public Beta until confirmed." },
  { id: "photobooth-studio", name: "Photobooth Studio", status: "beta", family: "products", type: "app", live: "https://photoboothstudio-b6ac09.netlify.app", source: `${GH}photoboothstudio`, aliases: ["model-studio"], evidence: "Public testing on Momentous." },
  { id: "universal-computer-operator", name: "Universal Computer Operator", status: "private", family: "ai", type: "app", aliases: ["UCO"], evidence: "Private repo; operator overlays now disabled in favour of Reclaim. No public download." },
  { id: "hole", name: "HOLE", status: "beta", family: "products", type: "app", live: "https://thecreatingco.com/community/hole", evidence: "Public testing." },
  { id: "the-circle", name: "The Circle", status: "beta", family: "products", type: "app", live: "https://thecreatingco.com/community/network", evidence: "Public testing; NOW page carries a 'Public alpha' badge." },
  { id: "now-messenger", name: "NOW Messenger", status: "beta", family: "products", type: "app", live: "https://thecreatingco.com/products/now/", aliases: ["NOW"], evidence: "NOW page header: 'Public alpha'." },
  { id: "momentous", name: "Momentous", status: "live", family: "products", type: "work", live: "https://momentous-store.netlify.app", evidence: "Public directory in operation." },
  { id: "ghost-studio", name: "Ghost Studio", status: "beta", family: "creative", type: "app", live: "https://ghost.thecreatingco.com/" },
  { id: "bounce", name: "Bounce", status: "beta", family: "creative", type: "app", live: "https://bounce.thecreatingco.com/browser/", evidence: "Browser player in public testing; native macOS/iOS edition is 'Untiled'." },
  { id: "untiled", name: "Untiled", status: "development", family: "creative", type: "app", evidence: "'Coming soon' on Momentous." },
  { id: "glyph-studio", name: "Glyph Studio", status: "beta", family: "creative", type: "app", live: "https://glyph-studio-610.netlify.app/studio" },
  { id: "locker", name: "Locker", status: "beta", family: "products", type: "app" },
  { id: "sessions", name: "Sessions", status: "beta", family: "products", type: "app" },
  { id: "pocket-studio", name: "Pocket Studio", status: "beta", family: "creative", type: "app" },
  { id: "autocut", name: "AutoCut", status: "beta", family: "creative", type: "app" },
  { id: "captions", name: "Captions", status: "beta", family: "ai", type: "app", live: "https://scenepilot.thecreatingco.com/tools/captions/" },
  { id: "board", name: "Board", status: "beta", family: "creative", type: "app" },
  { id: "grade", name: "Grade", status: "beta", family: "creative", type: "app" },
  { id: "split", name: "Split", status: "beta", family: "ai", type: "app", live: "https://sattarimusic.com/studio/split" },
  { id: "key-bpm", name: "Key & BPM", status: "beta", family: "creative", type: "app", live: "https://sattarimusic.com/studio/keybpm" },
  { id: "vox", name: "Vox", status: "beta", family: "creative", type: "app", live: "https://sattarimusic.com/studio/vox" },
  { id: "canvas", name: "Canvas", status: "beta", family: "creative", type: "app" },
  { id: "pocket", name: "Pocket", status: "beta", family: "creative", type: "app" },
  { id: "press", name: "Press", status: "beta", family: "products", type: "app" },
  { id: "mockups", name: "Mockups", status: "beta", family: "creative", type: "app" },
  { id: "glyph", name: "Glyph", status: "beta", family: "creative", type: "app" },
  { id: "cast", name: "Cast", status: "prototype", family: "creative", type: "app", evidence: "'Preview' on Momentous; estimates only." },
  { id: "reframe", name: "Reframe", status: "beta", family: "ai", type: "app", live: "https://scenepilot.thecreatingco.com/tools/reframe/" },
  { id: "cutout", name: "Cutout", status: "beta", family: "ai", type: "app", live: "https://luma.thecreatingco.com/cutout" },
  { id: "loop", name: "Loop", status: "beta", family: "creative", type: "app" },
  { id: "weblab", name: "WebLab", status: "prototype", family: "products", type: "app", evidence: "'Preview' on Momentous." },
  { id: "animate", name: "Animate", status: "beta", family: "creative", type: "app" },
  { id: "moodboard", name: "Moodboard", status: "beta", family: "creative", type: "app" },
  { id: "portfolio-studio", name: "Portfolio Studio", status: "beta", family: "products", type: "app" },
  { id: "website-checkup", name: "Website Checkup", status: "beta", family: "products", type: "app", live: "https://thecreatingco.com/checkup/" },

  // ── Other builds ─────────────────────────────────────────────────
  { id: "skybound", name: "SKYBOUND", status: "beta", family: "creative", type: "work", live: "https://skybound-ragdoll-arena.netlify.app", aliases: ["Skybound Ragdoll Arena"], evidence: "Free and playable in the browser; carries no release label, so kept at Public Beta until confirmed." },
  { id: "entropy", name: "Entropy", status: "prototype", family: "creative", type: "work", source: `${GH}mk-ultra`, evidence: "'Working build' of a VST3/AU plugin; no public installer." },
  { id: "sattari-suite", name: "Sattari Audio", status: "development", family: "creative", type: "work", live: "https://sattari-audio-suite.netlify.app", aliases: ["Sattari Audio plugins"], evidence: "Suite site labels each flagship 'Development preview'." },
  { id: "digital-human-mvp", name: "Digital Human", status: "prototype", family: "ai", type: "work", evidence: "'Working demo'; private repo." },
  { id: "sweet", name: "SWEET", status: "prototype", family: "creative", type: "work", source: `${GH}sweet-suite`, evidence: "README: Phase 0 renderer landed." },

  // ── Client & brand work ──────────────────────────────────────────
  { id: "sattari", name: "Sattari Music", status: "live", family: "products", type: "client", live: "https://sattarimusic.com", source: `${GH}sattari-custom-site`, aliases: ["sattari-music", "sattarimusic.com"], evidence: "Production store with Stripe checkout." },
  { id: "sattari-ai-ad", name: "Sattari — AI Video Ad", status: "live", family: "creative", type: "client", evidence: "Delivered campaign video." },
  { id: "nasiri-team", name: "Nasiri Team Realty", status: "live", family: "products", type: "client", live: "https://nasiriteam.netlify.app", aliases: ["The Nasiri Team"] },
  { id: "hamdam-care", name: "Hamdam Care", status: "live", family: "products", type: "client", live: "https://myhamdam.com" },
  { id: "healthcore", name: "HealthCore", status: "live", family: "products", type: "client", live: "https://armonon.github.io/healthcore-public-website", source: `${GH}healthcore-public-website` },
  { id: "softech", name: "Softech Digital Studio", status: "live", family: "products", type: "client", live: "https://softech-digital-studio.netlify.app" },
  { id: "synthesis", name: "Synthesis", status: "live", family: "creative", type: "client", live: "https://synthesis-documentation.com", evidence: "Live store with bag and checkout flow." },
  { id: "breakthyrule-eden", name: "BREAKTHYRULE — Eden", status: "beta", family: "creative", type: "client", live: "https://breakthyrule-eden-showroom.netlify.app", source: `${GH}breakthyrule-eden-showroom`, aliases: ["BREAKTHYRULE Eden"], evidence: "The site itself is labelled 'Public preview'." }
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

const index = new Map<string, Entry>();
for (const e of registry) {
  for (const key of [e.id, e.name, ...(e.aliases ?? [])]) index.set(norm(key), e);
}

/** Look a project up by id, slug or any display name used on the site. */
export const entry = (idOrName: string): Entry | undefined => index.get(norm(idOrName));

export const statusOf = (idOrName: string): Status | undefined => entry(idOrName)?.status;

/** Counts for the catalogue (type "app") by status. */
export const appCounts = (() => {
  const apps = registry.filter((e) => e.type === "app");
  const by = Object.fromEntries(STATUS_ORDER.map((s) => [s, apps.filter((a) => a.status === s).length])) as Record<Status, number>;
  return { total: apps.length, ...by };
})();

export const clientCount = registry.filter((e) => e.type === "client" && e.status === "live").length;
