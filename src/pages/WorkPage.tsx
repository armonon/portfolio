import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { appCatalogue, flagships, siteShowcases } from "../showcase";
import { caseStudies } from "../cases";
import { artPieces } from "../services";
import { radarDirectory, radarDirectoryGroups } from "../productRadarData";
import { entry } from "../registry";
import { projects, softwareProjects, websiteProjects, STUDIO_URL, studioApps, studioSuiteExamples, studioToolExamples, type Project } from "../data/projects";
import { Kicker, SectionHead, ProjectMedia, ProjectCard, Lightbox, DeviceVideo, LaptopFrame, PhoneFrame, CaseCard, StatusBadge } from "../ui";
import { EASE, spanFor } from "../lib";
import SiteWalkthrough from "../SiteWalkthrough";

const flagshipIds = new Set(flagships.map((f) => entry(f.slug)?.id).filter(Boolean));

const moreProjects = softwareProjects.filter((p) => !flagshipIds.has(entry(String(p.id))?.id));

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
  // The clip is ~4 MB, so it only starts downloading once it is within ~1.5 screens of view.
  const near = useInView(wrapRef, { once: true, margin: "1200px" });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !near) return;
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
  }, [progress, near]);

  return (
    <motion.div ref={wrapRef} style={{ scale, rotate }} className="relative overflow-hidden rounded-[22px] border border-band-line bg-[#1a1714] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
      <video ref={videoRef} src={near ? src : undefined} poster={poster} preload={near ? "auto" : "none"} muted playsInline aria-label={label} className="block aspect-[16/7] w-full object-cover" />
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center gap-3">
        <span className="rounded-full bg-[#111110]/80 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-white backdrop-blur">Scroll to play</span>
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
          <motion.div style={{ scaleX: barScale }} className="h-full origin-left rounded-full bg-accent" />
        </div>
      </div>
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
  const [open, setOpen] = useState<number | null>(null);
  const visible = artPieces.filter((piece) => !missing.includes(piece.src));
  const step = useCallback((dir: 1 | -1) => setOpen((n) => (n === null ? n : (n + dir + visible.length) % visible.length)), [visible.length]);
  const close = useCallback(() => setOpen(null), []);
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
            <button onClick={() => setOpen(visible.indexOf(piece))} aria-label={`View ${piece.title}`} className="block w-full overflow-hidden bg-[#0d0d0c]">
              <img
                src={piece.src}
                alt={piece.title}
                loading="lazy"
                onError={() => setMissing((cur) => [...cur, piece.src])}
                className="w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
              />
            </button>
            <figcaption className="p-5">
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-ink">{piece.title}</h3>
              <Kicker className="mt-1.5">{piece.medium}</Kicker>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{piece.note}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <Lightbox items={visible} index={open} onClose={close} onStep={step} />
    </div>
  );
}


function WebsitesSection({ onInquire }: { onInquire: () => void }) {
  return (
    <section id="websites" className="scroll-mt-20 border-t border-line px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <SectionHead
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


function FeaturedAdSection({ onOpenProject, onInquire }: { onOpenProject: (id: string) => void; onInquire: () => void }) {
  return (
    <section id="ai-video" className="scroll-mt-20 px-5 pb-20 sm:px-8 md:pb-28">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <ShowreelVideo src="/videos/sattari-ai-ad.mp4" poster="/photos/sattari-ai-ad-poster.jpg" label="Sattari Music AI-generated video ad" />
          <div>
            <Kicker className="text-accent-ink">Featured · AI video</Kicker>
            <h2 className="mt-4 text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">
              A full ad, <span className="font-serif font-normal italic">generated</span> and directed.
            </h2>
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

function SocialSection() {
  const features = [
    { t: "Chatrooms & DMs", d: "Public rooms, invite-only rooms and one-to-one messages." },
    { t: "Group video", d: "Video chat and group cameras inside the conversation." },
    { t: "PictoChat", d: "Draw your hello. Some things are better drawn." },
    { t: "Disappearing messages", d: "Message timers from one minute to thirty days." },
    { t: "Social feed", d: "Native posts plus Instagram, X and YouTube links in one feed." },
    { t: "Join with a name", d: "Guests join without an email; sign in only to upload." }
  ];
  return (
    <section id="social" className="scroll-mt-20 px-3 py-10 sm:px-6 md:py-16">
      <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[32px] bg-[#ece8f7] px-5 py-12 text-[#1d1a2b] sm:px-10 md:py-16 lg:px-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#5b4fa8]">
              <span>✳</span>
              <span className="mx-2 opacity-40">/</span>
              Social & private messaging
            </div>
            <h2 className="mt-5 max-w-[14ch] text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              A social network, <span className="font-serif font-normal italic text-[#6d5ce8]">with a messenger</span> built in.
            </h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[#4a4560]">
              The Circle is the shared space: profiles, posts, music and a feed. NOW is the conversation: rooms, DMs, video and drawings. I designed and built both, and the same stack can power a community for your brand.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
              {features.map((f) => (
                <div key={f.t}>
                  <div className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6d5ce8]" />
                    {f.t}
                  </div>
                  <p className="mt-1 pl-3.5 text-[13.5px] leading-snug text-[#4a4560]">{f.d}</p>
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="/work/the-circle" className="inline-flex items-center gap-2 rounded-full bg-[#1d1a2b] px-6 py-3 text-[14.5px] font-medium text-white transition-opacity hover:opacity-85">
                See the walkthrough <ArrowUpRight size={15} />
              </a>
              <a href="https://thecreatingco.com/community/network" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#1d1a2b]/20 px-6 py-3 text-[14.5px] font-medium transition-colors hover:border-[#1d1a2b]">
                Enter The Circle
              </a>
              <a href="https://thecreatingco.com/products/now/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#1d1a2b]/20 px-6 py-3 text-[14.5px] font-medium transition-colors hover:border-[#1d1a2b]">
                Meet NOW
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="hidden sm:block sm:pr-[20%]">
              <LaptopFrame url="thecreatingco.com/community/network?view=Messages">
                <DeviceVideo src="/videos/walk/now-chat.mp4" poster="/photos/walk/now-chat-1.jpg" className="h-full w-full object-cover object-top" />
              </LaptopFrame>
            </div>
            <div className="mx-auto w-[64%] max-w-[250px] sm:absolute sm:-bottom-6 sm:right-0 sm:mx-0 sm:w-[32%]">
              <PhoneFrame url="thecreatingco.com/community/network">
                <DeviceVideo src="/videos/walk/now-chat-m.mp4" poster="/photos/walk/now-chat-m-1.jpg" className="h-full w-full object-cover object-top" />
              </PhoneFrame>
            </div>
            <p className="mt-10 text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-[#5b4fa8] sm:mt-12 sm:pr-[36%] sm:text-left">
              Recorded live · two guests, one private DM · a 1-hour message timer · a PictoChat doodle
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const jump = [
  { id: "case-studies", label: "Case studies" },
  { id: "websites", label: "Websites" },
  { id: "ai-video", label: "AI video & art" },
  { id: "social", label: "Social & messaging" },
  { id: "more", label: "More projects" },
  { id: "platforms", label: "Client sites" },
  { id: "studio", label: "thecreateco" },
  { id: "index", label: "Full index" }
];

export default function WorkPage({ setOpenProject, onInquire }: { setOpenProject: (p: Project) => void; onInquire: () => void }) {
  const [indexFilter, setIndexFilter] = useState<string>("All");
  const liveCount = radarDirectory.filter((d) => d.live).length;
  const groups = ["App", "Game", "Brand", "Website", "Tool"] as const;
  const openById = (id: string) => {
    const p = projects.find((x) => x.id === id);
    if (p) setOpenProject(p);
  };
  return (
    <>
      <section className="px-5 pb-6 pt-14 sm:px-8 md:pt-20">
        <div className="mx-auto max-w-[1320px]">
          <a href="/" className="-my-2 inline-flex items-center gap-1.5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink">← Home</a>
          <h1 className="mt-6 max-w-[16ch] text-[clamp(2.8rem,7vw,6rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-ink">
            All the <span className="font-serif font-normal italic text-accent-ink">work.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
            {caseStudies.length} case studies recorded from the live products, then websites, AI media, every other project and the full index. Or browse{" "}
            <a href="/apps" className="text-ink underline decoration-accent decoration-2 underline-offset-4">all {appCatalogue.length} apps</a>.
          </p>
          <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2">
            {jump.map((j) => (
              <a key={j.id} href={`#${j.id}`} className="inline-flex min-h-10 items-center rounded-full border border-line px-4 py-2 text-[13.5px] text-ink transition-colors hover:border-ink">
                {j.label}
              </a>
            ))}
          </nav>
        </div>
      </section>
      <div id="case-studies" className="scroll-mt-20">
        {groups.map((g) => {
          const items = caseStudies.filter((c) => c.group === g);
          if (!items.length) return null;
          return (
            <section key={g} aria-labelledby={`group-${g}`} className="px-5 py-8 sm:px-8">
              <div className="mx-auto max-w-[1320px]">
                <div className="flex items-baseline justify-between border-b border-line pb-4">
                  <h2 id={`group-${g}`} className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    {g === "Brand" ? "Client brands" : g === "Tool" ? "Free tools" : `${g}s`}
                  </h2>
                  <Kicker>{items.length} case studies</Kicker>
                </div>
                <div className="rail grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((c) => (
                    <CaseCard key={c.slug} c={c} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <WebsitesSection onInquire={onInquire} />
      <FeaturedAdSection onOpenProject={openById} onInquire={onInquire} />
      <SocialSection />
        {/* ── SELECTED WORK ────────────────────────────────── */}
        <section id="more" className="scroll-mt-20 border-t border-line px-5 py-20 sm:px-8 md:py-28">
          <div className="mx-auto max-w-[1320px]">
            <SectionHead
              kicker="More projects"
              title={<>Audio, apps, <span className="font-serif font-normal italic">search</span> and AI.</>}
              aside={<>{moreProjects.length} more projects, each with its current status. Tap any card for the full breakdown.</>}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
              {moreProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} span={spanFor(i, moreProjects.length)} onOpen={() => setOpenProject(project)} />
              ))}
            </div>
          </div>
        </section>

        {/* ── PLATFORMS / CLIENT WORK ──────────────────────── */}
        <section id="platforms" className="scroll-mt-20 px-5 pb-20 sm:px-8 md:pb-28">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex items-baseline justify-between border-b border-line pb-5">
              <Kicker>Platforms &amp; client sites</Kicker>
              <Kicker>{websiteProjects.length} sites</Kicker>
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
        <section id="studio" className="scroll-mt-20 px-3 py-10 sm:px-6 md:py-16">
          <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[32px] bg-band text-band-fg">
            <div className="grid grid-cols-1 gap-12 px-6 pb-12 pt-12 sm:px-10 md:pt-16 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14 lg:px-14 lg:pb-16">
              <div className="flex flex-col">
                <Kicker className="text-band-muted">
                  <span className="text-accent">✳</span>
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
                          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{item.name}</h3>
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
                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.025em]">{tool.name}</h3>
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

        {/* ── FULL INDEX ───────────────────────────────────── */}
        <section id="index" className="scroll-mt-20 px-5 py-20 sm:px-8 md:py-28">
          <div className="mx-auto max-w-[1320px]">
            <SectionHead
              kicker="Full index"
              title="Everything I've built."
              aside={
                <>
                  {radarDirectory.length} entries, {liveCount} with a public link. For roadmaps and test builds, see the{" "}
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
                            <span className="text-[16px] font-medium text-ink">{item.name}</span>
                            <StatusBadge id={item.name} />
                          </div>
                          <p className="mt-1 max-w-[52ch] text-[13.5px] leading-snug text-muted">{item.blurb}</p>
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

    </>
  );
}
