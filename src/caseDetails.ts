// In-depth case-study content for the priority projects, shown on /work/:slug.
//
// Every claim here was checked against the project's own repository or live site.
// Test counts are the number of test cases found in each repository's suites.
// Nothing here is an estimate of traffic, revenue or users: no such figures are published.

export type CaseDetail = {
  /** The problem, in the client's or user's terms */
  problem: string;
  /** What I was responsible for */
  role: string[];
  /** How the work ran, start to launch */
  process: { title: string; body: string }[];
  /** Architecture and technical decisions, with the reason for each */
  decisions: { title: string; body: string }[];
  challenges: { challenge: string; solution: string }[];
  /** Verifiable outcomes only */
  outcomes: { v: string; k: string }[];
  tech: string[];
  /** Public repository, or a note on why the source is not public */
  source?: { href: string; label: string };
  sourceNote?: string;
};

export const caseDetails: Record<string, CaseDetail> = {
  sattari: {
    problem:
      "Sattari Music is an independent music store in Woodland Hills. It needed to sell instruments online, take bookings for repairs, rentals and lessons, be found by people searching nearby, and give musicians a reason to come back between purchases.",
    role: ["Brand and web design", "Front-end and serverless back-end", "Payments, stock and staff tools", "Local SEO and landing pages", "Browser music tools (the Hub)", "AI video campaign"],
    process: [
      { title: "Map the store", body: "Inventory categories, services and how staff actually take bookings, before any design." },
      { title: "Design the shop", body: "A product-led homepage with clear routes into the shop, local services and the Hub." },
      { title: "Build and connect", body: "Checkout, stock, bookings and a staff dashboard, each behind automated tests." },
      { title: "Launch and grow", body: "Prerendered pages, local landing pages and a music lab that brings visitors back." }
    ],
    decisions: [
      { title: "Prerendered React", body: "Vite and React 18 with every route prerendered to static HTML, so search engines and link previews see real content without waiting for JavaScript." },
      { title: "Serverless on Netlify", body: "Netlify Functions, Edge Functions, Blobs and scheduled functions handle checkout, stock and bookings with no server to maintain." },
      { title: "Hosted Stripe Checkout", body: "Payments go through Stripe Checkout, so card details never touch the store's own site." },
      { title: "Tools inside the store", body: "The Hub brings browser audio tools, including a StemDeck port and a Demucs stem separator, into the same site as the shop." }
    ],
    challenges: [
      { challenge: "Online stock drifting from what is on the shelf.", solution: "Live stock data and a staff dashboard, so the team updates the shop as they sell in person." },
      { challenge: "Competing locally against big-box retailers.", solution: "Dedicated landing pages for Woodland Hills, Encino, Calabasas and Los Angeles, on prerendered pages." },
      { challenge: "Giving musicians a reason to return.", solution: "A free music lab in the Hub: stems, key and BPM, vocal tuning and audio-reactive loops." }
    ],
    outcomes: [
      { v: "Live", k: "store at sattarimusic.com, taking orders through Stripe" },
      { v: "1,370", k: "automated tests in the repository" },
      { v: "4", k: "local landing pages" },
      { v: "5+", k: "browser music tools in the Hub" }
    ],
    tech: ["React 18", "Vite", "Netlify Functions", "Edge Functions", "Netlify Blobs", "Stripe Checkout", "Web Audio", "Demucs"],
    source: { href: "https://github.com/armonon/sattari-custom-site", label: "sattari-custom-site on GitHub" }
  },

  "luma-studio": {
    problem:
      "Professional image editing usually means a subscription and a cloud account. Luma is a nondestructive editor that runs locally, in the browser and as a desktop app, and is honest about what it supports today.",
    role: ["Product and interface design", "Editing engine", "Desktop edition and Rust compositor", "On-device AI integration", "File-format compatibility", "Testing and release"],
    process: [
      { title: "Engine first", body: "Layers, blend modes and history built as a shared TypeScript engine before any UI polish." },
      { title: "Compatibility corpus", body: "Real PSD, PSB and camera files collected to test against, not just synthetic samples." },
      { title: "Two editions", body: "The same engine shipped in the browser and in a Tauri desktop app." },
      { title: "Public testing", body: "Released for public testing with limits documented in the product itself." }
    ],
    decisions: [
      { title: "One engine, two editions", body: "A single TypeScript editing engine is shared by web and desktop, so behaviour and file output match." },
      { title: "Threaded Rust compositor", body: "The desktop edition adds a threaded Rust f32 compositor for precision and speed on large documents." },
      { title: "Local AI models", body: "Segmentation and matting models run on the device for subject selection and background removal." },
      { title: "Explicit fallbacks", body: "Unsupported colour transforms and codecs fall back visibly instead of being advertised as native support." }
    ],
    challenges: [
      { challenge: "Opening PSD files without silently losing data.", solution: "PSD/PSB preflight, untouched-source byte passthrough and explicit warnings for any conversion." },
      { challenge: "Camera RAW across many manufacturers.", solution: "DNG sensor decode in the engine; on desktop, CR3, NEF, ARW and RAF through macOS ImageIO, with a labelled preview fallback." },
      { challenge: "AI edits on very large documents.", solution: "Selection-aware, bounded work regions, with cancellation and validation." }
    ],
    outcomes: [
      { v: "27", k: "Photoshop layer blend modes implemented" },
      { v: "1,200+", k: "automated tests, plus 37 Rust tests" },
      { v: "2", k: "editions from one engine: web and desktop" },
      { v: "Public", k: "source repository" }
    ],
    tech: ["TypeScript", "React", "Tauri", "Rust", "ONNX Runtime", "ICC colour"],
    source: { href: "https://github.com/armonon/luma-studio", label: "luma-studio on GitHub" }
  },

  "form-studio": {
    problem:
      "Most 3D tools in the browser model with meshes, which lose exact dimensions. Form Studio brings precise, editable CAD geometry to the browser, alongside 3D sculpting and garment work in the same workspace.",
    role: ["Product and interface design", "CAD kernel integration", "Parametric feature tree", "3D viewport", "File import and export", "Testing and release"],
    process: [
      { title: "Kernel choice", body: "Exact B-Rep geometry from Open CASCADE, the kernel used by professional CAD tools." },
      { title: "Recipes", body: "Generators such as a mounting bracket, so a first model takes seconds and stays editable." },
      { title: "Studios", body: "Precision CAD, a 3D studio and a garment studio sharing one document." },
      { title: "Active beta", body: "Version 0.40, in public testing and documented as not yet a signed release." }
    ],
    decisions: [
      { title: "Open CASCADE in a worker", body: "The CAD kernel runs as WebAssembly in a worker on the web, and natively on desktop, so modelling never freezes the interface." },
      { title: "Versioned documents", body: "Every document format change ships with a migration, v1 through v12, so older files keep opening." },
      { title: "Standard exchange formats", body: "STEP, STL, DXF and IFC, so work moves to and from other CAD and fabrication tools." },
      { title: "three.js viewport", body: "A three.js viewport renders the exact geometry the kernel produces." }
    ],
    challenges: [
      { challenge: "A heavy CAD kernel blocking the page.", solution: "Run it off the main thread in a WebAssembly worker." },
      { challenge: "A fast-moving file format breaking old work.", solution: "Twelve sequential document migrations, covered by tests." },
      { challenge: "Cloth and garments in a CAD tool.", solution: "A dedicated garment studio with fabric simulation, separate from precision modelling." }
    ],
    outcomes: [
      { v: "1,500+", k: "automated tests, plus 86 Rust tests" },
      { v: "v0.40", k: "active public beta" },
      { v: "12", k: "document schema versions, all migrated" },
      { v: "4", k: "exchange formats: STEP, STL, DXF, IFC" }
    ],
    tech: ["TypeScript", "Open CASCADE", "WebAssembly", "three.js", "Tauri", "Rust"],
    sourceNote: "The repository is private. Technical details are available on request."
  },

  "breakthyrule-eden": {
    problem:
      "BREAKTHYRULE wanted its brand to be a place, not a page: a world people explore, with the shop, music and community inside it rather than in a sidebar.",
    role: ["World and art direction", "3D asset pipeline", "three.js engineering", "AI character (the Librarian)", "Shop and character creator", "Mobile touch controls"],
    process: [
      { title: "World plan", body: "Rooms and districts mapped to what the brand sells and shares." },
      { title: "Asset pipeline", body: "Models lit and baked in Blender, then optimised for the web." },
      { title: "Systems", body: "Movement, characters, shop, music and an AI guide built into the world." },
      { title: "Public preview", body: "Released as a public preview while the world keeps growing." }
    ],
    decisions: [
      { title: "Baked lighting", body: "Lighting is baked in Blender, so scenes look rich without real-time lighting cost on phones." },
      { title: "glTF-transform", body: "Every asset is compressed and optimised with glTF-transform before it ships." },
      { title: "three.js 0.187", body: "A custom three.js engine rather than a game-engine export, keeping the site light and linkable." },
      { title: "An AI guide", body: "The Librarian is a character who answers questions about the world, backed by a language model." }
    ],
    challenges: [
      { challenge: "Heavy 3D on mobile networks.", solution: "Baked lighting and compressed, optimised assets." },
      { challenge: "Navigation for people who don't play games.", solution: "Touch controls and a play menu that jumps straight to each area." },
      { challenge: "Commerce inside a world.", solution: "A shop and character creator that live in the scene, not in an overlay." }
    ],
    outcomes: [
      { v: "Public", k: "preview, live and explorable" },
      { v: "Public", k: "source repository" },
      { v: "Phone", k: "and desktop, with touch controls" }
    ],
    tech: ["three.js", "Blender", "glTF-transform", "JavaScript", "Netlify", "LLM integration"],
    source: { href: "https://github.com/armonon/breakthyrule-eden-showroom", label: "breakthyrule-eden-showroom on GitHub" }
  },

  scenepilot: {
    problem:
      "Cutting a music video to the beat by hand takes hours. ScenePilot analyses the music, places clips and effects against its structure, and leaves the editor in control of the result.",
    role: ["Product and interface design", "Beat and structure analysis", "Timeline editor", "In-browser rendering", "Desktop app and auto-update", "Release pipeline"],
    process: [
      { title: "Analysis", body: "Read the track's beats and sections first; everything else follows the music." },
      { title: "Arrange", body: "Generate a first cut against that structure, then let the editor refine it." },
      { title: "Render", body: "Export the MP4 in the browser, with no upload or render queue." },
      { title: "Ship", body: "A web app plus a macOS app that updates itself from GitHub Releases." }
    ],
    decisions: [
      { title: "Render in the browser", body: "Mediabunny encodes the MP4 on the user's machine, so footage never has to be uploaded." },
      { title: "Web and desktop", body: "Next.js (vinext) on Cloudflare for the web, and an Electron app for macOS." },
      { title: "Automatic releases", body: "Each push to main builds a new Apple Silicon DMG and publishes it to GitHub Releases, which the app checks for updates." }
    ],
    challenges: [
      { challenge: "Long uploads and server render costs.", solution: "Encode the final video in the browser." },
      { challenge: "Keeping desktop users current.", solution: "An update check against the public releases channel, at startup and from the Help menu." }
    ],
    outcomes: [
      { v: "v0.1.6", k: "in public testing" },
      { v: "2", k: "platforms: web and macOS" },
      { v: "Public", k: "source and release channel" }
    ],
    tech: ["TypeScript", "Next.js (vinext)", "Cloudflare", "Electron", "Mediabunny"],
    source: { href: "https://github.com/armonon/scenepilot-studio", label: "scenepilot-studio on GitHub" }
  },

  skybound: {
    problem:
      "Most browser games either feel weightless or need a big engine download. SKYBOUND aims for real physical comedy, bodies that tumble, bounce and fly, in a game that opens instantly from a link on a laptop or a phone.",
    role: ["Game design and rules", "Physics and ragdoll engine", "three.js rendering and stadium", "Bot opponents", "Controls for keyboard, gamepad and touch", "Trailer and launch site"],
    process: [
      { title: "Rules as code", body: "Gameplay math lives in plain modules with no browser dependencies, so the same rules run in the game and in Node tests." },
      { title: "Bodies that react", body: "Players are articulated ragdolls, so every hit and landing plays out physically rather than as a canned animation." },
      { title: "Everywhere", body: "A full three.js renderer, plus a Canvas2D renderer with the same rules for devices without WebGL 2." },
      { title: "Launch", body: "A 21-second trailer and a public build anyone can play from a link." }
    ],
    decisions: [
      { title: "Deterministic physics", body: "Gravity, bounce and projectile maths are deterministic and shared by the browser and Node tests, so gameplay can be checked without a screen." },
      { title: "XPBD ragdolls", body: "Each player is 15 weighted particles held together by XPBD bones and torso braces, with soft joint limits, self-collision and per-joint trampoline contacts." },
      { title: "Two renderers, one game", body: "three.js powers the full game; if WebGL 2 is missing or fails, it falls back to a Canvas2D renderer with the same playable rules." },
      { title: "Fair difficulty", body: "Rookie, Pro and Elite change how the bots aim, time and catch; the physics is identical at every level." }
    ],
    challenges: [
      { challenge: "Ragdolls that are fun, not floppy.", solution: "Soft flex limits, torso braces and a single whole-body rebound per landing keep bodies readable while still tumbling." },
      { challenge: "Phones and older machines.", solution: "Automatic fallback to the Canvas2D renderer, remembered for the session if 3D fails to start." },
      { challenge: "One set of controls for every input.", solution: "A single steer-and-act gesture shared by both renderers: drag to strafe, second finger to throw, flick to flip; keyboard, mouse and gamepad map to the same actions." }
    ],
    outcomes: [
      { v: "Public", k: "build, free to play in the browser" },
      { v: "3", k: "arenas, plus 3 bot difficulty levels" },
      { v: "2", k: "renderers: three.js and Canvas2D fallback" },
      { v: "15", k: "simulated particles in every ragdoll" }
    ],
    tech: ["three.js", "JavaScript (ES modules)", "XPBD physics", "WebGL 2", "Canvas2D", "Web Audio", "Gamepad API"],
    sourceNote: "No public repository. The game is free to play at skybound-ragdoll-arena.netlify.app."
  },

  "universal-computer-operator": {
    problem:
      "AI assistants can describe what to do on a computer, but leave the doing to you. Universal Computer Operator is an agent that sees the Mac screen, proposes a plan, and carries it out inside real apps, with approval before anything sensitive.",
    role: ["Agent design and safety model", "macOS integration", "Tauri and Rust back-end", "React interface", "Model integration"],
    process: [
      { title: "Safety model first", body: "Every action classed as safe, reversible or sensitive before any automation was written." },
      { title: "Typed actions", body: "Tasks built from typed actions, not free-form shell commands." },
      { title: "Templates", body: "Repeatable workflows for real jobs: Photoshop background removal, batch resizing, folder organising." },
      { title: "Private build", body: "Not publicly distributed. The same codebase now ships as Reclaim, with the operator overlays turned off." }
    ],
    decisions: [
      { title: "Approval tiers", body: "Safe suggestions run, reversible actions are logged, and sensitive actions wait for explicit approval." },
      { title: "No raw shell strings", body: "Terminal work goes through typed commands, which removes a whole class of injection mistakes." },
      { title: "Local or hosted models", body: "Runs on a local model through Ollama, or on the Anthropic API or Codex CLI when chosen." },
      { title: "Session history", body: "Sessions and recipes are stored in SQLite, with an emergency stop for running jobs." }
    ],
    challenges: [
      { challenge: "Trusting an agent with your computer.", solution: "Plan first, tiered approvals, logs and an emergency stop." },
      { challenge: "Driving apps that have no API.", solution: "Screen capture to read state, and AppleScript to act inside the apps." }
    ],
    outcomes: [
      { v: "3", k: "approval tiers: safe, reversible, sensitive" },
      { v: "4", k: "workflow templates" },
      { v: "3", k: "model back-ends, one fully local" }
    ],
    tech: ["Tauri 2", "Rust", "React", "TypeScript", "SQLite", "AppleScript", "Ollama"],
    sourceNote: "Private repository, no public download. The same codebase now ships as Reclaim, a free Mac public alpha."
  }
};
