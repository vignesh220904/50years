/* =====================================================================
   js/gift.js
   Gift Reveal Experience & Live Family Wish Guestbook
   ===================================================================== */
(function () {
  "use strict";

  var M = window.MEMORIES || {};
  var giftData = M.gift || {};

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Pre-populated default sample guestbook wishes
  var defaultWishes = [
    { name: "Suresh (Husband)", emoji: "💖", text: "Happy 50th Birthday to the light of my life! May your smile continue to shine for all the years to come.", time: "Just now" },
    { name: "Ananya & Karthik (Children)", emoji: "🌟", text: "We love you Amma! Thank you for being the world's most wonderful mother. Have the happiest 50th!", time: "Today" },
    { name: "Ramesh & Meena (Brother & Bhabhi)", emoji: "🎉", text: "Wishing our dearest sister a magnificent 50th milestone! Proud of you always!", time: "Today" },
    { name: "Diya & Aarav (Grandkids)", emoji: "🎂", text: "Happy Birthday Paati! We can't wait for cake and cuddles!", time: "Today" }
  ];

  function getStoredWishes() {
    try {
      var stored = localStorage.getItem("birthday50_wishes");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return defaultWishes.slice();
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem("birthday50_wishes", JSON.stringify(wishes));
    } catch (e) {}
  }

  function renderGuestbook() {
    var wall = document.getElementById("guestbookWall");
    if (!wall) return;

    var wishes = getStoredWishes();
    var html = "";

    wishes.forEach(function (w, idx) {
      html +=
        '<div class="wish-item-card reveal in-view" style="animation-delay: ' + (idx * 0.1) + 's">' +
          '<div class="wish-item-header">' +
            '<span class="wish-emoji">' + esc(w.emoji || "❤") + '</span>' +
            '<strong class="wish-author">' + esc(w.name) + '</strong>' +
            '<span class="wish-time">' + esc(w.time || "Recent") + '</span>' +
          '</div>' +
          '<p class="wish-text">“' + esc(w.text) + '”</p>' +
        '</div>';
    });

    wall.innerHTML = html;
  }

  function spawnGiftBurst(el) {
    if (!el) return;
    var rect = el.getBoundingClientRect();
    for (var i = 0; i < 20; i++) {
      var star = document.createElement("span");
      star.className = "floating-heart";
      star.textContent = ["✨", "🎁", "✦", "💛", "🎉"][Math.floor(Math.random() * 5)];
      star.style.left = (rect.left + rect.width / 2 + (Math.random() * 80 - 40)) + "px";
      star.style.top = (rect.top + rect.height / 2 + (Math.random() * 40 - 20)) + "px";
      star.style.setProperty("--vx", (Math.random() * 200 - 100) + "px");
      star.style.setProperty("--vy", (-Math.random() * 200 - 40) + "px");
      document.body.appendChild(star);
      setTimeout((function (s) { return function () { if (s.parentNode) s.parentNode.removeChild(s); }; })(star), 1500);
    }
  }

  function openGiftBox() {
    var box = document.getElementById("giftBox");
    var unrevealed = document.getElementById("giftUnrevealed");
    var revealed = document.getElementById("giftRevealed");

    if (box) {
      box.classList.add("opened");
      spawnGiftBurst(box);
    }

    setTimeout(function () {
      if (unrevealed) unrevealed.hidden = true;
      if (revealed) {
        revealed.hidden = false;
        revealed.classList.add("fade-in");
      }
      if (window.GrandFinale) {
        window.GrandFinale.celebrate();
      }
    }, 900);
  }

  function initGiftBox() {
    var openBtn = document.getElementById("openGiftBtn");
    var giftBox = document.getElementById("giftBox");

    if (openBtn) openBtn.addEventListener("click", openGiftBox);
    if (giftBox) giftBox.addEventListener("click", openGiftBox);
  }

  function initGuestbook() {
    var form = document.getElementById("guestbookForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameInput = document.getElementById("wishName");
      var textInput = document.getElementById("wishMessage");
      var emojiSelect = document.getElementById("wishEmoji");

      var name = (nameInput ? nameInput.value : "").trim();
      var text = (textInput ? textInput.value : "").trim();
      var emoji = emojiSelect ? emojiSelect.value : "❤";

      if (!name || !text) return;

      var wishes = getStoredWishes();
      wishes.unshift({
        name: name,
        emoji: emoji,
        text: text,
        time: "Just now"
      });

      saveWishes(wishes);
      renderGuestbook();

      if (nameInput) nameInput.value = "";
      if (textInput) textInput.value = "";

      spawnGiftBurst(form);
    });

    renderGuestbook();
  }

  window.GiftExperience = {
    init: function () {
      initGiftBox();
      initGuestbook();
    }
  };
})();
