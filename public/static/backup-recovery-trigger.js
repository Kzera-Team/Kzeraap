(() => {
  const BUTTON_ID = 'backup-recovery-action';

  function handleSelectedFile(file, mode) {
    if (!file) return;
    window.dispatchEvent(new CustomEvent('kzera:backup-file-selected', {
      detail: { file, mode }
    }));
  }

  function openNativeBackupPicker(mode = 'recover-backup-button') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.dat,.json,application/json,application/octet-stream,text/plain';
    input.setAttribute('aria-hidden', 'true');
    input.style.position = 'fixed';
    input.style.left = '0';
    input.style.top = '0';
    input.style.width = '1px';
    input.style.height = '1px';
    input.style.opacity = '0.01';
    input.style.pointerEvents = 'none';

    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      input.remove();
      handleSelectedFile(file, mode);
    }, { once: true });

    document.body.appendChild(input);
    input.click();
  }

  function isRecoveryButtonTarget(target) {
    return target instanceof Element && Boolean(target.closest(`#${BUTTON_ID}`));
  }

  function handleRecoveryButtonActivation(event) {
    if (!isRecoveryButtonTarget(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    openNativeBackupPicker('recover-backup-button');
  }

  document.addEventListener('click', handleRecoveryButtonActivation, true);
  document.addEventListener('touchend', handleRecoveryButtonActivation, true);
  window.kzeraAbrirSeletorBackup = openNativeBackupPicker;
})();
