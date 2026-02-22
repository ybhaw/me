// ========== Scroll Reveal ==========
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ========== Experience Tabs ==========
const tabs = document.querySelectorAll('.exp__tab');
const panels = document.querySelectorAll('.exp__panel');

function activateTab(tab) {
  const idx = tab.dataset.tab;

  tabs.forEach((t) => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
    t.setAttribute('tabindex', '-1');
  });
  panels.forEach((p) => p.classList.remove('active'));

  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  tab.setAttribute('tabindex', '0');
  tab.focus();
  document.querySelector(`.exp__panel[data-panel="${idx}"]`).classList.add('active');
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => activateTab(tab));
});

// Keyboard navigation for tabs (Arrow keys, Home, End)
const tabList = document.querySelector('.exp__tabs');
if (tabList) {
  tabList.addEventListener('keydown', (e) => {
    const tabsArr = Array.from(tabs);
    const currentIdx = tabsArr.indexOf(document.activeElement);
    if (currentIdx === -1) return;

    let newIdx;
    const isVertical = window.innerWidth > 768;

    if ((isVertical && e.key === 'ArrowDown') || (!isVertical && e.key === 'ArrowRight')) {
      e.preventDefault();
      newIdx = (currentIdx + 1) % tabsArr.length;
    } else if ((isVertical && e.key === 'ArrowUp') || (!isVertical && e.key === 'ArrowLeft')) {
      e.preventDefault();
      newIdx = (currentIdx - 1 + tabsArr.length) % tabsArr.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIdx = tabsArr.length - 1;
    }

    if (newIdx !== undefined) {
      activateTab(tabsArr[newIdx]);
    }
  });
}

// ========== Mobile Menu ==========
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.classList.toggle('menu-open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ========== Active Nav Tracking ==========
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav__link');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -60% 0px' }
);

sections.forEach((section) => navObserver.observe(section));

// ========== Hero Marquee (infinite scroll) ==========
(function () {
  const container = document.querySelector('.hero__marquee');
  if (!container) return;

  const track = container.querySelector('.marquee__track');
  const halfWidth = track.scrollWidth / 2;

  let speed = 0.5;
  let isProgrammatic = false;
  let isUserScrolling = false;
  let userScrollTimeout;

  function wrapScroll() {
    if (container.scrollLeft >= halfWidth) {
      isProgrammatic = true;
      container.scrollLeft -= halfWidth;
    } else if (container.scrollLeft <= 0) {
      isProgrammatic = true;
      container.scrollLeft += halfWidth;
    }
  }

  function autoScroll() {
    if (!isUserScrolling) {
      isProgrammatic = true;
      container.scrollLeft += speed;
      wrapScroll();
    }
    requestAnimationFrame(autoScroll);
  }

  container.addEventListener('scroll', function () {
    if (isProgrammatic) {
      isProgrammatic = false;
      return;
    }
    isUserScrolling = true;
    clearTimeout(userScrollTimeout);
    userScrollTimeout = setTimeout(function () {
      wrapScroll();
      isUserScrolling = false;
    }, 1500);
  }, { passive: true });

  container.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) > 0) {
      e.preventDefault();
      isUserScrolling = true;
      clearTimeout(userScrollTimeout);
      container.scrollLeft += e.deltaY + e.deltaX;
      userScrollTimeout = setTimeout(function () {
        wrapScroll();
        isUserScrolling = false;
      }, 1500);
    }
  }, { passive: false });

  requestAnimationFrame(autoScroll);
})();