/* =====================================================================
   tilt.js : scroll + pointer driven 3D tilt for photo stacks and video
   Every .stack element leans like a rotating drum as you scroll, and
   follows the cursor on desktop. Also drives the big-number parallax.
   ===================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  var items = [], px = 0, py = 0, hasPtr = false, started = false;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  window.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    px = e.clientX / window.innerWidth * 2 - 1;
    py = e.clientY / window.innerHeight * 2 - 1;
    hasPtr = true;
  }, { passive: true });

  function init() {
    if (started) return;
    started = true;
    items = Array.prototype.slice.call(document.querySelectorAll(".stack")).map(function (el) {
      return { el: el, wrap: el.parentElement, chapter: el.closest(".chapter"), rx: 0, ry: 0, vis: false };
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        items.forEach(function (it) { if (it.wrap === en.target) it.vis = en.isIntersecting; });
      });
    }, { rootMargin: "20% 0px" });
    items.forEach(function (it) { io.observe(it.wrap); });
    if (!reduce) requestAnimationFrame(tick);
  }

  function tick() {
    requestAnimationFrame(tick);
    var vw = window.innerWidth, vh = window.innerHeight, narrow = vw < 900;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (!it.vis) continue;
      var r = it.wrap.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var t = clamp((cy - vh / 2) / (vh / 2), -1.4, 1.4);      // -1 top .. 0 centre .. +1 bottom
      var side = narrow ? 0 : (cx < vw / 2 ? 1 : -1);          // lean toward the page centre
      var trx = clamp(t * 11, -14, 14);
      var tryy = side * 8 - (narrow ? t * 5 : 0);
      if (hasPtr && !coarse) { trx += -py * 5; tryy += px * 7; }
      it.rx += (trx - it.rx) * 0.08;
      it.ry += (tryy - it.ry) * 0.08;
      it.el.style.transform = "rotateX(" + it.rx.toFixed(2) + "deg) rotateY(" + it.ry.toFixed(2) + "deg)";
      it.el.style.setProperty("--gx", (50 + it.ry * 4).toFixed(1) + "%");
      it.el.style.setProperty("--gy", (35 - it.rx * 3).toFixed(1) + "%");
      if (it.chapter) it.chapter.style.setProperty("--py", (-t * 70).toFixed(1) + "px");
    }
  }

  window.Tilt = { init: init };
})();
