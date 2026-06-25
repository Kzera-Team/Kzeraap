import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

const packageInfo = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string; appDisplayVersion?: string };
const appVersion = packageInfo.appDisplayVersion || packageInfo.version;

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
