const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { message: "Use POST to request a Product Radar sweep." });
  }

  const adminToken = process.env.PRODUCT_SWEEP_ADMIN_TOKEN;
  const webhookUrl = process.env.PRODUCT_SWEEP_WEBHOOK_URL;
  const webhookToken = process.env.PRODUCT_SWEEP_WEBHOOK_TOKEN;
  const providedToken = event.headers["x-product-sweep-token"] || event.headers["X-Product-Sweep-Token"];

  if (!adminToken) {
    return json(423, {
      message: "Sweep trigger is locked: PRODUCT_SWEEP_ADMIN_TOKEN is not configured in Netlify.",
    });
  }

  if (providedToken !== adminToken) {
    return json(401, { message: "Sweep request denied. Invalid Product Radar admin token." });
  }

  if (!webhookUrl) {
    return json(503, {
      message: "Sweep trigger is authorized, but PRODUCT_SWEEP_WEBHOOK_URL is not configured yet.",
    });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { message: "Sweep payload was not valid JSON." });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(webhookToken ? { Authorization: `Bearer ${webhookToken}` } : {}),
      },
      body: JSON.stringify({
        ...payload,
        acceptedAt: new Date().toISOString(),
        guardrails: [
          "safe internal work only",
          "verify before push",
          "no spending, secrets, destructive actions, external outreach, or sale-ready claims without approval",
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return json(502, {
        message: `Sweep webhook rejected the request with HTTP ${response.status}.`,
      });
    }

    return json(202, {
      message: "Full Product Radar sweep request accepted. The system should work blockers, push verified changes, and generate new next steps.",
    });
  } catch (error) {
    clearTimeout(timeout);
    return json(502, {
      message: error?.name === "AbortError" ? "Sweep webhook timed out." : "Sweep webhook could not be reached.",
    });
  }
};
