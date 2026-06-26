export interface LoadingModalHandle {
  close(): void;
  update(message: string): void;
}

export interface LoadingModalOptions {
  message: string;
}

export function showLoadingModal(options: LoadingModalOptions): LoadingModalHandle {
  const overlay = document.createElement('div');
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'polite');
  overlay.setAttribute('aria-busy', 'true');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.zIndex = '100000';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.padding = '24px';
  overlay.style.background = 'rgba(17, 24, 39, 0.42)';

  const modal = document.createElement('div');
  modal.style.width = 'min(320px, 100%)';
  modal.style.padding = '20px';
  modal.style.borderRadius = '18px';
  modal.style.background = '#fff';
  modal.style.color = '#111';
  modal.style.boxShadow = '0 18px 48px rgba(15, 23, 42, 0.24)';
  modal.style.textAlign = 'center';

  const spinner = document.createElement('div');
  spinner.style.width = '34px';
  spinner.style.height = '34px';
  spinner.style.margin = '0 auto 14px';
  spinner.style.border = '4px solid rgba(17, 24, 39, 0.16)';
  spinner.style.borderTopColor = '#111827';
  spinner.style.borderRadius = '999px';
  spinner.style.animation = 'kzera-loading-modal-spin 0.8s linear infinite';

  const message = document.createElement('p');
  message.textContent = options.message;
  message.style.margin = '0';
  message.style.fontSize = '15px';
  message.style.fontWeight = '600';

  ensureLoadingModalKeyframes();
  modal.append(spinner, message);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  return {
    close() {
      overlay.remove();
    },
    update(nextMessage: string) {
      message.textContent = nextMessage;
    }
  };
}

function ensureLoadingModalKeyframes() {
  if (document.getElementById('kzera-loading-modal-keyframes')) return;
  const style = document.createElement('style');
  style.id = 'kzera-loading-modal-keyframes';
  style.textContent = '@keyframes kzera-loading-modal-spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
}
