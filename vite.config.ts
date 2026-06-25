import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string };
const appVersion = '0.19.39' || version;

export default defineConfig({
  base: '/Kzeraap/',
  define: {
    __APP_VERSION__: JSON.stringify(appVersion)
  },
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
