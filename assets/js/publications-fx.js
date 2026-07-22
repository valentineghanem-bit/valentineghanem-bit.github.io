(function () {
  if (!document.querySelector('.publications-v2') || !window.v2Motion) return;
  v2Motion.revealEach('.publications-v2 .feed-item');
  v2Motion.attachSpotlight('.publications-v2 .feed-item');
  v2Motion.attachMagnetic('.publications-v2 .link-row a, .publications-v2 .copy-btn');
})();
