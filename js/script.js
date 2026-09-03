// ===== VALLENCI SAÚDE INTEGRADA — script.js =====

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const backToTop = document.querySelector('.float-btn.back-to-top');

  // Menu mobile
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // Header muda ao rolar + botão voltar ao topo aparece
  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 12);
    backToTop?.classList.toggle('show', window.scrollY > 480);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // FAQ accordion (altura dinâmica, um item aberto por vez)
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Link do menu ativo conforme a seção visível
  if (navLinks) {
    const navMap = new Map();
    navLinks.querySelectorAll('a[href^="#"]').forEach(a => {
      navMap.set(a.getAttribute('href').slice(1), a);
    });
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const link = navMap.get(entry.target.id);
        if (!link || !entry.isIntersecting) return;
        navMap.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach(section => {
      if (navMap.has(section.id)) sectionObserver.observe(section);
    });
  }

  // Animação de entrada ao rolar (fade + slide up)
  document.querySelectorAll('[data-reveal-stagger]').forEach(group => {
    [...group.children].forEach((child, i) => {
      child.style.setProperty('--reveal-delay', `${i * 90}ms`);
    });
  });
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // Lightbox das fotos (galeria + cards)
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const galleryImgs = [...document.querySelectorAll('.lb-img')];
  let currentIndex = 0;

  const renderLightbox = (index) => {
    currentIndex = (index + galleryImgs.length) % galleryImgs.length;
    lightboxImg.src = galleryImgs[currentIndex].src;
    lightboxImg.alt = galleryImgs[currentIndex].alt;
  };
  const openLightbox = (index) => {
    renderLightbox(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (lightbox && galleryImgs.length) {
    galleryImgs.forEach((img, i) => {
      img.addEventListener('click', () => openLightbox(i));
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => renderLightbox(currentIndex - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => renderLightbox(currentIndex + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') renderLightbox(currentIndex + 1);
      if (e.key === 'ArrowLeft') renderLightbox(currentIndex - 1);
    });
  }
});
