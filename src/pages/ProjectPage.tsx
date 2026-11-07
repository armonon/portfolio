import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { caseBySlug, caseStudies, type Step } from "../cases";
import { Kicker, DeviceVideo, LaptopFrame, PhoneFrame, StatusBadge } from "../ui";
import { EASE } from "../lib";
import { caseDetails, type CaseDetail } from "../caseDetails";
import { entry } from "../registry";
import SattariShowcase from "./SattariShowcase";

function StepWalkthrough({ steps, url }: { steps: Step[]; url?: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const MS = 4500;
  useEffect(() => {
    if (paused || !inView || steps.length < 2) return;
    const id = window.setTimeout(() => setI((n) => (n + 1) % steps.length), MS);
    return () => window.clearTimeout(id);
  }, [i, paused, inView, steps.length]);
  const step = steps[i];
  const isPhone = /-m-\d|iphone|sat-mobile/.test(step.image);
  return (
    <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
      <div className="relative">
        <div className="overflow-hidden rounded-[20px] border border-line bg-[#0d0d0c] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
            {url && <span className="ml-2 truncate font-mono text-[10.5px] text-white/50">{url.replace("https://", "")}</span>}
            <span className="ml-auto font-mono text-[10.5px] text-white/50">{String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
          </div>
          <div className="relative aspect-[16/10]">
            <AnimatePresence initial={false}>
              <motion.div key={step.image} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }} className="absolute inset-0">
                {isPhone ? (
                  <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_40%,#2a2622,#0d0d0c)] py-4">
                    <img src={step.image} alt={step.label} className="h-full rounded-[18px] border border-white/10 object-contain shadow-2xl" />
                  </div>
                ) : (
                  <img src={step.image} alt={step.label} className="h-full w-full object-cover object-top" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <ol className="self-center border-t border-line">
        {steps.map((s, n) => (
          <li key={s.image + n} className="border-b border-line">
            <button onClick={() => setI(n)} className="relative w-full overflow-hidden py-4 text-left">
              {n === i && !paused && inView && steps.length > 1 && (
                <motion.span key={`bar-${i}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: MS / 1000, ease: "linear" }} className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent-ink" />
              )}
              <div className="flex items-baseline gap-3">
                <span className={`font-mono text-[11px] ${n === i ? "text-accent-ink" : "text-faint"}`}>{String(n + 1).padStart(2, "0")}</span>
                <span className={`text-[16px] font-semibold tracking-[-0.01em] ${n === i ? "text-ink" : "text-muted"}`}>{s.label}</span>
              </div>
              <AnimatePresence initial={false}>
                {n === i && s.caption && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-7 pt-1.5 text-[14px] leading-relaxed text-muted">
                    {s.caption}
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ProjectPage({ slug, onInquire }: { slug: string; onInquire: () => void }) {
  const c = caseBySlug(slug);
  if (!c) {
    return (
      <section className="px-5 py-32 text-center sm:px-8">
        <h1 className="text-4xl font-semibold text-ink">Project not found</h1>
        <a href="/work" className="mt-6 inline-block text-ink underline decoration-accent decoration-2 underline-offset-4">See all work</a>
      </section>
    );
  }
  const d: CaseDetail | undefined = caseDetails[c.slug];
  const reg = entry(c.slug) ?? entry(c.title);
  const source = d?.source ?? (reg?.source ? { href: reg.source, label: "Source on GitHub" } : undefined);
  const idx = caseStudies.indexOf(c);
  const next = caseStudies[(idx + 1) % caseStudies.length];
  return (
    <>
      <section className="px-5 pb-10 pt-12 sm:px-8 md:pt-16">
        <div className="mx-auto max-w-[1320px]">
          <a href="/work" className="-my-2 inline-flex items-center gap-1.5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink">← All work</a>
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Kicker className="text-accent-ink">{c.kind}</Kicker>
                <StatusBadge id={reg?.id ?? c.slug} />
              </div>
              <h1 className="mt-4 text-[clamp(2.8rem,7vw,6rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-ink">{c.title}</h1>
            </div>
            <div>
              <p className="text-[16.5px] leading-relaxed text-muted">{c.summary}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {c.url && (
                  <a href={c.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14.5px] font-medium text-bg transition-opacity hover:opacity-85">
                    {c.urlLabel ?? "Open it live"} <ArrowUpRight size={15} />
                  </a>
                )}
                {source && (
                  <a href={source.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-[14.5px] font-medium text-ink transition-colors hover:border-ink">
                    Source code <ArrowUpRight size={15} />
                  </a>
                )}
                <button onClick={onInquire} className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-[14.5px] font-medium text-ink transition-colors hover:border-ink">
                  Build something like this
                </button>
              </div>
              {d?.sourceNote && <p className="mt-4 text-[13.5px] text-muted">{d.sourceNote}</p>}
            </div>
          </div>

          <div className="relative mt-12">
            <div className={c.hero.phoneVideo || c.hero.phoneImage ? "lg:pr-[17%]" : ""}>
              <LaptopFrame url={c.url?.replace("https://", "")}>
                {c.hero.video ? (
                  <DeviceVideo src={c.hero.video} poster={c.hero.image} label={`${c.title}, recorded live`} className="h-full w-full object-cover object-top" />
                ) : (
                  <img src={c.hero.image} alt={c.title} className="h-full w-full object-cover object-top" />
                )}
              </LaptopFrame>
            </div>
            {(c.hero.phoneVideo || c.hero.phoneImage) && (
              <div className="absolute -bottom-8 right-0 hidden w-[30%] max-w-[240px] sm:block">
                <PhoneFrame url={c.url?.replace("https://", "").replace(/\/$/, "")}>
                  {c.hero.phoneVideo ? (
                    <DeviceVideo src={c.hero.phoneVideo} poster={c.hero.phoneImage} className="h-full w-full object-cover object-top" />
                  ) : (
                    <img src={c.hero.phoneImage} alt="" className="h-full w-full object-cover object-top" />
                  )}
                </PhoneFrame>
              </div>
            )}
          </div>
        </div>
      </section>

      {d && <Overview d={d} />}

      <section className="border-t border-line px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-[1320px]">
          <Kicker className="text-accent-ink">Walkthrough · {c.steps.length} steps</Kicker>
          <h2 className="mb-10 mt-3 text-[clamp(1.9rem,3.5vw,2.8rem)] font-semibold tracking-[-0.035em] text-ink">Step by step.</h2>
          <StepWalkthrough steps={c.steps} url={c.url} />
        </div>
      </section>

      {d && <HowItWasBuilt d={d} />}

      {c.footage.length > 0 && (
        <section className="border-t border-line px-5 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-[1320px]">
            <Kicker className="text-accent-ink">Footage · recorded live</Kicker>
            <h2 className="mb-10 mt-3 text-[clamp(1.9rem,3.5vw,2.8rem)] font-semibold tracking-[-0.035em] text-ink">See it running.</h2>
            <div className={`grid grid-cols-1 items-end gap-8 ${c.footage.length > 1 ? "md:grid-cols-2" : ""}`}>
              {c.footage.map((f) => (
                <figure key={f.video + f.label} className={f.phone ? "mx-auto w-[60%] max-w-[260px]" : c.footage.length === 1 ? "mx-auto w-full max-w-4xl" : ""}>
                  {f.phone ? (
                    <PhoneFrame url={c.url?.replace("https://", "").replace(/\/$/, "")}>
                      <DeviceVideo src={f.video} poster={f.poster} className="h-full w-full object-cover object-top" />
                    </PhoneFrame>
                  ) : (
                    <div className="overflow-hidden rounded-[18px] border border-line bg-[#0d0d0c]">
                      <DeviceVideo src={f.video} poster={f.poster} className="aspect-[16/10] w-full object-cover object-top" />
                    </div>
                  )}
                  <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{f.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {c.slug === "sattari" && <SattariShowcase onInquire={onInquire} />}

      {d && <Outcomes d={d} />}

      <section className="border-t border-line px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <Kicker className="text-accent-ink">Features</Kicker>
            <ul className="mt-5 space-y-3">
              {c.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[15.5px] text-ink/90">
                  <Check size={16} className="mt-0.5 shrink-0 text-accent-ink" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Kicker className="text-accent-ink">{d ? "Technology" : "What I built"}</Kicker>
            <div className="mt-5 flex flex-wrap gap-2">
              {(d?.tech ?? c.built).map((b) => (
                <span key={b} className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[12px] text-ink/80">
                  {b}
                </span>
              ))}
            </div>
            {c.platforms && <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{c.platforms}</p>}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-[22px] border border-line bg-surface p-7">
            <Kicker className="text-accent-ink">Have a project like this?</Kicker>
            <p className="mt-3 text-[16px] leading-relaxed text-ink">Tell me what you are building and when it needs to launch.</p>
            <button onClick={onInquire} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14.5px] font-medium text-bg transition-opacity hover:opacity-85">
              Start a project <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="rounded-[22px] border border-line p-7">
            <Kicker className="text-accent-ink">Hiring?</Kicker>
            <p className="mt-3 text-[16px] leading-relaxed text-ink">Engineering background, specialties and public repositories, in one place.</p>
            <a href="/hire" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-6 py-3 text-[14.5px] font-medium text-ink transition-colors hover:border-ink">
              For engineering teams <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </section>

      <section className="px-3 pb-6 sm:px-6">
        <a href={`/work/${next.slug}`} className="group mx-auto flex max-w-[1360px] items-center justify-between gap-6 rounded-[28px] bg-band px-6 py-10 text-band-fg sm:px-10 lg:px-14">
          <div>
            <Kicker className="text-band-muted">Next project</Kicker>
            <div className="mt-3 text-[clamp(2rem,5vw,3.8rem)] font-semibold leading-none tracking-[-0.045em]">{next.title}</div>
            <div className="mt-2 text-[14px] text-band-muted">{next.kind}</div>
          </div>
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent text-[#111110] transition-transform group-hover:translate-x-1">
            <ArrowUpRight size={22} />
          </span>
        </a>
      </section>
    </>
  );
}

function Overview({ d }: { d: CaseDetail }) {
  return (
    <section aria-labelledby="cs-problem" className="border-t border-line px-5 py-16 sm:px-8 md:py-20">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20">
        <div>
          <Kicker className="text-accent-ink">The problem</Kicker>
          <h2 id="cs-problem" className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-ink">
            {d.problem}
          </h2>
        </div>
        <div>
          <Kicker className="text-accent-ink">My role</Kicker>
          <ul className="mt-4 border-t border-line">
            {d.role.map((r) => (
              <li key={r} className="border-b border-line py-3 text-[15px] text-ink">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function HowItWasBuilt({ d }: { d: CaseDetail }) {
  return (
    <section aria-labelledby="cs-build" className="border-t border-line px-5 py-16 sm:px-8 md:py-20">
      <div className="mx-auto max-w-[1320px]">
        <Kicker className="text-accent-ink">Process</Kicker>
        <h2 id="cs-build" className="mt-3 text-[clamp(1.9rem,3.5vw,2.8rem)] font-semibold tracking-[-0.035em] text-ink">
          How it was built.
        </h2>
        <ol className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {d.process.map((p, i) => (
            <li key={p.title} className="bg-surface p-6">
              <span className="font-mono text-[12px] text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-[18px] font-semibold tracking-[-0.02em] text-ink">{p.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Kicker className="text-accent-ink">Architecture &amp; decisions</Kicker>
            <dl className="mt-5 border-t border-line">
              {d.decisions.map((x) => (
                <div key={x.title} className="border-b border-line py-5">
                  <dt className="text-[17px] font-semibold tracking-[-0.015em] text-ink">{x.title}</dt>
                  <dd className="mt-1.5 text-[15px] leading-relaxed text-muted">{x.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <Kicker className="text-accent-ink">Challenges &amp; solutions</Kicker>
            <ul className="mt-5 space-y-3">
              {d.challenges.map((x) => (
                <li key={x.challenge} className="rounded-[18px] border border-line p-5">
                  <p className="text-[15px] font-medium text-ink">{x.challenge}</p>
                  <p className="mt-2 flex items-start gap-2 text-[14.5px] leading-relaxed text-muted">
                    <Check size={15} className="mt-1 shrink-0 text-accent-ink" />
                    {x.solution}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Outcomes({ d }: { d: CaseDetail }) {
  return (
    <section aria-labelledby="cs-outcomes" className="border-t border-line px-5 py-16 sm:px-8 md:py-20">
      <div className="mx-auto max-w-[1320px]">
        <Kicker className="text-accent-ink">Outcomes · verifiable</Kicker>
        <h2 id="cs-outcomes" className="sr-only">
          Outcomes
        </h2>
        <dl className={`mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-line bg-line ${d.outcomes.length > 3 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
          {d.outcomes.map((o) => (
            <div key={o.k} className="flex flex-col-reverse justify-end bg-surface p-6">
              <dt className="mt-2 text-[14px] leading-snug text-muted">{o.k}</dt>
              <dd className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-none tracking-[-0.04em] text-ink">{o.v}</dd>
            </div>
          ))}
        </dl>
        {d.source && d.outcomes.some((o) => o.k.includes("test")) && (
          <p className="mt-5 text-[14px] text-muted">
            Test counts are taken from the repository:{" "}
            <a href={d.source.href} target="_blank" rel="noreferrer" className="text-ink underline decoration-accent decoration-2 underline-offset-4">
              {d.source.label}
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}
