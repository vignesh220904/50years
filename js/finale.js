/* =====================================================================
   js/finale.js
   The Grand Finale: Age 1 to 50 Cinematic Time Machine & Birthday Reveal
   ===================================================================== */
(function () {
  "use strict";

  var M = window.MEMORIES || {};
  var milestones = M.ageMilestones || [];
  var currentStep = 0;
  var isAutoPlaying = false;
  var autoPlayTimer = null;
  var confettiActive = false;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderAgeTimelineNav() {
    var scrubber = document.getElementById("finaleScrubber");
    if (!scrubber || !milestones.length) return;

    var html = "";
    milestones.forEach(function (m, idx) {
      var isLast = idx === milestones.length - 1;
      html +=
        '<button class="scrubber-dot ' + (idx === 0 ? "active" : "") + (isLast ? " dot-50" : "") + '" data-step="' + idx + '" title="Age ' + m.age + ' (' + m.year + ')">' +
          '<span class="dot-ring"></span>' +
          '<span class="dot-label">' + (isLast ? "50 ★" : m.age) + '</span>' +
        '</button>';
    });

    scrubber.innerHTML = html;
  }

  function showAgeStep(idx, triggerCelebration) {
    if (idx < 0 || idx >= milestones.length) return;
    currentStep = idx;
    var m = milestones[idx];
    var is50 = m.age === 50;

    var photoEl = document.getElementById("finalePhoto");
    var ageNumEl = document.getElementById("finaleAgeNum");
    var yearEl = document.getElementById("finaleYear");
    var titleEl = document.getElementById("finaleTitle");
    var descEl = document.getElementById("finaleDesc");
    var revealBanner = document.getElementById("finaleRevealBanner");
    var stageCard = document.getElementById("finaleStageCard");

    // Update scrubber buttons
    var dots = document.querySelectorAll("#finaleScrubber .scrubber-dot");
    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === idx);
      d.classList.toggle("passed", i < idx);
    });

    if (stageCard) {
      stageCard.classList.remove("fade-in");
      void stageCard.offsetWidth;
      stageCard.classList.add("fade-in");
    }

    if (photoEl) {
      photoEl.src = m.photo;
      photoEl.alt = "Age " + m.age + " - " + m.label;
    }
    if (ageNumEl) ageNumEl.textContent = m.age;
    if (yearEl) yearEl.textContent = m.year;
    if (titleEl) titleEl.textContent = m.label;
    if (descEl) descEl.textContent = m.desc;

    if (revealBanner) {
      if (is50) {
        revealBanner.classList.add("show");
        if (triggerCelebration !== false) {
          launchBirthdayCelebration();
        }
      } else {
        revealBanner.classList.remove("show");
      }
    }
  }

  function nextStep() {
    var nextIdx = currentStep + 1;
    if (nextIdx >= milestones.length) {
      pauseAutoPlay();
      return;
    }
    showAgeStep(nextIdx, true);
  }

  function prevStep() {
    if (currentStep > 0) {
      showAgeStep(currentStep - 1, false);
    }
  }

  function startAutoPlay() {
    isAutoPlaying = true;
    var playBtn = document.getElementById("finalePlayBtn");
    if (playBtn) playBtn.innerHTML = '<span class="icon">❚❚</span> Pause Journey';

    if (currentStep >= milestones.length - 1) {
      currentStep = -1;
    }

    autoPlayTimer = setInterval(function () {
      if (currentStep < milestones.length - 1) {
        nextStep();
      } else {
        pauseAutoPlay();
      }
    }, 3200);
  }

  function pauseAutoPlay() {
    isAutoPlaying = false;
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    var playBtn = document.getElementById("finalePlayBtn");
    if (playBtn) playBtn.innerHTML = '<span class="icon">▶</span> Auto-Play Journey';
  }

  function toggleAutoPlay() {
    if (isAutoPlaying) {
      pauseAutoPlay();
    } else {
      startAutoPlay();
    }
  }

  /* ---------- Golden Birthday Fireworks & Confetti Canvas ---------- */
  function launchBirthdayCelebration() {
    var canvas = document.getElementById("confettiCanvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var W = canvas.width = window.innerWidth;
    var H = canvas.height = window.innerHeight;
    var particles = [];
    var colors = ["#C9A96E", "#E6D3A8", "#FAF6EE", "#D9A5A0", "#F5D061", "#FFFFFF", "#E5A93C"];

    for (var i = 0; i < 180; i++) {
      particles.push({
        x: W / 2 + (Math.random() * 200 - 100),
        y: H * 0.45 + (Math.random() * 100 - 50),
        vx: (Math.random() - 0.5) * 14,
        vy: Math.random() * -14 - 3,
        size: Math.random() * 8 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.28,
        friction: 0.985,
        opacity: 1,
        shape: Math.random() > 0.4 ? "rect" : "circle"
      });
    }

    var startTime = Date.now();
    confettiActive = true;

    function renderConfetti() {
      if (!confettiActive) return;
      ctx.clearRect(0, 0, W, H);
      var alive = 0;

      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.friction;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.005;

        if (p.opacity > 0 && p.y < H + 20) {
          alive++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;

          if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (alive > 0 && Date.now() - startTime < 7000) {
        requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, W, H);
        confettiActive = false;
      }
    }

    requestAnimationFrame(renderConfetti);
  }

  function initEvents() {
    var scrubber = document.getElementById("finaleScrubber");
    if (scrubber) {
      scrubber.addEventListener("click", function (e) {
        var btn = e.target.closest(".scrubber-dot");
        if (!btn) return;
        pauseAutoPlay();
        var step = parseInt(btn.getAttribute("data-step"), 10);
        showAgeStep(step, true);
      });
    }

    var playBtn = document.getElementById("finalePlayBtn");
    var nextBtn = document.getElementById("finaleNextBtn");
    var prevBtn = document.getElementById("finalePrevBtn");
    var celebrateBtn = document.getElementById("finaleCelebrateBtn");

    if (playBtn) playBtn.addEventListener("click", toggleAutoPlay);
    if (nextBtn) nextBtn.addEventListener("click", function () { pauseAutoPlay(); nextStep(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { pauseAutoPlay(); prevStep(); });
    if (celebrateBtn) celebrateBtn.addEventListener("click", function () { launchBirthdayCelebration(); });

    window.addEventListener("resize", function () {
      var canvas = document.getElementById("confettiCanvas");
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    });
  }

  window.GrandFinale = {
    init: function () {
      renderAgeTimelineNav();
      showAgeStep(0, false);
      initEvents();
    },
    celebrate: launchBirthdayCelebration
  };
})();
