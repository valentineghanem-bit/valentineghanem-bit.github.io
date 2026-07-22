(function () {
  if (!document.querySelector('.portfolio-v2') || !window.v2Motion) return;
  v2Motion.revealEach('.portfolio-v2 .card');
  v2Motion.attachSpotlight('.portfolio-v2 .card');
  v2Motion.attachMagnetic('.portfolio-v2 .filter-chip');
})();
