// Contact form fields, options and validation, shared by the form (the server re-validates
// in netlify/functions/contact.mjs; keep the option lists in sync).

export const CATEGORIES = [
  "Website",
  "App or software",
  "Creative technology / 3D",
  "AI or automation",
  "Local AI agent setup",
  "Brand, design or media",
  "Engineering role / hiring",
  "Something else"
] as const;

export const BUDGETS = ["Not sure yet", "Under $5k", "$5k–$15k", "$15k–$50k", "$50k+"] as const;
export const TIMELINES = ["Flexible", "Within a month", "1–3 months", "3+ months"] as const;

export type Fields = { name: string; email: string; category: string; description: string; budget: string; timeline: string };
export type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  else if (f.name.length > 120) e.name = "Please keep your name under 120 characters.";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Please enter a valid email address, like name@company.com.";
  if (!CATEGORIES.includes(f.category as (typeof CATEGORIES)[number])) e.category = "Please choose what the project is about.";
  if (f.description.trim().length < 20) e.description = "Please add a little more detail (at least 20 characters).";
  else if (f.description.length > 5000) e.description = "Please keep the description under 5,000 characters.";
  return e;
}
