import { AnimatePresence, motion, useInView, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, X, ExternalLink, Code2, Mail, Sparkles, Download, RefreshCw, ArrowUpRight, ArrowDown, Check, Bot, Search, Upload, ShieldCheck } from "lucide-react";
import { appCatalogue, appCategories, flagships, fullApps, heroWords, sattariCase, siteShowcases, toolbox, type Flagship, type SiteShowcase, type Tool } from "./showcase";
import { agentOffer, artPieces, engagementTypes, inquiryOptions, process, services } from "./services";
import { radarDirectory, radarDirectoryGroups, radarEvidenceLedger, radarIdeaFeed, radarLanes, radarMetrics, radarNextBuildSteps, radarOpportunities, radarSoftwareProjects } from "./productRadarData";

type ControlValues = Record<string, string | number | boolean>;

type ControlDefinition = {
  key: string;
  label: string;
  type: "text" | "select" | "range" | "checkbox" | "textarea";
  value: string | number | boolean;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
};

type PrototypeScenario = {
  eyebrow: string;
  prompt: string;
  controls: ControlDefinition[];
  generate: (values: ControlValues, tick: number) => {
    headline: string;
    summary: string;
    score: number;
    cards: { label: string; value: string; detail: string }[];
    steps: string[];
    artifact: string;
  };
};

const asString = (value: string | number | boolean | undefined, fallback = "") => typeof value === "string" ? value : fallback;
const asNumber = (value: string | number | boolean | undefined, fallback = 0) => typeof value === "number" ? value : fallback;
const asBoolean = (value: string | number | boolean | undefined) => value === true;

const createDownloadHref = (name: string, content: string) => `data:text/plain;charset=utf-8,${encodeURIComponent(`Product Radar prototype artifact: ${name}\n\n${content}`)}`;

const readinessPhase = (score: number) => {
  if (score >= 7) return "Live";
  if (score >= 5) return "Beta";
  if (score >= 3) return "In development";
  return "Early build";
};

function LazyVideo({ src, className }: { src: string; autoPlay?: boolean; muted?: boolean; loop?: boolean; playsInline?: boolean; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { once: false, margin: "100px" });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // must be set as DOM properties — React's muted/playsInline props are unreliable on mobile
    el.muted = true;
    el.playsInline = true;
    el.loop = true;
    if (!isInView) {
      el.pause();
      el.removeAttribute("src");
      el.load();
      return;
    }
    if (!el.getAttribute("src")) {
      el.src = src;
      el.load();
    }
    // play() rejects if called before the media is ready (common on mobile
    // connections), so retry once the browser says it can actually play
    const tryPlay = () => {
      el.play().catch(() => {});
    };
    tryPlay();
    el.addEventListener("canplay", tryPlay);
    return () => el.removeEventListener("canplay", tryPlay);
  }, [isInView, src]);
  return <video ref={ref} className={className} />;
}

const buildPrototypeScenario = (softwareId: string): PrototypeScenario => {
  switch (softwareId) {
    case "sattari-loop-doctor":
      return {
        eyebrow: "Interactive audio repair lab",
        prompt: "Change the loop condition, then generate a repair plan. This is prototype planning logic, not real DSP yet.",
        controls: [
          { key: "loopType", label: "Loop type", type: "select", value: "Vocal chop", options: ["Vocal chop", "Drum loop", "Melodic sample", "Bass loop"] },
          { key: "bpm", label: "Detected BPM", type: "range", value: 92, min: 60, max: 180, step: 1 },
          { key: "key", label: "Target key", type: "select", value: "F minor", options: ["F minor", "A minor", "C minor", "D# minor", "G major"] },
          { key: "tighten", label: "Timing tighten", type: "range", value: 62, min: 0, max: 100, step: 1 },
          { key: "stemSplit", label: "Include stem-aware plan", type: "checkbox", value: true },
        ],
        generate: (values) => {
          const tighten = asNumber(values.tighten, 62);
          const bpm = asNumber(values.bpm, 92);
          const loopType = asString(values.loopType, "Loop");
          const score = Math.min(96, 54 + Math.round(tighten * 0.32) + (asBoolean(values.stemSplit) ? 8 : 0));
          return {
            headline: `${loopType} repair plan · ${score}% usable preview`,
            summary: `Prepare a ${bpm} BPM ${loopType.toLowerCase()} in ${asString(values.key, "F minor")} with ${tighten}% timing correction, seam cleanup, loudness leveling, and artifact warnings before export.`,
            score,
            cards: [
              { label: "Grid", value: `${bpm} BPM / 4 bars`, detail: "Snap transients to the project grid while preserving groove on softer notes." },
              { label: "Pitch", value: asString(values.key, "F minor"), detail: "Lock melodic content to target key with conservative formant-safe shifts." },
              { label: "Seam", value: "8 ms crossfade", detail: "Clean the loop boundary and flag clicks before final bounce." },
              { label: "Export", value: asBoolean(values.stemSplit) ? "Loop + stems" : "Clean loop", detail: "Write WAV plus BPM/key metadata and repair report." },
            ],
            steps: ["Analyze transients/downbeat", "Apply timing repair", "Pitch/key correction", "Normalize loudness", "Export clean loop report"],
            artifact: `Loop Doctor plan: ${loopType}, ${bpm} BPM, ${values.key}, tighten ${tighten}%, stems ${asBoolean(values.stemSplit) ? "yes" : "no"}`,
          };
        },
      };
    case "midi-genius-sattari-arp-pro":
      return {
        eyebrow: "Interactive MIDI pattern lab",
        prompt: "Type a chord, choose a style, and generate a pattern plan that could become MIDI export.",
        controls: [
          { key: "chord", label: "Input chord", type: "text", value: "Fm9" },
          { key: "style", label: "Style", type: "select", value: "Dark bounce", options: ["Dark bounce", "Afro swing", "House pluck", "Trap bells", "Synthwave pulse"] },
          { key: "energy", label: "Energy", type: "range", value: 72, min: 0, max: 100, step: 1 },
          { key: "swing", label: "Swing", type: "range", value: 58, min: 50, max: 75, step: 1 },
          { key: "bassLane", label: "Generate bass lane", type: "checkbox", value: true },
        ],
        generate: (values, tick) => {
          const chord = asString(values.chord, "Fm9").trim() || "Fm9";
          const energy = asNumber(values.energy, 72);
          const swing = asNumber(values.swing, 58);
          const variation = tick % 3;
          const notes = variation === 0 ? `${chord} root · 5th · b7 · octave` : variation === 1 ? `${chord} root · b3 · 5th · 9th` : `${chord} octave jump · passing tone · repeat`;
          const score = Math.min(98, 45 + Math.round(energy * 0.42) + Math.round((swing - 50) * 0.8));
          return {
            headline: `${asString(values.style)} pattern · ${score}% groove readiness`,
            summary: `Generated a 2-bar ${chord} MIDI pattern with ${energy}% energy, ${swing}% swing, probability accents, and ${asBoolean(values.bassLane) ? "bass + arp lanes" : "arp lane only"}.`,
            score,
            cards: [
              { label: "Chord tones", value: notes, detail: "Pattern stays inside the chord/scale unless spice controls are enabled." },
              { label: "Rhythm", value: "1/16 + rests", detail: "Uses skip/repeat logic so it feels played, not mechanically filled." },
              { label: "Velocity", value: `${55 + Math.round(energy / 3)}–118`, detail: "Accent shape follows energy and groove settings." },
              { label: "Export", value: "MIDI plan", detail: "Download currently exports a text fixture; next step is real .mid output." },
            ],
            steps: ["Read held chord", "Generate arp lane", asBoolean(values.bassLane) ? "Generate bass lane" : "Skip bass lane", "Apply groove", "Prepare MIDI export"],
            artifact: `MIDI Genius pattern: chord=${chord}, style=${values.style}, energy=${energy}, swing=${swing}, notes=${notes}`,
          };
        },
      };
    case "hookforge":
      return {
        eyebrow: "Interactive hook generator lab",
        prompt: "Set the vibe and generate hook candidates you can compare and mutate.",
        controls: [
          { key: "key", label: "Song key", type: "select", value: "A minor", options: ["A minor", "C minor", "F minor", "G major", "D minor"] },
          { key: "bpm", label: "BPM", type: "range", value: 142, min: 70, max: 180, step: 1 },
          { key: "vibe", label: "Vibe", type: "select", value: "Hypnotic dark", options: ["Hypnotic dark", "Radio bright", "Sad melodic", "Bouncy club", "Cinematic"] },
          { key: "hookType", label: "Hook type", type: "select", value: "Bell lead", options: ["Bell lead", "Vocal melody", "Bass riff", "Synth lead", "Counter melody"] },
          { key: "simple", label: "Keep it simple", type: "checkbox", value: true },
        ],
        generate: (values, tick) => {
          const bpm = asNumber(values.bpm, 142);
          const key = asString(values.key, "A minor");
          const hooks = ["Short-repeat motif", "Call/response phrase", "Octave answer", "Syncopated pickup"];
          const picked = hooks[tick % hooks.length];
          const score = Math.min(97, 61 + (asBoolean(values.simple) ? 10 : 0) + Math.round((180 - Math.abs(bpm - 128)) / 12));
          return {
            headline: `${asString(values.hookType)} · ${picked}`,
            summary: `Generated hook batch for ${key} at ${bpm} BPM with a ${asString(values.vibe).toLowerCase()} direction. Top candidate emphasizes ${picked.toLowerCase()} and DAW-usable MIDI output.`,
            score,
            cards: [
              { label: "Candidate A", value: "Catchy / repeatable", detail: "Best for chorus or recurring synth hook." },
              { label: "Candidate B", value: "More space", detail: "Leaves room for vocal and drums." },
              { label: "Mutation", value: asBoolean(values.simple) ? "Simplify + repeat" : "Add bounce + variation", detail: "Changes rhythm/contour without starting over." },
              { label: "Export", value: "MIDI + guide", detail: "Future output should include MIDI plus rough instrument preview." },
            ],
            steps: ["Generate 10 hooks", "Score catchiness", "Mutate top 3", "Audition over beat", "Export MIDI/guide"],
            artifact: `HookForge: ${values.hookType}, ${values.vibe}, ${key}, ${bpm} BPM, top=${picked}`,
          };
        },
      };
    case "sample-library-brain":
      return {
        eyebrow: "Interactive sample search lab",
        prompt: "Search the mock library and generate a smart kit/project-compatible result set.",
        controls: [
          { key: "query", label: "Search", type: "text", value: "dark vocal chops" },
          { key: "projectBpm", label: "Project BPM", type: "range", value: 140, min: 70, max: 180, step: 1 },
          { key: "projectKey", label: "Project key", type: "select", value: "F minor", options: ["F minor", "A minor", "C minor", "G major", "D minor"] },
          { key: "category", label: "Category", type: "select", value: "Vocal", options: ["Vocal", "Drums", "808", "Bass", "FX", "Melody"] },
          { key: "kit", label: "Build smart kit", type: "checkbox", value: true },
        ],
        generate: (values) => {
          const bpm = asNumber(values.projectBpm, 140);
          const query = asString(values.query, "sample");
          const score = Math.min(96, 62 + Math.round((180 - Math.abs(bpm - 140)) / 10) + (asBoolean(values.kit) ? 8 : 0));
          return {
            headline: `Found 18 matching ${asString(values.category).toLowerCase()} samples`,
            summary: `Search results for “${query}” are ranked by ${bpm} BPM compatibility, ${asString(values.projectKey)} key match, mood tags, and similarity.`,
            score,
            cards: [
              { label: "Top match", value: `${query}_01.wav`, detail: `${bpm - 2} BPM, ${values.projectKey}, dark/airy texture, 92% project fit.` },
              { label: "Similar", value: "7 close sounds", detail: "Similarity search groups tone/texture, not just filenames." },
              { label: "Smart kit", value: asBoolean(values.kit) ? "Kick/snare/hat/perc" : "Off", detail: "Builds project-compatible kits from one-shots." },
              { label: "Privacy", value: "Local-first", detail: "Real app should scan folders locally, not upload private sample packs." },
            ],
            steps: ["Scan folder", "Tag BPM/key/type", "Rank by project", "Preview in tempo/key", "Drag to DAW"],
            artifact: `Sample Library Brain search: query=${query}, bpm=${bpm}, key=${values.projectKey}, category=${values.category}`,
          };
        },
      };
    case "librarian-atlas-personal-os":
      return {
        eyebrow: "Interactive private-knowledge lab",
        prompt: "Ask a question and see the kind of cited answer the local knowledge OS should produce.",
        controls: [
          { key: "question", label: "Question", type: "textarea", value: "What are all my active software ideas and what is blocked?" },
          { key: "audience", label: "First user type", type: "select", value: "Builder/founder", options: ["Builder/founder", "Student", "Creator", "Lawyer", "Family/home", "Researcher"] },
          { key: "depth", label: "Answer depth", type: "range", value: 70, min: 20, max: 100, step: 10 },
          { key: "openLoops", label: "Extract open loops", type: "checkbox", value: true },
        ],
        generate: (values) => {
          const depth = asNumber(values.depth, 70);
          const score = Math.min(97, 50 + Math.round(depth * 0.32) + (asBoolean(values.openLoops) ? 12 : 0));
          return {
            headline: `Cited answer for ${asString(values.audience)}`,
            summary: `Answered “${asString(values.question).slice(0, 120)}” by grouping projects, decisions, source notes, and ${asBoolean(values.openLoops) ? "open loops" : "summary only"}.`,
            score,
            cards: [
              { label: "Sources", value: "5 cited files", detail: "Every claim needs a file, note, transcript, or project source link." },
              { label: "Timeline", value: "Decisions by date", detail: "Shows what changed and why, not just the final state." },
              { label: "Open loops", value: asBoolean(values.openLoops) ? "Enabled" : "Disabled", detail: "Extracts todos, blockers, and missing decisions from messy notes." },
              { label: "Privacy", value: "Local index", detail: "Real app should support folder exclusions and sensitive-data boundaries." },
            ],
            steps: ["Index selected folders", "Cluster by project/topic", "Answer with citations", "Extract decisions", "Show next actions"],
            artifact: `Librarian Atlas query: ${values.question}; audience=${values.audience}; openLoops=${values.openLoops}`,
          };
        },
      };
    case "scenepilot-studio":
      return {
        eyebrow: "Interactive creator timeline lab",
        prompt: "Paste a short promo idea and generate a storyboard/timeline plan.",
        controls: [
          { key: "script", label: "Script / brief", type: "textarea", value: "Show the product, prove the before/after, end with a clean CTA." },
          { key: "format", label: "Format", type: "select", value: "9:16 Reels/TikTok", options: ["9:16 Reels/TikTok", "16:9 YouTube", "1:1 social"] },
          { key: "duration", label: "Duration seconds", type: "range", value: 30, min: 10, max: 90, step: 5 },
          { key: "captions", label: "Animated captions", type: "checkbox", value: true },
        ],
        generate: (values) => {
          const duration = asNumber(values.duration, 30);
          const score = Math.min(96, 58 + Math.round(duration / 3) + (asBoolean(values.captions) ? 10 : 0));
          return {
            headline: `${duration}s ${asString(values.format)} timeline`,
            summary: `Generated a scene plan from the brief with hook, proof beat, b-roll slots, ${asBoolean(values.captions) ? "animated captions" : "clean visual text"}, and CTA.` ,
            score,
            cards: [
              { label: "0–3s", value: "Hook", detail: "Open with strongest visual/result and large safe-area text." },
              { label: "4–18s", value: "Proof beats", detail: "Alternate b-roll, product closeups, and voiceover emphasis." },
              { label: "19–26s", value: "Payoff", detail: "Show before/after or creator result." },
              { label: "CTA", value: "Final frame", detail: "End with brand/title, button copy, and export-safe crop." },
            ],
            steps: ["Parse script", "Create scene beats", "Assign assets", "Generate captions", "Export MP4/timeline"],
            artifact: `ScenePilot plan: ${values.format}, ${duration}s, captions=${values.captions}, brief=${values.script}`,
          };
        },
      };
    default:
      return {
        eyebrow: "Interactive test checklist",
        prompt: "Use this lightweight runner to test the product promise and capture what should be built next.",
        controls: [
          { key: "scenario", label: "Test scenario", type: "textarea", value: "Try the main user workflow and record whether the output is useful." },
          { key: "readiness", label: "Perceived readiness", type: "range", value: 45, min: 0, max: 100, step: 5 },
          { key: "needsDownload", label: "Needs downloadable proof", type: "checkbox", value: true },
        ],
        generate: (values) => {
          const score = asNumber(values.readiness, 45);
          return {
            headline: `Product readiness: ${score}%`,
            summary: asString(values.scenario, "Test the product flow."),
            score,
            cards: [
              { label: "Promise", value: "Review", detail: "Does the page clearly say what the product does?" },
              { label: "Flow", value: "Try", detail: "Can a user click through a believable workflow?" },
              { label: "Proof", value: asBoolean(values.needsDownload) ? "Needed" : "Optional", detail: "Attach a demo, export, report, or build artifact." },
              { label: "Next", value: "Tighten", detail: "Turn the weakest part into the next build task." },
            ],
            steps: ["Define scenario", "Run page flow", "Note what's next", "Attach proof", "Pick next build"],
            artifact: `Generic Radar test: readiness=${score}, scenario=${values.scenario}`,
          };
        },
      };
  }
};

function InteractivePrototypeLab({ softwareId }: { softwareId: string }) {
  const scenario = buildPrototypeScenario(softwareId);
  const initialValues = scenario.controls.reduce<ControlValues>((values, control) => {
    values[control.key] = control.value;
    return values;
  }, {});
  const [values, setValues] = useState<ControlValues>(initialValues);
  const [tick, setTick] = useState(0);
  const output = scenario.generate(values, tick);

  const updateValue = (key: string, value: string | number | boolean) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-accent-ink/30 bg-accent/10 p-6 shadow-2xl shadow-black/5 backdrop-blur md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-ink/25 bg-accent/20 px-4 py-2 text-sm font-semibold text-accent-ink">
            <Code2 size={16} /> Usable web prototype
          </div>
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">{scenario.eyebrow}</h2>
          <p className="mt-3 leading-relaxed text-ink/80">{scenario.prompt}</p>
        </div>
        <div className="w-full rounded-3xl border border-line bg-surface p-5 lg:max-w-sm">
          <div className="flex items-center justify-between gap-3 text-sm font-semibold text-ink/80">
            <span>Prototype score</span>
            <span>{output.score}%</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-ink/5">
            <div className="h-full rounded-full bg-accent-ink" style={{ width: `${output.score}%` }} />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-accent-ink">{output.headline}</p>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-line bg-surface p-5">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-muted">Try controls</div>
          <div className="mt-5 space-y-4">
            {scenario.controls.map((control) => (
              <label key={control.key} className="block rounded-2xl border border-line bg-surface p-4">
                <div className="mb-2 flex items-center justify-between gap-3 text-sm font-bold text-ink">
                  <span>{control.label}</span>
                  {control.type === "range" ? <span className="text-accent-ink">{String(values[control.key])}</span> : null}
                </div>
                {control.type === "select" ? (
                  <select
                    value={asString(values[control.key], asString(control.value))}
                    onChange={(event) => updateValue(control.key, event.target.value)}
                    className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-ink"
                  >
                    {control.options?.map((option) => <option key={option}>{option}</option>)}
                  </select>
                ) : control.type === "range" ? (
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={asNumber(values[control.key], asNumber(control.value))}
                    onChange={(event) => updateValue(control.key, Number(event.target.value))}
                    className="w-full accent-[var(--accent-ink)]"
                  />
                ) : control.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={asBoolean(values[control.key])}
                    onChange={(event) => updateValue(control.key, event.target.checked)}
                    className="h-5 w-5 accent-[var(--accent-ink)]"
                  />
                ) : control.type === "textarea" ? (
                  <textarea
                    value={asString(values[control.key], asString(control.value))}
                    onChange={(event) => updateValue(control.key, event.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-ink"
                  />
                ) : (
                  <input
                    type="text"
                    value={asString(values[control.key], asString(control.value))}
                    onChange={(event) => updateValue(control.key, event.target.value)}
                    className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-ink"
                  />
                )}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setTick((current) => current + 1)}
            className="mt-5 w-full rounded-2xl bg-ink px-5 py-4 text-sm font-black text-bg transition hover:opacity-85"
          >
            Generate / refresh prototype output
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-line bg-surface p-5">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-muted">Generated output</div>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink">{output.headline}</h3>
            <p className="mt-3 leading-relaxed text-ink/80">{output.summary}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {output.cards.map((card) => (
              <div key={`${card.label}-${card.value}`} className="rounded-3xl border border-line bg-surface p-5">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-muted">{card.label}</div>
                <h4 className="mt-2 text-lg font-bold tracking-tight text-ink">{card.value}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-line bg-surface p-5">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-muted">Run path</div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-5">
            {output.steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-black text-bg">{index + 1}</div>
                <p className="mt-3 text-sm leading-relaxed text-ink/80">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-surface p-5">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-muted">Prototype artifact</div>
          <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap rounded-2xl border border-line bg-surface p-4 text-xs leading-relaxed text-ink/80">{output.artifact}</pre>
          <a
            href={createDownloadHref(scenario.eyebrow, output.artifact)}
            download={`${softwareId}-prototype-artifact.txt`}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-black text-[#111110] transition hover:opacity-85"
          >
            Download test artifact <Download size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}

const readRadarRoute = () => {
  const productMatch = window.location.hash.match(/^#\/product-radar\/software\/([^/?#]+)/);
  if (productMatch) {
    return { laneId: null, softwareId: productMatch[1] };
  }

  const laneMatch = window.location.hash.match(/^#\/product-radar\/([^/?#]+)/);
  return { laneId: laneMatch?.[1] ?? null, softwareId: null };
};

function ProductRadarPage({ onHome }: { onHome: () => void }) {
  const [selectedLaneId, setSelectedLaneId] = useState(() => readRadarRoute().laneId);
  const [selectedSoftwareId, setSelectedSoftwareId] = useState(() => readRadarRoute().softwareId);
  const [isSweepRunning, setIsSweepRunning] = useState(false);
  const [directoryGroup, setDirectoryGroup] = useState<string>("All");
  const [directoryQuery, setDirectoryQuery] = useState("");
  const [sweepMessage, setSweepMessage] = useState("Ready to request a protected full-system sweep.");
  const hasExternalLiveLink = (project: (typeof radarSoftwareProjects)[number]) => Boolean(project.live?.href.startsWith("http") || project.repo?.href.startsWith("http"));
  const radarSoftwareDisplayOrder = new Map([
    ["entropy", 0],
    ["model-studio", 1],
    ["librarian-atlas", 2],
    ["botanica-lab", 3],
    ["trader-oracle", 4],
    ["market", 98],
    ["now-suite", 99],
  ]);
  const liveLinkedRadarSoftwareProjects = radarSoftwareProjects
    .filter(hasExternalLiveLink)
    .sort((a, b) => (radarSoftwareDisplayOrder.get(a.id) ?? 50) - (radarSoftwareDisplayOrder.get(b.id) ?? 50));
  const liveLinkedRadarSoftwareIds = new Set(liveLinkedRadarSoftwareProjects.map((project) => project.id));
  const liveLinkedRadarEvidence = radarEvidenceLedger.filter((item) => item.softwareId && liveLinkedRadarSoftwareIds.has(item.softwareId));
  const selectedLane = radarLanes.find((lane) => lane.id === selectedLaneId);
  const selectedSoftware = liveLinkedRadarSoftwareProjects.find((project) => project.id === selectedSoftwareId);
  const linkTarget = (href: string) => href.startsWith("http") ? "_blank" : undefined;
  const showAdminSweep = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("admin");
  const openLane = (laneId: string) => {
    setSelectedLaneId(laneId);
    setSelectedSoftwareId(null);
    window.history.pushState(null, "", `#/product-radar/${laneId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openSoftware = (softwareId: string) => {
    setSelectedLaneId(null);
    setSelectedSoftwareId(softwareId);
    window.history.pushState(null, "", `#/product-radar/software/${softwareId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeDetail = () => {
    setSelectedLaneId(null);
    setSelectedSoftwareId(null);
    window.history.pushState(null, "", "#/product-radar");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const requestFullSystemSweep = async () => {
    const adminToken = window.prompt("Enter the Product Radar admin token to request a full sweep.");

    if (!adminToken) {
      setSweepMessage("Sweep canceled. No admin token was provided.");
      return;
    }

    const payload = {
      requestedAt: new Date().toISOString(),
      source: "portfolio-product-radar",
      mode: "full-blocker-sweep",
      requestedActions: [
        "scan every Product Radar evidence row",
        "work safe blockers across all projects",
        "run verification before any push",
        "push verified safe changes",
        "generate one fresh next step for each product"
      ],
      projects: radarEvidenceLedger.map((project) => ({
        projectName: project.projectName,
        priority: project.priority,
        readinessScore: project.readinessScore,
        blocker: project.blocker,
        nextStep: project.nextStep,
        softwareId: project.softwareId ?? null,
      })),
      softwarePages: radarSoftwareProjects.map((project) => ({
        id: project.id,
        title: project.title,
        category: project.category,
        status: project.status,
        testingFocus: project.testingFocus,
      })),
    };

    setIsSweepRunning(true);
    setSweepMessage("Sending protected sweep request…");

    try {
      const response = await fetch("/.netlify/functions/product-sweep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Product-Sweep-Token": adminToken,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setSweepMessage(result?.message ?? "Sweep request was not accepted. Check the protected webhook/token configuration.");
        return;
      }

      setSweepMessage(result?.message ?? "Sweep request accepted. The system should scan blockers, push verified changes, and generate next steps.");
    } catch {
      setSweepMessage("Sweep endpoint is not reachable yet. Deploy the Netlify function and configure the protected webhook/token to activate it.");
    } finally {
      setIsSweepRunning(false);
    }
  };

  useEffect(() => {
    const syncRoute = () => {
      const route = readRadarRoute();
      setSelectedLaneId(route.laneId);
      setSelectedSoftwareId(route.softwareId);
    };
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-10%] h-[34rem] w-[34rem] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute right-[-14%] top-[5%] h-[34rem] w-[34rem] rounded-full bg-ink/[0.04] blur-3xl" />
        <div className="absolute bottom-[-15%] left-[30%] h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={selectedLane || selectedSoftware ? closeDetail : onHome}
            className="w-fit rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink/80 transition hover:border-ink/30 hover:text-ink"
          >
            {selectedLane || selectedSoftware ? "← Back to Radar directory" : "← Back to portfolio"}
          </button>
          <div className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted">
            Product Radar · {selectedSoftware ? `${selectedSoftware.title} test page` : selectedLane ? `${selectedLane.title} detail` : "v0.5 software test lab"}
          </div>
        </div>

        {selectedSoftware ? (
          <>
            <section className="overflow-hidden rounded-[2rem] border border-line bg-surface p-7 shadow-2xl shadow-black/10 backdrop-blur md:p-10 lg:p-12">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-ink/5 px-4 py-2 text-sm font-semibold text-ink/80">
                    <Download size={16} /> {selectedSoftware.category} · {selectedSoftware.status}
                  </div>
                  <h1 className="text-4xl font-black tracking-tight md:text-6xl">{selectedSoftware.title}</h1>
                  <p className="mt-5 text-lg leading-relaxed text-ink/80 md:text-xl">{selectedSoftware.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {selectedSoftware.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <figure className="overflow-hidden rounded-[1.75rem] border border-line bg-surface">
                  <img src={selectedSoftware.image} alt={`${selectedSoftware.title} product visual`} className="h-80 w-full object-cover" />
                  <figcaption className="border-t border-line px-5 py-4 text-sm text-ink/80">Testing page for {selectedSoftware.title}</figcaption>
                </figure>
              </div>
            </section>

            {!["entropy", "model-studio"].includes(selectedSoftware.id) && (
              <InteractivePrototypeLab key={selectedSoftware.id} softwareId={selectedSoftware.id} />
            )}

            <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <aside className="space-y-4">
                <div className="rounded-3xl border border-line bg-surface p-6 backdrop-blur">
                  <h2 className="text-2xl font-bold tracking-tight">Downloadables</h2>
                  <div className="mt-5 space-y-3">
                    {selectedSoftware.downloads.length ? selectedSoftware.downloads.map((download) => (
                      <a
                        key={`${download.label}-${download.href}`}
                        href={download.href}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-ink px-4 py-3 text-sm font-bold text-bg transition hover:opacity-85"
                      >
                        <span>{download.label}</span>
                        <Download size={15} />
                      </a>
                    )) : (
                      <p className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-muted">
                        No download pack yet — use the source and live links to explore this product.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-line bg-surface p-6 backdrop-blur">
                  <h2 className="text-2xl font-bold tracking-tight">Open project</h2>
                  <div className="mt-5 space-y-3">
                    {[selectedSoftware.live, selectedSoftware.repo].filter(Boolean).length ? [selectedSoftware.live, selectedSoftware.repo].filter(Boolean).map((link) => (
                      <a
                        key={link!.label}
                        href={link!.href}
                        target={linkTarget(link!.href)}
                        rel={link!.href.startsWith("http") ? "noreferrer" : undefined}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink transition hover:bg-ink hover:text-bg"
                      >
                        <span>{link!.label}</span>
                        <ExternalLink size={15} />
                      </a>
                    )) : (
                      <p className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-muted">
                        The Radar page below is the first web test surface; no separate live app/repo link is attached yet.
                      </p>
                    )}
                  </div>
                </div>
              </aside>

              <div className="space-y-4">
                <div className="rounded-3xl border border-line bg-surface p-6 backdrop-blur md:p-8">
                  <h2 className="text-2xl font-bold tracking-tight">What to test</h2>
                  <p className="mt-3 leading-relaxed text-ink/80">{selectedSoftware.testingFocus}</p>
                </div>
                <div className="rounded-3xl border border-line bg-surface p-6 backdrop-blur md:p-8">
                  <h2 className="text-2xl font-bold tracking-tight">Quick testing checklist</h2>
                  <div className="mt-5 space-y-3">
                    {selectedSoftware.testSteps.map((step, index) => (
                      <div key={step} className="grid grid-cols-[2.25rem_1fr] gap-4 rounded-2xl border border-line bg-surface p-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-black text-bg">{index + 1}</div>
                        <p className="leading-relaxed text-ink/80">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : selectedLane ? (
          <>
            <section className={`overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br ${selectedLane.accent} p-[1px] shadow-2xl shadow-black/10`}>
              <div className="rounded-[2rem] bg-bg/85 p-7 backdrop-blur md:p-10 lg:p-12">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-ink/5 px-4 py-2 text-sm font-semibold text-ink/80">
                      <span className="text-lg">{selectedLane.icon}</span> {selectedLane.detail.eyebrow}
                    </div>
                    <h1 className="text-4xl font-black tracking-tight md:text-6xl">{selectedLane.title}</h1>
                    <p className="mt-5 text-lg leading-relaxed text-ink/80 md:text-xl">{selectedLane.detail.description}</p>
                  </div>
                  <div className="w-full rounded-3xl border border-line bg-surface p-5 lg:max-w-sm">
                    <div className="flex items-center justify-between gap-3 text-sm font-semibold text-ink/80">
                      <span>{selectedLane.status}</span>
                      <span>{selectedLane.readiness}% ready</span>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-ink/5">
                      <div className="h-full rounded-full bg-ink" style={{ width: `${selectedLane.readiness}%` }} />
                    </div>
                    <div className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{selectedLane.phase}</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-3xl border border-line bg-surface p-5 backdrop-blur md:p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {selectedLane.detail.images.map((image) => (
                    <figure key={image.src} className="overflow-hidden rounded-3xl border border-line bg-surface">
                      <img src={image.src} alt={image.alt} className="h-64 w-full object-cover" />
                      <figcaption className="border-t border-line px-4 py-3 text-sm text-ink/80">{image.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>

              <aside className="space-y-4">
                <div className="rounded-3xl border border-line bg-surface p-6 backdrop-blur">
                  <h2 className="text-2xl font-bold tracking-tight">Downloads + links</h2>
                  <div className="mt-5 space-y-3">
                    {selectedLane.detail.downloads.map((download) => (
                      <a
                        key={`${download.label}-${download.href}`}
                        href={download.href}
                        target={linkTarget(download.href)}
                        rel={download.href.startsWith("http") ? "noreferrer" : undefined}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink transition hover:bg-ink hover:text-bg"
                      >
                        <span>{download.label}</span>
                        <ExternalLink size={15} />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-line bg-surface p-6 backdrop-blur">
                  <h2 className="text-2xl font-bold tracking-tight">Project notes</h2>
                  <ul className="mt-5 space-y-3">
                    {selectedLane.detail.highlights.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </section>

            <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-line bg-surface p-6 backdrop-blur md:p-8">
                <h2 className="text-2xl font-bold tracking-tight">Next action</h2>
                <p className="mt-3 leading-relaxed text-ink/80">{selectedLane.nextAction}</p>
              </div>
              <div className="rounded-3xl border border-line bg-surface p-6 backdrop-blur md:p-8">
                <h2 className="text-2xl font-bold tracking-tight">On the roadmap</h2>
                <p className="mt-3 leading-relaxed text-muted">{selectedLane.blocker}</p>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="overflow-hidden rounded-[2rem] border border-line bg-surface p-7 shadow-2xl shadow-black/10 backdrop-blur md:p-10 lg:p-12">
              <div className="max-w-4xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-ink/5 px-4 py-2 text-sm font-semibold text-ink/80">
                  <Sparkles size={16} /> Live products · apps · plugins · tools
                </div>
                <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                  Product Radar — every live product in one place.
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/80 md:text-xl">
                  A live directory of working software: apps, plugins, dashboards, and creator tools. Open any product for a clear overview, its live link or source, downloads, and exactly how to try it.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
                {radarMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-line bg-surface p-4">
                    <div className="text-3xl font-black tracking-tight text-ink">{metric.value}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{metric.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {showAdminSweep && (
            <section className="mt-8 overflow-hidden rounded-[2rem] border border-accent-ink/30 bg-accent/10 p-6 shadow-2xl shadow-black/5 backdrop-blur md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-ink/25 bg-accent/20 px-4 py-2 text-sm font-semibold text-accent-ink">
                    <RefreshCw size={16} /> Admin system refresh
                  </div>
                  <h2 className="text-3xl font-black tracking-tight md:text-5xl">Run a full Product Radar sweep.</h2>
                  <p className="mt-3 leading-relaxed text-ink/80">
                    This protected button requests the system to scan every product blocker, work safe fixes, verify before pushing, push clean changes, and generate a fresh next step for each product.
                  </p>
                  <p className="mt-3 rounded-2xl border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-muted">
                    Safety gate: the public site only sends a request after an admin token is entered. The live automation still needs the private Netlify environment variables for the webhook and token.
                  </p>
                </div>
                <div className="w-full rounded-3xl border border-line bg-surface p-5 lg:max-w-sm">
                  <button
                    type="button"
                    onClick={requestFullSystemSweep}
                    disabled={isSweepRunning}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 text-sm font-black text-bg transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RefreshCw size={18} className={isSweepRunning ? "animate-spin" : undefined} />
                    {isSweepRunning ? "Requesting sweep…" : "Update all products"}
                  </button>
                  <p className="mt-4 text-sm leading-relaxed text-ink/80">{sweepMessage}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-2xl border border-line bg-ink/5 p-3">
                      <div className="text-2xl font-black text-ink">{liveLinkedRadarEvidence.length}</div>
                      <div className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted">live rows</div>
                    </div>
                    <div className="rounded-2xl border border-line bg-ink/5 p-3">
                      <div className="text-2xl font-black text-ink">{liveLinkedRadarSoftwareProjects.length}</div>
                      <div className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted">live products</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            )}

            <section className="mt-8 rounded-[2rem] border border-line bg-surface p-6 shadow-2xl shadow-black/10 backdrop-blur md:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-ink/5 px-4 py-2 text-sm font-semibold text-ink/80">
                    <Sparkles size={16} /> Product ledger · ranked by proof
                  </div>
                  <h2 className="text-3xl font-black tracking-tight md:text-5xl">What's live, what's proven, and what ships next.</h2>
                  <p className="mt-3 max-w-3xl leading-relaxed text-muted">
                    Every live product, ranked by proof and usefulness. Each row shows the latest proof, the next roadmap milestone, what ships next, and the revenue path.
                  </p>
                </div>
                <div className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink/80">
                  {liveLinkedRadarEvidence.length} live products
                </div>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {liveLinkedRadarEvidence.map((item, index) => (
                  <article key={item.projectName} className="rounded-3xl border border-line bg-surface p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-xs font-black uppercase tracking-[0.18em] text-muted">Rank {index + 1}</div>
                        <h3 className="mt-1 text-2xl font-bold tracking-tight text-ink">{item.projectName}</h3>
                      </div>
                      <div className="rounded-2xl border border-line bg-ink/5 px-4 py-2 text-sm font-black text-ink">
                        {readinessPhase(item.readinessScore)}
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-ink/80">{item.promise}</p>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-line bg-surface p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Latest proof</div>
                        <p className="mt-1 text-sm leading-relaxed text-ink/80">{item.latestProof}</p>
                      </div>
                      <div className="rounded-2xl border border-line bg-surface p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">On the roadmap</div>
                        <p className="mt-1 text-sm leading-relaxed text-ink/80">{item.blocker}</p>
                      </div>
                    </div>
                    <div className="mt-3 rounded-2xl border border-line bg-surface p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">What ships next</div>
                      <p className="mt-1 text-sm leading-relaxed text-ink">{item.nextStep}</p>
                    </div>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs leading-relaxed text-muted">Revenue path: {item.monetization}</p>
                      {item.softwareId ? (
                        <button
                          type="button"
                          onClick={() => openSoftware(item.softwareId!)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-ink/5 px-3 py-2 text-xs font-semibold text-ink transition hover:bg-ink hover:text-bg"
                        >
                          Open test page <ExternalLink size={13} />
                        </button>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-8 rounded-[2rem] border border-line bg-surface p-6 shadow-2xl shadow-black/10 backdrop-blur md:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-ink/5 px-4 py-2 text-sm font-semibold text-ink/80">
                    <Download size={16} /> Software downloads + test pages
                  </div>
                  <h2 className="text-3xl font-black tracking-tight md:text-5xl">Live software projects in one place.</h2>
                  <p className="mt-3 max-w-3xl leading-relaxed text-muted">
                    Only projects with public live links are shown here. Each card opens a focused testing page with the live link, product description, downloadables when available, and practical test steps.
                  </p>
                </div>
                <div className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink/80">
                  {liveLinkedRadarSoftwareProjects.length} live software pages
                </div>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {liveLinkedRadarSoftwareProjects.map((project) => (
                  <motion.article
                    key={project.id}
                    role="button"
                    tabIndex={0}
                    whileHover={{ y: -4 }}
                    onClick={() => openSoftware(project.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openSoftware(project.id);
                      }
                    }}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-line bg-surface outline-none transition focus:ring-2 focus:ring-ink/40"
                  >
                    <img src={project.image} alt={`${project.title} preview`} className="h-40 w-full object-cover opacity-90 transition group-hover:opacity-100" />
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-line bg-ink/5 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted">
                          {project.category}
                        </span>
                        <span className="text-xs font-semibold text-muted">{project.downloads.length} download</span>
                      </div>
                      <h3 className="mt-4 text-xl font-bold tracking-tight text-ink">{project.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="rounded-lg border border-line bg-ink/5 px-2 py-1 text-[0.7rem] font-semibold text-ink/80">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto flex flex-wrap gap-2 pt-5">
                        <span className="inline-flex items-center gap-2 rounded-lg border border-line bg-ink/5 px-3 py-2 text-xs font-semibold text-ink">
                          Full test page <ExternalLink size={13} />
                        </span>
                        {project.downloads.slice(0, 1).map((download) => (
                          <a
                            key={download.href}
                            href={download.href}
                            onClick={(event) => event.stopPropagation()}
                            className="inline-flex items-center gap-2 rounded-lg border border-line bg-ink px-3 py-2 text-xs font-bold text-bg transition hover:opacity-85"
                          >
                            Download <Download size={13} />
                          </a>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>

            <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {radarLanes.map((lane) => (
                <motion.article
                  key={lane.id}
                  role="button"
                  tabIndex={0}
                  whileHover={{ y: -5 }}
                  onClick={() => openLane(lane.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openLane(lane.id);
                    }
                  }}
                  className={`cursor-pointer overflow-hidden rounded-3xl border border-line bg-gradient-to-br ${lane.accent} p-[1px] outline-none transition focus:ring-2 focus:ring-ink/40`}
                >
                  <div className="flex h-full flex-col rounded-3xl bg-bg/85 p-6 backdrop-blur">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-ink/5 text-2xl">
                        {lane.icon}
                      </div>
                      <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink/80">
                        {lane.status}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">{lane.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink/80">{lane.summary}</p>

                    <div className="mt-5 rounded-2xl border border-line bg-surface p-4">
                      <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                        <span>{lane.phase}</span>
                        <span className="text-ink">{lane.readiness}%</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/5">
                        <div className="h-full rounded-full bg-ink" style={{ width: `${lane.readiness}%` }} />
                      </div>
                    </div>

                    <ul className="mt-5 space-y-2">
                      {lane.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2 text-sm text-muted">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 space-y-3 rounded-2xl border border-line bg-surface p-4 text-sm">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Next action</div>
                        <p className="mt-1 text-ink">{lane.nextAction}</p>
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">On the roadmap</div>
                        <p className="mt-1 text-muted">{lane.blocker}</p>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      <span className="inline-flex items-center gap-2 rounded-lg border border-line bg-ink/5 px-3 py-2 text-xs font-semibold text-ink">
                        Open details <ExternalLink size={13} />
                      </span>
                      {[lane.primaryLink, lane.secondaryLink].filter(Boolean).map((link) => (
                        <a
                          key={link!.label}
                          href={link!.href}
                          target={linkTarget(link!.href)}
                          rel={link!.href.startsWith("http") ? "noreferrer" : undefined}
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center gap-2 rounded-lg border border-line bg-ink/5 px-3 py-2 text-xs font-semibold text-ink transition hover:bg-ink hover:text-bg"
                        >
                          {link!.label} <ExternalLink size={13} />
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </section>

            <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border border-line bg-surface p-6 backdrop-blur md:p-8">
                <h2 className="text-3xl font-bold tracking-tight">Opportunity radar</h2>
                <div className="mt-6 space-y-3">
                  {radarOpportunities.map((item, index) => (
                    <div key={item} className="rounded-2xl border border-line bg-surface p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Idea {index + 1}</div>
                      <p className="mt-2 text-ink">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-line bg-surface p-6 backdrop-blur md:p-8">
                <h2 className="text-3xl font-bold tracking-tight">Next build sequence</h2>
                <div className="mt-6 space-y-4">
                  {radarNextBuildSteps.map((step, index) => (
                    <div key={step.title} className="grid grid-cols-[2.25rem_1fr_auto] gap-4 rounded-2xl border border-line bg-surface p-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-black text-bg">{index + 1}</div>
                      <div>
                        <h3 className="font-semibold text-ink">{step.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
                      </div>
                      <span className="hidden h-fit rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink/80 sm:inline-block">{step.state}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-line bg-surface p-6 backdrop-blur md:p-8">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Daily app idea feed</h2>
                  <p className="mt-2 max-w-2xl text-muted">
                    Seed lane for the daily visionary app ideas. The next pass can promote the best idea into a product ticket.
                  </p>
                </div>
                <div className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink/80">
                  Daily loop active
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {radarIdeaFeed.map((idea) => (
                  <div key={idea.name} className="rounded-2xl border border-line bg-surface p-5">
                    <h3 className="text-xl font-bold text-ink">{idea.name}</h3>
                    <p className="mt-2 text-sm text-ink/80">{idea.theme}</p>
                    <div className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted">MVP</div>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{idea.mvp}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Full project directory */}
            <section id="directory" className="mt-8 rounded-3xl border border-line bg-surface p-6 backdrop-blur md:p-8">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Full directory</h2>
                  <p className="mt-2 max-w-2xl text-muted">
                    Every project — products, client work, brand sites, and code. Each live link below was checked and is up.
                  </p>
                </div>
                <div className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink/80">
                  {radarDirectory.length} projects
                </div>
              </div>

              {/* filters */}
              <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {["All", ...radarDirectoryGroups].map((group) => {
                    const count = group === "All" ? radarDirectory.length : radarDirectory.filter((d) => d.group === group).length;
                    const active = directoryGroup === group;
                    return (
                      <button
                        key={group}
                        onClick={() => setDirectoryGroup(group)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                          active
                            ? "border-ink bg-ink text-bg"
                            : "border-line bg-surface text-muted hover:border-ink/30 hover:text-ink"
                        }`}
                      >
                        {group} <span className="text-xs opacity-60">{count}</span>
                      </button>
                    );
                  })}
                </div>
                <input
                  value={directoryQuery}
                  onChange={(e) => setDirectoryQuery(e.target.value)}
                  placeholder="Search projects…"
                  className="w-full rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-ink/50 lg:w-72"
                />
              </div>

              {/* results */}
              {(() => {
                const q = directoryQuery.trim().toLowerCase();
                const shown = radarDirectory.filter((d) => {
                  const inGroup = directoryGroup === "All" || d.group === directoryGroup;
                  const inQuery = !q || `${d.name} ${d.blurb} ${d.stack ?? ""} ${d.group}`.toLowerCase().includes(q);
                  return inGroup && inQuery;
                });
                if (!shown.length) {
                  return (
                    <p className="mt-8 rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">
                      No projects match “{directoryQuery}”.
                    </p>
                  );
                }
                return (
                  <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {shown.map((item) => (
                      <div
                        key={item.name}
                        className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-ink/30 hover:bg-surface"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-bold leading-tight text-ink">{item.name}</h3>
                          {item.live && (
                            <span className="relative mt-1 flex h-2 w-2 shrink-0" title="Live">
                              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-[#7fb800] opacity-60" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7fb800]" />
                            </span>
                          )}
                        </div>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.blurb}</p>
                        {item.stack && (
                          <div className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-faint">{item.stack}</div>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.live && (
                            <a
                              href={item.live}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-bg transition-colors hover:opacity-85"
                            >
                              Visit <ExternalLink size={12} />
                            </a>
                          )}
                          {item.repo && (
                            <a
                              href={item.repo}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-ink/80 transition-colors hover:border-ink/30 hover:text-ink"
                            >
                              Code <Code2 size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

type Project = {
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

const hasLink = (href?: string) => Boolean(href && href !== "#");

const EASE = [0.16, 1, 0.3, 1] as const;

const projects: Project[] = [
  {
    id: "luma-studio",
    title: "Luma Studio",
    section: "software",
    subtitle: "Pro image editor with offline AI",
    description:
      "A standalone Photoshop-class editor written in Rust on a custom GPU renderer. Layers, masks, selections, a full adjustment stack, and natural-media paint — with AI subject-selection and background removal running natively in-process through ONNX Runtime. No cloud, no third-party API.",
    tech: ["Rust", "wgpu", "ONNX Runtime", "egui", "Web + macOS"],
    points: [
      "Custom GPU renderer and document engine — layers, masks, feathered selections, undo history, and an adjustment stack with Curves, Levels, Gradient Map, and Black & White.",
      "AI Select Subject and background removal (ISNet) execute locally through ONNX Runtime, with model weights embedded in the app for offline use.",
      "Tooling spans marquee, ellipse, lasso and wand selection, brush, gradient, shape and text, plus 3D primitives — backed by 108 passing workspace tests."
    ],
    live: "https://luma.thecreatingco.com",
    liveLabel: "Open Luma",
    github: "https://github.com/armonon/sweet-suite",
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

const softwareProjects = projects.filter((p) => p.section === "software");
const flagshipIds = new Set(flagships.map((f) => f.project).filter(Boolean));
const moreProjects = softwareProjects.filter((p) => !flagshipIds.has(String(p.id)));
const websiteProjects = projects.filter((p) => p.section === "website" && hasLink(p.live));

const STUDIO_URL = "https://thecreatingco.com";

const studioApps = [
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

const studioSuiteExamples = [
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

const studioToolExamples = [
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

const capabilities = [
  { kicker: "Design & media", title: "Visuals that sell", body: "Brand, UI/UX, 3D assets, product imagery and AI-generated video, directed and finished by hand." },
  { kicker: "Native / systems", title: "Real-time & native apps", body: "C++ and Rust across audio DSP, GPU renderers, and desktop apps — VST3/AU plugins, a wgpu image editor, and macOS/iOS builds." },
  { kicker: "Applied AI", title: "AI that runs locally", body: "On-device inference with ONNX Runtime, screen-aware agents, LLM workflows, and pipelines that keep user data on the machine." },
  { kicker: "Product web", title: "Platforms & interfaces", body: "React and TypeScript front-ends, directory and commerce platforms, research dashboards, and the APIs behind them." },
  { kicker: "Backend", title: "Services & data", body: "APIs, database-backed workflows, automation, and production infrastructure built to hold up under real client constraints." },
  { kicker: "Interactive", title: "Games & real-time 3D", body: "Game design, playable prototypes, WebGL/Three.js scenes and real-time characters with lip-sync." }
];

const experience = [
  { role: "Founder", org: "thecreateco", href: STUDIO_URL, body: "Building an independent creative software studio around Form, Luma, StemDeck and ScenePilot, plus focused tools, Sattari Labs utilities and Void Studio experiments. Lite editions stay free, with Pro desktop builds in development.", tags: ["Product", "Engineering", "Design", "Launch"] },
  { role: "Backend Developer", org: "Softech", body: "Built backend systems, APIs, automation, data flows, and production-facing web infrastructure.", tags: ["APIs & services", "Database workflows", "Client constraints"] },
  { role: "AI Engineering", org: "Applied AI training", body: "Applied AI workflows, agent patterns, automation, and product-minded implementation.", tags: ["AI prototyping", "LLM workflows", "Automation"] }
];

const skills = [
  "Brand & UI design", "Websites", "Apps", "Game design", "3D assets", "AI image & video", "Local AI agents", "Automation",
  "C++", "Rust", "TypeScript", "Python", "React", "WebGL", "Three.js", "ONNX Runtime", "LLM Workflows", "Real-time DSP"
];

const navItems = [
  { label: "Services", id: "services" },
  { label: "Best work", id: "best" },
  { label: "Full apps", id: "full-apps" },
  { label: "Free tools", id: "tools" },
  { label: "Websites", id: "websites" },
  { label: "Sattari", id: "sattari" },
  { label: "Agents", id: "agents" },
  { label: "Contact", id: "contact" }
];

const CONTACT_EMAIL = "armonnasiri@gmail.com";

function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`font-mono text-[11px] uppercase tracking-[0.18em] ${className || "text-faint"}`}>{children}</div>;
}

function SectionHead({ n, kicker, title, aside }: { n: string; kicker: string; title: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between md:pb-14">
      <div>
        <Kicker>
          <span className="text-accent-ink">{n}</span>
          <span className="mx-2 text-line">/</span>
          {kicker}
        </Kicker>
        <h2 className="mt-5 max-w-[18ch] text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink">{title}</h2>
      </div>
      {aside && <div className="max-w-sm text-[15px] leading-relaxed text-muted">{aside}</div>}
    </div>
  );
}

function ProjectMedia({ project, className = "" }: { project: Project; className?: string }) {
  return project.video ? (
    <LazyVideo src={project.video} className={`h-full w-full object-cover ${className}`} />
  ) : (
    <img src={project.image} alt="" loading="lazy" className={`h-full w-full object-cover ${className}`} />
  );
}

// Scrubs a muted video with page scroll: the clip runs from first to last frame as the
// element travels up the viewport. The source is encoded all-keyframe so seeking is cheap.
function ScrollScrubVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });
  const progress = useTransform(scrollYProgress, [0.12, 0.82], [0, 1], { clamp: true });
  const scale = useTransform(scrollYProgress, [0, 0.35], [0.9, 1], { clamp: true });
  const rotate = useTransform(scrollYProgress, [0, 0.35], [-2.5, 0], { clamp: true });
  const barScale = useSpring(progress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    let target = 0;
    let shown = 0;
    let frame = 0;
    // iOS Safari won't paint seeked frames until the element has played once
    const prime = () => {
      video.play().then(() => video.pause()).catch(() => {});
    };
    video.addEventListener("loadedmetadata", prime, { once: true });
    const tick = () => {
      frame = 0;
      const duration = video.duration;
      if (!duration || Number.isNaN(duration)) return;
      // ease toward the scroll target so fast flicks still read as motion
      shown += (target - shown) * 0.22;
      if (Math.abs(target - shown) < 0.0005) shown = target;
      if (!video.seeking) video.currentTime = Math.min(duration - 0.05, shown * duration);
      if (shown !== target) frame = requestAnimationFrame(tick);
    };
    const unsubscribe = progress.on("change", (value) => {
      target = value;
      if (!frame) frame = requestAnimationFrame(tick);
    });
    target = progress.get();
    return () => {
      unsubscribe();
      if (frame) cancelAnimationFrame(frame);
      video.removeEventListener("loadedmetadata", prime);
    };
  }, [progress]);

  return (
    <motion.div ref={wrapRef} style={{ scale, rotate }} className="relative overflow-hidden rounded-[22px] border border-band-line bg-[#1a1714] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
      <video ref={videoRef} src={src} poster={poster} preload="auto" muted playsInline aria-label={label} className="block aspect-[16/7] w-full object-cover" />
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center gap-3">
        <span className="rounded-full bg-[#111110]/80 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-white backdrop-blur">Scroll to play</span>
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
          <motion.div style={{ scaleX: barScale }} className="h-full origin-left rounded-full bg-accent" />
        </div>
      </div>
    </motion.div>
  );
}

function StudioBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-[#111110]">
      thecreateco
    </span>
  );
}

function ProjectCard({ project, index, span, onOpen }: { project: Project; index: number; span: string; onOpen: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 2) * 0.06 }}
      className={`group relative flex flex-col overflow-hidden rounded-[22px] border border-line bg-surface transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] ${span}`}
    >
      <button onClick={onOpen} className="absolute inset-0 z-10" aria-label={`Open ${project.title} case study`} />
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d0c] lg:aspect-auto lg:h-[380px]">
        <ProjectMedia project={project} className="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-black/55 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur-md">{project.status}</span>
          {project.studio && <StudioBadge />}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex items-center justify-between gap-4">
          <Kicker>
            {String(index + 1).padStart(2, "0")} — {project.label}
          </Kicker>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-bg">
            <ArrowUpRight size={16} />
          </span>
        </div>
        <h3 className="mt-4 text-[1.75rem] font-semibold leading-tight tracking-[-0.025em] text-ink">{project.title}</h3>
        <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{project.subtitle}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
          {project.tech.slice(0, 4).map((t) => (
            <span key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10.5px] text-muted">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[26px] bg-surface sm:rounded-[26px]"
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black"
        >
          <X size={18} />
        </button>
        <div className="aspect-video w-full overflow-hidden bg-[#0d0d0c]">
          <ProjectMedia project={project} />
        </div>
        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <Kicker>{project.label}</Kicker>
            <span className="text-line">·</span>
            <Kicker>{project.status}</Kicker>
            {project.studio && <StudioBadge />}
          </div>
          <h3 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">{project.title}</h3>
          <p className="mt-2 font-serif text-2xl italic text-muted">{project.subtitle}</p>
          <p className="mt-6 text-[16px] leading-relaxed text-muted">{project.description}</p>
          {project.points.length > 0 && (
            <ul className="mt-8 space-y-4">
              {project.points.map((point, i) => (
                <li key={i} className="grid grid-cols-[2rem_1fr] text-[15px] leading-relaxed text-ink/85">
                  <span className="font-mono text-[11px] leading-6 text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                  {point}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            {hasLink(project.live) && (
              <a href={project.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-85">
                {project.liveLabel} <ArrowUpRight size={15} />
              </a>
            )}
            {hasLink(project.github) && (
              <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink">
                Source <Code2 size={15} />
              </a>
            )}
            {project.studio && (
              <a href={STUDIO_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink">
                Part of thecreateco <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Autoplays muted while on screen; viewers can turn the sound on for pieces where audio matters.
function ShowreelVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { margin: "0px" });
  const [soundOn, setSoundOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.playsInline = true;
    el.muted = !soundOn;
    if (isInView) el.play().catch(() => {});
    else el.pause();
  }, [isInView, soundOn]);
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-line bg-[#0d0d0c]">
      <video ref={ref} src={src} poster={poster} preload="metadata" loop muted playsInline aria-label={label} className="block aspect-video w-full object-cover" />
      <button
        onClick={() => {
          const next = !soundOn;
          setSoundOn(next);
          if (ref.current) {
            ref.current.muted = !next;
            if (next) {
              ref.current.currentTime = 0;
              ref.current.play().catch(() => {});
            }
          }
        }}
        className="absolute bottom-4 left-4 rounded-full bg-black/65 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white backdrop-blur-md transition-colors hover:bg-black"
      >
        {soundOn ? "Sound on · tap to mute" : "Play with sound"}
      </button>
    </div>
  );
}

// Tiles hide themselves if the image hasn't been added yet, so a missing file never shows as broken.
function ArtGallery() {
  const [missing, setMissing] = useState<string[]>([]);
  const visible = artPieces.filter((piece) => !missing.includes(piece.src));
  if (visible.length === 0) return null;
  return (
    <div className="mt-16">
      <div className="flex items-baseline justify-between border-b border-line pb-5">
        <Kicker className="text-accent-ink">AI art &amp; image generation</Kicker>
        <Kicker>{visible.length} {visible.length === 1 ? "piece" : "pieces"}</Kicker>
      </div>
      <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {visible.map((piece) => (
          <figure key={piece.src} className="group mb-4 break-inside-avoid overflow-hidden rounded-[22px] border border-line bg-surface">
            <a href={piece.src} target="_blank" rel="noreferrer" className="block overflow-hidden bg-[#0d0d0c]">
              <img
                src={piece.src}
                alt={piece.title}
                loading="lazy"
                onError={() => setMissing((cur) => [...cur, piece.src])}
                className="w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
              />
            </a>
            <figcaption className="p-5">
              <h4 className="text-lg font-semibold tracking-[-0.02em] text-ink">{piece.title}</h4>
              <Kicker className="mt-1.5">{piece.medium}</Kicker>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{piece.note}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

// Soft accent glow that trails the cursor across the hero, over two slowly drifting blobs.
function HeroGlow() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 90, damping: 20 });
  const sy = useSpring(y, { stiffness: 90, damping: 20 });
  const bg = useMotionTemplate`radial-gradient(420px circle at ${sx}px ${sy}px, color-mix(in srgb, var(--accent) 38%, transparent), transparent 70%)`;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const onMove = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    };
    parent.addEventListener("pointermove", onMove);
    return () => parent.removeEventListener("pointermove", onMove);
  }, [x, y]);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -right-32 top-10 h-[34rem] w-[34rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 55%, transparent), transparent 65%)" }}
        animate={{ x: [0, -60, 20, 0], y: [0, 40, -30, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-40 bottom-0 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #ff7ad9, transparent 65%)" }}
        animate={{ x: [0, 50, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="absolute inset-0" style={{ background: bg }} />
    </div>
  );
}

// Floating, gently parallaxing collage of real work beside the hero headline (desktop only).
function HeroCollage({ onOpen }: { onOpen: (id: string) => void }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, -90]);
  const y2 = useTransform(scrollY, [0, 800], [0, -40]);
  const y3 = useTransform(scrollY, [0, 800], [0, -140]);
  const float = (d: number) => ({ animate: { y: [0, -10, 0] }, transition: { duration: d, repeat: Infinity, ease: "easeInOut" as const } });
  const logos = ["form", "luma", "stemdeck", "glyph-studio", "autocut", "vox"];
  return (
    <div aria-hidden={false} className="pointer-events-none absolute right-0 top-28 hidden h-[620px] w-[46%] lg:block">
      <motion.div style={{ y: y2 }} className="absolute right-[4%] top-0 w-[78%]">
        <motion.button {...float(7)} onClick={() => onOpen("sattari-ai-ad")} className="pointer-events-auto block w-full rotate-[2.5deg] overflow-hidden rounded-[20px] border border-line bg-[#0d0d0c] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)] transition-transform hover:rotate-0">
          <LazyVideo src="/videos/sattari-ai-ad.mp4" className="block aspect-video w-full object-cover" />
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur">AI video ad</span>
        </motion.button>
      </motion.div>
      <motion.div style={{ y: y1 }} className="absolute left-0 top-[44%] w-[52%]">
        <motion.a {...float(8)} href="#websites" className="pointer-events-auto block -rotate-[4deg] overflow-hidden rounded-[18px] border border-line bg-surface shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] transition-transform hover:rotate-0">
          <img src="/photos/walkthrough/eden-eden.jpg" alt="BREAKTHYRULE Eden 3D world" className="block aspect-[16/10] w-full object-cover object-top" />
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur">3D website</span>
        </motion.a>
      </motion.div>
      <motion.div style={{ y: y3 }} className="absolute right-[6%] top-[42%] w-[24%]">
        <motion.a {...float(9)} href="#full-apps" aria-label="Librarian on iPhone" className="pointer-events-auto block rotate-[6deg] transition-transform hover:rotate-0">
          <PhoneFrame url="librarian.thecreatingco.com">
            <DeviceVideo src="/videos/librarian-iphone.mp4" poster="/photos/librarian-iphone-results.jpg" className="h-full w-full object-cover object-top" />
          </PhoneFrame>
        </motion.a>
      </motion.div>
      <motion.a href="#apps" {...float(6)} className="pointer-events-auto absolute left-[12%] top-[6%] grid grid-cols-3 gap-2 rounded-[22px] border border-line bg-surface/90 p-3 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.45)] backdrop-blur">
        {logos.map((l, i) => (
          <motion.img key={l} src={`/app-logos/${l}.svg`} alt="" className="h-10 w-10 rounded-xl" animate={{ rotate: [0, i % 2 ? 8 : -8, 0] }} transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }} />
        ))}
      </motion.a>
    </div>
  );
}

// Cycles through what I make in the hero headline.
function RotatingWord({ words, suffix = "" }: { words: string[]; suffix?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), 1700);
    return () => window.clearInterval(id);
  }, [words.length]);
  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      {/* invisible sizer keeps the line height stable */}
      <span className="invisible col-start-1 row-start-1">{words.reduce((a, b) => (b.length > a.length ? b : a))}{suffix}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: "100%", opacity: 0, rotateX: -60 }}
          animate={{ y: "0%", opacity: 1, rotateX: 0 }}
          exit={{ y: "-100%", opacity: 0, rotateX: 60 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="col-start-1 row-start-1 whitespace-nowrap text-accent-ink"
        >
          {words[i]}
          <span className="text-ink">{suffix}</span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function SiteWalkthrough({ site, index }: { site: SiteShowcase; index: number }) {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const STEP_MS = 4200;
  useEffect(() => {
    if (paused || !inView) return;
    const id = window.setTimeout(() => setStep((n) => (n + 1) % site.steps.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [step, paused, inView, site.steps.length]);
  const current = site.steps[step];
  const flip = index % 2 === 1;
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="grid grid-cols-1 gap-8 lg:grid-cols-[1.45fr_0.55fr] lg:gap-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={flip ? "lg:order-2" : ""}>
        {/* browser chrome */}
        <div className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)]">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <a href={site.url} target="_blank" rel="noreferrer" className="flex-1 truncate rounded-full bg-ink/[0.05] px-4 py-1.5 font-mono text-[11.5px] text-muted hover:text-ink">
              {site.url.replace("https://", "")}
            </a>
            <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint sm:inline">{String(step + 1).padStart(2, "0")} / {String(site.steps.length).padStart(2, "0")}</span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d0c]">
            <AnimatePresence initial={false}>
              <motion.img
                key={current.image}
                src={current.image}
                alt={`${site.name}: ${current.room}`}
                loading="lazy"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-5 pt-16 sm:p-7 sm:pt-20">
              <AnimatePresence mode="wait">
                <motion.div key={current.room} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }}>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">Walkthrough · {current.room}</div>
                  <p className="mt-2 max-w-[44ch] text-[15px] leading-snug text-white sm:text-[17px]">{current.caption}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        {/* step rail */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {site.steps.map((s, i) => (
            <button
              key={s.room}
              onClick={() => setStep(i)}
              aria-pressed={i === step}
              className={`relative shrink-0 overflow-hidden rounded-full border px-4 py-2 text-[13px] transition-colors ${i === step ? "border-ink text-ink" : "border-line text-muted hover:border-ink/40 hover:text-ink"}`}
            >
              {i === step && !paused && inView && (
                <motion.span
                  key={`bar-${step}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                  className="absolute inset-0 origin-left bg-accent/35"
                />
              )}
              <span className="relative">{s.room}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`self-center ${flip ? "lg:order-1" : ""}`}>
        <Kicker className="text-accent-ink">{site.kind}</Kicker>
        <h3 className="mt-4 text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-ink">{site.name}</h3>
        <p className="mt-4 text-[15.5px] leading-relaxed text-muted">{site.summary}</p>
        <ul className="mt-6 space-y-2">
          {site.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2.5 text-[14px] text-ink/85">
              <Check size={15} className="mt-0.5 shrink-0 text-accent-ink" />
              {h}
            </li>
          ))}
        </ul>
        <a href={site.url} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-bg transition-opacity hover:opacity-85">
          Walk through it live <ArrowUpRight size={15} />
        </a>
      </div>
    </motion.article>
  );
}

function WebsitesSection({ onInquire }: { onInquire: () => void }) {
  return (
    <section id="websites" className="border-t border-line px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <SectionHead
          n="05"
          kicker="Website creation"
          title={<>Not pages. <span className="font-serif font-normal italic">Places</span> people explore.</>}
          aside={<>Sites built as worlds: walkable 3D showrooms, AI guides and stores woven into the experience. Here are two, room by room. Hover to pause, or tap any room.</>}
        />
        <div className="space-y-24">
          {siteShowcases.map((site, i) => (
            <SiteWalkthrough key={site.id} site={site} index={i} />
          ))}
        </div>
        <div className="mt-20 flex flex-col items-start justify-between gap-6 rounded-[22px] border border-line bg-surface p-7 md:flex-row md:items-center">
          <p className="max-w-xl text-[17px] leading-relaxed text-ink">
            Need a site, from a clean landing page to a full 3D world with a shop inside?
          </p>
          <button onClick={onInquire} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-[#111110] transition-transform hover:-translate-y-0.5">
            Plan my website <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

const hueFor = (name: string) => [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);

function AppTile({ app }: { app: (typeof appCatalogue)[number] }) {
  const linked = app.href !== "#";
  const Tag = linked ? "a" : "div";
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.35, ease: EASE }}>
      <Tag
        {...(linked ? { href: app.href, target: "_blank", rel: "noreferrer" } : {})}
        className="group flex h-full flex-col rounded-[20px] border border-line bg-surface p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-ink/30 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-start justify-between gap-3">
          {app.logo ? (
            <img src={`/app-logos/${app.logo}.svg`} alt="" loading="lazy" className="h-12 w-12 rounded-[14px] transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110" />
          ) : (
            <span
              className="grid h-12 w-12 place-items-center rounded-[14px] text-[15px] font-semibold text-white transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110"
              style={{ background: `linear-gradient(135deg, hsl(${hueFor(app.name)} 70% 52%), hsl(${(hueFor(app.name) + 50) % 360} 75% 40%))` }}
            >
              {app.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2)}
            </span>
          )}
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-faint">{app.status}</span>
        </div>
        <h4 className="mt-4 text-[17px] font-semibold tracking-[-0.02em] text-ink">{app.name}</h4>
        <p className="mt-1 text-[13.5px] leading-snug text-muted">{app.line}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint">{app.category} · {app.platforms}</span>
          {linked && <ArrowUpRight size={14} className="text-faint transition-colors group-hover:text-ink" />}
        </div>
      </Tag>
    </motion.div>
  );
}

function AppsSection() {
  const [cat, setCat] = useState<(typeof appCategories)[number]>("All");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const q = query.trim().toLowerCase();
  const filtered = appCatalogue.filter((a) => (cat === "All" || a.category === cat) && (!q || `${a.name} ${a.line}`.toLowerCase().includes(q)));
  const visible = showAll || q || cat !== "All" ? filtered : filtered.slice(0, 12);
  return (
    <section id="apps" className="px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <SectionHead
          n="07"
          kicker="Apps & software"
          title={<>{appCatalogue.length} apps and <span className="font-serif font-normal italic">counting.</span></>}
          aside={<>Every one designed and built by me: creative tools, audio, productivity, community and AI. Most run free in your browser right now. Try a few.</>}
        />
        <div className="flex flex-col gap-4 pb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {appCategories.map((c) => {
              const count = c === "All" ? appCatalogue.length : appCatalogue.filter((a) => a.category === c).length;
              const active = cat === c;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${active ? "border-ink bg-ink text-bg" : "border-line text-muted hover:border-ink/40 hover:text-ink"}`}
                >
                  {c} <span className={`ml-1 font-mono text-[11px] ${active ? "opacity-60" : "text-faint"}`}>{count}</span>
                </button>
              );
            })}
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps: stems, font, video…"
            aria-label="Search apps"
            className="w-full rounded-full border border-line bg-surface px-5 py-2.5 text-[14px] text-ink placeholder:text-faint focus:border-ink focus:outline-none md:w-72"
          />
        </div>
        <motion.div layout className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((app) => (
              <AppTile key={app.name} app={app} />
            ))}
          </AnimatePresence>
        </motion.div>
        {filtered.length === 0 && <p className="py-10 text-center text-muted">No apps match that. Maybe I should build it?</p>}
        {!showAll && !q && cat === "All" && filtered.length > visible.length && (
          <div className="mt-8 flex justify-center">
            <button onClick={() => setShowAll(true)} className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-[14px] font-medium text-ink transition-colors hover:border-ink">
              Show all {appCatalogue.length} apps <ArrowDown size={15} />
            </button>
          </div>
        )}
        <p className="mt-8 text-center text-[13.5px] text-faint">
          Listed on <a href="https://momentous-store.netlify.app/apps" target="_blank" rel="noreferrer" className="text-ink underline decoration-accent decoration-2 underline-offset-4">Momentous</a>, the open app and shop directory I built.
        </p>
      </div>
    </section>
  );
}

function FlagshipCard({ item, index, span, onOpenProject, onAnchor }: { item: Flagship; index: number; span: string; onOpenProject: (id: string) => void; onAnchor: (id: string) => void }) {
  const big = span.includes("col-span-4") || span.includes("col-span-6");
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 2) * 0.08 }}
      className={`group relative flex flex-col overflow-hidden rounded-[24px] border border-line bg-surface transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)] ${span}`}
    >
      <div className={`relative overflow-hidden bg-[#0d0d0c] ${big ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        {item.media.video ? (
          <LazyVideo src={item.media.video} className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
        ) : (
          <img src={item.media.image} alt={item.title} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-black/60 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-white backdrop-blur-md">{item.service}</span>
          <span className="rounded-full bg-accent px-3 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-[#111110]">{item.stat}</span>
        </div>
        <span className="pointer-events-none absolute bottom-3 right-4 font-serif text-[64px] italic leading-none text-white/25">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className={`font-semibold leading-tight tracking-[-0.03em] text-ink ${big ? "text-[2rem]" : "text-[1.6rem]"}`}>{item.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.hook}</p>
        <p className="mt-4 border-l-2 border-accent pl-3 text-[14.5px] leading-snug text-ink">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent-ink">For you · </span>
          {item.forYou}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {item.live && (
            <a href={item.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-[13.5px] font-medium text-bg transition-opacity hover:opacity-85">
              {item.liveLabel ?? "Try it live"} <ArrowUpRight size={14} />
            </a>
          )}
          {item.project && (
            <button onClick={() => onOpenProject(item.project!)} className="inline-flex items-center gap-1.5 rounded-full border border-line px-5 py-2.5 text-[13.5px] font-medium text-ink transition-colors hover:border-ink">
              Case study
            </button>
          )}
          {item.anchor && (
            <button onClick={() => onAnchor(item.anchor!)} className="inline-flex items-center gap-1.5 rounded-full border border-line px-5 py-2.5 text-[13.5px] font-medium text-ink transition-colors hover:border-ink">
              {item.anchor === "agents" ? "Get one set up" : "See the walkthrough"} <ArrowDown size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function FlagshipsSection({ onOpenProject, onAnchor }: { onOpenProject: (id: string) => void; onAnchor: (id: string) => void }) {
  return (
    <section id="best" className="border-t border-line px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <SectionHead
          n="02"
          kicker="Best work"
          title={<>Six projects. <span className="font-serif font-normal italic">One</span> for every kind of job.</>}
          aside={<>If you only look at one thing, look here. Each one is live or recorded in action, and each one maps to a service you can hire me for.</>}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {flagships.map((item, i) => (
            <FlagshipCard key={item.title} item={item} index={i} span={spanFor(i, flagships.length)} onOpenProject={onOpenProject} onAnchor={onAnchor} />
          ))}
        </div>
      </div>
    </section>
  );
}

type FileKind = "image" | "video" | "audio" | "document";
const kindOfFile = (f: File): FileKind => {
  if (f.type.startsWith("image/")) return "image";
  if (f.type.startsWith("video/")) return "video";
  if (f.type.startsWith("audio/")) return "audio";
  const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
  if (["heic", "psd", "webp", "tif", "tiff", "raw", "dng"].includes(ext)) return "image";
  if (["mov", "mkv", "m4v", "webm"].includes(ext)) return "video";
  if (["flac", "aif", "aiff", "m4a", "ogg", "opus"].includes(ext)) return "audio";
  return "document";
};

function ToolCard({ tool, highlight }: { tool: Tool; highlight: boolean }) {
  return (
    <motion.a
      layout
      href={tool.href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: EASE }}
      className={`group flex h-full flex-col rounded-[22px] border p-6 transition-[transform,box-shadow,border-color,background-color] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.4)] ${highlight ? "border-ink bg-accent/15" : "border-line bg-surface hover:border-ink/30"}`}
    >
      <div className="flex items-start justify-between gap-3">
        {tool.logo ? (
          <img src={`/app-logos/${tool.logo}.svg`} alt="" loading="lazy" className="h-12 w-12 rounded-[14px] transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110" />
        ) : (
          <span
            className="grid h-12 w-12 place-items-center rounded-[14px] text-[15px] font-semibold text-white transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110"
            style={{ background: `linear-gradient(135deg, hsl(${hueFor(tool.name)} 70% 52%), hsl(${(hueFor(tool.name) + 50) % 360} 75% 40%))` }}
          >
            {tool.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2)}
          </span>
        )}
        <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{tool.job}</span>
      </div>
      <h4 className="mt-4 text-[19px] font-semibold tracking-[-0.02em] text-ink">{tool.name}</h4>
      <p className="mt-1.5 text-[14px] leading-snug text-muted">{tool.line}</p>
      <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-snug text-ink/80">
        <Check size={14} className="mt-0.5 shrink-0 text-accent-ink" />
        <span><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent-ink">Tested · </span>{tool.tested}</span>
      </p>
      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="text-[13.5px] font-medium text-ink">Open tool</span>
        <span className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-bg">
          <ArrowUpRight size={14} />
        </span>
      </div>
      {tool.pitch && <p className="mt-3 border-t border-line pt-3 text-[12.5px] text-accent-ink">{tool.pitch}</p>}
    </motion.a>
  );
}

function ToolboxSection() {
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<{ name: string; kind: FileKind } | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const q = query.trim().toLowerCase();
  const matches = (t: Tool) => {
    if (file) return t.accepts.includes(file.kind) || (file.kind === "document" && t.accepts.includes("any"));
    if (!q) return true;
    return [t.name, t.line, t.job, ...t.tasks].join(" ").toLowerCase().includes(q) || t.tasks.some((task) => q.split(/\s+/).every((w) => task.includes(w)));
  };
  const shown = toolbox.filter(matches);
  const pick = (f: File | undefined) => {
    if (!f) return;
    setQuery("");
    setFile({ name: f.name, kind: kindOfFile(f) });
  };
  const suggestions = ["remove background", "add subtitles", "pdf to excel", "separate vocals", "make vertical video", "find bpm"];
  return (
    <section id="tools" className="px-3 py-10 sm:px-6 md:py-16">
      <div
        className={`relative mx-auto max-w-[1360px] overflow-hidden rounded-[32px] border-2 border-dashed px-6 py-14 transition-colors sm:px-10 md:py-20 lg:px-14 ${dragging ? "border-accent-ink bg-accent/10" : "border-transparent bg-surface"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          if (e.currentTarget === e.target) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files?.[0]);
        }}
      >
        <SectionHead
          n="04"
          kicker="Free tools"
          title={<>Useful every day. <span className="font-serif font-normal italic">Free</span> forever.</>}
          aside={
            <span className="flex items-start gap-2.5">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-accent-ink" />
              <span>No sign-up, no watermark, and your files never leave your device: they&rsquo;re processed right in your browser. I tested every one of these with real files.</span>
            </span>
          }
        />

        {/* finder */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_1fr]">
          <label className="flex items-center gap-3 rounded-full border border-line bg-bg px-5 py-3.5 focus-within:border-ink">
            <Search size={18} className="shrink-0 text-faint" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setFile(null);
                setQuery(e.target.value);
              }}
              placeholder="What do you need to do?"
              aria-label="What do you need to do?"
              className="w-full bg-transparent text-[16px] text-ink placeholder:text-faint focus:outline-none focus-visible:outline-none"
            />
          </label>
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center gap-2.5 rounded-full border border-dashed border-ink/30 px-5 py-3.5 text-[15px] text-muted transition-colors hover:border-ink hover:text-ink"
          >
            <Upload size={17} />
            <span className="hidden sm:inline">Drop a file anywhere here, or</span> <span className="font-medium text-ink">choose one</span>
          </button>
          <input ref={inputRef} type="file" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        </div>

        <div className="mt-4 flex min-h-[2.25rem] flex-wrap items-center gap-2">
          {file ? (
            <>
              <span className="text-[14px] text-ink">
                <span className="font-medium">{file.name}</span> looks like {file.kind === "image" ? "an image" : file.kind === "audio" ? "audio" : file.kind === "video" ? "a video" : "a document"}. These can handle it:
              </span>
              <button onClick={() => setFile(null)} className="rounded-full border border-line px-3 py-1 text-[12.5px] text-muted hover:border-ink hover:text-ink">
                Clear
              </button>
              <span className="text-[12.5px] text-faint">(Nothing was uploaded. The page only read the file type.)</span>
            </>
          ) : (
            <>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">Try</span>
              {suggestions.map((sug) => (
                <button key={sug} onClick={() => setQuery(sug)} className={`rounded-full border px-3 py-1 text-[13px] transition-colors ${q === sug ? "border-ink bg-ink text-bg" : "border-line text-muted hover:border-ink/40 hover:text-ink"}`}>
                  {sug}
                </button>
              ))}
            </>
          )}
        </div>

        <motion.div layout className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {shown.map((tool) => (
              <ToolCard key={tool.name} tool={tool} highlight={Boolean(file || q)} />
            ))}
          </AnimatePresence>
        </motion.div>
        {shown.length === 0 && (
          <p className="py-10 text-center text-[15px] text-muted">
            No tool for that yet. <a href="#contact" className="text-ink underline decoration-accent decoration-2 underline-offset-4">Tell me what you need</a> and I might build it.
          </p>
        )}
        <p className="mt-10 text-center text-[13.5px] text-faint">
          Want a tool like these inside your own product or workflow? That&rsquo;s exactly the kind of thing I build.
        </p>
      </div>
    </section>
  );
}

// Plays when on screen, pauses when off; muted loop, for device mockups.
function DeviceVideo({ src, poster, className = "" }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.playsInline = true;
    if (inView) el.play().catch(() => {});
    else el.pause();
  }, [inView, src]);
  return <video ref={ref} key={src} src={src} poster={poster} muted loop playsInline preload="metadata" className={className} />;
}

function LaptopFrame({ children, url }: { children: ReactNode; url?: string }) {
  return (
    <div className="relative">
      <div className="rounded-[18px] border border-[#2a2826] bg-[#121110] p-2 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.6)] sm:rounded-[22px] sm:p-2.5">
        <div className="flex items-center gap-2 px-2 pb-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          {url && <span className="ml-2 truncate rounded-full bg-white/[0.06] px-3 py-0.5 font-mono text-[10px] text-white/50">{url}</span>}
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-black">{children}</div>
      </div>
      <div className="mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-[14px] bg-gradient-to-b from-[#2b2927] to-[#141312]" />
    </div>
  );
}

function PhoneFrame({ children, className = "", url }: { children: ReactNode; className?: string; url?: string }) {
  return (
    <div className={`relative rounded-[2.6rem] border border-[#2a2826] bg-[#0e0d0c] p-[9px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.65)] ${className}`}>
      <div className="relative flex aspect-[390/844] flex-col overflow-hidden rounded-[2.1rem] bg-black">
        {/* status bar */}
        <div className="flex h-[5.6%] shrink-0 items-end justify-between bg-[#15110e] px-[9%] pb-[1%] text-[9px] font-semibold text-white">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="flex items-end gap-[1.5px]">
              {[3, 5, 7, 9].map((h) => (
                <span key={h} className="w-[2.5px] rounded-sm bg-white" style={{ height: h }} />
              ))}
            </span>
            <span className="ml-1 h-[8px] w-[16px] rounded-[2.5px] border border-white/80 p-[1px]">
              <span className="block h-full w-3/4 rounded-[1px] bg-white" />
            </span>
          </span>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
        {/* Safari-style bottom bar */}
        {url && (
          <div className="flex h-[15.8%] shrink-0 flex-col items-center justify-start gap-[10%] bg-[#1c1c1e] px-[6%] pt-[2.5%]">
            <div className="flex w-full items-center justify-center gap-1.5 rounded-[10px] bg-[#2c2c2e] py-[3.5%] text-[9.5px] text-white/85">
              <span className="text-[8px]">🔒</span>
              {url}
            </div>
            <span className="mt-auto mb-[5%] h-[4px] w-[36%] rounded-full bg-white/80" />
          </div>
        )}
        <span className="pointer-events-none absolute left-1/2 top-2 h-[22px] w-[34%] -translate-x-1/2 rounded-full bg-black" />
      </div>
      <span className="absolute -left-[3px] top-24 h-10 w-[3px] rounded-l bg-[#2a2826]" />
      <span className="absolute -right-[3px] top-32 h-16 w-[3px] rounded-r bg-[#2a2826]" />
    </div>
  );
}

function FullAppsSection() {
  const [active, setActive] = useState(0);
  const [shot, setShot] = useState<number | null>(null);
  const app = fullApps[active];
  return (
    <section id="full-apps" className="px-3 py-10 sm:px-6 md:py-16">
      <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[32px] bg-band px-5 py-12 text-band-fg sm:px-10 md:py-16 lg:px-14">
        <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Kicker className="text-band-muted">
              <span className="text-accent">03</span>
              <span className="mx-2 opacity-40">/</span>
              Full apps, built end to end
            </Kicker>
            <h2 className="mt-5 max-w-[16ch] text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              Not mockups. <span className="font-serif font-normal italic text-accent">Real apps,</span> running right now.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-band-muted">
            Every clip below is a live recording of the shipped app: search, modelling, painting and performing. Design, engine, AI and deployment are all by me.
          </p>
        </div>

        {/* app tabs */}
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {fullApps.map((a, i) => (
            <button
              key={a.id}
              onClick={() => {
                setActive(i);
                setShot(null);
              }}
              aria-pressed={i === active}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-[14px] transition-colors ${i === active ? "border-accent bg-accent text-[#111110]" : "border-band-line text-band-muted hover:border-band-fg/40 hover:text-band-fg"}`}
            >
              {a.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-12"
          >
            {/* stage */}
            <div className="relative">
              <div className={app.phone ? "lg:pr-[18%]" : ""}>
                <LaptopFrame url={app.live.replace("https://", "")}>
                  {shot !== null ? (
                    <img src={app.shots[shot].src} alt={app.shots[shot].label} className="h-full w-full object-cover object-top" />
                  ) : app.phone ? (
                    <img src={app.poster} alt={`${app.name} on desktop`} className="h-full w-full object-cover object-top" />
                  ) : (
                    <DeviceVideo src={app.video} poster={app.poster} className="h-full w-full object-cover object-top" />
                  )}
                </LaptopFrame>
              </div>
              {app.phone && (
                <motion.div
                  initial={{ opacity: 0, y: 40, rotate: 6 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
                  className="absolute -bottom-6 right-0 w-[34%] max-w-[230px] sm:w-[30%]"
                >
                  <PhoneFrame url={app.live.replace("https://", "").replace(/\/$/, "")}>
                    <DeviceVideo src={app.phone.video} poster={app.phone.poster} className="h-full w-full object-cover object-top" />
                  </PhoneFrame>
                </motion.div>
              )}
              {/* screenshot strip */}
              <div className={`mt-6 flex gap-2 overflow-x-auto pb-1 ${app.phone ? "pr-[36%] sm:pr-[32%]" : ""}`}>
                <button
                  onClick={() => setShot(null)}
                  className={`shrink-0 rounded-xl border px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.1em] transition-colors ${shot === null ? "border-accent text-accent" : "border-band-line text-band-muted hover:text-band-fg"}`}
                >
                  ▶ {app.phone ? "Desktop" : "Live clip"}
                </button>
                {app.shots.map((sh, i) => (
                  <button
                    key={sh.src}
                    onClick={() => setShot(i)}
                    title={sh.label}
                    className={`h-12 w-20 shrink-0 overflow-hidden rounded-lg border transition-colors ${shot === i ? "border-accent" : "border-band-line opacity-70 hover:opacity-100"}`}
                  >
                    <img src={sh.src} alt={sh.label} loading="lazy" className="h-full w-full object-cover object-top" />
                  </button>
                ))}
              </div>
            </div>

            {/* details */}
            <div className="self-center">
              <Kicker className="text-accent">{app.kind}</Kicker>
              <h3 className="mt-3 text-[clamp(2rem,3.4vw,2.9rem)] font-semibold leading-[1] tracking-[-0.04em]">{app.name}</h3>
              <p className="mt-4 text-[15.5px] leading-relaxed text-band-muted">{app.pitch}</p>
              <ul className="mt-6 space-y-2.5">
                {app.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14.5px] text-band-fg/90">
                    <Check size={15} className="mt-0.5 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <Kicker className="text-band-muted">What I built</Kicker>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {app.layers.map((l, i) => (
                    <motion.span
                      key={l}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="rounded-full border border-band-line px-3 py-1 font-mono text-[11px] text-band-fg/80"
                    >
                      {l}
                    </motion.span>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href={app.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[14.5px] font-medium text-[#111110] transition-transform hover:-translate-y-0.5">
                  Open {app.name} <ArrowUpRight size={15} />
                </a>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-band-muted">{app.platforms}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function SattariSection({ onInquire }: { onInquire: () => void }) {
  const [tab, setTab] = useState(0);
  const t = sattariCase.tabs[tab];
  return (
    <section id="sattari" className="border-t border-line px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <SectionHead
          n="06"
          kicker="Case study · Sattari"
          title={<>One brand. <span className="font-serif font-normal italic">Everything</span> digital, built by me.</>}
          aside={<>For Sattari Music I built the store website, a free browser music lab, a native plugin suite and an AI video campaign. It shows what &ldquo;design, code and AI under one roof&rdquo; looks like in practice.</>}
        />

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-line bg-line md:grid-cols-4">
          {sattariCase.stats.map((st) => (
            <div key={st.k} className="bg-surface p-5 md:p-6">
              <div className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tracking-[-0.04em] text-ink">{st.v}</div>
              <div className="mt-2 text-[13.5px] leading-snug text-muted">{st.k}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-1">
          {sattariCase.tabs.map((x, i) => (
            <button
              key={x.id}
              onClick={() => setTab(i)}
              aria-pressed={i === tab}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-[14px] transition-colors ${i === tab ? "border-ink bg-ink text-bg" : "border-line text-muted hover:border-ink/40 hover:text-ink"}`}
            >
              {x.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-12"
          >
            <div className="relative">
              <div className={t.phone ? "lg:pr-[16%]" : ""}>
                <LaptopFrame url={t.link.href.replace("https://", "")}>
                  <DeviceVideo src={t.video} poster={t.shots[0]} className="h-full w-full object-cover object-top" />
                </LaptopFrame>
              </div>
              {t.phone && (
                <div className="absolute -bottom-6 right-0 w-[30%] max-w-[210px]">
                  <PhoneFrame url="sattarimusic.com">
                    <img src={t.phone} alt="sattarimusic.com on a phone" className="h-full w-full object-cover object-top" />
                  </PhoneFrame>
                </div>
              )}
              <div className={`mt-8 grid grid-cols-4 gap-2 ${t.phone ? "pr-[34%]" : ""}`}>
                {t.shots.map((src) => (
                  <a key={src} href={src} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-xl border border-line">
                    <img src={src} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                  </a>
                ))}
              </div>
            </div>
            <div className="self-center">
              <Kicker className="text-accent-ink">{t.label}</Kicker>
              <h3 className="mt-3 text-[clamp(1.9rem,3.2vw,2.7rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">{t.title}</h3>
              <p className="mt-4 text-[15.5px] leading-relaxed text-muted">{t.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={t.link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-bg transition-opacity hover:opacity-85">
                  {t.link.label} <ArrowUpRight size={15} />
                </a>
                <button onClick={onInquire} className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-[14px] font-medium text-ink transition-colors hover:border-ink">
                  Build this for my brand
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function ServicesSection({ onOpenProject, onInquire }: { onOpenProject: (id: string) => void; onInquire: () => void }) {
  return (
    <section id="services" className="px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <SectionHead
          n="01"
          kicker="Services"
          title={<>Whatever you need built, <span className="font-serif font-normal italic">designed</span> or automated.</>}
          aside={<>One point of contact for the whole job: design, development, media and AI. No hand-offs between agencies, and every service below links to work I&rsquo;ve actually shipped.</>}
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.05, ease: EASE }}
              className="flex flex-col rounded-[22px] border border-line bg-surface p-7"
            >
              <Kicker className="text-accent-ink">{String(i + 1).padStart(2, "0")} — {service.kicker}</Kicker>
              <h3 className="mt-4 text-[1.6rem] font-semibold leading-tight tracking-[-0.025em] text-ink">{service.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{service.line}</p>
              <ul className="mt-5 space-y-2">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-[14px] text-ink/85">
                    <Check size={15} className="mt-0.5 shrink-0 text-accent-ink" />
                    {d}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <div className="border-t border-line pt-4">
                  <Kicker>See it in</Kicker>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {service.proof.map((id) => {
                      const project = projects.find((p) => p.id === id);
                      if (!project) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => onOpenProject(id)}
                          className="rounded-full border border-line px-3 py-1 text-[12.5px] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg"
                        >
                          {project.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}

          {/* closing tile */}
          <div className="flex flex-col justify-between rounded-[22px] bg-ink p-7 text-bg">
            <div>
              <Kicker className="text-accent">Not on the list?</Kicker>
              <h3 className="mt-4 text-[1.6rem] font-semibold leading-tight tracking-[-0.025em]">If it&rsquo;s digital, ask.</h3>
              <p className="mt-3 text-[15px] leading-relaxed opacity-70">
                Audio plugins, CAD, data dashboards, odd one-off tools: I&rsquo;ve built most of it before. Tell me the
                problem and I&rsquo;ll tell you honestly whether I&rsquo;m the right fit.
              </p>
            </div>
            <button onClick={onInquire} className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-[#111110] transition-transform hover:-translate-y-0.5">
              Tell me what you need <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* Featured generative piece */}
        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <ShowreelVideo src="/videos/sattari-ai-ad.mp4" poster="/photos/sattari-ai-ad-poster.jpg" label="Sattari Music AI-generated video ad" />
          <div>
            <Kicker className="text-accent-ink">Featured · AI video</Kicker>
            <h3 className="mt-4 text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">
              A full ad, <span className="font-serif font-normal italic">generated</span> and directed.
            </h3>
            <p className="mt-4 text-[15.5px] leading-relaxed text-muted">
              A 35-second spot for Sattari Music: one theatrical drum hall, a cast of characters, cut to the beat and
              finished with branding and a scan-to-shop end card. Brands get campaign-grade video without a film
              crew&rsquo;s budget.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => onOpenProject("sattari-ai-ad")} className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-[14px] font-medium text-ink transition-colors hover:border-ink">
                How it was made <ArrowUpRight size={15} />
              </button>
              <button onClick={onInquire} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-bg transition-opacity hover:opacity-85">
                I want one
              </button>
            </div>
          </div>
        </div>

        <ArtGallery />
      </div>
    </section>
  );
}

function AgentsSection({ onOpenProject, onInquire }: { onOpenProject: (id: string) => void; onInquire: () => void }) {
  return (
    <section id="agents" className="px-3 py-10 sm:px-6 md:py-16">
      <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[32px] bg-band text-band-fg">
        <div className="grid grid-cols-1 gap-12 px-6 py-12 sm:px-10 md:py-16 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:px-14">
          <div>
            <Kicker className="text-band-muted">
              <span className="text-accent">08</span>
              <span className="mx-2 opacity-40">/</span>
              Local AI agents
            </Kicker>
            <div className="mt-6 grid h-12 w-12 place-items-center rounded-2xl bg-accent text-[#111110]">
              <Bot size={24} />
            </div>
            <h2 className="mt-6 max-w-[16ch] text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              {agentOffer.title}
            </h2>
            <p className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-band-muted">{agentOffer.line}</p>
            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {agentOffer.includes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14.5px] text-band-fg/90">
                  <Check size={15} className="mt-0.5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <button onClick={onInquire} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-[#111110] transition-transform hover:-translate-y-0.5">
                Book an agent setup <ArrowUpRight size={16} />
              </button>
              <button onClick={() => onOpenProject(agentOffer.proof)} className="inline-flex items-center gap-2 rounded-full border border-band-line px-6 py-3 text-[15px] font-medium text-band-fg transition-colors hover:border-band-fg/50">
                See my agent: Universal Computer Operator
              </button>
            </div>
          </div>

          <ol className="self-center border-t border-band-line">
            {agentOffer.steps.map((step) => (
              <li key={step.k} className="grid grid-cols-[3rem_1fr] gap-2 border-b border-band-line py-5">
                <span className="font-mono text-[12px] leading-7 text-accent">{step.k}</span>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">{step.title}</h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-band-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section id="process" className="border-t border-line px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <SectionHead
          n="11"
          kicker="How we work"
          title={<>Clear steps, <span className="font-serif font-normal italic">visible</span> progress.</>}
          aside="You always know what's being built, what it costs and when it lands."
        />
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-line bg-line md:grid-cols-4">
          {process.map((step) => (
            <div key={step.k} className="bg-surface p-7">
              <span className="font-mono text-[12px] text-accent-ink">{step.k}</span>
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-ink">{step.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3">
          {engagementTypes.map((type) => (
            <div key={type.title} className="rounded-[20px] border border-line p-6">
              <Kicker className="text-accent-ink">Engagement</Kicker>
              <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-ink">{type.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{type.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InquiryBuilder() {
  const [picked, setPicked] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const toggle = (option: string) => setPicked((cur) => (cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option]));
  const subject = `Project inquiry${picked.length ? ` — ${picked.join(", ")}` : ""}`;
  const body = `Hi Armon,\n\nI'm interested in: ${picked.length ? picked.join(", ") : "(not sure yet)"}\n\n${details || "A bit about the project, timeline and budget:"}\n`;
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return (
    <div className="mt-12 rounded-[24px] border border-line bg-bg p-6 md:p-8">
      <Kicker>What do you need? Pick any</Kicker>
      <div className="mt-4 flex flex-wrap gap-2">
        {inquiryOptions.map((option) => {
          const active = picked.includes(option);
          return (
            <button
              key={option}
              onClick={() => toggle(option)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${active ? "border-ink bg-ink text-bg" : "border-line text-muted hover:border-ink/40 hover:text-ink"}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      <label htmlFor="inquiry-details" className="mt-7 block">
        <Kicker>A line or two about the project (optional)</Kicker>
      </label>
      <textarea
        id="inquiry-details"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={3}
        placeholder="e.g. A new site and launch video for our product, live by March."
        className="mt-3 w-full resize-y rounded-2xl border border-line bg-surface px-4 py-3 text-[15px] text-ink placeholder:text-faint focus:border-ink focus:outline-none"
      />
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a href={href} className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-4 text-[15px] font-medium text-bg transition-opacity hover:opacity-85">
          <Mail size={16} /> Send inquiry
        </a>
        <span className="text-[13.5px] text-faint">Opens your email app with this filled in, addressed to {CONTACT_EMAIL}.</span>
      </div>
    </div>
  );
}

// Bento rhythm on a 6-col grid: wide/narrow, narrow/wide, half/half. A lone last card goes full width.
const bentoSpans = ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-4", "lg:col-span-3", "lg:col-span-3"];
const spanFor = (i: number, total: number) => (i === total - 1 && total % 2 === 1 ? "lg:col-span-6" : bentoSpans[i % bentoSpans.length]);

function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => window.location.hash.startsWith("#/product-radar") ? "product-radar" : "home");
  const [indexFilter, setIndexFilter] = useState<string>("All");
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const closeProject = useCallback(() => setOpenProject(null), []);
  const openProjectById = useCallback((id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) setOpenProject(project);
  }, []);
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const syncPage = () => setCurrentPage(window.location.hash.startsWith("#/product-radar") ? "product-radar" : "home");
    window.addEventListener("hashchange", syncPage);
    return () => window.removeEventListener("hashchange", syncPage);
  }, []);

  // Highlight the nav item for whichever section is crossing the upper third of the viewport
  useEffect(() => {
    if (currentPage !== "home") return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { rootMargin: "-30% 0px -60% 0px" }
    );
    ["hero", ...navItems.map((n) => n.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [currentPage]);

  const navigateToHash = (hash: string) => {
    window.history.pushState(null, "", hash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  const scrollToSection = (id: string) => {
    if (currentPage !== "home") {
      navigateToHash("#");
      setCurrentPage("home");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 0);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  if (currentPage === "product-radar") {
    return <ProductRadarPage onHome={() => scrollToSection("hero")} />;
  }

  const liveCount = radarDirectory.filter((d) => d.live).length;

  return (
    <div className="grain min-h-screen bg-bg text-ink antialiased">
      <motion.div style={{ scaleX: progressScaleX }} className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-accent" />

      {/* ── NAV ──────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
        <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between rounded-full border border-line bg-bg/75 pl-5 pr-2 backdrop-blur-xl">
          <button onClick={() => scrollToSection("hero")} className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em] text-ink">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-ink font-serif text-[15px] italic text-bg">a</span>
            Armon Nasiri
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`rounded-full px-3.5 py-1.5 text-[14px] transition-colors ${activeSection === item.id ? "bg-ink/[0.07] text-ink" : "text-muted hover:text-ink"}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollToSection("contact")}
              className="hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-bg transition-opacity hover:opacity-85 sm:inline-flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Start a project
              <ArrowUpRight size={14} />
            </button>
            <button
              className="grid h-10 w-10 place-items-center rounded-full text-ink md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mx-auto mt-2 max-w-[1320px] rounded-3xl border border-line bg-surface p-3 md:hidden"
            >
              {navItems.map((item) => (
                <button key={item.id} onClick={() => scrollToSection(item.id)} className="block w-full rounded-2xl px-4 py-3 text-left text-[17px] text-ink hover:bg-ink/5">
                  {item.label}
                </button>
              ))}
              <button onClick={() => scrollToSection("contact")} className="mt-1 flex w-full items-center justify-between rounded-2xl bg-ink px-4 py-3 text-[17px] text-bg">
                Start a project <ArrowUpRight size={18} />
              </button>
              <a href={STUDIO_URL} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] text-muted">
                thecreateco <ArrowUpRight size={16} />
              </a>
              <a href="#/product-radar" className="flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] text-muted">
                Product Radar <ArrowUpRight size={16} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="relative">
        {/* ── HERO ─────────────────────────────────────────── */}
        <section id="hero" className="relative isolate px-5 sm:px-8">
          <HeroGlow />
          <div className="relative mx-auto max-w-[1320px] pb-16 pt-16 md:pt-24 lg:pb-24">
            <HeroCollage onOpen={openProjectById} />
            <div className="relative lg:max-w-[52%]">
              <motion.button
                onClick={() => scrollToSection("contact")}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-4 text-[13px] text-muted transition-colors hover:border-ink/30"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-80" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7fb800]" />
                </span>
                <span className="whitespace-nowrap"><span className="font-medium text-ink">Taking new clients</span></span><span className="hidden sm:inline">— Los Angeles &amp; remote</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </motion.button>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
                className="mt-10 text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-ink [perspective:600px]"
              >
                <RotatingWord words={heroWords} suffix="," />
                <br />
                you name it,
                <br />
                <span className="font-serif font-normal italic tracking-[-0.02em]">I create it.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
                className="mt-9 max-w-[38rem] text-[19px] leading-relaxed text-muted"
              >
                I&rsquo;m Armon, a digital designer and developer in Los Angeles. Apps, games, software, websites,
                asset generation, image and video, autonomous agents: you name it, I create it. One person from
                first sketch to launch, with {appCatalogue.length} apps and 40+ products already shipped under my own studio,{" "}
                <a href={STUDIO_URL} target="_blank" rel="noreferrer" className="text-ink underline decoration-accent decoration-[3px] underline-offset-4">thecreateco</a>.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                <button
                  onClick={() => scrollToSection("contact")}
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-bg transition-opacity hover:opacity-85"
                >
                  Start a project
                  <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="group inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-[15px] font-medium text-ink transition-colors hover:border-ink"
                >
                  What I can do for you
                  <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
                </button>
              </motion.div>
            </div>

          </div>

          {/* stat strip */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mx-auto grid max-w-[1320px] grid-cols-1 gap-px border-y border-line bg-line sm:grid-cols-3"
          >
            {[
              { k: "Disciplines", v: "Design · Code · AI" },
              { k: "Shipped", v: `${appCatalogue.length} apps · ${radarDirectory.length}+ builds` },
              { k: "Platforms", v: "Web · Mac · iOS · Local" }
            ].map((row) => (
              <div key={row.k} className="bg-bg px-1 py-6 md:px-6 md:first:pl-0">
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">{row.k}</dt>
                <dd className="mt-2 text-[clamp(1.4rem,2.6vw,2rem)] font-semibold tracking-[-0.03em] text-ink">{row.v}</dd>
              </div>
            ))}
          </motion.dl>
        </section>

        {/* ── SKILLS MARQUEE ───────────────────────────────── */}
        <section aria-label="Tools and languages" className="marquee-pause overflow-hidden py-7">
          <div className="marquee-mask">
            <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
              {[...skills, ...skills].map((skill, i) => (
                <span key={i} className="flex items-center gap-8 font-serif text-[26px] italic text-faint">
                  {skill}
                  <span className="not-italic text-accent-ink">✳</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        <ServicesSection onOpenProject={openProjectById} onInquire={() => scrollToSection("contact")} />

        <FlagshipsSection onOpenProject={openProjectById} onAnchor={scrollToSection} />

        <FullAppsSection />

        <ToolboxSection />

        <WebsitesSection onInquire={() => scrollToSection("contact")} />

        <SattariSection onInquire={() => scrollToSection("contact")} />

        <AppsSection />

        <AgentsSection onOpenProject={openProjectById} onInquire={() => scrollToSection("contact")} />

        {/* ── SELECTED WORK ────────────────────────────────── */}
        <section id="work" className="px-5 py-20 sm:px-8 md:py-28">
          <div className="mx-auto max-w-[1320px]">
            <SectionHead
              n="09"
              kicker="More work"
              title={<>Shipped, running, <span className="font-serif font-normal italic">not</span> concepts.</>}
              aside={<>{moreProjects.length} more projects across audio, apps, search and AI. Tap any card for the full breakdown.</>}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
              {moreProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} span={spanFor(i, moreProjects.length)} onOpen={() => setOpenProject(project)} />
              ))}
            </div>
          </div>
        </section>

        {/* ── PLATFORMS / CLIENT WORK ──────────────────────── */}
        <section id="platforms" className="px-5 pb-20 sm:px-8 md:pb-28">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex items-baseline justify-between border-b border-line pb-5">
              <Kicker>Platforms &amp; client sites</Kicker>
              <Kicker>{websiteProjects.length} live</Kicker>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 pt-8 md:grid-cols-3">
              {websiteProjects.map((project) => (
                <motion.a
                  key={project.id}
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="group block"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-[18px] border border-line bg-[#0d0d0c]">
                    <ProjectMedia project={project} className="opacity-95 transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink">{project.title}</h3>
                      <p className="mt-1 text-[14px] leading-relaxed text-muted">{project.subtitle}</p>
                    </div>
                    <ArrowUpRight size={18} className="mt-1 shrink-0 text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ── STUDIO / THECREATECO ─────────────────────────── */}
        <section id="studio" className="px-3 py-10 sm:px-6 md:py-16">
          <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[32px] bg-band text-band-fg">
            <div className="grid grid-cols-1 gap-12 px-6 pb-12 pt-12 sm:px-10 md:pt-16 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14 lg:px-14 lg:pb-16">
              <div className="flex flex-col">
                <Kicker className="text-band-muted">
                  <span className="text-accent">10</span>
                  <span className="mx-2 opacity-40">/</span>
                  Founder · the studio
                </Kicker>
                <h2 className="mt-6 text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
                  thecreateco<span className="text-accent">.</span>
                </h2>
                <p className="mt-5 font-serif text-[clamp(1.6rem,3vw,2.3rem)] italic leading-tight text-band-fg/90">Here to create. Freely.</p>
                <p className="mt-7 max-w-[34rem] text-[17px] leading-relaxed text-band-muted">
                  An independent creative software studio for 3D, images, music and film — built by artists and tech
                  nerds who want creative tools to be powerful, accessible and a joy to use. The <span className="text-band-fg">Lite</span> editions stay
                  free and fully capable; <span className="text-band-fg">Pro</span> desktop builds for Mac and Windows are in development, with a
                  Kickstarter on the way.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href={STUDIO_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-[#111110] transition-transform hover:-translate-y-0.5">
                    Visit thecreatingco.com <ArrowUpRight size={16} />
                  </a>
                  <a href={`${STUDIO_URL}/kickstarter/`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-band-line px-6 py-3 text-[15px] font-medium text-band-fg transition-colors hover:border-band-fg/50">
                    Join the launch list
                  </a>
                </div>
              </div>

              <div className="self-center">
                <ScrollScrubVideo
                  src="/videos/thecreateco-journey.mp4"
                  poster="/photos/thecreateco-journey-poster.jpg"
                  label="thecreateco creative journey: Form Studio, Luma Studio, StemDeck and ScenePilot"
                />
                <a href={STUDIO_URL} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-band-muted transition-colors hover:text-band-fg">
                  Shape it. Design it. Score it. Bring it to life. <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            {/* Suite examples */}
            <div className="border-t border-band-line px-6 py-10 sm:px-10 lg:px-14">
              <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
                <div>
                  <Kicker className="text-band-muted">Inside thecreatingco.com</Kicker>
                  <h3 className="mt-4 max-w-[13ch] text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
                    Form to Luma to StemDeck to ScenePilot.
                  </h3>
                  <p className="mt-5 max-w-[32rem] text-[15px] leading-relaxed text-band-muted">
                    The studio is framed as a free creative toolset for 3D, images, music and film: core apps with
                    Lite editions, focused companion tools, and a bigger desktop Pro track coming behind them.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {studioSuiteExamples.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group min-h-[220px] border border-band-line bg-band-fg/[0.03] p-5 transition-colors hover:border-band-fg/45"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-band-muted">{item.kind}</p>
                          <h4 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{item.name}</h4>
                        </div>
                        <ArrowUpRight size={16} className="mt-1 shrink-0 text-band-muted transition-colors group-hover:text-band-fg" />
                      </div>
                      <p className="mt-4 text-[14px] leading-relaxed text-band-muted">{item.line}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {item.examples.map((example) => (
                          <span key={example} className="border border-band-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-band-muted">
                            {example}
                          </span>
                        ))}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-9 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {studioToolExamples.map((tool) => (
                  <article
                    key={tool.name}
                    id={"id" in tool ? tool.id : undefined}
                    className="min-h-[230px] border border-band-line p-5 transition-colors hover:border-band-fg/40"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">{tool.kind}</p>
                    <h4 className="mt-3 text-xl font-semibold tracking-[-0.025em]">{tool.name}</h4>
                    <p className="mt-4 text-[14px] leading-relaxed text-band-muted">{tool.body}</p>
                    <p className="mt-5 border-t border-band-line pt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-band-muted">{tool.example}</p>
                  </article>
                ))}
              </div>
            </div>

            {/* More from the studio */}
            <div className="border-t border-band-line px-6 py-10 sm:px-10 lg:px-14">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <Kicker className="shrink-0 text-band-muted lg:w-40">More from the studio</Kicker>
                <div className="flex flex-wrap gap-2">
                  {studioApps.map((app) => {
                    const isInternal = app.href.startsWith("#");

                    return (
                      <a
                        key={app.name}
                        href={app.href}
                        target={isInternal ? undefined : "_blank"}
                        rel={isInternal ? undefined : "noreferrer"}
                        title={app.line}
                        className="group inline-flex items-center gap-2 rounded-full border border-band-line px-4 py-2 text-[14px] transition-colors hover:border-band-fg/50"
                      >
                        <span className="font-medium">{app.name}</span>
                        <span className="text-band-muted">· {app.kind}</span>
                        <ArrowUpRight size={13} className="text-band-muted transition-colors group-hover:text-band-fg" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProcessSection />

        {/* ── ABOUT ────────────────────────────────────────── */}
        <section id="about" className="border-t border-line px-5 py-20 sm:px-8 md:py-28">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
              <div>
                <Kicker>
                  <span className="text-accent-ink">12</span>
                  <span className="mx-2 text-line">/</span>
                  About
                </Kicker>
                <p className="mt-6 text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
                  A designer who can <span className="font-serif font-normal italic">engineer</span>, and an engineer who can <span className="font-serif font-normal italic">design</span>.
                </p>
                <div className="mt-8 max-w-[34rem] space-y-5 text-[16px] leading-relaxed text-muted">
                  <p>
                    Most projects need a brand, a site, some media and a bit of software that ties it together. Usually
                    that means three vendors and a lot of lost context. I do all of it myself, so the look, the code
                    and the AI all come from one plan.
                  </p>
                  <p>
                    The range is real: C++ plugins running inside professional DAWs, a Rust image editor with local
                    inference, CAD, AI video, game-style real-time 3D, client storefronts and a local agent that
                    operates a Mac.
                  </p>
                  <p>
                    thecreateco is where it comes together: creative tools with freedom at the centre — no subscription
                    wall in front of your ideas, no connection required to keep making.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 self-start sm:grid-cols-2">
                {capabilities.map((cap, i) => (
                  <motion.div
                    key={cap.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                    className="rounded-[20px] border border-line bg-surface p-7"
                  >
                    <Kicker className="text-accent-ink">{cap.kicker}</Kicker>
                    <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-ink">{cap.title}</h3>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">{cap.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* experience */}
            <div className="mt-20 border-t border-line">
              {experience.map((item) => (
                <div key={item.role + item.org} className="grid grid-cols-1 gap-3 border-b border-line py-8 md:grid-cols-[1fr_1.6fr_auto] md:gap-10">
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink">{item.role}</h3>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 font-serif text-xl italic text-accent-ink hover:underline">
                        {item.org} <ArrowUpRight size={14} />
                      </a>
                    ) : (
                      <div className="mt-1 font-serif text-xl italic text-muted">{item.org}</div>
                    )}
                  </div>
                  <p className="text-[15.5px] leading-relaxed text-muted">{item.body}</p>
                  <div className="flex flex-wrap gap-1.5 md:max-w-[15rem] md:justify-end">
                    {item.tags.map((t) => (
                      <span key={t} className="h-fit rounded-full border border-line px-2.5 py-1 font-mono text-[10.5px] text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FULL INDEX ───────────────────────────────────── */}
        <section id="index" className="px-5 py-20 sm:px-8 md:py-28">
          <div className="mx-auto max-w-[1320px]">
            <SectionHead
              n="13"
              kicker="Full index"
              title="Everything I've built."
              aside={
                <>
                  {radarDirectory.length} entries, {liveCount} live. For roadmaps and test builds, see the{" "}
                  <a href="#/product-radar" className="text-ink underline decoration-accent decoration-2 underline-offset-4">Product Radar</a>.
                </>
              }
            />

            <div className="flex flex-wrap gap-2 pb-6">
              {["All", ...radarDirectoryGroups].map((group) => {
                const active = indexFilter === group;
                const count = group === "All" ? radarDirectory.length : radarDirectory.filter((d) => d.group === group).length;
                return (
                  <button
                    key={group}
                    onClick={() => setIndexFilter(group)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${active ? "border-ink bg-ink text-bg" : "border-line text-muted hover:border-ink/40 hover:text-ink"}`}
                  >
                    {group} <span className={`ml-1 font-mono text-[11px] ${active ? "opacity-60" : "text-faint"}`}>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-ink/80 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
                    <th className="w-12 py-3 font-normal">#</th>
                    <th className="py-3 font-normal">Project</th>
                    <th className="py-3 font-normal">Stack</th>
                    <th className="py-3 font-normal">Type</th>
                    <th className="py-3 text-right font-normal">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {radarDirectory
                    .filter((d) => indexFilter === "All" || d.group === indexFilter)
                    .map((item, i) => (
                      <tr key={item.name} className="group border-b border-line transition-colors hover:bg-ink/[0.03]">
                        <td className="py-4 align-top font-mono text-[11px] leading-6 text-faint">{String(i + 1).padStart(2, "0")}</td>
                        <td className="py-4 pr-6 align-top">
                          <div className="flex items-center gap-2.5">
                            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.live ? "bg-[#7fb800]" : "bg-faint/50"}`} title={item.live ? "Live" : "Not public"} />
                            <span className="text-[16px] font-medium text-ink">{item.name}</span>
                          </div>
                          <p className="mt-1 max-w-[52ch] pl-4 text-[13.5px] leading-snug text-muted">{item.blurb}</p>
                        </td>
                        <td className="py-4 pr-6 align-top font-mono text-[11px] leading-6 text-muted">{item.stack}</td>
                        <td className="py-4 pr-6 align-top font-mono text-[10.5px] uppercase leading-6 tracking-[0.1em] text-faint">{item.group}</td>
                        <td className="py-4 text-right align-top">
                          <div className="flex justify-end gap-2">
                            {item.live && (
                              <a href={item.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-[12.5px] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg">
                                Visit <ArrowUpRight size={12} />
                              </a>
                            )}
                            {item.repo && (
                              <a href={item.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-[12.5px] text-muted transition-colors hover:border-ink hover:text-ink">
                                Code
                              </a>
                            )}
                            {!item.live && !item.repo && <span className="text-faint">—</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── CONTACT ──────────────────────────────────────── */}
        <section id="contact" className="px-3 pb-6 sm:px-6">
          <div className="mx-auto max-w-[1360px] rounded-[32px] border border-line bg-surface px-6 py-20 sm:px-10 md:py-28 lg:px-14">
            <Kicker>
              <span className="text-accent-ink">14</span>
              <span className="mx-2 text-line">/</span>
              Contact
            </Kicker>
            <p className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-ink">
              Let&rsquo;s build
              <br />
              <span className="font-serif font-normal italic text-accent-ink">your thing.</span>
            </p>
            <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-xl text-[17px] leading-relaxed text-muted">
                Taking on design, development, AI media and agent-setup projects for founders, brands, creators and
                small teams. Tell me what you&rsquo;re making, and I&rsquo;ll reply with next steps, usually within a day.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2.5 rounded-full border border-line px-7 py-4 text-[15px] font-medium text-ink transition-colors hover:border-ink">
                  <Mail size={16} /> {CONTACT_EMAIL}
                </a>
                <a href="https://github.com/armonon" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 rounded-full border border-line px-7 py-4 text-[15px] font-medium text-ink transition-colors hover:border-ink">
                  <Code2 size={16} /> GitHub
                </a>
              </div>
            </div>
            <InquiryBuilder />
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-[1320px]">
          <motion.figure
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mx-auto mb-10 w-full max-w-[18rem]"
          >
            <div className="overflow-hidden rounded-[28px] border border-line bg-surface p-2.5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)]">
              <img src="/photos/armon-portrait.jpg" alt="Armon Nasiri" width={1000} height={1333} className="aspect-[4/5] w-full rounded-[20px] object-cover object-[50%_35%]" />
              <figcaption className="flex items-center justify-between px-2 pb-1 pt-3">
                <span className="text-[14px] font-medium text-ink">Armon Nasiri</span>
                <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-80" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#7fb800]" />
                  </span>
                  Available
                </span>
              </figcaption>
            </div>
          </motion.figure>

          <div className="flex flex-col gap-4 text-[13px] text-faint sm:flex-row sm:items-center sm:justify-between">
            <span>
              <span className="text-ink">Armon Nasiri</span> — Digital designer &amp; developer · founder of{" "}
              <a href={STUDIO_URL} target="_blank" rel="noreferrer" className="text-ink hover:underline">thecreateco</a>
            </span>
            <div className="flex flex-wrap gap-5">
              <a href={STUDIO_URL} target="_blank" rel="noreferrer" className="hover:text-ink">thecreatingco.com</a>
              <a href="#/product-radar" className="hover:text-ink">Product Radar</a>
              <a href="https://github.com/armonon" target="_blank" rel="noreferrer" className="hover:text-ink">GitHub</a>
              <span>© 2026</span>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>{openProject && <ProjectModal project={openProject} onClose={closeProject} />}</AnimatePresence>
    </div>
  );
}

export default App;
