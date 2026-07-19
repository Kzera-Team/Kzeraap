# Resultados de build, typecheck e testes

* `pnpm run build`: passou; aviso: `backup-recovery-trigger.js` não possui `type="module"` e não é empacotado.
* `pnpm exec tsc --noEmit`: falhou na base por TS2882 para três imports CSS (`ImportacaoBottomSheet.css`, `ImportacaoFab.css`, `PerfilTemplate.css`).
* `pnpm run check:no-html-in-ts`: passou.
* `pnpm test`: saída informativa; o script diz que testes estão temporariamente desabilitados.
* Execução do inventário `tests/*.test.cjs`: falhou em diversos testes existentes por versões/documentos/contratos ausentes, sem relação demonstrada com esta auditoria.
