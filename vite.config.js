import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        tarot: resolve(import.meta.dirname, 'tarot.html'),
        wheel: resolve(import.meta.dirname, 'wheel.html'),
        daily: resolve(import.meta.dirname, 'daily.html'),
        quick: resolve(import.meta.dirname, 'quick.html'),
        history: resolve(import.meta.dirname, 'history.html')
      }
    }
  }
});
