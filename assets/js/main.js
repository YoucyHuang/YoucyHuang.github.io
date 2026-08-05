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

  // ── Gallery Helpers ───────────────────────────
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

  // ── Paintings ─────────────────────────────────
  function populatePaintings() {
    const page = document.getElementById('paintings-gallery');
    if (!page) return;

    const transparentGrid = page.querySelector('[data-series="transparent"]');
    const authenticityGrid = page.querySelector('[data-series="authenticity"]');

    let transparentHTML = '';
    let authenticityHTML = '';

    for (let i = 1; i <= 33; i++) {
      const num = String(i).padStart(2, '0');
      const file = 'assets/images/paintings/paint_' + num + '.png';

      if (i <= 10) {
        // Series A1: Semi-transparent Mountains (山水系列)
        transparentHTML += makeItem(file, '山水 · ' + i, 'Semi-transparent Mountain');
      } else if (i <= 24) {
        // Series A2: Authenticity Portraits (本真系列)
        authenticityHTML += makeItem(file, '本真 · ' + (i - 10), 'Authenticity Portrait');
      }
      // paint_25-33: mixed landscape/poetry — add to authenticity for now
      if (i >= 25 && i <= 33) {
        authenticityHTML += makeItem(file, '诗影 · ' + (i - 24), 'Poetry & Landscape');
      }
    }

    if (transparentGrid) transparentGrid.innerHTML = transparentHTML;
    if (authenticityGrid) authenticityGrid.innerHTML = authenticityHTML;
  }

  // ── Photography ───────────────────────────────
  function populatePhotography() {
    const grid = document.getElementById('photography-gallery');
    if (!grid) return;

    let html = '';
    for (let i = 0; i < 34; i++) {
      const num = String(i).padStart(2, '0');
      const file = 'assets/images/photography/photo_' + num + '.png';
      html += makeItem(file, 'Untitled (' + (i + 1) + ')', 'Poetry & Shadow');
    }
    grid.innerHTML = html;
  }

  // ── Design Gallery ────────────────────────────
  function populateDesignGallery() {
    const grid = document.getElementById('design-gallery');
    if (!grid) return;

    let html = '';
    for (let i = 20; i <= 33; i++) {
      const num = String(i).padStart(2, '0');
      const file = 'assets/images/photography/photo_' + num + '.png';
      html += makeItem(file, 'Design Work (' + (i - 19) + ')', 'Graphic & Commercial');
    }
    grid.innerHTML = html;
  }

  // ── Init ──────────────────────────────────────
  function init() {
    populatePaintings();
    populatePhotography();
    populateDesignGallery();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
