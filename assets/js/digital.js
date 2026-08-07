/**
 * Digital Page — Vibe-coded web projects
 */
(function () {
  'use strict';

  var projects = [
    {
      title: 'Rural Revitalization Interactive Map',
      desc: 'An interactive web map built during a rural revitalization project in May 2026. Clickable landmarks with local stories and cultural notes — my first experience deploying Claude Code to build a functional website.',
      tech: 'HTML · CSS · JavaScript · Claude Code Agent',
      link: '',
      year: '2026'
    },
    {
      title: 'Landscape Scroll Viewer',
      desc: 'A horizontal scroll experiment translating the Chinese handscroll viewing experience to the web. Images pan horizontally with scroll wheel; annotations appear as marginal notes.',
      tech: 'HTML · CSS · JavaScript',
      link: '',
      year: '2026'
    },
    {
      title: 'Annotation Tool for Painting Analysis',
      desc: 'A simple web tool for marking up painting images: click to place dots connected to margin notes, inspired by Chinese painting colophons and art historical annotation practices.',
      tech: 'HTML · CSS · JavaScript',
      link: '',
      year: '2026'
    },
    {
      title: 'AI Prompt Gallery',
      desc: 'A grid-based gallery documenting prompts and generated outputs from AI image tools (Midjourney, ComfyUI). Each card shows the prompt, the result, and brief commentary.',
      tech: 'HTML · CSS · JavaScript',
      link: '',
      year: '2025'
    }
  ];

  function render() {
    var grid = document.getElementById('digital-grid');
    if (!grid) return;

    var html = '';
    projects.forEach(function (p) {
      html +=
        '<div class="digital-card">' +
          '<h3>' + escapeHTML(p.title) + '</h3>' +
          '<p class="desc">' + escapeHTML(p.desc) + '</p>' +
          '<span class="tech">' + escapeHTML(p.tech) + '</span>' +
          '<span class="tech" style="display:block;">' + escapeHTML(p.year) + '</span>' +
          (p.link ? '<a class="link" href="' + p.link + '" target="_blank">Visit →</a>' : '<span class="link" style="color:var(--faint);">Link coming soon</span>') +
        '</div>';
    });
    grid.innerHTML = html;
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
