
export type Project = {
  id: string | number;
  title: string;
  section: "software" | "website";
  subtitle: string;
  description: string;
  tech: string[];
  points: string[];
  live: string;
  liveLabel: string;
  github: string;
  label: string;
  video?: string;
  image: string;
  status: string;
  /** Shipped under thecreateco */
  studio?: boolean;
};

export const hasLink = (href?: string) => Boolean(href && href !== "#");

export const projects: Project[] = [
  {
    id: "luma-studio",
    title: "Luma Studio",
    section: "software",
    subtitle: "Pro image editor with offline AI",
    description:
      "A local-first, nondestructive image editor for the web and a packaged Tauri desktop edition. One TypeScript editing engine is shared by both; the desktop app adds native file dialogs and a threaded Rust f32 compositor. Subject selection and matting run on-device.",
    tech: ["TypeScript", "React", "Tauri", "Rust", "ONNX Runtime"],
    points: [
      "Raster, text, shape, group, adjustment and smart-object layers with all 27 Photoshop blend modes, multiple blend passes, Blend If, clipping and layer masks.",
      "PSD/PSB preflight with untouched-source passthrough, DNG sensor decode, ICC v2/v4 colour and 8/16/32-bit precision masters.",
      "Local segmentation and matting models for selection and background removal, branching version history, and 1,200+ automated tests in the public repo."
    ],
    live: "https://luma.thecreatingco.com",
    liveLabel: "Open Luma",
    github: "https://github.com/armonon/luma-studio",
    label: "Image",
    video: "/videos/luma-demo.mp4",
    image: "/photos/luma-shot.png",
    status: "Public alpha",
    studio: true
  },
  {
    id: "form-studio",
    title: "Form Studio",
    section: "software",
    subtitle: "Precision CAD and garment design in one workspace",
    description:
      "A CAD tool that starts from what you want to make rather than which command to hunt for. Describe a part in plain language — “an 80 × 50 × 6 mm bracket with 4 holes” — and it builds exact B-Rep geometry through OpenCASCADE, with every dimension, constraint, unit, and feature still visible and editable.",
    tech: ["OpenCASCADE", "B-Rep Geometry", "TypeScript", "Native + Web"],
    points: [
      "Exact B-Rep modelling through OpenCASCADE — not mesh approximation — so parts stay manufacturable and dimensionally true.",
      "Natural-language intent sits on top of a full parametric feature tree: sketch, extrude, fillet, all re-editable with fractions, inches, millimetres, or degrees.",
      "Local-first with backups, recovery, and V1–V11 project migrations, validated by 200+ web and native tests."
    ],
    live: "https://form.thecreatingco.com",
    liveLabel: "Open Form",
    github: "#",
    label: "Design / CAD",
    video: "/videos/form-studio-demo.mp4",
    image: "/photos/form-studio-shot.png",
    status: "Public alpha",
    studio: true
  },
  {
    id: "stemdeck",
    title: "StemDeck",
    section: "software",
    subtitle: "Perform first. Perfect it after.",
    description:
      "A live performance instrument that records every deck, input, and move — then turns the whole set into an arrangement you can edit, comp, and finish. The performance becomes a real project, not a stereo bounce: clean sources, the audible master, and the control timeline are all preserved.",
    tech: ["C++", "JUCE", "Rubber Band", "Real-time Audio", "macOS"],
    points: [
      "One instrument, three connected modes — Perform (touch-first decks, stems, cues, live FX), Replay (split, move, automate, comp, export), and Library (audition and build sets by tempo and key).",
      "Retrospective capture means every move enters Replay, so you can razor, trim, fade, overlap, and comp exact regions between takes after the fact.",
      "Four performance decks with live stems, isolated plug-ins, MIDI and live inputs, and project-wide BPM and key sync."
    ],
    live: "https://stemdeck.thecreatingco.com",
    liveLabel: "Open StemDeck",
    github: "#",
    label: "Sound",
    video: "/videos/stemdeck-demo.mp4",
    image: "/photos/stemdeck-shot.png",
    status: "Early access",
    studio: true
  },
  {
    id: "scenepilot-studio",
    title: "ScenePilot",
    section: "software",
    subtitle: "Beat-synced music video editor that renders in the browser",
    description:
      "Drop in a song and a folder of clips. ScenePilot finds the tempo, cuts a montage locked to the downbeat, punches the camera on every hit, grades the whole thing on the GPU, and renders a finished MP4 — no timeline wrangling. Runs entirely on-device, with a macOS build alongside the web app.",
    tech: ["TypeScript", "WebGL / GPU Shaders", "Web Audio", "Beat Detection", "In-browser Encoding"],
    points: [
      "Detects tempo and cuts to the downbeat, layering zoom punches, speed ramps, strobes, stutters, and whip cuts on every hit.",
      "Real-time GPU grade — exposure, bloom, chromatic aberration, vignette, and film grain, all beat-reactive.",
      "Renders the final MP4 locally, so a creator's footage never leaves their machine."
    ],
    live: "https://scenepilot.thecreatingco.com",
    liveLabel: "Open ScenePilot",
    github: "#",
    label: "Film",
    image: "/photos/scenepilot-shot.png",
    status: "Public alpha",
    studio: true
  },
  {
    id: "sattari-ai-ad",
    title: "Sattari — AI Video Ad",
    section: "software",
    subtitle: "A 35-second generative video spot for a drum shop",
    description:
      "A commercial for Sattari Music made with AI video generation: a cast of characters from a Viking to a vaudeville duo to a sequinned rocker, all drumming through one rich, theatrical drum hall. I directed the look shot by shot, kept the characters and set consistent from cut to cut, then cut it to the beat and finished with branding and a scan-to-shop QR end card.",
    tech: ["AI video generation", "Art direction", "Edit & sound sync", "Brand finishing"],
    points: [
      "Shot-by-shot prompting and selects so a cast of different characters still reads as one world: same palette, same lighting, same drum hall.",
      "Cut to the rhythm of the track, so the edit itself sells the product: drums.",
      "Delivered as a ready-to-post ad with brand lockup and a QR end card that sends viewers to the store."
    ],
    live: "https://sattarimusic.com",
    liveLabel: "Visit Sattari Music",
    github: "#",
    label: "AI video",
    video: "/videos/sattari-ai-ad.mp4",
    image: "/photos/sattari-ai-ad-poster.jpg",
    status: "Client work"
  },
  {
    id: "entropy",
    title: "Entropy",
    section: "software",
    subtitle: "Real-time granular chaos engine — VST3 / AU / Standalone",
    description:
      "A professional audio plugin built in C++ with JUCE 8: a real-time granular synthesis engine with FFT spectral freeze, deep modulation, and a fully custom CRT/biohazard visual identity. Runs as a VST3, AU, and standalone app inside any major DAW.",
    tech: ["C++", "JUCE 8", "CMake", "Real-time DSP", "FFT / STFT"],
    points: [
      "Captures incoming audio into a circular buffer and sprays windowed grains from a movable read position for freeze, scrub, pitch-shift, and smear.",
      "Includes a separate STFT spectral-freeze path (2048-point FFT, 75% overlap-add) that resynthesizes sustained glassy pads with evolving phase drift.",
      "Ships a custom BiohazardLookAndFeel — procedural knob textures, CRT scanlines, a level-reactive glow, and routable per-knob modulation with trailing arcs."
    ],
    live: "#",
    liveLabel: "Plugin demo",
    github: "https://github.com/armonon/mk-ultra",
    label: "Audio plugin",
    video: "/videos/entropy-demo.mp4",
    image: "/photos/entropy-clip.svg",
    status: "Working build"
  },
  {
    id: "sattari-suite",
    title: "Sattari Audio",
    section: "software",
    subtitle: "Installer + plugin suite for music production",
    description:
      "A one-download Sattari Hub that installs and updates the full Sattari Audio line — the Entropy granular engine, Auto Pitch vocal tuning, and the StemDeck DJ app — as AU, VST3, and standalone builds, with an over-the-air update feed. thecreateco's native audio suite.",
    tech: ["JUCE 8", "C++", "AU / VST3", "macOS", "Auto-updater"],
    points: [
      "One Hub installs and updates every Sattari plugin and app from a single place.",
      "Bundles the Entropy granular engine, Auto Pitch vocal tuning, and the StemDeck DJ app.",
      "Ships AU/VST3/standalone builds with an over-the-air Product Radar update feed."
    ],
    live: "https://sattari-audio-suite.netlify.app",
    liveLabel: "Visit site",
    github: "#",
    label: "Audio suite",
    video: "/videos/sattari-suite-demo.mp4",
    image: "/photos/sattari-suite-clip.svg",
    status: "Public alpha",
    studio: true
  },
  {
    id: "universal-computer-operator",
    title: "Universal Computer Operator",
    section: "software",
    subtitle: "A local AI agent that actually runs your Mac",
    description:
      "Press ⌥Space and ask for anything. It reads the screen, narrates the plan it intends to follow, waits for your approval, then carries the steps out inside real applications — clicking, typing, navigating. Every destructive step is reversible, and it runs entirely on-device: no account, no API key, nothing leaves the machine.",
    tech: ["AI Agent", "Screen Understanding", "macOS", "Local-first"],
    points: [
      "Five surfaces one keystroke away — Operator Bar, Suggest Orb, selection analysis, circular capture, and plain-English file cleanup.",
      "Plans before acting and gates every destructive step behind explicit approval, so the agent is auditable rather than opaque.",
      "Runs fully offline, which is what makes it usable on real client and creative work."
    ],
    live: "#",
    liveLabel: "macOS",
    github: "#",
    label: "AI agent",
    video: "/videos/uco-demo.mp4",
    image: "/photos/uco-example.svg",
    status: "macOS build"
  },
  {
    id: "model-studio",
    title: "Photobooth Studio",
    section: "software",
    subtitle: "Garment artwork → polished product photos",
    description:
      "Studio-grade product shots without the studio. A local AI model lifts the garment off any backdrop in seconds, then a layered editor lets you compose mockups like a designer — brush, magic wand, and lasso cutouts, stacked layers, custom text, and a flattened export. Fully offline: no account, no credits, nothing uploaded.",
    tech: ["TypeScript", "Canvas", "On-device AI", "Image Compositing", "Layer Engine"],
    points: [
      "One-click background removal running on-device, with white, soft-grey, or transparent output and batch ZIP export for a whole shoot.",
      "Layered studio — arrange, resize, restack, and set opacity across images, then add text in any font and export flattened.",
      "Built for e-commerce sellers who need consistent, owned product imagery without a paid mockup subscription."
    ],
    live: "https://photoboothstudio-b6ac09.netlify.app",
    liveLabel: "Open the app",
    github: "https://github.com/armonon/photoboothstudio",
    label: "Commerce tool",
    video: "/videos/model-studio-demo.mp4",
    image: "/photos/model-studio-clip.svg",
    status: "Live tool"
  },
  {
    id: "bounce",
    title: "Bounce",
    section: "software",
    subtitle: "A music player for the files you own",
    description:
      "A minimalist local music player in C++ and JUCE 8, shipping on macOS and iOS from one shared core — with a browser companion on thecreateco. It scans a folder, reads tags and embedded cover art, and gives you albums, artists, search, playlists, and a full-screen now-playing view — no account, no streaming, no library you can lose.",
    tech: ["C++", "JUCE 8", "CMake", "macOS", "iOS"],
    points: [
      "Calibrated dB fader from −60 dB to +12 dB with a limiter, so boosting quiet files never clips.",
      "Recursive library scan reads ID3v2, Vorbis and FLAC tags with embedded art, falling back to folder structure when tags are missing.",
      "Playlists with drag-to-reorder, and library state persisted as JSON so startup is instant."
    ],
    live: "https://bounce.thecreatingco.com",
    liveLabel: "Open Bounce",
    github: "#",
    label: "Music app",
    video: "/videos/bounce-demo.mp4",
    image: "/photos/bounce-shot.png",
    status: "Public testing",
    studio: true
  },
  {
    id: "librarian",
    title: "Librarian",
    section: "software",
    subtitle: "Provenance-first atlas for public-domain books",
    description:
      "A book research platform that combines search, source inspection, public-domain availability, reading paths, and authority links into one trust-first interface. Gather your PDFs, open a chapter, and stay with an idea.",
    tech: ["Vite", "SQLite", "Open Library", "Wikidata", "Source Provenance"],
    points: [
      "Surfaces readable/free book leads with citations, source links, confidence, and retrieval notes.",
      "Adds exploration paths, source coverage dashboards, and stronger book-discovery flows.",
      "Built for research trust: every important claim should point back to a source."
    ],
    live: "https://librarian.thecreatingco.com",
    liveLabel: "Open Librarian",
    github: "https://github.com/armonon/librarian",
    label: "Read & organize",
    image: "/photos/librarian-clip.svg",
    video: "/videos/librarian-demo.mp4",
    status: "Public testing",
    studio: true
  },
  {
    id: "reclaim",
    title: "Reclaim",
    section: "software",
    subtitle: "Mac storage review with a recoverable quarantine",
    description:
      "A free Mac app for seeing where your storage went and cleaning it up without regret. Reclaim groups items into cleanup categories, finds duplicate candidates, and moves what you approve into a quarantine you can restore from — nothing is permanently deleted unless you turn that on and confirm it.",
    tech: ["macOS 13+", "Apple Silicon + Intel", "Developer ID signed", "Apple-notarized"],
    points: [
      "Review capacity, used and available space, and a folder-level map of the biggest consumers before touching anything.",
      "Quarantine instead of delete: restore any item, set how long quarantined files are kept, and empty it only after confirmation.",
      "Automatic permanent deletion is off by default, and permission and Full Disk Access limits are explained in the app."
    ],
    live: "https://thecreatingco.com/products/reclaim/",
    liveLabel: "Get Reclaim",
    github: "#",
    label: "Mac utility",
    image: "/photos/reclaim-clip.svg",
    status: "Mac public alpha",
    studio: true
  },
  {
    id: "converter",
    title: "Converter",
    section: "software",
    subtitle: "Give your files a new format, without uploading them",
    description:
      "A free file converter that runs in the browser or as a desktop app, with no account. Queue up to 100 files — images, PDFs, spreadsheets, audio, video and archives — and convert them one by one or all at once. Conversions happen on your device, so nothing is sent to a cloud service.",
    tech: ["Browser app", "Desktop app", "FFmpeg (desktop)", "Local processing"],
    points: [
      "Covers images (PNG, JPG, WebP), PDF to text with English OCR, PDF to XLSX/CSV, DOCX to PDF, spreadsheets, audio, video and ZIP/TAR archives.",
      "Batch queue with per-file or Convert all, then download individually or collect everything into one ZIP.",
      "Editable table review for extracted tables and a print preview for spreadsheet-to-PDF, with files processed locally rather than uploaded."
    ],
    live: "https://thecreatingco.com/forma/",
    liveLabel: "Open Converter",
    github: "#",
    label: "File tools",
    image: "/photos/converter-clip.svg",
    status: "New · free in browser",
    studio: true
  },
  {
    id: "hole",
    title: "HOLE",
    section: "software",
    subtitle: "Visual search that keeps your discoveries in Trails",
    description:
      "A research and discovery search that puts a homepage preview beside every result, then lets you follow related ideas and save what you find in named Trails kept on your device. It searches the open web alongside independent sites, archives, libraries and public Circle conversations.",
    tech: ["Web search", "Tavily / Brave Search", "Internet Archive", "Open Library", "Crossref"],
    points: [
      "Advanced search with exact phrases, exclusions, file and content-type filters, language, and date ranges by publication, archive capture or library item date.",
      "Six connected public indexes — Arquivo.pt, Internet Archive, Wiby, Library of Congress, Open Library and Crossref — with source status shown when one is unavailable.",
      "A Discovery sort that favors independent and unusual sources, and a cap of one result per hostname to keep results varied."
    ],
    live: "https://thecreatingco.com/community/hole",
    liveLabel: "Open HOLE",
    github: "#",
    label: "Search",
    image: "/photos/hole-clip.svg",
    status: "Free to explore",
    studio: true
  },
  {
    id: "digital-human-mvp",
    title: "Digital Human",
    section: "software",
    subtitle: "AI avatar chat with visemes and real-time rendering",
    description:
      "A browser avatar/chat experience with real-time GLB rendering, viseme-driven lip sync, and hybrid animation — a working foundation for persistent AI identity, with a path to hosted neural/photo rendering.",
    tech: ["Three.js", "React", "Avatar Systems", "AI Chat"],
    points: [
      "Delivers a working avatar-chat surface with generated replies and viseme-driven animation.",
      "Real-time GLB rendering in the browser with lip sync mapped to response audio.",
      "Built as a foundation for persistent AI identity and richer avatar experiences."
    ],
    live: "#",
    liveLabel: "Live demo",
    github: "#",
    label: "AI avatar",
    image: "/photos/digital-human-example.svg",
    video: "/videos/digital-human-demo.mp4",
    status: "Working demo"
  },
  {
    id: "momentous",
    title: "Momentous",
    section: "website",
    subtitle: "Software and things worth owning — a two-sided directory",
    description:
      "A directory platform with two halves: apps built in-house on one side, independent storefronts on the other. Every shop keeps its own checkout — Momentous is the door, not the middleman.",
    tech: ["React", "TypeScript", "Directory Platform", "Commerce"],
    points: [],
    live: "https://momentous-store.netlify.app",
    liveLabel: "Live site",
    github: "#",
    label: "Platform",
    video: "/videos/momentous-demo.mp4",
    image: "/photos/momentous-shot.png",
    status: "Live platform"
  },
  {
    id: "the-circle",
    title: "The Circle",
    section: "website",
    subtitle: "Profiles, projects and discussions in one community feed",
    description:
      "The community layer of thecreateco: profiles, projects, collections and discussions, with Circle, Instagram, X and YouTube posts gathered into a single feed.",
    tech: ["Community", "Profiles", "Feeds"],
    points: [],
    live: "https://thecreatingco.com/community/network",
    liveLabel: "Live site",
    github: "#",
    label: "Community",
    image: "/photos/circle-clip.svg",
    status: "Live community"
  },
  {
    id: "now-messenger",
    title: "NOW Messenger",
    section: "website",
    subtitle: "Rooms, group video and PictoChat-style drawing chat",
    description:
      "The messaging side of thecreateco's community: public and invite-only rooms, group cameras, message timers, and a drawing chat. Guests can join without an email.",
    tech: ["Messaging", "Rooms", "Video", "PictoChat"],
    points: [],
    live: "https://thecreatingco.com/products/now/",
    liveLabel: "Live site",
    github: "#",
    label: "Messaging",
    image: "/photos/now-messenger-clip.svg",
    status: "Public web alpha"
  },
  {
    id: "sattari-music",
    title: "Sattari Music",
    section: "website",
    subtitle: "Brand-forward music and drum business website",
    description: "A custom web direction for a music business centered on drum gear, local services, rentals, and brand identity.",
    video: "/videos/sattari-music-demo.mp4",
    image: "/photos/sattari-screenshot.png",
    tech: ["React", "Stripe", "E-commerce", "Responsive Design"],
    points: [],
    live: "https://sattarimusic.com",
    liveLabel: "Live site",
    github: "#",
    label: "Commerce",
    status: "Live site"
  },
  {
    id: "nasiri-team",
    title: "Nasiri Team Realty",
    section: "website",
    subtitle: "Modern real estate platform with live property listings",
    description: "A responsive real estate website designed for property listings, agent profiles, and seamless client communication.",
    video: "/videos/nasiri-demo.mp4",
    image: "/photos/nasiri-screenshot.png",
    tech: ["React", "Real Estate CMS", "Property Listings", "Responsive Design"],
    points: [],
    live: "https://nasiriteam.netlify.app",
    liveLabel: "Live site",
    github: "#",
    label: "Real estate",
    status: "Live site"
  }
];

export const softwareProjects = projects.filter((p) => p.section === "software");

export const websiteProjects = projects.filter((p) => p.section === "website" && hasLink(p.live));

export const STUDIO_URL = "https://thecreatingco.com";

export const studioApps = [
  { name: "Ghost Studio", kind: "Design", line: "Explore a garment from every side.", href: "https://ghost.thecreatingco.com/" },
  { name: "Librarian", kind: "Read & organize", line: "Gather your PDFs and stay with an idea.", href: "https://librarian.thecreatingco.com/" },
  { name: "Bounce", kind: "Sound", line: "A listening queue with EQ, in the browser.", href: "https://bounce.thecreatingco.com/browser/" },
  { name: "Vox", kind: "Vocals", line: "Scale-based pitch correction and a generated harmony for a clean solo vocal.", href: "https://sattarimusic.com/studio/vox" },
  { name: "Key & BPM", kind: "Sound", line: "Find the key and tempo of a track.", href: "https://sattarimusic.com/studio/keybpm" },
  { name: "Cutout", kind: "Image", line: "Remove backgrounds and refine transparent images.", href: "https://luma.thecreatingco.com/cutout" },
  { name: "Cast", kind: "3D / jewelry", line: "Jewelry casting checks inside Form. Estimates, not manufacturing certification.", href: "https://form.thecreatingco.com/studio" },
  { name: "Glyph Studio", kind: "Type", line: "Draw your own font.", href: "https://glyph-studio-610.netlify.app/studio" },
  { name: "Void Studio", kind: "Experimental", line: "A darker lab for unreleased interfaces, visual systems and new tools.", href: "#void-studio" },
  { name: "Sattari Audio", kind: "Native audio", line: "The plugin suite: Entropy, Auto Pitch & more.", href: "https://sattari-audio-suite.netlify.app/" }
];

export const studioSuiteExamples = [
  {
    name: "Form",
    kind: "3D / CAD",
    href: "https://form.thecreatingco.com",
    line: "Start with a sketch or prompt, then move into precise objects, jewelry, fixtures and garment forms.",
    examples: ["Sketch a pendant", "Draw a garment", "Preview Cast"]
  },
  {
    name: "Luma",
    kind: "Image",
    href: "https://luma.thecreatingco.com",
    line: "Build campaign visuals in the browser with layers, type, print experiments, mockups and font play.",
    examples: ["Signature prints", "Type through photos", "Mockup + Glyph"]
  },
  {
    name: "StemDeck",
    kind: "Music",
    href: "https://stemdeck.thecreatingco.com",
    line: "Shape stems, arrange edits, split songs, check key and BPM, and turn performance into a real project.",
    examples: ["Stem shaping", "Replay edits", "Sattari Labs"]
  },
  {
    name: "ScenePilot",
    kind: "Film",
    href: "https://scenepilot.thecreatingco.com",
    line: "Blend scenes, find a film's feeling, build boards, caption edits and grade footage inside one flow.",
    examples: ["AutoCut", "Captions", "Board + Grade"]
  }
];

export const studioToolExamples = [
  {
    name: "Focused creative tools",
    kind: "Across the suite",
    body: "The studio is expanding beyond the four core apps into smaller tools for mockups, type, reads, listening queues, sessions and exports.",
    example: "Mockups, Glyph, Librarian, Bounce, Sessions and Locker all sit around the main suite."
  },
  {
    name: "Sattari Labs",
    kind: "Audio utility belt",
    body: "StemDeck connects into a deeper music toolkit for splitting stems, finding key and BPM, vocal experiments, visual canvases and press-ready assets.",
    example: "Split, Key & BPM, Vox, Canvas, Pocket and Press are framed as practical tools for artists."
  },
  {
    name: "Film tools",
    kind: "ScenePilot system",
    body: "ScenePilot is not just one editor; it branches into browser-first tools for cutting, captioning, storyboarding and grading footage fast.",
    example: "AutoCut, Captions, Board and Grade turn a song or clip folder into publishable motion."
  },
  {
    id: "void-studio",
    name: "Void Studio",
    kind: "Experimental lab",
    body: "A darker experimental studio for unreleased interfaces, visual worlds, strange prototype tools and the ideas that do not fit neatly into the main suite yet.",
    example: "Prototype visual systems, interface drops and exploratory tools live here before graduating into the main suite."
  }
];

export const capabilities = [
  { kicker: "Design & media", title: "Visuals that sell", body: "Brand, UI/UX, 3D assets, product imagery and AI-generated video, directed and finished by hand." },
  { kicker: "Native / systems", title: "Real-time & native apps", body: "C++ and Rust across audio DSP, GPU renderers, and desktop apps — VST3/AU plugins, an image editor with a Rust compositor, and macOS/iOS builds." },
  { kicker: "Applied AI", title: "AI that runs locally", body: "On-device inference with ONNX Runtime, screen-aware agents, LLM workflows, and pipelines that keep user data on the machine." },
  { kicker: "Product web", title: "Platforms & interfaces", body: "React and TypeScript front-ends, directory and commerce platforms, research dashboards, and the APIs behind them." },
  { kicker: "Backend", title: "Services & data", body: "APIs, database-backed workflows, automation, and production infrastructure built to hold up under real client constraints." },
  { kicker: "Interactive", title: "Games & real-time 3D", body: "Game design, playable prototypes, WebGL/Three.js scenes and real-time characters with lip-sync." }
];

export const experience = [
  { role: "Founder", org: "thecreateco", href: STUDIO_URL, body: "Building an independent creative software studio around Form, Luma, StemDeck and ScenePilot, plus focused tools, Sattari Labs utilities and Void Studio experiments. Lite editions stay free, with Pro desktop builds in development.", tags: ["Product", "Engineering", "Design", "Launch"] },
  { role: "Backend Developer", org: "Softech", body: "Built backend systems, APIs, automation, data flows, and production-facing web infrastructure.", tags: ["APIs & services", "Database workflows", "Client constraints"] },
  { role: "AI Engineering", org: "Applied AI training", body: "Applied AI workflows, agent patterns, automation, and product-minded implementation.", tags: ["AI prototyping", "LLM workflows", "Automation"] }
];

export const skills = [
  "Brand & UI design", "Websites", "Apps", "Game design", "3D assets", "AI image & video", "Local AI agents", "Automation",
  "C++", "Rust", "TypeScript", "Python", "React", "WebGL", "Three.js", "ONNX Runtime", "LLM Workflows", "Real-time DSP"
];

export const CONTACT_EMAIL = "armonnasiri@gmail.com";
