# Kzera 1.9.13 - Camada runtime neutra

Entregue:
- `src/security` removido.
- Camada renomeada para `src/runtime`.
- Nomes internos neutralizados:
  - `SessionContext`
  - `ResourceScope`
  - `PayloadProvider`
  - `AccessCoordinator`
  - `ValueBox`
- Repositório de perfis renomeado para `PerfilRepository`.
- Codec JSON com limpeza de buffers intermediários (`Uint8Array.fill(0)`).
- Ciclo de recursos por `release/releaseAll`.
- API pública de autenticação preservada para não quebrar fluxo.

Observação: a neutralização reduz exposição semântica sem tornar o código ilegível ou enganoso.
