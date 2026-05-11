document.addEventListener("DOMContentLoaded", function () {
  
  // Portfolio slider functionality
  const portfolioSlider = document.querySelector(".portfolio-slider");
  if (portfolioSlider) {
    const prevButton = document.querySelector(".portfolio-prev");
    const nextButton = document.querySelector(".portfolio-next");
    
    // Function to get visible slides based on screen width
    function getVisibleSlides() {
      return window.innerWidth < 768 ? 1 : 3; // 1 slide for mobile, 3 for desktop
    }
    
    let visibleSlides = getVisibleSlides();

    // Portfolio media items: images and video with explicit filenames
    const portfolioItems = [
      { type: "image", src: "photos/fete/1.jpeg" },
      { type: "video", src: "photos/fete/video1.MOV" },
      { type: "image", src: "photos/fete/2.jpg" },
      { type: "image", src: "photos/fete/5.jpeg" },
      { type: "image", src: "photos/fete/7.jpeg" },
      { type: "image", src: "photos/fete/9.jpeg" },
      { type: "image", src: "photos/fete/10.jpeg" },
      { type: "image", src: "photos/fete/11.jpeg" },
      { type: "image", src: "photos/fete/12.jpeg" },
      { type: "image", src: "photos/fete/14.jpeg" },
      { type: "image", src: "photos/fete/15.jpeg" },
      { type: "image", src: "photos/fete/16.jpeg" },
    ];
    const totalImages = portfolioItems.length;

    // Create slides for all items
    portfolioItems.forEach(function(item, index) {
      const slide = document.createElement("div");
      slide.className = "w-full md:w-1/3 flex-shrink-0 px-4";
      if (item.type === "video") {
        slide.innerHTML = `
          <div class="relative group aspect-square overflow-hidden rounded">
            <video
              src="${item.src}"
              autoplay muted loop playsinline
              class="w-full h-full object-cover"
            ></video>
          </div>
        `;
      } else {
        slide.innerHTML = `
          <div class="relative group aspect-square overflow-hidden rounded">
            <img
              src="${item.src}"
              alt="Portfolio ${index + 1}"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p class="text-white text-lg font-semibold"></p>
            </div>
          </div>
        `;
      }
      portfolioSlider.appendChild(slide.cloneNode(true));
    });

    // Clone slides for infinite effect
    const originalSlides = Array.from(portfolioSlider.children);
    
    // Add clones at the end
    originalSlides.slice(0, visibleSlides).forEach(slide => {
      portfolioSlider.appendChild(slide.cloneNode(true));
    });
    
    // Add clones at the start
    originalSlides.slice(-visibleSlides).forEach(slide => {
      portfolioSlider.insertBefore(slide.cloneNode(true), portfolioSlider.firstChild);
    });

    let currentSlide = visibleSlides;
    let isAnimating = false;

    function updateSlider(animate = true) {
      if (isAnimating) return;
      
      const slideWidth = 100 / visibleSlides;
      portfolioSlider.style.transition = animate ? "transform 0.3s" : "none";
      portfolioSlider.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
      
      if (animate) {
        isAnimating = true;
      }
    }

    // Initialize slider position without animation
    updateSlider(false);

    portfolioSlider.addEventListener("transitionend", function() {
      isAnimating = false;
      if (currentSlide >= totalImages + visibleSlides) {
        currentSlide = visibleSlides;
        updateSlider(false);
      }
      if (currentSlide < visibleSlides) {
        currentSlide = totalImages + currentSlide;
        updateSlider(false);
      }
    });

    if (prevButton && nextButton) {
      prevButton.addEventListener("click", function() {
        if (!isAnimating) {
          currentSlide--;
          updateSlider(true);
        }
      });
      nextButton.addEventListener("click", function() {
        if (!isAnimating) {
          currentSlide++;
          updateSlider(true);
        }
      });
    }

    // Handle window resize
    window.addEventListener('resize', function() {
      const newVisibleSlides = getVisibleSlides();
      if (newVisibleSlides !== visibleSlides) {
        visibleSlides = newVisibleSlides;
        // Reinitialize slider with new visible slides count
        currentSlide = visibleSlides;
        updateSlider(false);
      }
    });
  }

  // Testimonial slider functionality with mobile support
  const testimonialSlider = document.querySelector(".testimonial-slider");
  if (testimonialSlider) {
    const prevButton = document.querySelector(".testimonial-prev");
    const nextButton = document.querySelector(".testimonial-next");
    
    // Function to get visible slides based on screen width
    function getVisibleSlides() {
      return window.innerWidth < 768 ? 1 : 3; // 1 slide for mobile, 3 for desktop
    }
    
    let visibleSlides = getVisibleSlides();
    const originalSlides = Array.from(testimonialSlider.children);
    const originalCount = originalSlides.length;
    
    // Clear existing clones
    testimonialSlider.innerHTML = "";
    
    // Re-add original slides
    originalSlides.forEach(slide => {
      testimonialSlider.appendChild(slide.cloneNode(true));
    });
    
    // Clone slides
    originalSlides.slice(0, visibleSlides).forEach(slide => {
      testimonialSlider.appendChild(slide.cloneNode(true));
    });
    originalSlides.slice(-visibleSlides).forEach(slide => {
      testimonialSlider.insertBefore(slide.cloneNode(true), testimonialSlider.firstChild);
    });

    let currentSlide = visibleSlides;
    let isAnimating = false;

    function updateSlider(animate = true) {
      if (isAnimating) return;
      
      const slideWidth = 100 / visibleSlides;
      testimonialSlider.style.transition = animate ? "transform 0.3s" : "none";
      testimonialSlider.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
      
      if (animate) {
        isAnimating = true;
      }
    }

    // Initialize slider position without animation
    updateSlider(false);

    testimonialSlider.addEventListener("transitionend", function() {
      isAnimating = false;
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
      prevButton.addEventListener("click", function() {
        if (!isAnimating) {
          currentSlide--;
          updateSlider(true);
        }
      });
      nextButton.addEventListener("click", function() {
        if (!isAnimating) {
          currentSlide++;
          updateSlider(true);
        }
      });
    }

    // Handle window resize
    window.addEventListener('resize', function() {
      const newVisibleSlides = getVisibleSlides();
      if (newVisibleSlides !== visibleSlides) {
        visibleSlides = newVisibleSlides;
        // Reinitialize slider with new visible slides count
        currentSlide = visibleSlides;
        updateSlider(false);
      }
    });
  }

  // Diploma slider functionality with mobile support
  const diplomaSlider = document.querySelector(".diploma-slider");
  if (diplomaSlider) {
    const prevButton = document.querySelector(".diploma-prev");
    const nextButton = document.querySelector(".diploma-next");
    
    // Function to get visible slides based on screen width
    function getVisibleSlides() {
      return window.innerWidth < 768 ? 1 : 4; // 1 slide for mobile, 4 for desktop
    }
    
    let visibleSlides = getVisibleSlides();
    const originalSlides = Array.from(diplomaSlider.children);
    const originalCount = originalSlides.length;
    
    // Clear existing clones
    diplomaSlider.innerHTML = "";
    
    // Re-add original slides
    originalSlides.forEach(slide => {
      diplomaSlider.appendChild(slide.cloneNode(true));
    });
    
    // Clone slides
    originalSlides.slice(0, visibleSlides).forEach(slide => {
      diplomaSlider.appendChild(slide.cloneNode(true));
    });
    originalSlides.slice(-visibleSlides).forEach(slide => {
      diplomaSlider.insertBefore(slide.cloneNode(true), diplomaSlider.firstChild);
    });

    let currentSlide = visibleSlides;
    let isAnimating = false;

    function updateSlider(animate = true) {
      if (isAnimating) return;
      
      const slideWidth = 100 / visibleSlides;
      diplomaSlider.style.transition = animate ? "transform 0.3s" : "none";
      diplomaSlider.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
      
      if (animate) {
        isAnimating = true;
      }
    }

    // Initialize slider position without animation
    updateSlider(false);

    diplomaSlider.addEventListener("transitionend", function() {
      isAnimating = false;
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
      prevButton.addEventListener("click", function() {
        if (!isAnimating) {
          currentSlide--;
          updateSlider(true);
        }
      });
      nextButton.addEventListener("click", function() {
        if (!isAnimating) {
          currentSlide++;
          updateSlider(true);
        }
      });
    }

    // Handle window resize
    window.addEventListener('resize', function() {
      const newVisibleSlides = getVisibleSlides();
      if (newVisibleSlides !== visibleSlides) {
        visibleSlides = newVisibleSlides;
        // Reinitialize slider with new visible slides count
        currentSlide = visibleSlides;
        updateSlider(false);
      }
    });
  }

  // Mobile menu functionality
  const mobileMenuButton = document.querySelector("button.md\\:hidden");
  if (mobileMenuButton) {
    const mobileMenu = document.createElement("div");
    mobileMenu.className = "fixed inset-0 bg-black bg-opacity-50 z-50 hidden"; // Increased z-index
    mobileMenu.innerHTML = `
      <div class="fixed right-0 top-0 h-full w-64 bg-white shadow-lg">
        <div class="p-4">
          <div class="flex justify-end">
            <button class="mobile-close w-10 h-10 flex items-center justify-center">
              <i class="ri-close-line text-xl"></i>
            </button>
          </div>
          <div class="flex flex-col space-y-4">
            <a href="about.html" class="text-gray-700 hover:text-primary transition-colors">Despre mine</a>
            <a href="/index.html#services" class="text-gray-700 hover:text-primary transition-colors">Servicii</a>
            <a href="/index.html#portfolio" class="text-gray-700 hover:text-primary transition-colors">Portofoliu</a>
            <a href="unghii.html" class="text-gray-700 hover:text-primary transition-colors">Unghii</a>
            <a href="contact.html" class="text-gray-700 hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(mobileMenu);

    function toggleMobileMenu() {
      const isHidden = mobileMenu.classList.contains("hidden");
      if (isHidden) {
        mobileMenu.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // Prevent scrolling when menu is open
      } else {
        mobileMenu.classList.add("hidden");
        document.body.style.overflow = ""; // Restore scrolling
      }
    }

    mobileMenuButton.addEventListener("click", toggleMobileMenu);
    mobileMenu.querySelector(".mobile-close").addEventListener("click", toggleMobileMenu);
    
    // Close menu when clicking outside
    mobileMenu.addEventListener("click", function(e) {
      if (e.target === mobileMenu) {
        toggleMobileMenu();
      }
    });

    // Close menu when clicking on a link
    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", toggleMobileMenu);
    });
  }

  // Interactive monthly calendar for contact.html
  const datePicker = document.getElementById("date-picker");
  if (datePicker) {
    const monthYearEl = document.getElementById("month-year");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");
    const bookingSummary = document.getElementById("booking-summary");
    const summaryDateEl = document.getElementById("summary-date");
    const summaryTimeWrap = document.getElementById("summary-time-wrap");
    const summaryTimeEl = document.getElementById("summary-time");
    const timeSlotsHint = document.getElementById("time-slots-hint");
    const dateInput = document.getElementById("date");
    const timeInput = document.getElementById("time");

    const monthNames = ["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"];
    const dayNamesFull = ["Duminică","Luni","Marți","Miercuri","Joi","Vineri","Sâmbătă"];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let viewMonth = today.getMonth();
    let viewYear = today.getFullYear();
    let selectedDate = null;
    let selectedTime = null;

    function formatDateLong(d) {
      return `${dayNamesFull[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    }

    function updateSummary() {
      if (selectedDate) {
        summaryDateEl.textContent = formatDateLong(selectedDate);
        bookingSummary.classList.remove("hidden");
        if (selectedTime) {
          summaryTimeEl.textContent = selectedTime;
          summaryTimeWrap.classList.remove("hidden");
        } else {
          summaryTimeWrap.classList.add("hidden");
        }
      } else {
        bookingSummary.classList.add("hidden");
      }
    }

    function updateNavButtons() {
      const atCurrentMonth = (viewYear === today.getFullYear() && viewMonth === today.getMonth());
      prevMonthBtn.disabled = atCurrentMonth;
    }

    function renderCalendar() {
      datePicker.innerHTML = "";
      monthYearEl.textContent = `${monthNames[viewMonth]} ${viewYear}`;
      updateNavButtons();

      const firstOfMonth = new Date(viewYear, viewMonth, 1);
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      // Monday-first offset: Sunday(0) -> 6, Monday(1) -> 0
      const startOffset = (firstOfMonth.getDay() + 6) % 7;

      for (let i = 0; i < startOffset; i++) {
        const empty = document.createElement("div");
        empty.className = "aspect-square";
        datePicker.appendChild(empty);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(viewYear, viewMonth, day);
        date.setHours(0, 0, 0, 0);

        const cell = document.createElement("button");
        cell.type = "button";
        cell.textContent = day;

        const isPast = date.getTime() < today.getTime();
        const isToday = date.getTime() === today.getTime();
        const isSelected = selectedDate && date.getTime() === selectedDate.getTime();

        cell.className = "aspect-square flex items-center justify-center text-sm rounded-full transition-all duration-200 select-none";

        if (isPast) {
          cell.classList.add("text-gray-300", "cursor-not-allowed");
          cell.disabled = true;
        } else if (isSelected) {
          cell.classList.add("bg-gradient-to-br","from-primary","to-secondary","text-white","font-bold","shadow-lg","scale-105");
          if (isToday) {
            cell.classList.add("ring-2","ring-primary/40","ring-offset-1");
          }
        } else {
          cell.classList.add("text-gray-700","hover:bg-secondary/40","hover:text-primary","hover:scale-105","font-medium","cursor-pointer");
          if (isToday) {
            cell.classList.add("ring-2","ring-primary/40","text-primary","font-bold");
          }
          cell.addEventListener("click", function () {
            selectedDate = date;
            dateInput.value = formatDateLong(date);
            updateSummary();
            renderCalendar();
            if (timeSlotsHint) timeSlotsHint.classList.add("hidden");
          });
        }

        datePicker.appendChild(cell);
      }

      // Replay grid animation
      datePicker.classList.remove("calendar-grid");
      void datePicker.offsetWidth;
      datePicker.classList.add("calendar-grid");
    }

    prevMonthBtn.addEventListener("click", function () {
      if (viewYear === today.getFullYear() && viewMonth === today.getMonth()) return;
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      renderCalendar();
    });

    nextMonthBtn.addEventListener("click", function () {
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      renderCalendar();
    });

    renderCalendar();

    // Time slots
    const timeSlotsContainer = document.getElementById("time-slots");
    if (timeSlotsContainer) {
      for (let hour = 9; hour <= 20; hour++) {
        const slot = document.createElement("button");
        slot.type = "button";
        const label = (hour < 10 ? "0" + hour : hour) + ":00";
        slot.textContent = label;
        slot.className = "py-2.5 px-2 rounded-full text-sm border border-gray-200 text-gray-700 font-medium hover:border-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer";
        slot.addEventListener("click", function () {
          timeSlotsContainer.querySelectorAll("button").forEach(el => {
            el.classList.remove("bg-primary","text-white","border-primary","shadow-md","scale-105");
            el.classList.add("border-gray-200","text-gray-700");
          });
          slot.classList.remove("border-gray-200","text-gray-700");
          slot.classList.add("bg-primary","text-white","border-primary","shadow-md","scale-105");
          selectedTime = label;
          timeInput.value = label;
          updateSummary();
        });
        timeSlotsContainer.appendChild(slot);
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", function() {
  const params = new URLSearchParams(window.location.search);
  const service = params.get('service');
  if (service) {
    const selectElem = document.querySelector('form select');
    if (selectElem) {
      const serviceMap = {
        "bridal": "Machiaj Mireasa",
        "bridal-trial": "Proba Mireasă",
        "editorial": "Machiaj de Seara",
        "special": "Machiaj Natural",
        "cofat-bucle": "Cofat Bucle",
        "indreptat-par": "Îndreptat Păr",
        "demontare-cuticule": "Demontare și Stilizare Cuticule",
        "oja-semipermanenta": "Ojă Semi-permanentă",
        "constructie-scurte": "Construcție Unghii Scurte",
        "constructie-medii": "Construcție Unghii Medii",
        "french-interior": "French de Interior",
        "babyboomer": "Babyboomer"
      };
      const mapped = serviceMap[service.toLowerCase()];
      if (mapped) {
        selectElem.value = mapped;
      }
    }
  }
});