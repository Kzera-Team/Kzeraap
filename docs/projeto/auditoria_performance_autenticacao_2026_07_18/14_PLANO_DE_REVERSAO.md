# Plano de reversão

Não há mudança funcional a reverter nesta auditoria. Para a futura solução aprovada, a reversão deve: (1) retirar a política compartilhada no único validador servidor, (2) invalidar sessões emitidas durante a janela temporária, (3) restaurar políticas por identidade e (4) não tocar dados locais criptografados, que não devem depender do segredo transitório de autenticação.
