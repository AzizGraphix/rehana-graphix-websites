// Rehana Graphix — shared page behaviour: scroll reveals + active nav state.
(function () {
  function ready(fn) {
    document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll-triggered reveals
    var seen = new WeakSet();
    var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 }) : null;

    function show(el) { el.classList.add('is-visible'); }

    function scanReveals() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        if (seen.has(el)) return;
        seen.add(el);
        var rect = el.getBoundingClientRect();
        var alreadyVisible = rect.bottom < 0 || rect.top < vh * 0.95;
        if (reduce || !io || alreadyVisible) show(el); else io.observe(el);
      });
    }
    scanReveals();

    // Active nav link + mobile chip based on current page
    var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      if (link.getAttribute('data-nav') === page) link.classList.add('active');
    });

    // Gentle fade-in on load
    document.body.style.opacity = 0;
    requestAnimationFrame(function () {
      document.body.style.transition = 'opacity .25s ease';
      document.body.style.opacity = 1;
    });
  });
})();
