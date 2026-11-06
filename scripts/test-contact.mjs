// Tests for netlify/functions/contact.mjs. Network is mocked: nothing is ever sent.
// Run: node scripts/test-contact.mjs
import assert from "node:assert/strict";
import handler from "../netlify/functions/contact.mjs";

const sent = [];
let formsStatus = 200;
globalThis.fetch = async (url, init) => {
  sent.push({ url, body: init.body });
  return new Response("", { status: formsStatus });
};

let n = 0;
const call = async (body, { ip = `10.0.0.${++n}`, method = "POST", type = "application/json", raw } = {}) => {
  const req = new Request("https://example.test/api/contact", { method, headers: { "content-type": type }, body: method === "GET" ? undefined : raw ?? JSON.stringify(body) });
  const res = await handler(req, { ip });
  return { status: res.status, json: await res.json() };
};
const good = { name: "Test Person", email: "test@example.com", category: "Website", description: "A test description that is long enough.", budget: "", timeline: "Flexible", company_website: "", elapsed: 9000 };

const tests = {
  "rejects GET": async () => assert.equal((await call(null, { method: "GET" })).status, 405),
  "rejects non-JSON": async () => assert.equal((await call(null, { type: "text/plain", raw: "x" })).status, 415),
  "rejects malformed JSON": async () => assert.equal((await call(null, { raw: "{nope" })).status, 400),
  "rejects oversized body": async () => assert.equal((await call({ ...good, description: "x".repeat(25000) })).status, 413),
  "validates every field": async () => {
    const r = await call({ name: "", email: "bad", category: "Nope", description: "short", budget: "a lot", timeline: "?" });
    assert.equal(r.status, 422);
    assert.deepEqual(Object.keys(r.json.fields).sort(), ["budget", "category", "description", "email", "name", "timeline"]);
  },
  "stores a valid inquiry in Netlify Forms": async () => {
    sent.length = 0;
    const r = await call(good);
    assert.equal(r.status, 200);
    assert.equal(r.json.ok, true);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].url, "https://example.test/");
    const p = new URLSearchParams(sent[0].body);
    assert.equal(p.get("form-name"), "contact");
    assert.equal(p.get("email"), "test@example.com");
    assert.equal(p.get("company_website"), null, "honeypot value is not forwarded");
  },
  "honeypot: pretends success, stores nothing": async () => {
    sent.length = 0;
    const r = await call({ ...good, company_website: "http://spam" });
    assert.equal(r.status, 200);
    assert.equal(sent.length, 0);
  },
  "too-fast submission is dropped": async () => {
    sent.length = 0;
    await call({ ...good, elapsed: 300 });
    assert.equal(sent.length, 0);
  },
  "link-stuffed message is dropped": async () => {
    sent.length = 0;
    await call({ ...good, description: "buy http://a http://b http://c http://d http://e now" });
    assert.equal(sent.length, 0);
  },
  "reports failure when Netlify Forms does not accept": async () => {
    formsStatus = 404;
    const r = await call(good);
    formsStatus = 200;
    assert.equal(r.status, 502);
    assert.equal(r.json.ok, false);
  },
  "rate-limits repeat senders": async () => {
    let last;
    for (let i = 0; i < 6; i++) last = await call(good, { ip: "192.0.2.1" });
    assert.equal(last.status, 429);
  }
};

let failed = 0;
for (const [name, fn] of Object.entries(tests)) {
  try {
    await fn();
    console.log("✓", name);
  } catch (e) {
    failed++;
    console.log("✗", name, "—", e.message);
  }
}
console.log(`${Object.keys(tests).length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
