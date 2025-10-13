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

  // Sound control toggle
  const soundControl = document.getElementById('sound-control');
  const bgMusic = document.getElementById('bg-music');

  if (soundControl && bgMusic) {
      bgMusic.volume = 0.15; 
      soundControl.addEventListener('click', function(e) {
          e.preventDefault();

          if (bgMusic.muted) {
              bgMusic.muted = false;
              soundControl.classList.add('active');
          } else {
              bgMusic.muted = true;
              soundControl.classList.remove('active');
          }
      });
  }

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

  const storyChapters = document.querySelector('.story-chapters');

  function activateFirstChapterLink() {
    const firstChapterLink = document.querySelector('.chapter-link');
    if (firstChapterLink && storyChapters) {
      firstChapterLink.addEventListener('click', function(e) {
        // Always prevent default first
        e.preventDefault();
        e.stopImmediatePropagation();

        this.getAttribute('href').replace('#', '');
        // If not active, add the class and do nothing else
        if (!storyChapters.classList.contains('active')) {
          storyChapters.classList.add('active');
          return;
        }

        // If already active, manually trigger navigation
        const targetId = this.getAttribute('href').replace('#', '');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          e.preventDefault();
          setVisibleSection(targetSection);
          if (storyChapters.classList.contains('active')) {
            storyChapters.classList.remove('active');
          } 
          targetSection.scrollIntoView();
        }
      });
    }
  }

  activateFirstChapterLink();

  function deactivateStoryChaptersOnOutsideClick() {
    const storyChapters = document.querySelector('.story-chapters');
    if (!storyChapters) return;

    // Only run on mobile
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      document.addEventListener('click', function(e) {
        // If click is outside storyChapters and storyChapters is active
        if (
          storyChapters.classList.contains('active') &&
          !storyChapters.contains(e.target)
        ) {
          storyChapters.classList.remove('active');
        }
      });
    }
  }

deactivateStoryChaptersOnOutsideClick();

  // Intercept anchor links to sections, scroll and add visible without changing URL
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').replace('#', '');
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        e.preventDefault();
        setVisibleSection(targetSection);
        if (storyChapters.classList.contains('active')) {
          storyChapters.classList.remove('active');
        }
        targetSection.scrollIntoView();

        const sections = Array.from(document.querySelectorAll('section'));
        const sectionIndex = sections.indexOf(targetSection);
        
        if (sectionIndex > 1) {
          storyChapters.classList.remove('hidden');
        } else {
          storyChapters.classList.add('hidden');  
        }
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

      if (window.lastVisibleSection && window.lastVisibleSection.id === 'video' && section.id !== 'video') {
        stopYouTubeVideo();
      }
      
      section.scrollIntoView({ behavior: 'smooth' });
      
      setVisibleSection(section);
      isScrolling = false;

      const sections = Array.from(document.querySelectorAll('section'));
      const sectionIndex = sections.indexOf(section);

      if (sectionIndex > 1) {
        storyChapters.classList.remove('hidden');
      } else {
        storyChapters.classList.add('hidden');  
      }

      console.log('Current section:', section ? section.id : null);
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
  let mouseWheelSensitivity = 2;   // For mouse wheel
  let trackpadSensitivity = 0.5;     // For trackpad
  let textBoxScrollLock = false;
  const TEXTBOX_SCROLL_LOCK_MS = 250;

  function setMouseWheelSensitivity(value) {
      mouseWheelSensitivity = value;
      console.log(`Mouse wheel sensitivity set to: ${value}`);
  }

  function setTrackpadSensitivity(value) {
      trackpadSensitivity = value;
      console.log(`Trackpad sensitivity set to: ${value}`);
  }

  function updateIndex(direction) {
      if (direction > 0) {
        index++;
      } else {
        index = Math.max(0, index - 1);
      }

      return index;
  }

  setMouseWheelSensitivity(1);
  setTrackpadSensitivity(0.5);
  // Example: setMouseWheelSensitivity(0.7); // Less sensitive
  // Example: setMouseWheelSensitivity(1.5); // More sensitive

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
    if (current && current.id === 'video') {
      // const iframe = current.querySelector('iframe');
      // if (iframe) {
      //   iframe.style.pointerEvents = 'none';
      //   setTimeout(() => {
      //     iframe.style.pointerEvents = '';
      //   }, 2000);
      // }
      
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
      } else if (isScrollUp) {
        const prevSection = getPreviousSection(current);
        if (prevSection) {
          scrollToSection(prevSection);
          return true;
        }
      }
    }
    return false;
  }

  const videoSection = document.getElementById('video');
  if (videoSection) {
      const sectionContent = videoSection.querySelector('.section-content');
      const iframe = videoSection.querySelector('iframe');

      if (sectionContent && iframe) {
          sectionContent.addEventListener('click', function() {
              videoSection.classList.add('video-play');
              iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          });
      }
  }

  const videoOverlay = document.querySelector('.video-overlay');
  const videoIframe = document.querySelector('#video iframe');

  function stopYouTubeVideo() {
    if (videoIframe) {
      videoIframe.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      );
      
      document.querySelector('#video').classList.remove('video-play');
    }
  }

  if (videoOverlay && videoIframe) {
    videoOverlay.addEventListener('click', function() {
      stopYouTubeVideo();
    });
  }

  let ytPlayer;
  let isVideoPlaying = true; // Track play state

  window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player(document.querySelector('#video iframe'), {
      events: {
        'onStateChange': function(event) {
          if (event.data === YT.PlayerState.PLAYING) {
            isVideoPlaying = true;
            bgMusic.muted = true;
            soundControl.classList.remove('active');
          } else {
            isVideoPlaying = false;
            if (event.data === YT.PlayerState.PAUSED) {
              document.querySelector('#video').classList.remove('video-play');
            }
          }
        }
      }
    });
  };

  function toggleLangFlag(flag) {
      const selectedLang = flag.getAttribute('data-lang');
      const allFlags = document.querySelectorAll('.flag');
      
      allFlags.forEach(f => {
          if (f === flag) {
              f.classList.add('active');
          } else {
              f.classList.remove('active');
          }
      });

      const storybook = document.getElementById('storybook');
      if (storybook) {
          storybook.setAttribute('data-lang', selectedLang);
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

  document.querySelectorAll('.flag').forEach(flag => {
      flag.addEventListener('click', function() {
          toggleLangFlag(this);
      });
  });

  let scrollDebounce = false;
  const MOUSE_DEBOUNCE_MS = 50;
  const TRACKPAD_DEBOUNCE_MS = 1000; // Snappier scroll
  let counter = 0;

  window.addEventListener('wheel', function(e) {
    const overlay = document.querySelector('.section-full-overlay');
    if (overlay && !overlay.classList.contains('slide-up')) {
      e.preventDefault();
      return;
    }

    if (scrollDebounce) return;
    const isTrackpad = Math.abs(e.deltaY) < 20;
    scrollDebounce = true;
    setTimeout(() => { scrollDebounce = false; }, isTrackpad ? TRACKPAD_DEBOUNCE_MS : MOUSE_DEBOUNCE_MS);

    let adjustedDeltaY;
    if (Math.abs(e.deltaY) > 50) {
        adjustedDeltaY = e.deltaY * mouseWheelSensitivity;
    } else {
        adjustedDeltaY = e.deltaY * trackpadSensitivity;
    }

    const isScrollUp = adjustedDeltaY < 0;
    const current = getCurrentSection();

    // handleTextBoxScroll(current, isScrollUp);

    // Handle video section scroll first
    if (handleVideoSectionScroll(current, isScrollUp)) {
      return;
    }

    // Only run text-box logic if not on video section
    if (current.id !== 'video') {
      const textBoxes = current.querySelectorAll('.text-box');
      if (textBoxes.length > 0 && current.classList.contains('visible')) {
        const initCounter = counter + 1;
        if (initCounter < textBoxes.length) {
          if (!textBoxScrollLock) {
            textBoxScrollLock = true;
            let newIndex = updateIndex(e.deltaY);
            currentIndex = newIndex;
            setTimeout(() => {
              textBoxScrollLock = false;
            }, TEXTBOX_SCROLL_LOCK_MS);
          }

          // Show/hide text-boxes as before
          if (!isScrollUp) {
            counter = counter + 1;
            
            if (counter > 0) {
              if (currentIndex > 0 && textBoxes[currentIndex]) {
                if (textBoxes[currentIndex - 1]) {
                  textBoxes[currentIndex - 1].classList.remove('fade-in', 'slide-up');
                  textBoxes[0].classList.add('hidden');
                }

                if (textBoxes[currentIndex].classList.contains('slide')) {
                  textBoxes[currentIndex].classList.add('slide-up');
                  textBoxes[currentIndex].classList.remove('fade-in');
                } else if (textBoxes[currentIndex].classList.contains('fade')) {
                  textBoxes[currentIndex].classList.add('fade-in');
                  textBoxes[currentIndex].classList.remove('slide-up');
                }

                if (
                  current.classList.contains('last') &&
                  currentIndex === textBoxes.length - 1
                ) {
                  replaceGradientWithOverlay(current);
                }
              } else {
                textBoxes[0].classList.remove('fade-in', 'slide-up');
              }
              return;
            } 
          } else {
            // Scroll up
            counter = counter - 1;
            
            if (counter < 0) {
              const prevSection = getPreviousSection(current);
              if (prevSection) {
                // Reset text-box index for the previous section
                currentIndex = 1;
                index = 0;
                counter = 0;
              
                const prevTextBoxes = prevSection.querySelectorAll('.text-box');
                if (prevTextBoxes.length && prevTextBoxes[0].classList.contains('init-slide')) {
                  prevTextBoxes[0].classList.remove('fade-in', 'slide-up', 'hidden');
                }
                
              }
            } else {
              textBoxes[currentIndex + 1].classList.remove('fade-in', 'slide-up');
            
              if (textBoxes[currentIndex].classList.contains('slide') || textBoxes[currentIndex].classList.contains('init-slide')) {
                textBoxes[currentIndex].classList.add('slide-up');
                textBoxes[currentIndex].classList.remove('fade-in');
              } else if (textBoxes[currentIndex].classList.contains('fade')) {
                textBoxes[currentIndex].classList.add('fade-in');
                textBoxes[currentIndex].classList.remove('slide-up');
              }

              return;
            }
          }

          console.log('Current index:', currentIndex, 'Total text boxes:', textBoxes.length);
        } else {
          // All text-boxes shown, reset index for next section
          currentIndex = 1;
          index = 0;
          counter = 0;
          
          // Debug log
          console.log('All text-boxes shown in section:', current.id);
          console.log('Ready to scroll to next/prev section on next wheel event.');

          if (textBoxes.length && textBoxes[0].classList.contains('init-slide')) {
            textBoxes[0].classList.remove('fade-in', 'slide-up', 'hidden');
          }

          // If last section, ensure gradient is replaced
          if (current.classList.contains('last')) {
            replaceGradientWithOverlay(current);
          }
          
          const prevSection = getPreviousSection(current);
          if (prevSection) {
            resetOverlayAndFootnote(current);
          } 
        }
      }
    }

    // If no .text-box or all shown, scroll to next/prev section
    if (!isScrollUp) {
      const nextSection = getNextSection(current);
      if (nextSection) {
        scrollToSection(nextSection);
      }
    } else {
      const prevSection = getPreviousSection(current);
      if (prevSection) {
        scrollToSection(prevSection);
      }
    }
  });

  window.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
    }
  });

  function handleCustomScroll(deltaY) {
    const overlay = document.querySelector('.section-full-overlay');
    if (overlay && !overlay.classList.contains('slide-up')) {
      e.preventDefault();
      return;
    }
    
    let adjustedDeltaY = deltaY;
    const isScrollUp = adjustedDeltaY < 0;
    const current = getCurrentSection();

    const sections = Array.from(document.querySelectorAll('section'));
    const sectionIndex = sections.indexOf(current); 
    console.log(sectionIndex);

    // Handle video section scroll first
    if (handleVideoSectionScroll(current, isScrollUp)) {
      return;
    }

    // Only run text-box logic if not on video section
    if (current.id !== 'video') {
      const textBoxes = current.querySelectorAll('.text-box');
      if (textBoxes.length > 0 && current.classList.contains('visible')) {
        const initCounter = counter + 1;
        if (initCounter < textBoxes.length) {
          if (!textBoxScrollLock) {
            textBoxScrollLock = true;
            let newIndex = updateIndex(deltaY);
            currentIndex = newIndex;
            setTimeout(() => {
              textBoxScrollLock = false;
            }, TEXTBOX_SCROLL_LOCK_MS);
          }

          // Show/hide text-boxes as before
          if (!isScrollUp) {
            counter = counter + 1;
            
            if (counter > 0) {
              if (currentIndex > 0 && textBoxes[currentIndex]) {
                if (textBoxes[currentIndex - 1]) {
                  textBoxes[currentIndex - 1].classList.remove('fade-in', 'slide-up');
                  textBoxes[0].classList.add('hidden');
                }

                if (textBoxes[currentIndex].classList.contains('slide')) {
                  textBoxes[currentIndex].classList.add('slide-up');
                  textBoxes[currentIndex].classList.remove('fade-in');
                } else if (textBoxes[currentIndex].classList.contains('fade')) {
                  textBoxes[currentIndex].classList.add('fade-in');
                  textBoxes[currentIndex].classList.remove('slide-up');
                }

                if (
                  current.classList.contains('last') &&
                  currentIndex === textBoxes.length - 1
                ) {
                  replaceGradientWithOverlay(current);
                }
              } else {
                textBoxes[0].classList.remove('fade-in', 'slide-up');
              }
              return;
            } 
          } else {
            // Scroll up
            counter = counter - 1;
            
            if (counter < 0) {
              const prevSection = getPreviousSection(current);
              if (prevSection) {
                // Reset text-box index for the previous section
                currentIndex = 1;
                index = 0;
                counter = 0;
              
                const prevTextBoxes = prevSection.querySelectorAll('.text-box');
                if (prevTextBoxes.length && prevTextBoxes[0].classList.contains('init-slide')) {
                  prevTextBoxes[0].classList.remove('fade-in', 'slide-up', 'hidden');
                }
                
              }
            } else {
              textBoxes[currentIndex + 1].classList.remove('fade-in', 'slide-up');
            
              if (textBoxes[currentIndex].classList.contains('slide') || textBoxes[currentIndex].classList.contains('init-slide')) {
                textBoxes[currentIndex].classList.add('slide-up');
                textBoxes[currentIndex].classList.remove('fade-in');
              } else if (textBoxes[currentIndex].classList.contains('fade')) {
                textBoxes[currentIndex].classList.add('fade-in');
                textBoxes[currentIndex].classList.remove('slide-up');
              }

              return;
            }
          }

          console.log('Current index:', currentIndex, 'Total text boxes:', textBoxes.length);
        } else {
          // All text-boxes shown, reset index for next section
          currentIndex = 1;
          index = 0;
          counter = 0;
          
          // Debug log
          console.log('All text-boxes shown in section:', current.id);
          console.log('Ready to scroll to next/prev section on next wheel event.');

          if (textBoxes.length && textBoxes[0].classList.contains('init-slide')) {
            textBoxes[0].classList.remove('fade-in', 'slide-up', 'hidden');
          }

          // If last section, ensure gradient is replaced
          if (current.classList.contains('last')) {
            replaceGradientWithOverlay(current);
          }
          
          const prevSection = getPreviousSection(current);
          if (prevSection) {
            resetOverlayAndFootnote(current);
          } 
        }
      }
    }

    // If no .text-box or all shown, scroll to next/prev section
    if (!isScrollUp) {
      const nextSection = getNextSection(current);
      if (nextSection) {
        scrollToSection(nextSection);
        console.log('Current section:', current ? current.id : null);
      }
    } else {
      const prevSection = getPreviousSection(current);
      if (prevSection) {
        scrollToSection(prevSection);
        console.log('Current section:', current ? current.id : null);
      }
    }
  }

  window.addEventListener('touchend', function(e) {
    if (touchStartY === null) return;

    touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;

    // Set a threshold to avoid accidental triggers
    if (Math.abs(deltaY) > 40) { // You can adjust this threshold
      // Simulate wheel event: negative deltaY = scroll up, positive = scroll down
      handleCustomScroll(deltaY);
    }

    touchStartY = null;
    touchEndY = null;
  });

  window.addEventListener('orientationchange', function() {
    // Scroll to the first section on screen rotate
    const firstSection = document.querySelector('section');
    if (firstSection) {
      firstSection.scrollIntoView({ behavior: 'smooth' });
      setVisibleSection(firstSection);
    }
  });

  function setupKeyboardArrowNavigation() {
    document.addEventListener('keydown', function(e) {
      // Ignore if overlay is open
      const overlay = document.querySelector('.section-full-overlay');
      if (overlay && !overlay.classList.contains('slide-up')) return;

      // Only respond to up/down arrow keys
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const isScrollUp = e.key === 'ArrowUp';
        const current = getCurrentSection();

        // Handle video section scroll first
        if (handleVideoSectionScroll(current, isScrollUp)) {
          e.preventDefault();
          return;
        }

        // Only run text-box logic if not on video section
        if (current.id !== 'video') {
          const textBoxes = current.querySelectorAll('.text-box');
          if (textBoxes.length > 0 && current.classList.contains('visible')) {
            const initCounter = counter + 1;
            if (initCounter < textBoxes.length) {
              if (!textBoxScrollLock) {
                textBoxScrollLock = true;
                let newIndex = updateIndex(isScrollUp ? -1 : 1);
                currentIndex = newIndex;
                setTimeout(() => {
                  textBoxScrollLock = false;
                }, TEXTBOX_SCROLL_LOCK_MS);
              }

              // Show/hide text-boxes as before
              if (!isScrollUp) {
                counter = counter + 1;
                if (counter > 0) {
                  if (currentIndex > 0 && textBoxes[currentIndex]) {
                    if (textBoxes[currentIndex - 1]) {
                      textBoxes[currentIndex - 1].classList.remove('fade-in', 'slide-up');
                      textBoxes[0].classList.add('hidden');
                    }

                    if (textBoxes[currentIndex].classList.contains('slide')) {
                      textBoxes[currentIndex].classList.add('slide-up');
                      textBoxes[currentIndex].classList.remove('fade-in');
                    } else if (textBoxes[currentIndex].classList.contains('fade')) {
                      textBoxes[currentIndex].classList.add('fade-in');
                      textBoxes[currentIndex].classList.remove('slide-up');
                    }

                    if (
                      current.classList.contains('last') &&
                      currentIndex === textBoxes.length - 1
                    ) {
                      replaceGradientWithOverlay(current);
                    }
                  } else {
                    textBoxes[0].classList.remove('fade-in', 'slide-up');
                  }
                  e.preventDefault();
                  return;
                }
              } else {
                // Scroll up
                counter = counter - 1;
                if (counter < 0) {
                  const prevSection = getPreviousSection(current);
                  if (prevSection) {
                    currentIndex = 1;
                    index = 0;
                    counter = 0;
                    const prevTextBoxes = prevSection.querySelectorAll('.text-box');
                    if (prevTextBoxes.length && prevTextBoxes[0].classList.contains('init-slide')) {
                      prevTextBoxes[0].classList.remove('fade-in', 'slide-up', 'hidden');
                    }
                  }
                } else {
                  textBoxes[currentIndex + 1].classList.remove('fade-in', 'slide-up');
                  if (textBoxes[currentIndex].classList.contains('slide') || textBoxes[currentIndex].classList.contains('init-slide')) {
                    textBoxes[currentIndex].classList.add('slide-up');
                    textBoxes[currentIndex].classList.remove('fade-in');
                  } else if (textBoxes[currentIndex].classList.contains('fade')) {
                    textBoxes[currentIndex].classList.add('fade-in');
                    textBoxes[currentIndex].classList.remove('slide-up');
                  }
                  e.preventDefault();
                  return;
                }
              }
            } else {
              // All text-boxes shown, reset index for next section
              currentIndex = 1;
              index = 0;
              counter = 0;

              if (textBoxes.length && textBoxes[0].classList.contains('init-slide')) {
                textBoxes[0].classList.remove('fade-in', 'slide-up', 'hidden');
              }

              if (current.classList.contains('last')) {
                replaceGradientWithOverlay(current);
              }

              const prevSection = getPreviousSection(current);
              if (prevSection) {
                resetOverlayAndFootnote(current);
              }
            }
          }
        }

        // If no .text-box or all shown, scroll to next/prev section
        if (!isScrollUp) {
          const nextSection = getNextSection(current);
          if (nextSection) {
            scrollToSection(nextSection);
          }
        } else {
          const prevSection = getPreviousSection(current);
          if (prevSection) {
            scrollToSection(prevSection);
          }
        }
        e.preventDefault();
      }
    });
  }

  // Call this inside DOMContentLoaded
  setupKeyboardArrowNavigation();

  const closeBook = document.querySelector('.close-book');
  const storybook = document.getElementById('storybook');
  if (closeBook && storybook) {
    closeBook.addEventListener('click', function() {
      storybook.classList.add('hidden');
    });
  }
});
