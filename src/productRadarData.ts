export type RadarLink = {
  label: string;
  href: string;
};

export type RadarImage = {
  src: string;
  alt: string;
  caption: string;
};

export type RadarLaneDetail = {
  eyebrow: string;
  description: string;
  images: RadarImage[];
  downloads: RadarLink[];
  highlights: string[];
};

export type RadarLane = {
  id: string;
  icon: string;
  title: string;
  status: string;
  phase: string;
  readiness: number;
  accent: string;
  summary: string;
  bullets: string[];
  nextAction: string;
  blocker: string;
  primaryLink?: RadarLink;
  secondaryLink?: RadarLink;
  detail: RadarLaneDetail;
  evidence?: {
    source: string;
    confidence: "low" | "medium" | "high";
    review: string;
  };
};

export type RadarSoftwareProject = {
  id: string;
  title: string;
  category: string;
  status: string;
  image: string;
  summary: string;
  description: string;
  tags: string[];
  live?: RadarLink;
  repo?: RadarLink;
  downloads: RadarLink[];
  testingFocus: string;
  testSteps: string[];
  webPrototype?: RadarWebPrototype;
};

export type RadarWebPrototype = {
  title: string;
  summary: string;
  sampleInput: string;
  primaryOutput: string;
  panels: {
    label: string;
    value: string;
    detail: string;
  }[];
  actions: string[];
};

export type RadarEvidenceItem = {
  priority: number;
  projectName: string;
  softwareId?: string;
  readinessScore: number;
  promise: string;
  latestProof: string;
  blocker: string;
  nextStep: string;
  monetization: string;
};

export const radarLanes: RadarLane[] = [
  {
    id: "ai-agents",
    icon: "🤖",
    title: "Universal Computer Operator",
    status: "macOS build · no public download yet",
    phase: "Local agent",
    readiness: 74,
    accent: "from-emerald-500/30 via-teal-500/20 to-cyan-500/10",
    summary: "A local AI agent that actually operates a Mac: it sees the screen, plans its steps out loud, waits for approval, then does the work inside real applications — with every destructive step reversible.",
    bullets: [
      "Runs entirely on-device — no account, no API key, no subscription",
      "Five keystroke surfaces: Operator Bar, Suggest Orb, analyze selection, circular capture, and plain-English file cleanup",
      "Plans before acting and gates every destructive step behind explicit user approval",
    ],
    nextAction: "Broaden verified app coverage beyond the current set, and publish a notarized installer alongside a short screen-recorded proof of a full multi-step task.",
    blocker: "Next: notarized installer, wider verified application coverage, and a recorded end-to-end task demo.",
    primaryLink: { label: "Universal Computer Operator details", href: "#/product-radar/software/universal-computer-operator" },
    detail: {
      eyebrow: "AI agent lane",
      description:
        "Universal Computer Operator is the applied-AI flagship: a screen-aware agent that turns a plain-English request into real actions inside real macOS applications. It reads the screen, narrates a plan, asks before it acts, and keeps destructive operations reversible. Because it runs locally, no screen contents or documents leave the machine — which is what makes it usable on real client and creative work.",
      images: [
        { src: "/photos/uco-shot.jpg", alt: "Universal Computer Operator reviewing files before a reversible delete", caption: "Plain-English cleanup with an approval step" },
      ],
      downloads: [],
      highlights: [
        "Screen-aware agent that operates real macOS apps",
        "Approval-gated and reversible by design",
        "Fully local — nothing leaves the machine",
      ],
    },
    evidence: {
      source: "local macOS build",
      confidence: "high",
      review: "Keep capability claims scoped to applications actually verified end to end; the safety model (approval gating, reversibility) is the core promise and must stay accurate.",
    },
  },
  {
    id: "sattari-audio",
    icon: "🥁",
    title: "Sattari Audio",
    status: "Live · downloadable app",
    phase: "Installer + update feed",
    readiness: 58,
    accent: "from-orange-500/30 via-amber-500/20 to-yellow-500/10",
    summary: "The Sattari Audio product line ships through a self-contained Sattari Hub installer and update feed, alongside a standalone StemDeck Mac DJ app for Apple Silicon.",
    bullets: ["Sattari Hub 0.1.2 is live as a downloadable installer + updater", "StemDeck 0.4.3 ships as a standalone Mac DJ app with a four-column live-mixer UI", "Auto Pitch 0.1.4 real-time correction ships through the Hub update feed"],
    nextAction: "Next: a notarized installer, Mac support beyond Apple Silicon, and a full DAW listening pass ahead of the public release.",
    blocker: "Notarized installer, broader Mac support, and a full DAW listening pass are the next milestones toward public release.",
    primaryLink: { label: "Download Sattari Hub 0.1.2", href: "/downloads/sattari-hub-alpha-v0.1.2.tar.gz" },
    secondaryLink: { label: "Sattari Audio site", href: "https://sattari-audio-suite.netlify.app" },
    detail: {
      eyebrow: "Audio product lane",
      description: "Sattari Audio is the product line for Armon's music tools: tuning, drum/audio utilities, and installable creative plugins. Sattari Hub is the downloadable installer/updater surface for the whole suite, with StemDeck shipping as a standalone Mac app and Auto Pitch updating through the Hub feed. The roadmap to public release runs through notarization, DAW import/listening checks, vocal corpus tests, and safe-volume UX proof.",
      images: [
        { src: "/photos/sattari-suite-shot.png", alt: "Sattari Audio plugin interfaces", caption: "The Sattari plugin suite — Compass, Auto Pitch and Instruments" },
        { src: "/photos/sattari-screenshot.png", alt: "Sattari website screenshot", caption: "Sattari public brand surface" },
      ],
      downloads: [
        { label: "Download Sattari Hub 0.1.2 installer + updater", href: "/downloads/sattari-hub-alpha-v0.1.2.tar.gz" },
        { label: "Download the Sattari Audio Suite test pack", href: "/downloads/sattari-audio-suite-internal-test-pack-2026-05-25.zip" },
        { label: "Download StemDeck 0.4.3 standalone Mac app", href: "/downloads/stemdeck-app-alpha-v0.4.3-djay-ui-reference.tar.gz" },
        { label: "Download Auto Pitch preview pack", href: "/downloads/auto-pitch-preview-pack.zip" },
        { label: "Open the Sattari Audio site", href: "https://sattari-audio-suite.netlify.app" },
      ],
      highlights: ["Sattari Hub installer + updater is live and downloadable", "Self-contained Apple Silicon Mac app — no repo clone needed", "Notarization and DAW listening validation are the next release milestones"],
    },
    evidence: {
      source: "wiki/projects/sattari/index.md",
      confidence: "high",
      review: "Keep release claims aligned with validation status; confirm DAW import and listening passes before public-release language.",
    },
  },
  {
    id: "creator-tools",
    icon: "🎬",
    title: "ScenePilot Studio",
    status: "Live tool",
    phase: "Beat-synced rendering",
    readiness: 78,
    accent: "from-violet-500/30 via-fuchsia-500/20 to-sky-500/10",
    summary: "ScenePilot Studio cuts a finished music video from a song and a folder of clips — tempo detection, downbeat-locked cuts, GPU grading, and a rendered MP4, all in the browser.",
    bullets: [
      "Renders a finished MP4 in-browser — no timeline work and no upload",
      "Beat-locked montage with zoom punches, speed ramps, strobes, stutters, and whip cuts",
      "Real-time GPU grade: exposure, bloom, chromatic aberration, vignette, and film grain",
    ],
    nextAction: "Extend the look library and per-shot manual override controls, then validate the macOS build against longer-form footage and higher clip counts.",
    blocker: "Next: per-shot manual overrides, a wider look/preset library, and long-form render validation.",
    primaryLink: { label: "Open the Studio", href: "https://scenepilot.thecreatingco.com" },
    secondaryLink: { label: "Export proof MP4", href: "/downloads/scenepilot-export-proof-2026-05-23.mp4" },
    detail: {
      eyebrow: "Video creator tools",
      description: "ScenePilot Studio is a beat-aware music video editor. Drop in a song and a folder of clips: it finds the tempo, cuts a montage locked to the downbeat, punches the camera on every hit, grades the whole thing on the GPU, and renders an MP4 — entirely on-device, so a creator's footage never leaves their machine. It ships as a browser app with a macOS build alongside it.",
      images: [
        { src: "/photos/scenepilot-shot.png", alt: "ScenePilot Studio editor — master sequence, tracks and inspector", caption: "Beat-locked montage and live GPU grade" },
      ],
      downloads: [
        { label: "Open the Studio", href: "https://scenepilot.thecreatingco.com" },
        { label: "Download the export proof MP4", href: "/downloads/scenepilot-export-proof-2026-05-23.mp4" },
        { label: "Download ScenePilot preview pack", href: "/downloads/auto-cut-preview-pack.zip" },
      ],
      highlights: ["Renders a finished MP4 in the browser", "Beat detection drives cuts, camera moves, and the grade", "Runs on-device with a macOS build"],
    },
    evidence: {
      source: "scenepilot.thecreatingco.com",
      confidence: "high",
      review: "Rendered MP4 export shipped — this lane previously listed it as the blocker. Keep claims scoped to render quality actually validated at longer durations.",
    },
  },
  {
    id: "botanica",
    icon: "🌿",
    title: "Botanica Lab",
    status: "Live app",
    phase: "Living research",
    readiness: 64,
    accent: "from-emerald-500/30 via-lime-500/20 to-teal-500/10",
    summary: "A botanical R&D interface for research-backed concept generation with careful claim boundaries.",
    bullets: ["Living research and article model", "Evidence-first wellness product exploration", "Next: formula cards with risk/evidence scoring"],
    nextAction: "Add formula cards that show source strength, safety flags, and review status.",
    blocker: "Next: a consumer-facing claims review, with outputs framed as evidence-backed R&D.",
    primaryLink: { label: "Live lab", href: "https://botanica-lab.netlify.app/" },
    secondaryLink: { label: "Source repo", href: "https://github.com/armonon/botanica-lab" },
    detail: {
      eyebrow: "Botanical R&D",
      description: "Botanica is a living research lab for botanical product concepts, ingredient signals, formula exploration, and safe wellness-product ideation. The lane emphasizes evidence boundaries and review before consumer-facing claims.",
      images: [
        { src: "/photos/botanica-shot.png", alt: "Botanica Lab concept visual", caption: "Botanica R&D product surface" },
        { src: "/photos/sattari-screenshot.png", alt: "Brand/product web example", caption: "Public product-site polish direction" },
      ],
      downloads: [
        { label: "Open Botanica Lab", href: "https://botanica-lab.netlify.app/" },
        { label: "Open source repo", href: "https://github.com/armonon/botanica-lab" },
      ],
      highlights: ["Live research surface", "Claims review required", "Formula cards and source strength are next"],
    },
  },
  {
    id: "trader",
    icon: "📈",
    title: "Trader Oracle",
    status: "Live beta",
    phase: "Signal refinement",
    readiness: 58,
    accent: "from-amber-500/30 via-orange-500/20 to-red-500/10",
    summary: "A research dashboard that turns watchlists, market news, and catalysts into educational trade-prep scenarios.",
    bullets: ["Watchlist + market pulse engine", "Scenario framing with risk and invalidation", "Next: better source trails and alert controls"],
    nextAction: "Add source trails and a watch/avoid board for the strongest daily setups.",
    blocker: "Must stay research/education only; no personalized financial advice or guaranteed-return copy.",
    primaryLink: { label: "Live dashboard", href: "https://armon-trader.netlify.app" },
    detail: {
      eyebrow: "Market research dashboard",
      description: "Trader Oracle is a research dashboard for watchlists, market pulse, ticker search, and risk-aware setup scenarios. It is framed as education/research only, with no personalized financial advice or guaranteed-return language.",
      images: [
        { src: "/photos/trader-shot.png", alt: "Trader Oracle dashboard visual", caption: "Oracle dashboard and signal surface" },
        { src: "/photos/botanica-shot.png", alt: "Research product visual language", caption: "Evidence-led research product pattern" },
      ],
      downloads: [
        { label: "Open Trader Oracle", href: "https://armon-trader.netlify.app" },
      ],
      highlights: ["Live beta dashboard", "Risk/invalidation framing", "Needs stronger source trails and alert controls"],
    },
  },
  {
    id: "librarian",
    icon: "📚",
    title: "Librarian",
    status: "In development",
    phase: "Trust layer",
    readiness: 46,
    accent: "from-stone-400/30 via-zinc-500/20 to-blue-500/10",
    summary: "A provenance-first book atlas for public-domain discovery, source inspection, and reading paths.",
    bullets: ["Source claims are the core edge", "Explore page and path model are started", "Next: richer book detail pages"],
    nextAction: "Deploy the richer Explore/source-inspection pass and add book/path deep links.",
    blocker: "Next: ship the deeper Explore/source-inspection pass and add book and reading-path deep links.",
    primaryLink: { label: "Live atlas", href: "https://librarian.thecreatingco.com" },
    detail: {
      eyebrow: "Knowledge + provenance",
      description: "Librarian is the source-first book atlas direction: public-domain discovery, provenance claims, authority links, reading paths, and source inspection. Spiritual Search now belongs near this lane as an older related spiritual/library discovery surface.",
      images: [
        { src: "/photos/librarian-shot.jpg", alt: "Librarian book detail — sources, identifiers and catalogs", caption: "Provenance-first book detail and source inspection" },
      ],
      downloads: [
        { label: "Open Librarian atlas", href: "https://librarian.thecreatingco.com" },
        { label: "Open Spiritual Search", href: "https://spiritual-search-armon.netlify.app" },
      ],
      highlights: ["Provenance-first discovery", "Spiritual Search is Librarian-adjacent", "Next pass should add deeper book/path routes"],
    },
  },
  {
    id: "portfolio-downloads",
    icon: "✨",
    title: "Portfolio + Product Downloads",
    status: "Live",
    phase: "Public surface",
    readiness: 72,
    accent: "from-cyan-500/30 via-blue-500/20 to-white/10",
    summary: "The public surface for Armon's software, websites, AI experiences, and preview-pack product directions.",
    bullets: ["Product downloads are visible", "Work is grouped by product direction", "Next: make each serious product its own page"],
    nextAction: "Turn Product Radar into the top-level roadmap and link serious products into dedicated pages.",
    blocker: "Next: graduate preview packs into full installers and apps as each product ships.",
    primaryLink: { label: "Portfolio home", href: "#" },
    detail: {
      eyebrow: "Portfolio hub",
      description: "The portfolio is the public surface for Armon's products and preview packs. Product Radar now acts as the top-level roadmap that turns each lane into a clickable product detail screen with images, status, links, and downloads.",
      images: [
        { src: "/photos/nasiri-screenshot.png", alt: "Nasiri site screenshot", caption: "Portfolio-quality web surface" },
        { src: "/photos/milk-room-screenshot.png", alt: "Milk Room app screenshot", caption: "Older personal app/project example" },
        { src: "/photos/sattari-screenshot.png", alt: "Sattari site screenshot", caption: "Sattari commerce/brand surface" },
      ],
      downloads: [
        { label: "Download Sattari Hub 0.1.2 installer + updater", href: "/downloads/sattari-hub-alpha-v0.1.2.tar.gz" },
        { label: "Download the Sattari Audio Suite test pack", href: "/downloads/sattari-audio-suite-internal-test-pack-2026-05-25.zip" },
        { label: "Download ScenePilot preview pack", href: "/downloads/auto-cut-preview-pack.zip" },
        { label: "Download Auto Pitch preview pack", href: "/downloads/auto-pitch-preview-pack.zip" },
      ],
      highlights: ["Public portfolio hub", "Preview downloads are labeled honestly", "Dedicated product detail pages are now the next structural layer"],
    },
  },
];

export const radarSoftwareProjects: RadarSoftwareProject[] = [
  {
    id: "universal-computer-operator",
    title: "Universal Computer Operator",
    category: "AI agent",
    status: "macOS build · no public download yet",
    image: "/photos/uco-shot.jpg",
    summary: "A local AI agent that operates a real Mac — it sees the screen, plans out loud, waits for approval, then does the work inside real applications.",
    description: "Universal Computer Operator turns a plain-English request into real actions inside real macOS apps. Press ⌥Space and ask for anything: it reads the screen, narrates the plan it intends to follow, waits for explicit approval, and then carries the steps out — clicking, typing, and navigating real interfaces — with every destructive step reversible. It exposes five surfaces, each one keystroke away: the Operator Bar, a Suggest Orb that drafts what comes next from the context around the cursor, selection analysis, circular capture, and plain-English file cleanup. It runs entirely on-device with no account, API key, or subscription, so screen contents and documents never leave the machine.",
    tags: ["AI agent", "Local-first", "macOS", "Computer use", "Screen understanding"],
    downloads: [],
    testingFocus: "Whether the agent's plan matches what it actually does, whether approval gating catches every destructive step, and how reliably it drives real third-party apps.",
    testSteps: ["Launch the macOS build, then press ⌥Space", "Ask for a concrete multi-step task in a real app", "Read the narrated plan before approving — check it matches the request", "Approve and watch it execute inside the live application", "Trigger an undo and confirm the destructive step reverses cleanly"],
  },
  {
    id: "folio",
    title: "Folio",
    category: "Collaboration",
    status: "Live beta",
    image: "/photos/folio-shot.png",
    summary: "A focused collaborative document workspace — shared writing without the clutter of a full office suite.",
    description: "Folio is a calm, shared writing surface for small teams. It keeps owned and shared documents in one workspace, saves every change automatically, and imports existing .txt or .md drafts into clean documents. The design goal is deliberate restraint: the toolbar-heavy, feature-stuffed document editor is the thing it is reacting against, so the workspace stays legible and the writing stays the focus.",
    tags: ["Collaboration", "Documents", "Real-time", "Web app"],
    live: { label: "Open Folio", href: "https://folio-ajaia-docs.netlify.app" },
    downloads: [
      { label: "Open Folio", href: "https://folio-ajaia-docs.netlify.app" },
    ],
    testingFocus: "Import fidelity from .md/.txt, autosave reliability, and whether the owned/shared split stays clear as a workspace fills up.",
    testSteps: ["Open Folio and create a blank document", "Import an existing .md or .txt draft and check the formatting survived", "Edit and confirm changes save automatically without a save action", "Check the owned vs shared document split", "Assess whether the workspace stays calm as documents accumulate"],
  },
  {
    id: "entropy",
    title: "Entropy",
    category: "Audio plugin",
    status: "Working build · VST3 / AU",
    image: "/photos/entropy-shot.jpg",
    summary: "Real-time granular chaos engine with FFT spectral freeze, deep modulation, and a custom CRT/biohazard UI — runs as VST3, AU, and standalone.",
    description: "Entropy is a professional audio plugin built in C++ with JUCE 8 and CMake. It captures incoming audio into a circular buffer and sprays a cloud of windowed grains from a movable read position; Freeze locks the read window so the engine keeps emitting from a held moment. A separate STFT path (2048-point FFT, 75% overlap-add) holds the magnitude spectrum and resynthesizes a sustained glassy pad with evolving phase drift. The whole instrument is wrapped in a custom BiohazardLookAndFeel: procedural knob textures, a CRT power-on animation, scanline overlay, and routable per-knob modulation with trailing arcs.",
    tags: ["Audio plugin", "JUCE 8", "C++", "Granular DSP", "VST3 / AU"],
    repo: { label: "View source on GitHub", href: "https://github.com/armonon/mk-ultra" },
    downloads: [],
    testingFocus: "Load Entropy in a DAW as VST3/AU (or run standalone), feed it audio, and explore grain density, freeze, spectral freeze, modulation routing, and the CRT/biohazard UI.",
    testSteps: ["Build the plugin with CMake or load a packaged VST3/AU", "Insert it on an audio track and play a loop through it", "Engage Freeze and Spectral Freeze and sweep the grain controls", "Route modulation to a knob and watch the trailing mod arcs", "Capture a short render of a frozen, evolving texture"],
  },
  {
    id: "model-studio",
    title: "Photobooth Studio",
    category: "Commerce tool",
    status: "Live tool · free & offline",
    image: "/photos/photobooth-shot.jpg",
    summary: "Studio-grade product shots without the studio: on-device AI background removal plus a layered editor for composing mockups, all offline.",
    description: "Photobooth Studio gives an e-commerce seller studio-quality product imagery they own end to end. A local AI model lifts the garment off any backdrop in seconds — fully on-device, so nothing is ever uploaded — with white, soft-grey, or transparent output and batch ZIP export for a whole shoot. From there a layered editor works like a designer's canvas: brush, magic wand, and lasso cutouts, stacked and re-ordered layers with opacity, and text in any font, exported flattened. No account, no credits, no subscription.",
    tags: ["Commerce", "On-device AI", "Background removal", "Layered editing"],
    live: { label: "Open the app", href: "https://photoboothstudio-b6ac09.netlify.app" },
    repo: { label: "View source on GitHub", href: "https://github.com/armonon/photoboothstudio" },
    downloads: [
      { label: "Open Photobooth Studio", href: "https://photoboothstudio-b6ac09.netlify.app" },
    ],
    testingFocus: "Run a real shoot through it: batch background removal, hand-refine a tricky cutout, compose a layered mockup with text, and export.",
    testSteps: ["Open Photobooth Studio and drop in a folder of garment photos", "Run one-click background removal and download the batch as a ZIP", "Refine a tricky edge with the brush, magic wand, and lasso tools", "Compose a layered mockup — restack, resize, set opacity, add text", "Export the flattened result and check consistency across products"],
  },
  {
    id: "sattari-loop-doctor",
    title: "Sattari Loop Doctor",
    category: "Audio repair",
    status: "Interactive web demo",
    image: "/photos/auto-pitch-example.svg",
    summary: "Sample and loop repair lab for timing, pitch, transients, loudness, loop points, and export prep.",
    description: "Sattari Loop Doctor is the proposed producer utility for turning messy loops into production-ready assets. The Radar web version lets Armon test the workflow, proof language, repair checklist, and output expectations before deeper DSP/native/plugin work begins.",
    tags: ["Audio", "Loops", "Sample repair", "Sattari"],
    live: { label: "Launch interactive demo", href: "#/product-radar/software/sattari-loop-doctor" },
    downloads: [],
    testingFocus: "Validate whether the loop-intake, auto-detect, repair-plan, before/after, and export-checklist flow feels like a useful producer product before committing to deep DSP implementation.",
    testSteps: ["Read the web prototype flow", "Use the sample loop scenario as if you were preparing a real loop for a beat", "Check whether the repair categories cover the pain points", "Mark any missing controls before native/plugin work starts"],
    webPrototype: {
      title: "Loop repair web test",
      summary: "A browser-testable product flow for the future native/plugin loop-repair engine.",
      sampleInput: "Messy 4-bar vocal/synth loop · detected 92.3 BPM · likely F minor · late downbeat · uneven gain · click at loop seam",
      primaryOutput: "Clean 4-bar export plan: 92 BPM grid, F minor lock, -14 LUFS preview, crossfaded loop seam, transient-safe timing tighten, stems optional.",
      panels: [
        { label: "Auto detect", value: "BPM / key / downbeat", detail: "Shows tempo, key confidence, first downbeat, loop length, and warnings before repair." },
        { label: "Repair plan", value: "Timing + pitch + seam", detail: "Separates safe fixes from risky DSP so users understand what will change." },
        { label: "Before / after", value: "A/B checklist", detail: "Future web demo should play original vs cleaned preview and show artifact warnings." },
        { label: "Export", value: "Loop + stems + metadata", detail: "Exports clean WAV, optional stems, BPM/key metadata, and a test report." },
      ],
      actions: ["Add fake upload/intake UI", "Add before/after audio preview fixture", "Add repair score and artifact warning card", "Later connect real DSP engine"],
    },
  },
  {
    id: "midi-genius-sattari-arp-pro",
    title: "MIDI Genius / Sattari Arp Pro",
    category: "MIDI plugin",
    status: "Interactive web demo",
    image: "/photos/auto-pitch-example.svg",
    summary: "Chord-to-MIDI idea engine for arps, melodies, basslines, chord chops, drum patterns, groove, and MIDI export.",
    description: "MIDI Genius / Sattari Arp Pro turns simple notes or chords into usable producer parts that can drive any synth. The Radar web version tests pattern language, presets, performance macros, and MIDI-export expectations while the real AU/VST3 MIDI-effect direction stays native/plugin-first.",
    tags: ["MIDI", "Audio plugin", "Arpeggiator", "Sattari"],
    live: { label: "Launch interactive demo", href: "#/product-radar/software/midi-genius-sattari-arp-pro" },
    downloads: [],
    testingFocus: "Validate whether the product feels bigger than a normal arpeggiator: chords in, useful musical parts out, with exportable MIDI and genre-aware controls.",
    testSteps: ["Review the chord-to-pattern flow", "Check the macro controls and preset categories", "Decide which first 20 presets matter most", "Confirm the web page makes the future plugin easy to understand"],
    webPrototype: {
      title: "Chord-to-pattern web test",
      summary: "A clickable Radar flow for the future AU/VST3 MIDI-effect plugin.",
      sampleInput: "Input chord: Fm9 · style: dark bounce · rate: 1/16 · swing: 58% · energy: 72%",
      primaryOutput: "Generated part preview: root/fifth bass pulse, minor pentatonic top motif, velocity accents, 2-bar variation, drag-to-DAW MIDI planned.",
      panels: [
        { label: "Pattern engine", value: "Arp / melody / bass / drums", detail: "Lets users test what lanes should exist before plugin UI implementation." },
        { label: "Groove pocket", value: "Swing + humanize + ratchet", detail: "Explains how boring chords become producer-ready movement." },
        { label: "Preset browser", value: "20 starter styles", detail: "Trap bells, Afro swing, house plucks, synthwave, R&B, techno, cinematic pulse." },
        { label: "MIDI export", value: "Capture and drag", detail: "The web page defines the DAW behavior the native/plugin build needs to match." },
      ],
      actions: ["Add browser MIDI-pattern fixture", "Add preset cards", "Add MIDI download fixture", "Map final controls to JUCE plugin UI"],
    },
  },
  {
    id: "hookforge",
    title: "HookForge",
    category: "Songwriting tool",
    status: "Interactive web demo",
    image: "/photos/auto-pitch-example.svg",
    summary: "Hook idea machine for generating, mutating, auditioning, scoring, and exporting catchy MIDI/audio hook starters.",
    description: "HookForge is a controlled hook-generation workspace for producers and songwriters. It should create usable MIDI hooks, not locked black-box AI songs. The Radar web version tests the prompt controls, candidate cards, mutation workflow, and hook-scoring language.",
    tags: ["Songwriting", "MIDI", "Hooks", "Producer tools"],
    live: { label: "Launch interactive demo", href: "#/product-radar/software/hookforge" },
    downloads: [],
    testingFocus: "Test whether the browser flow helps a producer generate and choose hook directions quickly, with enough control to feel usable inside a real DAW workflow.",
    testSteps: ["Review the 10-hook generation concept", "Check the mutate actions", "Decide which hook types matter first", "List what must export as MIDI or audio for a real prototype"],
    webPrototype: {
      title: "Hook batch web test",
      summary: "A Radar prototype for generating and comparing controlled hook ideas.",
      sampleInput: "Key: A minor · BPM: 142 · vibe: hypnotic/dark · hook type: bell lead · range: narrow · repetition: high",
      primaryOutput: "10 hook cards planned with catchiness score, singability/range notes, mutation actions, and MIDI/audio export targets.",
      panels: [
        { label: "Generate", value: "10 candidate hooks", detail: "Shows several controlled options instead of one opaque AI output." },
        { label: "Mutate", value: "Darker / bouncier / simpler", detail: "Turns a promising idea into variations without losing ownership or control." },
        { label: "Score", value: "Catchy / singable / repeatable", detail: "Helps users choose what to keep, not just generate more noise." },
        { label: "Export", value: "MIDI + guide audio", detail: "The commercial wedge is DAW-usable output." },
      ],
      actions: ["Add 10-card generated-hook fixture", "Add mutation buttons", "Add MIDI export proof", "Later connect real phrase generator"],
    },
  },
  {
    id: "sample-library-brain",
    title: "Sample Library Brain",
    category: "Producer library",
    status: "Interactive web demo",
    image: "/photos/auto-pitch-example.svg",
    summary: "Private local sample-library search for BPM, key, instrument, mood, texture, similarity, crates, kits, and DAW drag/drop.",
    description: "Sample Library Brain is the local-first sample organizer for producers whose folders are chaos. The Radar web version tests the search, tag, smart-kit, similar-sound, and project-match UX before a native Mac app scans real folders.",
    tags: ["Samples", "Search", "Music production", "Local-first"],
    live: { label: "Launch interactive demo", href: "#/product-radar/software/sample-library-brain" },
    downloads: [],
    testingFocus: "Validate that the app's browser flow solves the real pain: finding the right sample fast without uploading a producer's private library.",
    testSteps: ["Review the library-search scenario", "Check if the auto-tags match how producers think", "Decide the first sample categories", "Flag privacy or drag/drop expectations for the native app"],
    webPrototype: {
      title: "Sample search web test",
      summary: "A browser version of the search and organization experience before local folder scanning exists.",
      sampleInput: "Search: dark 140 BPM vocal chops in F minor · library: 18,240 files · mode: project-compatible only",
      primaryOutput: "Ranked sample cards with BPM/key, instrument, mood tags, similar sounds, crate save, and DAW-drag target planned.",
      panels: [
        { label: "Auto tags", value: "BPM / key / instrument / mood", detail: "Defines the metadata the local scanner must generate." },
        { label: "Similarity", value: "Find more like this", detail: "Tests the highest-value search behavior for producers." },
        { label: "Smart kits", value: "Kick + snare + hats + perc", detail: "Turns search into ready-to-use drum kits." },
        { label: "Privacy", value: "Local-first", detail: "No private sample library should be uploaded for normal use." },
      ],
      actions: ["Add sample-card fixture", "Add smart-kit builder mock", "Add folder-scan permission copy", "Later build native scanner"],
    },
  },
  {
    id: "librarian-atlas-personal-os",
    title: "Librarian Atlas Personal OS",
    category: "Knowledge OS",
    status: "Interactive web demo",
    image: "/photos/librarian-example.svg",
    summary: "Private AI librarian for files, notes, projects, decisions, open loops, timelines, and source-cited answers.",
    description: "Librarian Atlas Personal OS is the broader software idea Armon asked about: a private local knowledge system that helps people find, understand, and recover context across their own documents. The Radar web version tests use cases for students, creators, founders, legal teams, families, and builders before local indexing work begins.",
    tags: ["Knowledge OS", "Local search", "Source citations", "Project memory"],
    live: { label: "Launch interactive demo", href: "#/product-radar/software/librarian-atlas-personal-os" },
    downloads: [],
    testingFocus: "Validate whether the product is understandable as a private AI librarian, not a generic chatbot, and which user segment should be the first wedge.",
    testSteps: ["Review the use-case panels", "Pick the most valuable first audience", "Check whether source citations and privacy boundaries are clear", "List the first folder types to index in a real Mac app"],
    webPrototype: {
      title: "Private knowledge web test",
      summary: "A web prototype for the future local-first file/project memory system.",
      sampleInput: "Question: what are all my active software ideas, what is blocked, and where are the source notes?",
      primaryOutput: "Source-cited answer with project cards, decisions, blockers, loose ends, and links back to files or notes.",
      panels: [
        { label: "Ask your archive", value: "Answers with sources", detail: "The product wins by citing real files, not guessing." },
        { label: "Project memory", value: "Decisions + timelines", detail: "Recovers why choices were made and where work stopped." },
        { label: "Open loops", value: "Todos + blockers", detail: "Finds what needs action across messy notes and folders." },
        { label: "Privacy", value: "Local-first index", detail: "Designed for personal files, sensitive docs, and opt-in exclusions." },
      ],
      actions: ["Add audience-specific demo routes", "Add cited-answer fixture", "Add local-folder permission copy", "Later build native indexer"],
    },
  },
  {
    id: "scenepilot-studio",
    title: "ScenePilot Studio",
    category: "Video editing",
    status: "Live tool · renders MP4",
    image: "/photos/scenepilot-shot.png",
    summary: "Beat-synced music video editor: drop in a song and a folder of clips, get back a graded, downbeat-locked montage rendered as an MP4.",
    description: "ScenePilot Studio cuts a finished music video without any timeline work. It detects the tempo of the track, cuts the montage locked to the downbeat, punches the camera on every hit, and applies a real-time GPU grade — exposure, bloom, chromatic aberration, vignette, and film grain, all beat-reactive — then renders the result to MP4. Everything runs on-device, so a creator's footage never leaves their machine, and a macOS build ships alongside the browser app.",
    tags: ["Video", "Creator tools", "Beat detection", "GPU rendering"],
    live: { label: "Open the Studio", href: "https://scenepilot.thecreatingco.com" },
    downloads: [
      { label: "Open the Studio", href: "https://scenepilot.thecreatingco.com" },
      { label: "Download the export proof MP4", href: "/downloads/scenepilot-export-proof-2026-05-23.mp4" },
      { label: "Download ScenePilot preview pack", href: "/downloads/auto-cut-preview-pack.zip" },
      { label: "Download export proof manifest", href: "/downloads/scenepilot-export-proof-2026-05-23-manifest.json" },
    ],
    testingFocus: "Render quality and beat accuracy: does the cut actually sit on the downbeat, does the grade hold up, and does the exported MP4 match what the live preview showed?",
    testSteps: ["Open the Studio and drop in a song plus a folder of clips", "Confirm the detected tempo matches the track", "Pick a look and watch the live GPU grade preview", "Render the MP4 and check the cuts land on the downbeat", "Compare the exported file against the in-browser preview"],
    webPrototype: {
      title: "Beat-cut render test",
      summary: "Song and clips in, graded beat-locked MP4 out — the whole pipeline runs in the browser.",
      sampleInput: "120 BPM track · 12 clips · Neon look · kaleidoscope + anamorphic streaks",
      primaryOutput: "A downbeat-locked, GPU-graded montage rendered to MP4, with zoom punches and speed ramps on the hits.",
      panels: [
        { label: "Tempo detection", value: "120 BPM · downbeat map", detail: "Drives every cut, camera move, and grade pulse in the edit." },
        { label: "Move toolkit", value: "Punch / ramp / strobe / whip", detail: "The moves a music video actually needs, synced to the beat." },
        { label: "Live grade", value: "GPU shader, beat-reactive", detail: "The preview panel is the same shader that renders the final file." },
        { label: "Export", value: "MP4, rendered locally", detail: "Media never leaves the machine — no upload, no queue." },
      ],
      actions: ["Expand the look library", "Add per-shot manual overrides", "Validate long-form renders", "Ship the macOS build broadly"],
    },
  },
  {
    id: "now-suite",
    title: "NOW Suite",
    category: "Identity platform",
    status: "Live preview",
    image: "/photos/digital-human-example.svg",
    summary: "Profile, identity, vault, avatar, and service hub direction for Armon's broader internet activity platform.",
    description: "NOW Suite is the platform layer for profiles, identity memory, vault-style private data, public profile surfaces, service navigation, and safe agent-assistance boundaries. Current work is preview/prototype and contract-backed rather than a production identity provider.",
    tags: ["Identity", "Profiles", "Platform"],
    live: { label: "Open NOW preview", href: "https://now-suite-preview.netlify.app" },
    downloads: [],
    testingFocus: "Check whether the profile/vault/identity flows make the platform thesis understandable while preserving privacy and approval boundaries.",
    testSteps: ["Open the NOW preview", "Review profile and vault surfaces", "Confirm private/public boundaries are clear", "Note what needs real auth/database approval before production positioning"],
  },
  {
    id: "market",
    title: "Market",
    category: "Marketplace platform",
    status: "Live preview",
    image: "/photos/sattari-screenshot.png",
    summary: "Universal marketplace search and tenant-ready seller/listing system powered by NOW profiles.",
    description: "Market is the first NOW service direction: universal marketplace search, tenant-specific marketplace surfaces, NOW-backed seller cards, listing readiness labels, saved items, and safe inquiry prototypes. Current copy keeps no-scraping, no-checkout, no-live-message, and no-partnership guardrails visible.",
    tags: ["Marketplace", "NOW", "Seller profiles"],
    live: { label: "Open Market preview", href: "https://now-suite-preview.netlify.app/market/" },
    downloads: [],
    testingFocus: "Evaluate listing/search clarity, tenant configuration, seller profile connection, and whether marketplace limitations are obvious before live connectors or checkout.",
    testSteps: ["Open the Market preview", "Try tenant/source/search filters", "Inspect a listing and seller card", "Confirm checkout, scraping, and external messaging are not implied as live"],
  },
  {
    id: "sattari-audio-suite",
    title: "Sattari Audio Suite",
    category: "Audio suite",
    status: "Live · installer + updater",
    image: "/photos/sattari-suite-shot.png",
    summary: "One-download Sattari Hub installer/updater with a Project Radar plugin-update feed; Auto Pitch 0.1.4 real-time correction ships through the feed for Apple Silicon Mac.",
    description: "Sattari Hub is the downloadable app for installing, updating, and hosting the Sattari Audio suite from one place. The packaged archive embeds the available AU/VST3/Standalone builds so any Apple Silicon Mac can run them without cloning the repo, and the updater-capable Hub reads a Project Radar feed so new plugin builds update without replacing the Hub. The roadmap to public release runs through notarization and DAW listening validation; current focus is install/update flow, Gatekeeper friction, DAW rescan behavior, and listening notes for Auto Pitch, VoxKey, StemDeck, and the other builds.",
    tags: ["Audio", "Installer", "AU / VST3", "Sattari"],
    downloads: [
      { label: "Download Sattari Hub 0.1.2 installer/updater alpha", href: "/downloads/sattari-hub-alpha-v0.1.2.tar.gz" },
      { label: "Download Sattari Audio Suite internal test pack", href: "/downloads/sattari-audio-suite-internal-test-pack-2026-05-25.zip" },
      { label: "Download StemDeck 0.4.3 standalone Mac app alpha", href: "/downloads/stemdeck-app-alpha-v0.4.3-djay-ui-reference.tar.gz" },
    ],
    testingFocus: "Installer/updater flow: download the Hub once on an Apple Silicon Mac, install/update the embedded or feed-delivered builds, rescan the DAW, and note anything to refine before public release.",
    testSteps: ["Download Sattari Hub 0.1.2", "Open Sattari Hub.app and allow Gatekeeper if prompted", "Install/update the available products from the Hub", "Restart or rescan Logic/Ableton for AU/VST3 visibility", "Note install flow, DAW scan behavior, and any UX refinements"],
  },
  {
    id: "stemdeck",
    title: "Sattari StemDeck",
    category: "Audio app",
    status: "Standalone Mac app",
    image: "/photos/stemdeck-shot.png",
    summary: "Standalone Sattari StemDeck Mac DJ app with four-column djay-inspired stem decks and a bottom pattern-arrangement recorder workspace.",
    description: "Sattari StemDeck v0.4.3 ships as its own Apple Silicon Mac application package: Sattari StemDeck.app at the top level, an install_app.sh helper for ~/Applications, the djay-inspired four-column live-mixer / pattern-arrangement UI, optional Demucs setup scripts, bundled Rubber Band/libsamplerate runtime dylibs, and Rubber Band-backed time/pitch processing. The bottom arrangement space is a fast capture surface today; a fully editable Ableton-style timeline is on the roadmap.",
    tags: ["Audio", "Standalone app", "DJ app", "macOS"],
    live: { label: "Open the StemDeck site", href: "https://stemdeck.thecreatingco.com" },
    downloads: [
      { label: "Open the StemDeck site", href: "https://stemdeck.thecreatingco.com" },
      { label: "Download StemDeck 0.4.3 standalone Mac app", href: "/downloads/stemdeck-app-alpha-v0.4.3-djay-ui-reference.tar.gz" },
    ],
    testingFocus: "Open the standalone Mac app, load known-BPM/key tracks or prepared stems, run the split live-mixer + arrangement-recorder workflow, and note install, audio, sync, recording, and UX refinements.",
    testSteps: ["Download the StemDeck 0.4.3 standalone Mac app alpha", "Unzip it and open Sattari StemDeck/Sattari StemDeck.app or run scripts/install_app.sh", "Allow the Gatekeeper prompt if macOS blocks first launch", "Load two known-BPM/key loops or songs", "Test deck playback, crossfader, beat/key controls, pads, and Record WAV", "Document drift, clicks, false key readings, crashes, missing app behavior, or arrangement-recorder confusion"],
  },
  {
    id: "auto-pitch",
    title: "Auto Pitch",
    category: "Audio plugin",
    status: "In development",
    image: "/photos/auto-pitch-example.svg",
    summary: "Sattari vocal-tuning plugin with auto key, adaptive song sections, and natural-to-hard correction modes.",
    description: "Auto Pitch is the lead Sattari audio software direction. The public download stays labeled as a preview pack while the actual product work continues toward installer packaging, DAW validation, natural/modern/hard correction modes, and real-user listening tests.",
    tags: ["Audio", "Music production", "Vocal tuning"],
    downloads: [
      { label: "Download Auto Pitch preview pack", href: "/downloads/auto-pitch-preview-pack.zip" },
    ],
    testingFocus: "Clarity of the product promise, expected controls, installer expectations, and vocal workflow needs before DAW beta testing.",
    testSteps: ["Download the preview pack", "Review the tuning workflow direction", "Note which controls are mandatory for singers/producers", "Use those notes to prioritize the first installable build"],
  },
  {
    id: "botanica-lab",
    title: "Botanica Lab",
    category: "Research app",
    status: "Live app",
    image: "/photos/botanica-shot.png",
    summary: "Botanical R&D surface for evidence-aware formula exploration and wellness-product concept work.",
    description: "Botanica Lab turns botanical/product research into a safer exploration interface. Testing should focus on source clarity, claim boundaries, formula-card usefulness, and whether the app helps generate reviewable ideas without overclaiming medical outcomes.",
    tags: ["Botanical R&D", "Research", "Compliance-aware UX"],
    live: { label: "Open Botanica Lab", href: "https://botanica-lab.netlify.app/" },
    repo: { label: "Source repo", href: "https://github.com/armonon/botanica-lab" },
    downloads: [
      { label: "Download Botanica test pack", href: "/downloads/botanica-lab-test-pack.zip" },
    ],
    testingFocus: "Source trails, safety wording, formula-card structure, and whether a reviewer can quickly separate ideas from claims.",
    testSteps: ["Open the live lab", "Review the research/formula surfaces", "Download the test pack", "Flag any copy that sounds like a consumer medical claim"],
  },
  {
    id: "trader-oracle",
    title: "Trader Oracle",
    category: "Market research",
    status: "Live beta",
    image: "/photos/trader-shot.png",
    summary: "Watchlist and catalyst dashboard for educational trade-prep scenarios with risk/invalidation framing.",
    description: "Trader Oracle is a research dashboard for ticker exploration, watchlists, market pulse, and scenario framing. It should be tested for speed, source visibility, risk language, and whether users can understand that it is research/education rather than personalized financial advice.",
    tags: ["Markets", "Research", "Risk framing"],
    live: { label: "Open Trader Oracle", href: "https://armon-trader.netlify.app" },
    downloads: [
      { label: "Download Trader Oracle test pack", href: "/downloads/trader-oracle-test-pack.zip" },
    ],
    testingFocus: "Watchlist flow, news/catalyst clarity, risk/invalidation copy, and speed of forming a research-only setup.",
    testSteps: ["Open the live dashboard", "Search or review a ticker/watchlist", "Check that risk and invalidation are visible", "Download the test pack and record missing source trails"],
  },
  {
    id: "librarian-atlas",
    title: "Librarian Book Atlas",
    category: "Book atlas",
    status: "Live app",
    image: "/photos/librarian-shot.jpg",
    summary: "Provenance-first public-domain book atlas for discovery, source inspection, and reading paths.",
    description: "Librarian Book Atlas is the existing trust/provenance software lane: a way to discover books, inspect source claims, follow reading paths, and keep public-domain availability grounded in evidence. It now sits next to the broader Librarian Atlas Personal OS idea, which is the private AI librarian for all personal files and projects.",
    tags: ["Books", "Provenance", "Research"],
    live: { label: "Open Librarian Book Atlas", href: "https://librarian.thecreatingco.com" },
    downloads: [
      { label: "Download Librarian test pack", href: "/downloads/librarian-atlas-test-pack.zip" },
    ],
    testingFocus: "Book discovery, source inspection, authority links, and clarity of public-domain/readability claims.",
    testSteps: ["Open the atlas", "Search for a book or source path", "Check whether claims are backed by links", "Download the test pack and note where deeper detail pages are needed"],
  },
  {
    id: "digital-human-mvp",
    title: "Digital Human MVP",
    category: "AI avatar",
    status: "Live demo",
    image: "/photos/digital-human-shot.jpg",
    summary: "Browser avatar/chat experience with viseme-driven lip sync and real-time GLB rendering, with a path to hosted neural rendering.",
    description: "Digital Human is a working avatar-chat experience: real-time GLB rendering in the browser, viseme-driven lip sync, and generated replies. It is a solid foundation for persistent AI identity, with hosted neural/photo rendering on the roadmap.",
    tags: ["AI avatar", "Chat", "Animation"],
    live: { label: "Open Digital Human MVP", href: "https://digital-human-mvp.onrender.com" },
    downloads: [
      { label: "Download Digital Human test pack", href: "/downloads/digital-human-mvp-test-pack.zip" },
    ],
    testingFocus: "Chat response reliability, avatar readiness, viseme/animation quality, and honest fallback-vs-neural positioning.",
    testSteps: ["Open the live MVP", "Try a short chat prompt", "Watch avatar/viseme behavior", "Download the test pack and log blockers before neural/photo positioning"],
  },
  {
    id: "product-radar",
    title: "Project Radar Directory",
    category: "Portfolio OS",
    status: "Live",
    image: "/photos/nasiri-screenshot.png",
    summary: "The portfolio command center for software pages, downloadables, testing links, and product-status clarity.",
    description: "Project Radar is being upgraded from a roadmap into the software testing directory: every serious software project gets a clear card, a full page, live links when available, downloadable test/preview packs, and practical test steps.",
    tags: ["Portfolio", "Directory", "Testing hub"],
    live: { label: "Open portfolio home", href: "#" },
    downloads: [
      { label: "Download Project Radar test pack", href: "/downloads/project-radar-test-pack.zip" },
    ],
    testingFocus: "Can someone quickly find every product, understand what it is, download the right pack, and open a focused test page?",
    testSteps: ["Scan the software directory", "Open three product pages", "Download one pack", "Check whether the status language makes testing easier"],
  },
];

export const radarEvidenceLedger: RadarEvidenceItem[] = [
  {
    priority: 1,
    projectName: "Universal Computer Operator",
    softwareId: "universal-computer-operator",
    readinessScore: 7.5,
    promise: "An AI that actually operates your Mac — ask in plain English, it sees the screen, plans, asks permission, then does the work inside real apps.",
    latestProof: "Working macOS build running fully on-device with no account or API key; five keystroke surfaces ship, and destructive steps are approval-gated and reversible.",
    blocker: "Next: a notarized installer, wider verified third-party app coverage, and a recorded end-to-end task demo.",
    nextStep: "Publish a notarized build and a screen-recorded multi-step task running inside a real application.",
    monetization: "Free local core with a paid Pro tier for extended app integrations and team deployment.",
  },
  {
    priority: 2,
    projectName: "Entropy",
    softwareId: "entropy",
    readinessScore: 8,
    promise: "A real-time granular chaos engine — grain clouds, FFT spectral freeze, deep modulation — that runs as a VST3/AU/standalone plugin in any major DAW.",
    latestProof: "Working build in C++/JUCE 8 with grain engine, STFT spectral-freeze path, routable modulation, and a fully custom BiohazardLookAndFeel; source is public on GitHub.",
    blocker: "Next: packaged/notarized installers and a short demo reel showing freeze, spectral freeze, and modulation in a DAW.",
    nextStep: "Render a 30-second demo reel and publish signed VST3/AU builds for download.",
    monetization: "Paid Sattari Audio plugin with preset packs and a creative-suite bundle.",
  },
  {
    priority: 3,
    projectName: "Photobooth Studio",
    softwareId: "model-studio",
    readinessScore: 8,
    promise: "Studio-grade product photography a seller owns end to end — background removal and layered mockup composition, free and fully offline.",
    latestProof: "Live and public: on-device AI background removal with batch ZIP export, brush/wand/lasso hand cutouts, a layered editor with text and opacity, and a Mac download. Source is public on GitHub.",
    blocker: "Next: a starter library of garment/mannequin plates and a saved-preset workflow for repeat shoots.",
    nextStep: "Ship a starter template library and per-brand presets so a repeat shoot is one click.",
    monetization: "Owned mockup tool for sellers — paid template packs, white-label tenants, and a Pro export tier.",
  },
  {
    priority: 4,
    projectName: "ScenePilot Studio",
    softwareId: "scenepilot-studio",
    readinessScore: 7.8,
    promise: "Drop in a song and a folder of clips and get back a finished, graded, beat-locked music video — no timeline work.",
    latestProof: "Live and rendering: tempo detection drives downbeat-locked cuts, camera punches, speed ramps and strobes, with a real-time GPU grade and an MP4 rendered in-browser. A macOS build ships alongside the web app.",
    blocker: "Next: per-shot manual overrides, a wider look/preset library, and render validation at longer durations and higher clip counts.",
    nextStep: "Add per-shot override controls and expand the look library, then validate long-form renders.",
    monetization: "Free core render with paid look packs, longer exports, and a Pro desktop tier.",
  },
  {
    priority: 5,
    projectName: "Folio",
    softwareId: "folio",
    readinessScore: 5,
    promise: "A calm shared writing workspace for small teams — collaborative documents without the clutter of a full office suite.",
    latestProof: "Live beta with an owned/shared workspace split, automatic saving, and .txt/.md import into clean documents.",
    blocker: "Next: real-time multi-user presence and editing, plus comments and sharing permissions.",
    nextStep: "Ship live multi-user editing with presence, then comments and per-document permissions.",
    monetization: "Per-seat team plan with a free single-user tier.",
  },
  {
    priority: 2,
    projectName: "Sattari Loop Doctor",
    softwareId: "sattari-loop-doctor",
    readinessScore: 1.8,
    promise: "Turn messy loops into production-ready samples by repairing timing, pitch/key, loop seams, transients, loudness, and export metadata.",
    latestProof: "Interactive web demo exists with loop type, BPM, key, timing, stem-split controls, generated repair plan, score, run path, and downloadable test artifact.",
    blocker: "Next: wire one real before/after audio fixture and an artifact-warning card into the live demo.",
    nextStep: "Replace the mock plan with one real before/after audio fixture and artifact-warning card.",
    monetization: "Paid Sattari Audio desktop/plugin utility, sample-pack cleanup tier, and producer-suite bundle.",
  },
  {
    priority: 3,
    projectName: "MIDI Genius / Sattari Arp Pro",
    softwareId: "midi-genius-sattari-arp-pro",
    readinessScore: 2.2,
    promise: "Convert simple chord input into usable arps, melodies, basslines, chord chops, drum patterns, and exportable MIDI.",
    latestProof: "Interactive web demo exists with chord/style/energy/swing/bass-lane controls, generated pattern plan, score, run path, and downloadable test artifact; prior Sattari Arp work established a native/plugin direction.",
    blocker: "Next: real in-browser MIDI generation, a finalized preset list, and the AU/VST3 packaging path.",
    nextStep: "Add one real generated-pattern fixture and downloadable .mid proof inside the interactive web demo.",
    monetization: "Paid Sattari MIDI plugin, preset packs, producer bundle, and future pattern-pack marketplace.",
  },
  {
    priority: 4,
    projectName: "HookForge",
    softwareId: "hookforge",
    readinessScore: 1.6,
    promise: "Generate, mutate, score, audition, and export controlled hook ideas as DAW-usable MIDI/audio starters.",
    latestProof: "Interactive web demo exists with key/BPM/vibe/hook-type controls, generated hook direction, scoring, mutation/export cards, run path, and downloadable test artifact.",
    blocker: "Next: a real phrase generator with MIDI export and in-browser audio audition.",
    nextStep: "Create a real 10-hook candidate fixture with scores and mutation buttons, then add MIDI/audio export artifacts.",
    monetization: "Paid songwriting/producers tool, hook packs, Sattari creative-suite upsell, and DAW plugin tier.",
  },
  {
    priority: 5,
    projectName: "Sample Library Brain",
    softwareId: "sample-library-brain",
    readinessScore: 1.7,
    promise: "Make a producer's local sample folders searchable by BPM, key, instrument, mood, texture, similarity, smart kits, and DAW workflow.",
    latestProof: "Interactive web demo exists with search, BPM/key/category/kit controls, generated sample cards, project-fit scoring, run path, and downloadable test artifact.",
    blocker: "Needs local scanner, audio metadata extraction, similarity index, and native file/DAW drag-drop behavior.",
    nextStep: "Replace mock cards with a tiny real fixture database, filters, smart-kit output, and local-first permission copy.",
    monetization: "Paid Mac app, pro library tier, producer-suite bundle, and sample-pack organization services.",
  },
  {
    priority: 6,
    projectName: "Librarian Atlas Personal OS",
    softwareId: "librarian-atlas-personal-os",
    readinessScore: 1.9,
    promise: "Private AI librarian for personal files, notes, projects, decisions, open loops, timelines, and source-cited answers.",
    latestProof: "Use-case catalog and interactive web demo exist with question/audience/depth/open-loop controls, cited-answer-style output, timeline/open-loop cards, and downloadable test artifact.",
    blocker: "Needs first wedge audience, local folder indexer, citation engine, privacy/exclusion controls, and source-trust model.",
    nextStep: "Replace the mock answer with one real cited-answer fixture over project/software notes and decide first wedge: builders, students, creators, or teams.",
    monetization: "Paid local Mac app, pro/team knowledge OS, research-workspace tier, and private project-memory tool.",
  },
  {
    priority: 7,
    projectName: "NOW Suite auth/database/profile foundation",
    softwareId: "now-suite",
    readinessScore: 3,
    promise: "Provide the identity, profile, private vault, and service foundation for the product ecosystem.",
    latestProof: "Preview is live; fixture-safe staging smoke/runbook exists for auth/profile boundaries.",
    blocker: "Real auth/database/profile ownership needs approved provider, staging database, and secrets handling.",
    nextStep: "Refresh the fixture-mode staging smoke and attach the exact pass/fail output to the ledger.",
    monetization: "Account layer for paid NOW services, Market seller profiles, premium profiles, and subscriptions.",
  },
  {
    priority: 8,
    projectName: "Project Radar Directory",
    softwareId: "product-radar",
    readinessScore: 7,
    promise: "Give every serious application one truthful test page with status, proof, blockers, and next steps.",
    latestProof: "Live software directory, test pages, preview packs, and internal evidence ledger are active.",
    blocker: "More evidence fields still need generated sync from wiki/repo/deploy checks instead of manual copy.",
    nextStep: "Turn this evidence ledger into generated Radar input with proof paths, blockers, and readiness scores.",
    monetization: "Portfolio operating system for product conversion, services, and future reusable command-center tooling.",
  },
  {
    priority: 9,
    projectName: "Auto Pitch",
    softwareId: "auto-pitch",
    readinessScore: 3.5,
    promise: "Help singers and producers tune vocals with auto key, adaptive sections, and natural-to-hard correction.",
    latestProof: "Generated vocal-ish source/corrected/guide WAVs exist for internal listening review.",
    blocker: "Needs real vocal A/B listening tests, DAW validation, and an installer path.",
    nextStep: "Create one A/B listening pack with source, natural, modern, hard, and adapt outputs plus a score sheet.",
    monetization: "Paid Sattari Audio plugin/standalone app with presets, upgrades, and creator bundles.",
  },
  {
    priority: 12,
    projectName: "Market seller profile/listing flow",
    softwareId: "market",
    readinessScore: 3,
    promise: "Let sellers present profile-backed listings with clear source/readiness labels before checkout.",
    latestProof: "NOW Suite Market preview and browser smoke screenshot are live/recorded.",
    blocker: "No live checkout, scraping, marketplace feed, or external seller/buyer messaging until approved.",
    nextStep: "Add a seller profile/listing fixture smoke: listing card → seller profile → saved item/inquiry placeholder.",
    monetization: "Seller subscriptions, listing boosts, transaction fees after compliance, and paid tenant marketplaces.",
  },
  {
    priority: 13,
    projectName: "Sattari StemDeck",
    softwareId: "stemdeck",
    readinessScore: 4.5,
    promise: "Give producers and performers a standalone four-deck stem playback/remix DJ app with an arrangement recorder, plus future plugin integration.",
    latestProof: "StemDeck v0.4.3 standalone Mac app alpha is packaged/downloadable with Sattari StemDeck.app at the top level; validation passed standalone build, bundled dylib/no-/opt-homebrew runtime check, codesign strict verify, 6-second launch smoke, granular render contract, Rubber Band time/pitch benchmark, and architecture contract.",
    blocker: "Next: app-session/listening validation with known BPM/key material, a bundled stem-separation option, notarization, and a fully editable arrangement timeline.",
    nextStep: "Install/open the standalone app package from Project Radar and run the app-first listening matrix for launch friction, sync drift, LiveKey accuracy, key-shift artifacts, optional Demucs stem-cache generation, recording, and arrangement-recorder UX.",
    monetization: "Paid standalone Sattari Audio DJ app, creator bundle, future plugin bridge, and sample/stem ecosystem.",
  },
  {
    priority: 14,
    projectName: "Botanica Lab",
    softwareId: "botanica-lab",
    readinessScore: 5.5,
    promise: "Turn botanical research into evidence-aware formula/concept cards with safety and review status.",
    latestProof: "Live concept app and public source repo are verified; test pack is listed in Product Radar.",
    blocker: "Consumer-facing claims require review; formula cards need citations, safety flags, and source strength.",
    nextStep: "Add one formula-card fixture with citations, safety flags, source strength, and claims-review status.",
    monetization: "Internal MNR R&D engine, then paid formulation workspace or compliance-aware content tool.",
  },
  {
    priority: 15,
    projectName: "Trader Oracle",
    softwareId: "trader-oracle",
    readinessScore: 5,
    promise: "Convert watchlists, market news, and catalysts into research-only setups with risk and invalidation.",
    latestProof: "Live beta dashboard and weekday watchlist/research automation are active.",
    blocker: "Needs stronger source trails, risk/invalidation display, and a watch/avoid board.",
    nextStep: "Add one ticker research card fixture with source links, risk note, invalidation point, and research-only label.",
    monetization: "Research dashboard subscription, premium watchlist tools, and educational market-intelligence reports.",
  },
  {
    priority: 16,
    projectName: "Librarian Atlas",
    softwareId: "librarian-atlas",
    readinessScore: 4.5,
    promise: "Help readers discover public-domain books and inspect the provenance behind source/readability claims.",
    latestProof: "Live prototype plus local SQLite/provenance backend artifacts and test pack.",
    blocker: "Needs richer book detail/source-inspection routes and provenance confidence on important claims.",
    nextStep: "Add or verify one book detail proof with source link, public-domain confidence, and reading-path link.",
    monetization: "Premium research library, curated reading paths, source API, and trust layer for Botanica/Trader.",
  },
];

export const radarMetrics = [
  { value: String(radarLanes.length), label: "product lines" },
  { value: String(radarSoftwareProjects.length), label: "products" },
  { value: String(radarSoftwareProjects.reduce((sum, project) => sum + project.downloads.length, 0)), label: "downloads" },
  { value: String(radarEvidenceLedger.length), label: "ranked products" },
];

export const radarOpportunities = [
  "Answer one question fast for every product: what's live, what's proven, and what ships next.",
  "Give every serious product an interactive demo you can try in the browser before installing anything.",
  "Back each product's status with real proof — a live link, export, demo video, or working build.",
  "Lead with working software: live apps, plugins, and tools over slideware.",
  "Keep regulated lanes safe: Market avoids checkout/scraping claims, Trader stays research-only, and Botanica carries citations and safety labels.",
];

export const radarNextBuildSteps = [
  { title: "ScenePilot rendered export", body: "One-click beat-locked MP4 rendering with a live GPU grade — running in the browser and on macOS.", state: "Shipped" },
  { title: "Photobooth Studio on-device AI", body: "Local background removal with batch ZIP export, hand-refine cutout tools, and a layered editor with text.", state: "Shipped" },
  { title: "Operator app coverage", body: "Broaden the set of macOS applications the agent drives end to end, and publish a notarized installer.", state: "Now" },
  { title: "Interactive demos → live output", body: "Every product has an interactive demo; next is wiring real audio, MIDI, search, and cited-answer output into each one.", state: "Now" },
  { title: "MIDI Genius export", body: "Generate real MIDI in the browser with downloadable .mid output, then map it to the Sattari Arp Pro plugin.", state: "Now" },
  { title: "Folio live collaboration", body: "Add real-time multi-user presence and editing, then comments and per-document permissions.", state: "Next" },
  { title: "Signed audio builds", body: "Publish notarized installers for Entropy, Auto Pitch, and StemDeck so any Mac can run them in seconds.", state: "Next" },
  { title: "Safety-first by default", body: "Market, Trader, and Botanica ship with guardrails: no checkout/scraping, research-only, and cited, safety-labeled claims.", state: "Always" },
];

export const radarIdeaFeed = [
  {
    name: "Local-first AI",
    theme: "The AI runs on your machine, not someone else's server",
    mvp: "Universal Computer Operator, Photobooth Studio, and ScenePilot all do their heavy work on-device — no account, no API key, and nothing uploaded.",
  },
  {
    name: "Interactive product demos",
    theme: "Every product is testable in the browser before you install",
    mvp: "Loop Doctor, MIDI Genius, HookForge, Sample Library Brain, ScenePilot, and Librarian each ship a try-it-now demo.",
  },
  {
    name: "Product Radar OS",
    theme: "One command center for every live product",
    mvp: "Each product shows its live link, latest proof, roadmap, and revenue path in one ranked board.",
  },
  {
    name: "Proof ledger",
    theme: "Every product status is backed by real evidence",
    mvp: "Track the live link, latest proof, next roadmap milestone, and readiness for each product.",
  },
];

export type DirectoryEntry = {
  name: string;
  blurb: string;
  group: "Products" | "Client & business" | "Brand & creative" | "Code";
  stack?: string;
  live?: string;
  repo?: string;
};

export const radarDirectoryGroups = ["Products", "Client & business", "Brand & creative", "Code"] as const;

/**
 * Every shipped project, live-verified. Dead deploys and duplicate
 * deploys of the same app are deliberately excluded.
 */
export const radarDirectory: DirectoryEntry[] = [
  // ---- Products ----
  {
    name: "thecreateco",
    blurb: "Independent creative software studio I founded — the Momentium Suite (Form, Luma, StemDeck, ScenePilot) plus Ghost Studio, Librarian, Reclaim and Bounce.",
    group: "Products",
    stack: "Studio · web alphas · native in development",
    live: "https://thecreatingco.com",
  },
  {
    name: "Reclaim",
    blurb: "Read-only browser companion for reviewing files, spotting identical copies and keeping the evidence. Part of thecreateco.",
    group: "Products",
    stack: "Browser · file review",
    live: "https://reclaim.thecreatingco.com",
  },
  {
    name: "Ghost Studio",
    blurb: "Bring in two photos and explore a garment from every side. Part of thecreateco.",
    group: "Products",
    stack: "Web studio · garment imaging",
    live: "https://ghost.thecreatingco.com",
  },
  {
    name: "Momentous",
    blurb: "Two-sided directory: apps built in-house on one side, independent storefronts on the other. Each shop keeps its own checkout.",
    group: "Products",
    stack: "React · TypeScript · directory platform",
    live: "https://momentous-store.netlify.app",
  },
  {
    name: "Universal Computer Operator",
    blurb: "A local AI agent that operates macOS — sees the screen, plans, asks approval, then acts inside real apps.",
    group: "Products",
    stack: "AI agent · macOS · local-first",
  },
  {
    name: "ScenePilot Studio",
    blurb: "Beat-synced music video editor: tempo detection, downbeat-locked cuts, GPU grade, MP4 rendered in-browser.",
    group: "Products",
    stack: "TypeScript · WebGL · Web Audio",
    live: "https://scenepilot.thecreatingco.com",
  },
  {
    name: "Photobooth Studio",
    blurb: "On-device AI background removal plus a layered mockup editor. Free, offline, nothing uploaded.",
    group: "Products",
    stack: "TypeScript · Canvas · on-device AI",
    live: "https://photoboothstudio-b6ac09.netlify.app",
    repo: "https://github.com/armonon/photoboothstudio",
  },
  {
    name: "Entropy",
    blurb: "Real-time granular chaos engine with FFT spectral freeze — VST3, AU, and standalone.",
    group: "Products",
    stack: "C++ · JUCE 8 · real-time DSP",
    repo: "https://github.com/armonon/mk-ultra",
  },
  {
    name: "Luma Studio",
    blurb: "Native Photoshop-class editor in Rust — layer focus, multi-pass blending, capture brushes, branching history, and editable AI.",
    group: "Products",
    stack: "Rust · wgpu · ONNX Runtime",
    live: "https://luma.thecreatingco.com",
    repo: "https://github.com/armonon/sweet-suite",
  },
  {
    name: "Form Studio",
    blurb: "Precision CAD and garment design — describe a part in plain language, get exact OpenCASCADE B-Rep geometry you can still edit.",
    group: "Products",
    stack: "OpenCASCADE · B-Rep · native + web",
    live: "https://form.thecreatingco.com",
  },
  {
    name: "StemDeck",
    blurb: "Turns live sets into editable productions — four decks, stems, isolated plug-ins, retrospective capture, take comping, and arrangement.",
    group: "Products",
    stack: "C++ · JUCE · macOS",
    live: "https://stemdeck.thecreatingco.com",
  },
  {
    name: "Bounce",
    blurb: "A minimalist local music player for the files you own — macOS and iOS from one shared C++ core.",
    group: "Products",
    stack: "C++ · JUCE 8 · macOS/iOS",
    live: "https://bounce.thecreatingco.com",
  },
  {
    name: "Sattari Audio",
    blurb: "The plugin suite for Mac — installer and update feed covering Entropy, Auto Pitch, and StemDeck.",
    group: "Products",
    stack: "C++ · JUCE · AU/VST3",
    live: "https://sattari-audio-suite.netlify.app",
  },
  {
    name: "Librarian",
    blurb: "Provenance-first atlas for public-domain books, built around citations and verifiable sources.",
    group: "Products",
    stack: "JavaScript · search · open data",
    live: "https://librarian.thecreatingco.com",
    repo: "https://github.com/armonon/librarian",
  },
  {
    name: "Folio",
    blurb: "A calm shared writing workspace — collaborative documents without the office-suite clutter.",
    group: "Products",
    stack: "TypeScript · real-time",
    live: "https://folio-ajaia-docs.netlify.app",
  },
  {
    name: "Botanica Lab",
    blurb: "Botanical R&D lab — structured plant research with citations and safety labelling.",
    group: "Products",
    stack: "JavaScript · research data",
    live: "https://botanica-lab.netlify.app",
    repo: "https://github.com/armonon/botanica-lab",
  },
  {
    name: "Trader Oracle",
    blurb: "Watchlist intelligence lab — research-only market signal tooling, no execution.",
    group: "Products",
    stack: "Python · data dashboards",
    live: "https://armon-trader.netlify.app",
  },
  {
    name: "NOW Suite",
    blurb: "Identity, auth, and profile foundation for a multi-product account layer.",
    group: "Products",
    stack: "TypeScript · auth · database",
    live: "https://now-suite-preview.netlify.app",
  },
  {
    name: "Spiritual Search",
    blurb: "Semantic search across spiritual and philosophical texts.",
    group: "Products",
    stack: "Python · semantic search",
    live: "https://spiritual-search-armon.netlify.app",
    repo: "https://github.com/armonon/Spiritual-Search",
  },

  // ---- Client & business ----
  {
    name: "Hamdam Care",
    blurb: "Private caregiving service in Woodland Hills — service positioning, trust signals, and lead capture.",
    group: "Client & business",
    stack: "Client site",
    live: "https://myhamdam.com",
  },
  {
    name: "The Nasiri Team",
    blurb: "Real estate platform with live property listings, agent profiles, and enquiry flows.",
    group: "Client & business",
    stack: "React · listings",
    live: "https://nasiriteam.netlify.app",
  },
  {
    name: "Sattari Music",
    blurb: "Instruments, gear, and local music services — product-led storefront for a niche audience.",
    group: "Client & business",
    stack: "React · Stripe · e-commerce",
    live: "https://sattarimusic.com",
  },
  {
    name: "Softech Digital Studio",
    blurb: "Websites, applications, and digital systems — studio positioning and service surface.",
    group: "Client & business",
    stack: "Business site",
    live: "https://softech-digital-studio.netlify.app",
  },
  {
    name: "HealthCore",
    blurb: "Outpatient healthcare clinic network — locations, services, and patient information.",
    group: "Client & business",
    stack: "Static site",
    live: "https://armonon.github.io/healthcore-public-website",
    repo: "https://github.com/armonon/healthcore-public-website",
  },

  // ---- Brand & creative ----
  {
    name: "BREAKTHYRULE · The Codex",
    blurb: "The brand's editorial codex — the current flagship surface for the label.",
    group: "Brand & creative",
    stack: "Brand site",
    live: "https://breakthyrule-co.netlify.app",
  },
  {
    name: "Break Thy Rule — Shop",
    blurb: "Drop-based storefront for the clothing label.",
    group: "Brand & creative",
    stack: "E-commerce",
    live: "https://break-thy-rule.netlify.app",
  },
  {
    name: "The Jazz Experience",
    blurb: "Event and venue site for a live jazz series.",
    group: "Brand & creative",
    stack: "TypeScript",
    live: "https://jazzclub.netlify.app",
    repo: "https://github.com/armonon/jazzclub",
  },
  {
    name: "Sprouting Wonder",
    blurb: "Somatic wellness practice — “come back to your body” brand and booking surface.",
    group: "Brand & creative",
    stack: "Brand site",
    live: "https://sprouting-wonder.netlify.app",
  },
  {
    name: "SoulSignal · The Living Library",
    blurb: "News and education surface for a spiritual media project.",
    group: "Brand & creative",
    stack: "Content platform",
    live: "https://soulsignal-news-education.netlify.app",
  },
  {
    name: "MNR — Spirit Coins",
    blurb: "Eighty-eight hand-laid mandalas printed raw onto natural cloth — Volume One.",
    group: "Brand & creative",
    stack: "Art release",
    live: "https://mnr-spirit-coins.netlify.app",
  },

  // ---- Code ----
  {
    name: "Talk to the Machine",
    blurb: "Observable AI chat interface — streaming inference with the reasoning surfaced rather than hidden.",
    group: "Code",
    stack: "TypeScript · Groq · Llama 3",
    repo: "https://github.com/armonon/talk-to-the-machine",
  },
  {
    name: "SWEET",
    blurb: "A three-app creative suite — visual, video, and audio — on a shared Rust core.",
    group: "Code",
    stack: "Rust",
    repo: "https://github.com/armonon/sweet-suite",
  },
  {
    name: "Cinema Seat Manager",
    blurb: "Seat reservation and venue management with real-time seat state.",
    group: "Code",
    stack: "TypeScript",
    repo: "https://github.com/armonon/cinema-seat-manager",
  },
  {
    name: "Maison Lumière",
    blurb: "E-commerce storefront build.",
    group: "Code",
    stack: "HTML · CSS",
    repo: "https://github.com/armonon/maison-lumiere-ecommerce",
  },
  {
    name: "AgentHub Admin Panel",
    blurb: "Admin console for managing AI agent configurations and runs.",
    group: "Code",
    stack: "HTML · dashboards",
    repo: "https://github.com/armonon/agenthub-admin-panel",
  },
  {
    name: "Influencer Dashboard",
    blurb: "Campaign and creator performance dashboard.",
    group: "Code",
    stack: "HTML · dashboards",
    repo: "https://github.com/armonon/influencer-dashboard",
  },
  {
    name: "Milk Room",
    blurb: "Creative studio application.",
    group: "Code",
    stack: "JavaScript",
    repo: "https://github.com/armonon/milkroomapp",
  },
];
