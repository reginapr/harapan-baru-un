document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.querySelector('.section-full-overlay');
  const sectionTitle = document.querySelector('.section-title');
  const sectionPillars = document.querySelector('.section-pillars');
  const footnote = document.querySelector('.column-footnote');
  const columnRight = document.querySelector('.pillars-slide');

  function slideUpOverlay() {
    if (!overlay.classList.contains('slide-up')) {
      overlay.classList.add('slide-up');

      if (sectionTitle) {
        sectionTitle.classList.add('slide-women');
      }
    }
  }

  function animateColumnRight() {
    if (columnRight) {
      columnRight.classList.add('slide-in');
    }
  }

  function pillarsAnimation() {
    if (footnote) {
        setTimeout(function() {
          footnote.classList.add('visible');
        }, 700); // Wait for scroll animation
    }

    animateColumnRight();
  }

  // Slide up on click (only if overlay is visible)
  if (overlay) {
    overlay.addEventListener('click', function() {
      if (!overlay.classList.contains('slide-up')) {
        slideUpOverlay();
      }
    });
  }

  // Optional: Arrow click (if you add an arrow element)
  const arrow = document.querySelector('.section-full-overlay .arrow');
  if (arrow) {
    arrow.addEventListener('click', function(e) {
      e.stopPropagation();
      slideUpOverlay();
    });
  }

window.addEventListener('scroll', function() {
  if (window.scrollY > 10 && overlay) {
    if (!overlay.classList.contains('slide-up')) {
      slideUpOverlay();
    } else if (overlay.classList.contains('slide-up') && sectionPillars) {
      sectionPillars.scrollIntoView({ behavior: 'smooth' });
      // Show footnote when section-pillars is scrolled into view
      pillarsAnimation();
    }
  }
});


window.addEventListener('wheel', function(e) {
  if (overlay) {
    if (!overlay.classList.contains('slide-up')) {
      if (Math.abs(e.deltaY) > 0) {
        slideUpOverlay();
      }
    } else if (overlay.classList.contains('slide-up') && sectionPillars && Math.abs(e.deltaY) > 0) {
      sectionPillars.scrollIntoView({ behavior: 'smooth' });
      pillarsAnimation();
    }
  }
}, { passive: true });

window.addEventListener('touchmove', function(e) {
  if (overlay) {
    if (!overlay.classList.contains('slide-up')) {
      slideUpOverlay();
    } else if (overlay.classList.contains('slide-up') && sectionPillars) {
      sectionPillars.scrollIntoView({ behavior: 'smooth' });
      pillarsAnimation();
    }
  }
}, { passive: true });

});
