// Initialize EmailJS
(function() {
  emailjs.init({ 
    publicKey: "1_FGRHSxLvZFvkJMX",
    limitRate: {
      // Set the limit rate for the application
      id: 'app',
      // Allow 1 request per 10s
      throttle: 10000,
    }, 
  });
})();

// Handle form submission and email sending
function handleEmailSubmission(event) {
  event.preventDefault(); // Prevent form auto-submission

  const form = event.target;
  const date = form.querySelector('#date').value;
  const time = form.querySelector('#time').value;

  if (!date || !time) {
    alert('Va rugam selectati data si ora');
    return;
  }

  // Send email using EmailJS
  emailjs.send("default_service", "template_lzorz2u", {
    name: form.querySelector('#name').value,
    email: form.querySelector('#email').value,
    phone: form.querySelector('#phone').value,
    service: form.querySelector('#service').value,
    date: date,
    time: time
  }).then(function(response) {
    alert('Formular trimis cu succes!', response.status, response.text);
  }, function(error) {
    alert('Eroare la trimitere!', error);
  });
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleEmailSubmission);
  }
});