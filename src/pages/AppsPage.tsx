import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { appCatalogue, appCategories } from "../showcase";
import { StatusBadge } from "../ui";
import { EASE, hueFor } from "../lib";
import { STATUS, STATUS_ORDER, appCounts, statusOf, type Status } from "../registry";

function AppTile({ app }: { app: (typeof appCatalogue)[number] }) {
  const linked = app.href !== "#";
  const Tag = linked ? "a" : "div";
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.35, ease: EASE }}>
      <Tag
        {...(linked ? { href: app.href, target: "_blank", rel: "noreferrer" } : {})}
        className="group flex h-full flex-col rounded-[20px] border border-line bg-surface p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-ink/30 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-start justify-between gap-3">
          {app.logo ? (
            <img src={`/app-logos/${app.logo}.svg`} alt="" loading="lazy" className="h-12 w-12 rounded-[14px] transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110" />
          ) : (
            <span
              className="grid h-12 w-12 place-items-center rounded-[14px] text-[15px] font-semibold text-white transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110"
              style={{ background: `linear-gradient(135deg, hsl(${hueFor(app.name)} 70% 52%), hsl(${(hueFor(app.name) + 50) % 360} 75% 40%))` }}
            >
              {app.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2)}
            </span>
          )}
          <StatusBadge id={app.name} />
        </div>
        <h2 className="mt-4 text-[17px] font-semibold tracking-[-0.02em] text-ink">{app.name}</h2>
        <p className="mt-1 text-[13.5px] leading-snug text-muted">{app.line}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint">{app.category} · {app.platforms}</span>
          {linked ? <ArrowUpRight size={14} className="text-faint transition-colors group-hover:text-ink" /> : <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-faint">No public link</span>}
        </div>
      </Tag>
    </motion.div>
  );
}

export default function AppsPage() {
  const [cat, setCat] = useState<(typeof appCategories)[number]>("All");
  const [status, setStatus] = useState<Status | "all">("all");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = appCatalogue.filter(
    (a) => (cat === "All" || a.category === cat) && (status === "all" || statusOf(a.name) === status) && (!q || `${a.name} ${a.line}`.toLowerCase().includes(q))
  );
  const statuses = STATUS_ORDER.filter((s) => appCatalogue.some((a) => statusOf(a.name) === s));
  const chip = (active: boolean) =>
    `inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-[14px] transition-colors ${active ? "border-ink bg-ink text-bg" : "border-line text-muted hover:border-ink/40 hover:text-ink"}`;
  return (
    <section id="apps" className="px-5 pb-20 pt-14 sm:px-8 md:pb-28 md:pt-20">
      <div className="mx-auto max-w-[1320px]">
        <a href="/" className="-my-2 inline-flex items-center gap-1.5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink">← Home</a>
        <div className="flex flex-col gap-6 pb-10 pt-6 md:flex-row md:items-end md:justify-between">
          <h1 className="max-w-[14ch] text-[clamp(2.8rem,7vw,6rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-ink">
            {appCatalogue.length} apps and <span className="font-serif font-normal italic text-accent-ink">counting.</span>
          </h1>
          <p className="max-w-sm text-[15.5px] leading-relaxed text-muted">
            Creative tools, audio, productivity, community and AI, all designed and built by me. {appCounts.live ? `${appCounts.live} live, ` : ""}
            {appCounts.beta} in public beta, {appCounts.prototype} prototypes, {appCounts.development} in development and {appCounts.private} private build. Most run free in your browser.
          </p>
        </div>
        <div className="flex flex-col gap-4 pb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {appCategories.map((c) => {
                const count = c === "All" ? appCatalogue.length : appCatalogue.filter((a) => a.category === c).length;
                return (
                  <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={chip(cat === c)}>
                    {c} <span className={`ml-1 font-mono text-[11px] ${cat === c ? "opacity-60" : "text-faint"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps: stems, font, video…"
              aria-label="Search apps"
              className="min-h-11 w-full rounded-full border border-line bg-surface px-5 py-2.5 text-[14px] text-ink placeholder:text-faint focus:border-ink focus:outline-none md:w-72"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">
            <span className="mr-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">Status</span>
            <button onClick={() => setStatus("all")} aria-pressed={status === "all"} className={chip(status === "all")}>
              Any
            </button>
            {statuses.map((s) => (
              <button key={s} onClick={() => setStatus(s)} aria-pressed={status === s} title={STATUS[s].description} className={chip(status === s)}>
                <span aria-hidden className="mr-2 h-1.5 w-1.5 rounded-full" style={{ background: STATUS[s].dot }} />
                {STATUS[s].label} <span className={`ml-1 font-mono text-[11px] ${status === s ? "opacity-60" : "text-faint"}`}>{appCatalogue.filter((a) => statusOf(a.name) === s).length}</span>
              </button>
            ))}
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {filtered.length} apps shown
        </p>
        <motion.div layout className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((app) => (
              <AppTile key={app.name} app={app} />
            ))}
          </AnimatePresence>
        </motion.div>
        {filtered.length === 0 && <p className="py-10 text-center text-muted">No apps match that. Maybe I should build it?</p>}
        <p className="mt-10 text-center text-[13.5px] text-muted">
          Statuses come from each product&rsquo;s own page: &ldquo;public testing&rdquo; and &ldquo;alpha&rdquo; are listed as Public Beta. Listed on{" "}
          <a href="https://momentous-store.netlify.app/apps" target="_blank" rel="noreferrer" className="text-ink underline decoration-accent decoration-2 underline-offset-4">
            Momentous
          </a>
          , the open app and shop directory I built.
        </p>
      </div>
    </section>
  );
}
