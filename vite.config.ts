import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  publicDir: 'static',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: false
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  }
});
