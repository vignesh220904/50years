/* =====================================================================
   timeline.js : renders the Life Journey from data/memories.js
   ===================================================================== */
(function () {
  "use strict";

  var M = window.MEMORIES || { chapters: [] };
  var initialised = false;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Splits text into per-letter spans so titles can flip in, in 3D
  function split(text, extraDelay) {
    var idx = 0;
    return String(text).split(" ").map(function (w) {
      var chars = w.split("").map(function (ch) {
        return '<span class="c" style="--i:' + (idx++) + (extraDelay ? ";--d0:" + extraDelay : "") + '">' + esc(ch) + "</span>";
      }).join("");
      return '<span class="w" aria-hidden="true">' + chars + "</span>";
    }).join(" ");
  }
  function splitInto(el, text, extraDelay) {
    el.setAttribute("aria-label", text);
    el.innerHTML = split(text, extraDelay);
  }

  var CAMERA_ICON =
    '<svg viewBox="0 0 24 24" width="38" height="38" aria-hidden="true"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
  var PLAY_ICON =
    '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>';

  function imagesOf(ch) {
    if (ch.images && ch.images.length) return ch.images;
    return ch.image ? [ch.image] : [];
  }

  function mediaHTML(ch, imgs) {
    if (ch.video) {
      return '<video src="' + esc(ch.video) + '" ' + (imgs[0] ? 'poster="' + esc(imgs[0]) + '" ' : "") +
        'controls playsinline preload="none"></video>';
    }
    if (imgs[0]) {
      return '<img src="' + esc(imgs[0]) + '" alt="' + esc(ch.title) + '" loading="lazy">';
    }
    return '<div class="placeholder">' + CAMERA_ICON + "<span>Add photo · " + esc(ch.title) + "</span></div>";
  }

  function backCard(src, cls) {
    return '<div class="back ' + cls + '">' + (src ? '<img src="' + esc(src) + '" alt="" loading="lazy">' : "") + "</div>";
  }

  function renderVideoSlot() {
    var slot = document.getElementById("videoSlot");
    var v = M.journeyVideo || {};
    if (v.src) {
      slot.innerHTML = '<video src="' + esc(v.src) + '" ' + (v.poster ? 'poster="' + esc(v.poster) + '" ' : "") +
        'controls playsinline preload="metadata"></video>';
    } else {
      slot.innerHTML =
        '<div class="video-ph"><span class="play">' + PLAY_ICON + "</span>" +
        "<h3>" + esc(v.title || "Her Life, In Motion") + "</h3>" +
        "<p>" + esc(v.note || "") + "</p><small>AI life journey video · coming soon</small></div>";
    }
  }

  function renderChapters() {
    var wrap = document.getElementById("chapters");
    var rail = document.getElementById("rail");
    var html = "", dots = "";

    M.chapters.forEach(function (ch, i) {
      var n = String(i + 1).padStart(2, "0");
      var imgs = imagesOf(ch);
      var lines = (ch.lines || []).map(function (l, k) {
        return '<p class="reveal" style="--d:' + (0.55 + k * 0.25).toFixed(2) + 's">' + esc(l) + "</p>";
      }).join("");

      html +=
        '<section class="chapter" id="' + esc(ch.id) + '" data-mood="' + esc(ch.mood || "rose") + '" aria-label="' + esc(ch.title) + '">' +
          '<span class="chapter-num" aria-hidden="true">' + n + "</span>" +
          '<div class="chapter-media reveal">' +
            '<div class="orbit" aria-hidden="true"><i></i><i></i></div>' +
            '<div class="stack">' +
              backCard(imgs[2], "b2") + backCard(imgs[1], "b1") +
              '<div class="frame"><div class="kb">' + mediaHTML(ch, imgs) + '</div><span class="glare"></span></div>' +
              (ch.years ? '<span class="year-tag">' + esc(ch.years) + "</span>" : "") +
              '<span class="spark s1" aria-hidden="true"></span><span class="spark s2" aria-hidden="true"></span>' +
            "</div>" +
          "</div>" +
          '<div class="chapter-text">' +
            '<p class="chapter-label reveal">Chapter ' + n + "</p>" +
            '<h3 class="split" aria-label="' + esc(ch.title) + '">' + split(ch.title, ".2s") + "</h3>" +
            '<div class="rule" aria-hidden="true"></div>' +
            '<div class="lines">' + lines + "</div>" +
          "</div>" +
        "</section>";

      dots += '<button type="button" data-target="' + esc(ch.id) + '" aria-label="' + esc(ch.title) + '"><span>' + esc(ch.title) + "</span></button>";
    });

    wrap.innerHTML = html;
    rail.innerHTML = dots;

    rail.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-target]");
      if (!b) return;
      var el = document.getElementById(b.getAttribute("data-target"));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function observe() {
    var chapters = Array.prototype.slice.call(document.querySelectorAll(".chapter"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("#rail button"));

    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) en.target.classList.add("in-view");
        else if (en.target.classList.contains("chapter")) en.target.classList.remove("in-view"); // replay
      });
    }, { threshold: 0.25 });

    chapters.forEach(function (c) { revealIO.observe(c); });
    document.querySelectorAll(".journey-intro, .close-inner").forEach(function (el) { revealIO.observe(el); });

    var activeIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        dots.forEach(function (d) { d.classList.toggle("active", d.getAttribute("data-target") === en.target.id); });
        if (window.Scene) window.Scene.setMood(en.target.getAttribute("data-mood"));
      });
    }, { threshold: 0.55 });
    chapters.forEach(function (c) { activeIO.observe(c); });

    var intro = document.querySelector(".journey-intro");
    var close = document.querySelector(".journey-close");
    var railIO = new IntersectionObserver(function () {
      var introVisible = intro.getBoundingClientRect().bottom > window.innerHeight * 0.6;
      var closeVisible = close.getBoundingClientRect().top < window.innerHeight * 0.4;
      document.body.classList.toggle("rail-on", !introVisible && !closeVisible);
      if (closeVisible && window.Scene) window.Scene.setMood("gold");
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    railIO.observe(intro);
    railIO.observe(close);

    var bar = document.querySelector("#progress span");
    var ticking = false;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.width = (p * 100).toFixed(2) + "%";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  window.Journey = {
    init: function () {
      if (initialised) return;
      initialised = true;
      splitInto(document.getElementById("journeyTitle"), "Her Life Journey", ".15s");
      renderVideoSlot();
      renderChapters();
      splitInto(document.getElementById("closingLine"), M.closingLine || "", ".1s");
      observe();
      if (window.Tilt) window.Tilt.init();
    }
  };
})();
