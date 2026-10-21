// Cloudflare Worker: releu între Google Apps Script și ntfy.sh.
// Serverele Google nu pot accesa ntfy.sh direct, iar topicul nu trebuie să fie public.
//
// Secrete (Worker -> Settings -> Variables and Secrets, tip "Secret"):
//   RELAY_KEY  - parolă lungă, aceeași ca NOTIFY_RELAY_KEY din Script Properties (Apps Script)
//   NTFY_TOPIC - topicul ntfy la care e abonat telefonul

const ALLOWED_FIELDS = ["title", "message", "tags", "priority", "click"];

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }
    if (!env.RELAY_KEY || !env.NTFY_TOPIC) {
      return new Response("Relay not configured", { status: 500 });
    }
    if (!(await safeEqual(request.headers.get("Authorization") || "", `Bearer ${env.RELAY_KEY}`))) {
      return new Response("Unauthorized", { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    const payload = { topic: env.NTFY_TOPIC };
    for (const field of ALLOWED_FIELDS) {
      if (body[field] !== undefined) payload[field] = body[field];
    }

    const res = await fetch("https://ntfy.sh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return new Response(null, { status: res.ok ? 204 : 502 });
  }
};

// Comparație în timp constant, ca parola să nu poată fi ghicită din timpul de răspuns
async function safeEqual(a, b) {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b))
  ]);
  const va = new Uint8Array(ha);
  const vb = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}
