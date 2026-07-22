(function () {
  if (!document.querySelector('.press-v2') || !window.v2Motion) return;
  v2Motion.revealEach('.press-v2 .feed-item');
  v2Motion.attachSpotlight('.press-v2 .feed-item');
  v2Motion.attachMagnetic('.press-v2 .link-row a');
})();
