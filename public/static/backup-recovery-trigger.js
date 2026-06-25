(() => {
  const MAX_CLICKS = 10;
  const WINDOW_MS = 5000;
  const DB_NAME = 'kzera_backup_recovery';
  const DB_VERSION = 1;
  const STORE_NAME = 'pending';
  const RECORD_ID = 'selected-backup';

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

  function openDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Falha ao abrir armazenamento temporário.'));
    });
  }

  async function saveEncryptedPendingBackup(record) {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('Falha ao guardar backup criptografado.'));
    });
    db.close();
  }

  function showRecoveryLoginShell(filename) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `<section class="auth-shell" aria-live="polite">
      <div class="auth-card">
        <div class="auth-brand"><div class="auth-icon">V</div><div><h1>Vevelt</h1></div></div>
        <form class="auth-form" data-testid="backup-login-form">
          <h2>Restaurar backup</h2>
          <p>Arquivo selecionado: ${filename}</p>
          <p>Digite a mesma senha usada para abrir o sistema no backup.</p>
          <label class="auth-field password-field"><span>Senha</span><span class="password-control"><input id="backup-recovery-password" type="password" autocomplete="current-password" required /></span></label>
          <button type="submit">Desbloquear e restaurar</button>
        </form>
      </div>
    </section>`;

    const form = app.querySelector('[data-testid="backup-login-form"]');
    form?.addEventListener('submit', event => {
      event.preventDefault();
      app.innerHTML = `<section class="auth-shell" aria-live="polite">
        <div class="auth-card">
          <div class="auth-brand"><div class="auth-icon">V</div><div><h1>Vevelt</h1></div></div>
          <form class="auth-form"><h2>Restoring backup...</h2><p>Validando senha e desbloqueando arquivo criptografado.</p></form>
        </div>
      </section>`;
      window.dispatchEvent(new CustomEvent('kzera:backup-recovery-auth-submit', {
        detail: { password: app.querySelector('#backup-recovery-password')?.value || '' }
      }));
    }, { once: true });
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

        await saveEncryptedPendingBackup({
          id: RECORD_ID,
          filename: file.name,
          size: file.size,
          loadedAt: new Date().toISOString(),
          encryptedPayload: text
        });

        window.dispatchEvent(new CustomEvent('kzera:backup-recovery-selected', {
          detail: { filename: file.name, size: file.size, storage: DB_NAME }
        }));

        showRecoveryLoginShell(file.name);
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
