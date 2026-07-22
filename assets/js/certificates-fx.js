(function () {
  if (!document.querySelector('.certificates-v2') || !window.v2Motion) return;
  v2Motion.revealEach('.certificates-v2 .tag');
  v2Motion.attachSpotlight('.certificates-v2 .tag');
  v2Motion.attachMagnetic('.certificates-v2 .feed-item .link-row a');
})();
