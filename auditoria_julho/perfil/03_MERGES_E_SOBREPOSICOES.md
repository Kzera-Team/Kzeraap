# Merges e sobreposições

## PR #6 — único merge com alteração direta combinada em arquivo de Perfil

- Merge: [4cc4bbbc475c](https://github.com/Kzera-Team/Kzeraap/commit/4cc4bbbc475c7f8ef2e45f3680a5735824bbf909); pais 48090af e bbdb331.
- A primeira perna continha o fallback do filtro quando não há cards.
- A segunda perna continha a coleta de patch completo do card.
- O resultado contém ambas.
- `git show --remerge-diff` não produziu diff, evidenciando remerge automático idêntico: não houve resolução manual material.
- Classificação: **PRESERVADO**, confiança **ALTO**.

## Sobreposições sem merge para a base

- `PerfilImportacaoBinder.ts` recebeu três implementações concorrentes: kzera-v0-19-51, claude/new-session-pv3jdm e 63aae81/a8585f4. Nenhuma chegou à base.
- `createPerfilUiApp.ts` recebeu reprocessamento em bb0d9f4, revert em cc5d692 e nova implementação em 63aae81. A base contém o estado pós-revert.
- `FluxoImportacaoPerfisUseCase.ts` tem variante 9424ff6 fora da base.
- O commit 06556b9 copiou a factory operacional de branch divergente; o blob é idêntico, portanto sem perda por cópia.

## Conclusão

Não foi comprovado merge de Cliente/Perfil com conflito resolvido manualmente. As sobreposições mais relevantes ficaram em branches paralelas, sem merge para a base.
