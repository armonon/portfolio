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
