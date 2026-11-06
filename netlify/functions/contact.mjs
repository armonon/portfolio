// POST /api/contact — project inquiry handler.
//
// 1. Accepts JSON only, up to 20 KB.
// 2. Validates every field again on the server (the browser checks are only a convenience).
// 3. Drops obvious spam: a filled honeypot field, forms submitted faster than a person can
//    type, link-stuffed messages, and more than 5 submissions per IP in 10 minutes.
// 4. Stores the inquiry in Netlify Forms (form "contact", declared in index.html) by posting
//    it to this same deploy. Netlify Forms keeps the submission and sends the email
//    notification configured in the Netlify UI, so no API key lives in this code.
// 5. Only reports success when Netlify Forms accepted the submission; otherwise the
//    visitor sees an error with a direct-email fallback.
//
// No secrets are read here.

export const CATEGORIES = [
  "Website",
  "App or software",
  "Creative technology / 3D",
  "AI or automation",
  "Local AI agent setup",
  "Brand, design or media",
  "Engineering role / hiring",
  "Something else",
];
const BUDGETS = ["", "Not sure yet", "Under $5k", "$5k–$15k", "$15k–$50k", "$50k+"];
const TIMELINES = ["", "Flexible", "Within a month", "1–3 months", "3+ months"];

const MAX_BODY = 20_000;
const MIN_ELAPSED_MS = 2500;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Best-effort, per-instance rate limit (function instances are short-lived; Netlify Forms
// adds its own spam filtering on top).
const hits = new Map();

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const clean = (v, max) => (typeof v === "string" ? v.replace(/\u0000/g, "").trim().slice(0, max) : "");

export function validate(input) {
  const f = {
    name: clean(input.name, 120),
    email: clean(input.email, 254),
    category: clean(input.category, 60),
    description: clean(input.description, 5000),
    budget: clean(input.budget, 40),
    timeline: clean(input.timeline, 40),
  };
  const fields = {};
  if (f.name.length < 2) fields.name = "Please enter your name.";
  if (!EMAIL_RE.test(f.email)) fields.email = "Please enter a valid email address, like name@company.com.";
  if (!CATEGORIES.includes(f.category)) fields.category = "Please choose what the project is about.";
  if (f.description.length < 20) fields.description = "Please add a little more detail (at least 20 characters).";
  if (!BUDGETS.includes(f.budget)) fields.budget = "Please choose a budget from the list.";
  if (!TIMELINES.includes(f.timeline)) fields.timeline = "Please choose a timeline from the list.";
  return { f, fields };
}

export function looksLikeSpam(input) {
  if (typeof input.company_website === "string" && input.company_website.trim() !== "") return "honeypot";
  if (typeof input.elapsed === "number" && input.elapsed < MIN_ELAPSED_MS) return "too-fast";
  const links = (String(input.description || "").match(/https?:\/\//gi) || []).length;
  if (links > 4) return "links";
  return null;
}

export function rateLimited(ip, now = Date.now()) {
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

export default async (req, context) => {
  if (req.method !== "POST") return json(405, { ok: false, error: "Use POST." });
  if (!(req.headers.get("content-type") || "").includes("application/json")) return json(415, { ok: false, error: "Send JSON." });

  const raw = await req.text();
  if (raw.length > MAX_BODY) return json(413, { ok: false, error: "That message is too long. Please shorten it, or email me directly." });

  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: "The form data couldn't be read. Please try again." });
  }
  if (!input || typeof input !== "object") return json(400, { ok: false, error: "The form data couldn't be read. Please try again." });

  const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || "unknown";
  if (rateLimited(ip)) return json(429, { ok: false, error: "Too many messages in a short time. Please wait a few minutes, or email me directly." });

  const { f, fields } = validate(input);
  if (Object.keys(fields).length) return json(422, { ok: false, error: "Please fix the highlighted fields.", fields });

  // Spam is acknowledged as if it succeeded, so bots get no signal, but is never stored.
  const spam = looksLikeSpam(input);
  if (spam) return json(200, { ok: true });

  const origin = new URL(req.url).origin;
  const body = new URLSearchParams({ "form-name": "contact", ...f, "bot-field": "" });
  let stored;
  try {
    stored = await fetch(`${origin}/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      redirect: "manual",
    });
  } catch {
    return json(502, { ok: false, error: "Your message couldn't be delivered right now." });
  }
  // Netlify Forms answers 200 (or a 303 redirect to a success page) when it accepts a submission.
  if (stored.status !== 200 && stored.status !== 303) {
    return json(502, { ok: false, error: "Your message couldn't be delivered right now." });
  }
  return json(200, { ok: true });
};

export const config = { path: "/api/contact" };
