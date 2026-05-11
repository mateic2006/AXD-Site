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

  emailjs.send("default_service", "template_lzorz2u", {
    name: name,
    email: email,
    phone: phone,
    service: service,
    date: date,
    time: time,
    message: message || "—"
  }).then(function () {
    setSubmitLoading(false);
    showFormMessage(messageEl, "Programarea a fost trimisă cu succes! Te vom contacta în curând.", "success");
    form.reset();
    // Reset hidden inputs and visible summary
    form.querySelector('#date').value = "";
    form.querySelector('#time').value = "";
    const summary = document.getElementById("booking-summary");
    if (summary) summary.classList.add("hidden");
    // Clear selected states in calendar/time slots
    document.querySelectorAll('#date-picker button').forEach(el => {
      el.classList.remove("bg-gradient-to-br","from-primary","to-secondary","text-white","font-bold","shadow-lg","scale-105");
    });
    document.querySelectorAll('#time-slots button').forEach(el => {
      el.classList.remove("bg-primary","text-white","border-primary","shadow-md","scale-105");
      el.classList.add("border-gray-200","text-gray-700");
    });
  }, function (error) {
    setSubmitLoading(false);
    const errMsg = (error && (error.text || error.message)) ? (error.text || error.message) : "Te rugăm să încerci din nou.";
    showFormMessage(messageEl, "Eroare la trimitere: " + errMsg, "error");
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleEmailSubmission);
  }
});
