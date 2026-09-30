/* =====================================================================
   js/reasons.js
   50 Reasons Why We Love You - Interactive Card Sequence & Grid
   ===================================================================== */
(function () {
  "use strict";

  var M = window.MEMORIES || {};
  var reasons = M.reasons || [];
  var currentIndex = 0;
  var viewMode = "carousel"; // 'carousel' or 'grid'
  var likedReasons = {};

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function spawnHearts(originEl) {
    if (!originEl) return;
    var rect = originEl.getBoundingClientRect();
    var count = 12;
    for (var i = 0; i < count; i++) {
      var heart = document.createElement("span");
      heart.className = "floating-heart";
      heart.textContent = ["❤", "💖", "✨", "💕", "✦"][Math.floor(Math.random() * 5)];
      heart.style.left = (rect.left + rect.width / 2 + (Math.random() * 60 - 30)) + "px";
      heart.style.top = (rect.top + (Math.random() * 30 - 15)) + "px";
      heart.style.setProperty("--vx", (Math.random() * 120 - 60) + "px");
      heart.style.setProperty("--vy", (-Math.random() * 140 - 60) + "px");
      heart.style.setProperty("--rot", (Math.random() * 60 - 30) + "deg");
      document.body.appendChild(heart);
      setTimeout((function (h) { return function () { if (h.parentNode) h.parentNode.removeChild(h); }; })(heart), 1200);
    }
  }

  function updateCarouselCard() {
    var card = document.getElementById("reasonCard");
    var numEl = document.getElementById("reasonNum");
    var textEl = document.getElementById("reasonText");
    var progressEl = document.getElementById("reasonProgressText");
    var progressFill = document.getElementById("reasonProgressFill");
    var likeBtn = document.getElementById("reasonLikeBtn");

    if (!card || !reasons.length) return;

    var n = currentIndex + 1;
    var numStr = String(n).padStart(2, "0");
    var text = reasons[currentIndex];

    card.classList.remove("flip");
    void card.offsetWidth;
    card.classList.add("flip");

    if (numEl) numEl.textContent = "Reason " + numStr;
    if (textEl) textEl.textContent = text;
    if (progressEl) progressEl.textContent = n + " / 50";
    if (progressFill) progressFill.style.width = ((n / 50) * 100) + "%";

    if (likeBtn) {
      var isLiked = !!likedReasons[currentIndex];
      likeBtn.classList.toggle("liked", isLiked);
      likeBtn.setAttribute("aria-pressed", isLiked ? "true" : "false");
    }

    // Milestone celebrations
    if (n === 10 || n === 25 || n === 50) {
      spawnHearts(card);
    }
  }

  function renderGridView(filterQuery) {
    var gridWrap = document.getElementById("reasonsGrid");
    if (!gridWrap) return;

    var query = (filterQuery || "").toLowerCase().trim();
    var html = "";

    reasons.forEach(function (reason, idx) {
      if (query && !reason.toLowerCase().includes(query)) return;
      var numStr = String(idx + 1).padStart(2, "0");
      var isLiked = !!likedReasons[idx];

      html +=
        '<div class="reason-grid-card" data-index="' + idx + '">' +
          '<div class="rg-header">' +
            '<span class="rg-num">' + numStr + '</span>' +
            '<button class="rg-like ' + (isLiked ? "liked" : "") + '" data-like-idx="' + idx + '" aria-label="Heart reason ' + numStr + '">' +
              '<span class="heart-icon">❤</span>' +
            '</button>' +
          '</div>' +
          '<p class="rg-text">' + esc(reason) + '</p>' +
          '<div class="rg-footer">' +
            '<span class="rg-seal">✦ 50 Years of Love</span>' +
          '</div>' +
        '</div>';
    });

    if (!html) {
      html = '<div class="reasons-empty">No reasons found matching "' + esc(filterQuery) + '"</div>';
    }

    gridWrap.innerHTML = html;
  }

  function nextReason() {
    currentIndex = (currentIndex + 1) % reasons.length;
    updateCarouselCard();
  }

  function prevReason() {
    currentIndex = (currentIndex - 1 + reasons.length) % reasons.length;
    updateCarouselCard();
  }

  function randomReason() {
    var nextIdx = Math.floor(Math.random() * reasons.length);
    if (nextIdx === currentIndex && reasons.length > 1) {
      nextIdx = (nextIdx + 1) % reasons.length;
    }
    currentIndex = nextIdx;
    updateCarouselCard();
  }

  function initEvents() {
    var nextBtn = document.getElementById("reasonNextBtn");
    var prevBtn = document.getElementById("reasonPrevBtn");
    var shuffleBtn = document.getElementById("reasonShuffleBtn");
    var toggleViewBtn = document.getElementById("reasonViewToggle");
    var likeBtn = document.getElementById("reasonLikeBtn");
    var searchInput = document.getElementById("reasonsSearchInput");

    var carouselSection = document.getElementById("reasonsCarouselWrap");
    var gridSection = document.getElementById("reasonsGridWrap");

    if (nextBtn) nextBtn.addEventListener("click", nextReason);
    if (prevBtn) prevBtn.addEventListener("click", prevReason);
    if (shuffleBtn) shuffleBtn.addEventListener("click", randomReason);

    if (likeBtn) {
      likeBtn.addEventListener("click", function () {
        likedReasons[currentIndex] = !likedReasons[currentIndex];
        likeBtn.classList.toggle("liked", likedReasons[currentIndex]);
        if (likedReasons[currentIndex]) spawnHearts(likeBtn);
      });
    }

    if (toggleViewBtn) {
      toggleViewBtn.addEventListener("click", function () {
        if (viewMode === "carousel") {
          viewMode = "grid";
          if (carouselSection) carouselSection.hidden = true;
          if (gridSection) gridSection.hidden = false;
          toggleViewBtn.innerHTML = '<span class="icon">◫</span> Deck View';
          renderGridView(searchInput ? searchInput.value : "");
        } else {
          viewMode = "carousel";
          if (carouselSection) carouselSection.hidden = false;
          if (gridSection) gridSection.hidden = true;
          toggleViewBtn.innerHTML = '<span class="icon">▦</span> View All 50';
          updateCarouselCard();
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", function (e) {
        if (viewMode !== "grid") {
          // auto-switch to grid on search
          viewMode = "grid";
          if (carouselSection) carouselSection.hidden = true;
          if (gridSection) gridSection.hidden = false;
          if (toggleViewBtn) toggleViewBtn.innerHTML = '<span class="icon">◫</span> Deck View';
        }
        renderGridView(e.target.value);
      });
    }

    // Delegate grid likes
    if (gridSection) {
      gridSection.addEventListener("click", function (e) {
        var btn = e.target.closest(".rg-like");
        if (!btn) return;
        var idx = parseInt(btn.getAttribute("data-like-idx"), 10);
        likedReasons[idx] = !likedReasons[idx];
        btn.classList.toggle("liked", likedReasons[idx]);
        if (likedReasons[idx]) spawnHearts(btn);
      });
    }
  }

  window.Reasons50 = {
    init: function () {
      updateCarouselCard();
      initEvents();
    }
  };
})();
