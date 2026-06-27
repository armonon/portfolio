import { animate, AnimatePresence, motion, useInView, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ExternalLink, Code2, Mail, Sparkles, Download, RefreshCw } from "lucide-react";
import { radarEvidenceLedger, radarIdeaFeed, radarLanes, radarMetrics, radarNextBuildSteps, radarOpportunities, radarSoftwareProjects } from "./productRadarData";

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

function CountUp({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % words.length), 2200);
    return () => clearInterval(timer);
  }, [words.length]);
  return (
    <span className="relative inline-grid align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: "0.6em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-0.6em", opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="col-start-1 row-start-1 whitespace-nowrap bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
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
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-cyan-400/30 bg-cyan-950/20 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
            <Code2 size={16} /> Usable web prototype
          </div>
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">{scenario.eyebrow}</h2>
          <p className="mt-3 leading-relaxed text-zinc-300">{scenario.prompt}</p>
        </div>
        <div className="w-full rounded-3xl border border-white/10 bg-black/25 p-5 lg:max-w-sm">
          <div className="flex items-center justify-between gap-3 text-sm font-semibold text-zinc-300">
            <span>Prototype score</span>
            <span>{output.score}%</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-cyan-200" style={{ width: `${output.score}%` }} />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cyan-100">{output.headline}</p>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Try controls</div>
          <div className="mt-5 space-y-4">
            {scenario.controls.map((control) => (
              <label key={control.key} className="block rounded-2xl border border-white/10 bg-zinc-950/50 p-4">
                <div className="mb-2 flex items-center justify-between gap-3 text-sm font-bold text-zinc-200">
                  <span>{control.label}</span>
                  {control.type === "range" ? <span className="text-cyan-100">{String(values[control.key])}</span> : null}
                </div>
                {control.type === "select" ? (
                  <select
                    value={asString(values[control.key], asString(control.value))}
                    onChange={(event) => updateValue(control.key, event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-cyan-200"
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
                    className="w-full accent-cyan-200"
                  />
                ) : control.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={asBoolean(values[control.key])}
                    onChange={(event) => updateValue(control.key, event.target.checked)}
                    className="h-5 w-5 accent-cyan-200"
                  />
                ) : control.type === "textarea" ? (
                  <textarea
                    value={asString(values[control.key], asString(control.value))}
                    onChange={(event) => updateValue(control.key, event.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-cyan-200"
                  />
                ) : (
                  <input
                    type="text"
                    value={asString(values[control.key], asString(control.value))}
                    onChange={(event) => updateValue(control.key, event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-cyan-200"
                  />
                )}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setTick((current) => current + 1)}
            className="mt-5 w-full rounded-2xl bg-white px-5 py-4 text-sm font-black text-black transition hover:bg-zinc-200"
          >
            Generate / refresh prototype output
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Generated output</div>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">{output.headline}</h3>
            <p className="mt-3 leading-relaxed text-zinc-300">{output.summary}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {output.cards.map((card) => (
              <div key={`${card.label}-${card.value}`} className="rounded-3xl border border-white/10 bg-black/25 p-5">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">{card.label}</div>
                <h4 className="mt-2 text-lg font-bold tracking-tight text-white">{card.value}</h4>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Run path</div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-5">
            {output.steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-zinc-950/50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-black text-black">{index + 1}</div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Prototype artifact</div>
          <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-zinc-950/70 p-4 text-xs leading-relaxed text-zinc-300">{output.artifact}</pre>
          <a
            href={createDownloadHref(scenario.eyebrow, output.artifact)}
            download={`${softwareId}-prototype-artifact.txt`}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-100 px-5 py-3 text-sm font-black text-black transition hover:bg-white"
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-10%] h-[34rem] w-[34rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute right-[-14%] top-[5%] h-[34rem] w-[34rem] rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[30%] h-[30rem] w-[30rem] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={selectedLane || selectedSoftware ? closeDetail : onHome}
            className="w-fit rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
          >
            {selectedLane || selectedSoftware ? "← Back to Radar directory" : "← Back to portfolio"}
          </button>
          <div className="rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm text-zinc-400">
            Product Radar · {selectedSoftware ? `${selectedSoftware.title} test page` : selectedLane ? `${selectedLane.title} detail` : "v0.5 software test lab"}
          </div>
        </div>

        {selectedSoftware ? (
          <>
            <section className="overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/60 p-7 shadow-2xl shadow-black/30 backdrop-blur md:p-10 lg:p-12">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300">
                    <Download size={16} /> {selectedSoftware.category} · {selectedSoftware.status}
                  </div>
                  <h1 className="text-4xl font-black tracking-tight md:text-6xl">{selectedSoftware.title}</h1>
                  <p className="mt-5 text-lg leading-relaxed text-zinc-300 md:text-xl">{selectedSoftware.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {selectedSoftware.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-zinc-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <figure className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20">
                  <img src={selectedSoftware.image} alt={`${selectedSoftware.title} product visual`} className="h-80 w-full object-cover" />
                  <figcaption className="border-t border-white/10 px-5 py-4 text-sm text-zinc-300">Testing page for {selectedSoftware.title}</figcaption>
                </figure>
              </div>
            </section>

            {!["entropy", "model-studio"].includes(selectedSoftware.id) && (
              <InteractivePrototypeLab key={selectedSoftware.id} softwareId={selectedSoftware.id} />
            )}

            <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <aside className="space-y-4">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
                  <h2 className="text-2xl font-bold tracking-tight">Downloadables</h2>
                  <div className="mt-5 space-y-3">
                    {selectedSoftware.downloads.length ? selectedSoftware.downloads.map((download) => (
                      <a
                        key={`${download.label}-${download.href}`}
                        href={download.href}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
                      >
                        <span>{download.label}</span>
                        <Download size={15} />
                      </a>
                    )) : (
                      <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-zinc-400">
                        No download pack yet — use the source and live links to explore this product.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
                  <h2 className="text-2xl font-bold tracking-tight">Open project</h2>
                  <div className="mt-5 space-y-3">
                    {[selectedSoftware.live, selectedSoftware.repo].filter(Boolean).length ? [selectedSoftware.live, selectedSoftware.repo].filter(Boolean).map((link) => (
                      <a
                        key={link!.label}
                        href={link!.href}
                        target={linkTarget(link!.href)}
                        rel={link!.href.startsWith("http") ? "noreferrer" : undefined}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white hover:text-black"
                      >
                        <span>{link!.label}</span>
                        <ExternalLink size={15} />
                      </a>
                    )) : (
                      <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-zinc-400">
                        The Radar page below is the first web test surface; no separate live app/repo link is attached yet.
                      </p>
                    )}
                  </div>
                </div>
              </aside>

              <div className="space-y-4">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur md:p-8">
                  <h2 className="text-2xl font-bold tracking-tight">What to test</h2>
                  <p className="mt-3 leading-relaxed text-zinc-300">{selectedSoftware.testingFocus}</p>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur md:p-8">
                  <h2 className="text-2xl font-bold tracking-tight">Quick testing checklist</h2>
                  <div className="mt-5 space-y-3">
                    {selectedSoftware.testSteps.map((step, index) => (
                      <div key={step} className="grid grid-cols-[2.25rem_1fr] gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-black text-black">{index + 1}</div>
                        <p className="leading-relaxed text-zinc-300">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : selectedLane ? (
          <>
            <section className={`overflow-hidden rounded-[2rem] border border-zinc-800 bg-gradient-to-br ${selectedLane.accent} p-[1px] shadow-2xl shadow-black/30`}>
              <div className="rounded-[2rem] bg-zinc-950/88 p-7 backdrop-blur md:p-10 lg:p-12">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300">
                      <span className="text-lg">{selectedLane.icon}</span> {selectedLane.detail.eyebrow}
                    </div>
                    <h1 className="text-4xl font-black tracking-tight md:text-6xl">{selectedLane.title}</h1>
                    <p className="mt-5 text-lg leading-relaxed text-zinc-300 md:text-xl">{selectedLane.detail.description}</p>
                  </div>
                  <div className="w-full rounded-3xl border border-white/10 bg-black/25 p-5 lg:max-w-sm">
                    <div className="flex items-center justify-between gap-3 text-sm font-semibold text-zinc-300">
                      <span>{selectedLane.status}</span>
                      <span>{selectedLane.readiness}% ready</span>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-white" style={{ width: `${selectedLane.readiness}%` }} />
                    </div>
                    <div className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{selectedLane.phase}</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur md:p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {selectedLane.detail.images.map((image) => (
                    <figure key={image.src} className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                      <img src={image.src} alt={image.alt} className="h-64 w-full object-cover" />
                      <figcaption className="border-t border-white/10 px-4 py-3 text-sm text-zinc-300">{image.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>

              <aside className="space-y-4">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
                  <h2 className="text-2xl font-bold tracking-tight">Downloads + links</h2>
                  <div className="mt-5 space-y-3">
                    {selectedLane.detail.downloads.map((download) => (
                      <a
                        key={`${download.label}-${download.href}`}
                        href={download.href}
                        target={linkTarget(download.href)}
                        rel={download.href.startsWith("http") ? "noreferrer" : undefined}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white hover:text-black"
                      >
                        <span>{download.label}</span>
                        <ExternalLink size={15} />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
                  <h2 className="text-2xl font-bold tracking-tight">Project notes</h2>
                  <ul className="mt-5 space-y-3">
                    {selectedLane.detail.highlights.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </section>

            <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur md:p-8">
                <h2 className="text-2xl font-bold tracking-tight">Next action</h2>
                <p className="mt-3 leading-relaxed text-zinc-300">{selectedLane.nextAction}</p>
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur md:p-8">
                <h2 className="text-2xl font-bold tracking-tight">On the roadmap</h2>
                <p className="mt-3 leading-relaxed text-zinc-400">{selectedLane.blocker}</p>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/60 p-7 shadow-2xl shadow-black/30 backdrop-blur md:p-10 lg:p-12">
              <div className="max-w-4xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300">
                  <Sparkles size={16} /> Live products · apps · plugins · tools
                </div>
                <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                  Product Radar — every live product in one place.
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300 md:text-xl">
                  A live directory of working software: apps, plugins, dashboards, and creator tools. Open any product for a clear overview, its live link or source, downloads, and exactly how to try it.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
                {radarMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-3xl font-black tracking-tight text-white">{metric.value}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{metric.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {showAdminSweep && (
            <section className="mt-8 overflow-hidden rounded-[2rem] border border-emerald-400/30 bg-emerald-950/20 p-6 shadow-2xl shadow-emerald-950/20 backdrop-blur md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100">
                    <RefreshCw size={16} /> Admin system refresh
                  </div>
                  <h2 className="text-3xl font-black tracking-tight md:text-5xl">Run a full Product Radar sweep.</h2>
                  <p className="mt-3 leading-relaxed text-zinc-300">
                    This protected button requests the system to scan every product blocker, work safe fixes, verify before pushing, push clean changes, and generate a fresh next step for each product.
                  </p>
                  <p className="mt-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-zinc-400">
                    Safety gate: the public site only sends a request after an admin token is entered. The live automation still needs the private Netlify environment variables for the webhook and token.
                  </p>
                </div>
                <div className="w-full rounded-3xl border border-white/10 bg-black/25 p-5 lg:max-w-sm">
                  <button
                    type="button"
                    onClick={requestFullSystemSweep}
                    disabled={isSweepRunning}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-black text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RefreshCw size={18} className={isSweepRunning ? "animate-spin" : undefined} />
                    {isSweepRunning ? "Requesting sweep…" : "Update all products"}
                  </button>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-300">{sweepMessage}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="text-2xl font-black text-white">{liveLinkedRadarEvidence.length}</div>
                      <div className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-zinc-500">live rows</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="text-2xl font-black text-white">{liveLinkedRadarSoftwareProjects.length}</div>
                      <div className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-zinc-500">live products</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            )}

            <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-900/60 p-6 shadow-2xl shadow-black/20 backdrop-blur md:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300">
                    <Sparkles size={16} /> Product ledger · ranked by proof
                  </div>
                  <h2 className="text-3xl font-black tracking-tight md:text-5xl">What's live, what's proven, and what ships next.</h2>
                  <p className="mt-3 max-w-3xl leading-relaxed text-zinc-400">
                    Every live product, ranked by proof and usefulness. Each row shows the latest proof, the next roadmap milestone, what ships next, and the revenue path.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-zinc-300">
                  {liveLinkedRadarEvidence.length} live products
                </div>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {liveLinkedRadarEvidence.map((item, index) => (
                  <article key={item.projectName} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Rank {index + 1}</div>
                        <h3 className="mt-1 text-2xl font-bold tracking-tight text-white">{item.projectName}</h3>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white">
                        {readinessPhase(item.readinessScore)}
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-zinc-300">{item.promise}</p>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Latest proof</div>
                        <p className="mt-1 text-sm leading-relaxed text-zinc-300">{item.latestProof}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">On the roadmap</div>
                        <p className="mt-1 text-sm leading-relaxed text-zinc-300">{item.blocker}</p>
                      </div>
                    </div>
                    <div className="mt-3 rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">What ships next</div>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-200">{item.nextStep}</p>
                    </div>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs leading-relaxed text-zinc-500">Revenue path: {item.monetization}</p>
                      {item.softwareId ? (
                        <button
                          type="button"
                          onClick={() => openSoftware(item.softwareId!)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white hover:text-black"
                        >
                          Open test page <ExternalLink size={13} />
                        </button>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-900/60 p-6 shadow-2xl shadow-black/20 backdrop-blur md:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300">
                    <Download size={16} /> Software downloads + test pages
                  </div>
                  <h2 className="text-3xl font-black tracking-tight md:text-5xl">Live software projects in one place.</h2>
                  <p className="mt-3 max-w-3xl leading-relaxed text-zinc-400">
                    Only projects with public live links are shown here. Each card opens a focused testing page with the live link, product description, downloadables when available, and practical test steps.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-zinc-300">
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
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/20 outline-none transition focus:ring-2 focus:ring-white/70"
                  >
                    <img src={project.image} alt={`${project.title} preview`} className="h-40 w-full object-cover opacity-90 transition group-hover:opacity-100" />
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-zinc-400">
                          {project.category}
                        </span>
                        <span className="text-xs font-semibold text-zinc-400">{project.downloads.length} download</span>
                      </div>
                      <h3 className="mt-4 text-xl font-bold tracking-tight text-white">{project.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{project.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[0.7rem] font-semibold text-zinc-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto flex flex-wrap gap-2 pt-5">
                        <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs font-semibold text-zinc-200">
                          Full test page <ExternalLink size={13} />
                        </span>
                        {project.downloads.slice(0, 1).map((download) => (
                          <a
                            key={download.href}
                            href={download.href}
                            onClick={(event) => event.stopPropagation()}
                            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white px-3 py-2 text-xs font-bold text-black transition hover:bg-zinc-200"
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
                  className={`cursor-pointer overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br ${lane.accent} p-[1px] outline-none transition focus:ring-2 focus:ring-white/70`}
                >
                  <div className="flex h-full flex-col rounded-3xl bg-zinc-950/86 p-6 backdrop-blur">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                        {lane.icon}
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-zinc-300">
                        {lane.status}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">{lane.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300">{lane.summary}</p>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                        <span>{lane.phase}</span>
                        <span className="text-zinc-200">{lane.readiness}%</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-white" style={{ width: `${lane.readiness}%` }} />
                      </div>
                    </div>

                    <ul className="mt-5 space-y-2">
                      {lane.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2 text-sm text-zinc-400">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Next action</div>
                        <p className="mt-1 text-zinc-200">{lane.nextAction}</p>
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">On the roadmap</div>
                        <p className="mt-1 text-zinc-400">{lane.blocker}</p>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs font-semibold text-zinc-200">
                        Open details <ExternalLink size={13} />
                      </span>
                      {[lane.primaryLink, lane.secondaryLink].filter(Boolean).map((link) => (
                        <a
                          key={link!.label}
                          href={link!.href}
                          target={linkTarget(link!.href)}
                          rel={link!.href.startsWith("http") ? "noreferrer" : undefined}
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white hover:text-black"
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
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur md:p-8">
                <h2 className="text-3xl font-bold tracking-tight">Opportunity radar</h2>
                <div className="mt-6 space-y-3">
                  {radarOpportunities.map((item, index) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Idea {index + 1}</div>
                      <p className="mt-2 text-zinc-200">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur md:p-8">
                <h2 className="text-3xl font-bold tracking-tight">Next build sequence</h2>
                <div className="mt-6 space-y-4">
                  {radarNextBuildSteps.map((step, index) => (
                    <div key={step.title} className="grid grid-cols-[2.25rem_1fr_auto] gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-black text-black">{index + 1}</div>
                      <div>
                        <h3 className="font-semibold text-white">{step.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-zinc-400">{step.body}</p>
                      </div>
                      <span className="hidden h-fit rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-zinc-300 sm:inline-block">{step.state}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur md:p-8">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Daily app idea feed</h2>
                  <p className="mt-2 max-w-2xl text-zinc-400">
                    Seed lane for the daily visionary app ideas. The next pass can promote the best idea into a product ticket.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-zinc-300">
                  Daily loop active
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {radarIdeaFeed.map((idea) => (
                  <div key={idea.name} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <h3 className="text-xl font-bold text-white">{idea.name}</h3>
                    <p className="mt-2 text-sm text-zinc-300">{idea.theme}</p>
                    <div className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">MVP</div>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-400">{idea.mvp}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => window.location.hash.startsWith("#/product-radar") ? "product-radar" : "home");
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const syncPage = () => setCurrentPage(window.location.hash.startsWith("#/product-radar") ? "product-radar" : "home");
    window.addEventListener("hashchange", syncPage);
    return () => window.removeEventListener("hashchange", syncPage);
  }, []);

  const projects = [
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
      label: "Audio Plugin",
      image: "/photos/entropy-example.svg",
      status: "Working build",
      accent: "from-lime-500/30 via-green-500/20 to-emerald-500/30"
    },
    {
      id: "model-studio",
      title: "Model Studio",
      section: "software",
      subtitle: "Garment artwork → polished product photos & video",
      description:
        "A deterministic product-mockup studio that composites a seller's exact print artwork onto blank apparel plates and exports clean product images and basic promo video — a Printful/Printify-style mockup generator that runs in the browser at near-zero cost per product.",
      tech: ["JavaScript", "Canvas", "Image Compositing", "Background Removal"],
      points: [
        "Composites the exact artwork onto mannequin/apparel plates — accurate output, not a generative guess.",
        "Free in-browser background removal with an optional Gemini AI assist, so there's no per-image API cost for the core flow.",
        "Built for e-commerce sellers who need consistent, owned product imagery without a paid mockup subscription."
      ],
      live: "#",
      liveLabel: "Live tool",
      github: "https://github.com/armonon/photoboothstudio",
      label: "Commerce Tool",
      image: "/photos/model-studio-example.svg",
      status: "Live tool",
      accent: "from-sky-500/30 via-blue-500/20 to-indigo-500/30"
    },
    {
      id: "scenepilot-studio",
      title: "ScenePilot Studio",
      section: "software",
      subtitle: "Beat-aware creator workflow and auto-arranged edit plans",
      description:
        "A public beta for creator kits: logos, voiceovers, clips, and effects can be organized into beat-aware arrangement plans for faster video assembly.",
      tech: ["React", "Audio Analysis", "Timeline UX", "Creator Tools"],
      points: [
        "Turns raw creator assets into a clearer edit-plan structure instead of a blank timeline.",
        "Maps beats and cuts to asset lanes and arrangement logic for short-form content workflows.",
        "Live public beta, with one-click rendered MP4 export and manual timeline controls on the roadmap."
      ],
      live: "https://sattari-auto-cut.netlify.app",
      liveLabel: "Live Beta",
      github: "https://github.com/armonon/scenepilot-compositor",
      label: "Video Tool",
      image: "/photos/context-compositor-example.svg",
      status: "Public beta",
      accent: "from-violet-500/30 via-fuchsia-500/20 to-sky-500/30"
    },
    {
      id: "compositor-native",
      title: "COMPOSITOR",
      section: "software",
      subtitle: "Native frame-level video editor foundation",
      description:
        "A native-first C++/Qt video-editor foundation built around frame-level control, layered editing, SQLite project/session storage, import queues, timeline navigation, and recovery-safe project handling.",
      tech: ["C++", "Qt", "CMake", "SQLite", "FFmpeg Boundary"],
      points: [
        "Engineered as a real desktop application — frame-level control and layer-first editing, not a disposable web toy.",
        "Includes project/layer/session models, crash-safe SQLite saves, backup recovery, import queues, and timeline controls.",
        "Validated against native CMake/CTest build gates with fail-closed media relinking."
      ],
      live: "#",
      liveLabel: "Desktop app",
      github: "https://github.com/armonon/scenepilot-compositor",
      label: "Native App",
      image: "/photos/context-compositor-example.svg",
      status: "Desktop app · C++",
      accent: "from-sky-500/30 via-indigo-500/20 to-zinc-500/30"
    },
    {
      id: "auto-pitch",
      title: "Auto Pitch",
      section: "software",
      subtitle: "Sattari vocal-tuning plugin direction",
      description:
        "A Sattari audio product direction for vocal tuning with auto key, adaptive song sections, natural/modern/hard modes, and a higher bar than ordinary demo plugins.",
      tech: ["DSP", "Pitch Detection", "Audio UX", "Plugin Roadmap"],
      points: [
        "Vocalist-friendly tuning controls with an Adapt Mode that follows key changes across a song.",
        "Natural, modern, and hard correction modes built on real pitch detection and DSP.",
        "Part of a broader Sattari Audio product line shipping toward AU/VST3/Standalone release."
      ],
      live: "#",
      liveLabel: "Plugin",
      github: "#",
      label: "Audio Plugin",
      image: "/photos/auto-pitch-example.svg",
      status: "In development",
      accent: "from-orange-500/30 via-amber-500/20 to-yellow-500/30"
    },
    {
      id: "now-market",
      title: "NOW + Market",
      section: "software",
      subtitle: "Identity hub and universal marketplace prototype",
      description:
        "A platform-system direction where NOW becomes the profile/identity hub and Market becomes the first service: search listings, connect seller profiles, and prototype marketplace flows safely.",
      tech: ["JavaScript", "Netlify Functions", "Auth Contracts", "Marketplace UX"],
      points: [
        "NOW models profiles, vaults, identity data, permissions, and safe public/private boundaries.",
        "Market prototypes tenant-aware listing surfaces, source readiness, seller cards, saved items, and inquiry flows.",
        "Guardrails keep it clear that scraping, checkout, payment, and external messaging are not live yet."
      ],
      live: "https://now-suite-preview.netlify.app/market/",
      liveLabel: "Live Preview",
      github: "#",
      label: "Platform System",
      image: "/photos/digital-human-example.svg",
      status: "Live preview",
      accent: "from-cyan-500/30 via-blue-500/20 to-purple-500/30"
    },
    {
      id: "digital-human-mvp",
      title: "Digital Human MVP",
      section: "software",
      subtitle: "AI avatar/chat demo with visemes and animation readiness",
      description:
        "A browser avatar/chat experience with real-time GLB rendering, viseme-driven lip sync, and hybrid animation — a working foundation for persistent AI identity, with a path to hosted neural/photo rendering.",
      tech: ["Three.js", "React", "Avatar Systems", "AI Chat"],
      points: [
        "Delivers a working avatar-chat surface with generated replies and viseme-driven animation.",
        "Real-time GLB rendering in the browser with lip sync mapped to response audio.",
        "Built as a foundation for persistent AI identity and richer avatar experiences."
      ],
      live: "#",
      liveLabel: "Live Demo",
      github: "#",
      label: "AI Avatar",
      image: "/photos/digital-human-example.svg",
      video: "/videos/digital-human-demo.mp4",
      status: "Live demo",
      accent: "from-fuchsia-500/30 via-purple-500/20 to-blue-500/30"
    },
    {
      id: "stemdeck",
      title: "Sattari StemDeck",
      section: "software",
      subtitle: "Four-deck stem performance & remix DJ app",
      description:
        "A standalone Mac DJ application for live stem playback and remixing — a djay-inspired four-column mixer with a pattern-arrangement recorder, built on the Sattari JUCE/CMake AU/VST3/Standalone audio pipeline.",
      tech: ["JUCE", "CMake", "Rubber Band", "Real-time Audio", "macOS App"],
      points: [
        "Four-deck live mixer with crossfade, beat/key sync, and pad control for stems and loops.",
        "Rubber Band-backed time-stretch and pitch-shift with a bottom arrangement-recorder workspace.",
        "Part of the Sattari Audio product line alongside Auto Pitch and Entropy."
      ],
      live: "#",
      liveLabel: "Mac app",
      github: "#",
      label: "Audio App",
      image: "/photos/auto-pitch-example.svg",
      status: "Mac app",
      accent: "from-red-500/30 via-orange-500/20 to-zinc-500/30"
    },
    {
      id: 3,
      title: "Botanica Lab",
      section: "software",
      subtitle: "Botanical R&D and formulation-intelligence site",
      description:
        "A living research lab for botanical product concepts, ingredient signals, formula exploration, and safe wellness-product ideation.",
      tech: ["AI Research", "Netlify", "Data Design", "Compliance-Aware UX"],
      points: [
        "Turns botanical research into readable product concepts and research pulses.",
        "Uses a lab-style interface for remedy ideas, ingredient watchlists, and deeper dives.",
        "Evidence-first by design, with source-backed claims and a built-in review layer."
      ],
      live: "https://botanica-lab.netlify.app/",
      liveLabel: "Live Lab",
      github: "https://github.com/armonon/botanica-lab",
      label: "Botanical AI",
      image: "/photos/botanica-example.svg",
      status: "Live app",
      accent: "from-emerald-500/30 via-lime-500/20 to-teal-500/30"
    },
    {
      id: 4,
      title: "Stock Trader Oracle",
      section: "software",
      subtitle: "Market-intelligence dashboard for watchlists and catalysts",
      description:
        "A stock research dashboard that turns a watchlist into market radar, ticker news, scenario-based trade ideas, and risk-aware research briefs.",
      tech: ["Market APIs", "Netlify Functions", "AI Analysis", "Research UX"],
      points: [
        "Tracks company watchlists, catalysts, headlines, and adjacent market themes.",
        "Frames plays as research scenarios with risks and invalidation instead of guarantees.",
        "Includes an analyst-style chat/API layer for faster ticker exploration."
      ],
      live: "https://armon-trader.netlify.app",
      liveLabel: "Live Dashboard",
      github: "#",
      label: "Fintech Research",
      image: "/photos/trader-oracle-example.svg",
      status: "Live beta",
      accent: "from-amber-500/30 via-orange-500/20 to-red-500/30"
    },
    {
      id: 5,
      title: "Librarian",
      section: "software",
      subtitle: "Provenance-first atlas for public-domain books",
      description:
        "A book research platform that combines search, source inspection, public-domain availability, reading paths, and authority links into one trust-first interface.",
      tech: ["Vite", "SQLite", "Open Library", "Wikidata", "Source Provenance"],
      points: [
        "Surfaces readable/free book leads with citations, source links, confidence, and retrieval notes.",
        "Adds exploration paths, source coverage dashboards, and stronger book-discovery flows.",
        "Built for research trust: every important claim should point back to a source."
      ],
      live: "https://librarian-atlas.netlify.app",
      liveLabel: "Live Atlas",
      github: "https://github.com/armonon/librarian",
      label: "Knowledge Tool",
      image: "/photos/librarian-example.svg",
      status: "Live app",
      accent: "from-stone-400/30 via-zinc-500/20 to-blue-500/30"
    },
    {
      id: 7,
      title: "Sattari Music",
      section: "website",
      subtitle: "Brand-forward music and drum business website",
      description:
        "A custom web direction for a music business centered on drum gear, local services, rentals, and brand identity.",
      image: "/photos/sattari-screenshot.png",
      tech: ["React", "Stripe", "E-commerce", "Responsive Design"],
      points: [
        "Organized the site to highlight products while still making room for repair, rental, and local services.",
        "Built with a cleaner custom direction instead of a boxed-in template feel.",
        "Focused on making the homepage feel product-led, visual, and strong for a niche audience."
      ],
      live: "https://sattari.netlify.app",
      liveLabel: "Live Site",
      github: "#",
      label: "Commerce",
      status: "Live site",
      accent: "from-zinc-500/30 via-neutral-500/20 to-white/10"
    },
    {
      id: 8,
      title: "Nasiri Team Realty",
      section: "website",
      subtitle: "Modern real estate platform with live property listings",
      description:
        "A responsive real estate website designed for property listings, agent profiles, and seamless client communication.",
      image: "/photos/nasiri-screenshot.png",
      tech: ["React", "Real Estate CMS", "Property Listings", "Responsive Design"],
      points: [
        "Organized property listings with filtering by price, location, and property type.",
        "Built with a modern design direction that feels professional and trustworthy.",
        "Integrated smooth flows for viewing property details, agent info, and contact options."
      ],
      live: "https://nasiriteam.netlify.app",
      liveLabel: "Live Site",
      github: "#",
      label: "Real Estate",
      status: "Live site",
      accent: "from-blue-500/30 via-slate-500/20 to-zinc-500/30"
    }
  ];

  const hasRealLink = (project: { live?: string; github?: string; video?: string }) =>
    Boolean((project.live && project.live !== "#") || (project.github && project.github !== "#") || project.video);
  const projectsWithLiveLinks = projects.filter((project) => project.live && project.live !== "#");
  const softwareProjectDisplayOrder = new Map([
    ["entropy", 0],
    ["model-studio", 1],
    ["scenepilot-studio", 2],
    ["stemdeck", 3],
    ["now-market", 90],
    ["compositor-native", 95],
  ]);
  const softwareProjects = projects
    .filter((project) => project.section === "software" && hasRealLink(project))
    .sort((a, b) => (softwareProjectDisplayOrder.get(String(a.id)) ?? 50) - (softwareProjectDisplayOrder.get(String(b.id)) ?? 50));
  const websiteProjects = projectsWithLiveLinks.filter((project) => project.section === "website");

  const experienceHighlights = [
    {
      role: "Backend Developer",
      company: "Softech",
      timeframe: "Backend engineering",
      description:
        "Built backend systems, APIs, automation, data flows, and production-facing web infrastructure.",
      bullets: ["API and service development", "Database-backed workflows", "Reliable implementation under client/product constraints"]
    },
    {
      role: "AI Engineering Training",
      company: "Applied AI engineering",
      timeframe: "AI product systems",
      description:
        "Applied AI workflows, agent patterns, automation, and product-minded implementation.",
      bullets: ["AI product prototyping", "LLM workflow design", "Practical automation and integration"]
    }
  ];

  const creationHighlights = [
    {
      title: "AI + creative software",
      image: "/photos/auto-pitch-example.svg",
      text: "Creator-software work across video editing, music tools, timeline automation, and workflow acceleration."
    },
    {
      title: "Research and intelligence tools",
      image: "/photos/trader-oracle-example.svg",
      text: "Dashboards and research systems that turn messy inputs into clearer decisions, citations, and next actions."
    },
    {
      title: "Business websites and commerce",
      image: "/photos/sattari-screenshot.png",
      text: "Public websites with clearer positioning, brand surfaces, lead paths, and responsive interfaces."
    }
  ];

  const skills = [
    "React",
    "TypeScript",
    "JavaScript",
    "Vite",
    "Tailwind",
    "Node.js",
    "Python",
    "SQL",
    "REST APIs",
    "Backend Architecture",
    "Netlify",
    "API Integrations",
    "AI Engineering",
    "AI Product Design",
    "LLM Workflows",
    "Realtime Interfaces",
    "E-commerce",
    "Data Dashboards",
    "Responsive Design",
    "UI/UX",
    "Git"
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const navItems = [
    { label: "Home", id: "hero" },
    { label: "About", id: "about" },
    { label: "Experience", id: "experience" },
    { label: "Software", id: "projects" },
    { label: "Websites", id: "websites" },
    { label: "Skills", id: "skills" },
    { label: "Contact", id: "contact" },
  ];

  const navigateToHash = (hash: string) => {
    window.history.pushState(null, "", hash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  const scrollToSection = (id: string) => {
    if (id === "product-radar") {
      setCurrentPage("product-radar");
      setMobileMenuOpen(false);
      navigateToHash("#/product-radar");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentPage !== "home") {
      navigateToHash("#");
      setCurrentPage("home");
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }

    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  if (currentPage === "product-radar") {
    return <ProductRadarPage onHome={() => scrollToSection("hero")} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: progressScaleX }}
        className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400"
      />

      {/* Background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-0 h-[32rem] w-[32rem] animate-drift-a rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-[-10%] h-[30rem] w-[30rem] animate-drift-b rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-[26rem] w-[26rem] -translate-x-1/2 animate-drift-a rounded-full bg-violet-500/[0.07] blur-3xl" />
      </div>

      {/* Sticky Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent"
            >
              Armon Nasiri
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-7">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "text-white border-b-2 border-white pb-1"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollToSection("product-radar")}
                className="rounded-full border border-white/15 bg-white px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-white/10 transition-colors hover:bg-zinc-100"
              >
                Product Radar
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden pb-4 space-y-2"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => scrollToSection("product-radar")}
                className="mt-2 block w-full rounded-lg bg-white px-4 py-3 text-left text-sm font-semibold text-black transition-colors hover:bg-zinc-100"
              >
                Product Radar
              </button>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <motion.section
          id="hero"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="min-h-[78vh] flex items-center justify-center px-4 py-16 md:py-20"
        >
          <div className="max-w-5xl w-full text-center space-y-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm text-zinc-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Currently building&nbsp;<RotatingWord words={["audio plugins", "AI tools", "dashboards", "creator software", "web products"]} />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              I turn backend logic, AI workflows, and sharp interfaces into{" "}
              <span className="animate-gradient-text bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                live products
              </span>
              .
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            >
              I'm Armon Nasiri — a backend-minded product builder focused on websites, dashboards, automation, AI tools, and creative software that people can actually open and use.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("projects")}
                className="group relative overflow-hidden px-8 py-3 bg-white text-black font-semibold rounded-lg transition-colors"
              >
                <span className="relative z-10 inline-flex items-center gap-2">See live work</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-200 via-violet-200 to-fuchsia-200 transition-transform duration-500 group-hover:translate-x-0" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("contact")}
                className="px-8 py-3 bg-zinc-900 text-white font-semibold rounded-lg border border-zinc-700 hover:border-zinc-500 transition-colors"
              >
                Work with me
              </motion.button>
            </motion.div>

            {/* Animated stats */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-zinc-800/80 pt-8"
            >
              {[
                { to: softwareProjects.length, suffix: "+", label: "live products" },
                { to: websiteProjects.length, suffix: "", label: "client sites" },
                { to: radarLanes.length, suffix: "", label: "product lines" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-4xl">
                    <CountUp to={stat.to} suffix={stat.suffix} />
                  </div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          id="about"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="py-16 px-4"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">About</h2>
              <div className="h-1 w-16 bg-white rounded-full"></div>
              
              <p className="text-lg text-zinc-300 leading-relaxed">
                I build the connective tissue of a product: backend logic, data flows, APIs, UI, automation, and the final web experience.
              </p>

              <p className="text-lg text-zinc-300 leading-relaxed">
                The portfolio is intentionally practical: live sites, working dashboards, AI-assisted workflows, and product surfaces that show how the pieces connect.
              </p>

              <p className="text-lg text-zinc-300 leading-relaxed">
                The common thread: make the idea clear, make the interface feel strong, and make the product useful fast.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Experience + Creation Summary Section */}
        <motion.section
          id="experience"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="py-16 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold">Background & Product Work</h2>
              <div className="h-1 w-16 bg-white rounded-full mt-4"></div>
              <p className="mt-5 max-w-3xl text-zinc-400">
                A tighter look at the work: backend foundations, applied AI, public websites, dashboards, automation, and creative tools — with live links kept front and center.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="grid grid-cols-1 gap-5 lg:grid-cols-2"
            >
              {experienceHighlights.map((item) => (
                <motion.article
                  key={`${item.role}-${item.company}`}
                  variants={fadeUp}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900/55 p-6 backdrop-blur md:p-8"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">{item.company}</div>
                      <h3 className="mt-2 text-2xl font-bold text-white">{item.role}</h3>
                    </div>
                    <span className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300">
                      {item.timeframe}
                    </span>
                  </div>
                  <p className="mt-5 leading-relaxed text-zinc-300">{item.description}</p>
                  <ul className="mt-5 space-y-2">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-sm text-zinc-400">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3"
            >
              {creationHighlights.map((item) => (
                <motion.article
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ y: -5 }}
                  className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur transition-all hover:border-zinc-700"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                    <div className="absolute inset-0 bg-black/30" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300">{item.text}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Software Section */}
        <motion.section
          id="projects"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="py-16 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold">Software</h2>
              <div className="h-1 w-16 bg-white rounded-full mt-4"></div>
              <p className="mt-5 max-w-3xl text-zinc-400">
                Live software, dashboards, AI workflows, and creator tools — kept focused so the strongest work is easy to scan.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="space-y-8"
            >
              {softwareProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  whileHover={{ y: -5 }}
                  className="group bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_10px_50px_-12px_rgba(139,92,246,0.45)]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Image / Visual */}
                    <div className={`relative h-64 md:h-full min-h-80 overflow-hidden bg-gradient-to-br ${project.accent}`}>
                      {(project as { video?: string }).video ? (
                        <video
                          src={(project as { video?: string }).video}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      ) : project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center p-8">
                          <div className="text-center">
                            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-3xl font-black text-white shadow-2xl shadow-black/30">
                              {project.title.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="text-2xl font-bold text-white">{project.title}</div>
                            <div className="mt-2 text-sm text-zinc-200">{project.status}</div>
                          </div>
                        </div>
                      )}
                      <div className={`pointer-events-none absolute inset-0 transition-colors ${(project as { video?: string }).video ? "bg-black/10" : "bg-black/40 group-hover:bg-black/20"}`} />
                      <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {project.status}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        <span className="inline-block text-xs font-semibold text-zinc-400 mb-3 px-3 py-1 bg-zinc-800 rounded-full">
                          {project.label}
                        </span>
                        <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                        <p className="text-sm text-zinc-400 mb-4">{project.subtitle}</p>
                        <p className="text-zinc-300 mb-6 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tech.slice(0, 4).map((tech, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-medium text-zinc-300 bg-zinc-800/50 px-3 py-1 rounded-lg"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Points */}
                        <ul className="space-y-2 mb-6">
                          {project.points.slice(0, 2).map((point, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-zinc-400 flex gap-2"
                            >
                              <span className="text-white font-bold">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-3">
                        {project.live !== "#" && (
                          <motion.a
                            href={project.live}
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-zinc-100 transition-colors text-sm"
                          >
                            {project.liveLabel ?? "Live Demo"} <ExternalLink size={16} />
                          </motion.a>
                        )}
                        {project.github !== "#" && (
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition-colors text-sm"
                          >
                            Code <Code2 size={16} />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Websites Section */}
        <motion.section
          id="websites"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="py-16 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold">Websites</h2>
              <div className="h-1 w-16 bg-white rounded-full mt-4"></div>
              <p className="mt-5 max-w-3xl text-zinc-400">
                Public business websites and brand surfaces, separate from the software products.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="space-y-8"
            >
              {websiteProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  whileHover={{ y: -5 }}
                  className="group bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_10px_50px_-12px_rgba(139,92,246,0.45)]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className={`relative h-64 md:h-full min-h-80 overflow-hidden bg-gradient-to-br ${project.accent}`}>
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center p-8">
                          <div className="text-center">
                            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-3xl font-black text-white shadow-2xl shadow-black/30">
                              {project.title.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="text-2xl font-bold text-white">{project.title}</div>
                            <div className="mt-2 text-sm text-zinc-200">{project.status}</div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {project.status}
                      </div>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        <span className="inline-block text-xs font-semibold text-zinc-400 mb-3 px-3 py-1 bg-zinc-800 rounded-full">
                          {project.label}
                        </span>
                        <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                        <p className="text-sm text-zinc-400 mb-4">{project.subtitle}</p>
                        <p className="text-zinc-300 mb-6 leading-relaxed">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tech.slice(0, 4).map((tech, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-medium text-zinc-300 bg-zinc-800/50 px-3 py-1 rounded-lg"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <ul className="space-y-2 mb-6">
                          {project.points.slice(0, 2).map((point, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-zinc-400 flex gap-2"
                            >
                              <span className="text-white font-bold">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {project.live !== "#" && (
                          <motion.a
                            href={project.live}
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-zinc-100 transition-colors text-sm"
                          >
                            {project.liveLabel ?? "Live Site"} <ExternalLink size={16} />
                          </motion.a>
                        )}
                        {project.github !== "#" && (
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition-colors text-sm"
                          >
                            Code <Code2 size={16} />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          id="skills"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="py-16 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold">Skills & Tech</h2>
              <div className="h-1 w-16 bg-white rounded-full mt-4"></div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="marquee-mask marquee-pause overflow-hidden"
            >
              <div className="flex w-max animate-marquee gap-3 pr-3">
                {[...skills, ...skills].map((skill, idx) => (
                  <span
                    key={idx}
                    aria-hidden={idx >= skills.length}
                    className="shrink-0 whitespace-nowrap rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="py-16 px-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold">Build something useful</h2>
              <div className="h-1 w-16 bg-white rounded-full mx-auto"></div>
              
              <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
                Open to product builds, websites, dashboards, AI automation, and creative technical work.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <motion.a
                  href="mailto:armonnasiri@gmail.com"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  <Mail size={20} />
                  Email Armon
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
            <div>
              <div className="text-lg font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent mb-1">
                Armon Nasiri
              </div>
              <p className="text-sm text-zinc-500">Backend-minded product builder</p>
            </div>
            <p className="text-sm text-zinc-500">
              © 2026 Armon Nasiri. React, Tailwind, Framer Motion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
