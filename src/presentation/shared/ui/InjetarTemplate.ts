export function injetarTemplate(templateId: string, html: string): void {
  if (document.getElementById(templateId)) return;
  const container = document.createElement('div');
  container.innerHTML = html;
  const template = container.querySelector('template');
  if (template) document.head.appendChild(template);
}
