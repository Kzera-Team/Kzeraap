(() => {
  const MAX_CLICKS = 10;
  const WINDOW_MS = 5000;
  const MEMORY_KEY = '__kzeraPendingBackupRecovery';

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
    if (value.runtime && typeof value.encryptedPayload === 'string') return true;
    if (Array.isArray(value.iv) && Array.isArray(value.data)) return true;
    return false;
  }

  function showRestoringShell() {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `<section class="auth-shell" aria-live="polite">
      <div class="auth-card">
        <div class="auth-brand"><div class="auth-icon">V</div><div><h1>Vevelt</h1></div></div>
        <form class="auth-form" data-testid="backup-login-form">
          <h2>Restaurar backup</h2>
          <p>Digite a mesma senha usada para abrir o sistema no backup. O arquivo fica apenas na memória até a restauração terminar.</p>
          <label class="auth-field password-field"><span>Senha</span><span class="password-control"><input id="backup-recovery-password" type="password" autocomplete="current-password" required /></span></label>
          <button type="submit">Desbloquear e restaurar</button>
        </form>
      </div>
    </section>`;
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

        window[MEMORY_KEY] = {
          filename: file.name,
          size: file.size,
          loadedAt: new Date().toISOString(),
          payload: text
        };

        window.dispatchEvent(new CustomEvent('kzera:backup-recovery-selected', {
          detail: { filename: file.name, size: file.size }
        }));

        showRestoringShell();
        showMessage('Backup carregado em memória. Autentique para restaurar.');
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
