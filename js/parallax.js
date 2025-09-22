document.addEventListener('DOMContentLoaded', function() {
// Track the last visible section for scroll logic
window.lastVisibleSection = null;

// Scroll up to previous section
function scrollUpToSection(section) {
  if (!isScrolling && section) {
    isScrolling = true;
    section.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      isScrolling = false;
    }, 1200);
  }
}
// Intercept anchor links to sections, scroll and add visible without changing URL
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').replace('#', '');
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      e.preventDefault();
      // Remove visible from all sections
      document.querySelectorAll('section').forEach(sec => sec.classList.remove('visible'));
      // Add visible to target section
      targetSection.classList.add('visible');
      // Scroll to section
      targetSection.scrollIntoView();
    }
  });
});

// Add lazy loading to all images
document.querySelectorAll('img').forEach(img => {
  img.setAttribute('loading', 'lazy');
});

const overlay = document.querySelector('.section-full-overlay');
const sectionHome = document.getElementById('home');
const footnote = document.querySelector('.column-footnote');
const columnRight = document.querySelector('.pillars-slide');

function slideUpOverlay() {
  if (!overlay.classList.contains('slide-up')) {
    overlay.classList.add('slide-up');

    if (sectionHome) {
      sectionHome.classList.add('slide-up', 'visible');
    }
  }
}

function pillarsAnimation() {
  if (columnRight) {
    columnRight.classList.add('slide-in');
  }
}

// Slide up on click (only if overlay is visible)
if (overlay) {
  overlay.addEventListener('click', function() {
    if (!overlay.classList.contains('slide-up')) {
      slideUpOverlay();
    }
  });
}

// Show/hide .sub-links on .main-links click using opacity and .active class. Hide .sub-links when clicking outside.
const mainLinks = document.querySelector('.main-links');
const subLinks = document.querySelector('.sub-links');
if (mainLinks && subLinks) {
  // Initial state
  subLinks.style.opacity = '0';
  subLinks.style.pointerEvents = 'none';
  subLinks.classList.remove('active');
  subLinks.style.transition = 'opacity 0.3s';

  mainLinks.addEventListener('click', function(e) {
    e.stopPropagation();
    if (!subLinks.classList.contains('active')) {
      subLinks.classList.add('active');
      subLinks.style.opacity = '1';
      subLinks.style.pointerEvents = 'auto';
    } else {
      subLinks.classList.remove('active');
      subLinks.style.opacity = '0';
      subLinks.style.pointerEvents = 'none';
    }
  });

  // Hide sub-links when clicking outside
  document.addEventListener('click', function(e) {
    if (!subLinks.contains(e.target) && !mainLinks.contains(e.target)) {
      subLinks.classList.remove('active');
      subLinks.style.opacity = '0';
      subLinks.style.pointerEvents = 'none';
    }
  });

  // Hide sub-links after clicking any item inside
  subLinks.querySelectorAll('a, button, li').forEach(function(item) {
    item.addEventListener('click', function() {
      subLinks.classList.remove('active');
      subLinks.style.opacity = '0';
      subLinks.style.pointerEvents = 'none';
    });
  });
}

let isScrolling = false;

function scrollToSection(section) {
  if (!isScrolling && section) {
    isScrolling = true;

    if (section.querySelector('.pillars-slide')) {
      pillarsAnimation();
    }

    if (section.querySelector('.title-box')) {
      const titleBox = section.querySelector('.title-box');
      titleBox.classList.add('slide-up');
    }

    if (section.querySelector('.quote-image')) {
      const quoteImage = section.querySelector('.quote-image');
      quoteImage.classList.add('slide-in');
    }

    // Hide all .text-box elements in ALL sections except the current
    const allSections = document.querySelectorAll('section');
    allSections.forEach(sec => {
      if (sec !== section) {
        const textBoxes = sec.querySelectorAll('.text-box');
        textBoxes.forEach(tb => {
          tb.classList.add('hidden');
          tb.classList.remove('fade-in', 'slide-up');
        });
      }
    });

    section.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      isScrolling = false;
    }, 1100); // Adjust duration as needed
  }
}

function replaceGradientWithOverlay(section) {
  const gradient = section.querySelector('.gradient-overlay');
  const footnote = section.querySelector('.footnote');
  if (gradient && footnote) {
    gradient.classList.remove('gradient-overlay');
    gradient.classList.add('overlay-darker');
    footnote.classList.add('hidden');
  }
}

function getNextSection(currentSection) {
  let next = currentSection.nextElementSibling;
  while (next && next.tagName !== 'SECTION') {
    next = next.nextElementSibling;
  }
  return next;
}

function getPreviousSection(currentSection) {
    let prev = currentSection.previousElementSibling;
    while (prev && prev.tagName !== 'SECTION') {
        prev = prev.previousElementSibling;
    }
    return prev;
}

function updateIndex(direction) {
    if (direction > 0) {
      index++;
    } else {
      index = Math.max(0, index - 1);
    }

    return index;
}

let currentIndex = 0;
let index = -1;
let scroll = false;
let mouseSensitivity = 1; // Default sensitivity

function setMouseSensitivity(value) {
  mouseSensitivity = value;
}

window.addEventListener('wheel', function(e) {
  const adjustedDeltaY = e.deltaY * mouseSensitivity;
  // Detect scroll direction
  const isScrollUp = adjustedDeltaY < 0;
  const sections = Array.from(document.querySelectorAll('section'));
  let current = null;

  // Find the section whose top is closest to 0 but not greater than 0
  let minTop = Infinity;
  sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 10 && rect.bottom > 10 && Math.abs(rect.top) < minTop) {
        minTop = Math.abs(rect.top);
        current = sec;
    }
  });

  if (current) {
    const next = getNextSection(current);
    if (next && !current.classList.contains('visible')) {
      document.querySelectorAll('section').forEach(sec => sec.classList.remove('visible'));
      current.classList.add('visible');
      lastVisibleSection = current;
    }

    if (isScrollUp) {
      // Scroll up to previous section
      const prev = getPreviousSection(current);
      if (prev) {
        if (prev && !current.classList.contains('visible')) {
          document.querySelectorAll('section').forEach(sec => sec.classList.remove('visible'));
          // Add visible to previous section
          prev.classList.add('visible');
        }
        lastVisibleSection = prev;
        // Reset text-box index
        currentIndex = 0;
        index = -1;
        scroll = false;
        scrollUpToSection(prev);
      }
    }

    console.log('Current Section:', current.id, 'Index:', currentIndex);

    const textBoxes = current.querySelectorAll('.text-box');

    if (textBoxes.length > 0 && current.classList.contains('visible')) {
      // Show the current .text-box
      if (currentIndex < textBoxes.length) {
        if (!scroll) {
          scroll = true;
          // Only update currentIndex once per scroll event
          let newIndex = updateIndex(e.deltaY);
          currentIndex = newIndex;
          // prevent too many triggers — wait before allowing next scroll
          setTimeout(() => {
            scroll = false;
          }, 1200); // adjust delay for sensitivity
        }

        // Show/hide text-boxes as before
        if (textBoxes[currentIndex] && current.classList.contains('visible')) {
          if (textBoxes[currentIndex].classList.contains('slide')) {
            textBoxes[currentIndex].classList.add('slide-up');
            textBoxes[currentIndex].classList.remove('fade-in');
          } else if (textBoxes[currentIndex].classList.contains('fade')) {
            textBoxes[currentIndex].classList.add('fade-in');
            textBoxes[currentIndex].classList.remove('slide-up');
          } else {
            return;
          }

          if (currentIndex > 0 && textBoxes[currentIndex - 1]) {
            textBoxes[currentIndex - 1].classList.remove('fade-in', 'slide-up');
          }
        } else {
          textBoxes[0].classList.remove('fade-in', 'slide-up');
        }

        if (
          current.classList.contains('section-profile') &&
          current.classList.contains('last') &&
          currentIndex === textBoxes.length - 1
        ) {
          let gradient = current.querySelector('.gradient-overlay');
          if (gradient) {
            replaceGradientWithOverlay(current);
          }
        }

        return;
      } else {
        // Only reset index/currentIndex after moving to next section
        const next = getNextSection(current);
        if (next) {
          scrollToSection(next);
          setTimeout(() => {
            currentIndex = 0;
            index = -1;
            scroll = false;
          }, 200); // Wait for scroll animation
        }
        return;
      }
    }

    // Special handling for video section: ensure iframe does not block scroll
    if (current.id === 'video') {
      const iframe = current.querySelector('iframe');
      if (iframe) {
        iframe.style.pointerEvents = 'none';
        setTimeout(() => {
          iframe.style.pointerEvents = '';
        }, 1200); // restore after scroll animation
      }
    }

    // If no .text-box, scroll to next section as usual
    if (next) {
      scrollToSection(next);
    }
  }
}, { passive: true });
});
