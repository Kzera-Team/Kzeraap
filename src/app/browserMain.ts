import { createKzeraAuthenticatedApp } from './createKzeraAuthenticatedApp';

const root = document.getElementById('app');

if (!root) {
  throw new Error('Elemento #app não encontrado.');
}

createKzeraAuthenticatedApp().mount(root);
