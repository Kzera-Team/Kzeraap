# Kzera Foundation 1.0.2 - Persistência Segura Base

Objetivo desta parte: criar a base de persistência sem voltar ao acoplamento antigo.

## Entregue

- `IndexedDbConnection`
- `IndexedDbRepository<T>`
- `KeyValueStore`
- `RuntimeMetadataKeyValueStore`
- `TableMapKeyValueStore`
- `createPerfilRepository()`

## Regras de arquitetura

1. Repositório de domínio depende de interface, não de IndexedDB direto.
2. Persistência IndexedDB fica em `infrastructure/`.
3. Perfil continua sendo salvo via `PerfilRepository`.
4. Campos sensíveis continuam criptografados antes de persistir.
5. Nome físico da tabela de perfis deve vir do `TableObfuscator`.
6. O mapa lógico/físico de tabelas deve ser persistido criptografado.

## Limites desta parte

- Ainda não há UI.
- Ainda não há fluxo visual de primeiro acesso.
- Ainda não há migração de transacoes, itens e campanhas.
- Ainda não há exportação real de backup.
