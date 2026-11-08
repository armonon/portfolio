// Client-facing service catalogue. `proof` ids point at entries in the `projects` list in App.tsx,
// so every service links straight to shipped work that demonstrates it.

export type Service = {
  id: string;
  kicker: string;
  title: string;
  line: string;
  deliverables: string[];
  proof: string[];
};

export const services: Service[] = [
  {
    id: "design",
    kicker: "Design",
    title: "Brand & digital design",
    line: "Identity, UI/UX and campaign visuals that look considered on every screen — from first sketch to a design system your team can keep using.",
    deliverables: ["Brand identity & type", "UI / UX & prototypes", "Campaign & social visuals", "Design systems"],
    proof: ["sattari-music", "luma-studio", "momentous"]
  },
  {
    id: "web",
    kicker: "Web",
    title: "Websites & web apps",
    line: "Fast marketing sites, storefronts and full web platforms — accounts, dashboards, payments and the backend behind them.",
    deliverables: ["Marketing & portfolio sites", "E-commerce & Stripe", "Platforms & dashboards", "APIs & databases"],
    proof: ["nasiri-team", "momentous", "now-messenger"]
  },
  {
    id: "apps",
    kicker: "Apps & software",
    title: "Apps & native software",
    line: "Desktop, mobile and browser tools built end to end — including the hard parts: GPU rendering, real-time audio and offline-first data.",
    deliverables: ["macOS / iOS apps", "Desktop & browser tools", "Audio plugins (VST3 / AU)", "Internal tools"],
    proof: ["reclaim", "bounce", "converter"]
  },
  {
    id: "games",
    kicker: "Games & interactive",
    title: "Game design & interactive",
    line: "Game concepts, mechanics and playable prototypes, plus interactive web experiences, 3D scenes and real-time characters.",
    deliverables: ["Game concepts & design docs", "Playable prototypes", "WebGL / Three.js experiences", "Interactive installations"],
    proof: ["digital-human-mvp", "scenepilot-studio", "entropy"]
  },
  {
    id: "assets",
    kicker: "Assets & 3D",
    title: "Asset creation & 3D",
    line: "Models, product renders, mockups and production-ready assets for games, e-commerce, print and campaigns.",
    deliverables: ["3D models & product renders", "Game-ready assets", "Mockups & product photos", "CAD for manufacturing"],
    proof: ["form-studio", "model-studio", "luma-studio"]
  },
  {
    id: "generative",
    kicker: "Generative media",
    title: "AI image, video & 3D",
    line: "AI-generated imagery, motion and 3D directed to a brief — then finished by hand, so it reads as your brand rather than a prompt.",
    deliverables: ["AI campaign & product imagery", "Music videos & motion", "Image-to-3D & textures", "Custom generation pipelines"],
    proof: ["scenepilot-studio", "model-studio", "luma-studio"]
  },
  {
    id: "automation",
    kicker: "AI & automation",
    title: "AI features & automation",
    line: "LLM features inside your product, workflow automation and data pipelines that remove the repetitive work from your week.",
    deliverables: ["LLM & chat features", "Workflow automation", "Search & knowledge tools", "Integrations & APIs"],
    proof: ["hole", "librarian", "universal-computer-operator"]
  }
];

/** Featured offer: local, private autonomous agents set up on the client's own hardware. */
export const agentOffer = {
  title: "Local autonomous agents, set up on your machine.",
  line: "A private AI assistant that runs on your own computer, works inside the apps and files you already use, and asks before it acts. I handle the setup end to end and teach you to run it.",
  steps: [
    { k: "01", title: "Audit", body: "Your hardware, the tasks worth automating, and what has to stay private." },
    { k: "02", title: "Install", body: "Local models and an agent runtime configured for your machine — Mac, Windows or Linux." },
    { k: "03", title: "Connect", body: "Files, browser, email, calendar and the tools you use, with only the access you approve." },
    { k: "04", title: "Guardrails", body: "Approval steps, logs and limits, so nothing important happens without you." },
    { k: "05", title: "Handoff", body: "A walkthrough, written playbooks and follow-up support while it settles in." }
  ],
  includes: ["Local LLMs (no data leaves your machine)", "Computer-use & browser agents", "Custom skills for your workflow", "Teams, solo founders & creators"],
  proof: "universal-computer-operator"
};

export const process = [
  { k: "01", title: "Intro call", body: "A short call about what you need, who it's for and when it has to ship." },
  { k: "02", title: "Plan & quote", body: "A clear scope, timeline and quote — or a retainer if the work is ongoing." },
  { k: "03", title: "Design & build", body: "Working previews every week, so you see real progress, not just status updates." },
  { k: "04", title: "Launch & support", body: "Deployment, handoff docs and support after launch so it keeps running." }
];

export const engagementTypes = [
  { title: "Project", body: "A defined build with an agreed scope and quote — a site, an app, an asset pack, an agent setup." },
  { title: "Retainer", body: "A monthly block of design and development time for teams that ship continuously." },
  { title: "Setup session", body: "A focused session to install, configure and hand off a local AI or automation setup." }
];

export const inquiryOptions = [
  "Design",
  "Website",
  "App / software",
  "Game / interactive",
  "3D & assets",
  "AI image / video",
  "Local AI agent",
  "Automation",
  "Not sure yet"
];

/** AI art & image-generation gallery. Drop files into public/photos/art/ and add an entry here. */
export const artPieces = [
  {
    title: "Divine Mother",
    medium: "AI image generation · collage · colour grade",
    src: "/photos/art/divine-mother.jpg",
    note: "Dozens of generated figures (angels, cherubs, a jester, a golden monkey, all-seeing eyes) composited into one maximalist, hyper-saturated poster with hand-set script type."
  }
];

/** The three capability families shown on the homepage and detailed on /services. */
export type CapabilityFamily = {
  id: "products" | "creative" | "ai";
  title: string;
  kicker: string;
  line: string;
  items: string[];
  /** Case-study slugs (or /apps, /tools) that demonstrate the family */
  proof: { label: string; href: string }[];
};

export const families: CapabilityFamily[] = [
  {
    id: "products",
    kicker: "01 · Digital products",
    title: "Digital Products",
    line: "Web apps, native software and stores, designed and engineered end to end, from data model to the last pixel.",
    items: ["Web applications", "Native software (macOS, desktop, mobile web)", "UI/UX and product design", "E-commerce", "APIs, databases and integrations"],
    proof: [
      { label: "Sattari Music", href: "/work/sattari" },
      { label: "Luma Studio", href: "/work/luma-studio" },
      { label: "Librarian", href: "/work/librarian" }
    ]
  },
  {
    id: "creative",
    kicker: "02 · Creative technology",
    title: "Creative Technology",
    line: "Interactive and immersive work where design and engineering are the same job: 3D worlds, games, audio tools and motion.",
    items: ["Interactive websites", "WebGL and Three.js", "Game development", "3D assets", "Audio software", "Motion, image and video production"],
    proof: [
      { label: "BREAKTHYRULE Eden", href: "/work/breakthyrule-eden" },
      { label: "SKYBOUND", href: "/work/skybound" },
      { label: "Form Studio", href: "/work/form-studio" },
      { label: "ScenePilot", href: "/work/scenepilot" }
    ]
  },
  {
    id: "ai",
    kicker: "03 · AI & automation",
    title: "AI & Automation",
    line: "AI that does real work: on-device models, AI features inside products, and agents that operate safely on your own machine.",
    items: ["Local AI systems", "AI-powered applications", "Autonomous agents", "Workflow automation", "Custom AI integrations"],
    proof: [
      { label: "Universal Computer Operator", href: "/work/universal-computer-operator" },
      { label: "Cutout", href: "/work/cutout" },
      { label: "Captions", href: "/work/captions" }
    ]
  }
];
