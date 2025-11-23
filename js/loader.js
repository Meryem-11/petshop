// Try to use a new GIF (`../images/gif.gif`) if it exists. Otherwise keep the MP4 video.
(function () {
  // Timing controls
  var loaderStart = Date.now();
  var showStart = null; // time when visible content (gif or video) was shown
  var MIN_DISPLAY_MS = 1500; // minimum time to show loader after content is visible
  var REMOVE_AFTER_FADE_MS = 500; // allow CSS fade-out to complete

  var loader = document.getElementById('page-loader');
  var gifEl = document.getElementById('loader-gif');
  var videoEl = document.getElementById('loader-video');
  var placeholder = document.getElementById('loader-placeholder');

  function showContent(type) {
    try {
      if (type === 'gif' && gifEl) {
        gifEl.style.display = 'block';
        if (videoEl) { try { videoEl.pause(); } catch (e) {} videoEl.style.display = 'none'; }
        if (placeholder) placeholder.style.display = 'none';
      } else if (type === 'video' && videoEl) {
        videoEl.style.display = 'block';
        if (gifEl) gifEl.style.display = 'none';
        if (placeholder) placeholder.style.display = 'none';
        try { videoEl.play(); } catch (e) {}
      }
      showStart = Date.now();
    } catch (e) {
      console.error('showContent error:', e);
    }
  }

  // Probe GIF first (fast): if GIF exists, show it immediately
  (function probeGif() {
    try {
      if (!gifEl) return;
      var gifUrl = gifEl.src || '../images/gif.gif';
      var probe = new Image();
      probe.onload = function () { showContent('gif'); };
      probe.onerror = function () {
        // GIF not available -> keep placeholder visible and wait for video
        if (placeholder) placeholder.style.display = 'block';
      };
      probe.src = gifUrl;
    } catch (e) {
      console.error('GIF probe error:', e);
      if (placeholder) placeholder.style.display = 'block';
    }
  })();

  // If video becomes ready, show it (if gif wasn't shown)
  if (videoEl) {
    // if video can play through or starts playing, treat as ready
    var onVideoReady = function () {
      // only show video if GIF is not visible
      if (!gifEl || gifEl.style.display === 'none') showContent('video');
      videoEl.removeEventListener('canplaythrough', onVideoReady);
      videoEl.removeEventListener('playing', onVideoReady);
    };
    videoEl.addEventListener('canplaythrough', onVideoReady);
    videoEl.addEventListener('playing', onVideoReady);
    // ensure placeholder shows if neither gif nor video yet
    if ((!gifEl || gifEl.style.display === 'none') && placeholder) placeholder.style.display = 'block';
  }

  // Hide the page loader once window.load fires, but ensure minimum display
  window.addEventListener('load', function () {
    try {
      if (!loader) return;
      var reference = showStart || loaderStart;
      var elapsed = Date.now() - reference;
      var wait = Math.max(0, MIN_DISPLAY_MS - elapsed);

      setTimeout(function () {
        loader.classList.add('fade-out');
        document.body.classList.remove('loading');
        setTimeout(function () {
          if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
        }, REMOVE_AFTER_FADE_MS);
      }, wait);
    } catch (e) {
      console.error('Loader hide error:', e);
    }
  });

})();
