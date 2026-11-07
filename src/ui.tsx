import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { X, Code2, ArrowUpRight, Play } from "lucide-react";
import { STATUS, entry, type Status } from "./registry";
import { EASE, posterFor, useFocusTrap } from "./lib";
import { type CaseStudy } from "./cases";
import { hasLink, STUDIO_URL, type Project } from "./data/projects";



/** Small play button shown over a video when the visitor prefers reduced motion (no autoplay). */
function PlayOverlay({ onPlay, playing }: { onPlay: () => void; playing: boolean }) {
  if (playing) return null;
  return (
    <button onClick={onPlay} aria-label="Play video" className="absolute inset-0 grid place-items-center bg-black/10 transition-colors hover:bg-black/20">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-black/65 text-white backdrop-blur"><Play size={20} /></span>
    </button>
  );
}

/**
 * Muted looping clip that only downloads once it is near the viewport, pauses when it leaves,
 * always shows a poster frame first (never an empty black box), and does not autoplay
 * for visitors who prefer reduced motion.
 */
export function LazyVideo({ src, poster, className, label, eagerPoster = false }: { src: string; poster?: string; className?: string; label?: string; eagerPoster?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { once: false, margin: "120px" });
  // The poster frame loads once the clip is within ~a screen of the viewport (always, for above-the-fold clips)
  const near = useInView(ref, { once: true, margin: "900px" });
  const reduce = useReducedMotion();
  const [userPlay, setUserPlay] = useState(false);
  const allowed = !reduce || userPlay;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // must be set as DOM properties — React's muted/playsInline props are unreliable on mobile
    el.muted = true;
    el.playsInline = true;
    el.loop = true;
    if (!isInView || !allowed) {
      el.pause();
      return;
    }
    if (!el.getAttribute("src")) {
      el.src = src;
      el.load();
    }
    // play() rejects if called before the media is ready, so retry once it can actually play
    const tryPlay = () => {
      el.play().catch(() => {});
    };
    tryPlay();
    el.addEventListener("canplay", tryPlay);
    return () => el.removeEventListener("canplay", tryPlay);
  }, [isInView, src, allowed]);
  return (
    <span className="relative block h-full w-full">
      <video ref={ref} poster={eagerPoster || near ? poster ?? posterFor(src) : undefined} preload="none" aria-label={label} className={`bg-[#1a1714] ${className ?? ""}`} />
      {reduce && <PlayOverlay playing={userPlay} onPlay={() => setUserPlay(true)} />}
    </span>
  );
}


export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`font-mono text-[11px] uppercase tracking-[0.18em] ${className || "text-faint"}`}>{children}</div>;
}

export function SectionHead({ n, kicker, title, aside, as: Tag = "h2" }: { n?: string; kicker: string; title: ReactNode; aside?: ReactNode; as?: "h1" | "h2" }) {
  return (
    <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between md:pb-14">
      <div>
        <Kicker>
          {n && (
            <>
              <span className="text-accent-ink">{n}</span>
              <span className="mx-2 text-line">/</span>
            </>
          )}
          {kicker}
        </Kicker>
        <Tag className="mt-5 max-w-[18ch] text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink">{title}</Tag>
      </div>
      {aside && <div className="max-w-sm text-[15px] leading-relaxed text-muted">{aside}</div>}
    </div>
  );
}

export function ProjectMedia({ project, className = "" }: { project: Project; className?: string }) {
  return project.video ? (
    <LazyVideo src={project.video} className={`h-full w-full object-cover ${className}`} />
  ) : (
    <img src={project.image} alt="" loading="lazy" className={`h-full w-full object-cover ${className}`} />
  );
}

export function StudioBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-[#111110]">
      thecreateco
    </span>
  );
}

export function ProjectCard({ project, index, span, onOpen }: { project: Project; index: number; span: string; onOpen: () => void }) {
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
          <StatusBadge id={String(project.id)} tone="dark" />
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

export function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, true, onClose);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
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
            <StatusBadge id={String(project.id)} />
            {project.studio && <StudioBadge />}
          </div>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">{project.title}</h2>
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

// Full-screen image viewer: Esc / backdrop closes, arrow keys step through.
export function Lightbox({ items, index, onClose, onStep }: { items: { src: string; title: string; note?: string }[]; index: number | null; onClose: () => void; onStep: (dir: 1 | -1) => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  useFocusTrap(boxRef, index !== null, onClose);
  useEffect(() => {
    if (index === null) return;
    setTimeout(() => boxRef.current?.querySelector<HTMLElement>("button")?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, onClose, onStep]);
  const item = index !== null ? items[index] : null;
  return (
    <AnimatePresence>
      {item && (
        <motion.div ref={boxRef} className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-label={item.title}>
          <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
            <X size={20} />
          </button>
          <motion.img key={item.src} src={item.src} alt={item.title} initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, ease: EASE }} onClick={(e) => e.stopPropagation()} className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl" />
          <div className="mt-4 max-w-xl text-center text-white" onClick={(e) => e.stopPropagation()}>
            <div className="text-[17px] font-semibold">{item.title}</div>
            {item.note && <p className="mt-1 text-[14px] leading-relaxed text-white/70">{item.note}</p>}
          </div>
          {items.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); onStep(-1); }} aria-label="Previous" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20">‹</button>
              <button onClick={(e) => { e.stopPropagation(); onStep(1); }} aria-label="Next" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20">›</button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}


// Plays when on screen, pauses when off; muted loop, for device mockups.
export function DeviceVideo({ src, poster, className = "", label }: { src: string; poster?: string; className?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const near = useInView(ref, { margin: "900px" });
  const reduce = useReducedMotion();
  const [userPlay, setUserPlay] = useState(false);
  const [armed, setArmed] = useState(false);
  const [posterOn, setPosterOn] = useState(false);
  if (inView && !armed && (!reduce || userPlay)) setArmed(true);
  if (near && !posterOn) setPosterOn(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || !armed) return;
    el.muted = true;
    el.playsInline = true;
    if (inView) el.play().catch(() => {});
    else el.pause();
  }, [inView, src, armed]);
  return (
    <span className="relative block h-full w-full">
      <video ref={ref} key={src} src={armed ? src : undefined} poster={posterOn ? poster ?? posterFor(src) : undefined} muted loop playsInline preload="none" aria-label={label} className={`bg-[#1a1714] ${className}`} />
      {reduce && <PlayOverlay playing={userPlay} onPlay={() => setUserPlay(true)} />}
    </span>
  );
}

/** Status pill driven by the project registry (single source of truth). */
export function StatusBadge({ id, status, tone = "light", className = "" }: { id?: string; status?: Status; tone?: "light" | "dark" | "band"; className?: string }) {
  const s = status ?? (id ? entry(id)?.status : undefined);
  if (!s) return null;
  const st = STATUS[s];
  const look = tone === "dark" ? "bg-black/60 text-white backdrop-blur-md" : tone === "band" ? "border border-band-line text-band-fg/85" : "border border-line bg-surface text-ink/80";
  return (
    <span title={st.description} className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] ${look} ${className}`}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: st.dot }} />
      {st.short}
    </span>
  );
}

export function LaptopFrame({ children, url }: { children: ReactNode; url?: string }) {
  return (
    <div className="relative">
      <div className="rounded-[18px] border border-[#2a2826] bg-[#121110] p-2 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.6)] sm:rounded-[22px] sm:p-2.5">
        <div className="flex items-center gap-2 px-2 pb-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          {url && <span aria-hidden className="ml-2 truncate rounded-full bg-white/[0.06] px-3 py-0.5 font-mono text-[10px] text-white/50">{url}</span>}
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-black">{children}</div>
      </div>
      <div className="mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-[14px] bg-gradient-to-b from-[#2b2927] to-[#141312]" />
    </div>
  );
}

export function PhoneFrame({ children, className = "", url }: { children: ReactNode; className?: string; url?: string }) {
  return (
    <div className={`phone-ui relative rounded-[2.6rem] border border-[#2a2826] bg-[#0e0d0c] p-[9px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.65)] ${className}`}>
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
          <div aria-hidden className="flex h-[15.8%] shrink-0 flex-col items-center justify-start gap-[10%] bg-[#1c1c1e] px-[6%] pt-[2.5%]">
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

// Bento rhythm on a 6-col grid: wide/narrow, narrow/wide, half/half. A lone last card goes full width.


export function CaseCard({ c }: { c: CaseStudy }) {
  return (
    <a href={`/work/${c.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-surface transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.4)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d0c]">
        <img src={c.hero.image} alt="" loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur">{c.steps.length} steps{c.footage.length ? ` · ${c.footage.length} clips` : ""}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Kicker className="text-accent-ink">{c.kind}</Kicker>
        <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">{c.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[14px] leading-snug text-muted">{c.summary}</p>
        <span className="mt-auto pt-4 text-[13.5px] font-medium text-ink">See the walkthrough →</span>
      </div>
    </a>
  );
}
