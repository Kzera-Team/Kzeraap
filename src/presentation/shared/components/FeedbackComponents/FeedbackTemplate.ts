export function cloneTemplateRoot(templateId: string, invalidMessage: string): HTMLElement {
  const template = document.getElementById(templateId);

  if (!(template instanceof HTMLTemplateElement)) {
    throw new Error(`${invalidMessage}: template não encontrado.`);
  }

  const root = template.content.firstElementChild?.cloneNode(true);

  if (!(root instanceof HTMLElement)) {
    throw new Error(`${invalidMessage}: template inválido.`);
  }

  return root;
}

export function findTemplateElement<T extends HTMLElement>(
  root: ParentNode,
  selector: string,
  invalidMessage: string
): T {
  const element = root.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    throw new Error(invalidMessage);
  }

  return element as T;
}
