import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Loader2, Mail } from "lucide-react";
import { CONTACT_EMAIL } from "./data/projects";
import { Kicker } from "./ui";
import { BUDGETS, CATEGORIES, TIMELINES, validate, type Errors, type Fields } from "./contact";

// Project inquiry form. Submits to /api/contact (netlify/functions/contact.mjs), which
// validates again on the server, filters spam and stores the inquiry in Netlify Forms.
// Direct email stays available as a fallback at every step.

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; name: string } | { kind: "error"; message: string };

const empty: Fields = { name: "", email: "", category: "", description: "", budget: "", timeline: "" };

export default function ContactForm() {
  const uid = useId();
  const [f, setF] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<State>({ kind: "idle" });
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const id = (k: string) => `${uid}-${k}`;

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setF((cur) => ({ ...cur, [k]: e.target.value }));
    if (errors[k]) setErrors((cur) => ({ ...cur, [k]: undefined }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state.kind === "sending") return;
    const errs = validate(f);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`)?.focus();
      return;
    }
    setState({ kind: "sending" });
    const honeypot = (formRef.current?.elements.namedItem("company_website") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...f, company_website: honeypot, elapsed: Date.now() - startedAt.current })
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Errors };
      if (res.ok && data.ok) {
        setState({ kind: "sent", name: f.name.trim().split(/\s+/)[0] });
        setF(empty);
        setTimeout(() => statusRef.current?.focus(), 30);
        return;
      }
      if (data.fields) setErrors(data.fields);
      setState({ kind: "error", message: data.error || "Something went wrong sending your message." });
    } catch {
      setState({ kind: "error", message: "Your message couldn't be sent. Check your connection and try again." });
    }
    setTimeout(() => statusRef.current?.focus(), 30);
  };

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Project inquiry${f.category ? ` — ${f.category}` : ""}`)}&body=${encodeURIComponent(
    `Hi Armon,\n\n${f.description || "A bit about the project:"}\n\nBudget: ${f.budget || "-"}\nTimeline: ${f.timeline || "-"}\n\n${f.name}`
  )}`;

  if (state.kind === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="mt-12 rounded-[24px] border border-line bg-bg p-8 outline-none md:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-[#111110]">
          <Check size={22} />
        </span>
        <h3 className="mt-5 text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-[-0.03em] text-ink">Thanks, {state.name}. Your message is in.</h3>
        <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-muted">
          I&rsquo;ll reply to the email address you gave. If it&rsquo;s urgent, you can also write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink underline decoration-accent decoration-2 underline-offset-4">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <button onClick={() => setState({ kind: "idle" })} className="mt-6 inline-flex min-h-11 items-center rounded-full border border-line px-5 py-2.5 text-[14px] font-medium text-ink hover:border-ink">
          Send another message
        </button>
      </div>
    );
  }

  const input = (k: keyof Fields) =>
    `mt-2 block min-h-12 w-full rounded-2xl border bg-surface px-4 py-3 text-[16px] text-ink placeholder:text-faint focus:border-ink focus:outline-none ${errors[k] ? "border-[#b3261e]" : "border-line"}`;
  const label = "block text-[14px] font-medium text-ink";
  const err = (k: keyof Fields) =>
    errors[k] ? (
      <p id={id(`${k}-err`)} className="mt-1.5 text-[13.5px] text-[#b3261e]">
        {errors[k]}
      </p>
    ) : null;
  const describedBy = (k: keyof Fields, hint?: boolean) => [errors[k] ? id(`${k}-err`) : "", hint ? id(`${k}-hint`) : ""].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-labelledby={id("title")} className="mt-12 rounded-[24px] border border-line bg-bg p-6 md:p-8">
      <h3 id={id("title")} className="sr-only">
        Project inquiry form
      </h3>
      <Kicker>Tell me about the project</Kicker>
      <p className="mt-2 text-[13.5px] text-muted">Fields marked * are required.</p>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor={id("name")} className={label}>
            Name *
          </label>
          <input id={id("name")} name="name" autoComplete="name" required value={f.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} className={input("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor={id("email")} className={label}>
            Email *
          </label>
          <input id={id("email")} name="email" type="email" inputMode="email" autoComplete="email" required value={f.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={describedBy("email")} className={input("email")} />
          {err("email")}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor={id("category")} className={label}>
          What is it about? *
        </label>
        <select id={id("category")} name="category" required value={f.category} onChange={set("category")} aria-invalid={!!errors.category} aria-describedby={describedBy("category")} className={input("category")}>
          <option value="" disabled>
            Choose one…
          </option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        {err("category")}
      </div>

      <div className="mt-5">
        <label htmlFor={id("description")} className={label}>
          Project description *
        </label>
        <p id={id("description-hint")} className="mt-1 text-[13px] text-muted">
          What you want to build, who it&rsquo;s for, and anything already in place.
        </p>
        <textarea
          id={id("description")}
          name="description"
          required
          rows={5}
          maxLength={5000}
          value={f.description}
          onChange={set("description")}
          aria-invalid={!!errors.description}
          aria-describedby={describedBy("description", true)}
          placeholder="e.g. A new site and launch video for our product, live by March."
          className={`${input("description")} resize-y`}
        />
        {err("description")}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor={id("budget")} className={label}>
            Budget <span className="font-normal text-muted">(optional)</span>
          </label>
          <select id={id("budget")} name="budget" value={f.budget} onChange={set("budget")} className={input("budget")}>
            <option value="">Prefer not to say</option>
            {BUDGETS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={id("timeline")} className={label}>
            Timeline <span className="font-normal text-muted">(optional)</span>
          </label>
          <select id={id("timeline")} name="timeline" value={f.timeline} onChange={set("timeline")} className={input("timeline")}>
            <option value="">Not decided</option>
            {TIMELINES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots that fill it are dropped server-side. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("hp")}>Company website</label>
        <input id={id("hp")} name="company_website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="assertive" className="outline-none">
        {state.kind === "error" && (
          <div role="alert" className="mt-6 rounded-2xl border border-[#b3261e]/40 bg-[#b3261e]/[0.06] p-4 text-[14.5px] text-ink">
            <p className="font-medium">{state.message}</p>
            <p className="mt-1 text-muted">
              Nothing was lost: your text is still in the form. You can try again, or{" "}
              <a href={mailto} className="text-ink underline decoration-accent decoration-2 underline-offset-4">
                send it by email instead
              </a>
              .
            </p>
          </div>
        )}
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="submit"
          disabled={state.kind === "sending"}
          aria-disabled={state.kind === "sending"}
          className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-bg transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-70"
        >
          {state.kind === "sending" ? (
            <>
              <Loader2 size={16} className="animate-spin motion-reduce:animate-none" /> Sending…
            </>
          ) : (
            <>
              Send inquiry <ArrowUpRight size={16} />
            </>
          )}
        </button>
        <a href={mailto} className="inline-flex min-h-11 items-center gap-2 text-[14px] text-muted underline-offset-4 hover:text-ink hover:underline">
          <Mail size={15} /> Prefer email? {CONTACT_EMAIL}
        </a>
      </div>
    </form>
  );
}
