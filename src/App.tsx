import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Menu, X, Code2, Mail, ArrowUpRight, Search, CornerDownLeft } from "lucide-react";
import { appCatalogue, toolbox } from "./showcase";
import { caseBySlug, caseStudies } from "./cases";
import { STUDIO_URL, CONTACT_EMAIL, type Project } from "./data/projects";
import { Kicker, ProjectModal } from "./ui";
import { EASE, useFocusTrap } from "./lib";
import Home from "./Home";
import ContactForm from "./ContactForm";

// Everything except the homepage is split into its own chunk.
const ProductRadarPage = lazy(() => import("./ProductRadar"));
const WorkPage = lazy(() => import("./pages/WorkPage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const AppsPage = lazy(() => import("./pages/AppsPage"));
const ToolsPage = lazy(() => import("./pages/ToolsPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const HirePage = lazy(() => import("./pages/HirePage"));

/** Top-level pages the client router renders without a reload. */
const PAGES = ["/work", "/apps", "/tools", "/services", "/hire"];
const isInternal = (href: string) => href === "/" || href.startsWith("/#") || PAGES.some((p) => href === p || href.startsWith(`${p}/`) || href.startsWith(`${p}#`));

type NavItem = { label: string; href: string; key: string };
const navItems: NavItem[] = [
  { label: "Work", href: "/work", key: "work" },
  { label: "Services", href: "/services", key: "services" },
  { label: "Apps", href: "/apps", key: "apps" },
  { label: "About", href: "/#about", key: "about" },
  { label: "For employers", href: "/hire", key: "hire" },
  { label: "Contact", href: "#contact", key: "contact" }
];

// Old single-page anchors, kept working after content moved to dedicated pages.
const legacyHash: Record<string, string> = {
  "#best": "/#work",
  "#reel": "/#reel",
  "#full-apps": "/#evidence",
  "#services": "/services",
  "#agents": "/services#ai-agents",
  "#tools": "/tools",
  "#websites": "/work#websites",
  "#sattari": "/work/sattari",
  "#social": "/work#social",
  "#ai-video": "/work#ai-video",
  "#index": "/work#index",
  "#platforms": "/work#platforms",
  "#studio": "/work#studio",
  "#apps": "/apps"
};

const readRoute = () => {
  if (window.location.hash.startsWith("#/product-radar")) return "product-radar";
  const p = window.location.pathname.replace(/\/+$/, "");
  return p === "" ? "/" : p;
};

const navKeyFor = (route: string, section: string) => {
  if (route.startsWith("/work")) return "work";
  if (route === "/services" || route === "/tools") return "services";
  if (route === "/apps") return "apps";
  if (route === "/hire") return "hire";
  if (route !== "/") return "";
  return ({ work: "work", evidence: "work", reel: "work", expertise: "services", process: "services", about: "about", contact: "contact" } as Record<string, string>)[section] ?? "";
};

type PaletteItem = { label: string; hint: string; group: string; run: () => void };

function CommandPalette({ open, onClose, go, scrollTo }: { open: boolean; onClose: () => void; go: (to: string) => void; scrollTo: (id: string) => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open, onClose);
  const items: PaletteItem[] = [
    { label: "Home", hint: "Page", group: "Go to", run: () => go("/") },
    { label: "Work", hint: "Every case study and project", group: "Go to", run: () => go("/work") },
    { label: "Services", hint: "What I can build for you", group: "Go to", run: () => go("/services") },
    { label: `All ${appCatalogue.length} apps`, hint: "Catalogue with statuses", group: "Go to", run: () => go("/apps") },
    { label: "Free tools", hint: "Converter, Cutout, Captions…", group: "Go to", run: () => go("/tools") },
    { label: "For employers", hint: "Background, repos, case studies", group: "Go to", run: () => go("/hire") },
    { label: "Local AI agents", hint: "Agent setup on your machine", group: "Go to", run: () => go("/services#ai-agents") },
    ...caseStudies.map((c) => ({ label: c.title, hint: c.kind, group: "Case studies", run: () => go(`/work/${c.slug}`) })),
    ...toolbox.map((t) => ({ label: t.name, hint: `Free tool · ${t.job}`, group: "Open a tool", run: () => window.open(t.href, "_blank", "noopener") })),
    ...appCatalogue.filter((a) => a.href !== "#").map((a) => ({ label: a.name, hint: `${a.category} · ${a.platforms}`, group: "Apps", run: () => window.open(a.href, "_blank", "noopener") })),
    { label: "Start a project", hint: "Contact form", group: "Contact", run: () => scrollTo("contact") },
    { label: "Email Armon", hint: CONTACT_EMAIL, group: "Contact", run: () => window.location.assign(`mailto:${CONTACT_EMAIL}`) }
  ];
  const ql = q.trim().toLowerCase();
  const filtered = ql ? items.filter((it) => `${it.label} ${it.hint} ${it.group}`.toLowerCase().includes(ql)) : items.filter((it) => it.group !== "Apps");
  const shown = filtered.slice(0, 40);
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);
  const choose = (it?: PaletteItem) => {
    if (!it) return;
    onClose();
    setQ("");
    setSel(0);
    it.run();
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
            initial={{ y: -16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-[20px] border border-line bg-surface shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <Search size={18} className="text-faint" aria-hidden />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setSel(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSel((n) => Math.min(n + 1, shown.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSel((n) => Math.max(n - 1, 0));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    choose(shown[sel]);
                  }
                }}
                placeholder="Search work, apps, tools…"
                aria-label="Search work, apps and tools"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={shown[sel] ? `palette-${sel}` : undefined}
                style={{ outline: "none", boxShadow: "none" }}
                className="w-full bg-transparent text-[16px] text-ink placeholder:text-faint focus:outline-none focus-visible:outline-none"
              />
              <button onClick={onClose} className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10.5px] text-muted hover:text-ink">
                esc
              </button>
            </div>
            <ul id="palette-list" role="listbox" aria-label="Results" className="max-h-[52vh] overflow-y-auto p-2">
              {shown.length === 0 && <li className="px-4 py-8 text-center text-[14px] text-muted">Nothing found. Maybe I should build it?</li>}
              {shown.map((it, n) => {
                const header = n === 0 || shown[n - 1].group !== it.group ? it.group : null;
                return (
                  <li key={it.group + it.label} role="presentation">
                    {header && (
                      <div role="presentation" className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                        {header}
                      </div>
                    )}
                    <div
                      id={`palette-${n}`}
                      role="option"
                      aria-selected={n === sel}
                      tabIndex={-1}
                      onMouseEnter={() => setSel(n)}
                      onClick={() => choose(it)}
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left ${n === sel ? "bg-ink text-bg" : "text-ink"}`}
                    >
                      <span className="truncate text-[14.5px] font-medium">{it.label}</span>
                      <span className={`flex shrink-0 items-center gap-2 truncate text-[12px] ${n === sel ? "text-bg/70" : "text-muted"}`}>
                        <span className="hidden max-w-[16rem] truncate sm:inline">{it.hint}</span>
                        {n === sel && <CornerDownLeft size={13} aria-hidden />}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Floating "Start a project" pill for phones: appears after the hero, hides once Contact is on screen.
function MobileCTA({ onClick }: { onClick: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const contact = document.getElementById("contact");
        const nearContact = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
        setShow(window.scrollY > 640 && !nearContact);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-[55] flex justify-center px-4 md:hidden"
          style={{ paddingBottom: "max(14px, env(safe-area-inset-bottom))" }}
        >
          <button onClick={onClick} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-bg shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Start a project
            <ArrowUpRight size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NotFound() {
  return (
    <section className="px-5 py-32 text-center sm:px-8">
      <Kicker>404</Kicker>
      <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.5rem)] font-semibold tracking-[-0.04em] text-ink">That page doesn&rsquo;t exist.</h1>
      <p className="mx-auto mt-4 max-w-md text-[16px] text-muted">It may have moved when the site was reorganised. Everything is still here:</p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {[
          ["Home", "/"],
          ["Work", "/work"],
          ["Apps", "/apps"],
          ["Services", "/services"]
        ].map(([l, h]) => (
          <a key={h} href={h} className="inline-flex min-h-11 items-center rounded-full border border-line px-5 py-2.5 text-[14px] text-ink hover:border-ink">
            {l}
          </a>
        ))}
      </div>
    </section>
  );
}

const PageFallback = () => <div className="min-h-[70vh]" aria-busy="true" />;

const titleFor = (route: string) => {
  const base = "Armon Nasiri — Designer & Engineer: Software, Immersive Websites, AI";
  if (route.startsWith("/work/")) {
    const c = caseBySlug(route.slice(6));
    return c ? `${c.title} — Armon Nasiri` : "Not found — Armon Nasiri";
  }
  return (
    {
      "/": base,
      "/work": "Work — Armon Nasiri",
      "/apps": `${appCatalogue.length} apps — Armon Nasiri`,
      "/tools": "Free tools — Armon Nasiri",
      "/services": "Services — Armon Nasiri",
      "/hire": "For engineering teams — Armon Nasiri"
    } as Record<string, string>
  )[route] ?? "Not found — Armon Nasiri";
};

function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [route, setRoute] = useState(() => {
    // Rewrite legacy single-page anchors before the first render.
    const target = window.location.pathname === "/" ? legacyHash[window.location.hash] : undefined;
    if (target) window.history.replaceState(null, "", target);
    return readRoute();
  });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const closeProject = useCallback(() => setOpenProject(null), []);
  const currentPage = route === "product-radar" ? "product-radar" : route === "/" ? "home" : "page";
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const menuRef = useRef<HTMLDivElement>(null);
  useFocusTrap(menuRef, mobileMenuOpen, () => setMobileMenuOpen(false));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Scroll to an element once it exists (pages are lazy, so it may not be rendered yet).
  const scrollToId = useCallback((id: string, smooth = true) => {
    let tries = 0;
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto" });
      else if (tries++ < 40) setTimeout(attempt, 50);
    };
    attempt();
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    if (window.location.hash.length > 1 && !window.location.hash.startsWith("#/")) scrollToId(window.location.hash.slice(1), false);
    const onHash = () => {
      setRoute(readRoute());
      const h = window.location.hash;
      if (legacyHash[h] && window.location.pathname === "/") {
        window.history.replaceState(null, "", legacyHash[h]);
        setRoute(readRoute());
      }
    };
    const onPop = (e: PopStateEvent) => {
      setRoute(readRoute());
      // Restore where the visitor was on that page (saved by go()), once it has rendered
      const y = (e.state as { scrollY?: number } | null)?.scrollY;
      if (typeof y === "number") {
        let tries = 0;
        const restore = () => {
          window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
          if (Math.abs(window.scrollY - y) > 4 && tries++ < 30) requestAnimationFrame(restore);
        };
        requestAnimationFrame(restore);
      }
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onPop);
    };
  }, [scrollToId]);

  const go = useCallback(
    (to: string) => {
      const [path, hash] = to.split("#");
      const targetPath = path || window.location.pathname;
      setMobileMenuOpen(false);
      if (targetPath === window.location.pathname && hash) {
        window.history.replaceState(window.history.state, "", `${targetPath}#${hash}`);
        scrollToId(hash);
        return;
      }
      // Remember the scroll position of the page we're leaving, so Back can return to it
      window.history.replaceState({ ...(window.history.state || {}), scrollY: window.scrollY }, "");
      window.history.pushState({ scrollY: 0 }, "", hash ? `${targetPath}#${hash}` : targetPath);
      setRoute(readRoute());
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      if (hash) scrollToId(hash, false);
    },
    [scrollToId]
  );

  // Internal links navigate without a reload
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank") return;
      const href = a.getAttribute("href") || "";
      if (isInternal(href)) {
        e.preventDefault();
        go(href);
      } else if (href.startsWith("#") && !href.startsWith("#/") && href.length > 1) {
        e.preventDefault();
        go(href);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [go]);

  useEffect(() => {
    document.title = titleFor(route);
  }, [route]);

  // Highlight the nav item for whichever homepage section is crossing the upper third of the viewport
  useEffect(() => {
    if (currentPage !== "home") return;
    const observer = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)), { rootMargin: "-30% 0px -60% 0px" });
    const t = setTimeout(() => {
      ["hero", "work", "evidence", "reel", "expertise", "process", "about", "contact"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 50);
    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, [currentPage]);

  const scrollToSection = useCallback(
    (id: string) => {
      setMobileMenuOpen(false);
      if (id === "contact") {
        // Contact is on every page, so stay where we are
        scrollToId("contact");
        return;
      }
      if (currentPage !== "home") go(`/#${id}`);
      else scrollToId(id);
    },
    [currentPage, go, scrollToId]
  );

  if (currentPage === "product-radar") {
    return (
      <Suspense fallback={<div className="grid min-h-screen place-items-center bg-bg font-mono text-[12px] uppercase tracking-[0.14em] text-muted">Loading Product Radar…</div>}>
        <ProductRadarPage onHome={() => go("/")} />
      </Suspense>
    );
  }

  const activeKey = navKeyFor(route, activeSection);
  const inquire = () => scrollToSection("contact");
  const isCase = route.startsWith("/work/");

  return (
    <MotionConfig reducedMotion="user">
      <div className="grain min-h-screen bg-bg text-ink antialiased">
        <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-bg">
          Skip to content
        </a>
        <motion.div aria-hidden style={{ scaleX: progressScaleX }} className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-accent" />

        {/* ── NAV ──────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
          <nav aria-label="Main" className="mx-auto flex h-14 max-w-[1320px] items-center justify-between rounded-full border border-line bg-bg/75 pl-5 pr-2 backdrop-blur-xl">
            <a href="/" aria-label="Armon Nasiri, home" className="-my-2 flex items-center gap-2.5 py-2 text-[15px] font-semibold tracking-[-0.01em] text-ink">
              <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full bg-ink font-serif text-[15px] italic text-bg">
                a
              </span>
              Armon Nasiri
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    aria-current={activeKey === item.key ? (route === "/" ? "location" : "page") : undefined}
                    className={`inline-flex min-h-10 items-center rounded-full px-3.5 py-1.5 text-[14px] transition-colors ${activeKey === item.key ? "bg-ink/[0.07] text-ink" : "text-muted hover:text-ink"}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <button onClick={() => setPaletteOpen(true)} title="Search (⌘K)" className="hidden items-center gap-1.5 rounded-full border border-line px-3 py-2 text-[12.5px] text-muted transition-colors hover:border-ink hover:text-ink lg:inline-flex">
                <Search size={13} aria-hidden />
                <span className="sr-only">Search</span>
                <kbd className="font-mono text-[11px]">⌘K</kbd>
              </button>
              <button onClick={() => setPaletteOpen(true)} aria-label="Search" className="grid h-11 w-11 place-items-center rounded-full text-ink lg:hidden">
                <Search size={18} />
              </button>
              <a href="#contact" className="hidden min-h-10 items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-bg transition-opacity hover:opacity-85 sm:inline-flex">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                Start a project
                <ArrowUpRight size={14} aria-hidden />
              </a>
              <button
                className="grid h-11 w-11 place-items-center rounded-full text-ink lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                ref={menuRef}
                id="mobile-menu"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mx-auto mt-2 max-w-[1320px] rounded-3xl border border-line bg-surface p-3 lg:hidden"
              >
                <ul>
                  {navItems.map((item) => (
                    <li key={item.key}>
                      <a href={item.href} aria-current={activeKey === item.key ? "page" : undefined} className={`block w-full rounded-2xl px-4 py-3 text-left text-[17px] hover:bg-ink/5 ${activeKey === item.key ? "bg-ink/[0.06] text-ink" : "text-ink"}`}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="mt-1 flex w-full items-center justify-between rounded-2xl bg-ink px-4 py-3 text-[17px] text-bg">
                  Start a project <ArrowUpRight size={18} />
                </a>
                <a href="/tools" className="flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] text-muted">
                  Free tools <ArrowUpRight size={16} />
                </a>
                <a href={STUDIO_URL} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] text-muted">
                  thecreateco <ArrowUpRight size={16} />
                </a>
                <a href="#/product-radar" className="flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] text-muted">
                  Product Radar <ArrowUpRight size={16} />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main id="main" tabIndex={-1} className="relative outline-none">
          {currentPage === "home" ? (
            <Home scrollTo={scrollToSection} />
          ) : (
            <Suspense fallback={<PageFallback />}>
              {route === "/work" ? (
                <WorkPage setOpenProject={setOpenProject} onInquire={inquire} />
              ) : isCase ? (
                <ProjectPage key={route} slug={route.slice(6)} onInquire={inquire} />
              ) : route === "/apps" ? (
                <AppsPage />
              ) : route === "/tools" ? (
                <ToolsPage />
              ) : route === "/services" ? (
                <ServicesPage onInquire={inquire} setOpenProject={setOpenProject} />
              ) : route === "/hire" ? (
                <HirePage onContact={inquire} />
              ) : (
                <NotFound />
              )}
            </Suspense>
          )}

          {/* ── CONTACT (every page) ───────────────────────── */}
          <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 px-3 pb-6 sm:px-6">
            <div className="mx-auto max-w-[1360px] rounded-[32px] border border-line bg-surface px-6 py-20 sm:px-10 md:py-28 lg:px-14">
              <Kicker>
                {currentPage === "home" && (
                  <>
                    <span className="text-accent-ink">06</span>
                    <span className="mx-2 text-line">/</span>
                  </>
                )}
                Contact
              </Kicker>
              <h2 id="contact-title" className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-ink">
                Let&rsquo;s build
                <br />
                <span className="font-serif font-normal italic text-accent-ink">your thing.</span>
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:items-end">
                <p className="max-w-xl text-[17px] leading-relaxed text-muted">
                  Taking on design, development, AI media and agent-setup projects for founders, brands, creators and small teams. Tell me what you&rsquo;re making, and I&rsquo;ll
                  reply with next steps, usually within a day.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-line px-7 py-4 text-[15px] font-medium text-ink transition-colors hover:border-ink">
                    <Mail size={16} /> {CONTACT_EMAIL}
                  </a>
                  <a href="https://github.com/armonon" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-line px-7 py-4 text-[15px] font-medium text-ink transition-colors hover:border-ink">
                    <Code2 size={16} /> GitHub
                  </a>
                </div>
              </div>
              <ContactForm />
            </div>
          </section>
        </main>

        {/* ── FOOTER ───────────────────────────────────────── */}
        <footer className="px-5 py-10 sm:px-8">
          <div className="mx-auto max-w-[1320px]">
            <figure className="mx-auto mb-10 w-full max-w-[11rem] sm:max-w-[18rem]">
              <div className="overflow-hidden rounded-[28px] border border-line bg-surface p-2.5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)]">
                <img src="/photos/armon-portrait.jpg" alt="Armon Nasiri" width={640} height={853} loading="lazy" decoding="async" className="aspect-[4/5] w-full rounded-[20px] object-cover object-[50%_35%]" />
                <figcaption className="flex items-center justify-between px-2 pb-1 pt-3">
                  <span className="whitespace-nowrap text-[13px] font-medium text-ink sm:text-[14px]">Armon Nasiri</span>
                  <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-accent opacity-80" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#5f9a00]" />
                    </span>
                    Available
                  </span>
                </figcaption>
              </div>
            </figure>

            <nav aria-label="Footer" className="mb-6 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[14px] text-muted">
              {[
                ["Work", "/work"],
                ["Services", "/services"],
                ["Apps", "/apps"],
                ["Free tools", "/tools"],
                ["For employers", "/hire"],
                ["Product Radar", "#/product-radar"]
              ].map(([l, h]) => (
                <a key={h} href={h} className="inline-block py-2 hover:text-ink">
                  {l}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-4 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
              <span>
                <span className="text-ink">Armon Nasiri</span> — Designer &amp; engineer · founder of{" "}
                <a href={STUDIO_URL} target="_blank" rel="noreferrer" className="text-ink hover:underline">
                  thecreateco
                </a>
              </span>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                <a href={STUDIO_URL} target="_blank" rel="noreferrer" className="inline-block py-2 hover:text-ink">
                  thecreatingco.com
                </a>
                <a href="https://github.com/armonon" target="_blank" rel="noreferrer" className="inline-block py-2 hover:text-ink">
                  GitHub
                </a>
                <span>© 2026</span>
              </div>
            </div>
          </div>
        </footer>

        <AnimatePresence>{openProject && <ProjectModal project={openProject} onClose={closeProject} />}</AnimatePresence>
        <MobileCTA onClick={inquire} />
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} go={go} scrollTo={scrollToSection} />
      </div>
    </MotionConfig>
  );
}

export default App;
