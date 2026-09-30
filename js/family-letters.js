/* =====================================================================
   js/family-letters.js
   What She Means to the Family: Letters from Loved Ones
   ===================================================================== */
(function () {
  "use strict";

  var M = window.MEMORIES || {};
  var letters = M.letters || [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderFamilyLetters() {
    var navWrap = document.getElementById("lettersNav");
    var contentWrap = document.getElementById("lettersContent");
    if (!navWrap || !contentWrap || !letters.length) return;

    var navHtml = "";
    var contentHtml = "";

    letters.forEach(function (lt, idx) {
      var activeClass = idx === 0 ? "active" : "";
      navHtml +=
        '<button class="letter-tab-btn ' + activeClass + '" data-letter-id="' + esc(lt.id) + '" role="tab" aria-selected="' + (idx === 0 ? "true" : "false") + '">' +
          '<span class="tab-seal">' + esc(lt.seal || "❤") + '</span>' +
          '<span class="tab-info">' +
            '<strong class="tab-sender">' + esc(lt.sender) + '</strong>' +
            '<small class="tab-relation">' + esc(lt.relation) + '</small>' +
          '</span>' +
        '</button>';

      var paragraphs = (lt.content || []).map(function (p) {
        return '<p class="letter-para">' + esc(p) + '</p>';
      }).join("");

      contentHtml +=
        '<article class="letter-card ' + (idx === 0 ? "active" : "") + '" id="letter-' + esc(lt.id) + '" data-letter-id="' + esc(lt.id) + '" role="tabpanel">' +
          '<div class="letter-inner">' +
            '<div class="letter-header">' +
              '<div class="letter-stamp">' +
                '<span class="stamp-border"></span>' +
                '<span class="stamp-icon">' + esc(lt.seal || "❤") + '</span>' +
                '<span class="stamp-text">50th Gold</span>' +
              '</div>' +
              '<div class="letter-meta">' +
                '<span class="letter-badge">' + esc(lt.badge || "With All My Love") + '</span>' +
                '<h3 class="letter-sender-title">' + esc(lt.tagline || lt.sender) + '</h3>' +
              '</div>' +
            '</div>' +
            '<div class="letter-divider"><i></i><b>❤</b><i></i></div>' +
            '<div class="letter-body">' + paragraphs + '</div>' +
            '<div class="letter-footer">' +
              '<span class="letter-sign-label">Signed with love:</span>' +
              '<p class="letter-signature">' + esc(lt.signature || lt.sender) + '</p>' +
            '</div>' +
          '</div>' +
        '</article>';
    });

    navWrap.innerHTML = navHtml;
    contentWrap.innerHTML = contentHtml;

    // Click handler for tab switching with animation
    navWrap.addEventListener("click", function (e) {
      var btn = e.target.closest(".letter-tab-btn");
      if (!btn) return;
      var letterId = btn.getAttribute("data-letter-id");

      navWrap.querySelectorAll(".letter-tab-btn").forEach(function (b) {
        var isTarget = b === btn;
        b.classList.toggle("active", isTarget);
        b.setAttribute("aria-selected", isTarget ? "true" : "false");
      });

      contentWrap.querySelectorAll(".letter-card").forEach(function (card) {
        var isTarget = card.getAttribute("data-letter-id") === letterId;
        card.classList.toggle("active", isTarget);
        if (isTarget) {
          card.style.animation = "none";
          void card.offsetWidth; // trigger reflow
          card.style.animation = "letterFadeIn 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) forwards";
        }
      });
    });
  }

  window.FamilyLetters = {
    init: function () {
      renderFamilyLetters();
    }
  };
})();
