document.addEventListener('DOMContentLoaded', function() {
  // Add lazy loading to all images
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });

  const overlay = document.querySelector('.section-full-overlay');
  const sectionTitle = document.getElementById('title');
  const footnote = document.querySelector('.column-footnote');
  const columnRight = document.querySelector('.pillars-slide');

  function slideUpOverlay() {
    if (!overlay.classList.contains('slide-up')) {
      overlay.classList.add('slide-up');

      if (sectionTitle) {
        sectionTitle.classList.add('slide-up', 'visible');
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

  // function slideVisibleAnimation(section) {
  //   if (section) {
  //     // document.querySelectorAll('section').forEach(sec => {
  //     //   sec.classList.remove('visible');
  //     // });

  //     // section.classList.add('visible');

  //     // if (section.querySelector('.overlay.fade')) {
  //     //   fadeOverlay(true, section);
  //     // }

  //     // const previousSection = getPreviousSection(section);
  //     // if (previousSection && previousSection.querySelector('.overlay.fade')) {
  //     //   fadeOverlay(false, previousSection);
  //     // }
  //   }
  // }

  // Fade in/out overlay utility
  function fadeOverlay(fadeIn = true, section) {
    const overlay = section.querySelector('.overlay.fade');
    if (fadeIn) {
      overlay.classList.remove('on');
      overlay.classList.add('off');
    } else {
      overlay.classList.remove('off');
      overlay.classList.add('on');
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

let isScrolling = false;

function scrollToSection(section) {
  if (!isScrolling && section) {
    isScrolling = true;

    if (section.querySelector('.column-footnote')) {
      pillarsAnimation();
    }

    if (section.querySelector('.title-box')) {
      const titleBox = section.querySelector('.title-box');
      titleBox.classList.add('slide-up');
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
    }, 1200); // Adjust duration as needed
  }
}

let currentIndex = 0;
let index = -1;
let scroll = false;

window.addEventListener('wheel', function(e) {
  // Find the current section in view
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
    // Remove 'visible' class from all sections
    sections.forEach(sec => sec.classList.remove('visible'));
    // Add 'visible' class only to the current section
    current.classList.add('visible');

    // If section contains .text-box elements
    const textBoxes = current.querySelectorAll('.text-box');

    if (textBoxes.length > 0) {
      // Track current index in section using a data attribute
      if (!current.hasOwnProperty('_textBoxIndex')) {
        current._textBoxIndex = 0;
      }
      
      // Show the current .text-box
      if (currentIndex < textBoxes.length) {
        if (!scroll) {
          scroll = true;

          currentIndex = updateIndex(e.deltaY);

          // prevent too many triggers — wait before allowing next scroll
          setTimeout(() => {
            scroll = false;
          }, 1200); // adjust delay for sensitivity
        }

        if (textBoxes[currentIndex] && current.classList.contains('visible')) {
          setTimeout(function() {
            if (textBoxes[currentIndex].classList.contains('slide')) {
              textBoxes[currentIndex].classList.add('slide-up');
              textBoxes[currentIndex].classList.remove('fade-in');
            } else if (textBoxes[currentIndex].classList.contains('fade')) {
              textBoxes[currentIndex].classList.add('fade-in');
              textBoxes[currentIndex].classList.remove('slide-up');
            }

            if (currentIndex > 0 && textBoxes[currentIndex - 1]) {
              textBoxes[currentIndex - 1].classList.remove('fade-in', 'slide-up');
            }
          }, 150);
        } else {
          textBoxes[0].classList.remove('fade-in', 'slide-up');
        }

        return;
      } else {
        // All .text-box elements have been shown, restore section scrolling
        currentIndex = 0;
        index = -1;
        scroll = false;
        current._textBoxIndex = 0;

        const next = getNextSection(current);
        scrollToSection(next);
        return;
      }
    }

    // If no .text-box, scroll to next section as usual
    const next = getNextSection(current);
    scrollToSection(next);
    slideVisibleAnimation(current);
  }
}, { passive: true });

// Helper function
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

// window.addEventListener('touchmove', function(e) {
//   if (overlay) {
//     if (!overlay.classList.contains('slide-up')) {
//       slideUpOverlay();
//     } else if (overlay.classList.contains('slide-up') && sectionPillars) {
//       sectionPillars.scrollIntoView({ behavior: 'smooth' });
//       pillarsAnimation();
//     } else if (overlay.classList.contains('slide-up') && sectionIntro) {
//       sectionIntro.scrollIntoView({ behavior: 'smooth' });
//     }
//   }
// }, { passive: true });

});
