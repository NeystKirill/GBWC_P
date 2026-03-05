import './style.css'
import { initPreloader } from './components/preloader'

initPreloader();

// ── Nav scroll ──
const nav = document.getElementById('main-nav');
const logoNav = document.getElementById('logo-nav');
let lastScrollY = 0, ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const cur = window.scrollY;
      if (cur > 50) {
        if (cur > lastScrollY + 5) { nav?.classList.add('nav-hidden'); logoNav?.classList.add('nav-hidden'); }
        else if (lastScrollY - cur > 5) { nav?.classList.remove('nav-hidden'); logoNav?.classList.remove('nav-hidden'); }
      } else { nav?.classList.remove('nav-hidden'); logoNav?.classList.remove('nav-hidden'); }
      lastScrollY = cur; ticking = false;
    }); ticking = true;
  }
}, { passive: true });

// ── Burger ──
const burger = document.getElementById('nav-burger');
const mobileMenu = document.getElementById('nav-mobile');
burger?.addEventListener('click', () => {
  const isOpen = mobileMenu?.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
});
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => { mobileMenu.classList.remove('open'); burger?.classList.remove('open'); });
});

// ── Hero title alternation ──
const titleCouncil = document.getElementById('title-council') as HTMLElement;
const titleGbwc    = document.getElementById('title-gbwc')    as HTMLElement;
if (titleCouncil && titleGbwc) {
  titleCouncil.classList.add('visible');
  let showingCouncil = true;
  setInterval(() => {
    if (showingCouncil) {
      titleCouncil.classList.remove('visible'); titleCouncil.classList.add('hidden');
      titleGbwc.classList.remove('hidden'); titleGbwc.classList.add('visible');
    } else {
      titleGbwc.classList.remove('visible'); titleGbwc.classList.add('hidden');
      titleCouncil.classList.remove('hidden'); titleCouncil.classList.add('visible');
    }
    showingCouncil = !showingCouncil;
  }, 3000);
}

// ── Counters ──
function animateCounter(el: HTMLElement) {
  const target = parseInt((el as any).dataset.target || '0', 10);
  const suffix = (el as any).dataset.suffix || '';
  const duration = 2800;
  const start = performance.now();
  const update = (now: number) => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 4)) * target) + suffix;
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
const cobs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target as HTMLElement); cobs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll<HTMLElement>('[data-target]').forEach(el => cobs.observe(el));

// ── GSAP ScrollTrigger animations ──
function initGSAP() {
  const G = (window as any).gsap;
  const ST = (window as any).ScrollTrigger;
  if (!G || !ST) return;
  G.registerPlugin(ST);

  // Skip if partners page — has its own animation
  if (!document.getElementById('partner-categories')) {
    G.utils.toArray('.sec-label, .sec-title, .sec-subtitle, .about-lead, .about-text, .sec-header-row h1').forEach((el: any) => {
      G.fromTo(el, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
  }

  ['.direction-card','.event-card','.about-dir-card','.init-card','.media-card'].forEach(sel => {
    const groups = new Map<Element, Element[]>();
    document.querySelectorAll(sel).forEach((c: any) => {
      const p = c.parentElement; if (!groups.has(p)) groups.set(p, []); groups.get(p)!.push(c);
    });
    groups.forEach(cards => {
      G.fromTo(cards, { opacity: 0, y: 44, scale: 0.96 }, { opacity: 1, y: 0, scale: 1,
        duration: 0.65, ease: 'power3.out', stagger: 0.09,
        scrollTrigger: { trigger: cards[0], start: 'top 86%', once: true } });
    });
  });

  G.utils.toArray('.about-hero-left,.contacts-info,.hero-col-left').forEach((el: any) => {
    G.fromTo(el, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
  G.utils.toArray('.about-hero-right,.contacts-form,.hero-col-right').forEach((el: any) => {
    G.fromTo(el, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });

  G.utils.toArray('.founder-card').forEach((el: any) => {
    G.fromTo(el, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
  });

  G.utils.toArray('.hero-stat, .hero-stats-ru > div').forEach((el: any, i: number) => {
    G.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55, delay: i * 0.11,
      ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  // partner-cat animated separately on partners page
  if (!document.getElementById('partner-categories')) {
    G.utils.toArray('.partner-cat').forEach((el: any, i: number) => {
      G.fromTo(el, { opacity: 0, x: -28 }, { opacity: 1, x: 0, duration: 0.55, delay: i * 0.09,
        ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
  }

  G.utils.toArray('.footer-top > div').forEach((el: any, i: number) => {
    G.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55, delay: i * 0.09,
      ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true } });
  });

}

window.addEventListener('load', initGSAP);

// ── Smooth Scrollbar (optional, graceful fallback) ──
window.addEventListener('load', () => {
  const SS = (window as any).Scrollbar;
  if (!SS) return;
  try {
    SS.init(document.body, {
      damping: 0.07,
      thumbMinSize: 20,
      renderByPixels: true,
      alwaysShowTracks: false,
      continuousScrolling: true,
    });
  } catch(e) {
    console.warn('smooth-scrollbar init failed', e);
  }
});
