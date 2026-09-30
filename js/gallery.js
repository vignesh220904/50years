/* =====================================================================
   js/gallery.js
   Curated Memory Wall Gallery & Cinematic Lightbox Modal
   ===================================================================== */
(function () {
  "use strict";

  var M = window.MEMORIES || {};
  var galleryItems = M.gallery || [];
  var currentLightboxIdx = 0;
  var filteredItems = galleryItems.slice();

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderGallery(category) {
    var grid = document.getElementById("galleryGrid");
    if (!grid) return;

    if (category && category !== "all") {
      filteredItems = galleryItems.filter(function (item) {
        return item.category === category;
      });
    } else {
      filteredItems = galleryItems.slice();
    }

    var html = "";
    filteredItems.forEach(function (item, idx) {
      var aspectClass = item.aspect ? "aspect-" + item.aspect : "aspect-portrait";
      html +=
        '<div class="gallery-item reveal ' + aspectClass + '" data-index="' + idx + '" data-category="' + esc(item.category) + '">' +
          '<div class="polaroid-frame">' +
            '<div class="polaroid-pin" aria-hidden="true"></div>' +
            '<div class="polaroid-img-wrap">' +
              '<img src="' + esc(item.image) + '" alt="' + esc(item.title) + '" loading="lazy">' +
              '<div class="polaroid-overlay">' +
                '<span class="view-btn"><span>✦</span> View Memory</span>' +
              '</div>' +
            '</div>' +
            '<div class="polaroid-caption">' +
              '<div class="polaroid-meta">' +
                '<span class="polaroid-cat">' + esc(item.category) + '</span>' +
                (item.year ? '<span class="polaroid-year">' + esc(item.year) + '</span>' : '') +
              '</div>' +
              '<h4 class="polaroid-title">' + esc(item.title) + '</h4>' +
              '<p class="polaroid-desc">' + esc(item.caption || "") + '</p>' +
            '</div>' +
          '</div>' +
        '</div>';
    });

    grid.innerHTML = html;

    // Observe newly rendered items for reveal animation
    if (window.IntersectionObserver) {
      var revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) en.target.classList.add("in-view");
        });
      }, { threshold: 0.15 });
      grid.querySelectorAll(".gallery-item").forEach(function (el) { revealIO.observe(el); });
    }
  }

  function openLightbox(idx) {
    currentLightboxIdx = idx;
    var item = filteredItems[idx];
    if (!item) return;

    var modal = document.getElementById("galleryLightbox");
    var img = document.getElementById("lightboxImg");
    var title = document.getElementById("lightboxTitle");
    var year = document.getElementById("lightboxYear");
    var desc = document.getElementById("lightboxDesc");
    var count = document.getElementById("lightboxCount");

    if (!modal || !img) return;

    img.src = item.image;
    img.alt = item.title;
    if (title) title.textContent = item.title;
    if (year) year.textContent = item.year || "";
    if (desc) desc.textContent = item.caption || "";
    if (count) count.textContent = (idx + 1) + " / " + filteredItems.length;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeLightbox() {
    var modal = document.getElementById("galleryLightbox");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function nextLightbox() {
    if (!filteredItems.length) return;
    currentLightboxIdx = (currentLightboxIdx + 1) % filteredItems.length;
    openLightbox(currentLightboxIdx);
  }

  function prevLightbox() {
    if (!filteredItems.length) return;
    currentLightboxIdx = (currentLightboxIdx - 1 + filteredItems.length) % filteredItems.length;
    openLightbox(currentLightboxIdx);
  }

  function initEvents() {
    // Filter tags
    var filtersWrap = document.getElementById("galleryFilters");
    if (filtersWrap) {
      filtersWrap.addEventListener("click", function (e) {
        var btn = e.target.closest(".gallery-filter-btn");
        if (!btn) return;
        filtersWrap.querySelectorAll(".gallery-filter-btn").forEach(function (b) {
          b.classList.toggle("active", b === btn);
        });
        renderGallery(btn.getAttribute("data-filter"));
      });
    }

    // Grid item click
    var grid = document.getElementById("galleryGrid");
    if (grid) {
      grid.addEventListener("click", function (e) {
        var item = e.target.closest(".gallery-item");
        if (!item) return;
        var idx = parseInt(item.getAttribute("data-index"), 10);
        openLightbox(idx);
      });
    }

    // Lightbox modal buttons
    var modal = document.getElementById("galleryLightbox");
    if (modal) {
      var closeBtn = modal.querySelector(".lightbox-close");
      var nextBtn = modal.querySelector(".lightbox-next");
      var prevBtn = modal.querySelector(".lightbox-prev");
      var backdrop = modal.querySelector(".lightbox-backdrop");

      if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
      if (nextBtn) nextBtn.addEventListener("click", nextLightbox);
      if (prevBtn) prevBtn.addEventListener("click", prevLightbox);
      if (backdrop) backdrop.addEventListener("click", closeLightbox);

      document.addEventListener("keydown", function (e) {
        if (!modal.classList.contains("open")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") nextLightbox();
        if (e.key === "ArrowLeft") prevLightbox();
      });
    }
  }

  window.MemoryGallery = {
    init: function () {
      renderGallery("all");
      initEvents();
    }
  };
})();
