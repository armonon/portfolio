import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { sattariCase } from "../showcase";
import { DeviceVideo, Kicker, LaptopFrame, PhoneFrame, SectionHead } from "../ui";
import { EASE } from "../lib";

// Tabbed tour of everything built for Sattari Music (store, music lab, plugins, AI ad).
// Every tab swaps the live clip and screenshots in place; nothing opens a bare image.
export default function SattariShowcase({ onInquire }: { onInquire: () => void }) {
  const [tab, setTab] = useState(0);
  const [shot, setShot] = useState<number | null>(null);
  const t = sattariCase.tabs[tab];
  return (
    <section id="sattari-suite" aria-label="Everything built for Sattari" className="border-t border-line px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <SectionHead
          kicker="The whole engagement"
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
              onClick={() => {
                setTab(i);
                setShot(null);
              }}
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
                  {shot !== null && t.shots[shot] ? (
                    <img src={t.shots[shot]} alt={`${t.title}: screenshot ${shot + 1}`} className="h-full w-full object-cover object-top" />
                  ) : (
                    <DeviceVideo src={t.video} poster={t.shots[0]} label={`${t.title}, recorded live`} className="h-full w-full object-cover object-top" />
                  )}
                </LaptopFrame>
              </div>
              {t.phone && (
                <div className="absolute -bottom-6 right-0 hidden w-[30%] max-w-[210px] sm:block">
                  <PhoneFrame url="sattarimusic.com">
                    <img src={t.phone} alt="sattarimusic.com on a phone" className="h-full w-full object-cover object-top" />
                  </PhoneFrame>
                </div>
              )}
              <div className={`mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:grid-cols-5 ${t.phone ? "sm:pr-[34%]" : ""}`}>
                <button
                  onClick={() => setShot(null)}
                  aria-pressed={shot === null}
                  className={`flex aspect-[16/10] items-center justify-center rounded-xl border font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${shot === null ? "border-ink bg-ink text-bg" : "border-line text-muted hover:border-ink hover:text-ink"}`}
                >
                  ▶ Video
                </button>
                {t.shots.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setShot(i)}
                    aria-pressed={shot === i}
                    aria-label={`Show screenshot ${i + 1}`}
                    className={`group block overflow-hidden rounded-xl border-2 transition-colors ${shot === i ? "border-ink" : "border-transparent hover:border-line"}`}
                  >
                    <img src={src} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                  </button>
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

