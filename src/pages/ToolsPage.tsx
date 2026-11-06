import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight, Check, Search, Upload, ShieldCheck } from "lucide-react";
import { toolbox, type Tool } from "../showcase";
import { SectionHead, DeviceVideo } from "../ui";
import { EASE, hueFor } from "../lib";

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
      className={`group flex h-full flex-col overflow-hidden rounded-[22px] border transition-[transform,box-shadow,border-color,background-color] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.4)] ${highlight ? "border-ink bg-accent/15" : "border-line bg-surface hover:border-ink/30"}`}
    >
      {tool.video && (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-[#0d0d0c]">
          <DeviceVideo src={tool.video} poster={tool.poster} className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur">Recorded live</span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
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
      <h2 className="mt-4 text-[19px] font-semibold tracking-[-0.02em] text-ink">{tool.name}</h2>
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
      </div>
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
    <section id="tools" className="px-3 pb-10 pt-6 sm:px-6 md:pb-16">
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
          as="h1"
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
              style={{ outline: "none", boxShadow: "none" }}
                className="w-full bg-transparent text-[16px] text-ink placeholder:text-faint focus:outline-none focus-visible:outline-none"
            />
          </label>
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center gap-2.5 rounded-full border border-dashed border-ink/30 px-5 py-3.5 text-[15px] text-muted transition-colors hover:border-ink hover:text-ink"
          >
            <Upload size={17} />
            <span className="font-medium text-ink sm:hidden">Choose a file</span>
            <span className="hidden sm:inline">Drop a file anywhere here, or</span> <span className="hidden font-medium text-ink sm:inline">choose one</span>
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
                <button key={sug} onClick={() => setQuery(sug)} className={`rounded-full border px-3.5 py-2 text-[13px] transition-colors sm:px-3 sm:py-1 ${q === sug ? "border-ink bg-ink text-bg" : "border-line text-muted hover:border-ink/40 hover:text-ink"}`}>
                  {sug}
                </button>
              ))}
            </>
          )}
        </div>

        <motion.div layout className="rail mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

export default function ToolsPage() {
  return (
    <>
      <div className="mx-auto max-w-[1360px] px-5 pt-10 sm:px-8 md:pt-14">
        <a href="/" className="-my-2 inline-flex items-center gap-1.5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink">← Home</a>
      </div>
      <ToolboxSection />
    </>
  );
}
