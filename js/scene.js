/* =====================================================================
   scene.js : the 3D world (Three.js)
   - Opening: gold particles assemble into a glowing "50" with orbiting halos
   - Journey: you fly through a tunnel of gold dust, hearts, rings & pearls
   ===================================================================== */
(function () {
  "use strict";

  // Safe no-op API (used if WebGL is unavailable: the site falls back to 2D)
  var stub = { ok: false, assemble: function () {}, enterJourney: function () {}, startJourney: function () {}, setMood: function () {} };
  window.Scene = stub;

  var THREE = window.THREE;
  var canvas = document.getElementById("gl");
  if (!THREE || !canvas) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobile = window.innerWidth < 720 || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: !mobile, alpha: true, powerPreference: "high-performance" });
    if (!renderer.getContext()) throw new Error("no webgl");
  } catch (e) { return; }

  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = THREE.sRGBEncoding;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
  var CAM0 = 6;
  camera.position.set(0, 0, CAM0);
  scene.add(camera);

  var shared = { uTime: { value: 0 }, uPx: { value: 1 } };
  var mode = "opening";                       // opening | leaving | journey
  var time = 0;
  var pt = { x: 0, y: 0 }, pm = { x: 0, y: 0 };   // pointer target / smoothed

  /* ---------- Lights ---------- */
  scene.add(new THREE.AmbientLight(0xffe8c8, 0.4));
  var key = new THREE.DirectionalLight(0xfff0d0, 1.4);
  key.position.set(3, 4, 5);
  scene.add(key);
  var rim = new THREE.PointLight(0xd9a5a0, 2.2, 40);
  rim.position.set(-2, 1, 2);
  camera.add(rim);

  /* ---------- Fake studio environment so the gold actually reflects ---------- */
  function makeEnv() {
    var c = document.createElement("canvas");
    c.width = 512; c.height = 256;
    var g = c.getContext("2d");
    var grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#e9d2ae");
    grad.addColorStop(0.42, "#fff1c8");
    grad.addColorStop(0.55, "#d3a565");
    grad.addColorStop(1, "#7a5540");
    g.fillStyle = grad; g.fillRect(0, 0, 512, 256);
    try { g.filter = "blur(5px)"; } catch (e) {}
    g.fillStyle = "rgba(255,232,170,.9)";
    [[50, 30, 70, 100], [210, 14, 100, 60], [370, 40, 60, 120], [460, 26, 40, 80]].forEach(function (b) { g.fillRect(b[0], b[1], b[2], b[3]); });
    g.fillStyle = "rgba(217,165,160,.75)"; g.fillRect(130, 110, 70, 70);
    var t = new THREE.CanvasTexture(c);
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.encoding = THREE.sRGBEncoding;
    return t;
  }
  var env = makeEnv();

  /* ---------- Ambient gold dust (flown through during the journey) ---------- */
  var tint = new THREE.Color(1.0, 0.88, 0.55), tintTarget = tint.clone();
  var dustUniforms = { uTime: shared.uTime, uPx: shared.uPx, uTint: { value: tint } };
  (function buildDust() {
    var n = mobile ? 450 : 1100, pos = new Float32Array(n * 3), size = new Float32Array(n), rnd = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = 14 - Math.random() * 84;
      size[i] = Math.random() < 0.06 ? 4 + Math.random() * 4 : 0.5 + Math.random() * 1.7;
      rnd[i] = Math.random();
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));
    var m = new THREE.ShaderMaterial({
      uniforms: dustUniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: [
        "attribute float aSize; attribute float aRand; uniform float uTime; uniform float uPx;",
        "varying float vA;",
        "void main(){",
        "  vec3 p = position;",
        "  p.x += sin(uTime*.2 + aRand*40.)*.4;",
        "  p.y += cos(uTime*.25 + aRand*30.)*.3;",
        "  vec4 mv = modelViewMatrix * vec4(p,1.);",
        "  gl_Position = projectionMatrix * mv;",
        "  float d = -mv.z;",
        "  gl_PointSize = min(aSize * uPx * (22. / max(d,.5)), 34.*uPx);",
        "  float near = smoothstep(.6, 3., d);",
        "  float far = 1. - smoothstep(30., 62., d);",
        "  float bokeh = mix(1., .28, smoothstep(3., 6., aSize));",
        "  vA = near * far * bokeh * (.55 + .45*sin(uTime*1.3 + aRand*60.));",
        "}"
      ].join("\n"),
      fragmentShader: [
        "precision mediump float; varying float vA; uniform vec3 uTint;",
        "void main(){",
        "  float r = length(gl_PointCoord - .5);",
        "  if(r > .5) discard;",
        "  float a = smoothstep(.5, .0, r);",
        "  vec3 col = mix(vec3(1., .92, .7), uTint, .5);",
        "  gl_FragColor = vec4(col, a * a * vA);",
        "}"
      ].join("\n")
    });
    var pts = new THREE.Points(g, m);
    pts.frustumCulled = false;
    scene.add(pts);
  })();

  /* ---------- Opening: particles that assemble into "50" + orbiting halos ---------- */
  var opening = new THREE.Group();
  scene.add(opening);
  var mat50 = null, halo1, halo2, haloMat;
  var prog = 0, progTarget = 0, progRate = 1 / 3.6;

  function build50() {
    var W = 640, H = 320;
    var cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    var cx = cv.getContext("2d");
    cx.fillStyle = "#fff"; cx.textAlign = "center"; cx.textBaseline = "middle";
    cx.font = '700 290px "Playfair Display", Georgia, serif';
    cx.fillText("50", W / 2, H / 2 + 10);
    var d = cx.getImageData(0, 0, W, H).data;
    var step = mobile ? 3 : 2, list = [];
    var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    for (var y = 0; y < H; y += step) {
      for (var x = 0; x < W; x += step) {
        if (d[(y * W + x) * 4 + 3] > 140) {
          var jx = x + (Math.random() - 0.5) * step, jy = y + (Math.random() - 0.5) * step;
          list.push(jx, jy);
          if (jx < minX) minX = jx; if (jx > maxX) maxX = jx;
          if (jy < minY) minY = jy; if (jy > maxY) maxY = jy;
        }
      }
    }
    var n = list.length / 2;
    if (!n) return;
    var s = 1 / (maxY - minY), mx = (minX + maxX) / 2, my = (minY + maxY) / 2;
    var target = new Float32Array(n * 3), start = new Float32Array(n * 3);
    var delay = new Float32Array(n), size = new Float32Array(n), rnd = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      var tx = (list[i * 2] - mx) * s, ty = -(list[i * 2 + 1] - my) * s;
      target[i * 3] = tx; target[i * 3 + 1] = ty; target[i * 3 + 2] = (Math.random() - 0.5) * 0.16;
      var th = Math.random() * 6.2832, ph = Math.acos(2 * Math.random() - 1), r = 3 + Math.random() * 7;
      start[i * 3] = r * Math.sin(ph) * Math.cos(th);
      start[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      start[i * 3 + 2] = r * Math.cos(ph) + 2;
      delay[i] = Math.min(1, Math.max(0, (tx + 0.8) / 1.6 * 0.6 + Math.random() * 0.4));
      size[i] = 0.55 + Math.random() * 0.9;
      rnd[i] = Math.random();
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(target, 3));
    g.setAttribute("aStart", new THREE.BufferAttribute(start, 3));
    g.setAttribute("aDelay", new THREE.BufferAttribute(delay, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));
    mat50 = new THREE.ShaderMaterial({
      uniforms: { uProg: { value: 0 }, uTime: shared.uTime, uPx: shared.uPx, uSize: { value: mobile ? 1.0 : 0.8 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: [
        "attribute vec3 aStart; attribute float aDelay; attribute float aSize; attribute float aRand;",
        "uniform float uProg; uniform float uTime; uniform float uPx; uniform float uSize;",
        "varying float vA; varying float vTone;",
        "void main(){",
        "  float t = clamp((uProg - aDelay*.55)/.45, 0., 1.);",
        "  float e = t*t*(3.-2.*t);",
        "  vec3 p = mix(aStart, position, e);",
        "  p += vec3(sin(uTime*.8+aRand*30.), cos(uTime*.7+aRand*20.), sin(uTime*.6+aRand*10.)) * .014 * e;",
        "  vec4 mv = modelViewMatrix * vec4(p,1.);",
        "  gl_Position = projectionMatrix * mv;",
        "  gl_PointSize = aSize * uSize * uPx * (24. / max(-mv.z,.5)) * (.7 + .5*e);",
        "  vTone = aRand;",
        "  vA = (.25 + .75*e) * (.75 + .25*sin(uTime*2. + aRand*50.));",
        "}"
      ].join("\n"),
      fragmentShader: [
        "precision mediump float; varying float vA; varying float vTone;",
        "void main(){",
        "  float r = length(gl_PointCoord - .5);",
        "  if(r > .5) discard;",
        "  float a = smoothstep(.5, .0, r);",
        "  vec3 col = mix(vec3(.78,.58,.26), vec3(1.,.93,.66), vTone);",
        "  gl_FragColor = vec4(col, a * vA);",
        "}"
      ].join("\n")
    });
    var p = new THREE.Points(g, mat50);
    p.frustumCulled = false;
    opening.add(p);

    haloMat = new THREE.MeshBasicMaterial({ color: 0xe9d7a6, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    halo1 = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.004, 8, 220), haloMat);
    halo2 = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.003, 8, 220), haloMat);
    opening.add(halo1); opening.add(halo2);
    var bead = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), new THREE.MeshBasicMaterial({ color: 0xfff0c8 }));
    bead.position.set(1.05, 0, 0); halo1.add(bead);
    var bead2 = bead.clone(); bead2.position.set(-1.25, 0, 0); halo2.add(bead2);
  }

  function layoutOpening() {
    var el = document.querySelector(".fifty");
    if (!el) return;
    var r = el.getBoundingClientRect();
    if (!r.height) return;
    var vw = window.innerWidth, vh = window.innerHeight;
    var visH = 2 * Math.tan(camera.fov * Math.PI / 360) * CAM0;
    var upp = visH / vh;
    opening.position.set((r.left + r.width / 2 - vw / 2) * upp, -(r.top + r.height / 2 - vh / 2) * upp, 0);
    opening.scale.setScalar(r.height * upp * 0.8);
  }

  /* ---------- Journey objects: gold hearts, rings and pearls ---------- */
  var objects = new THREE.Group();
  objects.visible = false;
  scene.add(objects);
  var floaters = [];

  function heartGeometry() {
    var s = new THREE.Shape();
    s.moveTo(0.25, 0.25);
    s.bezierCurveTo(0.25, 0.25, 0.20, 0, 0, 0);
    s.bezierCurveTo(-0.30, 0, -0.30, 0.35, -0.30, 0.35);
    s.bezierCurveTo(-0.30, 0.55, -0.10, 0.77, 0.25, 0.95);
    s.bezierCurveTo(0.60, 0.77, 0.80, 0.55, 0.80, 0.35);
    s.bezierCurveTo(0.80, 0.35, 0.80, 0, 0.50, 0);
    s.bezierCurveTo(0.35, 0, 0.25, 0.25, 0.25, 0.25);
    var g = new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.06, bevelSegments: 6, curveSegments: 28 });
    g.center();
    g.rotateZ(Math.PI);      // point the tip downwards
    return g;
  }

  (function buildObjects() {
    var goldMat = new THREE.MeshStandardMaterial({ color: 0xf0c25a, metalness: 1, roughness: 0.2, envMap: env, envMapIntensity: 1.5, emissive: 0x4a2c08, emissiveIntensity: 0.3 });
    var roseMat = new THREE.MeshStandardMaterial({ color: 0xf0a89c, metalness: 1, roughness: 0.24, envMap: env, envMapIntensity: 1.5, emissive: 0x4a1f1c, emissiveIntensity: 0.3 });
    var pearlMat = new THREE.MeshStandardMaterial({ color: 0xfaf3e6, metalness: 0.4, roughness: 0.18, envMap: env, envMapIntensity: 1.4 });
    var heartG = heartGeometry(), ringG = new THREE.TorusGeometry(0.5, 0.055, 24, 90), pearlG = new THREE.SphereGeometry(0.26, 32, 32);
    var order = ["heart", "ring", "pearl", "heart", "ring", "heart", "pearl", "ring", "heart", "pearl", "heart", "ring"];
    order.forEach(function (type, i) {
      var mesh;
      if (type === "heart") mesh = new THREE.Mesh(heartG, i % 2 ? roseMat : goldMat);
      else if (type === "ring") mesh = new THREE.Mesh(ringG, goldMat);
      else mesh = new THREE.Mesh(pearlG, pearlMat);
      var sc = type === "heart" ? 0.62 + Math.random() * 0.35 : 0.6 + Math.random() * 0.5;
      mesh.scale.setScalar(sc);
      var side = i % 2 ? 1 : -1;
      var f = {
        mesh: mesh, baseX: side * (3.0 + Math.random() * 1.6), y: (Math.random() - 0.5) * 3.4,
        z: -3 - i * 4.8, spin: 0.35 + Math.random() * 0.5, ph: Math.random() * 6.28
      };
      mesh.position.set(f.baseX, f.y, f.z);
      mesh.rotation.set(Math.random(), Math.random() * 3, Math.random());
      objects.add(mesh);
      floaters.push(f);
    });
  })();

  /* ---------- Sizing ---------- */
  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    shared.uPx.value = renderer.getPixelRatio();
    var xf = Math.max(0.34, Math.min(1, camera.aspect / 1.7));
    floaters.forEach(function (f) { f.mesh.position.x = f.baseX * xf; });
  }
  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    pt.x = e.clientX / window.innerWidth * 2 - 1;
    pt.y = e.clientY / window.innerHeight * 2 - 1;
  }, { passive: true });

  var moods = { rose: [1.0, 0.72, 0.68], plum: [0.78, 0.64, 1.0], gold: [1.0, 0.88, 0.55] };

  /* ---------- Frame loop ---------- */
  var last = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (reduce) dt *= 0.2;
    time += dt;
    shared.uTime.value = time;

    var k = 1 - Math.exp(-dt * 4);
    pm.x += (pt.x - pm.x) * k;
    pm.y += (pt.y - pm.y) * k;

    tint.r += (tintTarget.r - tint.r) * k * 0.5;
    tint.g += (tintTarget.g - tint.g) * k * 0.5;
    tint.b += (tintTarget.b - tint.b) * k * 0.5;

    var diff = progTarget - prog, stp = progRate * dt;
    prog += Math.abs(diff) <= stp ? diff : (diff > 0 ? stp : -stp);

    if (mat50) {
      mat50.uniforms.uProg.value = prog;
      opening.visible = mode !== "journey" && prog > 0.001;
      if (opening.visible) {
        layoutOpening();
        opening.rotation.y = pm.x * 0.35 + Math.sin(time * 0.35) * 0.12;
        opening.rotation.x = -pm.y * 0.18;
        halo1.rotation.set(1.15 + Math.sin(time * 0.5) * 0.12, 0.2, halo1.rotation.z + dt * 0.35);
        halo2.rotation.set(0.35, 1.2 + Math.cos(time * 0.4) * 0.12, halo2.rotation.z - dt * 0.28);
        var pe = Math.max(0, Math.min(1, (prog - 0.55) / 0.45));
        haloMat.opacity = 0.5 * pe * pe * (3 - 2 * pe);
      }
    }

    if (mode === "journey") {
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var p = Math.min(1, Math.max(0, window.scrollY / max));
      var tz = CAM0 - p * 58;
      var kc = 1 - Math.exp(-dt * 2.4);
      camera.position.z += (tz - camera.position.z) * kc;
      camera.position.x += (pm.x * 0.6 - camera.position.x) * kc;
      camera.position.y += (-pm.y * 0.35 - camera.position.y) * kc;
      camera.lookAt(camera.position.x * 0.4, camera.position.y * 0.4, camera.position.z - 10);
      for (var i = 0; i < floaters.length; i++) {
        var f = floaters[i];
        f.mesh.rotation.y += dt * f.spin;
        f.mesh.rotation.x = Math.sin(time * 0.6 + f.ph) * 0.35;
        f.mesh.position.y = f.y + Math.sin(time * 0.5 + f.ph) * 0.25;
      }
    }
    renderer.render(scene, camera);
  }

  build50();
  requestAnimationFrame(frame);
  document.body.classList.add("gl");

  /* ---------- Public API ---------- */
  window.Scene = {
    ok: true,
    assemble: function (fast) {
      progTarget = 1;
      progRate = fast ? 1 / 1.1 : 1 / 3.6;
      if (reduce) prog = 1;
    },
    enterJourney: function () {          // opening dissolves outwards
      mode = "leaving";
      progTarget = 0; progRate = 1 / 1.3;
    },
    startJourney: function () {          // fly in
      mode = "journey";
      opening.visible = false;
      objects.visible = true;
      camera.position.set(0, 0, reduce ? CAM0 : 14);
      setMood("plum");
    },
    setMood: setMood
  };

  function setMood(name) {
    var m = moods[name] || moods.gold;
    tintTarget.setRGB(m[0], m[1], m[2]);
  }
})();
