/* =====================================================================
   js/video-wishes.js
   Family Video Wishes ("Messages From The People Who Love You")
   ===================================================================== */
(function () {
  "use strict";

  var M = window.MEMORIES || {};
  var videoWishes = M.videoWishes || [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var PLAY_ICON = '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';

  function renderVideoWishes() {
    var grid = document.getElementById("wishesVideoGrid");
    if (!grid || !videoWishes.length) return;

    var html = "";
    videoWishes.forEach(function (vw, idx) {
      html +=
        '<div class="video-wish-card reveal" data-index="' + idx + '" data-video-src="' + esc(vw.videoSrc) + '">' +
          '<div class="vw-thumb-wrap">' +
            '<img src="' + esc(vw.thumb) + '" alt="' + esc(vw.name) + '" loading="lazy">' +
            '<div class="vw-play-btn" aria-label="Play video from ' + esc(vw.name) + '">' +
              PLAY_ICON +
            '</div>' +
            (vw.duration ? '<span class="vw-duration">' + esc(vw.duration) + '</span>' : '') +
            '<div class="vw-gradient-overlay"></div>' +
          '</div>' +
          '<div class="vw-info">' +
            '<div class="vw-badge-row">' +
              '<span class="vw-relation">' + esc(vw.relation) + '</span>' +
              '<span class="vw-sparkle">✦</span>' +
            '</div>' +
            '<h4 class="vw-name">' + esc(vw.name) + '</h4>' +
            '<p class="vw-quote">“' + esc(vw.quote) + '”</p>' +
          '</div>' +
        '</div>';
    });

    grid.innerHTML = html;

    // Observe newly rendered cards for reveal animation
    if (window.IntersectionObserver) {
      var revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) en.target.classList.add("in-view");
        });
      }, { threshold: 0.15 });
      grid.querySelectorAll(".video-wish-card").forEach(function (el) { revealIO.observe(el); });
    }
  }

  function openVideoModal(vw) {
    var modal = document.getElementById("wishesVideoModal");
    var videoEl = document.getElementById("wishesModalVideo");
    var titleEl = document.getElementById("wishesModalTitle");
    var subtitleEl = document.getElementById("wishesModalSubtitle");
    var quoteEl = document.getElementById("wishesModalQuote");

    if (!modal || !videoEl) return;

    videoEl.src = vw.videoSrc;
    if (titleEl) titleEl.textContent = vw.name;
    if (subtitleEl) subtitleEl.textContent = vw.relation;
    if (quoteEl) quoteEl.textContent = "“" + vw.quote + "”";

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (window.AmbientAudio) window.AmbientAudio.duck();

    videoEl.play().catch(function () {});
  }

  function closeVideoModal() {
    var modal = document.getElementById("wishesVideoModal");
    var videoEl = document.getElementById("wishesModalVideo");
    if (!modal) return;

    if (videoEl) {
      videoEl.pause();
      videoEl.removeAttribute("src");
      videoEl.load();
    }

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (window.AmbientAudio) window.AmbientAudio.restore();
  }

  function initEvents() {
    var grid = document.getElementById("wishesVideoGrid");
    if (grid) {
      grid.addEventListener("click", function (e) {
        var card = e.target.closest(".video-wish-card");
        if (!card) return;
        var idx = parseInt(card.getAttribute("data-index"), 10);
        var vw = videoWishes[idx];
        if (vw) openVideoModal(vw);
      });
    }

    var modal = document.getElementById("wishesVideoModal");
    if (modal) {
      var closeBtn = modal.querySelector(".video-modal-close");
      var backdrop = modal.querySelector(".video-modal-backdrop");
      if (closeBtn) closeBtn.addEventListener("click", closeVideoModal);
      if (backdrop) backdrop.addEventListener("click", closeVideoModal);

      document.addEventListener("keydown", function (e) {
        if (modal.classList.contains("open") && e.key === "Escape") {
          closeVideoModal();
        }
      });
    }
  }

  window.VideoWishes = {
    init: function () {
      renderVideoWishes();
      initEvents();
    }
  };
})();
