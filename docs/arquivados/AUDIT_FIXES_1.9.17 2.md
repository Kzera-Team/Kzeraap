# Kzera 1.9.17 - Correções reais da auditoria

Implementado:
- Teste de autenticação atualizado para o fluxo real `AccessCoordinator.open`.
- Contrato `item-stock-badge` restaurado no HTML real via `BadgeOptions.testId`.
- Removidos comentários artificiais de compatibilidade.
- Corrigida limpeza da prévia de importação de itens sem corromper rejeitados.
- Removido uso inútil de `releaseObject` sobre coleção de catálogo retornada pelo repositório.
- Exportação de perfis limpa apenas linhas derivadas de exportação.
- Testes 1.9.17 verificam implementação real, não comentários.
