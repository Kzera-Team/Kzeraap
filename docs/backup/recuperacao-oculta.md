# Recuperação oculta de backup

## Estado atual

Foi adicionado um gatilho discreto na tela de criação de senha:

- Tela: primeiro acesso / criar senha
- Alvo: ícone do sistema `.auth-icon`
- Gatilho: 10 cliques em até 5 segundos
- Ação: abre seletor de arquivos
- Formatos aceitos: `.dat`, `.json`, `application/json`, `application/octet-stream`, `text/plain`

## Segurança

Nesta etapa, o fluxo não restaura dados automaticamente.

O seletor apenas:

1. lê o arquivo;
2. valida se parece um envelope de backup do sistema;
3. guarda temporariamente o payload em `sessionStorage` sob a chave `kzera_pending_backup_recovery`;
4. informa que o próximo passo é o restaurador seguro.

## Motivo

O sistema já possui exportação criptografada de backup, mas ainda não possui um restaurador seguro completo.

Para restauração real ainda é necessário implementar:

- validação de schema;
- abertura/descriptografia com a senha correta;
- prévia antes de sobrescrever dados;
- restauração por store;
- backup do estado atual antes de restaurar;
- rollback em caso de falha.
