import { AnimatePresence, animate, motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, X, ExternalLink, Code2, Mail, Sparkles, Download, RefreshCw, ArrowUpRight, ArrowDown } from "lucide-react";
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
const websiteProjects = projects.filter((p) => p.section === "website" && hasLink(p.live));

const STUDIO_URL = "https://thecreatingco.com";

const studioApps = [
  { name: "Ghost Studio", kind: "Design", line: "Explore a garment from every side.", href: "https://ghost.thecreatingco.com/" },
  { name: "Librarian", kind: "Read & organize", line: "Gather your PDFs and stay with an idea.", href: "https://librarian.thecreatingco.com/" },
  { name: "Bounce", kind: "Sound", line: "A listening queue with EQ, in the browser.", href: "https://bounce.thecreatingco.com/browser/" },
  { name: "Sattari Audio", kind: "Native audio", line: "The plugin suite: Entropy, Auto Pitch & more.", href: "https://sattari-audio-suite.netlify.app/" }
];

const capabilities = [
  { kicker: "Native / systems", title: "Real-time & native apps", body: "C++ and Rust across audio DSP, GPU renderers, and desktop apps — VST3/AU plugins, a wgpu image editor, and macOS/iOS builds." },
  { kicker: "Applied AI", title: "AI that runs locally", body: "On-device inference with ONNX Runtime, screen-aware agents, LLM workflows, and pipelines that keep user data on the machine." },
  { kicker: "Product web", title: "Platforms & interfaces", body: "React and TypeScript front-ends, directory and commerce platforms, research dashboards, and the APIs behind them." },
  { kicker: "Backend", title: "Services & data", body: "APIs, database-backed workflows, automation, and production infrastructure built to hold up under real client constraints." }
];

const experience = [
  { role: "Founder", org: "thecreateco", href: STUDIO_URL, body: "Building an independent creative software studio: the Momentium Suite (Form, Luma, StemDeck, ScenePilot) and its companion apps, with free Lite editions and Pro desktop builds in development.", tags: ["Product", "Engineering", "Design", "Launch"] },
  { role: "Backend Developer", org: "Softech", body: "Built backend systems, APIs, automation, data flows, and production-facing web infrastructure.", tags: ["APIs & services", "Database workflows", "Client constraints"] },
  { role: "AI Engineering", org: "Applied AI training", body: "Applied AI workflows, agent patterns, automation, and product-minded implementation.", tags: ["AI prototyping", "LLM workflows", "Automation"] }
];

const skills = [
  "C++", "Rust", "TypeScript", "Python", "JUCE", "wgpu", "ONNX Runtime", "OpenCASCADE", "WebGL", "Web Audio", "React", "Node.js", "SQL", "REST APIs", "LLM Workflows", "Real-time DSP", "Netlify", "UI / UX"
];

const navItems = [
  { label: "Studio", id: "studio" },
  { label: "Work", id: "work" },
  { label: "About", id: "about" },
  { label: "Index", id: "index" },
  { label: "Contact", id: "contact" }
];

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
            <a
              href={STUDIO_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-bg transition-opacity hover:opacity-85 sm:inline-flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              thecreateco
              <ArrowUpRight size={14} />
            </a>
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
              <a href={STUDIO_URL} target="_blank" rel="noreferrer" className="mt-1 flex items-center justify-between rounded-2xl bg-ink px-4 py-3 text-[17px] text-bg">
                thecreateco <ArrowUpRight size={18} />
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
        <section id="hero" className="px-5 sm:px-8">
          <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 pb-16 pt-16 md:pt-24 lg:grid-cols-[1.45fr_0.75fr] lg:items-end lg:gap-16 lg:pb-24">
            <div>
              <motion.a
                href={STUDIO_URL}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-4 text-[13px] text-muted transition-colors hover:border-ink/30"
              >
                <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-[#111110]">New</span>
                <span className="whitespace-nowrap">Founder of <span className="font-medium text-ink">thecreateco</span></span><span className="hidden sm:inline">— Kickstarter coming</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </motion.a>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
                className="mt-10 text-[clamp(3.1rem,9.2vw,8.4rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-ink"
              >
                I build the tools
                <br />
                I want to <span className="font-serif font-normal italic tracking-[-0.02em] text-accent-ink">create</span> with.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
                className="mt-9 max-w-[38rem] text-[19px] leading-relaxed text-muted"
              >
                I&rsquo;m Armon — a software developer and AI engineer in Los Angeles. I ship creative software end to
                end: native audio plugins, GPU image editors, CAD, film tools and local AI. Now I&rsquo;m building them
                for everyone at <a href={STUDIO_URL} target="_blank" rel="noreferrer" className="text-ink underline decoration-accent decoration-[3px] underline-offset-4">thecreateco</a>.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                <button
                  onClick={() => scrollToSection("work")}
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-bg transition-opacity hover:opacity-85"
                >
                  See the work
                  <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
                </button>
                <a
                  href="mailto:armonnasiri@gmail.com"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-[15px] font-medium text-ink transition-colors hover:border-ink"
                >
                  Get in touch
                </a>
              </motion.div>
            </div>

            <motion.figure
              initial={{ opacity: 0, scale: 0.96, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 1.5 }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
              className="relative mx-auto w-full max-w-[22rem] lg:mx-0 lg:max-w-none"
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
          </div>

          {/* stat strip */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mx-auto grid max-w-[1320px] grid-cols-2 gap-px border-y border-line bg-line md:grid-cols-4"
          >
            {[
              { k: "Projects shipped", v: <><CountUp to={radarDirectory.length} />+</> },
              { k: "Live right now", v: <CountUp to={liveCount} /> },
              { k: "Core stack", v: "C++ · Rust · TS" },
              { k: "Platforms", v: "Web · macOS · iOS" }
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

        {/* ── STUDIO / THECREATECO ─────────────────────────── */}
        <section id="studio" className="px-3 py-10 sm:px-6 md:py-16">
          <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[32px] bg-band text-band-fg">
            <div className="grid grid-cols-1 gap-12 px-6 pb-12 pt-12 sm:px-10 md:pt-16 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14 lg:px-14 lg:pb-16">
              <div className="flex flex-col">
                <Kicker className="text-band-muted">
                  <span className="text-accent">01</span>
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

            {/* More from the studio */}
            <div className="border-t border-band-line px-6 py-10 sm:px-10 lg:px-14">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <Kicker className="shrink-0 text-band-muted lg:w-40">More from the studio</Kicker>
                <div className="flex flex-wrap gap-2">
                  {studioApps.map((app) => (
                    <a
                      key={app.name}
                      href={app.href}
                      target="_blank"
                      rel="noreferrer"
                      title={app.line}
                      className="group inline-flex items-center gap-2 rounded-full border border-band-line px-4 py-2 text-[14px] transition-colors hover:border-band-fg/50"
                    >
                      <span className="font-medium">{app.name}</span>
                      <span className="text-band-muted">· {app.kind}</span>
                      <ArrowUpRight size={13} className="text-band-muted transition-colors group-hover:text-band-fg" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SELECTED WORK ────────────────────────────────── */}
        <section id="work" className="px-5 py-20 sm:px-8 md:py-28">
          <div className="mx-auto max-w-[1320px]">
            <SectionHead
              n="02"
              kicker="Selected work"
              title={<>Shipped, running, <span className="font-serif font-normal italic">not</span> concepts.</>}
              aside={<>{softwareProjects.length} products across audio, image, CAD, film and AI. Tap any card for the full breakdown.</>}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
              {softwareProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} span={spanFor(i, softwareProjects.length)} onOpen={() => setOpenProject(project)} />
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

        {/* ── ABOUT ────────────────────────────────────────── */}
        <section id="about" className="border-t border-line px-5 py-20 sm:px-8 md:py-28">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
              <div>
                <Kicker>
                  <span className="text-accent-ink">03</span>
                  <span className="mx-2 text-line">/</span>
                  About
                </Kicker>
                <p className="mt-6 text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
                  I build the whole product — the <span className="font-serif font-normal italic">engine</span> underneath and the <span className="font-serif font-normal italic">interface</span> on top.
                </p>
                <div className="mt-8 max-w-[34rem] space-y-5 text-[16px] leading-relaxed text-muted">
                  <p>
                    Backend services, data flows, real-time DSP, GPU renderers and on-device AI pipelines — plus the
                    interface people actually touch. The work runs from C++ plugins loaded inside professional DAWs to a
                    Rust image editor with local inference to client web platforms.
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
              n="04"
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
              <span className="text-accent-ink">05</span>
              <span className="mx-2 text-line">/</span>
              Contact
            </Kicker>
            <p className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-ink">
              Let&rsquo;s make
              <br />
              <span className="font-serif font-normal italic text-accent-ink">something.</span>
            </p>
            <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-xl text-[17px] leading-relaxed text-muted">
                Open to software and AI engineering work — product builds, creative and audio tools, AI systems and
                automation, and client platforms. For thecreateco, the launch list is the best way to follow along.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:armonnasiri@gmail.com" className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-4 text-[15px] font-medium text-bg transition-opacity hover:opacity-85">
                  <Mail size={16} /> armonnasiri@gmail.com
                </a>
                <a href="https://github.com/armonon" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 rounded-full border border-line px-7 py-4 text-[15px] font-medium text-ink transition-colors hover:border-ink">
                  <Code2 size={16} /> GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-4 text-[13px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>
            <span className="text-ink">Armon Nasiri</span> — Software developer, AI engineer &amp; founder of{" "}
            <a href={STUDIO_URL} target="_blank" rel="noreferrer" className="text-ink hover:underline">thecreateco</a>
          </span>
          <div className="flex flex-wrap gap-5">
            <a href={STUDIO_URL} target="_blank" rel="noreferrer" className="hover:text-ink">thecreatingco.com</a>
            <a href="#/product-radar" className="hover:text-ink">Product Radar</a>
            <a href="https://github.com/armonon" target="_blank" rel="noreferrer" className="hover:text-ink">GitHub</a>
            <span>© 2026</span>
          </div>
        </div>
      </footer>

      <AnimatePresence>{openProject && <ProjectModal project={openProject} onClose={closeProject} />}</AnimatePresence>
    </div>
  );
}

export default App;
