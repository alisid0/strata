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
    : spec?.kind === 'lattice' ? `${spec.a}${spec.b}` : '';

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
        const tick = () => { controls.update(); renderer.render(scene, camera); raf = requestAnimationFrame(tick); };
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
            if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
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
