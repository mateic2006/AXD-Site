// Initialize EmailJS
(function () {
  emailjs.init({
    publicKey: "1_FGRHSxLvZFvkJMX",
    limitRate: {
      id: 'app',
      throttle: 10000,
    },
  });
})();

function showFormMessage(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = "mt-4 text-center text-sm " + (
    type === "success" ? "text-green-600" :
    type === "error"   ? "text-red-600"   :
                         "text-gray-600"
  );
}

function setSubmitLoading(loading) {
  const btn = document.getElementById("submit-booking");
  const label = document.getElementById("submit-label");
  const spinner = document.getElementById("submit-spinner");
  if (!btn) return;
  btn.disabled = loading;
  if (label) label.textContent = loading ? "Se trimite..." : "Confirmă";
  if (spinner) spinner.classList.toggle("hidden", !loading);
}

function handleEmailSubmission(event) {
  event.preventDefault();

  const form = event.target;
  const messageEl = document.getElementById("form-message");

  const name = form.querySelector('#name').value.trim();
  const email = form.querySelector('#email').value.trim();
  const phone = form.querySelector('#phone').value.trim();
  const service = form.querySelector('#service').value;
  const date = form.querySelector('#date').value;
  const time = form.querySelector('#time').value;
  const messageField = form.querySelector('#message');
  const message = messageField ? messageField.value.trim() : "";

  if (!name || !email || !phone || !service) {
    showFormMessage(messageEl, "Te rugăm să completezi toate câmpurile.", "error");
    return;
  }

  if (!date) {
    showFormMessage(messageEl, "Te rugăm să selectezi o zi din calendar.", "error");
    return;
  }

  if (!time) {
    showFormMessage(messageEl, "Te rugăm să selectezi ora programării.", "error");
    return;
  }

  setSubmitLoading(true);
  showFormMessage(messageEl, "", "");

  const apiEnabled = typeof BookingApi !== "undefined" && BookingApi.enabled();
  const picker = window.bookingPicker;
  const honeypot = form.querySelector('#website');

  // 1. Rezervă ora în Google Calendar (sursa de adevăr pentru disponibilitate)
  const reserve = apiEnabled
    ? BookingApi.book({
        name: name,
        email: email,
        phone: phone,
        service: service,
        date: form.querySelector('#date').dataset.iso,
        time: time,
        message: message,
        website: honeypot ? honeypot.value : "",
        elapsed: BookingApi.elapsedMs(),
        captcha: BookingApi.captchaToken()
      }).then(function (res) {
        if (!res || !res.ok) {
          throw { text: (res && res.error) || "Te rugăm să încerci din nou.", slotTaken: res && res.code === "slot_taken" };
        }
        BookingApi.notifyOwner({ name: name, phone: phone, service: service, date: date, time: time, message: message });
      })
    : Promise.resolve();

  // 2. Email de confirmare; dacă rezervarea a reușit deja, un email eșuat nu o anulează
  reserve.then(function () {
    return emailjs.send("default_service", "template_lzorz2u", {
      name: name,
      email: email,
      phone: phone,
      service: service,
      date: date,
      time: time,
      message: message || "—"
    }).catch(function (error) {
      if (!apiEnabled) throw error;
    });
  }).finally(function () {
    // un token Turnstile e valabil o singură dată
    if (apiEnabled) BookingApi.resetCaptcha();
  }).then(function () {
    setSubmitLoading(false);
    showFormMessage(messageEl, "Programarea a fost trimisă cu succes! Te vom contacta în curând.", "success");
    form.reset();
    if (picker) {
      picker.reset();
      picker.refresh();
    }
  }, function (error) {
    setSubmitLoading(false);
    const errMsg = (error && (error.text || error.message)) ? (error.text || error.message) : "Te rugăm să încerci din nou.";
    showFormMessage(messageEl, "Eroare la trimitere: " + errMsg, "error");
    if (error && error.slotTaken && picker) picker.refresh();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleEmailSubmission);
    if (typeof BookingApi !== "undefined" && BookingApi.enabled()) BookingApi.initCaptcha("booking-captcha");
  }
});
