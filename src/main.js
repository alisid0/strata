import './lib/styles/global.css';
import App from './App.svelte';

const app = new App({
  target: document.getElementById('app')
});

// Remove the static SEO/splash first-paint now that the Svelte app has mounted.
document.getElementById('seo-splash')?.remove();

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

export default app;
