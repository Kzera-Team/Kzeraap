(() => {
  const LABEL_ID = 'backup-recovery-test-labels';

  function closeBackupDialog() {
    document.querySelector('[data-backup-picker-overlay]')?.remove();
  }

  function handleSelectedFile(file, mode) {
    if (!file) return;
    window.dispatchEvent(new CustomEvent('kzera:backup-file-selected', {
      detail: { file, mode }
    }));
  }

  function showVisiblePickerDialog() {
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
    text.textContent = 'Toque no campo abaixo e escolha o arquivo de backup.';
    text.style.margin = '0 0 16px';
    text.style.fontSize = '14px';
    text.style.color = '#555';

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.dat,.json,application/json,application/octet-stream,text/plain';
    input.style.width = '100%';
    input.style.margin = '8px 0 16px';

    const selected = document.createElement('p');
    selected.style.margin = '0 0 16px';
    selected.style.fontSize = '13px';
    selected.style.color = '#333';

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'Cancelar';
    cancel.style.border = '0';
    cancel.style.borderRadius = '12px';
    cancel.style.padding = '10px 14px';
    cancel.style.background = '#eee';
    cancel.style.color = '#111';

    cancel.addEventListener('click', closeBackupDialog);

    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;
      selected.textContent = `Backup selecionado: ${file.name}`;
      handleSelectedFile(file, 'visible-popup');
    });

    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(input);
    card.appendChild(selected);
    card.appendChild(cancel);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
  }

  function createActionLabel(text, onClick) {
    const label = document.createElement('label');
    label.textContent = text;
    label.tabIndex = 0;
    label.style.display = 'block';
    label.style.margin = '10px 0 0';
    label.style.padding = '12px 14px';
    label.style.borderRadius = '12px';
    label.style.background = '#111';
    label.style.color = '#fff';
    label.style.fontWeight = '700';
    label.style.textAlign = 'center';
    label.style.cursor = 'pointer';
    label.addEventListener('click', onClick);
    return label;
  }

  function createNativeFileLabel() {
    const label = createActionLabel('Restaurar backup', () => {});
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.dat,.json,application/json,application/octet-stream,text/plain';
    input.style.position = 'absolute';
    input.style.width = '1px';
    input.style.height = '1px';
    input.style.opacity = '0.01';
    input.style.pointerEvents = 'none';
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      handleSelectedFile(file, 'native-label');
    });
    label.appendChild(input);
    return label;
  }

  function mountRecoveryLabels() {
    if (document.getElementById(LABEL_ID)) return;

    const setupForm = document.querySelector('[data-testid="setup-form"]');
    if (!setupForm) return;

    const box = document.createElement('div');
    box.id = LABEL_ID;
    box.style.marginTop = '14px';

    box.appendChild(createActionLabel('Restaurar backup', showVisiblePickerDialog));
    box.appendChild(createNativeFileLabel());

    setupForm.appendChild(box);
  }

  mountRecoveryLabels();

  const observer = new MutationObserver(mountRecoveryLabels);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
