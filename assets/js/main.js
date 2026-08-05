/**
 * Youcy Huang Portfolio — Main JavaScript
 */

(function () {
  'use strict';

  // ── Lightbox ──────────────────────────────────
  function initLightbox() {
    if (document.querySelector('.lightbox')) return;

    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <button class="lightbox-close" aria-label="Close">Close</button>
      <img src="" alt="">
    `;
    document.body.appendChild(lb);

    const img = lb.querySelector('img');

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.gallery-item')) return;
      const item = e.target.closest('.gallery-item');
      const el = item.querySelector('img');
      if (!el) return;
      e.preventDefault();
      img.src = el.src;
      img.alt = el.alt;
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox-close')) {
        lb.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        lb.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Helper ────────────────────────────────────
  function makeItem(filename, title, series) {
    return `
      <div class="gallery-item">
        <img src="${filename}" alt="${title}" loading="lazy">
        <div class="gallery-caption">
          <span class="title">${title}</span>
          <span class="meta">${series}</span>
        </div>
      </div>`;
  }

  // ── Paintings — Chronological Stages ──────────
  function populatePaintings() {
    // Stage 1: Early years (image_03, 04, 01, 31 — smaller, early works)
    const earlyGrid = document.querySelector('[data-stage="early"]');
    if (earlyGrid) {
      const earlyImgs = ['image_03.jpeg', 'image_04.jpeg', 'image_01.jpeg', 'image_31.jpeg', 'image_14.jpeg', 'image_12.jpeg'];
      let html = '';
      earlyImgs.forEach(function (f, i) {
        html += makeItem('assets/images/artworks/' + f, 'Early Work (' + (i + 1) + ')', 'Age 9–17');
      });
      earlyGrid.innerHTML = html;
    }

    // Stage 2: Academic Realism 2021-2022
    const academicGrid = document.querySelector('[data-stage="academic"]');
    if (academicGrid) {
      const acadImgs = ['image_39.jpeg', 'image_40.jpeg', 'image_41.jpeg', 'image_42.jpeg', 'image_43.jpeg', 'image_44.jpeg', 'image_45.jpeg', 'image_46.jpeg'];
      let html = '';
      acadImgs.forEach(function (f, i) {
        html += makeItem('assets/images/artworks/' + f, 'Academic Study (' + (i + 1) + ')', '2021–2022');
      });
      academicGrid.innerHTML = html;
    }

    // Stage 3: Heidegger turn 2023
    const heideggerGrid = document.querySelector('[data-stage="heidegger"]');
    if (heideggerGrid) {
      const heidImgs = ['image_47.jpeg', 'image_48.jpeg', 'image_49.jpeg', 'image_50.jpeg', 'image_51.jpeg', 'image_52.jpeg'];
      let html = '';
      heidImgs.forEach(function (f, i) {
        html += makeItem('assets/images/artworks/' + f, 'Untitled (' + (i + 1) + ')', '2023 &nbsp;·&nbsp; After Heidegger');
      });
      heideggerGrid.innerHTML = html;
    }

    // Stage 4: Authenticity Series 2024
    const authGrid = document.querySelector('[data-stage="authenticity"]');
    if (authGrid) {
      const authImgs = ['image_20.jpeg', 'image_21.jpeg', 'image_22.jpeg', 'image_23.jpeg', 'image_24.jpeg', 'image_25.jpeg', 'image_26.jpeg', 'image_27.jpeg', 'image_28.jpeg', 'image_29.jpeg', 'image_30.jpeg', 'image_53.jpeg', 'image_54.jpeg'];
      let html = '';
      authImgs.forEach(function (f, i) {
        html += makeItem('assets/images/artworks/' + f, 'Authenticity (' + (i + 1) + ')', '2024 &nbsp;·&nbsp; Portrait Series');
      });
      authGrid.innerHTML = html;
    }

    // Stage 5: Chinese-Western Landscape 2024-2025
    const landGrid = document.querySelector('[data-stage="landscape"]');
    if (landGrid) {
      const landImgs = ['image_09.jpeg', 'image_10.jpeg', 'image_11.jpeg', 'image_13.jpeg', 'image_15.jpeg', 'image_55.jpeg', 'image_56.jpeg', 'image_57.jpeg', 'image_58.jpeg', 'image_59.jpeg', 'image_60.jpeg', 'image_61.jpeg'];
      let html = '';
      landImgs.forEach(function (f, i) {
        html += makeItem('assets/images/artworks/' + f, 'Mountain (' + (i + 1) + ')', '2024–2025 &nbsp;·&nbsp; Semi-transparent Series');
      });
      landGrid.innerHTML = html;
    }

    // Stage 6: Graduation 2025-2026
    const gradGrid = document.querySelector('[data-stage="graduation"]');
    if (gradGrid) {
      const gradImgs = ['image_62.jpeg', 'image_63.jpeg', 'image_64.jpeg', 'image_65.jpeg', 'image_06.jpeg', 'image_07.jpeg', 'image_08.jpeg', 'image_16.jpeg', 'image_17.jpeg'];
      let html = '';
      gradImgs.forEach(function (f, i) {
        html += makeItem('assets/images/artworks/' + f, 'Graduation Work (' + (i + 1) + ')', '2025–2026 &nbsp;·&nbsp; MFA');
      });
      gradGrid.innerHTML = html;
    }
  }

  // ── Design Gallery (Projects page) ────────────
  function populateDesignGallery() {
    const grid = document.getElementById('design-gallery');
    if (!grid) return;

    const imgs = ['image_32.jpeg', 'image_33.jpeg', 'image_34.jpeg', 'image_35.jpeg', 'image_36.jpeg', 'image_37.jpeg', 'image_38.jpeg', 'image_18.jpeg', 'image_19.jpeg'];
    let html = '';
    imgs.forEach(function (f, i) {
      html += makeItem('assets/images/artworks/' + f, 'Design Work (' + (i + 1) + ')', 'Graphic &amp; Commercial');
    });
    grid.innerHTML = html;
  }

  // ── Init ──────────────────────────────────────
  function init() {
    populatePaintings();
    populateDesignGallery();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
