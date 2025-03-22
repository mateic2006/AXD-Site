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
  if (datePicker) {
    // Use the actual current date instead of a forced demo date
    const currentDate = new Date();
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);
    let dayOfWeek = currentDate.getDay(); // 0 (Sun) ... 6 (Sat)
    let mondayDiff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() + mondayDiff);
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const cell = document.createElement("div");
      cell.className = "py-2 rounded text-center cursor-pointer transition-colors";
      if (date.getTime() < today.getTime()) {
        cell.classList.add("bg-gray-300", "text-gray-500", "cursor-not-allowed");
      } else {
        cell.classList.add("bg-white", "text-gray-700", "hover:bg-primary", "hover:text-white");
        cell.addEventListener("click", function () {
          datePicker.querySelectorAll("div").forEach(el => {
            el.classList.remove("bg-primary", "text-white", "ring-2", "ring-primary");
          });
          cell.classList.add("bg-primary", "text-black", "ring-2", "ring-primary");
        });
      }
      cell.textContent = date.getDate();
      datePicker.appendChild(cell);
    }
  }
  const timeSlotsContainer = document.getElementById("time-slots");
  if (timeSlotsContainer) {
    for (let hour = 14; hour <= 20; hour++) {
      const slot = document.createElement("div");
      slot.className = "py-2 rounded text-center cursor-pointer border hover:bg-primary hover:text-white transition-colors";
      slot.textContent = hour + ":00";
      slot.addEventListener("click", function () {
        timeSlotsContainer.querySelectorAll("div").forEach(el => {
          el.classList.remove("bg-primary", "text-white");
        });
        slot.classList.add("bg-primary", "text-white");
      });
      timeSlotsContainer.appendChild(slot);
    }
  }
});

document.addEventListener("DOMContentLoaded", function() {
  const params = new URLSearchParams(window.location.search);
  const service = params.get('service');
  if (service) {
    const selectElem = document.querySelector('form select');
    if (selectElem) {
      if (service.toLowerCase() === "bridal") {
        selectElem.value = "Bridal Makeup";
      } else if (service.toLowerCase() === "editorial") {
        selectElem.value = "Editorial Makeup";
      } else if (service.toLowerCase() === "special") {
        selectElem.value = "Special Effects";
      }
    }
  }
});
