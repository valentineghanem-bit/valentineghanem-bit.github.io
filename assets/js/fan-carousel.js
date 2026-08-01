// Fan carousel: preserves the original 21.dev-inspired card deck while adding
// roving focus, autoplay control, touch navigation and a complete image dialog.
(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lightbox = null;

  function getLightbox() {
    if (lightbox) return lightbox;

    var backdrop = document.createElement('div');
    backdrop.className = 'fan-lightbox-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', 'Full-size photograph');
    backdrop.setAttribute('aria-describedby', 'fan-lightbox-caption');
    backdrop.setAttribute('aria-hidden', 'true');

    var flyer = document.createElement('div');
    flyer.className = 'fan-lightbox-flyer';

    var image = document.createElement('img');
    image.alt = 'Full-size photograph of Valentine Golden Ghanem';
    flyer.appendChild(image);

    var caption = document.createElement('p');
    caption.id = 'fan-lightbox-caption';
    caption.className = 'fan-lightbox-caption';

    function controlButton(className, label, iconClass) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = className;
      button.setAttribute('aria-label', label);
      button.innerHTML = '<i class="' + iconClass + '" aria-hidden="true"></i>';
      return button;
    }

    var closeButton = controlButton('fan-lightbox-close', 'Close full-size photograph', 'fa-solid fa-xmark');
    var previousButton = controlButton('fan-lightbox-arrow fan-lightbox-arrow--prev', 'Previous photograph', 'fa-solid fa-chevron-left');
    var nextButton = controlButton('fan-lightbox-arrow fan-lightbox-arrow--next', 'Next photograph', 'fa-solid fa-chevron-right');

    backdrop.appendChild(flyer);
    backdrop.appendChild(caption);
    backdrop.appendChild(closeButton);
    backdrop.appendChild(previousButton);
    backdrop.appendChild(nextButton);
    document.body.appendChild(backdrop);

    var cards = [];
    var currentIndex = 0;
    var triggerCard = null;
    var isOpen = false;
    var onChange = null;
    var onClose = null;
    var closeTimer = null;

    function fitBox(naturalWidth, naturalHeight) {
      var maxWidth = window.innerWidth * .88;
      var maxHeight = window.innerHeight * .76;
      var ratio = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight, 1) || 1;
      var width = Math.max(1, naturalWidth * ratio);
      var height = Math.max(1, naturalHeight * ratio);
      return {
        width: width,
        height: height,
        left: (window.innerWidth - width) / 2,
        top: (window.innerHeight - height) / 2
      };
    }

    function setOrigin(card) {
      var rect = card.getBoundingClientRect();
      flyer.style.left = rect.left + 'px';
      flyer.style.top = rect.top + 'px';
      flyer.style.width = rect.width + 'px';
      flyer.style.height = rect.height + 'px';
      flyer.style.borderRadius = getComputedStyle(card).borderRadius;
    }

    function placeControls(box) {
      caption.style.left = '50%';
      caption.style.top = Math.min(box.top + box.height + 18, window.innerHeight - 40) + 'px';
      closeButton.style.left = Math.min(box.left + box.width - 22, window.innerWidth - 60) + 'px';
      closeButton.style.top = Math.max(box.top - 22, 10) + 'px';
    }

    function growToImage(sourceImage) {
      var naturalWidth = sourceImage.naturalWidth || 900;
      var naturalHeight = sourceImage.naturalHeight || 1100;
      var box = fitBox(naturalWidth, naturalHeight);
      backdrop.classList.add('is-open');
      flyer.getBoundingClientRect();
      requestAnimationFrame(function () {
        flyer.style.left = box.left + 'px';
        flyer.style.top = box.top + 'px';
        flyer.style.width = box.width + 'px';
        flyer.style.height = box.height + 'px';
        flyer.style.borderRadius = '8px';
        image.style.objectFit = 'contain';
        placeControls(box);
        caption.classList.add('is-open');
        closeButton.classList.add('is-open');
        previousButton.classList.add('is-open');
        nextButton.classList.add('is-open');
      });
    }

    function show(index, opening) {
      if (!cards.length) return;
      currentIndex = (index + cards.length) % cards.length;
      var card = cards[currentIndex];
      var sourceImage = card.querySelector('img');
      if (!sourceImage) return;

      image.src = sourceImage.currentSrc || sourceImage.src;
      image.alt = sourceImage.alt || 'Full-size photograph of Valentine Golden Ghanem';
      caption.textContent = card.getAttribute('data-caption') || '';
      backdrop.setAttribute('aria-label', 'Full-size photograph ' + (currentIndex + 1) + ' of ' + cards.length);
      triggerCard = card;

      if (opening) {
        setOrigin(card);
        image.style.objectFit = 'cover';
      }

      var grow = function () { growToImage(sourceImage); };
      if (sourceImage.complete && sourceImage.naturalWidth) grow();
      else sourceImage.addEventListener('load', grow, { once: true });

      if (onChange) onChange(currentIndex);
    }

    function move(delta) {
      show(currentIndex + delta, false);
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      window.clearTimeout(closeTimer);
      backdrop.classList.remove('is-open');
      caption.classList.remove('is-open');
      closeButton.classList.remove('is-open');
      previousButton.classList.remove('is-open');
      nextButton.classList.remove('is-open');
      document.body.classList.remove('fan-lightbox-open');
      document.removeEventListener('keydown', onKeydown);

      if (triggerCard && triggerCard.isConnected) {
        setOrigin(triggerCard);
        image.style.objectFit = 'cover';
      }

      closeTimer = window.setTimeout(function () {
        flyer.style.visibility = 'hidden';
        backdrop.setAttribute('aria-hidden', 'true');
        if (onClose) onClose();
        onClose = null;
        if (triggerCard && triggerCard.isConnected) triggerCard.focus();
      }, prefersReduced ? 0 : 560);
    }

    function focusableControls() {
      return [previousButton, nextButton, closeButton];
    }

    function onKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        move(-1);
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        move(1);
        return;
      }
      if (event.key !== 'Tab') return;
      var controls = focusableControls();
      var current = controls.indexOf(document.activeElement);
      if (event.shiftKey && (current <= 0)) {
        event.preventDefault();
        controls[controls.length - 1].focus();
      } else if (!event.shiftKey && current === controls.length - 1) {
        event.preventDefault();
        controls[0].focus();
      }
    }

    function open(deckCards, index, changeCallback, closeCallback) {
      cards = deckCards.slice();
      onChange = changeCallback || null;
      onClose = closeCallback || null;
      triggerCard = cards[index] || cards[0];
      isOpen = true;
      window.clearTimeout(closeTimer);
      flyer.style.visibility = 'visible';
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.classList.add('fan-lightbox-open');
      document.addEventListener('keydown', onKeydown);
      show(index, true);
      window.setTimeout(function () { closeButton.focus(); }, prefersReduced ? 0 : 320);
    }

    backdrop.addEventListener('click', function (event) {
      if (event.target === backdrop) close();
    });
    closeButton.addEventListener('click', close);
    previousButton.addEventListener('click', function () { move(-1); });
    nextButton.addEventListener('click', function () { move(1); });

    lightbox = { open: open, close: close };
    return lightbox;
  }

  function initialiseFan(root) {
    var cards = Array.prototype.slice.call(root.querySelectorAll('.fan-carousel__card'));
    var dotsWrap = root.querySelector('.fan-carousel__dots');
    var caption = root.querySelector('.fan-carousel__caption');
    var previousButton = root.querySelector('.fan-carousel__arrow--prev');
    var nextButton = root.querySelector('.fan-carousel__arrow--next');
    var toggleButton = root.querySelector('[data-fan-toggle]');
    var currentLabel = root.querySelector('[data-fan-current]');
    if (!cards.length || !dotsWrap) return;

    var active = Math.floor(cards.length / 2);
    var visibleRange = window.innerWidth < 720 ? 3 : 4;
    var autoplayDelay = Number(root.getAttribute('data-autoplay')) || 0;
    var timer = null;
    var manualPaused = prefersReduced || !autoplayDelay;
    var hoverPaused = false;
    var focusPaused = false;
    var offscreenPaused = false;

    root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', 'fan carousel');
    root.setAttribute('aria-label', root.getAttribute('data-gallery-label') || 'Photographic carousel');

    function syncToggle() {
      if (!toggleButton) return;
      toggleButton.setAttribute('aria-pressed', manualPaused ? 'true' : 'false');
      toggleButton.setAttribute('aria-label', manualPaused ? 'Resume carousel autoplay' : 'Pause carousel autoplay');
      toggleButton.title = manualPaused ? 'Resume carousel' : 'Pause carousel';
      toggleButton.innerHTML = manualPaused
        ? '<i class="fa-solid fa-play" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
    }

    function shouldAutoplay() {
      return autoplayDelay && !manualPaused && !hoverPaused && !focusPaused &&
        !offscreenPaused && !document.hidden;
    }

    function stopTimer() {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function syncTimer() {
      stopTimer();
      if (shouldAutoplay()) {
        timer = window.setInterval(function () { goTo(active + 1, false); }, autoplayDelay);
      }
    }

    function fanGeometry() {
      return window.innerWidth < 720
        ? { spacing: 54, angle: 11, depth: 15 }
        : { spacing: 104, angle: 14, depth: 22 };
    }

    function render(focusActive) {
      var geometry = fanGeometry();
      cards.forEach(function (card, index) {
        var delta = index - active;
        var absolute = Math.abs(delta);
        var isActive = delta === 0;
        var isVisible = absolute <= visibleRange;
        card.classList.toggle('is-active', isActive);
        card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        card.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
        card.tabIndex = isActive ? 0 : -1;

        if (!isVisible) {
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          card.style.zIndex = '0';
          return;
        }

        card.style.pointerEvents = 'auto';
        var x = delta * geometry.spacing;
        var rotation = delta * geometry.angle;
        var scale = isActive ? 1.14 : Math.max(.68, 1 - absolute * .075);
        var y = Math.pow(absolute, 1.48) * geometry.depth;
        card.style.transform =
          'translate(' + x + 'px,' + y + 'px)' +
          ' rotate(' + rotation + 'deg)' +
          ' scale(' + scale + ')';
        card.style.opacity = String(Math.max(.28, 1 - absolute * .16));
        card.style.zIndex = String(20 - absolute);
      });

      var dots = Array.prototype.slice.call(dotsWrap.children);
      dots.forEach(function (dot, index) {
        var isActive = index === active;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });

      if (currentLabel) currentLabel.textContent = String(active + 1);
      if (caption) {
        caption.textContent = cards[active].getAttribute('data-caption') || '';
        caption.classList.add('is-visible');
      }

      var activeDot = dots[active];
      if (activeDot) {
        var targetLeft = activeDot.offsetLeft -
          (dotsWrap.clientWidth - activeDot.offsetWidth) / 2;
        if (dotsWrap.scrollTo) {
          dotsWrap.scrollTo({
            left: Math.max(0, targetLeft),
            behavior: prefersReduced ? 'auto' : 'smooth'
          });
        } else {
          dotsWrap.scrollLeft = Math.max(0, targetLeft);
        }
      }
      if (focusActive) cards[active].focus();
    }

    function goTo(index, focusActive) {
      active = (index + cards.length) % cards.length;
      render(!!focusActive);
      syncTimer();
    }

    cards.forEach(function (card, index) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'fan-carousel__dot';
      dot.setAttribute('aria-label', 'Show photograph ' + (index + 1) + ' of ' + cards.length);
      dot.addEventListener('click', function () { goTo(index, false); });
      dotsWrap.appendChild(dot);

      card.addEventListener('click', function () {
        if (index === active) {
          focusPaused = true;
          syncTimer();
          getLightbox().open(cards, active, function (lightboxIndex) {
            active = lightboxIndex;
            render(false);
          }, function () {
            focusPaused = false;
            syncTimer();
          });
        } else {
          goTo(index, false);
        }
      });

      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          focusPaused = true;
          syncTimer();
          getLightbox().open(cards, active, function (lightboxIndex) {
            active = lightboxIndex;
            render(false);
          }, function () {
            focusPaused = false;
            syncTimer();
          });
          return;
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          goTo(active + 1, true);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goTo(active - 1, true);
        } else if (event.key === 'Home') {
          event.preventDefault();
          goTo(0, true);
        } else if (event.key === 'End') {
          event.preventDefault();
          goTo(cards.length - 1, true);
        }
      });
    });

    if (nextButton) nextButton.addEventListener('click', function () { goTo(active + 1, false); });
    if (previousButton) previousButton.addEventListener('click', function () { goTo(active - 1, false); });

    if (toggleButton) {
      toggleButton.addEventListener('click', function () {
        manualPaused = !manualPaused;
        syncToggle();
        syncTimer();
      });
    }

    var touchStartX = null;
    root.addEventListener('touchstart', function (event) {
      touchStartX = event.touches[0].clientX;
    }, { passive: true });
    root.addEventListener('touchend', function (event) {
      if (touchStartX === null) return;
      var distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) > 40) goTo(distance < 0 ? active + 1 : active - 1, false);
      touchStartX = null;
    }, { passive: true });

    root.addEventListener('mouseenter', function () {
      hoverPaused = true;
      syncTimer();
    });
    root.addEventListener('mouseleave', function () {
      hoverPaused = false;
      syncTimer();
    });
    root.addEventListener('focusin', function () {
      focusPaused = true;
      syncTimer();
    });
    root.addEventListener('focusout', function (event) {
      if (event.relatedTarget && root.contains(event.relatedTarget)) return;
      focusPaused = false;
      syncTimer();
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        offscreenPaused = !entries[0].isIntersecting;
        syncTimer();
      }, { threshold: .15 });
      observer.observe(root);
    }

    document.addEventListener('visibilitychange', syncTimer);
    window.addEventListener('resize', function () {
      visibleRange = window.innerWidth < 720 ? 3 : 4;
      render(false);
    }, { passive: true });

    syncToggle();
    render(false);
    syncTimer();
  }

  document.querySelectorAll('.fan-carousel').forEach(initialiseFan);
})();
