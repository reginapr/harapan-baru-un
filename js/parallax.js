document.addEventListener('DOMContentLoaded', function() {
  
  // Play mysic on load
function enableMusicAutoplay() {
    const audio = document.getElementById('bg-music');
    if (audio && audio.paused) {
      audio.play().catch(() => {}); // Prevent error if play is blocked
    }
    // Remove listeners after first interaction
    window.removeEventListener('click', enableMusicAutoplay);
    window.removeEventListener('keydown', enableMusicAutoplay);
    window.removeEventListener('scroll', enableMusicAutoplay);
  }

  window.addEventListener('click', enableMusicAutoplay);
  window.addEventListener('keydown', enableMusicAutoplay);
  window.addEventListener('scroll', enableMusicAutoplay);
  
  // Lazy load background images using Intersection Observer
  const bgSections = document.querySelectorAll('[data-bg]');
  if ('IntersectionObserver' in window) {
    const bgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const bgUrl = el.getAttribute('data-bg');
          if (bgUrl) {
            el.style.backgroundImage = `url('${bgUrl}')`;
            el.classList.add('bg-loaded');
            observer.unobserve(el);
          }
        }
      });
    }, { rootMargin: '200px' });
    bgSections.forEach(section => {
      bgObserver.observe(section);
    });
  } else {
    // Fallback: load all backgrounds immediately
    bgSections.forEach(el => {
      const bgUrl = el.getAttribute('data-bg');
      if (bgUrl) {
        el.style.backgroundImage = `url('${bgUrl}')`;
        el.classList.add('bg-loaded');
      }
    });
  }
// Track the last visible section for scroll logic
window.lastVisibleSection = null;


// Utility to set visible section and remove from previous
function setVisibleSection(newSection) {
    if (window.lastVisibleSection && window.lastVisibleSection !== newSection) {
        window.lastVisibleSection.classList.remove('visible');
    }
    if (!newSection.classList.contains('visible')) {
      newSection.classList.add('visible');
    }
    window.lastVisibleSection = newSection;
}

// Scroll up to previous section
function scrollUpToSection(section) {
  if (!isScrolling && section) {
    isScrolling = true;
    section.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      isScrolling = false;
    }, 1000);
  }
}

// Intercept anchor links to sections, scroll and add visible without changing URL
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').replace('#', '');
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      e.preventDefault();
      setVisibleSection(targetSection);
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
  if (footnote) {
    setTimeout(function() {
      footnote.classList.add('visible');
    }, 700); // Wait for scroll animation
  }
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

      // If this is the video menu item, call handleVideoSectionScroll with direct=true
      if (
        (item.tagName === 'A' && item.getAttribute('href') === '#video') ||
        item.dataset.section === 'video'
      ) {
        const videoSection = document.getElementById('video');
        if (videoSection) {
          handleVideoSectionScroll(videoSection, false, true);
        }
      }
    });
  });
}

let isScrolling = false;

function scrollToSection(section) {
  if (!isScrolling && section) {
    isScrolling = true;

     setVisibleSection(section);

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
        textBoxes.forEach((tb, i) => {
          if (i > 0) {
            tb.classList.add('hidden');
            tb.classList.remove('fade-in', 'slide-up');
          } else {
            tb.classList.add('show');
          }
        });
      }
    });
    
    section.scrollIntoView({ behavior: 'smooth' });
    isScrolling = false;

    // setTimeout(() => {
    //   isScrolling = false;
    // }, 1000); // Adjust duration as needed
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

function resetOverlayAndFootnote(section) {
  if (section.querySelector('.overlay-darker')) {
    section.querySelector('.overlay-container').classList.remove('overlay-darker');
    section.querySelector('.overlay-container').classList.add('gradient-overlay');
    const footnote = section.querySelector('.footnote');
    if (footnote) {
      footnote.classList.remove('hidden');
    }
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

let currentIndex = 1;
let index = 0;
let scroll = false;
let mouseSensitivity = 1; // Default sensitivity

function updateIndex(direction) {
    if (direction > 0) {
      index++;
    } else {
      index = Math.max(0, index - 1);
    }

    return index;
}

function setMouseSensitivity(value) {
  mouseSensitivity = value;
}

setMouseSensitivity(2);
// Example: setMouseSensitivity(0.7); // Less sensitive
// Example: setMouseSensitivity(1.5); // More sensitive

let scrollDebounce = false;
const SCROLL_DEBOUNCE_MS = 250; // Snappier scroll

function getCurrentSection() {
  const sections = Array.from(document.querySelectorAll('section'));
  let current = null;
  let minTop = Infinity;
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 10 && rect.bottom > 10 && Math.abs(rect.top) < minTop) {
      minTop = Math.abs(rect.top);
      current = sec;
    }
  });
  return current || sections[0]; // fallback to first section
}

function handleVideoSectionScroll(current, isScrollUp, direct = false) {
  // PRIORITY: Handle video section scroll first
  if (current && current.id === 'video') {
    const iframe = current.querySelector('iframe');
    if (iframe) {
      iframe.style.pointerEvents = 'none';
      // setTimeout(() => {
      //   iframe.style.pointerEvents = '';
      // }, 1200);
    }
    
    if (direct) {
      // Only scroll to video section, do not move to next/prev
      current.classList.add('visible');
      current.scrollIntoView({ behavior: 'smooth' });
      return true;
    }
    // Wheel event: allow next/prev navigation
    if (!isScrollUp) {
      const nextSection = getNextSection(current);
      if (nextSection) {
        scrollToSection(nextSection);
        return true;
      }
    } else {
      const prevSection = getPreviousSection(current);
      if (prevSection) {
        scrollToSection(prevSection);
        return true;
      }
    }
    return true;
  }
  return false;
}

function toggleLangFlag(flag) {
    // Get the clicked flag's data-lang value
    const selectedLang = flag.getAttribute('data-lang');
    // Get all flag elements
    const allFlags = document.querySelectorAll('.flag');
    // Activate the clicked flag, deactivate others
    allFlags.forEach(f => {
        if (f === flag) {
            f.classList.add('active');
        } else {
            f.classList.remove('active');
        }
    });
    // Update <main> data-lang attribute
    const main = document.getElementById('main');
    if (main) {
        main.setAttribute('data-lang', selectedLang);
    }
    // Update data-hidden for all elements with data-lang
    document.querySelectorAll('[data-lang]').forEach(el => {
        if (el.getAttribute('data-lang') === selectedLang) {
            el.setAttribute('data-hidden', 'false');
        } else if (el.classList.contains('flag')) {
            // Do nothing for flag elements
        } else {
            el.setAttribute('data-hidden', 'true');
        }
    });
}

// Example: Attach to all flag elements
document.querySelectorAll('.flag').forEach(flag => {
    flag.addEventListener('click', function() {
        toggleLangFlag(this);
    });
});

window.addEventListener('wheel', function(e) {
  if (scrollDebounce) return;
  scrollDebounce = true;
  setTimeout(() => { scrollDebounce = false; }, SCROLL_DEBOUNCE_MS);

  const adjustedDeltaY = e.deltaY * mouseSensitivity;
  const isScrollUp = adjustedDeltaY < 0;
  const current = getCurrentSection();

  if (handleVideoSectionScroll(current, isScrollUp)) {
    return;
  }

  if (current) {
    const next = getNextSection(current);
    if (next && !current.classList.contains('visible')) {
      setVisibleSection(next);
    }

    if (isScrollUp) {
      // Scroll up to previous section
      const prev = getPreviousSection(current);
      if (!prev.classList.contains('visible')) {
        setVisibleSection(prev);
      }

      console.log('Current Section:', prev.id, 'Index:', currentIndex);

      // Reset text-box index
      currentIndex = 0;
      index = -1;
      scroll = false;
      scrollUpToSection(prev);
      resetOverlayAndFootnote(prev);
    }

    const textBoxes = current.querySelectorAll('.text-box');

    if (currentIndex < textBoxes.length && textBoxes.length > 0 && current.classList.contains('visible')) {
      // Show the current .text-box
      if (currentIndex < textBoxes.length) {
        if (!scroll) {
          scroll = true;
          // Only update currentIndex once per scroll event
          let newIndex = updateIndex(e.deltaY);
          currentIndex = newIndex;
          
          scroll = false;
          // setTimeout(() => {
          //   scroll = false;
          // }, 1000);
        }

        console.log('Current Section:', current.id, 'Index:', currentIndex);

        // Show/hide text-boxes as before
        if (currentIndex > 0) {
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
              textBoxes[0].classList.add('hidden');
            }
          } else {
            textBoxes[0].classList.remove('fade-in', 'slide-up');
          }
        } else {
          textBoxes[0].classList.remove('hidden');
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
      }
    } else {
      // Only reset index/currentIndex after moving to next section
        const next = getNextSection(current);
        if (next) {
          scrollToSection(next);
          if (next.querySelector('.overlay-darker')) {
            resetOverlayAndFootnote(next);
          }

          setTimeout(() => {
            currentIndex = 0;
            index = -1;
            scroll = false;
            // Reset text-box visibility
            if (textBoxes.length > 0 && textBoxes[currentIndex].classList.contains('hidden')) {
              textBoxes[currentIndex].classList.remove('hidden');
            }
          }, 800); // Wait for scroll animation
        }
        return;
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

      // Always allow scroll to next/prev section
      if (!isScrollUp) {
        const nextSection = getNextSection(current);
        if (nextSection) {
          scrollToSection(nextSection);
          return;
        }
      } else {
        const prevSection = getPreviousSection(current);
        if (prevSection) {
          scrollToSection(prevSection);
          return;
        }
      }
      // Prevent default scroll logic from running
      return;
    }

    // If no .text-box, scroll to next section as usual
    if (next) {
      scrollToSection(next);
    }
  }
}, { passive: true });
});
