# 1.10.1 — Ícones com texto em ações não óbvias

## Decisão de UX

Ícones são permitidos nos botões. O erro é usar ícone sozinho esperando que a pessoa entenda uma ação operacional, rara, crítica ou ambígua.

## Regra oficial

- Ação óbvia e frequente pode usar ícone sozinho quando for compreensível em menos de 1 segundo e tiver `aria-label`/`title`.
- Ação crítica, rara ou ambígua deve usar texto ou ícone + texto.
- Em fluxo operacional mobile, clareza vale mais do que economizar alguns pixels.

## Ajuste aplicado

O botão de abertura do lote operacional passou de `Lote` para `📦 Lote`.

Assim ele continua claro para a Usuária e pode usar apoio visual sem virar botão misterioso.
