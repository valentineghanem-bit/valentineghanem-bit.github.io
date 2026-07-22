(function () {
  if (!document.querySelector('.community-v2') || !window.v2Motion) return;
  v2Motion.revealEach('.community-v2 .event-card');
  v2Motion.attachSpotlight('.community-v2 .event-card, .community-v2 .pull-quote');

  // Sidebar nav scrollspy -- the jump-links otherwise sit static the whole
  // page through; highlight whichever of the three sections is in view.
  var navLinks = document.querySelectorAll('.community-nav a[href^="#"]');
  var sections = Array.prototype.map.call(navLinks, function (a) {
    return document.getElementById(a.getAttribute('href').slice(1));
  }).filter(Boolean);
  if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(function (el) { io.observe(el); });
  }
})();
