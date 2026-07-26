import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        tarot: resolve(__dirname, 'tarot.html'),
        wheel: resolve(__dirname, 'wheel.html'),
        daily: resolve(__dirname, 'daily.html'),
        quick: resolve(__dirname, 'quick.html'),
        history: resolve(__dirname, 'history.html')
      }
    }
  }
});
