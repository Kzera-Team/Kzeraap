# Kzera 1.9.14 - Runtime hardening

Entregue:
- Limpeza centralizada de buffers em `RuntimeCleanup`.
- `PayloadProvider` limpa buffers de entrada, saída, IV e AAD.
- `MaterialService` limpa buffer derivado de senha e salt temporário.
- `PerfilRepository` limpa payload de trabalho após merge.
- `AccessCoordinator` reduz vida útil de buffers temporários de runtime.

Sem aplicar cache, memoização agressiva ou virtualização por segurança.
