document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.querySelector('.section-full-overlay');
  const sectionTitle = document.querySelector('.section-title');

  function slideUpOverlay() {
    if (!overlay.classList.contains('slide-up')) {
      overlay.classList.add('slide-up');
      if (sectionTitle) {
        sectionTitle.classList.add('slide-women');
      }
    }
  }

  // Slide up on scroll
  window.addEventListener('scroll', function() {
    if (window.scrollY > 10 && overlay) {
      slideUpOverlay();
    }
  });

  // Slide up on click
  if (overlay) {
    overlay.addEventListener('click', slideUpOverlay);
  }

  // Optional: Arrow click (if you add an arrow element)
  const arrow = document.querySelector('.section-full-overlay .arrow');
  if (arrow) {
    arrow.addEventListener('click', function(e) {
      e.stopPropagation();
      slideUpOverlay();
    });
  }

  // Improved trackpad gesture detection
  // Wheel event (trackpad or mouse)
  window.addEventListener('wheel', function(e) {
    if (overlay && !overlay.classList.contains('slide-up')) {
      // Any vertical movement triggers
      if (Math.abs(e.deltaY) > 0) {
        slideUpOverlay();
      }
    }
  }, { passive: true });

  // Touchmove event (mobile or trackpad)
  window.addEventListener('touchmove', function(e) {
    if (overlay && !overlay.classList.contains('slide-up')) {
      slideUpOverlay();
    }
  }, { passive: true });
});
