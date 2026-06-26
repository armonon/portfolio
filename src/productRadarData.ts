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
    id: "sattari-audio",
    icon: "🥁",
    title: "Sattari Audio",
    status: "Hub alpha downloadable",
    phase: "Installer/updater alpha",
    readiness: 46,
    accent: "from-orange-500/30 via-amber-500/20 to-yellow-500/10",
    summary: "Music tools and Sattari-branded audio products now have a self-contained Sattari Hub plus a standalone StemDeck Mac DJ app alpha for Apple Silicon Mac testing.",
    bullets: ["Sattari Hub 0.1.2 internal alpha download is available", "StemDeck 0.4.3 is packaged as its own standalone Mac DJ app alpha with the screenshot-inspired four-column UI", "Auto Pitch 0.1.4 real correction fix is available through the Hub update feed; real DAW/listening validation is still required"],
    nextAction: "Download either Sattari Hub 0.1.2 or the standalone StemDeck 0.4.3 app alpha from Product Radar on an Apple Silicon Mac, open/install the app, then record install/listening/UX notes.",
    blocker: "Hub and StemDeck are self-contained but still internal alpha: not notarized, not public/sale-ready, Apple Silicon Mac only, and audio quality still needs real listening validation.",
    primaryLink: { label: "Download Sattari Hub 0.1.2 alpha", href: "/downloads/sattari-hub-alpha-v0.1.2.tar.gz" },
    secondaryLink: { label: "Sattari site", href: "https://sattari.netlify.app" },
    detail: {
      eyebrow: "Audio product lane",
      description: "Sattari Audio is the lane for Armon's music tools: tuning, drum/audio utilities, and installable creative plugins. Sattari Hub is now available as a self-contained internal alpha download that acts as the installer/updater surface for the suite. The page keeps the status honest: internal-alpha only until notarization, DAW import/listening checks, real vocal corpus tests, safe-volume UX proof, installer docs, and user validation pass.",
      images: [
        { src: "/photos/auto-pitch-example.svg", alt: "Auto Pitch interface concept", caption: "Auto Pitch lead product direction" },
        { src: "/photos/sattari-screenshot.png", alt: "Sattari website screenshot", caption: "Sattari public brand surface" },
      ],
      downloads: [
        { label: "Download Sattari Hub 0.1.2 installer/updater alpha", href: "/downloads/sattari-hub-alpha-v0.1.2.tar.gz" },
        { label: "Download Sattari Audio Suite internal test pack", href: "/downloads/sattari-audio-suite-internal-test-pack-2026-05-25.zip" },
        { label: "Download StemDeck 0.4.3 standalone Mac app alpha", href: "/downloads/stemdeck-app-alpha-v0.4.3-djay-ui-reference.tar.gz" },
        { label: "Download Auto Pitch preview pack", href: "/downloads/auto-pitch-preview-pack.zip" },
        { label: "Open Sattari site", href: "https://sattari.netlify.app" },
      ],
      highlights: ["Sattari Hub installer/updater alpha available", "Self-contained Apple Silicon Mac internal download", "Not notarized or sale-ready; real validation still required before any beta language"],
    },
    evidence: {
      source: "wiki/projects/sattari/index.md",
      confidence: "high",
      review: "Internal-alpha/pre-alpha only; keep beta, public-beta, professional reliability, and sale-ready claims blocked until DAW/listening validation passes.",
    },
  },
  {
    id: "creator-tools",
    icon: "🎬",
    title: "ScenePilot Studio",
    status: "Live beta + concept",
    phase: "Creator workflow tools",
    readiness: 44,
    accent: "from-violet-500/30 via-fuchsia-500/20 to-sky-500/10",
    summary: "ScenePilot Studio is the public English beta for beat-aware edit plans, with Context Compositor remaining the next subject-aware smart-background concept.",
    bullets: ["ScenePilot public beta is live", "Accepts logos, voiceovers, videos, and effects", "Auto-arranges asset lanes around beat/cut maps"],
    nextAction: "Harden ScenePilot with rendered MP4/layer export, manual asset editing, BPM/grid polish, and Premiere import QA before broader creator-suite positioning.",
    blocker: "Not sale-ready yet: needs rendered asset/layer export, manual edit controls, installer/packaging, and real Premiere workflow validation.",
    primaryLink: { label: "ScenePilot beta", href: "https://sattari-auto-cut.netlify.app" },
    secondaryLink: { label: "Compositor preview", href: "/downloads/context-compositor-preview-pack.zip" },
    detail: {
      eyebrow: "Video creator tools",
      description: "ScenePilot Studio is becoming an auto-arranging editing assistant: add logos, voiceovers, extra videos, and effects, then let it build a beat-aware arrangement plan. Context Compositor remains the next concept for subject-aware scene/background compositing.",
      images: [
        { src: "/photos/context-compositor-example.svg", alt: "Context Compositor concept visual", caption: "Smart background and compositor concept" },
        { src: "/photos/auto-pitch-example.svg", alt: "Sattari software visual system", caption: "Shared Sattari software/product styling" },
      ],
      downloads: [
        { label: "Open ScenePilot beta", href: "https://sattari-auto-cut.netlify.app" },
        { label: "Download ScenePilot preview pack", href: "/downloads/auto-cut-preview-pack.zip" },
        { label: "Download Compositor preview pack", href: "/downloads/context-compositor-preview-pack.zip" },
      ],
      highlights: ["ScenePilot beta is public", "Creative-kit auto-arrangement is started", "Rendered/layered export is the next hardening gate"],
    },
    evidence: {
      source: "wiki/projects/video/index.md",
      confidence: "high",
      review: "Keep beta/concept wording; no sale-ready claim.",
    },
  },
  {
    id: "botanica",
    icon: "🌿",
    title: "Botanica Lab",
    status: "Live concept",
    phase: "Living research",
    readiness: 64,
    accent: "from-emerald-500/30 via-lime-500/20 to-teal-500/10",
    summary: "A botanical R&D interface for research-backed concept generation with careful claim boundaries.",
    bullets: ["Living research and article model", "Evidence-first wellness product exploration", "Next: formula cards with risk/evidence scoring"],
    nextAction: "Add formula cards that show source strength, safety flags, and review status.",
    blocker: "Consumer-facing language still needs claims review; keep outputs framed as R&D.",
    primaryLink: { label: "Live lab", href: "https://botanica-lab.netlify.app/" },
    secondaryLink: { label: "Source repo", href: "https://github.com/armonon/botanica-lab" },
    detail: {
      eyebrow: "Botanical R&D",
      description: "Botanica is a living research lab for botanical product concepts, ingredient signals, formula exploration, and safe wellness-product ideation. The lane emphasizes evidence boundaries and review before consumer-facing claims.",
      images: [
        { src: "/photos/botanica-example.svg", alt: "Botanica Lab concept visual", caption: "Botanica R&D product surface" },
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
        { src: "/photos/trader-oracle-example.svg", alt: "Trader Oracle dashboard visual", caption: "Oracle dashboard and signal surface" },
        { src: "/photos/botanica-example.svg", alt: "Research product visual language", caption: "Evidence-led research product pattern" },
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
    status: "Prototype",
    phase: "Trust layer",
    readiness: 46,
    accent: "from-stone-400/30 via-zinc-500/20 to-blue-500/10",
    summary: "A provenance-first book atlas for public-domain discovery, source inspection, and reading paths.",
    bullets: ["Source claims are the core edge", "Explore page and path model are started", "Next: richer book detail pages"],
    nextAction: "Deploy the richer Explore/source-inspection pass and add book/path deep links.",
    blocker: "Newest feature pass still needs production deployment and route-level polish.",
    primaryLink: { label: "Live atlas", href: "https://librarian-atlas.netlify.app" },
    detail: {
      eyebrow: "Knowledge + provenance",
      description: "Librarian is the source-first book atlas direction: public-domain discovery, provenance claims, authority links, reading paths, and source inspection. Spiritual Search now belongs near this lane as an older related spiritual/library discovery surface.",
      images: [
        { src: "/photos/librarian-example.svg", alt: "Librarian atlas concept visual", caption: "Open book atlas and source inspection" },
        { src: "/photos/context-compositor-example.svg", alt: "Structured research interface visual", caption: "Card-based discovery and inspection pattern" },
      ],
      downloads: [
        { label: "Open Librarian atlas", href: "https://librarian-atlas.netlify.app" },
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
    blocker: "Preview packs should stay clearly labeled until real installers/apps exist.",
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
        { label: "Download Sattari Hub 0.1.2 installer/updater alpha", href: "/downloads/sattari-hub-alpha-v0.1.2.tar.gz" },
        { label: "Download Sattari Audio Suite internal test pack", href: "/downloads/sattari-audio-suite-internal-test-pack-2026-05-25.zip" },
        { label: "Download ScenePilot preview pack", href: "/downloads/auto-cut-preview-pack.zip" },
        { label: "Download Auto Pitch preview pack", href: "/downloads/auto-pitch-preview-pack.zip" },
        { label: "Download Compositor preview pack", href: "/downloads/context-compositor-preview-pack.zip" },
      ],
      highlights: ["Public portfolio hub", "Preview downloads are labeled honestly", "Dedicated product detail pages are now the next structural layer"],
    },
  },
];

export const radarSoftwareProjects: RadarSoftwareProject[] = [

  {
    id: "sattari-loop-doctor",
    title: "Sattari Loop Doctor",
    category: "Audio repair",
    status: "Radar web prototype",
    image: "/photos/auto-pitch-example.svg",
    summary: "Sample and loop repair lab for timing, pitch, transients, loudness, loop points, and export prep.",
    description: "Sattari Loop Doctor is the proposed producer utility for turning messy loops into production-ready assets. The Radar web version lets Armon test the workflow, proof language, repair checklist, and output expectations before deeper DSP/native/plugin work begins.",
    tags: ["Audio", "Loops", "Sample repair", "Sattari"],
    live: { label: "Open Radar web prototype", href: "#/product-radar/software/sattari-loop-doctor" },
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
    status: "Radar web prototype",
    image: "/photos/auto-pitch-example.svg",
    summary: "Chord-to-MIDI idea engine for arps, melodies, basslines, chord chops, drum patterns, groove, and MIDI export.",
    description: "MIDI Genius / Sattari Arp Pro turns simple notes or chords into usable producer parts that can drive any synth. The Radar web version tests pattern language, presets, performance macros, and MIDI-export expectations while the real AU/VST3 MIDI-effect direction stays native/plugin-first.",
    tags: ["MIDI", "Audio plugin", "Arpeggiator", "Sattari"],
    live: { label: "Open Radar web prototype", href: "#/product-radar/software/midi-genius-sattari-arp-pro" },
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
    status: "Radar web prototype",
    image: "/photos/auto-pitch-example.svg",
    summary: "Hook idea machine for generating, mutating, auditioning, scoring, and exporting catchy MIDI/audio hook starters.",
    description: "HookForge is a controlled hook-generation workspace for producers and songwriters. It should create usable MIDI hooks, not locked black-box AI songs. The Radar web version tests the prompt controls, candidate cards, mutation workflow, and hook-scoring language.",
    tags: ["Songwriting", "MIDI", "Hooks", "Producer tools"],
    live: { label: "Open Radar web prototype", href: "#/product-radar/software/hookforge" },
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
    status: "Radar web prototype",
    image: "/photos/auto-pitch-example.svg",
    summary: "Private local sample-library search for BPM, key, instrument, mood, texture, similarity, crates, kits, and DAW drag/drop.",
    description: "Sample Library Brain is the local-first sample organizer for producers whose folders are chaos. The Radar web version tests the search, tag, smart-kit, similar-sound, and project-match UX before a native Mac app scans real folders.",
    tags: ["Samples", "Search", "Music production", "Local-first"],
    live: { label: "Open Radar web prototype", href: "#/product-radar/software/sample-library-brain" },
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
    status: "Radar web prototype",
    image: "/photos/librarian-example.svg",
    summary: "Private AI librarian for files, notes, projects, decisions, open loops, timelines, and source-cited answers.",
    description: "Librarian Atlas Personal OS is the broader software idea Armon asked about: a private local knowledge system that helps people find, understand, and recover context across their own documents. The Radar web version tests use cases for students, creators, founders, legal teams, families, and builders before local indexing work begins.",
    tags: ["Knowledge OS", "Local search", "Source citations", "Project memory"],
    live: { label: "Open Radar web prototype", href: "#/product-radar/software/librarian-atlas-personal-os" },
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
    status: "Public beta + preview pack",
    image: "/photos/context-compositor-example.svg",
    summary: "Beat-smart creator workflow for arranging logos, voiceovers, clips, and effects into a timeline plan.",
    description: "ScenePilot Studio is the most testable video-tool surface right now: a public beta that explores beat-aware edit planning, asset lanes, and creator-friendly arrangement logic. It should be tested as a workflow product rather than as a finished editor until rendered/layered export and manual editing controls are hardened.",
    tags: ["Video", "Creator tools", "Beat-aware editing"],
    live: { label: "Open ScenePilot beta", href: "https://sattari-auto-cut.netlify.app" },
    downloads: [
      { label: "Download ScenePilot export proof MP4", href: "/downloads/scenepilot-export-proof-2026-05-23.mp4" },
      { label: "Download ScenePilot preview pack", href: "/downloads/auto-cut-preview-pack.zip" },
      { label: "Download export proof manifest", href: "/downloads/scenepilot-export-proof-2026-05-23-manifest.json" },
    ],
    testingFocus: "Upload/arrangement flow, clarity of the edit plan, export proof quality, asset-lane UX, and whether the product direction feels useful for real creators.",
    testSteps: ["Open the live beta", "Download the 2026-05-23 export proof MP4 and manifest", "Try a simple creator-kit scenario with video/logo/voiceover assets", "Record missing controls needed before sale-ready positioning"],
    webPrototype: {
      title: "Creator video web test",
      summary: "The browser-testable version of the future creator studio: script/assets in, storyboard/timeline/export plan out.",
      sampleInput: "30-second product promo · vertical 9:16 · logo + voiceover + 3 clips · beat markers every 2 bars",
      primaryOutput: "Storyboard, beat-aware timeline plan, caption style, export checklist, and editor-handoff requirements.",
      panels: [
        { label: "Script to scenes", value: "Hook / proof / CTA", detail: "Turns raw copy into a structured short-form edit plan." },
        { label: "Asset lanes", value: "Logo + clips + voice + effects", detail: "Tests whether creators understand what to upload and how it gets used." },
        { label: "Captions", value: "Animated emphasis", detail: "Defines the caption behavior before rendered export is hardened." },
        { label: "Handoff", value: "MP4 + editable assets", detail: "The win is editable outputs, not a locked black-box video." },
      ],
      actions: ["Keep live beta linked", "Add storyboard fixture", "Add timeline export preview", "Harden one-click rendered export"],
    },
  },
  {
    id: "context-compositor",
    title: "Context Compositor",
    category: "Video compositing",
    status: "Concept + preview pack",
    image: "/photos/context-compositor-example.svg",
    summary: "Subject-aware smart-background and overlay direction for faster believable compositing.",
    description: "Context Compositor is the smart-background/overlay product direction for video creators. The current downloadable is an honest preview pack, not an installer, and the next technical gate is native app/editor integration with reliable subject/background behavior.",
    tags: ["Video", "Compositing", "Smart backgrounds"],
    downloads: [
      { label: "Download Context Compositor preview pack", href: "/downloads/context-compositor-preview-pack.zip" },
    ],
    testingFocus: "Evaluate the concept, desired editor workflow, and which examples would prove the compositing promise clearly.",
    testSteps: ["Download the preview pack", "Review the product direction", "Compare against real editing pain points", "List the first examples needed for a convincing native prototype"],
  },
  {
    id: "compositor-native",
    title: "COMPOSITOR",
    category: "Native video editor",
    status: "Native Qt foundation",
    image: "/photos/context-compositor-example.svg",
    summary: "Native-first frame/layer video editor foundation with SQLite sessions, import queues, timeline navigation, and recovery-safe project handling.",
    description: "COMPOSITOR is the serious native video-editor direction: frame-level control, layer-first editing, timeline-aware inspection, SQLite project/session storage, import queues, recovery-safe saves, backup restore paths, and safe missing-media relink flows. It is internal foundation work today, not a public installer yet.",
    tags: ["Native app", "Video editor", "Qt/C++"],
    downloads: [],
    testingFocus: "Internal validation should focus on project/session reliability, timeline navigation clarity, import/relink safety, and whether the native editor foundation feels credible before public packaging.",
    testSteps: ["Run the native CMake/CTest gate", "Open the Qt shell locally", "Verify SQLite project/session save and restore behavior", "Check that media probe/relink actions stay opt-in and fail closed"],
  },
  {
    id: "now-suite",
    title: "NOW Suite",
    category: "Identity platform",
    status: "Preview prototype",
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
    status: "Contract-backed prototype",
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
    status: "Hub installer/updater alpha",
    image: "/photos/auto-pitch-example.svg",
    summary: "One-download Sattari Hub installer/updater alpha with Project Radar plugin-update feed; Auto Pitch 0.1.4 real correction fix payload is live for Apple Silicon Mac validation.",
    description: "Sattari Hub is the new downloadable internal alpha app for installing, updating, and hosting the current Sattari Audio software from one place. The packaged archive embeds the available AU/VST3/Standalone payloads so another Apple Silicon Mac can test without cloning the repo, and the updater-capable Hub reads a Project Radar feed so future plugin payload archives can update without replacing the Hub app. It is explicitly not notarized, not a beta, not a public release, not DAW-validated, and not sale-ready. Testing should focus on installation/update flow, Gatekeeper friction, DAW rescan behavior, and real listening notes for Auto Pitch/VoxKey/StemDeck and the other plugin builds.",
    tags: ["Audio", "Internal testing", "Validation", "Sattari"],
    downloads: [
      { label: "Download Sattari Hub 0.1.2 installer/updater alpha", href: "/downloads/sattari-hub-alpha-v0.1.2.tar.gz" },
      { label: "Download Sattari Audio Suite internal test pack", href: "/downloads/sattari-audio-suite-internal-test-pack-2026-05-25.zip" },
      { label: "Download StemDeck 0.4.3 standalone Mac app alpha", href: "/downloads/stemdeck-app-alpha-v0.4.3-djay-ui-reference.tar.gz" },
    ],
    testingFocus: "Installer/updater validation only: download the updater-capable Hub once on an Apple Silicon Mac, install/update embedded or online-feed internal-alpha builds, rescan the DAW, and record blockers without treating the suite as beta or sale-ready.",
    testSteps: ["Download Sattari Hub 0.1.2 alpha", "Unzip/open Sattari Hub.app and allow Gatekeeper if prompted", "Install/update the available products from the Hub", "Restart or rescan Logic/Ableton for AU/VST3 visibility", "Record install issues, missing products, DAW scan problems, crashes, artifacts, and UX confusion"],
  },
  {
    id: "stemdeck",
    title: "Sattari StemDeck",
    category: "Audio app",
    status: "Standalone app alpha download",
    image: "/photos/auto-pitch-example.svg",
    summary: "Standalone Sattari StemDeck Mac DJ app alpha with four-column djay-inspired stem decks and bottom pattern arrangement recorder workspace.",
    description: "Sattari StemDeck v0.4.3 standalone-app alpha is available as its own Apple Silicon Mac application package. The app-first package contains Sattari StemDeck.app at the top level, an install_app.sh helper for ~/Applications, the djay-inspired four-column live-mixer / pattern-arrangement UI, optional Demucs setup scripts, bundled Rubber Band/libsamplerate runtime dylibs, Rubber Band-backed time/pitch validation output, and architecture contracts. It is not notarized or sale-ready; the bottom arrangement space is an alpha workflow/capture surface, not a complete editable Ableton-style timeline yet.",
    tags: ["Audio", "Standalone app", "DJ app", "Internal alpha"],
    downloads: [
      { label: "Download StemDeck 0.4.3 standalone Mac app alpha", href: "/downloads/stemdeck-app-alpha-v0.4.3-djay-ui-reference.tar.gz" },
    ],
    testingFocus: "Open the standalone Mac app directly, load known-BPM/key tracks or prepared stems, validate the split live mixer + arrangement recorder workflow, and record install, audio, sync, recording, and UX blockers without treating it as sale-ready.",
    testSteps: ["Download the StemDeck 0.4.3 standalone Mac app alpha", "Unzip it and open Sattari StemDeck/Sattari StemDeck.app or run scripts/install_app.sh", "Allow the normal unnotarized-alpha Gatekeeper prompt if macOS blocks first launch", "Load two known-BPM/key loops or songs", "Test deck playback, crossfader, beat/key controls, pads, and Record WAV", "Document drift, clicks, false key readings, crashes, missing app behavior, or arrangement-recorder confusion"],
  },
  {
    id: "auto-pitch",
    title: "Auto Pitch",
    category: "Audio plugin",
    status: "Prototype + preview pack",
    image: "/photos/auto-pitch-example.svg",
    summary: "Sattari vocal tuning product direction with auto key, adaptive song sections, and sale-ready plugin ambitions.",
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
    status: "Live concept + test pack",
    image: "/photos/botanica-example.svg",
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
    status: "Live beta + test pack",
    image: "/photos/trader-oracle-example.svg",
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
    status: "Live prototype + test pack",
    image: "/photos/librarian-example.svg",
    summary: "Provenance-first public-domain book atlas for discovery, source inspection, and reading paths.",
    description: "Librarian Book Atlas is the existing trust/provenance software lane: a way to discover books, inspect source claims, follow reading paths, and keep public-domain availability grounded in evidence. It now sits next to the broader Librarian Atlas Personal OS idea, which is the private AI librarian for all personal files and projects.",
    tags: ["Books", "Provenance", "Research"],
    live: { label: "Open Librarian Book Atlas", href: "https://librarian-atlas.netlify.app" },
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
    status: "Live fallback demo + test pack",
    image: "/photos/digital-human-example.svg",
    summary: "Browser avatar/chat demo with visemes and hybrid animation readiness, pending true neural/photo engine approval.",
    description: "Digital Human MVP is a working fallback demo for avatar chat: browser-GLB responses, viseme metadata, and readiness reporting. The testing page keeps the truth clear: useful fallback demo now, not a true neural/photo talking-head product until the engine and persistence pieces are approved/configured.",
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
    status: "Live directory + test pack",
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
    projectName: "ScenePilot Studio",
    softwareId: "scenepilot-studio",
    readinessScore: 5.5,
    promise: "Turn creator assets into a beat-aware edit plan creators can understand and eventually export.",
    latestProof: "Public beta is live; deterministic cut-plan render produced a 3.6s MP4 proof, and the live ScenePilot UI now includes an MP4 render-helper export button.",
    blocker: "Next blocker is true one-click desktop/app export plus manual asset/timeline controls; the current UI helper still requires local FFmpeg/helper steps.",
    nextStep: "Wire the MP4 render helper into the desktop/app path so creators can export without editing a command script.",
    monetization: "Freemium creator beta, paid exports, then Pro desktop/plugin tier.",
  },
  {
    priority: 2,
    projectName: "Sattari Loop Doctor",
    softwareId: "sattari-loop-doctor",
    readinessScore: 1.8,
    promise: "Turn messy loops into production-ready samples by repairing timing, pitch/key, loop seams, transients, loudness, and export metadata.",
    latestProof: "Interactive Radar mini-lab exists with loop type, BPM, key, timing, stem-split controls, generated repair plan, score, run path, and downloadable test artifact.",
    blocker: "No real DSP engine or before/after audio fixture is wired yet; this remains prototype planning logic.",
    nextStep: "Replace the mock plan with one real before/after audio fixture and artifact-warning card.",
    monetization: "Paid Sattari Audio desktop/plugin utility, sample-pack cleanup tier, and producer-suite bundle.",
  },
  {
    priority: 3,
    projectName: "MIDI Genius / Sattari Arp Pro",
    softwareId: "midi-genius-sattari-arp-pro",
    readinessScore: 2.2,
    promise: "Convert simple chord input into usable arps, melodies, basslines, chord chops, drum patterns, and exportable MIDI.",
    latestProof: "Interactive Radar mini-lab exists with chord/style/energy/swing/bass-lane controls, generated pattern plan, score, run path, and downloadable test artifact; prior Sattari Arp work established a native/plugin direction.",
    blocker: "Needs real browser MIDI generation, final preset list, and verified AU/VST3 MIDI-effect packaging path before beta language.",
    nextStep: "Add one real generated-pattern fixture and downloadable .mid proof inside the Radar mini-lab.",
    monetization: "Paid Sattari MIDI plugin, preset packs, producer bundle, and future pattern-pack marketplace.",
  },
  {
    priority: 4,
    projectName: "HookForge",
    softwareId: "hookforge",
    readinessScore: 1.6,
    promise: "Generate, mutate, score, audition, and export controlled hook ideas as DAW-usable MIDI/audio starters.",
    latestProof: "Interactive Radar mini-lab exists with key/BPM/vibe/hook-type controls, generated hook direction, scoring, mutation/export cards, run path, and downloadable test artifact.",
    blocker: "No real phrase generator, MIDI export, or audio audition fixture exists yet.",
    nextStep: "Create a real 10-hook candidate fixture with scores and mutation buttons, then add MIDI/audio export artifacts.",
    monetization: "Paid songwriting/producers tool, hook packs, Sattari creative-suite upsell, and DAW plugin tier.",
  },
  {
    priority: 5,
    projectName: "Sample Library Brain",
    softwareId: "sample-library-brain",
    readinessScore: 1.7,
    promise: "Make a producer's local sample folders searchable by BPM, key, instrument, mood, texture, similarity, smart kits, and DAW workflow.",
    latestProof: "Interactive Radar mini-lab exists with search, BPM/key/category/kit controls, generated sample cards, project-fit scoring, run path, and downloadable test artifact.",
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
    latestProof: "Use-case catalog and interactive Radar mini-lab exist with question/audience/depth/open-loop controls, cited-answer-style output, timeline/open-loop cards, and downloadable test artifact.",
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
    priority: 10,
    projectName: "Context Compositor",
    softwareId: "context-compositor",
    readinessScore: 2.5,
    promise: "Make subject-aware background and overlay compositing faster for creators.",
    latestProof: "Local MVP merged-frame/video artifacts exist under sites/context-compositor-mvp/outputs.",
    blocker: "Needs a clear before/after proof set and a defined editor workflow before public positioning.",
    nextStep: "Create one before/after proof card from the existing MVP frames and attach it to the ledger.",
    monetization: "Creator-suite module or paid desktop/editor add-on bundled with ScenePilot/COMPOSITOR.",
  },
  {
    priority: 11,
    projectName: "COMPOSITOR native editor foundation",
    softwareId: "compositor-native",
    readinessScore: 4,
    promise: "Provide a native frame/layer/timeline editor foundation with reliable project persistence.",
    latestProof: "Qt/C++ SQLite session, import queue, recovery, and fail-closed relink logs are documented.",
    blocker: "Needs a visible alpha slice: import clip, view timeline/layers, save/reopen, then eventually render/export.",
    nextStep: "Capture one local alpha proof log for open project → import queue → save/reopen → relink preview readiness.",
    monetization: "Paid native creator app, pro license, and modules for compositing/ScenePilot workflows.",
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
    blocker: "Still needs real app-session/listening validation with known BPM/key material; AI stem separation is optional local Demucs setup rather than bundled consumer install, app is not notarized, and the arrangement recorder is not yet a full editable DAW timeline.",
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
  { value: String(radarLanes.length), label: "product lanes" },
  { value: String(radarSoftwareProjects.length), label: "software pages" },
  { value: String(radarSoftwareProjects.reduce((sum, project) => sum + project.downloads.length, 0)), label: "downloadables" },
  { value: String(radarEvidenceLedger.length), label: "evidence rows" },
];

export const radarOpportunities = [
  "Make Product Radar answer one question fast: what proof exists, what is blocked, and what is the smallest useful next build?",
  "Turn every serious software idea into a web-testable Radar prototype before native/plugin/deep-DSP implementation.",
  "Convert the evidence ledger into generated input from wiki, GitHub, deploy checks, screenshots, demos, and build logs.",
  "Put live proof first: export, screenshot, demo video, test result, build log, or web prototype before adding more concept copy.",
  "Keep regulated lanes safe: Market avoids checkout/scraping claims, Trader stays research-only, and Botanica carries citations/safety/review labels.",
];

export const radarNextBuildSteps = [
  { title: "Usable web labs → real proof", body: "The new Radar mini-labs are interactive now; next step is replacing mock artifacts with real audio, MIDI, search, storyboard, and cited-answer fixtures.", state: "P0" },
  { title: "MIDI Genius first proof", body: "Turn the chord-to-pattern mini-lab into a real generated-note fixture with downloadable .mid output, then map it to the Sattari Arp Pro plugin path.", state: "P0" },
  { title: "Sample Library Brain fixture", body: "Replace the mock sample cards with a tiny local fixture database, smart-kit output, and local-first permission copy before native folder scanning.", state: "P1" },
  { title: "ScenePilot export proof", body: "Produce one deterministic sample input → edit plan → rendered MP4 or structured timeline export, then attach the artifact to the ledger.", state: "P1" },
  { title: "Generated evidence ledger", body: "Move proof paths, blockers, readiness scores, and risk labels from manual notes into generated Radar input.", state: "P1" },
  { title: "Safety-first proof cards", body: "Market, Trader, and Botanica must show proof with guardrails: no checkout/scraping, research-only, citations, safety flags, and review labels.", state: "Always" },
];

export const radarIdeaFeed = [
  {
    name: "Project Radar Web Test Lab",
    theme: "Every serious software idea gets a browser-testable prototype page",
    mvp: "Loop Doctor, MIDI Genius, HookForge, Sample Library Brain, ScenePilot, and Librarian Atlas Personal OS each have a Radar test flow before native builds.",
  },
  {
    name: "Product Radar OS",
    theme: "Operating system for Armon's active products",
    mvp: "Auto-sync safe lane copy from wiki evidence, then verify, commit, and push without supervision.",
  },
  {
    name: "Lane Evidence Ledger",
    theme: "Per-lane source map for safe autonomous updates",
    mvp: "Track live link, source page, confidence, blocker source, and review-needed flag for each Radar card.",
  },
];
