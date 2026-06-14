/* ============================================================
   SCENE.JS — Three.js 3D Scroll-Reactive Universe
   Suppu's Tiny Universe
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('three-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.set(0, 0, 30);

  // ---- SCROLL PROGRESS ----
  let scrollProgress = 0;
  let targetScroll = 0;

  // ---- GROUPS ----
  const starGroup    = new THREE.Group();
  const yarnGroup    = new THREE.Group();
  const floatGroup   = new THREE.Group();
  const tunnelGroup  = new THREE.Group();
  const finalGroup   = new THREE.Group();

  scene.add(starGroup, yarnGroup, floatGroup, tunnelGroup, finalGroup);

  // ---- COLOR PALETTE ----
  const YARN       = new THREE.Color(0xf9a8c9);
  const GOLD       = new THREE.Color(0xf0c97a);
  const CREAM      = new THREE.Color(0xfdf4e3);
  const BLOSSOM    = new THREE.Color(0xffd6e8);
  const DEEP_BLUE  = new THREE.Color(0x1a2a6c);

  // ===========================
  // 1. STAR FIELD (scattered 3D stars)
  // ===========================
  const starCount = 600;
  const starGeo   = new THREE.BufferGeometry();
  const starPos   = new Float32Array(starCount * 3);
  const starCol   = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    starPos[i3]     = (Math.random() - 0.5) * 200;
    starPos[i3 + 1] = (Math.random() - 0.5) * 120;
    starPos[i3 + 2] = (Math.random() - 0.5) * 100;

    const c = Math.random() > 0.6 ? YARN : (Math.random() > 0.5 ? GOLD : CREAM);
    starCol[i3]     = c.r;
    starCol[i3 + 1] = c.g;
    starCol[i3 + 2] = c.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color',    new THREE.BufferAttribute(starCol, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  });

  const starMesh = new THREE.Points(starGeo, starMat);
  starGroup.add(starMesh);

  // ===========================
  // 2. FLOATING ORB PARTICLES
  //    (bigger glowing dots, scattered near camera)
  // ===========================
  function makeOrb(color, size, x, y, z) {
    const geo = new THREE.SphereGeometry(size, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.userData.baseY = y;
    mesh.userData.speed = 0.4 + Math.random() * 0.8;
    mesh.userData.phase = Math.random() * Math.PI * 2;
    return mesh;
  }

  const orbColors  = [0xf9a8c9, 0xf0c97a, 0xffd6e8, 0xffffff, 0xe87aaa];
  const orbData    = [];

  for (let i = 0; i < 40; i++) {
    const color = orbColors[Math.floor(Math.random() * orbColors.length)];
    const size  = 0.1 + Math.random() * 0.4;
    const x     = (Math.random() - 0.5) * 60;
    const y     = (Math.random() - 0.5) * 40;
    const z     = (Math.random() - 0.5) * 30;
    const orb   = makeOrb(color, size, x, y, z);
    floatGroup.add(orb);
    orbData.push(orb);
  }

  // ===========================
  // 3. YARN THREAD (tube through 3D space)
  //    — the iconic pink thread that winds through the scene
  // ===========================
  function buildYarnThread() {
    const points = [];
    const segments = 80;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = Math.sin(t * Math.PI * 4) * 12;
      const y = 20 - t * 80;           // travels downward with scroll
      const z = Math.cos(t * Math.PI * 3) * 8;
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 120, 0.06, 6, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0xf9a8c9, transparent: true, opacity: 0.85 });
    const tube    = new THREE.Mesh(tubeGeo, tubeMat);
    yarnGroup.add(tube);
    return tube;
  }

  const yarnThread = buildYarnThread();

  // ===========================
  // 4. FLOWER PETALS (act 2 & 4)
  // ===========================
  function makePetal(color, x, y, z) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.3, 0.5, 0.6, 0.6, 0, 1.2);
    shape.bezierCurveTo(-0.6, 0.6, -0.3, 0.5, 0, 0);

    const geo = new THREE.ShapeGeometry(shape);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.userData.baseY    = y;
    mesh.userData.rotSpeed = (Math.random() - 0.5) * 0.02;
    mesh.userData.floatSpd = 0.3 + Math.random() * 0.5;
    mesh.userData.phase    = Math.random() * Math.PI * 2;
    mesh.scale.setScalar(0.6 + Math.random() * 0.8);
    return mesh;
  }

  const petalColors  = [0xf9a8c9, 0xffd6e8, 0xffffff, 0xffc0d8];
  const petals       = [];

  for (let i = 0; i < 60; i++) {
    const color = petalColors[Math.floor(Math.random() * petalColors.length)];
    const x     = (Math.random() - 0.5) * 50;
    const y     = -10 + Math.random() * -80;   // scattered along scroll path
    const z     = -5 + Math.random() * 10;
    const petal = makePetal(color, x, y, z);
    scene.add(petal);
    petals.push(petal);
  }

  // ===========================
  // 5. CONSTELLATION LINES (act 4)
  // ===========================
  function makeConstellation(offsetY) {
    const points = [
      [0, 0, 0], [3, 4, -2], [6, 1, -1], [4, -3, 0], [1, -1, 1],
      [3, 4, -2], [7, 6, -3], [5, 8, -2]
    ].map(([x, y, z]) => new THREE.Vector3(x + (Math.random()-0.5)*2, y + offsetY, z));

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: 0xf9a8c9, transparent: true, opacity: 0.3 });
    const line = new THREE.Line(geo, mat);
    line.position.set(-8, 0, -10);
    return line;
  }

  const constellation1 = makeConstellation(-50);
  const constellation2 = makeConstellation(-100);
  scene.add(constellation1, constellation2);

  // Small constellation stars
  const constStarGeo = new THREE.BufferGeometry();
  const csPos = new Float32Array([
    -5, -50, -10,  -2, -46, -10,  1, -49, -10,  3, -53, -10,  -4, -55, -10,
    -6, -100, -8,  -3, -95, -8,   0, -98, -8,   4, -102, -8,  2, -96, -8,
  ]);
  constStarGeo.setAttribute('position', new THREE.BufferAttribute(csPos, 3));
  const csmat = new THREE.PointsMaterial({ color: 0xf0c97a, size: 0.5, transparent: true, opacity: 0.9 });
  scene.add(new THREE.Points(constStarGeo, csmat));

  // ===========================
  // 6. TUNNEL RINGS (scroll through space feel)
  // ===========================
  function makeRing(y, radius, color, opacity) {
    const geo = new THREE.RingGeometry(radius - 0.05, radius + 0.05, 64);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI / 2.2;
    mesh.position.set(0, y, -8);
    return mesh;
  }

  const ringCount  = 30;
  const rings      = [];
  for (let i = 0; i < ringCount; i++) {
    const y      = -i * 7;
    const radius = 4 + Math.random() * 8;
    const color  = i % 2 === 0 ? 0xf9a8c9 : 0xf0c97a;
    const ring   = makeRing(y, radius, color, 0.08 + Math.random() * 0.1);
    tunnelGroup.add(ring);
    rings.push(ring);
  }

  // ===========================
  // 7. FINALE BURST (act 6)
  // ===========================
  const burstGeo = new THREE.BufferGeometry();
  const burstPos = new Float32Array(300 * 3);
  const burstCol = new Float32Array(300 * 3);

  for (let i = 0; i < 300; i++) {
    const i3  = i * 3;
    const phi = Math.random() * Math.PI * 2;
    const r   = 5 + Math.random() * 20;
    burstPos[i3]     = Math.cos(phi) * r;
    burstPos[i3 + 1] = (Math.random() - 0.5) * 20 - 130;
    burstPos[i3 + 2] = Math.sin(phi) * r;
    const c  = Math.random() > 0.5 ? YARN : GOLD;
    burstCol[i3]     = c.r;
    burstCol[i3 + 1] = c.g;
    burstCol[i3 + 2] = c.b;
  }

  burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPos, 3));
  burstGeo.setAttribute('color',    new THREE.BufferAttribute(burstCol, 3));

  const burstMat  = new THREE.PointsMaterial({ size: 0.5, vertexColors: true, transparent: true, opacity: 0 });
  const burstMesh = new THREE.Points(burstGeo, burstMat);
  finalGroup.add(burstMesh);

  // ===========================
  // SCROLL — map document scroll to camera Z travel
  // ===========================
  function getScrollProgress() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    return total > 0 ? window.scrollY / total : 0;
  }

  window.addEventListener('scroll', () => {
    targetScroll = getScrollProgress();
  }, { passive: true });

  // ===========================
  // MOUSE PARALLAX
  // ===========================
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  document.addEventListener('mousemove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ===========================
  // RESIZE
  // ===========================
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ===========================
  // ANIMATE
  // ===========================
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Smooth scroll lerp
    scrollProgress += (targetScroll - scrollProgress) * 0.06;

    // Mouse parallax lerp
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    // ---- CAMERA ----
    // Travel "down" through the universe as you scroll
    const camY  = -scrollProgress * 140;  // total vertical travel
    camera.position.y = camY;
    camera.position.x = mouse.x * 2.5;
    camera.position.z = 28 - scrollProgress * 6 + Math.sin(elapsed * 0.2) * 0.5;

    // Subtle camera roll
    camera.rotation.z = mouse.x * 0.03;

    // ---- STARS ----
    starMesh.rotation.y = elapsed * 0.012;
    starMesh.rotation.x = elapsed * 0.006;
    starMat.opacity = 0.6 + Math.sin(elapsed * 0.5) * 0.15;

    // ---- YARN THREAD ----
    yarnGroup.position.y = camY * 0.4;
    yarnThread.rotation.y = elapsed * 0.05;

    // ---- FLOATING ORBS ----
    orbData.forEach((orb) => {
      orb.position.y = orb.userData.baseY + Math.sin(elapsed * orb.userData.speed + orb.userData.phase) * 2;
      orb.position.x += Math.sin(elapsed * 0.3 + orb.userData.phase) * 0.005;
      orb.material.opacity = 0.3 + Math.sin(elapsed * orb.userData.speed + orb.userData.phase) * 0.25;
    });

    // ---- PETALS ----
    petals.forEach((petal) => {
      petal.rotation.z += petal.userData.rotSpeed;
      petal.position.y  = petal.userData.baseY + Math.sin(elapsed * petal.userData.floatSpd + petal.userData.phase) * 1.5;
    });

    // ---- RINGS (tunnel) ----
    rings.forEach((ring, i) => {
      ring.rotation.z = elapsed * 0.08 + i * 0.1;
      ring.material.opacity = 0.05 + Math.sin(elapsed * 0.5 + i * 0.3) * 0.06;
    });

    // ---- CONSTELLATIONS ----
    constellation1.rotation.y = elapsed * 0.015;
    constellation2.rotation.y = elapsed * 0.01 + 1;

    // ---- BURST (finale - appears near end of scroll) ----
    const finaleStart = 0.82;
    if (scrollProgress > finaleStart) {
      const t = (scrollProgress - finaleStart) / (1 - finaleStart);
      burstMat.opacity = Math.min(t * 1.5, 0.9);
      burstMesh.rotation.y = elapsed * 0.2;
      burstGeo.attributes.position.array.forEach((_, idx) => {
        if (idx % 3 === 1) {
          burstGeo.attributes.position.array[idx] += Math.sin(elapsed + idx) * 0.001;
        }
      });
      burstGeo.attributes.position.needsUpdate = true;
    } else {
      burstMat.opacity *= 0.95;
    }

    // ---- STAR FIELD parallax ----
    starGroup.position.y = camY * 0.2;
    starGroup.position.x = mouse.x * -1;

    renderer.render(scene, camera);
  }

  animate();

  // Expose scroll progress for other scripts
  window.getSceneScrollProgress = () => scrollProgress;

})();
