import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import type { SiteShowcase } from "./showcase";
import { Kicker } from "./ui";
import { EASE } from "./lib";

// Room-by-room walkthrough of an explorable website (used on the homepage and /work).
const siteSlug: Record<string, string> = { eden: "breakthyrule-eden", synthesis: "synthesis" };

export default function SiteWalkthrough({ site, index }: { site: SiteShowcase; index: number }) {
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
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={site.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-bg transition-opacity hover:opacity-85">
            Walk through it live <ArrowUpRight size={15} />
          </a>
          {siteSlug[site.id] && (
            <a href={`/work/${siteSlug[site.id]}`} className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-[14px] font-medium text-ink transition-colors hover:border-ink">
              Case study
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
