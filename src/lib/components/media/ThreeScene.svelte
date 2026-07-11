<script>
  import { onMount, onDestroy } from 'svelte';

  // spec: { kind:'atom'|'molecule'|'lattice', ... } — see boardMedia.js
  export let spec;

  let container;
  let loading = true;
  let failed = false;
  let cleanup = () => {};

  const reduceMotion = typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // CPK-ish element colours + relative radii.
  const ELEMENTS = {
    H:  { color: 0xeef0f4, radius: 0.32 },
    C:  { color: 0x36363f, radius: 0.62 },
    N:  { color: 0x4f6bed, radius: 0.58 },
    O:  { color: 0xe5484d, radius: 0.56 },
    Na: { color: 0x9a6ce0, radius: 0.55 },
    Cl: { color: 0x69e037, radius: 0.80 }
  };
  const el = (s) => ELEMENTS[s] || { color: 0x9aa0ff, radius: 0.5 };

  $: label = spec?.kind === 'molecule' ? spec.formula
    : spec?.kind === 'atom' ? spec.symbol
    : spec?.kind === 'lattice' ? `${spec.a}${spec.b}`
    : spec?.kind === 'nucleus' ? (spec.label || 'nucleus')
    : spec?.kind === 'electric-attraction' ? (spec.label || 'electrical attraction')
    : spec?.kind === 'isotopes' ? (spec.label || 'same protons, different neutrons')
    : spec?.kind === 'ai-pipeline' ? (spec.label || 'text -> bits -> vectors')
    : spec?.kind === 'unit-circle' ? (spec.label || 'cos theta, sin theta')
    : spec?.kind === 'ray-optics' ? (spec.label || 'light bends at a boundary') : '';

  // Unit bond directions for each VSEPR geometry.
  function shapeDirs(shape) {
    const d2r = Math.PI / 180;
    if (shape === 'linear') return [[0, 1, 0], [0, -1, 0]];
    if (shape === 'bent') {
      const h = (104.5 / 2) * d2r;
      return [[Math.sin(h), -Math.cos(h), 0], [-Math.sin(h), -Math.cos(h), 0]];
    }
    if (shape === 'trigonal') {
      return [0, 1, 2].map(i => { const a = i * 120 * d2r; return [Math.cos(a), 0, Math.sin(a)]; });
    }
    if (shape === 'pyramidal') {
      const b = 70 * d2r; // polar angle from -Y; ~107° between bonds
      return [0, 1, 2].map(i => {
        const a = i * 120 * d2r;
        return [Math.sin(b) * Math.cos(a), -Math.cos(b), Math.sin(b) * Math.sin(a)];
      });
    }
    // tetrahedral
    const n = Math.sqrt(3);
    return [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(v => [v[0] / n, v[1] / n, v[2] / n]);
  }

  function sphere(THREE, r, color) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(r, 32, 24),
      new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.05 })
    );
  }

  function makeLabel(THREE, text, opts = {}) {
    const width = opts.width || 512;
    const height = opts.height || 160;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const r = 30;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(width - r, 0);
    ctx.quadraticCurveTo(width, 0, width, r);
    ctx.lineTo(width, height - r);
    ctx.quadraticCurveTo(width, height, width - r, height);
    ctx.lineTo(r, height);
    ctx.quadraticCurveTo(0, height, 0, height - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fillStyle = opts.bg || 'rgba(14, 13, 18, 0.88)';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = opts.border || 'rgba(238, 147, 98, 0.72)';
    ctx.stroke();
    ctx.fillStyle = opts.fg || '#f6efe4';
    ctx.font = `800 ${opts.size || 42}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
    const scale = opts.scale || [1.35, 0.42, 1];
    sprite.scale.set(scale[0], scale[1], scale[2]);
    return sprite;
  }

  function bond(THREE, a, b) {
    const dir = new THREE.Vector3().subVectors(b, a);
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.085, dir.length(), 16),
      new THREE.MeshStandardMaterial({ color: 0xb9bdd4, roughness: 0.5 })
    );
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return mesh;
  }

  function buildMolecule(THREE, group) {
    const len = 1.5;
    const c = el(spec.center);
    group.add(sphere(THREE, c.radius, c.color));
    const lg = el(spec.ligand);
    for (const d of shapeDirs(spec.shape)) {
      const v = new THREE.Vector3(d[0], d[1], d[2]).multiplyScalar(len);
      const m = sphere(THREE, lg.radius, lg.color);
      m.position.copy(v);
      group.add(m);
      group.add(bond(THREE, new THREE.Vector3(0, 0, 0), v));
    }
    return len + Math.max(c.radius, lg.radius) + 0.4;
  }

  function buildAtom(THREE, group) {
    group.add(sphere(THREE, 0.45, 0xff79ac)); // nucleus
    const shells = spec.shells || [2, 8, 8];
    let maxR = 1;
    shells.forEach((count, si) => {
      const r = 1.3 + si * 1.05;
      maxR = r;
      group.add(new THREE.Mesh(
        new THREE.SphereGeometry(r, 24, 18),
        new THREE.MeshBasicMaterial({ color: 0x6f76a8, transparent: true, opacity: 0.07, wireframe: true })
      ));
      for (let k = 0; k < count; k++) {
        const y = 1 - ((k + 0.5) / count) * 2;
        const rad = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = Math.PI * (1 + Math.sqrt(5)) * k;
        const e = sphere(THREE, 0.13, 0x454ade);
        e.position.set(Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r);
        group.add(e);
      }
    });
    return maxR + 0.6;
  }

  function buildLattice(THREE, group) {
    const size = spec.size || 3;
    const sp = 1.25;
    const ra = el(spec.a), rb = el(spec.b);
    const off = (size - 1) / 2;
    for (let i = 0; i < size; i++)
      for (let j = 0; j < size; j++)
        for (let k = 0; k < size; k++) {
          const isA = (i + j + k) % 2 === 0;
          const m = sphere(THREE, isA ? 0.40 : 0.52, (isA ? ra : rb).color);
          m.position.set((i - off) * sp, (j - off) * sp, (k - off) * sp);
          group.add(m);
        }
    return off * sp * 1.8 + 1;
  }

  function makeParticle(THREE, type = 'proton', radius = 0.28) {
    const isProton = type === 'proton';
    const p = sphere(THREE, radius, isProton ? 0xee9362 : 0x9aa0ff);
    p.add(makeLabel(THREE, isProton ? '+' : 'n', {
      width: 128,
      height: 128,
      bg: 'rgba(0,0,0,0)',
      border: 'rgba(0,0,0,0)',
      fg: '#fff8ef',
      size: 70,
      scale: [0.2, 0.2, 1]
    }));
    return p;
  }

  function clusterPositions(THREE, count, radius = 0.58) {
    const pts = [];
    if (count <= 1) return [new THREE.Vector3(0, 0, 0)];
    for (let i = 0; i < count; i++) {
      const y = 1 - ((i + 0.5) / count) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      pts.push(new THREE.Vector3(
        Math.cos(theta) * rad * radius,
        y * radius,
        Math.sin(theta) * rad * radius
      ));
    }
    return pts;
  }

  function buildNucleus(THREE, group) {
    const nucleus = new THREE.Group();
    group.add(nucleus);
    const protons = spec.protons || 6;
    const neutrons = spec.neutrons ?? protons;
    const total = protons + neutrons;
    clusterPositions(THREE, total, Math.min(0.95, 0.38 + total * 0.035)).forEach((pos, i) => {
      const particle = makeParticle(THREE, i < protons ? 'proton' : 'neutron', 0.27);
      particle.position.copy(pos);
      nucleus.add(particle);
    });

    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1.22, 36, 24),
      new THREE.MeshBasicMaterial({ color: 0xee9362, transparent: true, opacity: 0.06, wireframe: true })
    );
    group.add(shell);

    const title = makeLabel(THREE, spec.title || `${protons} protons + ${neutrons} neutrons`, {
      width: 720,
      height: 140,
      border: 'rgba(238, 147, 98, 0.72)',
      size: 38,
      scale: [2.0, 0.4, 1]
    });
    title.position.set(0, -1.8, 0);
    group.add(title);

    group.userData.animate = (t) => {
      nucleus.rotation.y = t * 0.0008;
      nucleus.rotation.x = Math.sin(t * 0.0007) * 0.18;
      shell.rotation.y = -t * 0.0004;
    };
    return 2.4;
  }

  function buildElectricAttraction(THREE, group) {
    const nucleus = sphere(THREE, 0.52, 0xee9362);
    group.add(nucleus);
    nucleus.add(makeLabel(THREE, '+ nucleus', {
      width: 360,
      height: 130,
      bg: 'rgba(0,0,0,0)',
      border: 'rgba(0,0,0,0)',
      fg: '#fff8ef',
      size: 44,
      scale: [0.9, 0.32, 1]
    }));

    const cloud = new THREE.Group();
    group.add(cloud);
    const electronMat = new THREE.MeshStandardMaterial({
      color: 0x8ee6c7,
      roughness: 0.35,
      emissive: 0x1d6b59,
      emissiveIntensity: 0.42
    });
    const electronGeo = new THREE.SphereGeometry(0.12, 24, 16);
    const electrons = [];
    [0, 1, 2, 3, 4, 5].forEach((i) => {
      const e = new THREE.Mesh(electronGeo, electronMat);
      const a = (i / 6) * Math.PI * 2;
      e.position.set(Math.cos(a) * 1.75, Math.sin(a * 1.7) * 0.72, Math.sin(a) * 1.75);
      cloud.add(e);
      electrons.push({ mesh: e, phase: a });
    });

    const lineMat = new THREE.LineBasicMaterial({ color: 0x8ee6c7, transparent: true, opacity: 0.42 });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const p = new THREE.Vector3(Math.cos(a) * 1.55, Math.sin(a * 2) * 0.5, Math.sin(a) * 1.55);
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([p, new THREE.Vector3(0, 0, 0)]), lineMat));
    }

    const title = makeLabel(THREE, spec.title || '+ attracts -', {
      width: 520,
      height: 140,
      border: 'rgba(142, 230, 199, 0.7)',
      fg: '#e8fff8',
      size: 46,
      scale: [1.45, 0.38, 1]
    });
    title.position.set(0, -2.05, 0);
    group.add(title);

    group.userData.animate = (t) => {
      cloud.rotation.y = t * 0.001;
      cloud.rotation.z = Math.sin(t * 0.0006) * 0.14;
      electrons.forEach(({ mesh, phase }) => {
        mesh.scale.setScalar(1 + Math.sin(t * 0.004 + phase) * 0.12);
      });
    };
    return 2.6;
  }

  function buildIsotopes(THREE, group) {
    const isotopes = spec.isotopes || [
      { label: 'C-12', protons: 6, neutrons: 6 },
      { label: 'C-13', protons: 6, neutrons: 7 },
      { label: 'C-14', protons: 6, neutrons: 8 }
    ];
    const row = new THREE.Group();
    group.add(row);
    isotopes.forEach((iso, idx) => {
      const mini = new THREE.Group();
      mini.position.set((idx - 1) * 1.7, 0.18, 0);
      row.add(mini);
      const total = iso.protons + iso.neutrons;
      clusterPositions(THREE, total, 0.52).forEach((pos, i) => {
        const particle = makeParticle(THREE, i < iso.protons ? 'proton' : 'neutron', 0.18);
        particle.position.copy(pos);
        mini.add(particle);
      });
      const tag = makeLabel(THREE, iso.label, {
        width: 260,
        height: 120,
        border: 'rgba(246, 239, 228, 0.32)',
        size: 42,
        scale: [0.72, 0.3, 1]
      });
      tag.position.set(mini.position.x, -1.12, 0);
      group.add(tag);
    });

    const title = makeLabel(THREE, spec.title || 'same element, different mass', {
      width: 760,
      height: 140,
      border: 'rgba(238, 147, 98, 0.72)',
      size: 38,
      scale: [2.2, 0.38, 1]
    });
    title.position.set(0, 1.45, 0);
    group.add(title);

    group.userData.animate = (t) => {
      row.rotation.y = Math.sin(t * 0.0007) * 0.32;
      row.children.forEach((child, i) => {
        child.rotation.y = t * (0.00045 + i * 0.00008);
      });
    };
    return 3.0;
  }

  function buildAiPipeline(THREE, group) {
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xee9362,
      roughness: 0.38,
      metalness: 0.08,
      emissive: 0x8a3f1f,
      emissiveIntensity: 0.28
    });
    const bitOnMat = new THREE.MeshStandardMaterial({
      color: 0x8ee6c7,
      roughness: 0.35,
      emissive: 0x1d6b59,
      emissiveIntensity: 0.55
    });
    const bitOffMat = new THREE.MeshStandardMaterial({
      color: 0x353644,
      roughness: 0.68,
      emissive: 0x11131c,
      emissiveIntensity: 0.18
    });

    const title = makeLabel(THREE, spec.title || 'English becomes numbers', {
      width: 720,
      height: 150,
      border: 'rgba(154, 160, 255, 0.7)',
      size: 42,
      scale: [2.2, 0.46, 1]
    });
    title.position.set(0, 2.35, 0);
    group.add(title);

    const words = spec.words || ['I', 'ask', 'AI'];
    words.forEach((word, i) => {
      const chip = makeLabel(THREE, word, {
        width: 320,
        height: 150,
        bg: 'rgba(32, 27, 24, 0.92)',
        border: 'rgba(238, 147, 98, 0.82)',
        size: 48,
        scale: [0.9, 0.42, 1]
      });
      chip.position.set(-3.2, 0.9 - i * 0.62, 0);
      group.add(chip);
    });

    const arrowGeo = new THREE.ConeGeometry(0.13, 0.42, 24);
    const shaftGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.72, 16);
    [-1.85, 1.35].forEach((x) => {
      const shaft = new THREE.Mesh(shaftGeo, accentMat);
      shaft.rotation.z = Math.PI / 2;
      shaft.position.set(x, 0.28, 0);
      group.add(shaft);
      const head = new THREE.Mesh(arrowGeo, accentMat);
      head.rotation.z = -Math.PI / 2;
      head.position.set(x + 0.44, 0.28, 0);
      group.add(head);
    });

    const bitGroup = new THREE.Group();
    bitGroup.position.set(0, 0.2, 0);
    group.add(bitGroup);
    const boxGeo = new THREE.BoxGeometry(0.32, 0.32, 0.32);
    const bits = spec.bits || '0100000101001001';
    for (let i = 0; i < 16; i++) {
      const bit = bits[i % bits.length];
      const cube = new THREE.Mesh(boxGeo, bit === '1' ? bitOnMat : bitOffMat);
      cube.position.set((i % 4 - 1.5) * 0.42, (1.5 - Math.floor(i / 4)) * 0.42, 0);
      bitGroup.add(cube);
      const bitLabel = makeLabel(THREE, bit, {
        width: 128,
        height: 128,
        bg: 'rgba(0,0,0,0)',
        border: 'rgba(0,0,0,0)',
        fg: bit === '1' ? '#0d1f1a' : '#e7e0d3',
        size: 70,
        scale: [0.22, 0.22, 1]
      });
      bitLabel.position.set(cube.position.x, cube.position.y, 0.2);
      bitGroup.add(bitLabel);
    }

    const vectorGroup = new THREE.Group();
    vectorGroup.position.set(3.05, 0.12, 0);
    group.add(vectorGroup);
    const pts = [
      [-0.58, -0.42, 0.18],
      [-0.2, 0.52, -0.32],
      [0.34, 0.26, 0.42],
      [0.64, -0.34, -0.12],
      [0.08, -0.08, 0.7]
    ].map(p => new THREE.Vector3(p[0], p[1], p[2]));
    pts.forEach((p, i) => {
      const dot = sphere(THREE, 0.12 + (i === 2 ? 0.04 : 0), i === 2 ? 0xee9362 : 0x9aa0ff);
      dot.position.copy(p);
      vectorGroup.add(dot);
    });
    const linePositions = [];
    for (let i = 0; i < pts.length - 1; i++) {
      linePositions.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    vectorGroup.add(new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: 0x6f76a8, transparent: true, opacity: 0.72 })
    ));

    const vectorLabel = makeLabel(THREE, 'vector space', {
      width: 440,
      height: 140,
      bg: 'rgba(17, 18, 28, 0.82)',
      border: 'rgba(142, 230, 199, 0.58)',
      fg: '#e8fff8',
      size: 38,
      scale: [1.15, 0.36, 1]
    });
    vectorLabel.position.set(3.05, -1.05, 0);
    group.add(vectorLabel);

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(6.9, 0.06, 1.7),
      new THREE.MeshStandardMaterial({ color: 0x111018, roughness: 0.8, transparent: true, opacity: 0.72 })
    );
    base.position.set(0, -1.2, 0);
    group.add(base);

    return 3.6;
  }

  function buildUnitCircle(THREE, group) {
    const lineMat = new THREE.LineBasicMaterial({ color: 0xf6efe4, transparent: true, opacity: 0.82 });
    const accentMat = new THREE.LineBasicMaterial({ color: 0xee9362 });
    const yMat = new THREE.LineBasicMaterial({ color: 0x8ee6c7 });
    const xMat = new THREE.LineBasicMaterial({ color: 0x9aa0ff });

    const circlePts = [];
    for (let i = 0; i <= 160; i++) {
      const a = (i / 160) * Math.PI * 2;
      circlePts.push(new THREE.Vector3(Math.cos(a) * 1.55, Math.sin(a) * 1.55, 0));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(circlePts), lineMat));

    const axes = [
      [new THREE.Vector3(-2.05, 0, 0), new THREE.Vector3(2.05, 0, 0), xMat],
      [new THREE.Vector3(0, -2.05, 0), new THREE.Vector3(0, 2.05, 0), yMat]
    ];
    axes.forEach(([a, b, mat]) => group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), mat)));

    const theta = (spec.theta || 52) * Math.PI / 180;
    const point = new THREE.Vector3(Math.cos(theta) * 1.55, Math.sin(theta) * 1.55, 0);
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), point]), accentMat));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([point, new THREE.Vector3(point.x, 0, 0)]), yMat));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([point, new THREE.Vector3(0, point.y, 0)]), xMat));

    const dot = sphere(THREE, 0.12, 0xee9362);
    dot.position.copy(point);
    group.add(dot);

    const title = makeLabel(THREE, spec.title || '(cos theta, sin theta)', {
      width: 650,
      height: 140,
      border: 'rgba(238, 147, 98, 0.72)',
      size: 42,
      scale: [1.85, 0.4, 1]
    });
    title.position.set(0, -2.45, 0);
    group.add(title);

    return 2.8;
  }

  function buildRayOptics(THREE, group) {
    const airMat = new THREE.MeshStandardMaterial({ color: 0x202232, roughness: 0.8, transparent: true, opacity: 0.52 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x254c63, roughness: 0.55, transparent: true, opacity: 0.58 });
    const rayMat = new THREE.LineBasicMaterial({ color: 0xee9362, linewidth: 2 });
    const normalMat = new THREE.LineBasicMaterial({ color: 0xf6efe4, transparent: true, opacity: 0.45 });

    const air = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.5, 0.08), airMat);
    air.position.set(0, 0.75, -0.05);
    group.add(air);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.5, 0.08), glassMat);
    glass.position.set(0, -0.75, -0.05);
    group.add(glass);

    group.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 1.85, 0.05), new THREE.Vector3(0, -1.85, 0.05)]),
      normalMat
    ));
    group.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.35, 0, 0.05), new THREE.Vector3(2.35, 0, 0.05)]),
      normalMat
    ));

    const incoming = new THREE.Vector3(-1.55, 1.25, 0.08);
    const boundary = new THREE.Vector3(0, 0, 0.08);
    const refracted = new THREE.Vector3(0.72, -1.25, 0.08);
    const reflected = new THREE.Vector3(1.1, 0.9, 0.08);
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([incoming, boundary, refracted]), rayMat));
    group.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([boundary, reflected]),
      new THREE.LineBasicMaterial({ color: 0x9aa0ff, transparent: true, opacity: 0.68 })
    ));

    [
      ['air', -1.55, 0.82],
      ['glass', 1.4, -0.82],
      ['normal', 0.62, 1.42]
    ].forEach(([text, x, y]) => {
      const labelSprite = makeLabel(THREE, text, {
        width: 250,
        height: 120,
        bg: 'rgba(15, 15, 20, 0.76)',
        border: 'rgba(246, 239, 228, 0.28)',
        size: 42,
        scale: [0.7, 0.28, 1]
      });
      labelSprite.position.set(x, y, 0.18);
      group.add(labelSprite);
    });

    return 2.6;
  }

  onMount(() => {
    let disposed = false;
    (async () => {
      try {
        const THREE = await import('three');
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
        if (disposed || !container) return;

        const w = container.clientWidth || 320;
        const h = container.clientHeight || 240;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h);
        container.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(4, 6, 5); scene.add(key);
        const fill = new THREE.DirectionalLight(0x9aa0ff, 0.35); fill.position.set(-5, -3, -4); scene.add(fill);

        const group = new THREE.Group();
        scene.add(group);
        const fit = spec.kind === 'atom' ? buildAtom(THREE, group)
          : spec.kind === 'lattice' ? buildLattice(THREE, group)
          : spec.kind === 'nucleus' ? buildNucleus(THREE, group)
          : spec.kind === 'electric-attraction' ? buildElectricAttraction(THREE, group)
          : spec.kind === 'isotopes' ? buildIsotopes(THREE, group)
          : spec.kind === 'ai-pipeline' ? buildAiPipeline(THREE, group)
          : spec.kind === 'unit-circle' ? buildUnitCircle(THREE, group)
          : spec.kind === 'ray-optics' ? buildRayOptics(THREE, group)
          : buildMolecule(THREE, group);

        camera.position.set(fit * 0.4, fit * 0.5, fit * 2.5);
        camera.lookAt(0, 0, 0);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.enableDamping = true;
        controls.autoRotate = !reduceMotion;
        controls.autoRotateSpeed = 1.3;

        let raf;
        const tick = (time = 0) => {
          if (!reduceMotion && group.userData.animate) group.userData.animate(time);
          controls.update();
          renderer.render(scene, camera);
          raf = requestAnimationFrame(tick);
        };
        tick();

        const ro = new ResizeObserver(() => {
          const W = container.clientWidth, H = container.clientHeight;
          if (!W || !H) return;
          camera.aspect = W / H; camera.updateProjectionMatrix(); renderer.setSize(W, H);
        });
        ro.observe(container);

        loading = false;
        cleanup = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          controls.dispose();
          scene.traverse(o => {
            if (o.geometry) o.geometry.dispose();
            if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
              if (m.map) m.map.dispose();
              m.dispose();
            });
          });
          renderer.dispose();
          if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
        };
      } catch (e) {
        failed = true;
        loading = false;
      }
    })();
    return () => { disposed = true; };
  });

  onDestroy(() => cleanup());
</script>

<div class="three-stage" bind:this={container}>
  {#if loading && !failed}
    <div class="three-loading"><span></span><span></span><span></span></div>
  {/if}
  {#if failed}
    <div class="three-failed">3D view unavailable</div>
  {/if}
  {#if label}<div class="three-label">{label}</div>{/if}
  <div class="three-hint">drag to rotate</div>
</div>

<style>
  .three-stage {
    position: relative; width: 100%; height: 100%; overflow: hidden;
    background: radial-gradient(ellipse at 50% 32%, #211f2b, #0d0c11 86%);
    touch-action: none;
  }
  .three-stage :global(canvas) { display: block; }

  .three-label {
    position: absolute; left: 10px; bottom: 9px;
    font-family: var(--qx-font); font-size: 12px; font-weight: 800; letter-spacing: 0.02em;
    color: #f4f1e9; background: rgba(0,0,0,0.35); border-radius: var(--qx-radius-pill); padding: 3px 10px;
    pointer-events: none;
  }
  .three-hint {
    position: absolute; right: 10px; bottom: 11px;
    font-family: var(--qx-font); font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.45);
    pointer-events: none;
  }

  .three-loading { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 7px; }
  .three-loading span { width: 7px; height: 7px; border-radius: 50%; background: #6E7689; animation: tBounce 1.4s infinite ease-in-out both; }
  .three-loading span:nth-child(1) { animation-delay: -0.32s; }
  .three-loading span:nth-child(2) { animation-delay: -0.16s; }
  @keyframes tBounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

  .three-failed { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.5); font-size: 13px; font-family: var(--qx-font); }
</style>
