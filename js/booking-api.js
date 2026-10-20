// URL-ul Web App-ului Google Apps Script.
// Dacă e gol, site-ul trimite programările doar pe email (EmailJS).
const BOOKING_API_URL = "https://script.google.com/macros/s/AKfycbzPp7eb8zpRr4aPeWO4xeFTU-GpdsA6K0b3XD6jg3IJswZGBYvNAk5UYqlVpqcD2b8i/exec";
// Cheia publică (site key) Cloudflare Turnstile. Dacă e goală, CAPTCHA nu apare.
const TURNSTILE_SITE_KEY = "0x4AAAAAAFd3PILitw_vY-Rj";

const pageLoadedAt = Date.now();
let turnstileWidgetId = null;

const BookingApi = {
  elapsedMs: function () {
    return Date.now() - pageLoadedAt;
  },
  initCaptcha: function (containerId) {
    if (!TURNSTILE_SITE_KEY) return;
    window.onTurnstileLoad = function () {
      turnstileWidgetId = turnstile.render("#" + containerId, {
        sitekey: TURNSTILE_SITE_KEY,
        language: "ro",
        appearance: "interaction-only"
      });
    };
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit";
    script.async = true;
    document.head.appendChild(script);
  },
  captchaToken: function () {
    if (!TURNSTILE_SITE_KEY || typeof turnstile === "undefined" || turnstileWidgetId === null) return "";
    return turnstile.getResponse(turnstileWidgetId) || "";
  },
  resetCaptcha: function () {
    if (typeof turnstile !== "undefined" && turnstileWidgetId !== null) turnstile.reset(turnstileWidgetId);
  },
  enabled: function () {
    return !!BOOKING_API_URL;
  },
  fetchBusy: function (fromIso, toIso) {
    if (!BOOKING_API_URL) return Promise.resolve({});
    return fetch(`${BOOKING_API_URL}?from=${fromIso}&to=${toIso}`)
      .then(r => r.json())
      .then(d => (d && d.ok ? d.busy : {}))
      .catch(() => ({}));
  },
  book: function (payload) {
    // text/plain evită preflight-ul CORS, pe care Apps Script nu îl suportă
    return fetch(BOOKING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(r => r.json());
  }
};

function toIsoDate(d) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}
