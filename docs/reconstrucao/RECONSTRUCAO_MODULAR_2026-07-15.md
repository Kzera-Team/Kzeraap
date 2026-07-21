# Reconstrução modular — Kzeraap — 2026-07-15

Este documento consolida a reconstrução real levantada na branch `work`, preservando o que já estava pronto e organizando a árvore de entrega por dependência funcional.

## Decisão de hierarquia

A ordem de integração e de trabalho deve respeitar a cadeia abaixo:

```text
Cliente/Perfil
└── Produto/Item
    └── Estoque
        └── Pesagem/Balança
            └── Importações
                ├── Importação de cliente/perfil
                ├── Importação de produto/item
                └── Importação de venda/transação e financeiro
                    └── Venda/Transação
                        └── Fidelidade/Campanha
```


## Versões numeradas da reconstrução

Todas as versões usadas como referência nesta reconstrução ficam numeradas para não existir menção solta a “versão 2” ou “versão 3” sem a versão 1.

| Versão | Papel na reconstrução | Conteúdo associado | Decisão |
|---:|---|---|---|
| 1 | Base canônica atual | Branch local `work`, com módulos já consolidados e documentação reorganizada. | É a base de comparação e de onde nascem os branches `reconstrucao/01-*`. |
| 2 | Recuperação funcional dispersa | Commits e branches citados para Item, Estoque, Pesagem, Importações e Financeiro, especialmente `merge_produto_testes`, `testes_transacao_importar` e registros arquivados. | Usar para conferir lacunas funcionais antes de promover para branch de módulo. |
| 3 | Experiência/UX e próximos módulos | Mockups de Venda manual e Fidelidade, além do domínio inicial `Campanha`. | Usar como entrada de implementação futura, sem misturar com módulos anteriores enquanto houver regra pendente. |

### Laudos para baixar

- [Laudo versão 01 — Base canônica atual](laudos/LAUDO_VERSAO_01_BASE_CANONICA.md)
- [Laudo versão 02 — Recuperação funcional dispersa](laudos/LAUDO_VERSAO_02_RECUPERACAO_FUNCIONAL.md)
- [Laudo versão 03 — Experiência/UX e próximos módulos](laudos/LAUDO_VERSAO_03_UX_PROXIMOS_MODULOS.md)

## Vocabulário semântico obrigatório

| Nome de negócio | Nome no código/UI quando aplicável | Observação |
|---|---|---|
| Cliente | Perfil | Usar Perfil na UI e no domínio já existente. |
| Produto | Item | Produto só aparece como explicação semântica; implementação usa Item. |
| Venda | Transação | Venda manual ainda está em mockups; financeiro usa transações. |
| Pagamento | Movimentação | No financeiro, pagamento deve cair como movimentação/transação financeira. |
| Fidelidade | Campanha | O domínio inicial já possui `Campanha`, e os mockups estão em Fidelidade. |

## Árvore reconstruída na branch `work`

| Ordem | Módulo | Estado reconstruído | Arquivos centrais | Origem levantada |
|---:|---|---|---|---|
| 1 | Cliente/Perfil | Cadastro, busca, histórico, pendências, duplicidades, importação/exportação e código do perfil presentes. | `src/domain/perfil`, `src/application/perfil`, `src/presentation/perfil`, `src/app/createPerfilModule.ts`, `src/app/createPerfilUiApp.ts` | Commits recentes relevantes: `bb0d9f4` adicionou reprocessamento de pendências de perfil, depois revertido por `b0be2b3`; `cc5d692` restaurou composição de perfil. A base final preservada está na branch `work`. |
| 2 | Produto/Item | Catálogo, busca, cadastro/edição, importação/exportação, dashboard e operações de lote presentes. | `src/domain/item`, `src/application/item`, `src/presentation/item`, `src/app/createItemCatalogoModule.ts`, `src/app/createItemCatalogoUiApp.ts` | `9424ff6` restaurou `ReprocessarPendenciasItemNomeUseCase` e correções de qualidade; `5e4c2aa`, `79766ff` e cadeia de estoque de 2026-06-23 compõem operações de lote. |
| 3 | Estoque | Estoque está subordinado a Item, com inventário, saída interna, fracionamento e movimentação. | `src/domain/estoque/Estoque.ts`, `src/application/estoque/RegistrarMovimentacaoEstoqueUseCase.ts`, `src/application/item/RegistrarInventarioLoteUseCase.ts`, `src/application/item/RegistrarSaidaInternaLoteUseCase.ts`, `src/application/item/RegistrarFracionamentoLoteUseCase.ts` | Sequência de 2026-06-23: `a029662`, `216e0a8`, `e4b75cc`, `5e23a6`, `89752b3`, `eb29808`. |
| 4 | Pesagem/Balança | Pesagem rápida e balanças existem como camada operacional, dependentes do Item/Lote. | `src/domain/operacao/Balanca.ts`, `src/domain/operacao/PesagemRapida.ts`, `src/application/operacao`, `src/application/item/PesagemRapidaFracionamentoUseCase.ts`, `src/presentation/item/binders/LotePesagemRapidaBinder.ts` | Documentos arquivados `BALANCAS_CONFIGURACOES_1.12.0`, `PESAGEM_RAPIDA_1.13.0` e `PESAGEM_INTERROMPIDA_1.13.1`; implementação presente em `work`. |
| 5 | Importações | Perfil, Item, rascunho/retomada, staging, pendências e importação financeira/histórica presentes. | `src/domain/importacao`, `src/application/importacao`, `src/infrastructure/importacao`, `src/infrastructure/repositories/Importacao*`, `src/presentation/importacao`, `src/app/importacao` | `fe22c82` corrigiu confirmação de pacote sem aprovados; `bb0d9f4` tentou pendência de perfil e foi revertido por `b0be2b3`; `9424ff6` preservou reprocessamento de nome de Item. |
| 6 | Importação venda/transação/financeiro | Importação de transações financeiras, conciliação, confirmação histórica, relatórios e telas financeiras presentes. | `src/domain/importacao/ImportacaoTransacoesFinanceiro.ts`, `src/application/importacao/PrepararImportacaoTransacoesUseCase.ts`, `src/application/importacao/PrepararImportacaoFinanceiraUseCase.ts`, `src/application/importacao/ConciliarTransacoesFinanceiroUseCase.ts`, `src/application/importacao/ConfirmarImportacaoHistoricaFinanceiraUseCase.ts`, `src/app/composition/createImportacaoFinanceiroComposition.ts`, `src/app/financeiro` | Branches/documentos anteriores apontam `testes_transacao_importar`, `merge_produto_testes` e docs de importação financeira como origem dispersa; na branch atual o código já está consolidado. |
| 7 | Venda/Transação | Modelo de transação e regras existem; venda manual está preservada como mockup e ainda não deve baixar estoque sem regra clara. | `src/domain/transacao`, `src/application/financeiro/RegistrarTransacaoFinanceiraUseCase.ts`, `mockups/venda_manual` | Sequência de mockups de venda manual de 2026-06-23 (`4a1f112`, `2e0c8a0`, `d8a75d1`, `6310f82`, `9da88e6`, `3d5e299`, `3b64a0f`, `3f31290`). |
| 8 | Fidelidade/Campanha | Fidelidade está preservada como mockups; domínio base de Campanha existe, mas sem integração de tela no menu. | `docs/mockups/fidelidade`, `src/domain/campanha/Campanha.ts` | Mockups de fidelidade: `0cb29e4`, `38b3467`, `e27c7a0`, `485eb83`. Como há apenas mockup e domínio base, deve virar branch própria sem bloquear módulos anteriores. |

## Branches de trabalho recomendadas

Como o clone atual contém apenas a branch local `work`, os nomes abaixo são os ramos de isolamento recomendados para reabrir trabalho sem regressão. Cada branch deve nascer da anterior para respeitar dependência.

| Branch sugerida | Base | Responsável sugerido | Escopo |
|---|---|---|---|
| `reconstrucao/01-perfil` | `work` | Dev Perfil + QA | Congelar Cliente/Perfil, importação de perfis, duplicidade, histórico e código do perfil. |
| `reconstrucao/02-item` | `reconstrucao/01-perfil` | Dev Produto/Item | Congelar catálogo, busca, edição, importação/exportação e dashboard de Item. |
| `reconstrucao/03-estoque` | `reconstrucao/02-item` | Dev Estoque | Revisar inventário, lote, saída interna, fracionamento e movimentação sem criar módulo solto. |
| `reconstrucao/04-pesagem-balanca` | `reconstrucao/03-estoque` | Dev Operação | Isolar balanças, calibragem, balança padrão e pesagem rápida dentro de lote/item. |
| `reconstrucao/05-importacoes` | `reconstrucao/04-pesagem-balanca` | Dev Importação | Unificar importação de perfil, item, rascunho/retomada e pendências. |
| `reconstrucao/06-importacao-financeira` | `reconstrucao/05-importacoes` | Dev Financeiro | Isolar staging/conciliação/confirmar histórico de transações financeiras. |
| `reconstrucao/07-vendas` | `reconstrucao/06-importacao-financeira` | Dev Vendas + UX | Transformar mockups de venda manual em fluxo real sem baixar estoque sem regra explícita. |
| `reconstrucao/08-fidelidade` | `reconstrucao/07-vendas` | Dev Fidelidade + UX | Promover mockups de fidelidade para módulo real usando Campanha como domínio inicial. |

## Conflitos e decisões preservadas

- `ReprocessarPendenciasPerfilUseCase` aparece como conflito histórico: `bb0d9f4` adicionou, mas `b0be2b3` removeu por não autorização. Não foi reintroduzido automaticamente.
- `ReprocessarPendenciasItemNomeUseCase` foi restaurado em `9424ff6` e está presente; manter porque corrige pendências de item sem reabrir conflito de perfil.
- A regra de documentação da Rose foi mantida: documentação modular em `docs/modulos`, processo em `docs/processo`, projeto em `docs/projeto`, governança em `docs/governanca` e reconstrução em `docs/reconstrucao`.
- Fidelidade não deve ser misturada com Venda agora: há mockup bom, mas sem tela integrada e sem casos de uso de aplicação.
- Venda não deve baixar estoque até a regra estar explícita e coberta por teste/check.

## Checks anti-regressão para cada branch

```bash
npm run check
npm run build
git diff --name-only <base>...HEAD
```

Para tela perceptível, anexar evidência visual antes de PR.

## Trompete/prompt de trabalho por desenvolvedor

Use estes prompts curtos para abrir cada frente sem atropelar a anterior:

1. **Perfil:** "Trabalhe em `reconstrucao/01-perfil`. Não altere Item/Estoque. Congele Perfil: cadastro, busca, histórico, importação, duplicidade e código do perfil. Rode `npm run check` e `npm run build`."
2. **Item:** "Trabalhe em `reconstrucao/02-item`, baseada em `reconstrucao/01-perfil`. Não mexa em estoque além dos pontos chamados por Item. Congele catálogo, edição, importação/exportação e dashboard."
3. **Estoque:** "Trabalhe em `reconstrucao/03-estoque`, baseada em `reconstrucao/02-item`. Estoque deve continuar dentro de Item/Lote. Validar inventário, saída interna, fracionamento e movimentação."
4. **Pesagem/Balança:** "Trabalhe em `reconstrucao/04-pesagem-balanca`, baseada em `reconstrucao/03-estoque`. Isolar balança e pesagem rápida sem criar módulo paralelo fora de Item/Lote."
5. **Importações:** "Trabalhe em `reconstrucao/05-importacoes`, baseada em `reconstrucao/04-pesagem-balanca`. Unificar importação de Perfil e Item, rascunho/retomada e pendências. Não reintroduzir `ReprocessarPendenciasPerfilUseCase` sem decisão."
6. **Importação financeira:** "Trabalhe em `reconstrucao/06-importacao-financeira`, baseada em `reconstrucao/05-importacoes`. Isolar staging, conciliação e confirmação histórica de transações financeiras, preservando telas existentes."
7. **Vendas:** "Trabalhe em `reconstrucao/07-vendas`, baseada em `reconstrucao/06-importacao-financeira`. Transformar mockups de venda manual em fluxo real. Não baixar estoque sem regra explícita e teste."
8. **Fidelidade:** "Trabalhe em `reconstrucao/08-fidelidade`, baseada em `reconstrucao/07-vendas`. Promover mockups de Fidelidade para módulo real usando `Campanha` como domínio inicial, sem misturar com Venda até contrato definido."
