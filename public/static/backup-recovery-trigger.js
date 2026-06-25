(() => {
  const MAX_CLICKS = 10;
  const WINDOW_MS = 5000;
  const PENDING_KEY = 'kzera_pending_backup_recovery';

  let clicks = 0;
  let firstClickAt = 0;

  function showMessage(message, kind = 'info') {
    const app = document.getElementById('app') || document.body;
    const previous = document.querySelector('[data-backup-recovery-message]');
    previous?.remove();

    const box = document.createElement('div');
    box.setAttribute('data-backup-recovery-message', 'true');
    box.className = kind === 'error' ? 'toast toast-error' : 'toast';
    box.textContent = message;
    app.prepend(box);
  }

  function isBackupEnvelope(value) {
    if (!value || typeof value !== 'object') return false;
    if (Array.isArray(value.iv) && Array.isArray(value.data)) return true;
    if (value.schemaVersion === 1 && value.data && typeof value.data === 'object') return true;
    return false;
  }

  function openBackupSelector() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.dat,.json,application/json,application/octet-stream,text/plain';
    input.style.position = 'fixed';
    input.style.left = '-9999px';

    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      input.remove();
      if (!file) return;

      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (!isBackupEnvelope(parsed)) {
          showMessage('Arquivo selecionado não parece ser um backup válido.', 'error');
          return;
        }

        sessionStorage.setItem(PENDING_KEY, JSON.stringify({
          filename: file.name,
          size: file.size,
          loadedAt: new Date().toISOString(),
          payload: text
        }));
        showMessage('Backup carregado para recuperação. Próximo passo: restaurador seguro aplicar após validação da senha.');
      } catch {
        showMessage('Não foi possível ler o backup. Use o arquivo .dat/.json exportado pelo sistema.', 'error');
      }
    }, { once: true });

    document.body.appendChild(input);
    input.click();
  }

  document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const icon = target.closest('.auth-icon');
    const setupForm = document.querySelector('[data-testid="setup-form"]');
    if (!icon || !setupForm) return;

    const now = Date.now();
    if (!firstClickAt || now - firstClickAt > WINDOW_MS) {
      firstClickAt = now;
      clicks = 0;
    }

    clicks += 1;
    if (clicks >= MAX_CLICKS) {
      clicks = 0;
      firstClickAt = 0;
      openBackupSelector();
    }
  }, true);
})();
