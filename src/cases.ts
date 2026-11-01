// Case-study pages at /work/:slug. Every clip and still here was recorded from the live product.
import { fullApps, siteShowcases } from "./showcase";

export type Step = { image: string; label: string; caption?: string };
export type Footage = { video: string; poster?: string; label: string; phone?: boolean };

export type CaseStudy = {
  slug: string;
  title: string;
  kind: string;
  group: "App" | "Website" | "Tool" | "Brand";
  summary: string;
  url?: string;
  urlLabel?: string;
  hero: { video?: string; image: string; phoneVideo?: string; phoneImage?: string };
  steps: Step[];
  footage: Footage[];
  features: string[];
  built: string[];
  platforms?: string;
};

const W = (k: string, n: number, labels: string[], captions: string[] = []): Step[] =>
  Array.from({ length: n }, (_, i) => ({ image: `/photos/walk/${k}-${i}.jpg`, label: labels[i], caption: captions[i] }));

const app = (id: string) => fullApps.find((a) => a.id === id)!;
const site = (id: string) => siteShowcases.find((s) => s.id === id)!;

const lib = app("librarian");
const form = app("form");
const luma = app("luma");
const hole = app("hole");
const stem = app("stemdeck");
const eden = site("eden");
const synthesis = site("synthesis");

export const caseStudies: CaseStudy[] = [
  {
    slug: "librarian",
    title: "Librarian",
    kind: lib.kind,
    group: "App",
    summary: lib.pitch,
    url: lib.live,
    urlLabel: "Open Librarian",
    hero: { image: "/photos/librarian-desktop.jpg", phoneVideo: "/videos/librarian-iphone.mp4", phoneImage: "/photos/librarian-iphone-results.jpg" },
    steps: [
      { image: "/photos/librarian-iphone-home.jpg", label: "Your reading room", caption: "Open it like an app from the home screen. Your library, collections and shelf are always one tap away." },
      { image: "/photos/librarian-iphone-results.jpg", label: "Search 10 catalogs", caption: "One search covers Open Library, Internet Archive, the Library of Congress, Europeana and more, with duplicate editions grouped together." },
      { image: "/photos/librarian-iphone-detail.jpg", label: "Book detail", caption: "Covers, subjects, editions and where to read or borrow it, with a metadata quality score on every result." },
      { image: "/photos/librarian-desktop.jpg", label: "Same app on desktop", caption: "The same library scales up to a full grid on a laptop or desktop." }
    ],
    footage: [{ video: "/videos/librarian-iphone.mp4", poster: "/photos/librarian-iphone-home.jpg", label: "Full session on iPhone", phone: true }],
    features: lib.features,
    built: lib.layers,
    platforms: lib.platforms
  },
  {
    slug: "sattari",
    title: "Sattari Music",
    kind: "Client brand · store website, music tools, plugins and an AI ad",
    group: "Brand",
    summary:
      "Everything digital for a Woodland Hills music store: an e-commerce site with service booking and local pages, a free browser music lab (the Hub), a native plugin suite in development, and a generated video campaign.",
    url: "https://sattarimusic.com",
    urlLabel: "Visit sattarimusic.com",
    hero: { video: "/videos/sattari-site-scroll.mp4", image: "/photos/sattari/sat-home.jpg", phoneVideo: "/videos/walk/sattari-m.mp4", phoneImage: "/photos/sattari/sat-mobile.jpg" },
    steps: [
      { image: "/photos/sattari/sat-home.jpg", label: "Homepage", caption: "A bold, product-led homepage: instruments up front, with clear routes into the shop, local services and the Hub." },
      { image: "/photos/sattari/sat-shop.jpg", label: "Shop", caption: "A full catalogue by category: cymbals, sticks, violins, guitar and bass, essentials." },
      { image: "/photos/sattari/sat-cymbals.jpg", label: "Product listings", caption: "Category pages with product photography, pricing and Stripe checkout." },
      { image: "/photos/sattari/sat-services.jpg", label: "Book a service", caption: "Repairs, rentals, lessons and rehearsal space, with a booking request form." },
      { image: "/photos/sattari/sat-hub.jpg", label: "Sattari Hub", caption: "A free music lab inside the store that brings musicians back again and again." },
      { image: "/photos/sattari/sat-vox.jpg", label: "Vox", caption: "Pitch correction and harmony for a solo vocal, right in the browser." },
      { image: "/photos/sattari/sat-canvas.jpg", label: "Canvas", caption: "Audio-reactive loops for Spotify Canvas, Reels and TikTok." },
      { image: "/photos/sattari/suite-modular.jpg", label: "Modular plugin", caption: "The flagship of the Sattari Audio suite: a chain platform with 22 native effects." },
      { image: "/photos/sattari/suite-autopitch.jpg", label: "Auto Pitch", caption: "Vocal tuning, captured-note editing and harmony." },
      { image: "/photos/sattari/suite-royal.jpg", label: "Royal Chain", caption: "A nine-stage vocal finishing chain." }
    ],
    footage: [
      { video: "/videos/sattari-site-scroll.mp4", poster: "/photos/sattari/sat-home.jpg", label: "Store website, desktop" },
      { video: "/videos/walk/sattari-m.mp4", poster: "/photos/sattari/sat-mobile.jpg", label: "Store website, phone", phone: true },
      { video: "/videos/sattari-suite-scroll.mp4", poster: "/photos/sattari/suite-home.jpg", label: "Sattari Audio plugin suite" },
      { video: "/videos/sattari-ai-ad.mp4", poster: "/photos/sattari-ai-ad-poster.jpg", label: "AI video ad" },
      { video: "/videos/walk/split.mp4", poster: "/photos/walk/split-2.jpg", label: "Split: stems in the Hub" }
    ],
    features: [
      "E-commerce with Stripe checkout and category pages",
      "Service booking for repairs, rentals, lessons and rehearsal space",
      "Local landing pages for Woodland Hills, Encino, Calabasas and LA",
      "A free browser music lab: StemDeck, Split, Key & BPM, Vox, Canvas",
      "A native plugin suite and an AI-generated video campaign"
    ],
    built: ["Brand & web design", "E-commerce", "Local SEO", "Browser audio tools", "Native plugins", "AI video"],
    platforms: "Web · mobile · native plugins"
  },
  {
    slug: "form-studio",
    title: "Form Studio",
    kind: form.kind,
    group: "App",
    summary: form.pitch,
    url: form.live,
    urlLabel: "Open Form Studio",
    hero: { video: form.video, image: form.poster },
    steps: [
      { image: "/photos/form-studio-shot.png", label: "Start center", caption: "Begin from a blank precision part or a recipe: mounting bracket, bolt flange, smart screw, parametric buckle." },
      { image: "/photos/form-live.jpg", label: "Exact geometry", caption: "Every dimension (origin, width, height, angle) stays editable, and you can ask for changes in plain language." }
    ],
    footage: [{ video: form.video, poster: form.poster, label: "Live session: opening a mounting bracket" }],
    features: form.features,
    built: form.layers,
    platforms: form.platforms
  },
  {
    slug: "luma-studio",
    title: "Luma Studio",
    kind: luma.kind,
    group: "App",
    summary: luma.pitch,
    url: luma.live,
    urlLabel: "Open Luma Studio",
    hero: { video: luma.video, image: luma.poster },
    steps: [
      { image: "/photos/luma-shot.png", label: "Workspace", caption: "A full pro layout: tools, layers, blend passes, properties and a brush library." },
      { image: "/photos/luma-live.jpg", label: "Painting", caption: "The brush engine running on a custom GPU renderer, with strokes landing in real time." },
      { image: "/photos/walk/cutout-2.jpg", label: "Cutout, built on Luma", caption: "Luma's on-device AI also powers Cutout, a one-click background remover." }
    ],
    footage: [
      { video: luma.video, poster: luma.poster, label: "Live session: brush strokes" },
      { video: "/videos/walk/cutout.mp4", poster: "/photos/walk/cutout-2.jpg", label: "Cutout: background removal" }
    ],
    features: luma.features,
    built: luma.layers,
    platforms: luma.platforms
  },
  {
    slug: "breakthyrule-eden",
    title: "BREAKTHYRULE — Eden",
    kind: eden.kind,
    group: "Website",
    summary: eden.summary,
    url: eden.url,
    urlLabel: "Walk through it live",
    hero: { image: eden.steps[0].image },
    steps: eden.steps.map((s) => ({ image: s.image, label: s.room, caption: s.caption })),
    footage: [],
    features: eden.highlights,
    built: ["3D world design", "Real-time WebGL", "AI guide", "E-commerce vault", "Sound"],
    platforms: "Web"
  },
  {
    slug: "synthesis",
    title: "Synthesis",
    kind: synthesis.kind,
    group: "Website",
    summary: synthesis.summary,
    url: synthesis.url,
    urlLabel: "Visit the showroom",
    hero: { image: synthesis.steps[0].image },
    steps: synthesis.steps.map((s) => ({ image: s.image, label: s.room, caption: s.caption })),
    footage: [],
    features: synthesis.highlights,
    built: ["3D showroom", "Product pages", "Lookbook & film", "Checkout"],
    platforms: "Web"
  },
  {
    slug: "momentous",
    title: "Momentous",
    kind: "Marketplace · web + mobile",
    group: "Website",
    summary:
      "An open digital market: independent apps on one side, independent shops on the other. Every app gets a listing page with platforms, release status and links, and every shop keeps its own checkout.",
    url: "https://momentous-store.netlify.app/",
    urlLabel: "Open Momentous",
    hero: { video: "/videos/walk/momentous.mp4", image: "/photos/walk/momentous-0.jpg", phoneVideo: "/videos/walk/momentous-m.mp4", phoneImage: "/photos/walk/momentous-m-0.jpg" },
    steps: W("momentous", 3, ["Home", "38 apps, filterable", "App listing page"], [
      "“Made by someone. Found by you.” A marketplace for independent software and goods.",
      "Filter by category, platform, use and release status.",
      "Every app gets its own page with description, platforms and a direct link."
    ]),
    footage: [
      { video: "/videos/walk/momentous.mp4", poster: "/photos/walk/momentous-0.jpg", label: "Desktop walkthrough" },
      { video: "/videos/walk/momentous-m.mp4", poster: "/photos/walk/momentous-m-0.jpg", label: "On a phone", phone: true }
    ],
    features: ["Two-sided directory: apps and shops", "Filters by platform, category, use and status", "Listing pages for every app", "Shops keep their own checkout"],
    built: ["Marketplace design", "React + TypeScript", "Search & filters", "Listing pages"],
    platforms: "Web · mobile web"
  },
  {
    slug: "hole",
    title: "HOLE",
    kind: hole.kind,
    group: "App",
    summary: hole.pitch,
    url: hole.live,
    urlLabel: "Search with HOLE",
    hero: { video: hole.video, image: hole.poster, phoneVideo: "/videos/walk/hole-m.mp4", phoneImage: "/photos/walk/hole-m-0.jpg" },
    steps: [
      { image: "/photos/walk/hole-m-0.jpg", label: "Search", caption: "Search the web, independent sites, archives, books and research in one place." },
      { image: "/photos/walk/hole-m-1.jpg", label: "Results", caption: "Results from Open Library, Internet Archive, Crossref and more, with no paid placement." },
      { image: hole.poster, label: "On desktop", caption: "Homepage previews and “Go down the hole” to follow a thread." }
    ],
    footage: [
      { video: hole.video, poster: hole.poster, label: "Desktop search" },
      { video: "/videos/walk/hole-m.mp4", poster: "/photos/walk/hole-m-0.jpg", label: "On a phone", phone: true }
    ],
    features: hole.features,
    built: hole.layers,
    platforms: hole.platforms
  },
  {
    slug: "ghost-studio",
    title: "Ghost Studio",
    kind: "Fashion design · web",
    group: "App",
    summary: "From photo to form: bring in front and back photos of a garment and build a collection of garment studies, ready to generate as product imagery or 3D.",
    url: "https://ghost.thecreatingco.com/",
    urlLabel: "Open Ghost Studio",
    hero: { video: "/videos/walk/ghost.mp4", image: "/photos/walk/ghost-0.jpg" },
    steps: W("ghost", 3, ["From photo to form", "Your collection", "Front and back"], [
      "A workspace for artwork, garments, objects and 3D models.",
      "Garments organised into collections with templates and photo sets.",
      "Front and back photos, ready to generate."
    ]),
    footage: [{ video: "/videos/walk/ghost.mp4", poster: "/photos/walk/ghost-0.jpg", label: "Walkthrough" }],
    features: ["Photo sets per garment", "Garment type templates", "Collections", "Export"],
    built: ["Product design", "Image pipeline", "Fashion workflow"],
    platforms: "Web"
  },
  {
    slug: "scenepilot",
    title: "ScenePilot",
    kind: "Video editing · web",
    group: "App",
    summary: "A beat-aware video editor in the browser: tempo detection, downbeat-locked cuts, GPU grading and in-browser MP4 rendering, plus focused tools such as AutoCut, Captions, Reframe, Board and Grade.",
    url: "https://scenepilot.thecreatingco.com/",
    urlLabel: "Open ScenePilot",
    hero: { video: "/videos/walk/scenepilot.mp4", image: "/photos/walk/scenepilot-0.jpg" },
    steps: [
      ...W("scenepilot", 3, ["ScenePilot", "Beat-aware editing", "The full toolkit"]),
      { image: "/photos/walk/captions-2.jpg", label: "Captions tool", caption: "On-device speech-to-text with editable, animated captions." }
    ],
    footage: [
      { video: "/videos/walk/scenepilot.mp4", poster: "/photos/walk/scenepilot-0.jpg", label: "Product tour" },
      { video: "/videos/walk/captions.mp4", poster: "/photos/walk/captions-2.jpg", label: "Captions: transcribe a clip" }
    ],
    features: ["Tempo and downbeat detection", "Beat-locked cuts", "GPU colour grading", "MP4 rendered in the browser"],
    built: ["WebGL", "Web Audio", "Beat detection", "Video pipeline"],
    platforms: "Web · Mac in development"
  },
  {
    slug: "stemdeck",
    title: "StemDeck",
    kind: stem.kind,
    group: "App",
    summary: stem.pitch,
    url: stem.live,
    urlLabel: "Open StemDeck",
    hero: { video: stem.video, image: stem.poster },
    steps: [
      { image: stem.poster, label: "Perform", caption: "Four decks with stems, pads, global FX and key and tempo sync." },
      { image: "/photos/walk/split-2.jpg", label: "Split into stems", caption: "Split separates any song into vocals, drums, bass and instruments, then sends them to StemDeck." }
    ],
    footage: [
      { video: stem.video, poster: stem.poster, label: "Performance demo" },
      { video: "/videos/walk/split.mp4", poster: "/photos/walk/split-2.jpg", label: "Split: separating a song" }
    ],
    features: stem.features,
    built: stem.layers,
    platforms: stem.platforms
  },
  {
    slug: "converter",
    title: "Converter",
    kind: "Free tool · files",
    group: "Tool",
    summary: "Convert images, PDFs, spreadsheets, audio, video and archives in the browser. Files never leave the device.",
    url: "https://thecreatingco.com/forma/",
    urlLabel: "Open Converter",
    hero: { video: "/videos/walk/converter.mp4", image: "/photos/walk/converter-1.jpg" },
    steps: W("converter", 3, ["Drop in any file", "Pick a format for each", "Converted on your device"]),
    footage: [{ video: "/videos/walk/converter.mp4", poster: "/photos/walk/converter-1.jpg", label: "Converting a JPG, a WAV and a PDF" }],
    features: ["Images, documents, audio, video, 3D and archives", "Batch conversion", "Up to 250 MB per file", "No uploads"],
    built: ["File pipeline", "In-browser processing", "Batch UI"],
    platforms: "Web · desktop"
  },
  {
    slug: "cutout",
    title: "Cutout",
    kind: "Free tool · images",
    group: "Tool",
    summary: "One-click background removal with on-device AI, plus a brush to refine the mask.",
    url: "https://luma.thecreatingco.com/cutout",
    urlLabel: "Open Cutout",
    hero: { video: "/videos/walk/cutout.mp4", image: "/photos/walk/cutout-2.jpg" },
    steps: W("cutout", 4, ["Open an image", "Your photo", "Background removed", "Compare with the original"]).slice(1),
    footage: [{ video: "/videos/walk/cutout.mp4", poster: "/photos/walk/cutout-2.jpg", label: "Removing a background" }],
    features: ["On-device AI segmentation", "Refine with brush and feather", "Export transparent PNG"],
    built: ["ONNX inference", "Mask editing", "Image export"],
    platforms: "Web"
  },
  {
    slug: "captions",
    title: "Captions",
    kind: "Free tool · video",
    group: "Tool",
    summary: "Transcribe speech on-device, edit the transcript, style animated captions and export SRT or VTT.",
    url: "https://scenepilot.thecreatingco.com/tools/captions/",
    urlLabel: "Open Captions",
    hero: { video: "/videos/walk/captions.mp4", image: "/photos/walk/captions-2.jpg" },
    steps: W("captions", 4, ["Drop in a clip", "Transcribing on-device", "Timed, editable words", "Animated captions"]),
    footage: [{ video: "/videos/walk/captions.mp4", poster: "/photos/walk/captions-2.jpg", label: "Transcribing an ad" }],
    features: ["On-device speech models: fast, accurate or multilingual", "Word-level timing", "Animated caption styles", "SRT / VTT export"],
    built: ["Speech-to-text", "WASM / WebGPU", "Caption renderer"],
    platforms: "Web"
  },
  {
    slug: "split",
    title: "Split",
    kind: "Free tool · audio",
    group: "Tool",
    summary: "Separate any song into vocals, drums, bass and instruments, all on your device, then mix, download or open them in StemDeck.",
    url: "https://sattarimusic.com/studio/split",
    urlLabel: "Open Split",
    hero: { video: "/videos/walk/split.mp4", image: "/photos/walk/split-2.jpg" },
    steps: W("split", 3, ["Add a song", "Separating on-device", "Four stems"]),
    footage: [{ video: "/videos/walk/split.mp4", poster: "/photos/walk/split-2.jpg", label: "Separating a track" }],
    features: ["HTDemucs model in the browser", "Mute, solo and balance each stem", "ZIP and Ableton export", "Send to StemDeck"],
    built: ["Stem separation", "WebGPU / CPU", "Audio UI"],
    platforms: "Web"
  },
  {
    slug: "website-checkup",
    title: "Website Checkup",
    kind: "Free tool · web",
    group: "Tool",
    summary: "Scan any public page for metadata, heading, link and form problems, with fixes ranked by priority. Run on my own site, it flagged 5 issues; after the redesign, the re-check is down to 2, and all four SEO fixes landed.",
    url: "https://thecreatingco.com/checkup/",
    urlLabel: "Check your site",
    hero: { video: "/videos/walk/checkup.mp4", image: "/photos/walk/checkup-1.jpg" },
    steps: W("checkup", 2, ["Enter any website", "Findings, ranked"]),
    footage: [{ video: "/videos/walk/checkup.mp4", poster: "/photos/walk/checkup-1.jpg", label: "Re-checking armonnasiri.com" }],
    features: ["Metadata and heading checks", "Link checks", "Form inspection without submitting", "Downloadable JSON report"],
    built: ["Serverless audit", "HTML analysis", "Report UI"],
    platforms: "Web"
  }
];

export const caseBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);

/** Showreel chapters: start times (seconds) in /videos/showreel.mp4 and where each one links. */
export const showreelChapters = [
  { t: 0, label: "Form Studio", sub: "Precision CAD", slug: "form-studio" },
  { t: 2.5, label: "Luma Studio", sub: "Image editor", slug: "luma-studio" },
  { t: 5, label: "Sattari", sub: "AI video ad", slug: "sattari" },
  { t: 7.5, label: "Librarian", sub: "On iPhone", slug: "librarian" },
  { t: 10, label: "Cutout", sub: "Background removal", slug: "cutout" },
  { t: 12.5, label: "BREAKTHYRULE Eden", sub: "3D website", slug: "breakthyrule-eden" },
  { t: 15, label: "HOLE", sub: "Search engine", slug: "hole" },
  { t: 17.5, label: "Split", sub: "Stem separation", slug: "split" },
  { t: 20, label: "sattarimusic.com", sub: "Store website", slug: "sattari" },
  { t: 22.5, label: "Synthesis", sub: "3D showroom", slug: "synthesis" },
  { t: 25, label: "Sattari Audio", sub: "Plugin suite", slug: "sattari" },
  { t: 27.5, label: "Captions", sub: "Speech to text", slug: "captions" }
];
