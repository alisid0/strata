# Vendored Three.js for Mustang Lab

Copied from the app's `node_modules/three` so the lab does not load scripts
from unpkg (and so CSP does not need `https://unpkg.com`).

Refresh when bumping the root `three` dependency:

```bash
npm install
cp node_modules/three/build/three.module.js node_modules/three/build/three.core.js public/labs/mustang/vendor/three/
cp node_modules/three/examples/jsm/controls/OrbitControls.js public/labs/mustang/vendor/three/addons/controls/
cp node_modules/three/examples/jsm/environments/RoomEnvironment.js public/labs/mustang/vendor/three/addons/environments/
node -p "require('./node_modules/three/package.json').version" > public/labs/mustang/vendor/three/VERSION
```

See `VERSION` for the currently vendored release.
