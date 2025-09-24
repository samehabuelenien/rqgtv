/**
 * rqgstore - Main JavaScript File
 * Handles header functionality, mobile menu, and smooth scrolling
 */

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const header = document.getElementById('header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const ctaButton = document.getElementById('ctaButton');
  const backToTopBtn = document.getElementById('backToTop');
  
  // Check if elements exist before adding event listeners
  if (mobileMenuBtn && navMenu) {
    // Toggle mobile menu
    const toggleMobileMenu = (isExpanded) => {
      mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
      navMenu.classList.toggle('active', isExpanded);
      mobileMenuBtn.classList.toggle('active', isExpanded);
      document.body.style.overflow = isExpanded ? 'hidden' : '';
      
      // Add/remove event listener for escape key
      if (isExpanded) {
        document.addEventListener('keydown', handleEscapeKey);
      } else {
        document.removeEventListener('keydown', handleEscapeKey);
      }
    };
    
    // Handle escape key press
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        toggleMobileMenu(false);
      }
    };
    
    // Toggle menu on button click
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      toggleMobileMenu(!isExpanded);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      const isClickInside = navMenu.contains(e.target) || mobileMenuBtn.contains(e.target);
      if (!isClickInside && navMenu.classList.contains('active')) {
        toggleMobileMenu(false);
      }
    });
    
    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
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
      header.classList.toggle('scrolled', currentScroll > 50);
      
      // Only run the hide/show logic if not in mobile menu
      if (!navMenu || !navMenu.classList.contains('active')) {
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > headerHeight) {
          // Scrolling down
          header.classList.add('hide');
        } else {
          // Scrolling up
          header.classList.remove('hide');
        }
      }
      
      // Show/hide back to top button
      if (backToTopBtn) {
        backToTopBtn.classList.toggle('show', currentScroll > 300);
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
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initialize header state
    updateHeader();
  }
  
  // Back to top button
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      // Focus on header for keyboard users
      const header = document.querySelector('header');
      if (header) {
        header.setAttribute('tabindex', '-1');
        header.focus();
      }
    });
  }
  
  // Add active class to current section in viewport
  const setActiveLink = () => {
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section[id]').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  };
  
  // Run on load and scroll
  window.addEventListener('load', setActiveLink);
  window.addEventListener('scroll', setActiveLink, { passive: true });
  
  // CTA Button hover effect
  if (ctaButton) {
    const updateCtaHover = (isHovered) => {
      const icon = ctaButton.querySelector('i');
      if (icon) {
        icon.style.transform = isHovered ? 'translateX(-5px)' : 'translateX(0)';
      }
    };
    
    ctaButton.addEventListener('mouseenter', () => updateCtaHover(true));
    ctaButton.addEventListener('mouseleave', () => updateCtaHover(false));
    
    // Add focus styles for keyboard navigation
    ctaButton.addEventListener('focus', () => updateCtaHover(true));
    ctaButton.addEventListener('blur', () => updateCtaHover(false));
  }
  
  // Add animation to nav items on page load
  if (navLinks.length > 0) {
    navLinks.forEach((link, index) => {
      link.style.opacity = '0';
      link.style.transform = 'translateY(10px)';
      link.style.transition = `opacity 0.3s ease ${index * 0.1}s, transform 0.3s ease ${index * 0.1}s`;
      
      // Trigger reflow
      void link.offsetWidth;
      
      link.style.opacity = '1';
      link.style.transform = 'translateY(0)';
    });
  }
  
  // Handle reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = 'auto';
  }
});

// Add loaded class to body when page is fully loaded
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
  
  // Remove focus styles on mouse interaction
  document.addEventListener('mousedown', function() {
    document.body.classList.add('using-mouse');
  });
  
  // Re-enable focus styles for keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.remove('using-mouse');
    }
  });
});
