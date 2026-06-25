(() => {
  const MAX_CLICKS = 10;
  let clicks = 0;

  function openBackupSelector() {
    const input = document.createElement('input');

    input.type = 'file';
    input.accept = '.dat,.json,application/json,application/octet-stream,text/plain';
    input.style.position = 'fixed';
    input.style.left = '-9999px';

    document.body.appendChild(input);
    input.click();

    input.addEventListener(
      'change',
      () => {
        input.remove();
      },
      { once: true }
    );
  }

  document.addEventListener(
    'click',
    event => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const setupForm = document.querySelector('[data-testid="setup-form"]');
      const brand = target.closest('.auth-brand, .auth-icon');

      if (!setupForm || !brand) return;

      clicks += 1;

      if (clicks >= MAX_CLICKS) {
        clicks = 0;
        openBackupSelector();
      }
    },
    true
  );
})();

    
