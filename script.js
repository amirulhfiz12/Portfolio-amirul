const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = [...document.querySelectorAll('.nav-links a')];
const sections = [...document.querySelectorAll('main section[id]')];

const savedTheme = localStorage.getItem('amirul-theme');
if (savedTheme) root.dataset.theme = savedTheme;

themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('amirul-theme', next);
});

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navAnchors.forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const updateActiveNav = () => {
  let current = 'home';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 130) current = section.id;
  });
  navAnchors.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
};
window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

document.getElementById('year').textContent = new Date().getFullYear();

// Click and keyboard animation for education, coursework and skill cards.
document.querySelectorAll('.interactive-card').forEach(card => {
  const activate = () => {
    const isActive = card.classList.toggle('is-active');
    if (card.hasAttribute('aria-expanded')) card.setAttribute('aria-expanded', String(isActive));
    if (card.hasAttribute('aria-pressed')) card.setAttribute('aria-pressed', String(isActive));
  };
  card.addEventListener('click', activate);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
    }
  });
});

// Project carousel. Ready for real screenshots later.
const track = document.querySelector('.project-track');
const slides = [...document.querySelectorAll('.project-slide')];
const dots = [...document.querySelectorAll('.slider-dots button')];
const prevButton = document.querySelector('.slider-btn.prev');
const nextButton = document.querySelector('.slider-btn.next');
let projectIndex = 0;
let touchStartX = 0;

function showProject(index) {
  projectIndex = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${projectIndex * 100}%)`;
  dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === projectIndex));
}

prevButton?.addEventListener('click', () => showProject(projectIndex - 1));
nextButton?.addEventListener('click', () => showProject(projectIndex + 1));
dots.forEach((dot, index) => dot.addEventListener('click', () => showProject(index)));
track?.addEventListener('touchstart', event => { touchStartX = event.touches[0].clientX; }, { passive:true });
track?.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 45) showProject(projectIndex + (distance < 0 ? 1 : -1));
}, { passive:true });
