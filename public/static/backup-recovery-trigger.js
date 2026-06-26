(() => {
  const INPUT_ID = 'backup-recovery-input';

  function handleSelectedFile(file, mode) {
    if (!file) return;
    window.dispatchEvent(new CustomEvent('kzera:backup-file-selected', {
      detail: { file, mode }
    }));
  }

  function isRecoveryInputTarget(target) {
    return target instanceof Element && Boolean(target.closest(`#${INPUT_ID}`));
  }

  function handleRecoveryInputChange(event) {
    if (!isRecoveryInputTarget(event.target)) return;
    const input = event.target;
    const file = input.files && input.files[0];
    handleSelectedFile(file, 'recover-backup-input');
    input.value = '';
  }

  document.addEventListener('change', handleRecoveryInputChange, true);
})();
