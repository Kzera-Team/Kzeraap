function bindRecoveryButtonClick() {
  const button = document.getElementById('backup-recovery-action');
  const input = document.getElementById('backup-recovery-input');

  if (!button || !input) return;

  button.addEventListener('click', event => {
    event.preventDefault();
    input.click();
  });
}

bindRecoveryButtonClick();
