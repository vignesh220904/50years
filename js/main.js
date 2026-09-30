/* =====================================================================
   js/main.js : Master Controller
   Handles loader, opening flow, audio integration, section observers,
   and dynamic module initialization.
   ===================================================================== */
(function () {
  "use strict";

  var M = window.MEMORIES || {};
  var body = document.body;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 2D gold dust: fallback if WebGL is not available ---------- */
  (function dust() {
    if (window.Scene && window.Scene.ok) return;
    var c = document.getElementById("dust");
    if (!c || reduce) return;
    body.classList.add("no-gl");
    var ctx = c.getContext("2d");
    var W, H, parts = [], dpr = Math.min(window.devicePixelRatio || 1, 2);

    function size() {
      W = window.innerWidth; H = window.innerHeight;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(initial) {
      return {
        x: Math.random() * W,
        y: initial ? Math.random() * H : H + 10,
        r: Math.random() * 1.8 + 0.4,
        vy: Math.random() * 0.25 + 0.06,
        vx: (Math.random() - 0.5) * 0.15,
        a: Math.random() * 0.5 + 0.15,
        t: Math.random() * Math.PI * 2
      };
    }
    function init() {
      size();
      var count = Math.round(Math.min(60, (W * H) / 26000));
      parts = [];
      for (var i = 0; i < count; i++) parts.push(make(true));
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.t += 0.01; p.y -= p.vy; p.x += p.vx + Math.sin(p.t) * 0.12;
        if (p.y < -10) parts[i] = make(false);
        var tw = p.a * (0.6 + 0.4 * Math.sin(p.t * 2));
        ctx.beginPath();
        ctx.fillStyle = "rgba(233,215,166," + tw.toFixed(3) + ")";
        ctx.shadowColor = "rgba(201,169,110,.8)"; ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    window.addEventListener("resize", init);
    init(); frame();
  })();

  /* ---------- Opening sequence ---------- */
  var steps = document.querySelectorAll("[data-step]");
  var opLines = document.getElementById("opLines");
  var timers = [];
  var skipped = false;
  var schedule = { 1: 0.4, 2: 3.2, 3: 6.8, 4: 10.4, 5: 12.8, 6: 14.4 };

  function showStep(el) {
    el.classList.add("show");
    if (el.getAttribute("data-step") === "4") {
      if (opLines) opLines.classList.add("gone");
      if (window.Scene) window.Scene.assemble(skipped);
    }
  }

  function runOpening() {
    body.classList.add("opening-active");
    steps.forEach(function (el) {
      var t = (schedule[el.getAttribute("data-step")] || 0) * 1000;
      if (reduce) t = 0;
      timers.push(setTimeout(function () { showStep(el); }, t));
    });
  }

  function skipIntro() {
    skipped = true;
    timers.forEach(clearTimeout);
    steps.forEach(function (el) { if (!el.classList.contains("show")) showStep(el); });
    var skipBtn = document.getElementById("skipIntro");
    if (skipBtn) skipBtn.hidden = true;
  }

  var skipBtn = document.getElementById("skipIntro");
  if (skipBtn) skipBtn.addEventListener("click", skipIntro);

  /* ---------- Global Modules Initializer ---------- */
  var initializedAll = false;
  function initAllModules() {
    if (initializedAll) return;
    initializedAll = true;

    if (window.Journey) window.Journey.init();
    if (window.FamilyLetters) window.FamilyLetters.init();
    if (window.MemoryGallery) window.MemoryGallery.init();
    if (window.Reasons50) window.Reasons50.init();
    if (window.VideoWishes) window.VideoWishes.init();
    if (window.GrandFinale) window.GrandFinale.init();
    if (window.GiftExperience) window.GiftExperience.init();

    setupSectionObservers();
    setupSmoothNav();
  }

  /* ---------- Begin the journey button ---------- */
  var beginBtn = document.getElementById("beginBtn");
  if (beginBtn) {
    beginBtn.addEventListener("click", function () {
      if (window.AmbientAudio) window.AmbientAudio.play();
      initAllModules();
      if (window.Scene) window.Scene.enterJourney();
      body.classList.add("leaving");

      setTimeout(function () {
        var openingSection = document.getElementById("opening");
        var journeySection = document.getElementById("journey");
        if (openingSection) openingSection.hidden = true;
        if (journeySection) journeySection.hidden = false;

        body.classList.remove("opening-active", "leaving");
        body.classList.add("in-journey");
        window.scrollTo({ top: 0, behavior: "smooth" });

        if (window.Scene) window.Scene.startJourney();
        window.dispatchEvent(new Event("scroll"));
      }, reduce ? 50 : 1200);
    });
  }

  /* ---------- Navigation & Scroll Sync ---------- */
  function setupSmoothNav() {
    var navLinks = document.querySelectorAll(".nav-link, .next-section-btn");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          var targetEl = document.querySelector(href);
          if (targetEl) {
            e.preventDefault();
            // If opening is still visible, trigger journey start
            var opening = document.getElementById("opening");
            if (opening && !opening.hidden) {
              if (beginBtn) beginBtn.click();
              setTimeout(function () {
                targetEl.scrollIntoView({ behavior: "smooth" });
              }, 1300);
            } else {
              targetEl.scrollIntoView({ behavior: "smooth" });
            }
          }
        }
      });
    });
  }

  function setupSectionObservers() {
    // Reveal all .reveal elements as they enter viewport
    if (window.IntersectionObserver) {
      var revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in-view");
          }
        });
      }, { threshold: 0.12 });

      document.querySelectorAll(".reveal, .section-header").forEach(function (el) {
        revealIO.observe(el);
      });

      // Track active section for top nav links
      var sections = document.querySelectorAll("section[id]");
      var navLinks = document.querySelectorAll(".nav-link");

      var navIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var id = en.target.getAttribute("id");
            navLinks.forEach(function (link) {
              var href = link.getAttribute("href");
              link.classList.toggle("active", href === "#" + id);
            });
          }
        });
      }, { threshold: 0.3 });

      sections.forEach(function (s) { navIO.observe(s); });
    }

    // Scroll progress bar
    var bar = document.querySelector("#progress span");
    var ticking = false;
    function updateProgress() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (bar) bar.style.width = (p * 100).toFixed(2) + "%";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
    }, { passive: true });
    updateProgress();
  }

  /* ---------- Loader Initialization ---------- */
  var started = false;
  function ready() {
    if (started) return;
    started = true;
    if (window.AmbientAudio) window.AmbientAudio.init();
    setTimeout(function () {
      body.classList.remove("is-loading");
      runOpening();
    }, reduce ? 200 : 1200);
  }

  if (document.readyState === "complete") ready();
  else { window.addEventListener("load", ready); setTimeout(ready, 4000); }
})();
