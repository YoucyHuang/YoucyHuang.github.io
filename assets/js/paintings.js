/**
 * Paintings Page — Cézanne catalog style
 * Time periods, expandable, annotations, drag-reorder
 */
var Paintings = (function () {
  'use strict';

  // ── Catalog Data ──────────────────────────────
  var periods = [
    {
      id: 'early',
      label: 'Early Practice',
      years: 'Age 9–17',
      text: 'I have loved painting and fiction since childhood. These early works — from age nine through seventeen — are not sophisticated, but they carry something academic training later tried to refine but never replace: the instinct to make marks that mean something.',
      images: ['image_03.jpeg','image_04.jpeg','image_01.jpeg','image_31.jpeg','image_14.jpeg','image_12.jpeg'],
      annotations: {}
    },
    {
      id: 'academic',
      label: 'Academic Realism & Cézanne',
      years: '2021–2022',
      text: 'At the China Academy of Art, I began formal academic training. My early intention was to reproduce the visible world — building three-dimensional space on a two-dimensional plane, following Greek art through Da Vinci and Michelangelo. I was reading Plato, then Kant: the world can be mirrored, but we can only know phenomena, never the thing-in-itself. At the same time, I became obsessed with Cézanne — the first artist who showed me that painting is not about reproducing vision, but constructing it.',
      images: ['image_39.jpeg','image_40.jpeg','image_41.jpeg','image_42.jpeg','image_43.jpeg','image_44.jpeg','image_45.jpeg','image_46.jpeg'],
      annotations: {}
    },
    {
      id: 'heidegger',
      label: 'The Heidegger Turn',
      years: '2023',
      text: 'I took a German A1 course online at 19 — not for career planning, but because I was reading Heidegger and Dasein cannot be translated into Chinese without loss. "The Origin of Art" changed how I understood painting: not representation, not expression, but a happening of truth — an event in which a world opens. I began to understand my practice not as making pictures, but as creating conditions for presence.',
      images: ['image_47.jpeg','image_48.jpeg','image_49.jpeg','image_50.jpeg','image_51.jpeg','image_52.jpeg'],
      annotations: {}
    },
    {
      id: 'authenticity',
      label: 'Authenticity Series',
      years: '2024',
      text: 'Heidegger\'s distinction between Dasein and das Man — authentic and inauthentic existence — led me to a series of portraits. I wanted to capture people not as they perform themselves for others, but in moments when the performance drops. These paintings are not about likeness. They are about the quiet interval between one mask and the next.',
      images: ['image_20.jpeg','image_21.jpeg','image_22.jpeg','image_23.jpeg','image_24.jpeg','image_25.jpeg','image_26.jpeg','image_27.jpeg','image_28.jpeg','image_29.jpeg','image_30.jpeg','image_53.jpeg','image_54.jpeg'],
      annotations: {}
    },
    {
      id: 'landscape',
      label: 'Chinese Landscape, Western Language',
      years: '2024–2025',
      text: 'After postcolonial theory, I realized I knew more Western culture than Chinese — and had been looking at my own tradition through a Western lens. I began rereading Chinese art history seriously, and asked: how do you build a bridge that lets viewers enter the world ancient painters created? Traditional Chinese painting uses "moving focus," not optical perspective — it is not a window, but a walk. My semi-transparent mountain series is an attempt to make that walk visible, filtering landscape composition through Twombly, Ryman, and Cézanne.',
      images: ['image_09.jpeg','image_10.jpeg','image_11.jpeg','image_13.jpeg','image_15.jpeg','image_55.jpeg','image_56.jpeg','image_57.jpeg','image_58.jpeg','image_59.jpeg','image_60.jpeg','image_61.jpeg'],
      annotations: {}
    },
    {
      id: 'graduation',
      label: 'Graduation & the Turn to DH',
      years: '2025–2026',
      text: 'My MFA thesis examined Robert Ryman — body, trace, and presence in painting. My graduation creation continued the semi-transparent mountain series. In May 2026, I participated in a rural revitalization project, deployed an AI agent, and built small interactive websites for the first time. That experience opened the door to Digital Humanities — not as a departure from art, but as a new field for old questions.',
      images: ['image_62.jpeg','image_63.jpeg','image_64.jpeg','image_65.jpeg','image_06.jpeg','image_07.jpeg','image_08.jpeg','image_16.jpeg','image_17.jpeg'],
      annotations: {}
    }
  ];

  // Load saved annotations
  function loadAnnotations() {
    try {
      var saved = localStorage.getItem('youcy_paint_annotations');
      if (saved) {
        var data = JSON.parse(saved);
        periods.forEach(function (p) {
          if (data[p.id]) p.annotations = data[p.id];
        });
      }
    } catch (e) {}
  }

  function saveAnnotations() {
    var data = {};
    periods.forEach(function (p) { data[p.id] = p.annotations || {}; });
    try { localStorage.setItem('youcy_paint_annotations', JSON.stringify(data)); } catch (e) {}
  }

  // ── Render ────────────────────────────────────
  function render() {
    var container = document.getElementById('catalog-periods');
    if (!container) return;

    var html = '';
    periods.forEach(function (period, pi) {
      html +=
        '<div class="period" data-period="' + period.id + '">' +
          '<div class="period-header" onclick="Paintings.togglePeriod(\'' + period.id + '\')">' +
            '<div>' +
              '<span class="period-title">' + escapeHTML(period.label) + '</span>' +
              '<span class="period-years"> &nbsp;·&nbsp; ' + escapeHTML(period.years) + '</span>' +
            '</div>' +
            '<span class="period-toggle">+</span>' +
          '</div>' +
          '<div class="period-body">' +
            '<p class="period-text" contenteditable="true" data-period="' + period.id + '" data-field="text">' + escapeHTML(period.text) + '</p>' +
            '<div class="painting-grid" data-period="' + period.id + '" id="grid-' + period.id + '">';

      period.images.forEach(function (img, ii) {
        var key = img.replace('.jpeg','');
        var ann = period.annotations && period.annotations[key] ? period.annotations[key] : '';
        html +=
          '<div class="painting-card" data-img="' + img + '" data-period="' + period.id + '" onclick="Paintings.openAnnotation(\'' + period.id + '\',\'' + img + '\')">' +
            '<span class="drag-handle">⠿</span>' +
            '<img src="assets/images/artworks/' + img + '" alt="' + period.label + ' — ' + (ii+1) + '" loading="lazy">' +
            '<div class="paint-info">' +
              '<span class="paint-title">' + period.label + ' (' + (ii+1) + ')</span>' +
              '<span class="paint-meta">' + escapeHTML(period.years) + '</span>' +
            '</div>' +
          '</div>';
      });

      html +=
            '</div>' +
          '</div>' +
        '</div>';
    });

    container.innerHTML = html;

    // Open first period by default
    var first = container.querySelector('.period');
    if (first) first.classList.add('open');

    // Init sortable for each grid
    initSortables();

    // Bind period text editing
    bindPeriodEditing();
  }

  // ── Toggle Period ─────────────────────────────
  function togglePeriod(id) {
    var period = document.querySelector('[data-period="' + id + '"]');
    if (period) period.classList.toggle('open');
  }

  // ── Annotation Panel ──────────────────────────
  var currentAnnotation = null;

  function openAnnotation(periodId, imgFile) {
    var period = null;
    for (var i = 0; i < periods.length; i++) {
      if (periods[i].id === periodId) { period = periods[i]; break; }
    }
    if (!period) return;

    currentAnnotation = { periodId: periodId, imgFile: imgFile };
    var key = imgFile.replace('.jpeg','');
    var text = period.annotations && period.annotations[key] ? period.annotations[key] : '';

    document.getElementById('ap-title').textContent = period.label + ' — ' + imgFile.replace('.jpeg','');
    document.getElementById('ap-meta').textContent = period.years;
    document.getElementById('ap-text').textContent = text || 'Click to add annotation for this work.';
    document.getElementById('annotation-panel').classList.add('active');
  }

  function closeAnnotation() {
    document.getElementById('annotation-panel').classList.remove('active');
    currentAnnotation = null;
  }

  function saveAnnotation() {
    if (!currentAnnotation) return;
    var period = null;
    for (var i = 0; i < periods.length; i++) {
      if (periods[i].id === currentAnnotation.periodId) { period = periods[i]; break; }
    }
    if (!period) return;
    if (!period.annotations) period.annotations = {};

    var key = currentAnnotation.imgFile.replace('.jpeg','');
    period.annotations[key] = document.getElementById('ap-text').textContent.trim();
    saveAnnotations();
    closeAnnotation();
  }

  // ── Period Text Editing ───────────────────────
  function bindPeriodEditing() {
    var texts = document.querySelectorAll('.period-text[contenteditable]');
    texts.forEach(function (el) {
      el.addEventListener('blur', function () {
        var pid = el.getAttribute('data-period');
        var field = el.getAttribute('data-field');
        var period = null;
        for (var i = 0; i < periods.length; i++) {
          if (periods[i].id === pid) { period = periods[i]; break; }
        }
        if (period && field) {
          period[field] = el.textContent.trim();
        }
      });
    });
  }

  // ── Sortable Grids ────────────────────────────
  function initSortables() {
    periods.forEach(function (period) {
      var grid = document.getElementById('grid-' + period.id);
      if (!grid) return;
      if (grid._sortable) grid._sortable.destroy();
      grid._sortable = new Sortable(grid, {
        animation: 200,
        handle: '.drag-handle',
        onEnd: function () {
          var cards = grid.querySelectorAll('.painting-card');
          var newOrder = [];
          cards.forEach(function (card) {
            newOrder.push(card.getAttribute('data-img'));
          });
          period.images = newOrder;
        }
      });
    });
  }

  // ── Lightbox ──────────────────────────────────
  function initLightbox() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    var img = lb.querySelector('img');

    document.addEventListener('click', function (e) {
      var card = e.target.closest('.painting-card');
      if (!card) return;
      // Only open lightbox if NOT clicking the drag handle
      if (e.target.closest('.drag-handle')) return;
      // And NOT if clicking annotation or period header
      var src = card.querySelector('img').src;
      img.src = src;
      lb.classList.add('active');
    });

    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox-close')) {
        lb.classList.remove('active');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { lb.classList.remove('active'); closeAnnotation(); }
    });
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Init ──────────────────────────────────────
  function init() {
    loadAnnotations();
    render();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    togglePeriod: togglePeriod,
    openAnnotation: openAnnotation,
    closeAnnotation: closeAnnotation,
    saveAnnotation: saveAnnotation
  };
})();
