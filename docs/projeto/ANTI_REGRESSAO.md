# ANTI-REGRESSÃO — Kzera/Vevelt

Este documento registra comportamentos que não podem voltar após já terem sido corrigidos ou decididos.

## Entregas rejeitadas

- Entrega rejeitada deve ser refeita a partir da última versão boa.
- Código da versão rejeitada não pode ser reutilizado se ferir Clean Code, SOLID ou a arquitetura definida.
- Se a mesma entrega for rejeitada uma segunda vez, todo o código da tentativa rejeitada deve ser descartado e não pode ser reutilizado.

## Papéis

- Só responde o papel chamado pelo usuário.
- Se outro papel for necessário, sinalizar risco e pedir autorização antes de assumir.
- Não assumir Tech Lead quando a pergunta foi feita ao Desenvolvedor.
- Não assumir Segurança/AppSec sem ser chamado; se houver risco, sinalizar e pedir autorização.

## Importação

- Não voltar header antigo na tela de importação.
- Não duplicar abas.
- Não inserir layout novo dentro de tela antiga.
- Não criar bloco roxo gigante antes do painel de importação.
- Não salvar importação diretamente ao escolher arquivo.
- Não colocar botão de ação desalinhado ou parcialmente fora do card.
- Não chamar atenção de bairro vazio como erro impeditivo.
- Não permitir que coluna `telefone` vazia apague valor vindo de `celular`.

## Entrega e teste

- Não gerar zip oficial sem versão rastreável.
- Não entregar apenas zip fonte; entrega oficial deve ter fonte + Netlify.
- Não dizer “testado no iPhone” se foi testado apenas em Chromium.
- Não dizer “100%” sem prova real.
- Não entregar sem checklist final completo.
