const kzNavOpen = document.querySelector('[data-kz-nav-open]');
const kzNavClose = document.querySelector('[data-kz-nav-close]');
const kzNavBackdrop = document.querySelector('[data-kz-nav-backdrop]');
const kzNavDrawer = document.querySelector('[data-kz-nav-drawer]');

function kzOpenDrawer() {
  if (!kzNavBackdrop || !kzNavDrawer || !kzNavOpen) return;
  kzNavBackdrop.hidden = false;
  kzNavDrawer.setAttribute('aria-hidden', 'false');
  kzNavOpen.setAttribute('aria-expanded', 'true');
  kzNavBackdrop.classList.add('is-open');
  kzNavDrawer.classList.add('is-open');
}

function kzCloseDrawer() {
  if (!kzNavBackdrop || !kzNavDrawer || !kzNavOpen) return;
  kzNavBackdrop.classList.remove('is-open');
  kzNavDrawer.classList.remove('is-open');
  kzNavDrawer.setAttribute('aria-hidden', 'true');
  kzNavOpen.setAttribute('aria-expanded', 'false');
  kzNavBackdrop.hidden = true;
}

if (kzNavOpen) kzNavOpen.addEventListener('click', kzOpenDrawer);
if (kzNavClose) kzNavClose.addEventListener('click', kzCloseDrawer);
if (kzNavBackdrop) kzNavBackdrop.addEventListener('click', kzCloseDrawer);
