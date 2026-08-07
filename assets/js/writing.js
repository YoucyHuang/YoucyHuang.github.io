/**
 * Writing Page — Document list, drag-drop, editing, AI search
 */
var Writing = (function () {
  'use strict';

  // ── Document Data ────────────────────────────
  var defaultDocs = [
    { year: '2022', title: 'Collected Journals (2022–2023)', desc: 'Early personal essays: nihilism, art and value, the self under lockdown, first encounters with Kant and Plato.', category: 'Journal' },
    { year: '2022', title: 'Art Cannot Create Value — Only People Can', desc: 'A fragment questioning the social function of art and the artist\'s role beyond being a consumer.', category: 'Essay' },
    { year: '2023', title: 'From "Knees That Cannot Bend" to "Lishui Barbizon"', desc: 'On the persistent cultural anxiety that drives Chinese cultural discourse to borrow Western names for legitimacy.', category: 'Art Criticism' },
    { year: '2023', title: 'Cézanne and the Construction of Vision', desc: 'Study notes on how Cézanne shifted painting from reproducing vision to constructing it.', category: 'Study' },
    { year: '2023', title: 'Seeing Mountains as Mountains Again: Zao Wou-Ki\'s Three Metamorphoses', desc: 'Tracing Zao Wou-Ki\'s journey through three stages of East-West synthesis — from symbolic insertion to spontaneous expression.', category: 'Art Criticism' },
    { year: '2023', title: 'Learning German for Heidegger', desc: 'Reflections on taking A1 German at age 19 because Dasein cannot be translated without loss.', category: 'Journal' },
    { year: '2024', title: 'The Scholar-Official\'s Utopia', desc: 'Comparative analysis of subjectivity and symbolic violence in Chinese literati and European aristocratic portraiture.', category: 'Essay' },
    { year: '2024', title: 'The Origin of Civilization: Myth, History, and Chinese Time', desc: 'On Nüwa, Pangu, and Lu Xun\'s anti-myth — how Chinese cosmology differs from Western creation narrative.', category: 'Essay' },
    { year: '2024', title: 'The Body Knows: Somatic Knowledge in Chinese Aesthetics', desc: 'How the body, not the text, carries and transmits aesthetic understanding in Chinese tradition.', category: 'Essay' },
    { year: '2024', title: 'Witness and Transformation: Sebastião Salgado\'s Documentary Photography', desc: 'Academic paper on the ethics of aestheticizing suffering — can beauty serve truth in documentary practice?', category: 'Academic Paper' },
    { year: '2024', title: 'The Last Letter to Mother (给母亲的最后一封信)', desc: 'Novella — a daughter\'s unsent letter, the impossibility of dialogue within the "I did it all for you" structure of maternal love. 16,095 words.', category: 'Fiction' },
    { year: '2024', title: 'Collected Journals (2024)', desc: 'Personal essays: doubts about the art world, the desire to benefit society, first thoughts on leaving pure art practice.', category: 'Journal' },
    { year: '2025', title: 'From Robert Ryman: Body, Trace, and Presence in Painting', desc: 'MFA thesis. Ryman\'s white paintings as an inquiry into materiality, the body\'s irreducible presence, and the event of viewing.', category: 'Academic Paper' },
    { year: '2025', title: 'Water-based Materials, Temporal Structure, and Ganxing', desc: 'Core theoretical essay. How the irreversible material logic of ink painting trains a subject who bears consequences in flowing time.', category: 'Theory' },
    { year: '2025', title: 'The Aphasia of Contemporary Art', desc: 'Guaren Project core essay. Diagnosing art\'s loss of a position of responsibility under neoliberal governance.', category: 'Guaren Project' },
    { year: '2025', title: 'From Field to Self-Cultivation: New Confucian Ethics\' Spatial Generative Path', desc: 'Proposing an inverted path — morality guiding self-cultivation through designed spatial environments.', category: 'Guaren Project' },
    { year: '2025', title: 'The Emperor of Quotations: Cynicism\'s Golden Shield', desc: 'Discourse analysis of how famous quotes function as authority surrogates in Chinese and Western public spheres.', category: 'Guaren Project' },
    { year: '2025', title: 'Channel-Type Art Practice: Body, Action, Suspended Meaning', desc: 'Proposing art practice as a channel where meaning can be triggered, corrected, and withdrawn — without becoming a system.', category: 'Guaren Project' },
    { year: '2025', title: 'Governance and the Permitted Forms of Subjectivity', desc: 'Fragment. How neoliberal governance does not suppress subjectivity but formats it into acceptable shapes.', category: 'Guaren Project' },
    { year: '2025', title: 'Involution and Lying Flat: Youth Subjectivity in Contemporary China', desc: 'Structural analysis: how compressed modernization severed traditional meaning structures without building new ones.', category: 'Sociology' },
    { year: '2025', title: 'Qingming, Received (清茗，收)', desc: 'AI-assisted short film script with meta-narrative structure — the outer layer is the making of the inner layer. On AI\'s boundaries and the human voice.', category: 'Fiction' },
    { year: '2025', title: 'Blue Stops (蓝止)', desc: 'Guizhou batik short film script. A batik designer returns to her Miao village after years away — tradition, innovation, and a letter that uses her teacher\'s name, not title.', category: 'Fiction' },
    { year: '2025', title: 'Collected Journals (2025)', desc: 'Personal essays: Anonymous Art Company plan, truck seal project, reflections on ideal versus real, the feeling of being an observer.', category: 'Journal' },
    { year: '2026', title: 'Family Banquet (家宴)', desc: 'Novel. A family dining table as courtroom — mother-daughter love, generational silence, and the blood in the refrigerator that seeped in over decades.', category: 'Fiction' },
    { year: '2026', title: 'Collected Journals (2026)', desc: 'Personal essays: Egypt travels, the new axis civilization, poetry as poetry vs. poetry for influence, the discovery of Digital Humanities.', category: 'Journal' },
    { year: '2026', title: 'Art Brings Village: Echigo-Tsumari and Rural Art', desc: 'Travel reflection on the Echigo-Tsumari Art Triennale and what rural art practice can and cannot do.', category: 'Essay' },
    { year: '2026', title: 'Application Motivation: Why DH After 15 Years of Painting', desc: 'Cover letter tracing the intellectual and artistic journey from realism through philosophy to digital humanities.', category: 'Statement' }
  ];

  // ── Load/Save ─────────────────────────────────
  function loadDocs() {
    try {
      var saved = localStorage.getItem('youcy_writing_docs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultDocs.slice();
  }

  function saveDocs(docs) {
    try {
      localStorage.setItem('youcy_writing_docs', JSON.stringify(docs));
    } catch (e) {}
  }

  var docs = loadDocs();

  // ── Render ────────────────────────────────────
  function render() {
    var list = document.getElementById('doc-list');
    if (!list) return;

    // Sort by year (ascending)
    docs.sort(function (a, b) { return (a.year || '') - (b.year || ''); });

    var html = '';
    docs.forEach(function (doc, idx) {
      html +=
        '<li class="doc-item" data-index="' + idx + '">' +
          '<span class="doc-title" contenteditable="true" data-field="title" data-idx="' + idx + '">' + escapeHTML(doc.title) + '</span>' +
          '<span class="doc-meta">' + escapeHTML(doc.year) + ' · ' + escapeHTML(doc.category) +
            ' <button class="doc-edit-btn" onclick="Writing.deleteDocument(' + idx + ')">×</button>' +
          '</span>' +
          '<span class="doc-desc" contenteditable="true" data-field="desc" data-idx="' + idx + '">' + escapeHTML(doc.desc) + '</span>' +
        '</li>';
    });
    list.innerHTML = html;

    bindEditing();
    initSortable();
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Editing ───────────────────────────────────
  function bindEditing() {
    var editables = document.querySelectorAll('[contenteditable]');
    editables.forEach(function (el) {
      el.addEventListener('blur', function () {
        var idx = parseInt(el.getAttribute('data-idx'));
        var field = el.getAttribute('data-field');
        if (idx >= 0 && idx < docs.length && field) {
          docs[idx][field] = el.textContent.trim();
          saveDocs(docs);
        }
      });
    });
  }

  // ── Sortable ──────────────────────────────────
  function initSortable() {
    var list = document.getElementById('doc-list');
    if (!list) return;

    if (window._writingSortable) window._writingSortable.destroy();

    window._writingSortable = new Sortable(list, {
      animation: 200,
      handle: '.doc-item',
      ghostClass: 'drag-over',
      onEnd: function () {
        var items = list.querySelectorAll('.doc-item');
        var newDocs = [];
        items.forEach(function (item) {
          var idx = parseInt(item.getAttribute('data-index'));
          if (idx >= 0 && idx < docs.length) newDocs.push(docs[idx]);
        });
        docs = newDocs;
        saveDocs(docs);
        render();
      }
    });
  }

  // ── Add / Delete ──────────────────────────────
  function addDocument() {
    docs.push({ year: '2026', title: 'New Document', desc: 'Description of this document.', category: 'Untitled' });
    saveDocs(docs);
    render();
  }

  function deleteDocument(idx) {
    if (idx >= 0 && idx < docs.length) {
      docs.splice(idx, 1);
      saveDocs(docs);
      render();
    }
  }

  // ── AI Search ─────────────────────────────────
  function search(query) {
    var container = document.getElementById('search-results');
    if (!container) return;

    if (!query || query.trim().length < 2) {
      container.innerHTML = '<p class="search-empty">Results will appear here.</p>';
      return;
    }

    q = query.toLowerCase().trim();

    // Extract time range: e.g. "2022到2024", "2021-2023", "between 2020 and 2025"
    var yearPattern = /(\d{4})/g;
    var years = q.match(yearPattern);
    var yearStart = null, yearEnd = null;
    if (years && years.length >= 2) {
      yearStart = parseInt(years[0]);
      yearEnd = parseInt(years[1]);
    } else if (years && years.length === 1) {
      yearStart = parseInt(years[0]);
      yearEnd = yearStart;
    }

    // Search
    var results = [];
    docs.forEach(function (doc) {
      var docYear = parseInt(doc.year) || 0;
      var score = 0;

      // Time match
      if (yearStart !== null && yearEnd !== null) {
        if (docYear >= yearStart && docYear <= yearEnd) score += 50;
        else if (docYear >= yearStart - 1 && docYear <= yearEnd + 1) score += 25;
        else score -= 20;
      }

      // Keyword match
      var searchText = (doc.title + ' ' + doc.desc + ' ' + doc.category + ' ' + doc.year).toLowerCase();
      var keywords = q.replace(/\d{4}/g, '').split(/\s+/).filter(function (w) { return w.length > 1; });

      keywords.forEach(function (kw) {
        if (searchText.indexOf(kw) !== -1) score += 30;
      });

      // Category/topic recognition
      var topicMap = {
        'heidegger': 'heidegger', '海德格尔': 'heidegger',
        'authenticity': 'authenticity', '本真': 'authenticity',
        'landscape': 'landscape', '山水': 'landscape',
        'body': 'embodiment', '身体': 'embodiment', 'embodiment': 'embodiment',
        'cezanne': 'cezanne', '塞尚': 'cezanne',
        'philosophy': 'philosophy', '哲学': 'philosophy',
        'ganxing': 'ganxing', '感兴': 'ganxing',
        'mother': 'family', '母亲': 'family', 'family': 'family',
        'artificial intelligence': 'ai', 'ai': 'ai', 'digital': 'digital',
        'confucian': 'confucianism', '儒家': 'confucianism',
        'governance': 'governance', '治理': 'governance',
        'painting': 'painting', '绘画': 'painting',
        'fiction': 'fiction', '小说': 'fiction',
        'poetry': 'poetry', '诗歌': 'poetry',
      };

      Object.keys(topicMap).forEach(function (key) {
        if (q.indexOf(key) !== -1 && searchText.toLowerCase().indexOf(topicMap[key]) !== -1) {
          score += 40;
        }
      });

      if (score >= 30) {
        results.push({ doc: doc, score: score });
      }
    });

    results.sort(function (a, b) { return b.score - a.score; });
    results = results.slice(0, 12);

    if (results.length === 0) {
      container.innerHTML = '<p class="search-empty">No matching documents. Try different keywords or a broader time range.</p>';
      return;
    }

    var html = '';
    results.forEach(function (r) {
      html +=
        '<div class="search-result" onclick="document.querySelector(\'[data-idx=' + docs.indexOf(r.doc) + ']\').scrollIntoView({behavior:\'smooth\'})">' +
          '<span class="result-title">' + escapeHTML(r.doc.title) + '</span>' +
          '<span class="result-excerpt">' + escapeHTML(r.doc.year) + ' · ' + escapeHTML(r.doc.category) + ' — ' + escapeHTML(r.doc.desc.substring(0, 100)) + '</span>' +
        '</div>';
    });
    container.innerHTML = html;
  }

  // ── Init ──────────────────────────────────────
  function init() {
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    addDocument: addDocument,
    deleteDocument: deleteDocument,
    search: search
  };
})();
