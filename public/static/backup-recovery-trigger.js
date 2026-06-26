(() => {
  const INPUT_ID = 'backup-recovery-input';
  const ACTION_ID = 'backup-recovery-action';
  const SHELL_ID = 'backup-recovery-shell';

  function handleSelectedFile(file, mode) {
    if (!file) return;
    window.dispatchEvent(new CustomEvent('kzera:backup-file-selected', {
      detail: { file, mode }
    }));
  }

  function isRecoveryInputTarget(target) {
    return target instanceof Element && Boolean(target.closest(`#${INPUT_ID}`));
  }

  function getRecoveryInput() {
    return document.getElementById(INPUT_ID);
  }

  function handleRecoveryActionClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (isRecoveryInputTarget(target)) return;
    if (!target.closest(`#${ACTION_ID}, #${SHELL_ID}`)) return;

    const input = getRecoveryInput();
    if (!(input instanceof HTMLInputElement)) return;

    event.preventDefault();
    input.click();
  }

  function handleRecoveryInputChange(event) {
    if (!isRecoveryInputTarget(event.target)) return;
    const input = event.target;
    const file = input.files && input.files[0];
    handleSelectedFile(file, 'recover-backup-input');
    input.value = '';
  }

  document.addEventListener('click', handleRecoveryActionClick, true);
  document.addEventListener('change', handleRecoveryInputChange, true);
})();
