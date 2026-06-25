(() => {
  const REQUIRED_CLICKS = 5;
  let passwordClicks = 0;
  let confirmationClicks = 0;

  function resetCounters() {
    passwordClicks = 0;
    confirmationClicks = 0;
  }

  function closeBackupDialog() {
    document.querySelector('[data-backup-picker-overlay]')?.remove();
  }

  function showBackupDialog() {
    closeBackupDialog();

    const overlay = document.createElement('div');
    overlay.setAttribute('data-backup-picker-overlay', 'true');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = '99999';
    overlay.style.background = 'rgba(0, 0, 0, 0.45)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '24px';

    const card = document.createElement('div');
    card.style.width = '100%';
    card.style.maxWidth = '360px';
    card.style.borderRadius = '20px';
    card.style.background = '#fff';
    card.style.padding = '20px';
    card.style.boxShadow = '0 18px 45px rgba(0, 0, 0, 0.28)';
    card.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif';

    const title = document.createElement('h2');
    title.textContent = 'Selecionar backup';
    title.style.margin = '0 0 8px';
    title.style.fontSize = '20px';

    const text = document.createElement('p');
    text.textContent = 'Escolha o arquivo de backup exportado pelo sistema.';
    text.style.margin = '0 0 16px';
    text.style.fontSize = '14px';
    text.style.color = '#555';

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.dat,.json,application/json,application/octet-stream,text/plain';
    input.style.width = '100%';
    input.style.margin = '8px 0 16px';

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.justifyContent = 'flex-end';

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'Cancelar';
    cancel.style.border = '0';
    cancel.style.borderRadius = '12px';
    cancel.style.padding = '10px 14px';
    cancel.style.background = '#eee';
    cancel.style.color = '#111';

    const selected = document.createElement('p');
    selected.style.margin = '0';
    selected.style.fontSize = '13px';
    selected.style.color = '#333';

    cancel.addEventListener('click', closeBackupDialog);

    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;
      selected.textContent = `Backup selecionado: ${file.name}`;
      window.dispatchEvent(new CustomEvent('kzera:backup-file-selected', {
        detail: { file }
      }));
    });

    actions.appendChild(cancel);
    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(input);
    card.appendChild(selected);
    card.appendChild(actions);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
  }

  document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const button = target.closest('[data-toggle-password]');
    if (!(button instanceof HTMLElement)) return;

    const passwordTarget = button.dataset.togglePassword;

    if (passwordTarget === 'setup-password') {
      passwordClicks += 1;
    }

    if (passwordTarget === 'setup-confirmation') {
      confirmationClicks += 1;
    }

    if (passwordClicks >= REQUIRED_CLICKS && confirmationClicks >= REQUIRED_CLICKS) {
      resetCounters();
      showBackupDialog();
    }
  }, true);
})();
