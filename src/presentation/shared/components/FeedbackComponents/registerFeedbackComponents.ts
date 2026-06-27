import markup from './FeedbackComponents.html?raw';

const HOST_ID = 'kzera-static-components';
const READY_EVENT = 'kzera:static-components-ready';

export function registerFeedbackComponents(): void {
  if (document.getElementById(HOST_ID)) return;

  const range = document.createRange();
  range.selectNode(document.body);
  document.body.appendChild(range.createContextualFragment(markup));
  window.dispatchEvent(new CustomEvent(READY_EVENT));
  range.detach();
}

registerFeedbackComponents();
