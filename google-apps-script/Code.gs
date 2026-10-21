// Backend pentru programările de pe site (Google Apps Script Web App).
// GET  ?from=YYYY-MM-DD&to=YYYY-MM-DD  -> { ok, busy: { "YYYY-MM-DD": ["17:00", ...] } }
// POST { name, email, phone, service, date: "YYYY-MM-DD", time: "HH:00", message }
//      -> creează eveniment în Google Calendar
//
// Notificarea ntfy pe telefon o trimite site-ul (js/booking-api.js), nu scriptul:
// ntfy.sh gratuit nu acceptă mesaje de pe IP-urile comune Google / Cloudflare.
//
// Script Properties (Project Settings -> Script Properties):
//   CALENDAR_ID  (opțional) - id-ul calendarului; implicit calendarul principal
//   TURNSTILE_SECRET (opțional) - cheia secretă Cloudflare Turnstile; dacă e setată, CAPTCHA e obligatoriu

const FIRST_HOUR = 9;
const LAST_HOUR = 20;
const SLOT_MINUTES = 60;
const MAX_RANGE_DAYS = 62;

// Anti-spam
const MIN_FILL_MS = 4000;              // un om nu completează formularul în sub 4 secunde
const MAX_UPCOMING_PER_PHONE = 2;      // programări viitoare active per număr de telefon
const MAX_BOOKINGS_PER_HOUR = 8;       // plafon global, oprește un atac în masă
const LOOKAHEAD_DAYS = 120;
const SERVICES = [
  "Machiaj Mireasa", "Proba Mireasă", "Machiaj de Seara", "Machiaj Natural",
  "Cofat Bucle", "Îndreptat Păr",
  "Demontare și Stilizare Cuticule", "Ojă Semi-permanentă", "Construcție Unghii Scurte",
  "Construcție Unghii Medii", "French de Interior", "Babyboomer"
];

function doGet(e) {
  const from = parseIsoDate_(e.parameter.from);
  const to = parseIsoDate_(e.parameter.to);
  if (!from || !to || to < from || daysBetween_(from, to) > MAX_RANGE_DAYS) {
    return json_({ ok: false, error: "Interval invalid." });
  }
  return json_({ ok: true, busy: busySlots_(from, addDays_(to, 1)) });
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: "Date invalide." });
  }

  // Honeypot: câmp invizibil pe care doar boții îl completează. Răspundem "ok" ca să nu afle.
  if (data.website) return json_({ ok: true });
  if (!(Number(data.elapsed) >= MIN_FILL_MS)) {
    return json_({ ok: false, error: "Te rugăm să încerci din nou." });
  }
  if (!verifyTurnstile_(data.captcha)) {
    return json_({ ok: false, code: "captcha", error: "Verificarea anti-spam a eșuat. Te rugăm să reîncarci pagina." });
  }

  const booking = validate_(data);
  if (booking.error) return json_({ ok: false, error: booking.error });

  const start = booking.start;
  const end = new Date(start.getTime() + SLOT_MINUTES * 60000);
  if (start < new Date()) {
    return json_({ ok: false, error: "Ora aleasă a trecut deja." });
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return json_({ ok: false, error: "Serverul este ocupat, te rugăm să încerci din nou." });
  }
  try {
    const cache = CacheService.getScriptCache();
    const hourKey = "count_" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMddHH");
    const bookedThisHour = Number(cache.get(hourKey) || 0);
    if (bookedThisHour >= MAX_BOOKINGS_PER_HOUR) {
      return json_({ ok: false, error: "Momentan nu putem prelua programări online. Te rugăm să ne suni." });
    }

    const calendar = getCalendar_();
    if (calendar.getEvents(start, end).length > 0) {
      return json_({
        ok: false,
        code: "slot_taken",
        error: "Ora aleasă tocmai a fost rezervată. Te rugăm să alegi altă oră."
      });
    }

    const phoneTag = "#tel" + normalizePhone_(booking.phone);
    const now = new Date();
    const upcoming = calendar.getEvents(now, addDays_(now, LOOKAHEAD_DAYS))
      .filter(function (ev) { return ev.getDescription().indexOf(phoneTag) !== -1; });
    if (upcoming.length >= MAX_UPCOMING_PER_PHONE) {
      return json_({
        ok: false,
        error: "Ai deja " + upcoming.length + " programări active. Pentru mai multe, te rugăm să ne suni."
      });
    }

    calendar.createEvent(booking.service + " – " + booking.name, start, end, {
      description: [
        "Client: " + booking.name,
        "Telefon: " + booking.phone,
        "Email: " + booking.email,
        "Serviciu: " + booking.service,
        "Mesaj: " + (booking.message || "—"),
        "",
        "Programare făcută de pe site. " + phoneTag
      ].join("\n")
    });
    cache.put(hourKey, String(bookedThisHour + 1), 3600);
  } finally {
    lock.releaseLock();
  }

  return json_({ ok: true });
}

function validate_(data) {
  const str = function (v, max) {
    return typeof v === "string" ? v.trim().slice(0, max) : "";
  };
  const booking = {
    name: str(data.name, 100),
    email: str(data.email, 150),
    phone: str(data.phone, 30),
    service: str(data.service, 100),
    message: str(data.message, 1000)
  };
  if (!booking.name || !booking.email || !booking.phone || !booking.service) {
    return { error: "Te rugăm să completezi toate câmpurile." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) {
    return { error: "Adresa de email nu este validă." };
  }
  if (!/^[+\d][\d\s().-]{5,}$/.test(booking.phone) || normalizePhone_(booking.phone).length < 9) {
    return { error: "Numărul de telefon nu este valid." };
  }
  if (SERVICES.indexOf(booking.service) === -1) {
    return { error: "Serviciul ales nu este valid." };
  }

  const day = parseIsoDate_(data.date);
  const timeMatch = /^(\d{2}):00$/.exec(data.time || "");
  const hour = timeMatch ? Number(timeMatch[1]) : -1;
  if (!day || hour < FIRST_HOUR || hour > LAST_HOUR) {
    return { error: "Data sau ora programării nu este validă." };
  }
  booking.date = data.date;
  booking.time = data.time;
  booking.start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour);
  return booking;
}

function busySlots_(start, end) {
  const busy = {};
  getCalendar_().getEvents(start, end).forEach(function (ev) {
    const evStart = ev.isAllDayEvent() ? ev.getAllDayStartDate() : ev.getStartTime();
    const evEnd = ev.isAllDayEvent() ? ev.getAllDayEndDate() : ev.getEndTime();
    let day = startOfDay_(evStart < start ? start : evStart);
    for (; day < end && day < evEnd; day = addDays_(day, 1)) {
      for (let h = FIRST_HOUR; h <= LAST_HOUR; h++) {
        const slotStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h);
        const slotEnd = new Date(slotStart.getTime() + SLOT_MINUTES * 60000);
        if (slotStart < evEnd && slotEnd > evStart) {
          const key = formatIsoDate_(day);
          const label = (h < 10 ? "0" + h : h) + ":00";
          busy[key] = busy[key] || [];
          if (busy[key].indexOf(label) === -1) busy[key].push(label);
        }
      }
    }
  });
  Object.keys(busy).forEach(function (k) { busy[k].sort(); });
  return busy;
}

function verifyTurnstile_(token) {
  const secret = PropertiesService.getScriptProperties().getProperty("TURNSTILE_SECRET");
  if (!secret) return true;
  if (typeof token !== "string" || !token) return false;
  try {
    const res = UrlFetchApp.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "post",
      payload: { secret: secret, response: token },
      muteHttpExceptions: true
    });
    return JSON.parse(res.getContentText()).success === true;
  } catch (err) {
    console.error("Verificarea Turnstile a eșuat: " + err);
    return false;
  }
}

// Ultimele 9 cifre: 0722 123 456, +40722123456 și 0040 722 123 456 dau același rezultat
function normalizePhone_(phone) {
  return phone.replace(/\D/g, "").slice(-9);
}

function getCalendar_() {
  const id = PropertiesService.getScriptProperties().getProperty("CALENDAR_ID");
  return id ? CalendarApp.getCalendarById(id) : CalendarApp.getDefaultCalendar();
}

function parseIsoDate_(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.getMonth() === Number(m[2]) - 1 ? d : null;
}

function formatIsoDate_(d) {
  return Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
}

function startOfDay_(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays_(d, n) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

function daysBetween_(a, b) {
  return Math.round((b - a) / 86400000);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Rulează o dată manual din editor ca să acorzi permisiunile (Calendar + UrlFetch pentru Turnstile).
function authorize() {
  console.log("Calendar: " + getCalendar_().getName());
}
