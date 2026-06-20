# 1.10.2 — Correções críticas de base operacional

Esta versão aplica os ajustes encontrados na auditoria da Usuária sobre a 1.10.1.

## Correções aplicadas

- Perfis e Itens deixam de depender de repositório em memória no app principal e passam a usar IndexedDB quando disponível, com fallback em memória apenas para ambiente sem IndexedDB.
- Data do lote informada no cadastro passa a ser usada no `dataLancamento`; o sistema não ignora mais o campo visual.
- Backup pendente de janela anterior continua obrigatório após meia-noite enquanto não for concluído.
- Bloqueio por ociosidade passa a reagendar a verificação enquanto a sessão estiver desbloqueada.
- Tela de Face ID ganhou fallback real por senha, sem prender o usuário em “tentar novamente”.
- Campo de Região operacional não salva mais o identificador técnico como município; salva o texto compreensível da opção selecionada.
- Ações ambíguas receberam ícone + texto: exportar, voltar, editar, arquivar, reativar, código, novo perfil e novo item.
- `npm test` e `npm run check` passam a rodar a mesma cobertura, incluindo testes críticos e TypeScript.

## Teste da Usuária

A pessoa cansada pode cadastrar perfil/item/lote, recarregar o app e não depender de memória volátil. Se Face ID falhar, existe senha na mesma tela. Se o backup das 23:00 ficou pendente, ele não desaparece às 00:10. Botões críticos não exigem adivinhação por ícone sozinho.

## Ainda não feito

Esta versão não implementa fracionamento real, pesagem rápida, balanças, conferência nem retirada interna. Esses itens continuam como Pendências funcionais para versões `1.11.0+`.
