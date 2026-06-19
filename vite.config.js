import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: {
          deck: ['./src/lib/content/deck.js'],
          quiz: ['./src/lib/content/questions.js']
        }
      }
    }
  },
  server: {
    port: 8000
  }
});
