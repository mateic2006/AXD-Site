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
    const totalImages = 20;
    
    // Create slides for all images
    for (let i = 1; i <= totalImages; i++) {
      const slide = document.createElement("div");
      slide.className = "w-full md:w-1/3 flex-shrink-0 px-4";
      slide.innerHTML = `
        <div class="relative group aspect-square overflow-hidden rounded">
          <img
            src="photos/fete/${i}.jpeg"
            alt="Portfolio ${i}"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <p class="text-white text-lg font-semibold"></p>
          </div>
        </div>
      `;
      portfolioSlider.appendChild(slide.cloneNode(true));
    }

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
          // Update hidden date input
          document.getElementById('date').value = date.toLocaleDateString();
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
        // Update hidden time input
        document.getElementById('time').value = slot.textContent;
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
        selectElem.value = "Machiaj Mireasa";
      } else if (service.toLowerCase() === "bridal-trial") {
        selectElem.value = "Proba Mireasă";
      } else if (service.toLowerCase() === "editorial") {
        selectElem.value = "Machiaj de Seara";
      } else if (service.toLowerCase() === "special") {
        selectElem.value = "Machiaj Natural";
      }
    }
  }
});