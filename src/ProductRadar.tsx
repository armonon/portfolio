import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Code2, Sparkles, Download, RefreshCw } from "lucide-react";
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

export default ProductRadarPage;
