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


// Screenshot galleries inside individual projects.
document.querySelectorAll('.project-gallery').forEach(gallery => {
  const images = [...gallery.querySelectorAll('.gallery-image')];
  const thumbs = [...gallery.querySelectorAll('.gallery-thumbnails button')];
  const currentLabel = gallery.querySelector('.gallery-counter .current');
  const previous = gallery.querySelector('.gallery-prev');
  const next = gallery.querySelector('.gallery-next');
  const stage = gallery.querySelector('.gallery-stage');
  let imageIndex = 0;
  let galleryTouchStartX = 0;

  const showImage = index => {
    imageIndex = (index + images.length) % images.length;
    images.forEach((image, i) => image.classList.toggle('active', i === imageIndex));
    thumbs.forEach((thumb, i) => thumb.classList.toggle('active', i === imageIndex));
    if (currentLabel) currentLabel.textContent = String(imageIndex + 1);
  };

  previous?.addEventListener('click', event => {
    event.stopPropagation();
    showImage(imageIndex - 1);
  });
  next?.addEventListener('click', event => {
    event.stopPropagation();
    showImage(imageIndex + 1);
  });
  thumbs.forEach((thumb, index) => thumb.addEventListener('click', event => {
    event.stopPropagation();
    showImage(index);
  }));

  stage?.addEventListener('touchstart', event => {
    event.stopPropagation();
    galleryTouchStartX = event.touches[0].clientX;
  }, { passive:true });
  stage?.addEventListener('touchend', event => {
    event.stopPropagation();
    const distance = event.changedTouches[0].clientX - galleryTouchStartX;
    if (Math.abs(distance) > 40) showImage(imageIndex + (distance < 0 ? 1 : -1));
  }, { passive:true });
});


// ===== Featured projects slider =====
document.querySelectorAll('[data-project-showcase]').forEach(showcase => {
  const panels = [...showcase.querySelectorAll('[data-project-panel]')];
  const dots = [...showcase.querySelectorAll('.project-dots button')];
  const prev = showcase.querySelector('.project-nav-prev');
  const next = showcase.querySelector('.project-nav-next');
  let index = 0;

  const showProject = newIndex => {
    index = (newIndex + panels.length) % panels.length;
    panels.forEach((panel, i) => panel.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };

  prev?.addEventListener('click', () => showProject(index - 1));
  next?.addEventListener('click', () => showProject(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => showProject(i)));
});

// ===== Screenshot gallery inside each project =====
document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const images = [...gallery.querySelectorAll('.project-image')];
  const thumbs = [...gallery.querySelectorAll('.project-thumbnails button')];
  const prev = gallery.querySelector('.image-prev');
  const next = gallery.querySelector('.image-next');
  const label = gallery.querySelector('.image-label');
  const stage = gallery.querySelector('.project-image-stage');
  let index = 0;
  let startX = 0;

  const showImage = newIndex => {
    index = (newIndex + images.length) % images.length;
    images.forEach((image, i) => image.classList.toggle('active', i === index));
    thumbs.forEach((thumb, i) => thumb.classList.toggle('active', i === index));
    if (label && thumbs[index]) label.textContent = thumbs[index].dataset.label || '';
  };

  prev?.addEventListener('click', event => {
    event.stopPropagation();
    showImage(index - 1);
  });
  next?.addEventListener('click', event => {
    event.stopPropagation();
    showImage(index + 1);
  });
  thumbs.forEach((thumb, i) => thumb.addEventListener('click', event => {
    event.stopPropagation();
    showImage(i);
  }));

  stage?.addEventListener('touchstart', event => {
    startX = event.touches[0].clientX;
  }, { passive:true });
  stage?.addEventListener('touchend', event => {
    const distance = event.changedTouches[0].clientX - startX;
    if (Math.abs(distance) > 40) showImage(index + (distance < 0 ? 1 : -1));
  }, { passive:true });
});

// Clean JPA screenshot slider.
document.querySelectorAll('[data-gallery]').forEach((gallery) => {
  const images = Array.from(gallery.querySelectorAll('.project-image'));
  const dots = Array.from(gallery.querySelectorAll('.image-progress button'));
  const previousButton = gallery.querySelector('.image-prev');
  const nextButton = gallery.querySelector('.image-next');
  const label = gallery.querySelector('.image-label');
  let currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + images.length) % images.length;

    images.forEach((image, imageIndex) => {
      image.classList.toggle('active', imageIndex === currentIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === currentIndex);
    });

    if (label) {
      label.textContent = images[currentIndex].dataset.label || '';
    }
  }

  previousButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    showImage(currentIndex - 1);
  });

  nextButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    showImage(currentIndex + 1);
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', (event) => {
      event.stopPropagation();
      showImage(dotIndex);
    });
  });

  showImage(0);
});

// Final clean gallery without thumbnail boxes or progress dots.
document.querySelectorAll('[data-gallery]').forEach((gallery) => {
  const images = Array.from(gallery.querySelectorAll('.project-image'));
  const previousButton = gallery.querySelector('.image-prev');
  const nextButton = gallery.querySelector('.image-next');
  const label = gallery.querySelector('.image-label');
  let currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + images.length) % images.length;

    images.forEach((image, imageIndex) => {
      image.classList.toggle('active', imageIndex === currentIndex);
    });

    if (label && images[currentIndex]) {
      label.textContent = images[currentIndex].dataset.label || '';
    }
  }

  previousButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    showImage(currentIndex - 1);
  });

  nextButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    showImage(currentIndex + 1);
  });

  showImage(0);
});
\n// Project image lightbox\nconst projectLightbox=document.getElementById('projectLightbox');\nconst lightboxImage=projectLightbox?.querySelector('img');\ndocument.querySelectorAll('[data-lightbox-src]').forEach(button=>{button.addEventListener('click',()=>{if(!projectLightbox||!lightboxImage)return;lightboxImage.src=button.dataset.lightboxSrc;projectLightbox.classList.add('open');projectLightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';});});\nfunction closeProjectLightbox(){if(!projectLightbox||!lightboxImage)return;projectLightbox.classList.remove('open');projectLightbox.setAttribute('aria-hidden','true');lightboxImage.src='';document.body.style.overflow='';}\nprojectLightbox?.querySelector('.lightbox-close')?.addEventListener('click',closeProjectLightbox);\nprojectLightbox?.addEventListener('click',event=>{if(event.target===projectLightbox)closeProjectLightbox();});\ndocument.addEventListener('keydown',event=>{if(event.key==='Escape')closeProjectLightbox();});\n