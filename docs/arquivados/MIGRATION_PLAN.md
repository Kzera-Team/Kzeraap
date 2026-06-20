# Plano de Migração

## Estratégia

A versão anterior do Kzera deve ser usada como referência funcional, não como base arquitetural principal.

## Passos

1. Consolidar fundação.
2. Criar contratos e módulos.
3. Migrar Perfil.
4. Migrar Segurança.
5. Migrar Backup.
6. Migrar Item e Lote.
7. Migrar Campanhas.
8. Migrar Transacao.
9. Migrar Relatórios.
10. Redesenhar UX principal.

## Regra

Não migrar telas antigas para a nova base antes de o módulo correspondente possuir:
- domínio;
- caso de uso;
- repositório;
- controller;
- testes mínimos.
