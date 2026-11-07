import { ArrowUpRight, Check, Bot } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { agentOffer, engagementTypes, families, process, services } from "../services";
import { projects } from "../data/projects";
import type { Project } from "../data/projects";
import { Kicker, StatusBadge } from "../ui";
import { EASE } from "../lib";

function AgentsSection({ onInquire }: { onInquire: () => void }) {
  return (
    <section id="ai-agents" className="scroll-mt-20 px-3 py-10 sm:px-6 md:py-16">
      <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[32px] bg-band text-band-fg">
        <div className="grid grid-cols-1 gap-12 px-6 py-12 sm:px-10 md:py-16 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:px-14">
          <div>
            <Kicker className="text-band-muted">Local AI agents</Kicker>
            <div className="mt-6 grid h-12 w-12 place-items-center rounded-2xl bg-accent text-[#111110]">
              <Bot size={24} />
            </div>
            <h2 className="mt-6 max-w-[16ch] text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              {agentOffer.title}
            </h2>
            <p className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-band-muted">{agentOffer.line}</p>
            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {agentOffer.includes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14.5px] text-band-fg/90">
                  <Check size={15} className="mt-0.5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <button onClick={onInquire} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-[#111110] transition-transform hover:-translate-y-0.5">
                Book an agent setup <ArrowUpRight size={16} />
              </button>
              <a href={`/work/${agentOffer.proof}`} className="inline-flex items-center gap-2 rounded-full border border-band-line px-6 py-3 text-[15px] font-medium text-band-fg transition-colors hover:border-band-fg/50">
                See my agent: Universal Computer Operator
                <StatusBadge id={agentOffer.proof} tone="band" />
              </a>
            </div>
          </div>

          <ol className="self-center border-t border-band-line">
            {agentOffer.steps.map((step) => (
              <li key={step.k} className="grid grid-cols-[3rem_1fr] gap-2 border-b border-band-line py-5">
                <span className="font-mono text-[12px] leading-7 text-accent">{step.k}</span>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">{step.title}</h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-band-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ServicesList({ onOpenProject, onInquire }: { onOpenProject: (id: string) => void; onInquire: () => void }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section id="services-list" className="scroll-mt-20 border-t border-line px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Kicker>Services</Kicker>
          <h2 className="mt-5 max-w-[14ch] text-[clamp(2.1rem,4vw,3.3rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink">
            Everything you&rsquo;ve seen, <span className="font-serif font-normal italic">for hire.</span>
          </h2>
          <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-muted">
            One point of contact for design, development, media and AI. No hand-offs between agencies. Not on the list? If it&rsquo;s digital, ask.
          </p>
          <button onClick={onInquire} className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14.5px] font-medium text-bg transition-opacity hover:opacity-85">
            Tell me what you need <ArrowUpRight size={15} />
          </button>
        </div>

        <ul className="border-t border-line">
          {services.map((service, i) => {
            const isOpen = open === service.id;
            return (
              <li key={service.id} className="border-b border-line">
                <button
                  onClick={() => setOpen(isOpen ? null : service.id)}
                  aria-expanded={isOpen}
                  aria-controls={`svc-${service.id}`}
                  className="group grid min-h-14 w-full grid-cols-[2.25rem_1fr_auto] items-center gap-3 py-5 text-left md:grid-cols-[2.5rem_minmax(0,0.9fr)_minmax(0,1.3fr)_auto] md:gap-6"
                >
                  <span className="font-mono text-[11px] text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[17px] font-semibold tracking-[-0.015em] text-ink md:text-[19px]">{service.title}</span>
                  <span className="hidden truncate text-[14px] text-muted md:block">{service.deliverables.join(" · ")}</span>
                  <span className={`grid h-8 w-8 place-items-center rounded-full border transition-all duration-300 ${isOpen ? "rotate-45 border-ink bg-ink text-bg" : "border-line text-ink group-hover:border-ink"}`}>
                    <span className="text-[18px] leading-none">+</span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      id={`svc-${service.id}`}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-5 pb-6 pl-[2.25rem] md:grid-cols-[1.2fr_1fr] md:pl-[3.1rem]">
                        <div>
                          <p className="text-[15px] leading-relaxed text-muted">{service.line}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {service.deliverables.map((d) => (
                              <span key={d} className="rounded-full bg-ink/[0.05] px-3 py-1 text-[12.5px] text-ink/80">
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Kicker>See it in</Kicker>
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {service.proof.map((id) => {
                              const project = projects.find((pr) => pr.id === id);
                              if (!project) return null;
                              return (
                                <button
                                  key={id}
                                  onClick={() => onOpenProject(id)}
                                  className="rounded-full border border-line px-3 py-1 text-[12.5px] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg"
                                >
                                  {project.title}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}


export default function ServicesPage({ onInquire, setOpenProject }: { onInquire: () => void; setOpenProject: (p: Project) => void }) {
  const openById = (id: string) => {
    const p = projects.find((x) => x.id === id);
    if (p) setOpenProject(p);
  };
  return (
    <>
      <section className="px-5 pb-12 pt-14 sm:px-8 md:pt-20">
        <div className="mx-auto max-w-[1320px]">
          <a href="/" className="-my-2 inline-flex items-center gap-1.5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink">← Home</a>
          <h1 className="mt-6 max-w-[15ch] text-[clamp(2.8rem,7vw,6rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-ink">
            What I can <span className="font-serif font-normal italic text-accent-ink">build</span> for you.
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
            One point of contact for design, engineering, media and AI. Pick an area below, or describe the problem and I&rsquo;ll suggest the shortest path to a working launch.
          </p>
          <div className="rail mt-12 grid grid-cols-1 gap-3 md:grid-cols-3">
            {families.map((f) => (
              <article key={f.id} id={f.id} className="scroll-mt-20 rounded-[22px] border border-line bg-surface p-7">
                <Kicker className="text-accent-ink">{f.kicker}</Kicker>
                <h2 className="mt-4 text-[1.6rem] font-semibold leading-tight tracking-[-0.025em] text-ink">{f.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.line}</p>
                <ul className="mt-5 space-y-2">
                  {f.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-[14px] text-ink/85">
                      <Check size={15} className="mt-0.5 shrink-0 text-accent-ink" />
                      {it}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-5">
                  {f.proof.map((pr) => (
                    <a key={pr.href} href={pr.href} className="inline-flex min-h-9 items-center rounded-full border border-line px-3 py-1.5 text-[12.5px] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg">
                      {pr.label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ServicesList onOpenProject={openById} onInquire={onInquire} />
      <AgentsSection onInquire={onInquire} />
      <section id="how-it-works" className="scroll-mt-20 px-5 py-20 sm:px-8 md:py-24">
        <div className="mx-auto max-w-[1320px]">
          <Kicker>How an engagement runs</Kicker>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-line bg-line md:grid-cols-4">
            {process.map((step) => (
              <div key={step.k} className="bg-surface p-7">
                <span className="font-mono text-[12px] text-accent-ink">{step.k}</span>
                <h2 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-ink">{step.title}</h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="rail mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {engagementTypes.map((type) => (
              <div key={type.title} className="rounded-[20px] border border-line p-6">
                <Kicker className="text-accent-ink">Engagement</Kicker>
                <h2 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-ink">{type.title}</h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{type.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
