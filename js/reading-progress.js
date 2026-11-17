// Reading progress bar for chapter pages.
// Activates only on pages that contain an element with id="reading-time" and a
// data-minutes attribute (the author's reading-time estimate). Draws a thin bar
// along the bottom of the site header that fills as the reader scrolls through
// the article, plus a small "N min left" counter.
(function () {
  function init() {
    var marker = document.getElementById('reading-time');
    var article = document.querySelector('article.md-content__inner');
    var header = document.querySelector('.md-header');
    if (!marker || !article || !header || document.querySelector('.reading-progress')) return;

    var totalMinutes = parseFloat(marker.getAttribute('data-minutes')) || 0;

    var bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'Chapter reading progress');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    var fill = document.createElement('div');
    fill.className = 'reading-progress__fill';
    bar.appendChild(fill);
    header.appendChild(bar);

    var label = document.createElement('div');
    label.className = 'reading-progress__label';
    label.setAttribute('aria-live', 'polite');
    document.body.appendChild(label);

    var lastText = '';
    function update() {
      var headerH = header.getBoundingClientRect().height;
      var rect = article.getBoundingClientRect();
      // How far the bottom of the visible area has travelled through the article
      var scrollable = rect.height - (window.innerHeight - headerH);
      var progress = scrollable <= 0 ? 1 : (headerH - rect.top) / scrollable;
      progress = Math.min(1, Math.max(0, progress));
      var pct = Math.round(progress * 100);

      fill.style.width = pct + '%';
      bar.setAttribute('aria-valuenow', String(pct));

      var text;
      if (pct >= 99) {
        text = '🎉 You finished the chapter!';
      } else if (totalMinutes > 0) {
        var left = Math.ceil(totalMinutes * (1 - progress));
        text = pct + '% read · ' + (left <= 1 ? 'about a minute left' : left + ' min left');
      } else {
        text = pct + '% read';
      }
      if (text !== lastText) {
        label.textContent = text;
        label.classList.toggle('reading-progress__label--done', pct >= 99);
        lastText = text;
      }
      // Keep the counter out of the way until the reader has started
      label.classList.toggle('reading-progress__label--visible', pct > 0);
    }

    var ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () { update(); ticking = false; });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // Images and iframes change the article height as they load
    window.addEventListener('load', update);
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
