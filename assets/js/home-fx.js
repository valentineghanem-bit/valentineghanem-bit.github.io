(function () {
  if (!document.querySelector('.home-v2') || !window.v2Motion) return;
  v2Motion.revealEach('.home-v2 .toc-card');
  v2Motion.attachSpotlight('.home-v2 .toc-card, .home-v2 .tag');

  // 01: paragraph-by-paragraph wipe, staggered -- see home-v2.css.
  v2Motion.revealStagger('.home-v2__prose', 'p:not(.section__subtitle)', 140);
  // 02: credential tags deal in like a dealt hand, staggered.
  v2Motion.revealStagger('.home-v2 .section--credentials', '.tag', 55);
})();
