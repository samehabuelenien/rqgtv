/**
 * rqgstore - Main JavaScript File
 * Combines all functionality from main.js and inline scripts
 */

// ========== SEO & OUTBOUND LINK ENHANCEMENT ==========

/**
 * Enhanced Outbound Link Management
 * Automatically adds tracking parameters and security attributes
 */
function enhanceOutboundLinks() {
  const outboundLinks = document.querySelectorAll("a[data-out]");

  outboundLinks.forEach((link) => {
    // Add security attributes
    link.setAttribute("rel", "noopener");
    link.setAttribute("target", "_blank");

    // Get current URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const currentHref = link.getAttribute("href");

    if (!currentHref) return;

    try {
      const linkUrl = new URL(currentHref);

      // Check for existing ad tracking parameters in current page URL
      const adParams = ["gclid", "gbraid", "wbraid"];
      let hasAdParams = false;

      adParams.forEach((param) => {
        if (urlParams.has(param)) {
          linkUrl.searchParams.set(param, urlParams.get(param));
          hasAdParams = true;
        }
      });

      // If no ad parameters found, add default UTM tags
      if (!hasAdParams) {
        linkUrl.searchParams.set("utm_source", "landing");
        linkUrl.searchParams.set("utm_medium", "cta");
        linkUrl.searchParams.set("utm_campaign", "iptv_sa");
      }

      // Update the link href
      link.setAttribute("href", linkUrl.toString());
    } catch (error) {
      console.warn("Invalid URL in outbound link:", currentHref, error);
    }
  });
}

/**
 * Add contextual internal links for SEO
 * DISABLED - Internal SEO links functionality has been turned off
 */
function addInternalSEOLinks() {
  // Internal SEO linking has been disabled
  // This function now does nothing and returns early
  return;
}

/**
 * Remove existing internal SEO links from the page
 */
function removeInternalSEOLinks() {
  // Remove all internal SEO links
  const internalLinks = document.querySelectorAll('.internal-seo-link');
  internalLinks.forEach(link => {
    link.remove();
  });
  
  // Remove all SEO link wrappers
  const seoWrappers = document.querySelectorAll('.seo-link-wrapper');
  seoWrappers.forEach(wrapper => {
    wrapper.remove();
  });
  
  console.log(`Removed ${internalLinks.length} internal SEO links and ${seoWrappers.length} SEO link wrappers`);
}

/**
 * Initialize SEO enhancements
 */
function initializeSEOEnhancements() {
  // Enhance outbound links
  enhanceOutboundLinks();

  // Remove any existing internal SEO links (functionality disabled)
  removeInternalSEOLinks();
  
  // Internal SEO links are now disabled
  // addInternalSEOLinks(); // DISABLED

  // Re-run enhancement when new content is dynamically loaded
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        enhanceOutboundLinks();
        // Remove any new internal SEO links that might appear
        removeInternalSEOLinks();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// ========== MAIN APPLICATION ==========

document.addEventListener("DOMContentLoaded", function () {
  // Initialize SEO enhancements first
  initializeSEOEnhancements();
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }

  // Set current year in footer
  const currentYearElement = document.getElementById("current-year");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      e.preventDefault();
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for fixed header
          behavior: "smooth",
        });
      }
    });
  });

  // Header and Navigation
  const header = document.getElementById("header");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navMenu = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const backToTopBtn = document.getElementById("backToTop");
  const ctaButton = document.getElementById("ctaButton");

  // Mobile menu functionality
  if (mobileMenuBtn && navMenu) {
    const toggleMobileMenu = (isExpanded) => {
      mobileMenuBtn.setAttribute("aria-expanded", isExpanded);
      navMenu.classList.toggle("active", isExpanded);
      mobileMenuBtn.classList.toggle("active", isExpanded);
      document.body.style.overflow = isExpanded ? "hidden" : "";

      if (isExpanded) {
        document.addEventListener("keydown", handleEscapeKey);
      } else {
        document.removeEventListener("keydown", handleEscapeKey);
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        toggleMobileMenu(false);
      }
    };

    mobileMenuBtn.addEventListener("click", () => {
      const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
      toggleMobileMenu(!isExpanded);
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      const isClickInside =
        navMenu.contains(e.target) || mobileMenuBtn.contains(e.target);
      if (!isClickInside && navMenu.classList.contains("active")) {
        toggleMobileMenu(false);
      }
    });

    // Close mobile menu when clicking on a nav link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 992) {
          toggleMobileMenu(false);
        }
      });
    });
  }

  // Header scroll effect
  if (header) {
    let lastScroll = 0;
    const headerHeight = header.offsetHeight;
    let ticking = false;

    const updateHeader = () => {
      const currentScroll = window.pageYOffset;

      // Add/remove scrolled class based on scroll position
      header.classList.toggle("scrolled", currentScroll > 50);

      // Only run the hide/show logic if not in mobile menu
      if (!navMenu || !navMenu.classList.contains("active")) {
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > headerHeight) {
          // Scrolling down
          header.classList.add("hide");
        } else {
          // Scrolling up
          header.classList.remove("hide");
        }
      }

      // Show/hide back to top button
      if (backToTopBtn) {
        backToTopBtn.classList.toggle("show", currentScroll > 300);
      }

      lastScroll = currentScroll <= 0 ? 0 : currentScroll;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateHeader(); // Initialize header state
  }

  // Back to top button
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      // Focus on header for keyboard users
      const header = document.querySelector("header");
      if (header) {
        header.setAttribute("tabindex", "-1");
        header.focus();
      }
    });
  }

  // Set active navigation link based on scroll position
  const setActiveLink = () => {
    const scrollPosition = window.scrollY + 100;

    document.querySelectorAll("section[id]").forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${sectionId}`
          );
        });
      }
    });
  };

  // Run on load and scroll
  window.addEventListener("load", setActiveLink);
  window.addEventListener("scroll", setActiveLink, { passive: true });

  // CTA Button hover effect
  if (ctaButton) {
    const updateCtaHover = (isHovered) => {
      const icon = ctaButton.querySelector("i");
      if (icon) {
        icon.style.transform = isHovered ? "translateX(-5px)" : "translateX(0)";
      }
    };

    ctaButton.addEventListener("mouseenter", () => updateCtaHover(true));
    ctaButton.addEventListener("mouseleave", () => updateCtaHover(false));
    ctaButton.addEventListener("focus", () => updateCtaHover(true));
    ctaButton.addEventListener("blur", () => updateCtaHover(false));
  }

  // Add animation to nav items on page load
  if (navLinks.length > 0) {
    navLinks.forEach((link, index) => {
      link.style.opacity = "0";
      link.style.transform = "translateY(10px)";
      link.style.transition = `opacity 0.3s ease ${
        index * 0.1
      }s, transform 0.3s ease ${index * 0.1}s`;

      // Trigger reflow
      void link.offsetWidth;

      link.style.opacity = "1";
      link.style.transform = "translateY(0)";
    });
  }

  // Handle reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = "auto";
  }

  // Initialize accordion functionality
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    const panel = item.querySelector(".accordion-panel");
    const icon = header.querySelector(".fa-plus");

    header.addEventListener("click", () => {
      // Toggle the expanded state
      const isExpanded = header.getAttribute("aria-expanded") === "true";

      // Close all other accordion items
      document.querySelectorAll(".accordion-item").forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem
            .querySelector(".accordion-header")
            .setAttribute("aria-expanded", "false");
          otherItem.querySelector(".accordion-panel").style.maxHeight = null;
          otherItem.querySelector(".fa-plus").classList.remove("fa-minus");
          otherItem.querySelector(".fa-plus").classList.add("fa-plus");
        }
      });

      // Toggle current item
      if (!isExpanded) {
        header.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
        icon.classList.remove("fa-plus");
        icon.classList.add("fa-minus");
      } else {
        header.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = null;
        icon.classList.remove("fa-minus");
        icon.classList.add("fa-plus");
      }
    });
  });

  // تحديد جميع العناصر التي تحتوي على سمة data-aos
  const animatedElements = document.querySelectorAll("[data-aos]");

  animatedElements.forEach((element) => {
    // إضافة الصنف الأساسي للتحريك
    element.classList.add("aos-init");

    // تعيين تأخير مخصص (إذا كان موجوداً)
    if (element.dataset.aosDelay) {
      element.style.transitionDelay = `${element.dataset.aosDelay}ms`;
    }

    // تعيين مدة مخصصة (إذا كانت موجودة)
    if (element.dataset.aosDuration) {
      element.style.transitionDuration = `${element.dataset.aosDuration}ms`;
    }

    // بدء مراقبة العنصر
    animateOnScrollObserver.observe(element);
  });
});

function updateCountdown() {
  const countdownContainer = document.querySelector(".cta-timer");
  if (!countdownContainer) return;

  const targetDateStr = countdownContainer.getAttribute("data-countdown-date");
  if (!targetDateStr) return;

  let countDownDate = new Date(targetDateStr).getTime();
  const now = Date.now();
  let distance = countDownDate - now;

  // عدد الميلي ثانية في 4 أيام
  const fourDaysMs = 4 * 24 * 60 * 60 * 1000;

  // ✅ لما التايمر يخلص، نرجع نعد من جديد لمدة 4 أيام
  if (distance < 0) {
    const newDate = new Date(now + fourDaysMs);
    countdownContainer.setAttribute(
      "data-countdown-date",
      newDate.toISOString()
    );
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerHTML = days.toString().padStart(2, "0");
  document.getElementById("hours").innerHTML = hours
    .toString()
    .padStart(2, "0");
  document.getElementById("minutes").innerHTML = minutes
    .toString()
    .padStart(2, "0");

  if (days < 1) {
    document.querySelector(".countdown").classList.add("animate-pulse");
  }
}

// Back to Top Button Functionality
const backToTopButton = document.getElementById("backToTop");

function toggleBackToTopButton() {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

window.addEventListener("scroll", toggleBackToTopButton);
backToTopButton.addEventListener("click", scrollToTop);

window.addEventListener("load", () => {
  // Initialize countdown timer with a 4-day countdown
  const countdownContainer = document.querySelector(".cta-timer");
  if (
    countdownContainer &&
    !countdownContainer.getAttribute("data-countdown-date")
  ) {
    const fourDaysMs = 4 * 24 * 60 * 60 * 1000;
    const targetDate = new Date(Date.now() + fourDaysMs);
    countdownContainer.setAttribute(
      "data-countdown-date",
      targetDate.toISOString()
    );
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});

// Add hover effect to pricing cards
const pricingCards = document.querySelectorAll(".pricing-card");
pricingCards.forEach((card) => {
  const orderButton = card.querySelector(".order-now-btn");

  card.addEventListener("mouseenter", function (e) {
    // Do not trigger card hover effect if hovering over the button
    if (orderButton && e.target === orderButton) return;

    if (!this.classList.contains("featured")) {
      pricingCards.forEach((otherCard) => {
        if (!otherCard.classList.contains("featured")) {
          otherCard.style.transform = "scale(0.98)";
          otherCard.style.opacity = "0.9";
        }
      });
      this.style.transform = "translateY(-10px)";
      this.style.opacity = "1";
    }
  });

  card.addEventListener("mouseleave", function () {
    if (!this.classList.contains("featured")) {
      pricingCards.forEach((otherCard) => {
        if (!otherCard.classList.contains("featured")) {
          otherCard.style.transform = "scale(1)";
          otherCard.style.opacity = "1";
        }
      });
    }
  });
});

// FAQ Accordion
document.addEventListener("click", (e) => {
  const header = e.target.closest(".accordion-header");
  if (!header) return;

  const item = header.parentElement;
  const isActive = item.classList.contains("active");

  document
    .querySelectorAll(".accordion-item")
    .forEach((el) => el.classList.remove("active"));
  document
    .querySelectorAll(".accordion-header")
    .forEach((h) => h.setAttribute("aria-expanded", "false"));

  if (!isActive) {
    item.classList.add("active");
    header.setAttribute("aria-expanded", "true");
  }
});
