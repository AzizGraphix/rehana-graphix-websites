// Rehana Graphix — Work page: mobile tap-to-open full-screen video player
// with speed control + double-tap 10s skip. Desktop keeps native <video controls>.
(function () {
  function ready(fn) {
    document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var mq = window.matchMedia('(max-width: 760px)');
    var tiles = Array.prototype.slice.call(document.querySelectorAll('[data-video-tile]'));

    var player = document.getElementById('videoPlayer');
    var playerVideo = document.getElementById('videoPlayerVideo');
    var closeBtn = document.getElementById('videoPlayerClose');
    var skipFlash = document.getElementById('skipFlash');
    var speedPills = Array.prototype.slice.call(document.querySelectorAll('.speed-pill'));

    function applyMode(isMobile) {
      tiles.forEach(function (tile) {
        var video = tile.querySelector('video');
        if (isMobile) {
          video.muted = true;
          video.loop = true;
          video.autoplay = true;
          video.removeAttribute('controls');
          video.play().catch(function () {});
        } else {
          video.pause();
          video.muted = false;
          video.loop = false;
          video.removeAttribute('autoplay');
          video.setAttribute('controls', '');
        }
      });
    }
    applyMode(mq.matches);
    mq.addEventListener ? mq.addEventListener('change', function (e) { applyMode(e.matches); })
                         : mq.addListener(function (e) { applyMode(e.matches); });

    function openPlayer(src) {
      playerVideo.src = src;
      playerVideo.playbackRate = 1;
      setActiveSpeed(1);
      player.classList.add('is-open');
      playerVideo.play().catch(function () {});
    }
    function closePlayer() {
      player.classList.remove('is-open');
      playerVideo.pause();
      playerVideo.removeAttribute('src');
      playerVideo.load();
    }

    tiles.forEach(function (tile) {
      tile.addEventListener('click', function () {
        if (!mq.matches) return; // desktop: native controls handle playback
        openPlayer(tile.getAttribute('data-src'));
      });
    });
    closeBtn.addEventListener('click', closePlayer);

    function setActiveSpeed(v) {
      speedPills.forEach(function (p) {
        p.classList.toggle('active', parseFloat(p.getAttribute('data-speed')) === v);
      });
    }
    speedPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        var v = parseFloat(pill.getAttribute('data-speed'));
        playerVideo.playbackRate = v;
        setActiveSpeed(v);
      });
    });

    function togglePlay() {
      if (playerVideo.paused) playerVideo.play(); else playerVideo.pause();
    }
    function flash(text) {
      skipFlash.textContent = text;
      skipFlash.classList.add('show');
      clearTimeout(flash._t);
      flash._t = setTimeout(function () { skipFlash.classList.remove('show'); }, 550);
    }
    function skip(delta) {
      playerVideo.currentTime = Math.max(0, playerVideo.currentTime + delta);
      flash((delta > 0 ? '+' : '') + delta + 's');
    }

    // Double-tap (or double-click) detection for left/right skip zones.
    function wireDoubleTap(el, onDouble, onSingle) {
      var lastTap = 0;
      el.addEventListener('click', function () {
        var now = Date.now();
        if (now - lastTap < 350) {
          lastTap = 0;
          onDouble();
        } else {
          lastTap = now;
          setTimeout(function () {
            if (Date.now() - lastTap >= 350) return; // superseded by a second tap
          }, 360);
          if (onSingle) setTimeout(function () {
            if (lastTap !== 0 && Date.now() - lastTap >= 340) onSingle();
          }, 350);
        }
      });
    }

    document.getElementById('tapMid').addEventListener('click', togglePlay);
    wireDoubleTap(document.getElementById('tapLeft'), function () { skip(-10); }, togglePlay);
    wireDoubleTap(document.getElementById('tapRight'), function () { skip(10); }, togglePlay);
  });
})();
