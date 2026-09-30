/* =====================================================================
   js/ambient-audio.js
   Web Audio API Ambient Cinematic Music Generator + MP3 Controller
   Provides a soothing, emotional, cinematic piano & pad ambient soundtrack
   when MP3 is not provided, and seamlessly plays real MP3 when available.
   ===================================================================== */
(function () {
  "use strict";

  var M = window.MEMORIES || {};
  var audioCtx = null;
  var isPlaying = false;
  var mp3Audio = null;
  var synthNodes = [];
  var loopTimer = null;
  var masterGain = null;

  var btn = document.getElementById("musicToggle");

  function initWebAudio() {
    if (audioCtx) return;
    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      audioCtx = new AudioContext();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  // Emotional pentatonic / lydian chord progression for cinematic 50th birthday
  var chordProgressions = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
    [220.00, 261.63, 329.63, 392.00], // Am7   (A3, C4, E4, G4)
    [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
    [196.00, 246.94, 293.66, 392.00]  // Gsus4/G (G3, B3, D4, G4)
  ];
  var currentChordIdx = 0;

  function playAmbientChord() {
    if (!audioCtx || !isPlaying) return;
    var now = audioCtx.currentTime;
    var notes = chordProgressions[currentChordIdx % chordProgressions.length];
    currentChordIdx++;

    notes.forEach(function (freq, i) {
      // Warm synth pad
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      var filter = audioCtx.createBiquadFilter();

      osc.type = i === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq * 0.5, now); // soft warm bass note
      if (i > 0) osc.frequency.setValueAtTime(freq, now + i * 0.2);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(700, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08 / (i + 1), now + 1.2 + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 4.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(now + i * 0.15);
      osc.stop(now + 5.2);
      synthNodes.push(osc);
    });

    loopTimer = setTimeout(playAmbientChord, 3800);
  }

  function startSynthMusic() {
    initWebAudio();
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") audioCtx.resume();
    isPlaying = true;
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.65, audioCtx.currentTime + 2.0);
    playAmbientChord();
  }

  function stopSynthMusic() {
    if (loopTimer) clearTimeout(loopTimer);
    if (!audioCtx) return;
    isPlaying = false;
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
  }

  function setupMp3() {
    if (!M.music) return false;
    mp3Audio = new Audio(M.music);
    mp3Audio.loop = true;
    mp3Audio.volume = 0;
    mp3Audio.preload = "auto";
    mp3Audio.addEventListener("error", function () {
      mp3Audio = null; // fallback to Web Audio synth
    });
    return true;
  }

  var AmbientAudio = {
    init: function () {
      setupMp3();
    },
    toggle: function () {
      if (this.isOn()) {
        this.pause();
      } else {
        this.play();
      }
    },
    play: function () {
      if (btn) btn.setAttribute("aria-pressed", "true");
      isPlaying = true;
      try { localStorage.setItem("music50", "on"); } catch (e) {}

      if (mp3Audio) {
        mp3Audio.play().then(function () {
          var v = 0;
          var t = setInterval(function () {
            v += 0.05;
            if (v >= 0.6) { mp3Audio.volume = 0.6; clearInterval(t); }
            else { mp3Audio.volume = v; }
          }, 100);
        }).catch(function () {
          startSynthMusic();
        });
      } else {
        startSynthMusic();
      }
    },
    pause: function () {
      if (btn) btn.setAttribute("aria-pressed", "false");
      isPlaying = false;
      try { localStorage.setItem("music50", "off"); } catch (e) {}

      if (mp3Audio && !mp3Audio.paused) {
        var v = mp3Audio.volume;
        var t = setInterval(function () {
          v -= 0.08;
          if (v <= 0) { mp3Audio.pause(); clearInterval(t); }
          else { mp3Audio.volume = v; }
        }, 80);
      }
      stopSynthMusic();
    },
    isOn: function () {
      return isPlaying;
    },
    duck: function () {
      if (mp3Audio && isPlaying) mp3Audio.volume = 0.12;
      if (audioCtx && isPlaying) masterGain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    },
    restore: function () {
      if (mp3Audio && isPlaying) mp3Audio.volume = 0.6;
      if (audioCtx && isPlaying) masterGain.gain.setValueAtTime(0.65, audioCtx.currentTime);
    }
  };

  if (btn) {
    btn.addEventListener("click", function () {
      AmbientAudio.toggle();
    });
  }

  window.AmbientAudio = AmbientAudio;
})();
