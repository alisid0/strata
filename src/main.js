import './lib/styles/global.css';
import App from './App.svelte';

const app = new App({
  target: document.getElementById('app')
});

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

export default app;
