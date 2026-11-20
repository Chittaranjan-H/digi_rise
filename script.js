/**
 * DIGIRISE DIGITAL AGENCY — PRODUCTION FRONTEND CONTROLLER
 * Pure Vanilla JavaScript (ES6+)
 */

/* ==========================================================================
   1. CONFIGURATION (EDIT WHATSAPP NUMBER HERE)
   ========================================================================== */
const DIGIRISE_CONFIG = {
  // Replace 91XXXXXXXXXX with your active 12-digit WhatsApp number (e.g., "919876543210")
  WHATSAPP_NUMBER: "8310964281",
  DEFAULT_GREETING: "Hello DigiRise, I would like to discuss a website and digital presence for my business."
};

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons if loaded
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  initDynamicYear();
  initMobileNavigation();
  initScrollSpyAndBackToTop();
  initScrollReveal();
  initPricingPlanSync();
  initFaqAccordion();
  initFloatingWhatsApp();
  initContactForm();
});

/* ==========================================================================
   2. DYNAMIC COPYRIGHT YEAR
   ========================================================================== */
function initDynamicYear() {
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   3. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileNavigation() {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mainNav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".nav-link, .nav-cta-mobile");

  if (!hamburgerBtn || !mainNav) return;

  const toggleMenu = (forceClose = false) => {
    const isOpen = forceClose ? false : !mainNav.classList.contains("open");
    mainNav.classList.toggle("open", isOpen);
    hamburgerBtn.classList.toggle("open", isOpen);
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
  };

  hamburgerBtn.addEventListener("click", () => toggleMenu());

  navLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMenu(true));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mainNav.classList.contains("open")) {
      toggleMenu(true);
      hamburgerBtn.focus();
    }
  });
}

/* ==========================================================================
   4. ACTIVE SCROLL-SPY & BACK-TO-TOP VISIBILITY
   ========================================================================== */
function initScrollSpyAndBackToTop() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTopBtn = document.getElementById("backToTopBtn");

  const onScroll = () => {
    const scrollY = window.scrollY;

    // Back-to-top visibility
    if (backToTopBtn) {
      backToTopBtn.classList.toggle("visible", scrollY > 450);
    }

    // Active section indicator
    let currentSectionId = "home";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 130;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSectionId = sec.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${currentSectionId}`);
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* ==========================================================================
   5. INTERSECTION OBSERVER SCROLL REVEAL
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("active"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   6. PRICING BUTTONS TO CONTACT FORM SYNCHRONIZATION
   ========================================================================== */
function initPricingPlanSync() {
  const planButtons = document.querySelectorAll(".choose-plan-btn");
  const selectedPlanSelect = document.getElementById("selectedPlan");
  const protectionPreferenceSelect = document.getElementById("protectionPreference");
  const banner = document.getElementById("planSelectionBanner");
  const bannerText = document.getElementById("bannerPlanText");
  const contactSection = document.getElementById("contact");

  if (!selectedPlanSelect || !protectionPreferenceSelect) return;

  const updatePlanBanner = (planLabel) => {
    if (!banner || !bannerText) return;
    if (planLabel && planLabel !== "Not Decided Yet") {
      bannerText.textContent = planLabel;
      banner.hidden = false;
    } else {
      banner.hidden = true;
    }
  };

  planButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const planLabel = btn.getAttribute("data-plan-label");
      const shieldPref = btn.getAttribute("data-shield");

      selectedPlanSelect.value = planLabel;
      protectionPreferenceSelect.value = shieldPref;
      updatePlanBanner(planLabel);

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Bidirectional sync if user manually changes the dropdown in the form
  selectedPlanSelect.addEventListener("change", () => {
    const val = selectedPlanSelect.value;
    if (val.includes("With Protection Shield")) {
      protectionPreferenceSelect.value = "With Protection Shield";
    } else if (val.includes("Without Protection Shield")) {
      protectionPreferenceSelect.value = "Without Protection Shield";
    }
    updatePlanBanner(val);
  });
}

/* ==========================================================================
   7. ACCESSIBLE FAQ ACCORDION (Single Item Open)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all items first
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("open");
        const otherBtn = otherItem.querySelector(".faq-question");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
      });

      // Open clicked item if it wasn't already open
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ==========================================================================
   8. FLOATING WHATSAPP BUTTON
   ========================================================================== */
function initFloatingWhatsApp() {
  const floatBtn = document.getElementById("floatingWhatsappBtn");
  if (!floatBtn) return;

  floatBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const encodedMsg = encodeURIComponent(DIGIRISE_CONFIG.DEFAULT_GREETING);
    const waUrl = `https://wa.me/${DIGIRISE_CONFIG.WHATSAPP_NUMBER}?text=${encodedMsg}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  });
}

/* ==========================================================================
   9. CONTACT FORM VALIDATION & WHATSAPP INQUIRY GENERATOR
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("inquiryForm");
  const feedbackEl = document.getElementById("formFeedback");

  if (!form) return;

  const setFieldError = (inputId, errorId, message) => {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errorId);
    if (input) input.classList.toggle("invalid", Boolean(message));
    if (err) err.textContent = message || "";
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const businessName = document.getElementById("businessName").value.trim();
    const emailAddress = document.getElementById("emailAddress").value.trim();
    const whatsappNumber = document.getElementById("whatsappNumber").value.trim();
    const businessCategory = document.getElementById("businessCategory").value;
    const serviceRequired = document.getElementById("serviceRequired").value;
    const selectedPlan = document.getElementById("selectedPlan").value;
    const protectionPreference = document.getElementById("protectionPreference").value;
    const additionalMessage = document.getElementById("additionalMessage").value.trim();

    let isValid = true;

    // 1. Name validation
    if (fullName.length < 2) {
      setFieldError("fullName", "fullNameError", "Please enter your full name.");
      isValid = false;
    } else {
      setFieldError("fullName", "fullNameError", "");
    }

    // 2. Business Name validation
    if (businessName.length < 2) {
      setFieldError("businessName", "businessNameError", "Please enter your business name.");
      isValid = false;
    } else {
      setFieldError("businessName", "businessNameError", "");
    }

    // 3. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      setFieldError("emailAddress", "emailAddressError", "Please enter a valid email address.");
      isValid = false;
    } else {
      setFieldError("emailAddress", "emailAddressError", "");
    }

    // 4. WhatsApp phone number validation (10 to 15 digits)
    const cleanedPhone = whatsappNumber.replace(/[\s\-+()]/g, "");
    if (!/^\d{10,15}$/.test(cleanedPhone)) {
      setFieldError("whatsappNumber", "whatsappNumberError", "Please enter a valid 10 to 15 digit WhatsApp number.");
      isValid = false;
    } else {
      setFieldError("whatsappNumber", "whatsappNumberError", "");
    }

    // 5. Business Category validation
    if (!businessCategory) {
      setFieldError("businessCategory", "businessCategoryError", "Please select your business category.");
      isValid = false;
    } else {
      setFieldError("businessCategory", "businessCategoryError", "");
    }

    if (!isValid) return;

    // Construct Exact Required WhatsApp Message
    const messageLines = [
      "Hello DigiRise,",
      "I am interested in your digital services.",
      "",
      `Name: ${fullName}`,
      `Business: ${businessName}`,
      `Email: ${emailAddress}`,
      `WhatsApp: ${whatsappNumber}`,
      `Business Category: ${businessCategory}`,
      `Service Required: ${serviceRequired}`,
      `Selected Plan: ${selectedPlan}`,
      `Protection Shield: ${protectionPreference}`,
      "Additional Requirements:",
      additionalMessage || "None specified",
      "",
      "Please contact me to discuss the next steps."
    ];

    const encodedMessage = encodeURIComponent(messageLines.join("\n"));
    const whatsappUrl = `https://wa.me/${DIGIRISE_CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;

    if (feedbackEl) {
      const isPlaceholderNumber = DIGIRISE_CONFIG.WHATSAPP_NUMBER.includes("X");
      feedbackEl.hidden = false;
      feedbackEl.innerHTML = isPlaceholderNumber
        ? "<strong>WhatsApp handoff ready:</strong> Opening WhatsApp now. (Developer Note: Replace <code>91XXXXXXXXXX</code> in <code>script.js</code> with your real WhatsApp number before publishing). Remember to review and press <strong>Send</strong> in WhatsApp."
        : "<strong>WhatsApp opened!</strong> Please review your pre-filled inquiry and press <strong>Send</strong> inside WhatsApp to complete your message.";
    }

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}
