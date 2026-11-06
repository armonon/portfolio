import { ArrowUpRight, Check, Code, Download, Mail } from "lucide-react";
import { CONTACT_EMAIL, capabilities, experience, skills } from "../data/projects";
import { caseDetails } from "../caseDetails";
import { caseBySlug } from "../cases";
import { Kicker, StatusBadge } from "../ui";

// For hiring managers and engineering teams: background, specialties, the engineering
// case studies and public repositories. Only verified public repos are listed.

const engineeringCases = ["luma-studio", "form-studio", "sattari", "scenepilot", "breakthyrule-eden", "universal-computer-operator"];

const repos: { name: string; what: string; stack: string }[] = [
  { name: "luma-studio", what: "Local-first nondestructive image editor, web and Tauri desktop", stack: "TypeScript · Rust · ONNX" },
  { name: "sattari-custom-site", what: "Production music store with Stripe checkout and serverless back-end", stack: "React · Netlify Functions · Stripe" },
  { name: "scenepilot-studio", what: "Beat-aware music video editor with in-browser MP4 rendering", stack: "Next.js · Electron · Mediabunny" },
  { name: "breakthyrule-eden-showroom", what: "Explorable three.js brand world with an AI guide", stack: "three.js · Blender · glTF" },
  { name: "librarian", what: "Research and reading app that installs as a PWA", stack: "TypeScript · PWA" },
  { name: "mk-ultra", what: "Entropy, a VST3/AU audio plugin (working build)", stack: "C++ · JUCE" },
  { name: "sweet-suite", what: "Shared Rust core for a visual, video and audio suite (early)", stack: "Rust" },
  { name: "photoboothstudio", what: "Artwork-on-garment mockup studio", stack: "Web · macOS" }
];

const practice = [
  { name: "cats-dogs-image-classifier", what: "Image classification" },
  { name: "california-housing-kmeans", what: "K-means clustering" },
  { name: "welovereviews-sentiment-analysis", what: "Sentiment analysis" },
  { name: "streamloop-churn-model-tuning", what: "Churn model tuning" }
];

export default function HirePage({ onContact }: { onContact: () => void }) {
  return (
    <>
      <section className="px-5 pb-12 pt-14 sm:px-8 md:pt-20">
        <div className="mx-auto max-w-[1320px]">
          <a href="/" className="-my-2 inline-flex items-center gap-1.5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink">← Home</a>
          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <Kicker className="text-accent-ink">For engineering teams</Kicker>
              <h1 className="mt-4 max-w-[16ch] text-[clamp(2.6rem,6.5vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-ink">
                A product engineer who <span className="font-serif font-normal italic text-accent-ink">ships</span> the whole thing.
              </h1>
            </div>
            <div>
              <p className="text-[16.5px] leading-relaxed text-muted">
                I&rsquo;m Armon Nasiri, a designer and engineer in Los Angeles. I take products from interface to
                engine to deployment: TypeScript and React front-ends, Rust and C++ where performance matters, serverless
                back-ends, and on-device AI.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="https://github.com/armonon" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14.5px] font-medium text-bg transition-opacity hover:opacity-85">
                  <Code size={16} /> GitHub
                </a>
                <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Engineering role")}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-6 py-3 text-[14.5px] font-medium text-ink transition-colors hover:border-ink">
                  <Mail size={16} /> {CONTACT_EMAIL}
                </a>
                {__HAS_RESUME__ && (
                  <a href="/resume.pdf" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-6 py-3 text-[14.5px] font-medium text-ink transition-colors hover:border-ink">
                    <Download size={16} /> Résumé (PDF)
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="hire-specialties" className="border-t border-line px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-[1320px]">
          <Kicker className="text-accent-ink">Specialties</Kicker>
          <h2 id="hire-specialties" className="mt-3 text-[clamp(1.9rem,3.5vw,2.8rem)] font-semibold tracking-[-0.035em] text-ink">
            Where I&rsquo;m strongest.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => (
              <div key={c.title} className="bg-surface p-6">
                <Kicker>{c.kicker}</Kicker>
                <h3 className="mt-3 text-[18px] font-semibold tracking-[-0.02em] text-ink">{c.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{c.body}</p>
              </div>
            ))}
          </div>
          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Languages and tools">
            {skills.slice(8).map((s) => (
              <li key={s} className="rounded-full border border-line px-3 py-1.5 font-mono text-[12px] text-ink/80">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="hire-cases" className="border-t border-line px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-[1320px]">
          <Kicker className="text-accent-ink">Engineering case studies</Kicker>
          <h2 id="hire-cases" className="mt-3 text-[clamp(1.9rem,3.5vw,2.8rem)] font-semibold tracking-[-0.035em] text-ink">
            Decisions, trade-offs and tests.
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
            {engineeringCases.map((slug) => {
              const c = caseBySlug(slug);
              const d = caseDetails[slug];
              if (!c || !d) return null;
              return (
                <li key={slug}>
                  <a href={`/work/${slug}`} className="group flex h-full flex-col rounded-[22px] border border-line bg-surface p-6 transition-colors hover:border-ink/40">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">{c.title}</h3>
                      <StatusBadge id={slug} />
                    </div>
                    <ul className="mt-4 space-y-2">
                      {d.decisions.slice(0, 2).map((x) => (
                        <li key={x.title} className="flex items-start gap-2 text-[14.5px] leading-relaxed text-muted">
                          <Check size={15} className="mt-1 shrink-0 text-accent-ink" />
                          <span>
                            <span className="font-medium text-ink">{x.title}.</span> {x.body}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{d.tech.slice(0, 5).join(" · ")}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[14px] font-medium text-ink">
                      Read the case study <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="hire-repos" className="border-t border-line px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <div>
            <Kicker className="text-accent-ink">Public repositories</Kicker>
            <h2 id="hire-repos" className="mt-3 text-[clamp(1.9rem,3.5vw,2.8rem)] font-semibold tracking-[-0.035em] text-ink">
              Read the code.
            </h2>
            <ul className="mt-8 border-t border-line">
              {repos.map((r) => (
                <li key={r.name} className="border-b border-line">
                  <a href={`https://github.com/armonon/${r.name}`} target="_blank" rel="noreferrer" className="group grid grid-cols-1 gap-1 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                    <span>
                      <span className="font-mono text-[14px] text-ink group-hover:underline">armonon/{r.name}</span>
                      <span className="mt-1 block text-[14px] text-muted">{r.what}</span>
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{r.stack}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13.5px] text-muted">Form Studio and the agent behind Universal Computer Operator are private repositories.</p>
          </div>
          <div>
            <Kicker className="text-accent-ink">Applied AI &amp; data practice</Kicker>
            <ul className="mt-5 border-t border-line">
              {practice.map((r) => (
                <li key={r.name} className="border-b border-line">
                  <a href={`https://github.com/armonon/${r.name}`} target="_blank" rel="noreferrer" className="block py-3 hover:underline">
                    <span className="block text-[15px] text-ink">{r.what}</span>
                    <span className="font-mono text-[11.5px] text-muted">armonon/{r.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="hire-exp" className="border-t border-line px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-[1320px]">
          <Kicker className="text-accent-ink">Experience</Kicker>
          <h2 id="hire-exp" className="sr-only">
            Experience
          </h2>
          <div className="mt-4 border-t border-line">
            {experience.map((item) => (
              <div key={item.role + item.org} className="grid grid-cols-1 gap-2 border-b border-line py-6 md:grid-cols-[0.8fr_1.2fr] md:gap-10">
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink">{item.role}</h3>
                  <p className="mt-1 font-serif text-lg italic text-muted">{item.org}</p>
                </div>
                <p className="text-[15px] leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-[22px] border border-line bg-surface p-7 md:flex-row md:items-center">
            <p className="max-w-xl text-[16.5px] leading-relaxed text-ink">Hiring for a role, or want a technical conversation about any of these projects?</p>
            <button onClick={onContact} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14.5px] font-medium text-bg transition-opacity hover:opacity-85">
              Get in touch <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
