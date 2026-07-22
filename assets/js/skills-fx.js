(function () {
  if (!document.querySelector('.skills-v2') || !window.v2Motion) return;
  v2Motion.revealEach('.skills-v2 .card');
  v2Motion.scanOnReveal('.skills-v2 .card');
})();
