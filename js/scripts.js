document.addEventListener("DOMContentLoaded", function () {
  // ... ECharts initialization for about.html ...
  const skillElem = document.getElementById("skillChart");
  if (skillElem) {
    const chart = echarts.init(skillElem);
    const option = {
      animation: false,
      radar: {
        indicator: [
          { name: "Bridal Makeup", max: 100 },
          { name: "Color Theory", max: 100 },
          { name: "Skincare", max: 100 },
          { name: "Special Effects", max: 100 },
          { name: "Airbrush", max: 100 },
          { name: "Client Relations", max: 100 }
        ],
        radius: "65%",
        splitNumber: 4,
        axisLine: { lineStyle: { color: "#e5e7eb" } },
        splitLine: { lineStyle: { color: "#e5e7eb" } },
        splitArea: {
          show: true,
          areaStyle: { color: ["#fff", "#fff", "#fff", "#fff"] }
        }
      },
      series: [{
        type: "radar",
        data: [{
          value: [95, 90, 85, 90, 88, 82],
          name: "Skills",
          symbol: "none",
          lineStyle: { color: "#C292FC" },
          areaStyle: { color: "rgba(194, 146, 252, 0.1)" }
        }]
      }]
    };
    chart.setOption(option);
    window.addEventListener("resize", function () {
      chart.resize();
    });
  }

  // Updated Portfolio filter functionality: dynamically populate one row at a time
  const portfolioFilter = document.getElementById("portfolio-filter");
  const portfolioGrid = document.getElementById("portfolio-grid");
  // Data object with image info for each category
  const portfolioData = {
    bridal: [
      { src: "photos/fete/bridal1.png", alt: "Bridal Makeup", label: "Bridal Makeup" },
      { src: "photos/fete/bridal2.jpeg", alt: "Bridal Makeup", label: "Bridal Makeup" },
      { src: "photos/fete/bridal3.png", alt: "Bridal Makeup", label: "Bridal Makeup" }
    ],
    editorial: [
      { src: "photos/fete/editorial1.jpeg", alt: "Editorial Makeup", label: "Editorial Makeup" },
      { src: "photos/fete/editorial2.jpeg", alt: "Editorial Makeup", label: "Editorial Makeup" },
      { src: "photos/fete/editorial3.jpeg", alt: "Editorial Makeup", label: "Editorial Makeup" }
    ],
    special: [
      { src: "photos/fete/evening1.jpeg", alt: "Evening Makeup", label: "Evening Makeup" },
      { src: "photos/fete/evening2.jpeg", alt: "Evening Makeup", label: "Evening Makeup" },
      { src: "photos/fete/evening3.jpeg", alt: "Evening Makeup", label: "Evening Makeup" }
    ]
  };
  
  function createPortfolioItem({src, alt, label}) {
    const div = document.createElement("div");
    div.className = "relative group overflow-hidden rounded cursor-pointer transition-all duration-300 portfolio-item";
    div.innerHTML = `
      <img src="${src}" alt="${alt}" class="w-full h-[400px] object-cover" />
      <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <p class="text-white text-lg font-semibold">${label}</p>
      </div>
    `;
    return div;
  }
  
  function applyFilter(category) {
    // Clear the grid first
    portfolioGrid.innerHTML = "";
    let items = [];
    if (category === "all") {
      // Show first image from each category in order: bridal, editorial, special.
      items.push(portfolioData.bridal[0], portfolioData.editorial[0], portfolioData.special[0]);
    } else {
      // For a specific filter, show max 3 items from that category.
      items = portfolioData[category].slice(0, 3);
    }
    // Append items dynamically.
    items.forEach(data => {
      portfolioGrid.appendChild(createPortfolioItem(data));
    });
  }
  
  if (portfolioFilter && portfolioGrid) {
    const buttons = portfolioFilter.querySelectorAll("button");
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        const category = button.getAttribute("data-category");
        buttons.forEach(btn => {
          btn.classList.remove("bg-primary", "text-white");
          btn.classList.add("text-gray-700");
        });
        button.classList.remove("text-gray-700");
        button.classList.add("bg-primary", "text-white");
        applyFilter(category);
      });
    });
    // Auto-trigger "all" filter on page load.
    applyFilter("all");
  }

  // Updated infinite continuous Testimonial slider functionality ...
  const testimonialSlider = document.querySelector(".testimonial-slider");
  if (testimonialSlider) {
    const prevButton = document.querySelector(".testimonial-prev");
    const nextButton = document.querySelector(".testimonial-next");
    const visibleSlides = 3;
    const originalSlides = Array.from(testimonialSlider.children);
    const originalCount = originalSlides.length;
    // Clone first 'visibleSlides' and append them
    originalSlides.slice(0, visibleSlides).forEach(slide => {
      testimonialSlider.appendChild(slide.cloneNode(true));
    });
    // Clone last 'visibleSlides' and prepend them
    originalSlides.slice(-visibleSlides).forEach(slide => {
      const clone = slide.cloneNode(true);
      testimonialSlider.insertBefore(clone, testimonialSlider.firstChild);
    });
    const totalSlides = testimonialSlider.children.length;
    let currentSlide = visibleSlides; // start at first original slide
    function updateSlider(animate = true) {
      testimonialSlider.style.transition = animate ? "transform 0.3s" : "none";
      testimonialSlider.style.transform = `translateX(-${currentSlide * (100 / visibleSlides)}%)`;
    }
    // Initialize slider position without animation
    updateSlider(false);
    // On transition end, jump seamlessly if at clones
    testimonialSlider.addEventListener("transitionend", function () {
      if (currentSlide >= originalCount + visibleSlides) {
        currentSlide = visibleSlides;
        updateSlider(false);
      }
      if (currentSlide < visibleSlides) {
        currentSlide = originalCount + currentSlide;
        updateSlider(false);
      }
    });
    if (prevButton && nextButton) {
      prevButton.addEventListener("click", function () {
        currentSlide--;
        updateSlider();
      });
      nextButton.addEventListener("click", function () {
        currentSlide++;
        updateSlider();
      });
    }
  }

  // Diploma slider functionality
  const diplomaSlider = document.querySelector(".diploma-slider");
  if (diplomaSlider) {
    const prevButton = document.querySelector(".diploma-prev");
    const nextButton = document.querySelector(".diploma-next");
    const visibleSlides = 4;
    const originalSlides = Array.from(diplomaSlider.children);
    const originalCount = originalSlides.length;
    // Clone first 'visibleSlides' and append them
    originalSlides.slice(0, visibleSlides).forEach(slide => {
      diplomaSlider.appendChild(slide.cloneNode(true));
    });
    // Clone last 'visibleSlides' and prepend them
    originalSlides.slice(-visibleSlides).forEach(slide => {
      const clone = slide.cloneNode(true);
      diplomaSlider.insertBefore(clone, diplomaSlider.firstChild);
    });
    const totalSlides = diplomaSlider.children.length;
    let currentSlide = visibleSlides; // start at first original slide
    function updateSlider(animate = true) {
      diplomaSlider.style.transition = animate ? "transform 0.3s" : "none";
      diplomaSlider.style.transform = `translateX(-${currentSlide * (100 / visibleSlides)}%)`;
    }
    // Initialize slider position without animation
    updateSlider(false);
    // On transition end, jump seamlessly if at clones
    diplomaSlider.addEventListener("transitionend", function () {
      if (currentSlide >= originalCount + visibleSlides) {
        currentSlide = visibleSlides;
        updateSlider(false);
      }
      if (currentSlide < visibleSlides) {
        currentSlide = originalCount + currentSlide;
        updateSlider(false);
      }
    });
    if (prevButton && nextButton) {
      prevButton.addEventListener("click", function () {
        currentSlide--;
        updateSlider();
      });
      nextButton.addEventListener("click", function () {
        currentSlide++;
        updateSlider();
      });
    }
  }

  // ... Mobile menu functionality ...
  const mobileMenuButton = document.querySelector("button.md\\:hidden");
  if (mobileMenuButton) {
    const mobileMenu = document.createElement("div");
    mobileMenu.className = "fixed inset-0 bg-black bg-opacity-50 z-40 hidden";
    mobileMenu.innerHTML = `
      <div class="fixed right-0 top-0 h-full w-64 bg-white shadow-lg">
        <div class="p-4">
          <div class="flex justify-end">
            <button class="w-10 h-10 flex items-center justify-center">
              <i class="ri-close-line text-xl"></i>
            </button>
          </div>
          <div class="flex flex-col space-y-4">
            <a href="about.html" class="text-gray-700 hover:text-primary transition-colors">About Me</a>
            <a href="/Portfolio.html#services" class="text-gray-700 hover:text-primary transition-colors">Services</a>
            <a href="/Portfolio.html#portfolio" class="text-gray-700 hover:text-primary transition-colors">Portfolio</a>
            <a href="contact.html" class="text-gray-700 hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(mobileMenu);
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.remove("hidden");
    });
    mobileMenu.querySelector("button").addEventListener("click", function () {
      mobileMenu.classList.add("hidden");
    });
  }

  // Date-picker and Time-slot generation for contact.html
  const datePicker = document.getElementById("date-picker");
  // Calculate the Monday of the current week (week containing today's date)
  const today = new Date();
  const dayOfWeek = today.getDay();
  let currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - ((dayOfWeek === 0 ? 7 : dayOfWeek) - 1));

  let selectedDate = null;
  let selectedTime = null;

  function generateWeek(startDate) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const cell = document.createElement("div");
      cell.className = "py-2 rounded text-center cursor-pointer transition-colors";
      if (date.getTime() < now.getTime()) {
        cell.classList.add("bg-gray-300", "text-gray-500", "cursor-not-allowed");
      } else {
        cell.classList.add("bg-white", "text-gray-700", "hover:bg-primary", "hover:text-white");
        cell.addEventListener("click", function () {
          datePicker.querySelectorAll("div").forEach(el => {
            el.classList.remove("bg-primary", "text-white", "ring-2", "ring-primary");
          });
          cell.classList.add("bg-primary", "text-black", "ring-2", "ring-primary");
          selectedDate = date;
        });
      }
      cell.textContent = date.getDate();
      datePicker.appendChild(cell);
    }
  }

  function generateTwoWeeks() {
    datePicker.innerHTML = "";
    generateWeek(currentMonday);
    const nextMonday = new Date(currentMonday);
    nextMonday.setDate(currentMonday.getDate() + 7);
    generateWeek(nextMonday);
  }

  if (datePicker) {
    generateTwoWeeks();
  }

  // Schedule a weekly update at the upcoming Monday midnight
  function scheduleCalendarUpdate() {
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + ((8 - now.getDay()) % 7));
    nextMonday.setHours(0, 0, 0, 0);
    const timeout = nextMonday.getTime() - now.getTime();
    setTimeout(() => {
      currentMonday = new Date(nextMonday);
      generateTwoWeeks();
      scheduleCalendarUpdate();
    }, timeout);
  }

  if (datePicker) {
    scheduleCalendarUpdate();
  }

  const timeSlotsContainer = document.getElementById("time-slots");
  if (timeSlotsContainer) {
    for (let hour = 17; hour <= 20; hour++) {
      const slot = document.createElement("div");
      slot.className = "py-2 rounded text-center cursor-pointer border hover:bg-primary hover:text-white transition-colors";
      slot.textContent = hour + ":00";
      slot.addEventListener("click", function () {
        timeSlotsContainer.querySelectorAll("div").forEach(el => {
          el.classList.remove("bg-primary", "text-white");
        });
        slot.classList.add("bg-primary", "text-white");
        selectedTime = slot.textContent;
      });
      timeSlotsContainer.appendChild(slot);
    }
  }

  // Form validation and submission handling
  const bookingForm = document.getElementById("booking-form");
  const formMessage = document.getElementById("form-message");

  if (bookingForm) {
    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(bookingForm);
      let allFieldsFilled = true;

      for (let [name, value] of formData.entries()) {
        if (!value) {
          allFieldsFilled = false;
          break;
        }
      }

      if (allFieldsFilled && selectedDate && selectedTime) {
        formData.append("date", selectedDate.toLocaleDateString());
        formData.append("time", selectedTime);
        formMessage.textContent = "Booking confirmed!";
        formMessage.className = "text-green-500";
      } else {
        formMessage.textContent = "Please fill in all fields and select a date and time.";
        formMessage.className = "text-red-500";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function() {
  const params = new URLSearchParams(window.location.search);
  const service = params.get('service');
  if (service) {
    const selectElem = document.querySelector('form select');
    if (selectElem) {
      if (service.toLowerCase() === "bridal") {
        selectElem.value = "Machiaj Mireasa";
      } else if (service.toLowerCase() === "editorial") {
        selectElem.value = "Machiaj de Seara";
      } else if (service.toLowerCase() === "special") {
        selectElem.value = "Machiaj Natural";
      }
    }
  }
});
const btn = document.getElementById('submit-booking');

document.getElementById('booking-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Previne trimiterea automată a formularului

  // Trimite emailul folosind EmailJS
  emailjs.send("SERVICE_ID", "TEMPLATE_ID", {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      service: document.getElementById('service').value,
      date: document.getElementById('date').value,
      time: document.getElementById('time').value
  }).then(function(response) {
      alert('Formular trimis cu succes!', response.status, response.text);
  }, function(error) {
      alert('Eroare la trimitere!', error);
  });
});