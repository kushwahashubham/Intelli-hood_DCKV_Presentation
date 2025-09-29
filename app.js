class KlimaGlobalPresentation {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 22;
    this.isTransitioning = false;
    this.charts = {};
    this.chartsInitialized = false;
    this.facilityPerformanceData = [
      {
        key: "corp-office-building",
        label: "Corp & Office Building",
        avgSpeed: 51.59,
        savings: 86.27,
      },
      {
        key: "correctional-facility",
        label: "Correctional Facility",
        avgSpeed: 52.04,
        savings: 85.91,
      },
      {
        key: "gov-military",
        label: "Gov, Military",
        avgSpeed: 45.5,
        savings: 90.58,
      },
      {
        key: "gov-other",
        label: "Gov, Other",
        avgSpeed: 65.83,
        savings: 71.47,
      },
      {
        key: "health-hospital",
        label: "Health, Hospital",
        avgSpeed: 69.49,
        savings: 66.44,
      },
      {
        key: "health-other",
        label: "Health, Other",
        avgSpeed: 47.22,
        savings: 89.47,
      },
      {
        key: "health-senior-living-healthcare",
        label: "Health, Senior Living & Healthcare",
        avgSpeed: 55.79,
        savings: 82.64,
      },
      {
        key: "casinos",
        label: "Casinos",
        avgSpeed: 54.24,
        savings: 84.04,
      },
      {
        key: "convention-center",
        label: "Convention Center",
        avgSpeed: 51.52,
        savings: 86.32,
      },
      {
        key: "country-club",
        label: "Country Club",
        avgSpeed: 47.47,
        savings: 89.3,
      },
      {
        key: "hotels-lodging",
        label: "Hotels & Lodging",
        avgSpeed: 66.14,
        savings: 71.07,
      },
      {
        key: "rec-other",
        label: "Rec, Other",
        avgSpeed: 48.07,
        savings: 88.89,
      },
      {
        key: "sporting-venue",
        label: "Sporting Venue",
        avgSpeed: 59.86,
        savings: 78.55,
      },
      {
        key: "theme-park",
        label: "Theme Park",
        avgSpeed: 79.54,
        savings: 49.68,
      },
      {
        key: "schools-k-12",
        label: "Schools, K-12",
        avgSpeed: 43.66,
        savings: 91.68,
      },
      {
        key: "schools-tech-culinary-other",
        label: "Schools, Tech/Culinary Other",
        avgSpeed: 45.64,
        savings: 90.49,
      },
      {
        key: "university",
        label: "University",
        avgSpeed: 53.87,
        savings: 84.37,
      },
      {
        key: "dinner-house",
        label: "Dinner House",
        avgSpeed: 72.0,
        savings: 62.68,
      },
      {
        key: "grocery",
        label: "Grocery",
        avgSpeed: 61.14,
        savings: 77.15,
      },
      {
        key: "quickserve",
        label: "Quickserve",
        avgSpeed: 65.9,
        savings: 71.38,
      },
      {
        key: "aggregate",
        label: "Aggregate",
        avgSpeed: 56.82,
        savings: 81.66,
      },
    ];

    // DOM elements
    this.slides = document.querySelectorAll(".slide");
    this.progressFill = document.querySelector(".progress-fill");
    this.currentSlideIndicator = document.querySelector(".current-slide");
    this.totalSlidesIndicator = document.querySelector(".total-slides");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.fullscreenBtn = document.getElementById("fullscreenBtn");

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateSlideIndicator();
    this.updateProgressBar();
    this.setupROICalculator();

    // Initialize first slide
    this.showSlide(this.currentSlide, false);

    // Initialize charts after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.initializeCharts();
    }, 500);

    console.log("Klima Global Presentation initialized successfully!");
  }

  bindEvents() {
    // Navigation buttons
    this.prevBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      this.previousSlide();
    });

    this.nextBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      this.nextSlide();
    });

    this.fullscreenBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggleFullscreen();
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (this.isTransitioning) return;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          this.previousSlide();
          break;
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          this.nextSlide();
          break;
        case "Home":
          e.preventDefault();
          this.goToSlide(1);
          break;
        case "End":
          e.preventDefault();
          this.goToSlide(this.totalSlides);
          break;
        case "f":
        case "F":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            this.toggleFullscreen();
          }
          break;
        case "Escape":
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
      }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      },
      { passive: true }
    );

    document.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
      },
      { passive: true }
    );

    // Click navigation (avoid conflicts with interactive elements)
    document.addEventListener("click", (e) => {
      // Don't advance on interactive elements
      if (
        e.target.matches("input, button, select, .nav-btn, .btn, a") ||
        e.target.closest(
          ".calculator-inputs, .calculator-results, .presentation-header, .contact-card"
        )
      ) {
        return;
      }

      if (this.isTransitioning) return;

      // Click to advance slides
      this.nextSlide();
    });

    // Window resize handler
    window.addEventListener("resize", () => {
      this.handleResize();
    });

    // Fullscreen change handler
    document.addEventListener("fullscreenchange", () => {
      this.handleFullscreenChange();
    });
  }

  handleSwipe(startX, endX, startY, endY) {
    if (this.isTransitioning) return;

    const minSwipeDistance = 50;
    const maxVerticalDistance = 100;

    const horizontalDistance = endX - startX;
    const verticalDistance = Math.abs(endY - startY);

    // Only process horizontal swipes
    if (verticalDistance > maxVerticalDistance) return;

    if (Math.abs(horizontalDistance) > minSwipeDistance) {
      if (horizontalDistance > 0) {
        this.previousSlide();
      } else {
        this.nextSlide();
      }
    }
  }

  nextSlide() {
    if (this.isTransitioning || this.currentSlide >= this.totalSlides) return;
    this.goToSlide(this.currentSlide + 1);
  }

  previousSlide() {
    if (this.isTransitioning || this.currentSlide <= 1) return;
    this.goToSlide(this.currentSlide - 1);
  }

  goToSlide(slideNumber) {
    if (
      this.isTransitioning ||
      slideNumber < 1 ||
      slideNumber > this.totalSlides
    )
      return;

    const previousSlide = this.currentSlide;
    this.currentSlide = slideNumber;
    this.showSlide(slideNumber, true, previousSlide);
    this.updateSlideIndicator();
    this.updateProgressBar();
    this.handleSlideSpecificActions(slideNumber);
  }

  showSlide(slideNumber, animate = true, previousSlideNumber = null) {
    if (this.isTransitioning) return;

    this.isTransitioning = true;

    // Hide all slides
    this.slides.forEach((slide) => {
      slide.classList.remove("active", "prev");
    });

    // Show current slide
    const currentSlideElement = document.querySelector(
      `[data-slide="${slideNumber}"]`
    );
    if (currentSlideElement) {
      if (animate) {
        // Smooth transition
        setTimeout(() => {
          currentSlideElement.classList.add("active");
          this.animateSlideElements(currentSlideElement);
        }, 50);
      } else {
        currentSlideElement.classList.add("active");
        this.animateSlideElements(currentSlideElement);
      }
    }

    // Set previous slide if applicable
    if (previousSlideNumber) {
      const prevSlideElement = document.querySelector(
        `[data-slide="${previousSlideNumber}"]`
      );
      if (prevSlideElement) {
        prevSlideElement.classList.add("prev");
      }
    }

    setTimeout(
      () => {
        this.isTransitioning = false;
      },
      animate ? 600 : 100
    );
  }

  animateSlideElements(slideElement) {
    // Animate cards and elements with stagger
    const animatedElements = slideElement.querySelectorAll(
      ".achievement-card, .feature-card, .component-item, .flow-step, .metric-card, .stat-highlight, .pillar, .result-card, .insight-card, .property-card, .benefit-callout, .timeline-step"
    );

    animatedElements.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";
      element.style.transition = "none";

      setTimeout(() => {
        element.style.transition = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, index * 100 + 300);
    });
  }

  updateSlideIndicator() {
    if (this.currentSlideIndicator) {
      this.currentSlideIndicator.textContent = this.currentSlide;
    }
    if (this.totalSlidesIndicator) {
      this.totalSlidesIndicator.textContent = this.totalSlides;
    }

    // Update navigation buttons
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentSlide === 1;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentSlide === this.totalSlides;
    }
  }

  updateProgressBar() {
    const progress = (this.currentSlide / this.totalSlides) * 100;
    if (this.progressFill) {
      this.progressFill.style.width = `${progress}%`;
    }
  }

  handleSlideSpecificActions(slideNumber) {
    // Add delay to ensure slide is visible before rendering charts
    setTimeout(() => {
      switch (slideNumber) {
        case 9: // Law of Affinity chart
          this.renderAffinityChart();
          break;
        case 10: // Facility performance chart
          this.renderFacilityChart();
          break;
        case 11: // Calculator slide
          this.calculateROI();
          break;
      }
    }, 700);
  }

  initializeCharts() {
    // Only initialize once
    if (this.chartsInitialized) return;

    // Check if Chart.js is available
    if (typeof Chart === "undefined") {
      console.error("Chart.js is not loaded. Charts will not be available.");
      return;
    }

    // Configure Chart.js defaults
    Chart.defaults.font.family = "Inter, sans-serif";
    Chart.defaults.font.size = 14;
    Chart.defaults.color = "#475569";
    Chart.defaults.plugins.legend.display = true;
    Chart.defaults.plugins.tooltip.backgroundColor = "rgba(15, 23, 42, 0.9)";
    Chart.defaults.plugins.tooltip.titleColor = "#ffffff";
    Chart.defaults.plugins.tooltip.bodyColor = "#ffffff";
    Chart.defaults.plugins.tooltip.cornerRadius = 8;

    this.chartsInitialized = true;
    console.log("Charts initialized successfully");
  }

  renderAffinityChart() {
    const canvas = document.getElementById("affinityChart");
    if (!canvas) {
      console.error("Affinity chart canvas not found");
      return;
    }

    if (typeof Chart === "undefined") {
      console.error("Chart.js is not available");
      return;
    }

    // Destroy existing chart
    if (this.charts.affinity) {
      this.charts.affinity.destroy();
    }

    const ctx = canvas.getContext("2d");

    const fanSpeeds = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const energySavings = [100, 100, 99, 97, 94, 88, 78, 66, 49, 27, 0];

    try {
      this.charts.affinity = new Chart(ctx, {
        type: "line",
        data: {
          labels: fanSpeeds.map((speed) => `${speed}%`),
          datasets: [
            {
              label: "Energy Savings (%)",
              data: energySavings,
              borderColor: "#0891b2",
              backgroundColor: "rgba(8, 145, 178, 0.1)",
              borderWidth: 4,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "#0891b2",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 3,
              pointRadius: 6,
              pointHoverRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Law of Affinity: Fan Speed vs Energy Savings",
              font: {
                size: 18,
                weight: "bold",
              },
              color: "#1e40af",
              padding: 20,
            },
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.parsed.y}% Energy Savings at ${context.label} Fan Speed`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Fan Speed (%)",
                font: {
                  size: 16,
                  weight: "bold",
                },
                color: "#1e40af",
              },
              grid: {
                color: "rgba(203, 213, 225, 0.5)",
              },
            },
            y: {
              title: {
                display: true,
                text: "Energy Savings (%)",
                font: {
                  size: 16,
                  weight: "bold",
                },
                color: "#1e40af",
              },
              min: 0,
              max: 100,
              grid: {
                color: "rgba(203, 213, 225, 0.5)",
              },
            },
          },
          elements: {
            point: {
              hoverRadius: 10,
            },
          },
        },
      });

      console.log("Affinity chart rendered successfully");
    } catch (error) {
      console.error("Error rendering affinity chart:", error);
    }
  }

  renderFacilityChart() {
    const canvas = document.getElementById("facilityChart");
    if (!canvas) {
      console.error("Facility chart canvas not found");
      return;
    }

    if (typeof Chart === "undefined") {
      console.error("Chart.js is not available");
      return;
    }

    // Destroy existing chart
    if (this.charts.facility) {
      this.charts.facility.destroy();
    }

    const ctx = canvas.getContext("2d");

    const facilityData = this.facilityPerformanceData;

    try {
      this.charts.facility = new Chart(ctx, {
        type: "bar",
        data: {
          labels: facilityData.map((d) => d.label),
          datasets: [
            {
              label: "Average Fan Speed (%)",
              data: facilityData.map((d) => d.avgSpeed),
              backgroundColor: "#1FB8CD",
              borderColor: "#0891b2",
              borderWidth: 2,
              yAxisID: "y",
            },
            {
              label: "Energy Savings (%)",
              data: facilityData.map((d) => d.savings),
              backgroundColor: "#FFC185",
              borderColor: "#f59e0b",
              borderWidth: 2,
              yAxisID: "y1",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Real Performance Data by Facility Type",
              font: {
                size: 18,
                weight: "bold",
              },
              color: "#1e40af",
              padding: 20,
            },
            legend: {
              position: "top",
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 14,
                  weight: "500",
                },
              },
            },
            tooltip: {
              callbacks: {
                afterLabel: function (context) {
                  if (context.datasetIndex === 0) {
                    return "Average fan speed during operation";
                  } else {
                    return "Typical energy savings achieved";
                  }
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Facility Type",
                font: {
                  size: 16,
                  weight: "bold",
                },
                color: "#1e40af",
              },
              ticks: {
                maxRotation: 45,
                minRotation: 45,
              },
              grid: {
                display: false,
              },
            },
            y: {
              type: "linear",
              display: true,
              position: "left",
              title: {
                display: true,
                text: "Average Fan Speed (%)",
                color: "#0891b2",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
              min: 0,
              max: 100,
              grid: {
                color: "rgba(203, 213, 225, 0.3)",
              },
            },
            y1: {
              type: "linear",
              display: true,
              position: "right",
              title: {
                display: true,
                text: "Energy Savings (%)",
                color: "#f59e0b",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
              min: 0,
              max: 100,
              grid: {
                drawOnChartArea: false,
              },
            },
          },
        },
      });

      console.log("Facility chart rendered successfully");
    } catch (error) {
      console.error("Error rendering facility chart:", error);
    }
  }

  setupROICalculator() {
    // Facility type mappings
    const facilityOptions = this.facilityPerformanceData.filter(
      (item) => item.key !== "aggregate"
    );

    this.facilityTypes = facilityOptions.reduce((acc, item) => {
      acc[item.key] = {
        avgSpeed: item.avgSpeed,
        savings: item.savings,
        baseUsage: 18,
      };
      return acc;
    }, {});

    this.defaultFacilityKey = facilityOptions[0]?.key || null;

    const facilityTypeSelect = document.getElementById("facilityType");
    if (facilityTypeSelect) {
      facilityTypeSelect.innerHTML = "";
      facilityOptions.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.key;
        option.textContent = item.label;
        facilityTypeSelect.appendChild(option);
      });

      if (this.defaultFacilityKey) {
        facilityTypeSelect.value = this.defaultFacilityKey;
      }
    }

    // Bind calculator input events
    const inputs = [
      "facilityType",
      "hoodCount",
      "motorPower",
      "operatingHours",
      "energyCost",
    ];
    inputs.forEach((inputId) => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener("input", () => this.calculateROI());
        input.addEventListener("change", () => this.calculateROI());
      }
    });

    console.log("ROI calculator setup completed");
  }

  calculateROI() {
    try {
      const facilityTypeElement = document.getElementById("facilityType");
      const hoodCountElement = document.getElementById("hoodCount");
      const motorPowerElement = document.getElementById("motorPower");
      const operatingHoursElement = document.getElementById("operatingHours");
      const energyCostElement = document.getElementById("energyCost");

      if (
        !facilityTypeElement ||
        !hoodCountElement ||
        !motorPowerElement ||
        !operatingHoursElement ||
        !energyCostElement
      ) {
        console.log("Calculator elements not found, skipping calculation");
        return;
      }

      const facilityType = facilityTypeElement.value || this.defaultFacilityKey;
      const fallbackKey =
        this.defaultFacilityKey || Object.keys(this.facilityTypes)[0];

      const hoodCount = parseFloat(hoodCountElement.value) || 8;
      const motorPower = parseFloat(motorPowerElement.value) || 5;
      const operatingHours = parseFloat(operatingHoursElement.value) || 16;
      const energyCost = parseFloat(energyCostElement.value) || 0.12;

      if (
        hoodCount <= 0 ||
        motorPower <= 0 ||
        operatingHours <= 0 ||
        energyCost <= 0
      ) {
        console.log("Invalid input values, using defaults");
        return;
      }

      // Get facility-specific data
      const facilityData =
        this.facilityTypes[facilityType] || this.facilityTypes[fallbackKey];

      if (!facilityData) {
        console.warn("No facility data available for calculator");
        return;
      }

      // Calculate energy consumption
      // Motor power in HP, convert to kW (1 HP = 0.746 kW)
      const totalMotorPowerKW = hoodCount * motorPower * 0.746;

      // Add makeup air consumption (typically 80% of exhaust)
      const totalSystemPowerKW = totalMotorPowerKW * 1.8;

      // Daily and annual energy consumption
      const dailyEnergyKWh = totalSystemPowerKW * operatingHours;
      const annualEnergyKWh = dailyEnergyKWh * 365;

      // Calculate savings based on facility type
      const actualSavingsRate = facilityData.savings / 100;
      const energySavedKWh = annualEnergyKWh * actualSavingsRate;
      const annualSavings = energySavedKWh * energyCost;

      // Calculate system cost (estimated based on hood count)
      const costPerHood = 12000; // Average cost per hood including installation
      const systemCost = hoodCount * costPerHood;

      // Payback period
      const paybackYears = systemCost / annualSavings;

      // CO2 reduction (0.385 kg CO2 per kWh saved (global average))
      const co2ReductionKg = energySavedKWh * 0.385;

      // 10-year ROI
      const tenYearSavings = annualSavings * 10;
      const tenYearROI = ((tenYearSavings - systemCost) / systemCost) * 100;

      // Update display with animation
      this.updateCalculatorResults({
        annualSavings: annualSavings,
        paybackPeriod: paybackYears,
        co2Reduction: co2ReductionKg,
        tenYearROI: tenYearROI,
      });

      console.log("ROI calculation completed:", {
        facilityType,
        hoodCount,
        motorPower,
        operatingHours,
        energyCost,
        annualSavings,
        paybackYears,
        co2ReductionKg,
        tenYearROI,
      });
    } catch (error) {
      console.error("Error in ROI calculation:", error);
    }
  }

  updateCalculatorResults(results) {
    const updates = [
      {
        id: "annualSavings",
        value: `$${Math.round(results.annualSavings).toLocaleString()}`,
      },
      {
        id: "paybackPeriod",
        value: `${results.paybackPeriod.toFixed(1)} years`,
      },
      {
        id: "co2Reduction",
        value: `${Math.round(results.co2Reduction).toLocaleString()} kg/year`,
      },
      {
        id: "tenYearROI",
        value: `${Math.round(results.tenYearROI)}%`,
      },
    ];

    updates.forEach((update) => {
      const element = document.getElementById(update.id);
      if (element) {
        this.animateNumberChange(element, update.value);
      }
    });

    console.log("Calculator results updated");
  }

  animateNumberChange(element, newValue) {
    element.style.transform = "scale(1.1)";
    element.style.color = "#0891b2";
    element.style.transition = "all 0.2s ease-out";

    setTimeout(() => {
      element.textContent = newValue;
      element.style.transform = "scale(1)";
      element.style.color = "";
    }, 100);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  handleFullscreenChange() {
    const isFullscreen = !!document.fullscreenElement;

    if (this.fullscreenBtn) {
      const icon = this.fullscreenBtn.querySelector("i");
      if (icon) {
        icon.className = isFullscreen ? "fas fa-compress" : "fas fa-expand";
      }
    }

    // Adjust charts for fullscreen
    setTimeout(() => {
      Object.values(this.charts).forEach((chart) => {
        if (chart && typeof chart.resize === "function") {
          chart.resize();
        }
      });
    }, 100);

    // Handle cursor in fullscreen
    if (isFullscreen) {
      this.setupFullscreenCursor();
    } else {
      this.clearFullscreenCursor();
    }
  }

  setupFullscreenCursor() {
    let cursorTimeout;
    const hideCursor = () => {
      document.body.style.cursor = "none";
    };

    const showCursor = () => {
      document.body.style.cursor = "default";
      clearTimeout(cursorTimeout);
      cursorTimeout = setTimeout(hideCursor, 3000);
    };

    document.addEventListener("mousemove", showCursor);
    document.addEventListener("keydown", showCursor);

    // Initial hide after 3 seconds
    cursorTimeout = setTimeout(hideCursor, 3000);

    this.fullscreenCursorHandler = { showCursor, hideCursor, cursorTimeout };
  }

  clearFullscreenCursor() {
    if (this.fullscreenCursorHandler) {
      document.removeEventListener(
        "mousemove",
        this.fullscreenCursorHandler.showCursor
      );
      document.removeEventListener(
        "keydown",
        this.fullscreenCursorHandler.showCursor
      );
      clearTimeout(this.fullscreenCursorHandler.cursorTimeout);
      document.body.style.cursor = "default";
      this.fullscreenCursorHandler = null;
    }
  }

  handleResize() {
    // Resize charts
    setTimeout(() => {
      Object.values(this.charts).forEach((chart) => {
        if (chart && typeof chart.resize === "function") {
          chart.resize();
        }
      });
    }, 100);
  }

  // Public methods for external access
  getCurrentSlide() {
    return this.currentSlide;
  }

  getTotalSlides() {
    return this.totalSlides;
  }

  isInFullscreen() {
    return !!document.fullscreenElement;
  }
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return Math.round(num).toString();
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Enhanced loading and error handling
function showLoadingState(element) {
  if (element) {
    element.style.opacity = "0.6";
    element.style.pointerEvents = "none";
  }
}

function hideLoadingState(element) {
  if (element) {
    element.style.opacity = "1";
    element.style.pointerEvents = "auto";
  }
}

// Global ROI calculation function for HTML onclick
function calculateROI() {
  console.log("Global calculateROI function called");
  if (window.klimaPresentation) {
    window.klimaPresentation.calculateROI();
  } else {
    console.error("Klima presentation not initialized");
  }
}

// Performance monitoring
function trackSlideView(slideNumber) {
  // Analytics tracking would go here
  console.log(`Viewed slide ${slideNumber}`);
}

function trackCalculatorUsage() {
  // Analytics tracking would go here
  console.log("ROI calculator used");
}

// Initialize application when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded");

  // Check for required dependencies
  if (typeof Chart === "undefined") {
    console.warn("Chart.js not loaded. Charts will not be available.");
  } else {
    console.log("Chart.js is available");
  }

  // Initialize the presentation app
  try {
    window.klimaPresentation = new KlimaGlobalPresentation();
    console.log("Presentation app initialized successfully");
  } catch (error) {
    console.error("Failed to initialize presentation app:", error);
  }

  // Add performance optimizations
  setupPerformanceOptimizations();

  // Add accessibility features
  setupAccessibilityFeatures();

  // Handle images loading
  setupImageLoading();

  console.log("Klima Global Presentation fully loaded!");
  console.log("Controls: Arrow keys, Space, Page Up/Down for navigation");
  console.log("Shortcuts: F for fullscreen, Home/End for first/last slide");
});

function setupPerformanceOptimizations() {
  // Optimize images with lazy loading
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            img.classList.remove("lazy");
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Prefetch critical resources
  const criticalResources = [
    "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/e10a9dd5-90ba-4dd5-8716-565c2633c7a4.png",
    "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/28eb7bf1-ffb9-46e4-8412-04db42a4d2be.png",
  ];

  criticalResources.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  });
}

function setupAccessibilityFeatures() {
  // Add ARIA labels
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    if (!btn.getAttribute("aria-label")) {
      btn.setAttribute("aria-label", btn.title || btn.textContent);
    }
  });

  // Add keyboard focus indicators
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      document.body.classList.add("keyboard-navigation");
    }
  });

  document.addEventListener("mousedown", () => {
    document.body.classList.remove("keyboard-navigation");
  });

  // Add screen reader announcements for slide changes
  const slideAnnouncer = document.createElement("div");
  slideAnnouncer.setAttribute("aria-live", "polite");
  slideAnnouncer.setAttribute("aria-atomic", "true");
  slideAnnouncer.style.position = "absolute";
  slideAnnouncer.style.left = "-10000px";
  slideAnnouncer.style.width = "1px";
  slideAnnouncer.style.height = "1px";
  slideAnnouncer.style.overflow = "hidden";
  document.body.appendChild(slideAnnouncer);

  window.announceSlideChange = function (slideNumber, totalSlides) {
    slideAnnouncer.textContent = `Slide ${slideNumber} of ${totalSlides}`;
  };
}

function setupImageLoading() {
  // Add loading states for images
  document.querySelectorAll("img").forEach((img) => {
    if (!img.complete) {
      img.style.opacity = "0";
      img.style.transition = "opacity 0.3s ease-in-out";

      img.addEventListener("load", function () {
        this.style.opacity = "1";
      });

      img.addEventListener("error", function () {
        this.style.opacity = "1";
        console.warn(`Failed to load image: ${this.src}`);
      });
    }
  });
}

// Error handling
window.addEventListener("error", function (e) {
  console.error("Application error:", e.error);
  // Could send error reports to analytics here
});

window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled promise rejection:", e.reason);
});

// Export for potential external access
if (typeof module !== "undefined" && module.exports) {
  module.exports = { KlimaGlobalPresentation };
}
