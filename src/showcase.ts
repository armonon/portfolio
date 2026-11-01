// Website case studies with room-by-room walkthroughs, and the full app catalogue
// (mirrors momentous-store.netlify.app/apps, plus apps listed elsewhere).

export type WalkthroughStep = { room: string; image: string; caption: string };

export type SiteShowcase = {
  id: string;
  name: string;
  client: string;
  kind: string;
  url: string;
  summary: string;
  highlights: string[];
  steps: WalkthroughStep[];
  theme: "light" | "dark";
};

export const siteShowcases: SiteShowcase[] = [
  {
    id: "synthesis",
    name: "Synthesis",
    client: "Synthesis — Clothing & Culture",
    kind: "Fashion label · 3D showroom & store",
    url: "https://synthesis-documentation.com",
    summary:
      "A clothing label's site built as a gallery you can walk through. Visitors browse the collection off a rack in a 3D room, then move through the lookbook, the art wall, the runway film and the label's music before buying a piece.",
    highlights: ["Walkable 3D showroom", "28 garments, each with a product page", "Lookbook, film and music rooms", "Bag, checkout and shipping flow"],
    theme: "light",
    steps: [
      { room: "Showroom", image: "/photos/walkthrough/synthesis-showroom.jpg", caption: "You arrive in the room: the whole collection hangs on one rack, and every garment is clickable." },
      { room: "Garments", image: "/photos/walkthrough/synthesis-garments.jpg", caption: "Pick a piece to bring it forward, spin it, and see price, sizing and details beside it." },
      { room: "Gallery", image: "/photos/walkthrough/synthesis-gallery.jpg", caption: "32 lookbook photographs hung salon-style. Select any frame to look closer." },
      { room: "Art wall", image: "/photos/walkthrough/synthesis-art_wall.jpg", caption: "The label's collage artwork gets its own wall, so the brand world comes through as well as the product." },
      { room: "Film", image: "/photos/walkthrough/synthesis-film.jpg", caption: "The runway film plays on a screen inside the room, without sending visitors off-site." },
      { room: "Music", image: "/photos/walkthrough/synthesis-music.jpg", caption: "A record player with the label's soundtrack: tracklist, transport and vinyl on the wall." }
    ]
  },
  {
    id: "eden",
    name: "BREAKTHYRULE — Eden",
    client: "BREAKTHYRULE",
    kind: "Streetwear brand · explorable 3D world",
    url: "https://breakthyrule-eden-showroom.netlify.app",
    summary:
      "A codex worn on the body: the streetwear label's world rebuilt as a garden you can explore. Each building is a chapter (library, artwork, amphitheater, vault), and an AI librarian you can talk to guides you through the brand.",
    highlights: ["Explorable Garden of Eden scene", "Talk-to-the-librarian AI guide", "Artwork room, music amphitheater & product vault", "Multiplayer-ready: become a character"],
    theme: "dark",
    steps: [
      { room: "Eden", image: "/photos/walkthrough/eden-eden.jpg", caption: "Chapter 00: you start in the Garden of Eden, with water, stone paths and the buildings ahead." },
      { room: "Library", image: "/photos/walkthrough/eden-library.jpg", caption: "The Open Library holds the brand's codex. Walk up and talk to the librarian, an AI guide." },
      { room: "Artwork", image: "/photos/walkthrough/eden-gallery.jpg", caption: "A gallery of the label's art and garments, with Divine Mother at the centre." },
      { room: "Amphitheater", image: "/photos/walkthrough/eden-music.jpg", caption: "An open-air amphitheater for the label's music, tucked into the trees." },
      { room: "Vault", image: "/photos/walkthrough/eden-vault.jpg", caption: "The Vault: product displayed on gallery shelving, linked straight through to the shop." }
    ]
  }
];

export type AppEntry = { name: string; line: string; category: "Creative" | "Audio" | "Productivity" | "Community" | "AI"; platforms: string; status: string; href: string; logo?: string };

const M = "https://momentous-store.netlify.app/p/";

export const appCatalogue: AppEntry[] = [
  { name: "Form Studio", line: "Sketch, model and refine objects with precise dimensions.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}form`, logo: "form" },
  { name: "Luma Studio", line: "Create with editable images, masks, typography and layers.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}luma`, logo: "luma" },
  { name: "StemDeck", line: "Arrange audio, shape the mix and perform with stems.", category: "Audio", platforms: "Web", status: "Public testing", href: `${M}stemdeck`, logo: "stemdeck" },
  { name: "ScenePilot", line: "Edit footage, sound and titles into a film.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}scenepilot` },
  { name: "Converter", line: "Convert images, PDFs, audio, video and archives. Files never leave your device.", category: "Productivity", platforms: "Web · Desktop", status: "Free", href: "https://thecreatingco.com/forma/" },
  { name: "Universal Computer Operator", line: "A local AI agent that sees your screen, plans, asks, then acts.", category: "AI", platforms: "macOS", status: "Private build", href: "#" },
  { name: "Photobooth Studio", line: "Your artwork, on the garment.", category: "Creative", platforms: "macOS · Web", status: "Public testing", href: `${M}photobooth-studio` },
  { name: "Ghost Studio", line: "Explore a visual garment study from reference photos.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}ghost`, logo: "ghost" },
  { name: "Librarian", line: "Gather documents, read and return to your ideas.", category: "Productivity", platforms: "Web", status: "Public testing", href: `${M}librarian`, logo: "librarian" },
  { name: "Reclaim", line: "Review files and duplicates; free Mac cleanup alpha.", category: "Productivity", platforms: "Web · macOS", status: "Public testing", href: `${M}reclaim`, logo: "reclaim" },
  { name: "Bounce", line: "Play local music, shape the EQ and build a listening queue.", category: "Audio", platforms: "Web", status: "Public testing", href: `${M}bounce`, logo: "bounce" },
  { name: "Glyph Studio", line: "Draw letterforms, refine spacing and export a font.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}glyph-studio`, logo: "glyph-studio" },
  { name: "Locker", line: "Keep files from thecreateco apps together on this device.", category: "Productivity", platforms: "Web", status: "Public testing", href: `${M}locker`, logo: "locker" },
  { name: "Sessions", line: "Listen together, queue tracks and chat in a shared room.", category: "Community", platforms: "Web", status: "Public testing", href: `${M}sessions`, logo: "sessions" },
  { name: "Pocket Studio", line: "Record, trim and keep voice memos, melodies and sounds.", category: "Audio", platforms: "Web", status: "Public testing", href: `${M}pocket-studio`, logo: "pocket-studio" },
  { name: "AutoCut", line: "Turn a song and your clips into a beat-synced edit.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}autocut`, logo: "autocut" },
  { name: "Captions", line: "Transcribe speech, edit animated captions and export subtitles.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}captions`, logo: "captions" },
  { name: "Board", line: "Take a script into a shot list and a sketchable storyboard.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}board`, logo: "board" },
  { name: "Grade", line: "Match a reference image's color and export a .cube LUT.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}grade`, logo: "grade" },
  { name: "Split", line: "Separate a song into stems, download WAVs or move into StemDeck.", category: "Audio", platforms: "Web", status: "Public testing", href: `${M}split`, logo: "split" },
  { name: "Key & BPM", line: "Analyze a batch of tracks for key, Camelot code and tempo.", category: "Audio", platforms: "Web", status: "Public testing", href: `${M}key-bpm`, logo: "key-bpm" },
  { name: "Vox", line: "Pitch-correct a solo vocal, add a harmony and export WAV.", category: "Audio", platforms: "Web", status: "Public testing", href: `${M}vox`, logo: "vox" },
  { name: "Canvas", line: "Make an audio-reactive vertical loop from music and cover art.", category: "Audio", platforms: "Web", status: "Public testing", href: `${M}canvas`, logo: "canvas" },
  { name: "Pocket", line: "Sketch a beat and bass line, then export a loop or stems.", category: "Audio", platforms: "Web", status: "Public testing", href: `${M}pocket`, logo: "pocket" },
  { name: "Press", line: "Build an artist press kit and export HTML or print to PDF.", category: "Audio", platforms: "Web", status: "Public testing", href: `${M}press`, logo: "press" },
  { name: "Mockups", line: "Place artwork on stylized garments, posters and product mockups.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}mockups`, logo: "mockups" },
  { name: "Glyph", line: "Draw letterforms, preview your font and install it in Luma.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}glyph`, logo: "glyph" },
  { name: "Cast", line: "Review ring size, wall thickness and mesh health for casting.", category: "Creative", platforms: "Web", status: "Preview", href: `${M}cast`, logo: "cast" },
  { name: "Reframe", line: "Adapt video framing for vertical, square and landscape.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}reframe` },
  { name: "Untiled", line: "A music player for the files you own.", category: "Audio", platforms: "macOS · iOS", status: "Coming soon", href: `${M}untiled` },
  { name: "Cutout", line: "Remove backgrounds and refine transparent images.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}cutout` },
  { name: "Loop", line: "Turn a clip into a short video loop.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}loop` },
  { name: "The Circle", line: "Profiles, projects, collections and discussions.", category: "Community", platforms: "Web", status: "Public testing", href: `${M}circle` },
  { name: "WebLab", line: "Build a single web page with visual blocks and HTML/CSS output.", category: "Creative", platforms: "Web", status: "Preview", href: `${M}weblab` },
  { name: "Animate", line: "Frame-by-frame and tween animation.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}animate`, logo: "animate" },
  { name: "Moodboard", line: "Collect references and shape a visual direction.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}moodboard`, logo: "moodboard" },
  { name: "Portfolio Studio", line: "Build and export a portfolio.", category: "Creative", platforms: "Web", status: "Public testing", href: `${M}portfolio`, logo: "portfolio" },
  { name: "Website Checkup", line: "Inspect links, page metadata and forms.", category: "Productivity", platforms: "Web", status: "Public testing", href: `${M}website-checkup` },
  { name: "HOLE", line: "Search, collect and explore with Trails.", category: "Community", platforms: "Web", status: "Public testing", href: `${M}hole` },
  { name: "NOW Messenger", line: "Live rooms and private messaging.", category: "Community", platforms: "Web", status: "Public testing", href: `${M}now-messenger`, logo: "now-messenger" }
];

export const appCategories = ["All", "Creative", "Audio", "Productivity", "Community", "AI"] as const;

export const heroWords = ["Apps", "Games", "Software", "Websites", "3D assets", "Images", "Video", "AI agents"];

/** Best work: one flagship per service. `project` ids point at the projects list in App.tsx. */
export type Flagship = {
  project?: string;
  title: string;
  service: string;
  hook: string;
  forYou: string;
  stat: string;
  media: { video?: string; image: string };
  live?: string;
  liveLabel?: string;
  anchor?: string;
};

export const flagships: Flagship[] = [
  {
    project: "luma-studio",
    title: "Luma Studio",
    service: "Apps & software",
    hook: "A Photoshop-class image editor written in Rust on its own GPU renderer, with AI that runs fully offline.",
    forYou: "If I can build a pro editor from the renderer up, your app is in safe hands.",
    stat: "108 passing tests",
    media: { video: "/videos/luma-demo.mp4", image: "/photos/luma-shot.png" },
    live: "https://luma.thecreatingco.com",
    liveLabel: "Try Luma"
  },
  {
    project: "form-studio",
    title: "Form Studio",
    service: "3D & assets",
    hook: "Describe a part in plain English (“an 80 × 50 mm bracket with 4 holes”) and get exact, editable CAD geometry.",
    forYou: "Product models, jewelry, fixtures and garment forms, ready to render or manufacture.",
    stat: "200+ tests",
    media: { video: "/videos/form-studio-demo.mp4", image: "/photos/form-studio-shot.png" },
    live: "https://form.thecreatingco.com",
    liveLabel: "Try Form"
  },
  {
    project: "sattari-ai-ad",
    title: "ScenePilot × Sattari ad",
    service: "AI video",
    hook: "I built the editor and made the ad: a beat-synced video tool that renders in the browser, and a generated spot cut with it.",
    forYou: "Campaign-grade video for your brand without a film crew's budget.",
    stat: "Tool + finished ad",
    media: { video: "/videos/sattari-ai-ad.mp4", image: "/photos/sattari-ai-ad-poster.jpg" },
    live: "https://scenepilot.thecreatingco.com",
    liveLabel: "Try ScenePilot"
  },
  {
    title: "BREAKTHYRULE Eden",
    service: "Websites",
    hook: "A streetwear brand rebuilt as a walkable garden, with an AI librarian, an art gallery, a music amphitheater and a product vault.",
    forYou: "A website people remember and share, with the store built into the experience.",
    stat: "Explorable 3D world",
    media: { image: "/photos/walkthrough/eden-eden.jpg" },
    live: "https://breakthyrule-eden-showroom.netlify.app",
    liveLabel: "Walk through it",
    anchor: "websites"
  },
  {
    project: "universal-computer-operator",
    title: "Universal Computer Operator",
    service: "AI agents",
    hook: "A local AI agent that sees the screen, plans, asks for approval, then works inside real Mac apps.",
    forYou: "The same approach, set up on your machine to take repetitive work off your plate.",
    stat: "Runs 100% locally",
    media: { video: "/videos/uco-demo.mp4", image: "/photos/uco-example.svg" },
    anchor: "agents"
  },
  {
    project: "model-studio",
    title: "Photobooth Studio",
    service: "Brands & e-commerce",
    hook: "Drop in garment artwork and get polished product photos, with background removal done on-device.",
    forYou: "Shop-ready product imagery for every drop, without a photoshoot.",
    stat: "Free · offline",
    media: { video: "/videos/model-studio-demo.mp4", image: "/photos/model-studio-clip.svg" },
    live: "https://photoboothstudio-b6ac09.netlify.app",
    liveLabel: "Try Photobooth"
  }
];

/** Everyday free tools. Each was tested live with a real file before being featured. */
export type Tool = {
  name: string;
  job: string;
  line: string;
  tested: string;
  href: string;
  accepts: ("image" | "video" | "audio" | "document" | "any" | "url")[];
  tasks: string[];
  logo?: string;
  pitch?: string;
};

export const toolbox: Tool[] = [
  {
    name: "Converter",
    job: "Files",
    line: "Images, PDFs, spreadsheets, audio, video and archives, converted in your browser.",
    tested: "PDF → Excel, JPG → PNG and WAV → MP3, all finished in seconds",
    href: "https://thecreatingco.com/forma/",
    accepts: ["any", "image", "video", "audio", "document"],
    tasks: ["convert a file", "pdf to excel", "jpg to png", "wav to mp3", "change file format", "heic to jpg", "video to mp4"]
  },
  {
    name: "Cutout",
    job: "Images",
    line: "Remove a background in one click, then refine the edge with a brush.",
    tested: "Clean subject cut from a busy, low-light video frame",
    href: "https://luma.thecreatingco.com/cutout",
    accepts: ["image"],
    tasks: ["remove background", "transparent png", "cut out a person", "product photo background"]
  },
  {
    name: "Captions",
    job: "Video",
    line: "Auto-transcribe speech, style animated captions, export SRT or VTT.",
    tested: "Transcribed 16 words from an ad in 16 seconds",
    href: "https://scenepilot.thecreatingco.com/tools/captions/",
    accepts: ["video", "audio"],
    tasks: ["add subtitles", "transcribe video", "make captions", "srt file", "speech to text"],
    logo: "captions"
  },
  {
    name: "Reframe",
    job: "Video",
    line: "Turn horizontal video into 9:16, 4:5 or 1:1, and the crop follows faces.",
    tested: "Found the subject and built a smooth 9:16 camera path",
    href: "https://scenepilot.thecreatingco.com/tools/reframe/",
    accepts: ["video"],
    tasks: ["make vertical video", "crop for tiktok", "instagram reel size", "resize video for stories"]
  },
  {
    name: "Split",
    job: "Audio",
    line: "Separate any song into vocals, drums, bass and instruments, then mix or export.",
    tested: "Four clean stems from a 20-second track",
    href: "https://sattarimusic.com/studio/split",
    accepts: ["audio"],
    tasks: ["separate vocals", "remove vocals", "karaoke track", "extract drums", "split stems", "acapella"],
    logo: "split"
  },
  {
    name: "Key & BPM",
    job: "Audio",
    line: "Batch-detect tempo, musical key and Camelot code for your tracks.",
    tested: "Read tempo instantly and was honest when the key was unclear",
    href: "https://sattarimusic.com/studio/keybpm",
    accepts: ["audio"],
    tasks: ["find bpm", "find song key", "camelot", "tempo of a song", "dj set prep"],
    logo: "key-bpm"
  },
  {
    name: "Reclaim",
    job: "Mac",
    line: "Review what's filling your Mac, quarantine it, and restore anything you change your mind about.",
    tested: "Signed, notarized installer downloads cleanly (13.7 MB, macOS 13+)",
    href: "https://thecreatingco.com/products/reclaim/",
    accepts: [],
    tasks: ["free up mac storage", "find duplicate files", "clean my mac", "disk space"],
    logo: "reclaim"
  },
  {
    name: "Website Checkup",
    job: "Web",
    line: "Scan any site for metadata, heading, link and form problems, with fixes listed by priority.",
    tested: "Flagged 4 fixable issues on my own site; this redesign fixes all four",
    href: "https://thecreatingco.com/checkup/",
    accepts: ["url"],
    tasks: ["check my website", "seo audit", "broken links", "meta description", "website problems"],
    pitch: "Found issues? I can fix them for you."
  }
];

/** Full apps, built end to end: recorded live from the running apps. */
export type FullApp = {
  id: string;
  name: string;
  kind: string;
  pitch: string;
  video: string;
  poster: string;
  phone?: { video: string; poster: string };
  shots: { src: string; label: string }[];
  features: string[];
  layers: string[];
  platforms: string;
  live: string;
};

export const fullApps: FullApp[] = [
  {
    id: "librarian",
    name: "Librarian",
    kind: "Reading & research · web + iPhone",
    pitch: "A personal library that searches ten catalogs at once (Open Library, Internet Archive, the Library of Congress, Europeana and more), groups duplicate editions, scores metadata quality, and saves books for offline reading.",
    video: "/videos/librarian-iphone.mp4",
    poster: "/photos/librarian-desktop.jpg",
    phone: { video: "/videos/librarian-iphone.mp4", poster: "/photos/librarian-iphone-results.jpg" },
    shots: [
      { src: "/photos/librarian-desktop.jpg", label: "Search across 10 catalogs" },
      { src: "/photos/librarian-iphone-home.jpg", label: "Your reading room" },
      { src: "/photos/librarian-iphone-results.jpg", label: "Live results on iPhone" },
      { src: "/photos/librarian-iphone-detail.jpg", label: "Book detail & sources" }
    ],
    features: ["Federated search across 10 library catalogs", "Duplicate editions grouped, metadata scored", "Installs to the iPhone home screen and works offline", "Bring your own PDFs; everything stays on the device"],
    layers: ["Product design", "Responsive UI", "Search aggregation", "Offline storage", "PWA install"],
    platforms: "Web · iPhone · iPad · desktop",
    live: "https://librarian.thecreatingco.com/"
  },
  {
    id: "form",
    name: "Form Studio",
    kind: "3D & CAD · web",
    pitch: "Precision CAD in the browser. Start from a recipe like a mounting bracket and you get exact B-Rep geometry with every dimension still editable, plus 3D sculpting and garment patterns in the same workspace.",
    video: "/videos/form-live.mp4",
    poster: "/photos/form-live.jpg",
    shots: [{ src: "/photos/form-live.jpg", label: "Mounting bracket, exact geometry" }, { src: "/photos/form-studio-shot.png", label: "Start center & recipes" }],
    features: ["Exact OpenCASCADE B-Rep modelling, not meshes", "Plain-language commands on a parametric feature tree", "Precision CAD, 3D studio and garment studio in one app", "Local-first with backups and recovery"],
    layers: ["CAD kernel integration", "3D viewport", "Parametric engine", "AI commands", "200+ tests"],
    platforms: "Web · native in development",
    live: "https://form.thecreatingco.com/studio"
  },
  {
    id: "luma",
    name: "Luma Studio",
    kind: "Image editing · web + Mac",
    pitch: "A full image editor: layers, masks, brushes, warp, heal, smart select and editable AI, on a custom GPU renderer written in Rust. This is a real session, painting straight onto the canvas.",
    video: "/videos/luma-live.mp4",
    poster: "/photos/luma-live.jpg",
    shots: [{ src: "/photos/luma-live.jpg", label: "Brush engine on a live canvas" }, { src: "/photos/luma-shot.png", label: "Workspace" }],
    features: ["Custom wgpu renderer and document engine", "Offline AI subject select and background removal", "24-brush library, layers, blend passes, history", "Opens PSD, RAW and its own project format"],
    layers: ["Rust engine", "GPU rendering", "On-device AI", "Pro UI", "108 tests"],
    platforms: "Web · macOS",
    live: "https://luma.thecreatingco.com/studio"
  },
  {
    id: "hole",
    name: "HOLE",
    kind: "Search & discovery · web",
    pitch: "A search engine for the rest of the internet: independent sites, archived pages, books and research, all in one feed. Then you go down the hole and keep the trail of what you found.",
    video: "/videos/hole-live.mp4",
    poster: "/photos/hole-live.jpg",
    shots: [{ src: "/photos/hole-live.jpg", label: "Results from archives, books & research" }],
    features: ["Six connected public indexes in one search", "Homepage previews for every result", "Trails to save and retrace discoveries", "No paid placement"],
    layers: ["Search backend", "Index connectors", "Result ranking", "Visual UI"],
    platforms: "Web",
    live: "https://thecreatingco.com/community/hole"
  },
  {
    id: "stemdeck",
    name: "StemDeck",
    kind: "Music performance · web + Mac",
    pitch: "A performance instrument that records every move of a live set and turns it into an arrangement you can edit: four decks, stems, pads, FX and a mixer.",
    video: "/videos/stemdeck-demo.mp4",
    poster: "/photos/stemdeck-shot.png",
    shots: [{ src: "/photos/stemdeck-shot.png", label: "Perform view" }],
    features: ["Four decks with live stem separation", "Retrospective capture into an editable timeline", "Pads, global FX, key and tempo sync", "Browser edition plus a native C++/JUCE build"],
    layers: ["Real-time audio", "C++ / JUCE", "Stem separation", "Performance UI"],
    platforms: "Web · macOS",
    live: "https://stemdeck.thecreatingco.com/studio"
  }
];

/** Sattari: the client brand built end to end (store site, browser tools, plugin suite, AI ad). */
export const sattariCase = {
  stats: [
    { v: "1", k: "full e-commerce site + local SEO pages" },
    { v: "5+", k: "browser music tools in the Hub" },
    { v: "4", k: "flagship plugins in development" },
    { v: "1", k: "AI-generated video ad" }
  ],
  tabs: [
    {
      id: "site",
      label: "The store website",
      title: "sattarimusic.com",
      body: "A music store in Woodland Hills with a real shop: cymbals, sticks, violins, guitars and essentials, plus checkout, service booking for repairs, rentals, lessons and rehearsal space, and local pages for Encino, Calabasas and Los Angeles.",
      video: "/videos/sattari-site-scroll.mp4",
      phone: "/photos/sattari/sat-mobile.jpg",
      shots: ["/photos/sattari/sat-home.jpg", "/photos/sattari/sat-shop.jpg", "/photos/sattari/sat-cymbals.jpg", "/photos/sattari/sat-services.jpg"],
      link: { href: "https://sattarimusic.com", label: "Visit sattarimusic.com" }
    },
    {
      id: "hub",
      label: "Sattari Hub tools",
      title: "A free music lab, inside the store",
      body: "The Hub turns the store into a destination: StemDeck for performing, Split for stems, Key & BPM, Vox for pitch correction and harmony, and Canvas for audio-reactive loops. All of them run in the browser, on the musician's own device.",
      video: "/videos/stemdeck-demo.mp4",
      shots: ["/photos/sattari/sat-hub.jpg", "/photos/sattari/sat-vox.jpg", "/photos/sattari/sat-canvas.jpg", "/photos/stemdeck-shot.png"],
      link: { href: "https://sattarimusic.com/hub", label: "Open the Hub" }
    },
    {
      id: "suite",
      label: "Sattari Audio plugins",
      title: "Sound without a ceiling",
      body: "A native plugin suite in development. Modular is a chain platform with 22 native effects, layered instruments and VST3 hosting. Royal Chain is a vocal finishing chain, Auto Pitch handles tuning and harmony, and Mix proposes gain, EQ and dynamics moves. Tools and Compass round it out.",
      video: "/videos/sattari-suite-scroll.mp4",
      shots: ["/photos/sattari/suite-home.jpg", "/photos/sattari/suite-modular.jpg", "/photos/sattari/suite-autopitch.jpg", "/photos/sattari/suite-royal.jpg"],
      link: { href: "https://sattari-audio-suite.netlify.app/", label: "See the suite" }
    },
    {
      id: "ad",
      label: "AI video ad",
      title: "The campaign, generated",
      body: "A 35-second generated spot: a cast of characters drumming through one theatrical hall, cut to the beat, with a voiceover and a scan-to-shop QR end card.",
      video: "/videos/sattari-ai-ad.mp4",
      shots: ["/photos/sattari-ai-ad-poster.jpg"],
      link: { href: "https://sattarimusic.com", label: "Shop Sattari" }
    }
  ]
};
