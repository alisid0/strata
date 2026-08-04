/**
 * main.js — scene, render loop, and the wiring between physics, car and UI.
 *
 * The car stays at the origin and the ROAD moves underneath it. That keeps the
 * camera simple and, more usefully, keeps the free-body diagram in one place so
 * students can watch the arrows change without chasing the car around.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { Vehicle, SURFACES, DEFAULT_SPEC, stoppingDistance } from './physics.js';
import { buildCar, GEOMETRY } from './car.js';
import { ForceOverlay } from './arrows.js';
import { Hud } from './hud.js';
import { LessonController, frictionLesson, brakeLesson } from './lesson.js';
import { ObservationBooklet } from './observations.js';

// ------------------------------------------------------------------ scene
const canvasHost = document.getElementById('viewport');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x11131a);
scene.fog = new THREE.Fog(0x11131a, 24, 70);

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 300);
camera.position.set(6.6, 2.4, 6.8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
canvasHost.appendChild(renderer.domElement);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.target.set(0, 0.75, 0);
controls.minDistance = 4;
controls.maxDistance = 24;
controls.maxPolarAngle = Math.PI / 2 - 0.03;

// ----------------------------------------------------------------- lights
scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x30302c, 0.55));

const key = new THREE.DirectionalLight(0xffffff, 2.1);
key.position.set(6, 9, 5);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 30 });
key.shadow.camera.updateProjectionMatrix();
key.shadow.bias = -0.0005;
scene.add(key);

const rimLight = new THREE.DirectionalLight(0xbcd4ff, 0.7);
rimLight.position.set(-7, 4, -6);
scene.add(rimLight);

// ------------------------------------------------------------------- road
// A repeating texture of transverse bands. Scrolling it is what sells motion,
// and the band spacing (2 m) doubles as a distance ruler.
function makeRoadTexture() {
  // The plane is rotated flat, so texture U runs along world X — the direction
  // of travel. Bands must therefore vary along the canvas WIDTH.
  const c = document.createElement('canvas');
  c.width = 128; c.height = 8;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 128, 8);
  ctx.fillStyle = '#c8c8c8';
  ctx.fillRect(0, 0, 10, 8);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(100, 1);      // 200 m plane / 100 tiles = one band every 2 m
  return tex;
}

const roadTex = makeRoadTexture();
const roadMat = new THREE.MeshStandardMaterial({
  color: SURFACES.dry.colour, roughness: 0.92, metalness: 0.0, map: roadTex
});
const road = new THREE.Mesh(new THREE.PlaneGeometry(200, 26), roadMat);
road.rotation.x = -Math.PI / 2;
road.receiveShadow = true;
scene.add(road);

// Stopping-distance marker — a dashed line on the road showing predicted stop.
const markerGeo = new THREE.PlaneGeometry(0.15, 3);
const markerMat = new THREE.MeshBasicMaterial({ color: 0xff5c5c, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
const stopMarker = new THREE.Mesh(markerGeo, markerMat);
stopMarker.rotation.x = -Math.PI / 2;
stopMarker.position.y = 0.02;
stopMarker.visible = false;
scene.add(stopMarker);

// Skid-mark planes under each axle (shown during lockup).
const skidGeo = new THREE.PlaneGeometry(1.6, 0.5);
const skidMat = new THREE.MeshBasicMaterial({ color: 0x111111, side: THREE.DoubleSide, transparent: true, opacity: 0 });
const frontSkid = new THREE.Mesh(skidGeo, skidMat);
frontSkid.rotation.x = -Math.PI / 2;
frontSkid.position.set(0, 0.015, 0);
scene.add(frontSkid);
const rearSkid = new THREE.Mesh(skidGeo, skidMat.clone());
rearSkid.rotation.x = -Math.PI / 2;
rearSkid.position.set(0, 0.015, 0);
scene.add(rearSkid);

// ------------------------------------------------------------------- car
const built = buildCar();
scene.add(built.car);

const overlay = new ForceOverlay(scene);

// --------------------------------------------------------------- simulation
const vehicle = new Vehicle(DEFAULT_SPEC, 'dry');
let slowMo = false;
let throttleLimit = 1;
const stats = {
  reached100: null, everSlipped: false,
  stoppedFrom30: null, everLocked: false
};
let brakingRun = null; // { startDist, startSpeed } when a brake run begins

function resetRun() {
  vehicle.reset();
  stats.reached100 = null;
  stats.everSlipped = false;
  stats.stoppedFrom30 = null;
  stats.everLocked = false;
  brakingRun = null;
  built.car.rotation.z = 0;
}

function applySurface(k) {
  vehicle.setSurface(k);
  roadMat.color.setHex(SURFACES[k].colour);
  hud.setSurface(k);
}

// ---------------------------------------------------------------------- ui
const hud = new Hud(document.getElementById('hud'), {
  onSurface: (k) => { applySurface(k); resetRun(); },
  onReset: resetRun,
  onToggleForces: (on) => overlay.setEnabled(on),
  onToggleSlowMo: (on) => { slowMo = on; }
});

// Observation booklet (museum-style numbered trail)
const booklet = new ObservationBooklet(document.getElementById('observations'));

// Lesson switcher
const lessons = { friction: frictionLesson, brakes: brakeLesson };
let currentLessonKey = 'friction';

const lessonRoot = document.getElementById('lesson');
let lesson = new LessonController(frictionLesson, lessonRoot, (setup) => {
  if (setup.surface) applySurface(setup.surface);
  if (setup.throttleLimit != null) throttleLimit = setup.throttleLimit;
  resetRun();
});

const picker = document.getElementById('lesson-pick');
picker.innerHTML = `
  <option value="friction">Lesson 1 — Friction & Traction</option>
  <option value="brakes">Lesson 2 — Braking & Stopping</option>`;
picker.value = currentLessonKey;
picker.addEventListener('change', () => {
  currentLessonKey = picker.value;
  booklet.setLesson(currentLessonKey);
  lesson = new LessonController(lessons[currentLessonKey], lessonRoot, (setup) => {
    if (setup.surface) applySurface(setup.surface);
    if (setup.throttleLimit != null) throttleLimit = setup.throttleLimit;
    resetRun();
  });
});

// ------------------------------------------------------------------- loop
function resize() {
  const w = canvasHost.clientWidth, h = canvasHost.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);

const clock = new THREE.Clock();
let wheelAngle = 0;

function animate() {
  requestAnimationFrame(animate);

  const raw = Math.min(0.05, clock.getDelta());
  const dt = slowMo ? raw * 0.25 : raw;

  const c = hud.readControls();
  vehicle.step(dt, { throttle: Math.min(c.throttle, throttleLimit), brake: c.brake });

  // 0-100 km/h timing
  if (!stats.reached100 && vehicle.speedKph >= 100) stats.reached100 = vehicle.time;
  if (vehicle.slipping) stats.everSlipped = true;

  // Brake lesson stats: track a braking run from ≥ 30 m/s to a stop.
  // Record the distance at the moment braking starts, so the stopping
  // distance is finalDist - startDist.
  if (!brakingRun && vehicle.v >= 29.5 && c.brake > 0.1) {
    brakingRun = { startDist: vehicle.distance, startSpeed: vehicle.v };
  }
  if (brakingRun && vehicle.v === 0) {
    const d = vehicle.distance - brakingRun.startDist;
    if (brakingRun.startSpeed >= 29.5) {
      if (!stats.stoppedFrom30 || d < stats.stoppedFrom30) {
        stats.stoppedFrom30 = d;
      }
    }
    brakingRun = null;
  }
  // If the user lets off the brake before stopping, reset the run.
  if (brakingRun && c.brake < 0.05) {
    brakingRun = null;
  }
  if (vehicle.frontLocked || vehicle.rearLocked) stats.everLocked = true;

  lesson.reportProgress(stats);

  // scroll the road backwards under the car; one tile = 2 m
  roadTex.offset.x += (vehicle.v * dt) / 2;

  // wheels: driven wheels turn faster than the road when they are spinning
  wheelAngle -= vehicle.wheelOmega * dt;
  const rollAngle = -(vehicle.distance / GEOMETRY.frontRadius);
  built.wheels.rear.forEach(w => { w.rotation.z = wheelAngle; });
  built.wheels.front.forEach(w => { w.rotation.z = rollAngle; });

  // squat under power, dive under braking — a visible cue for weight transfer
  // +rotation.z lifts the nose, so accelerating (ax > 0) squats the tail.
  const targetPitch = THREE.MathUtils.clamp(vehicle.ax * 0.006, -0.05, 0.05);
  built.car.rotation.z += (targetPitch - built.car.rotation.z) * Math.min(1, dt * 6);

  // brake lights
  const braking = c.brake > 0.02;
  built.brakeLights.forEach(l => l.material.emissive.setHex(braking ? 0xff2200 : 0x5a0800));

  // Lockup visuals — skid marks under locked axles.
  const axleX = { front: 1.4, rear: GEOMETRY.frontRadius > 0 ? -1.4 : -1.4 };
  frontSkid.material.opacity = vehicle.frontLocked ? 0.6 : 0;
  frontSkid.position.x = axleX.front;
  rearSkid.material.opacity = vehicle.rearLocked ? 0.6 : 0;
  rearSkid.position.x = axleX.rear;

  // Stopping-distance marker — a vertical line on the road ahead.
  if (vehicle.v > 2 && c.brake > 0.02) {
    const sd = stoppingDistance(vehicle.v, vehicle.surface.mu_s);
    stopMarker.position.x = sd;
    stopMarker.visible = true;
  } else {
    stopMarker.visible = false;
  }

  overlay.update(vehicle, GEOMETRY);
  hud.update(vehicle, stats);

  controls.update();
  renderer.render(scene, camera);
}

resize();
animate();
