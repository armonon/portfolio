import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Pause, Play } from "lucide-react";
import { flagships, fullApps, heroWords, siteShowcases, type Flagship } from "./showcase";
import SiteWalkthrough from "./SiteWalkthrough";
import { showreelChapters } from "./cases";
import { engagementTypes, families, process } from "./services";
import { appCounts, clientCount, entry } from "./registry";
import { experience, skills, STUDIO_URL } from "./data/projects";
import { DeviceVideo, Kicker, LaptopFrame, LazyVideo, PhoneFrame, SectionHead, StatusBadge } from "./ui";
import { EASE, bentoSpans } from "./lib";

/*
 * Homepage, in order: Hero → 01 Selected work → 02 Evidence → 03 Expertise → 04 Process → 05 About.
 * 06 Contact is rendered by App (it is shared with every page).
 */

// Soft background glow. CSS keyframes on the compositor (no JS animation loop); paused for reduced motion.
function HeroGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="glow-blob glow-a absolute -right-32 top-10 h-[34rem] w-[34rem] rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 55%, transparent), transparent 65%)" }} />
      <div className="glow-blob glow-b absolute -left-40 bottom-0 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl" style={{ background: "radial-gradient(circle, #ff7ad9, transparent 65%)" }} />
    </div>
  );
}

function useIsDesktop() {
  const [desk, setDesk] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setDesk(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desk;
}

// Collage of real work beside the headline. Only mounted on desktop, so phones never download its media.
// Layered parallax: each card drifts with the pointer by its own depth (transform only, rAF-throttled).
const depth = (n: number) => ({ transform: `translate3d(calc(var(--px, 0) * ${n}px), calc(var(--py, 0) * ${n * 0.7}px), 0)`, transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" });

function HeroCollage() {
  const desktop = useIsDesktop();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!desktop || reduce || !el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        el.style.setProperty("--py", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [desktop, reduce]);
  if (!desktop) return null;
  const logos = ["form", "luma", "stemdeck", "glyph-studio", "autocut", "vox"];
  return (
    <div ref={ref} className="pointer-events-none absolute right-0 top-28 h-[620px] w-[46%]">
      <a href="/work/sattari" aria-label="Sattari Music: AI video ad and website" style={depth(10)} className="float-a pointer-events-auto absolute right-[4%] top-0 block w-[78%] rotate-[2.5deg] overflow-hidden rounded-[20px] border border-line bg-[#1a1714] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)] transition-transform hover:rotate-0">
        <LazyVideo src="/videos/hero-ad.mp4" eagerPoster label="AI-generated video ad for Sattari Music" className="block aspect-video w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur">AI video ad</span>
      </a>
      <a href="/work/breakthyrule-eden" aria-label="BREAKTHYRULE Eden, an explorable 3D website" style={depth(22)} className="float-b pointer-events-auto absolute left-0 top-[44%] block w-[52%] -rotate-[4deg] overflow-hidden rounded-[18px] border border-line bg-surface shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] transition-transform hover:rotate-0">
        <img src="/photos/walkthrough/eden-eden.jpg" alt="" width={1280} height={800} decoding="async" className="block aspect-[16/10] w-full object-cover object-top" />
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur">3D website</span>
      </a>
      <a href="/work/librarian" style={depth(30)} className="float-c pointer-events-auto absolute right-[6%] top-[42%] block w-[24%] rotate-[6deg] transition-transform hover:rotate-0">
        <span className="sr-only">Librarian running on an iPhone</span>
        <PhoneFrame url="librarian.thecreatingco.com">
          <DeviceVideo src="/videos/hero-librarian.mp4" poster="/photos/librarian-iphone-results.jpg" label="Librarian on iPhone" className="h-full w-full object-cover object-top" />
        </PhoneFrame>
      </a>
      <a href="/apps" aria-label={`Browse all ${appCounts.total} apps`} style={depth(16)} className="float-d pointer-events-auto absolute left-[12%] top-[6%] grid grid-cols-3 gap-2 rounded-[22px] border border-line bg-surface/90 p-3 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.45)] backdrop-blur">
        {logos.map((l) => (
          <img key={l} src={`/app-logos/${l}.svg`} alt="" width={40} height={40} className="h-10 w-10 rounded-xl" />
        ))}
      </a>
      <a href="/work/skybound" aria-label="SKYBOUND, a physics browser game" style={depth(38)} className="float-b pointer-events-auto absolute left-[26%] top-[76%] block w-[40%] rotate-[3deg] overflow-hidden rounded-[16px] border border-line bg-[#0d1530] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55)] transition-transform hover:rotate-0">
        <LazyVideo src="/videos/hero-skybound.mp4" label="SKYBOUND gameplay trailer" className="block aspect-video w-full object-cover" />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur">Browser game</span>
      </a>
    </div>
  );
}

// Cycles through what I make (the secondary brand line in the hero).
function RotatingWord({ words, suffix = "" }: { words: string[]; suffix?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), 1800);
    return () => window.clearInterval(id);
  }, [words.length]);
  // Every word is always mounted in the same grid cell; only the active one is shown.
  return (
    <span className="relative -mb-[0.12em] inline-grid overflow-hidden pb-[0.12em] align-bottom">
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {words.reduce((a, b) => (b.length > a.length ? b : a))}
        {suffix}
      </span>
      {words.map((w, k) => (
        <motion.span
          key={w}
          aria-hidden={k !== i}
          initial={false}
          animate={{ y: k === i ? "0%" : k === (i - 1 + words.length) % words.length ? "-110%" : "110%", opacity: k === i ? 1 : 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="col-start-1 row-start-1 whitespace-nowrap text-accent-ink"
        >
          {w}
          <span className="text-ink">{suffix}</span>
        </motion.span>
      ))}
    </span>
  );
}

const fullAppSlug: Record<string, string> = { librarian: "librarian", form: "form-studio", luma: "luma-studio", hole: "hole", stemdeck: "stemdeck" };

// Full-app ids that differ from their registry ids.
const fullAppReg: Record<string, string> = { form: "form-studio", luma: "luma-studio" };

// Only numbers that can be checked: test counts are from each repository's suite.
const proofStats = [
  { v: "1,500+", k: "automated tests in Form Studio" },
  { v: "1,370", k: "automated tests in Sattari Music" },
  { v: "1,200+", k: "automated tests in Luma Studio" },
  { v: String(clientCount), k: "live client & brand projects" }
];

const clientWork = [
  { id: "sattari", name: "Sattari Music", line: "Store, booking, Stripe & local SEO", href: "/work/sattari" },
  { id: "synthesis", name: "Synthesis", line: "3D showroom & store", href: "/work/synthesis" },
  { id: "breakthyrule-eden", name: "BREAKTHYRULE Eden", line: "Explorable 3D brand world", href: "/work/breakthyrule-eden" },
  { id: "nasiri-team", name: "Nasiri Team Realty", line: "Real estate listings site", href: "https://nasiriteam.netlify.app" },
  { id: "hamdam-care", name: "Hamdam Care", line: "Caregiving service site", href: "https://myhamdam.com" },
  { id: "healthcore", name: "HealthCore", line: "Clinic network site", href: "https://armonon.github.io/healthcore-public-website" }
];

function Evidence() {
  const [active, setActive] = useState(0);
  const [shot, setShot] = useState<number | null>(null);
  const app = fullApps[active];
  return (
    <section id="evidence" className="px-3 py-10 sm:px-6 md:py-16">
      <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[32px] bg-band px-5 py-12 text-band-fg sm:px-10 md:py-16 lg:px-14">
        <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Kicker className="text-band-muted">
              <span className="text-accent">02</span>
              <span className="mx-2 opacity-40">/</span>
              Evidence
            </Kicker>
            <h2 className="mt-5 max-w-[16ch] text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              Not mockups. <span className="font-serif font-normal italic text-accent">Real software,</span> verified.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-band-muted">
            Recordings of the running apps, test counts taken from their repositories, and client sites you can open today. Design, engine, AI and deployment are all by me.
          </p>
        </div>

        <dl className="mb-12 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-band-line bg-band-line md:grid-cols-4">
          {proofStats.map((s) => (
            <div key={s.k} className="flex flex-col-reverse justify-end bg-band p-5 md:p-6">
              <dt className="mt-2 text-[13.5px] leading-snug text-band-muted">{s.k}</dt>
              <dd className="text-[clamp(1.9rem,3.6vw,2.8rem)] font-semibold leading-none tracking-[-0.04em] text-band-fg">{s.v}</dd>
            </div>
          ))}
        </dl>

        <div id="full-apps" className="scroll-mt-24">
          <Kicker className="mb-4 text-band-muted">Full apps · recorded live</Kicker>

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
              {app.phone && shot === null && (
                <div className="mx-auto w-[64%] max-w-[260px] sm:hidden">
                  <PhoneFrame url={app.live.replace("https://", "").replace(/\/$/, "")}>
                    <DeviceVideo src={app.phone.video} poster={app.phone.poster} className="h-full w-full object-cover object-top" />
                  </PhoneFrame>
                </div>
              )}
              <div className={app.phone ? `lg:pr-[18%] ${shot === null ? "hidden sm:block" : ""}` : ""}>
                <LaptopFrame url={app.live.replace("https://", "")}>
                  {shot !== null ? (
                    <img src={app.shots[shot].src} alt={app.shots[shot].label} className="h-full w-full object-cover object-top" />
                  ) : app.phone && app.video === app.phone.video ? (
                    <img loading="lazy" src={app.poster} alt={`${app.name} on desktop`} className="h-full w-full object-cover object-top" />
                  ) : (
                    <DeviceVideo src={app.video} poster={app.poster} className="h-full w-full object-cover object-top" />
                  )}
                </LaptopFrame>
              </div>
              {app.phone && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
                  className="absolute -bottom-6 right-0 hidden w-[30%] max-w-[230px] sm:block"
                >
                  <PhoneFrame url={app.live.replace("https://", "").replace(/\/$/, "")}>
                    <DeviceVideo src={app.phone.video} poster={app.phone.poster} className="h-full w-full object-cover object-top" />
                  </PhoneFrame>
                </motion.div>
              )}
              {/* screenshot strip */}
              <div className={`mt-6 flex gap-2 overflow-x-auto pb-1 ${app.phone ? "sm:pr-[32%]" : ""}`}>
                <button
                  onClick={() => setShot(null)}
                  className={`shrink-0 rounded-xl border px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.1em] transition-colors ${shot === null ? "border-accent text-accent" : "border-band-line text-band-muted hover:text-band-fg"}`}
                >
                  ▶ {app.phone ? <><span className="sm:hidden">Phone</span><span className="hidden sm:inline">Desktop</span></> : "Live clip"}
                </button>
                {app.shots.map((sh, i) => (
                  <button
                    key={sh.src}
                    onClick={() => setShot(i)}
                    title={sh.label}
                    aria-label={`Show screenshot: ${sh.label}`}
                    className={`h-12 w-20 shrink-0 overflow-hidden rounded-lg border transition-colors ${shot === i ? "border-accent" : "border-band-line opacity-70 hover:opacity-100"}`}
                  >
                    <img src={sh.src} alt={sh.label} loading="lazy" className="h-full w-full object-cover object-top" />
                  </button>
                ))}
              </div>
            </div>

            {/* details */}
            <div className="self-center">
              <div className="flex flex-wrap items-center gap-3"><Kicker className="text-accent">{app.kind}</Kicker><StatusBadge id={fullAppReg[app.id] ?? app.id} tone="band" /></div>
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
                  {app.layers.map((l) => (
                    <span key={l} className="rounded-full border border-band-line px-3 py-1 font-mono text-[11px] text-band-fg/80">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href={app.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[14.5px] font-medium text-[#111110] transition-transform hover:-translate-y-0.5">
                  Open {app.name} <ArrowUpRight size={15} />
                </a>
                {fullAppSlug[app.id] && (
                  <a href={`/work/${fullAppSlug[app.id]}`} className="inline-flex items-center gap-2 rounded-full border border-band-line px-6 py-3 text-[14.5px] font-medium text-band-fg transition-colors hover:border-band-fg/50">
                    Case study
                  </a>
                )}
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-band-muted">{app.platforms}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        </div>

        <div className="mt-16 border-t border-band-line pt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <Kicker className="text-band-muted">Client &amp; brand sites · open them live</Kicker>
            <a href="/work#websites" className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent hover:underline">All websites →</a>
          </div>
          <ul className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-[18px] border border-band-line bg-band-line sm:grid-cols-2 lg:grid-cols-3">
            {clientWork.map((c) => {
              const ext = c.href.startsWith("http");
              return (
                <li key={c.name} className="bg-band">
                  <a href={c.href} {...(ext ? { target: "_blank", rel: "noreferrer" } : {})} className="group flex h-full items-center justify-between gap-4 p-5 transition-colors hover:bg-white/[0.04]">
                    <span>
                      <span className="flex flex-wrap items-center gap-2 text-[16px] font-semibold tracking-[-0.01em]">
                        {c.name}
                        <StatusBadge id={c.id} tone="band" />
                      </span>
                      <span className="mt-1 block text-[13.5px] text-band-muted">{c.line}</span>
                    </span>
                    <ArrowUpRight size={16} className="shrink-0 text-band-muted transition-colors group-hover:text-accent" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ShowreelSection() {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const [armed, setArmed] = useState(false);
  const [t, setT] = useState(0);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(!reduce);
  if (inView && !armed) setArmed(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || !armed) return;
    el.muted = true;
    el.playsInline = true;
    if (inView && playing) el.play().catch(() => {});
    else el.pause();
  }, [inView, armed, playing]);
  const chapter = [...showreelChapters].reverse().find((c) => t >= c.t) ?? showreelChapters[0];
  const ci = showreelChapters.indexOf(chapter);
  return (
    <section id="reel" className="px-3 pb-10 sm:px-6">
      <div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[28px] bg-[#0d0d0c]">
        <video
          ref={ref}
          src={armed ? "/videos/showreel.mp4" : undefined}
          poster="/photos/showreel-poster.jpg"
          muted
          loop
          playsInline
          preload="none"
          onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
          aria-label="Showreel of apps, websites and AI media"
          className="block aspect-[4/3] w-full object-cover sm:aspect-[16/9] md:aspect-[21/9]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-6">
          <span className="rounded-full bg-accent px-3 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-[#111110]">Showreel</span>
          <button onClick={() => setPlaying((v) => !v)} aria-label={playing ? "Pause showreel" : "Play showreel"} className="grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black">
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
        <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
          <AnimatePresence mode="wait">
            <motion.a
              key={chapter.label + chapter.t}
              href={`/work/${chapter.slug}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="inline-block text-white"
            >
              <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">{chapter.sub}</div>
              <div className="mt-1 text-[clamp(1.6rem,4vw,3rem)] font-semibold leading-none tracking-[-0.04em]">{chapter.label} <span className="text-white/50">→</span></div>
            </motion.a>
          </AnimatePresence>
          <div className="mt-4 flex gap-1">
            {showreelChapters.map((c, n) => (
              <button
                key={c.t}
                onClick={() => {
                  if (ref.current) ref.current.currentTime = c.t + 0.05;
                  setT(c.t + 0.05);
                }}
                aria-label={c.label}
                className="group flex h-8 flex-1 items-center"
              >
                <span className={`block h-[3px] w-full rounded-full transition-colors ${n < ci ? "bg-white/70" : n === ci ? "bg-accent" : "bg-white/25 group-hover:bg-white/50"}`} />
              </button>
            ))}
          </div>
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
          n="04"
          kicker="Process"
          title={<>Clear steps, <span className="font-serif font-normal italic">visible</span> progress.</>}
          aside="You always know what's being built, what it costs and when it lands."
        />
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-line bg-line md:grid-cols-4">
          {process.map((step) => (
            <div key={step.k} className="bg-surface p-7">
              <span className="font-mono text-[12px] text-accent-ink">{step.k}</span>
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-ink">{step.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="rail mt-10 grid grid-cols-1 gap-3 md:grid-cols-3">
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

// Phones and tablets (no collage): a moving strip of real work, each tile opening its case study.
const tickerItems = [
  { slug: "sattari", img: "sattari-ad", label: "AI video ad" },
  { slug: "skybound", img: "skybound", label: "Browser game" },
  { slug: "breakthyrule-eden", img: "eden", label: "3D website" },
  { slug: "luma-studio", img: "luma", label: "Image editor" },
  { slug: "synthesis", img: "synthesis", label: "3D store" },
  { slug: "form-studio", img: "form", label: "CAD" },
  { slug: "scenepilot", img: "scenepilot", label: "Video editor" },
  { slug: "librarian", img: "librarian", label: "Research app" }
];

function WorkTicker() {
  const tile = (t: (typeof tickerItems)[number], copy: boolean) => (
    <a
      key={`${copy ? "b" : "a"}-${t.slug}`}
      href={`/work/${t.slug}`}
      tabIndex={copy ? -1 : undefined}
      aria-hidden={copy || undefined}
      className="group relative block w-[46vw] max-w-[220px] shrink-0 overflow-hidden rounded-[14px] border border-line bg-[#1a1714] shadow-[0_16px_30px_-18px_rgba(0,0,0,0.45)]"
    >
      <img src={`/photos/thumbs/${t.img}.jpg`} alt="" width={360} height={225} decoding="async" className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-white backdrop-blur">{t.label}</span>
      {!copy && <span className="sr-only">Open the case study</span>}
    </a>
  );
  return (
    <nav aria-label="Recent work" className="ticker marquee-pause -mx-5 mt-10 overflow-hidden sm:-mx-8 lg:hidden">
      <div className="marquee-mask">
        <div className="ticker-track flex w-max gap-3 px-5 sm:px-8">
          {tickerItems.map((t) => tile(t, false))}
          {tickerItems.map((t) => tile(t, true))}
        </div>
      </div>
    </nav>
  );
}

function Hero({ scrollTo }: { scrollTo: (id: string) => void }) {
  return (
    <section id="hero" className="relative isolate px-5 sm:px-8">
      <HeroGlow />
      <div className="relative mx-auto max-w-[1320px] pb-10 pt-8 sm:pb-16 sm:pt-16 md:pt-24 lg:pb-24">
        <HeroCollage />
        {/* min-height: the fallback font wraps taller than Inter Tight; reserving the space stops the stats strip shifting when fonts load */}
        <div className="relative lg:min-h-[640px] lg:max-w-[52%]">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("contact");
            }}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-2.5 pr-4 text-[13px] text-muted transition-colors hover:border-ink/30"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-accent opacity-80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5f9a00]" />
            </span>
            <span className="whitespace-nowrap font-medium text-ink">Available for new projects</span>
            <span className="hidden sm:inline">· Los Angeles &amp; remote</span>
          </a>

          <h1 className="mt-7 text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-ink sm:mt-10">
            Ideas into
            <br />
            working{" "}
            <span className="relative inline-block">
              <span className="shine font-serif font-normal italic tracking-[-0.02em] text-accent-ink">products.</span>
              <svg aria-hidden viewBox="0 0 300 24" preserveAspectRatio="none" className="swash pointer-events-none absolute -bottom-[0.06em] left-[2%] h-[0.22em] w-[96%] overflow-visible">
                <path d="M3 17 C 60 5, 140 4, 297 12" fill="none" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-[38rem] text-[17px] leading-relaxed text-muted sm:mt-8 sm:text-[19px]">
            I design and build ambitious software, immersive websites, and AI-powered experiences&mdash;from the first concept to a working launch.
          </p>

          <p className="mt-5 text-[15px] text-ink/75 [perspective:600px] sm:text-[17px]">
            <span className="font-serif text-[1.25em] italic">
              <RotatingWord words={heroWords} suffix="," />
            </span>{" "}
            you name it, I create it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("work");
              }}
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-bg transition-opacity hover:opacity-85"
            >
              Explore selected work
              <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("contact");
              }}
              className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-7 py-3.5 text-[15px] font-medium text-ink transition-colors hover:border-ink"
            >
              Start a project
              <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
        <WorkTicker />
      </div>

      <dl className="mx-auto grid max-w-[1320px] grid-cols-3 gap-px border-y border-line bg-line">
        {[
          { k: "Based in", v: "Los Angeles · remote" },
          { k: "Disciplines", v: "Design · Code · AI" },
          { k: "Studio", v: "thecreateco", href: STUDIO_URL }
        ].map((row) => (
          <div key={row.k} className="flex flex-col-reverse justify-end bg-bg px-2 py-4 first:pl-0 sm:px-1 sm:py-6 md:px-6">
            <dd className="mt-1.5 text-[14px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:mt-2 sm:text-[clamp(1.15rem,2vw,1.6rem)] sm:tracking-[-0.03em]">
              {row.href ? (
                <a href={row.href} target="_blank" rel="noreferrer" className="underline decoration-accent decoration-2 underline-offset-4 hover:decoration-ink">
                  {row.v}
                </a>
              ) : (
                row.v
              )}
            </dd>
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">{row.k}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

function WorkCard({ item, index, span }: { item: Flagship; index: number; span: string }) {
  const big = span.includes("col-span-4");
  const reg = entry(item.slug);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: EASE, delay: (index % 2) * 0.06 }}
      className={`group relative flex flex-col overflow-hidden rounded-[24px] border border-line bg-surface transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)] ${span}`}
    >
      <div className={`relative overflow-hidden bg-[#1a1714] ${big ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        {item.media.video ? (
          <LazyVideo src={item.media.video} poster={item.media.image} label={`${item.title}, recorded live`} className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]" />
        ) : (
          <img src={item.media.image} alt={`${item.title} screenshot`} loading="lazy" decoding="async" width={1280} height={800} className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]" />
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
          <span className="min-w-0 truncate rounded-full bg-black/60 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-white backdrop-blur-md">{item.service}</span>
          <StatusBadge id={item.slug} tone="dark" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <Kicker className="text-accent-ink">{item.role}</Kicker>
        <h3 className={`mt-2 font-semibold leading-tight tracking-[-0.03em] text-ink ${big ? "text-[2rem]" : "text-[1.6rem]"}`}>
          <a href={`/work/${item.slug}`} className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none">
            {item.title}
          </a>
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.hook}</p>
        <p className="mt-4 flex items-start gap-2 text-[13.5px] text-ink/80">
          <Check size={15} className="mt-0.5 shrink-0 text-accent-ink" />
          {item.proof}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-[13.5px] font-medium text-bg">
            Read the case study <ArrowUpRight size={14} />
          </span>
          {reg?.live && (
            <a href={reg.live} target="_blank" rel="noreferrer" className="relative z-20 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line px-5 py-2.5 text-[13.5px] font-medium text-ink transition-colors hover:border-ink">
              Open it live <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// The Synthesis site, room by room: an explorable store as a website example.
function WebsiteSpotlight() {
  const site = siteShowcases.find((x) => x.id === "synthesis");
  if (!site) return null;
  return (
    <div id="website-spotlight" className="mt-16 border-t border-line pt-12 md:mt-20 md:pt-16">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <Kicker className="text-accent-ink">Website spotlight · walk through it</Kicker>
        <a href="/work#websites" className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted hover:text-ink">More websites →</a>
      </div>
      <SiteWalkthrough site={site} index={0} />
    </div>
  );
}

function SelectedWork() {
  return (
    <section id="work" className="border-t border-line px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <SectionHead
          n="01"
          kicker="Selected work"
          title={
            <>
              Six projects, <span className="font-serif font-normal italic">concept</span> to launch.
            </>
          }
          aside={<>Client launches, products in public beta and one private build, each labelled with its real status. Every card opens a full case study.</>}
        />
        <div className="rail grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {flagships.map((item, i) => (
            <WorkCard key={item.slug} item={item} index={i} span={bentoSpans[i % bentoSpans.length]} />
          ))}
        </div>
        <WebsiteSpotlight />
        <div className="mt-10 flex flex-col gap-4 rounded-[22px] border border-line p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15.5px] text-ink">
            Plus {appCounts.total} apps and tools, client websites, plugins and AI media.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href="/work" className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-bg hover:opacity-85">
              All work <ArrowUpRight size={14} />
            </a>
            <a href="/apps" className="inline-flex min-h-11 items-center rounded-full border border-line px-5 py-2.5 text-[14px] font-medium text-ink hover:border-ink">
              App catalogue
            </a>
            <a href="/tools" className="inline-flex min-h-11 items-center rounded-full border border-line px-5 py-2.5 text-[14px] font-medium text-ink hover:border-ink">
              Free tools
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Expertise() {
  return (
    <section id="expertise" className="px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <SectionHead
          n="03"
          kicker="Expertise"
          title={
            <>
              Three disciplines, <span className="font-serif font-normal italic">one</span> builder.
            </>
          }
          aside={<>Design, engineering and AI from one person, so nothing gets lost between agencies. Each area links to work that shows it.</>}
        />
        <div className="rail grid grid-cols-1 gap-3 md:grid-cols-3">
          {families.map((f) => (
            <article key={f.id} id={`expertise-${f.id}`} className="flex flex-col rounded-[22px] border border-line bg-surface p-7">
              <Kicker className="text-accent-ink">{f.kicker}</Kicker>
              <h3 className="mt-4 text-[1.6rem] font-semibold leading-tight tracking-[-0.025em] text-ink">{f.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.line}</p>
              <ul className="mt-5 space-y-2">
                {f.items.map((it) => (
                  <li key={it} className="flex items-start gap-2.5 text-[14px] text-ink/85">
                    <Check size={15} className="mt-0.5 shrink-0 text-accent-ink" />
                    {it}
                  </li>
                ))}
              </ul>
              <div className="mt-auto border-t border-line pt-5">
                <Kicker>See it in</Kicker>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {f.proof.map((pr) => (
                    <a key={pr.href} href={pr.href} className="inline-flex min-h-9 items-center rounded-full border border-line px-3 py-1.5 text-[12.5px] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg">
                      {pr.label}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-[15px] text-muted">
          Engagement types, deliverables and local AI agent setup are on the{" "}
          <a href="/services" className="text-ink underline decoration-accent decoration-2 underline-offset-4 hover:decoration-ink">
            services page
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="border-t border-line px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <Kicker>
              <span className="text-accent-ink">05</span>
              <span className="mx-2 text-line">/</span>
              About
            </Kicker>
            <h2 className="mt-6 text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
              A designer who <span className="font-serif font-normal italic">engineers</span>, and an engineer who <span className="font-serif font-normal italic">designs</span>.
            </h2>
            <div className="mt-8 max-w-[34rem] space-y-5 text-[16px] leading-relaxed text-muted">
              <p>
                I&rsquo;m Armon Nasiri, based in Los Angeles. Most projects need a brand, a site, some media and software
                that ties it together. That usually means several vendors and a lot of lost context. I do all of it, so
                the look, the code and the AI come from one plan.
              </p>
              <p>
                The range is there to inspect: a production music store with Stripe checkout, a CAD application on Open
                CASCADE, an image editor with a Rust compositor and on-device AI, audio plugins, explorable three.js
                worlds and a private agent that operates a Mac.
              </p>
              <p>
                Tools should feel powerful and calm, run on your own device where they can, and say honestly what they
                can and can&rsquo;t do yet. That is how thecreateco, my studio, builds them.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/hire" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-6 py-3 text-[14.5px] font-medium text-ink transition-colors hover:border-ink">
                For engineering teams <ArrowUpRight size={15} />
              </a>
              <a href="https://github.com/armonon" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-6 py-3 text-[14.5px] font-medium text-ink transition-colors hover:border-ink">
                GitHub <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          <div className="self-start border-t border-line">
            {experience.map((item) => (
              <div key={item.role + item.org} className="border-b border-line py-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink">{item.role}</h3>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-serif text-xl italic text-accent-ink hover:underline">
                      {item.org} <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <span className="font-serif text-xl italic text-muted">{item.org}</span>
                  )}
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.body}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((t) => (
                    <span key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// The original skills marquee (CSS-only; pauses on hover and stops for reduced motion).
function SkillsMarquee() {
  return (
    <section aria-label="Tools and languages" className="marquee-pause overflow-hidden py-7">
      <p className="sr-only">{skills.join(", ")}</p>
      <div aria-hidden className="marquee-mask">
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
  );
}

export default function Home({ scrollTo }: { scrollTo: (id: string) => void }) {
  return (
    <>
      <Hero scrollTo={scrollTo} />
      <SkillsMarquee />
      <SelectedWork />
      <Evidence />
      <ShowreelSection />
      <Expertise />
      <ProcessSection />
      <About />
    </>
  );
}
