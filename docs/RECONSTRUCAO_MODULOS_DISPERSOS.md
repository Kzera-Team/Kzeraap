# Reconstrução dos módulos dispersos — Kzera

Status: mapa operacional de reconstrução para retomada incremental sem regressão.
Data-base: 2026-07-15.
Branch consolidada: `work`.

## Regra de reconstrução

A hierarquia obrigatória de entrega é:

```text
Cliente/Perfil
└── Produto/Item
    └── Estoque
        └── Pesagem/Balança
            └── Importações
                ├── Cliente/Perfil
                ├── Produto/Item
                ├── Venda/Transação
                └── Financeiro/Movimentação/Pagamento
                    └── Venda/Transação
                        └── Fidelidade
```

Nenhuma entrega posterior deve ser isolada quebrando a dependência anterior. Produto é Item quando o contexto for cadastro/catálogo. Cliente é Perfil quando o contexto for UI/domínio atual. Venda é Transação. Pagamento é Movimentação quando o contexto for financeiro.

## Onde cada funcionalidade está hoje

| Ordem | Funcionalidade | Fonte atual na branch `work` | Origem histórica útil | Justificativa de preservação |
| --- | --- | --- | --- | --- |
| 1 | Cliente/Perfil | `src/domain/perfil`, `src/application/perfil`, `src/presentation/perfil`, `docs/modulos/PERFIS.md`, `docs/CLIENTE_*` | `5655c69` trouxe a base v1.19.26; `88efa3e` consolidou docs de módulo; série `PERFIS_1.8.x` em `docs/arquivados` preserva evolução | É a raiz da hierarquia. Importação de vendas exige Perfil existente e a UI usa Perfil como vocabulário aprovado. |
| 2 | Produto/Item | `src/domain/item`, `src/application/item`, `src/presentation/item`, `docs/modulos/ITENS.md`, `docs/arquivados/ITEMS_*` | `5655c69` e `88efa3e` consolidam os módulos; `ITEMS_CATALOGO_1.9.x` preserva catálogo/importação/UX | Produto não deve voltar como módulo separado na UI; o termo operacional é Item. |
| 3 | Estoque | `src/domain/estoque`, `src/application/estoque`, `src/domain/lote`, `src/application/item/*Lote*`, `docs/modulos/ESTOQUE.md` | `5655c69`/`88efa3e`; `LOTES_OPERACIONAIS_1.10.0`; `PROXIMA_ETAPA_ESTOQUE_1.9.49` | Estoque fica dentro de Item, com lotes e variações. Não deve ser separado como módulo solto. |
| 4 | Pesagem/Balança | `src/domain/operacao/Balanca.ts`, `src/domain/operacao/PesagemRapida.ts`, `src/application/operacao`, `src/application/item/PesagemRapidaFracionamentoUseCase.ts`, `docs/arquivados/BALANCAS_CONFIGURACOES_1.12.0.md`, `docs/arquivados/PESAGEM_RAPIDA_1.13.0.md` | `5655c69`/`88efa3e`; documentos 1.12.0 e 1.13.0 | Pesagem depende de Item/Estoque/Lote. Balança fica em Configurações e é consumida pela pesagem, não pelo dashboard principal. |
| 5 | Importação de Cliente/Perfil | `src/domain/perfil/PerfilImportacao*`, `src/application/perfil/*Importacao*`, `src/presentation/perfil/*Importacao*`, `docs/CLIENTE_IMPORTACAO_*`, `docs/modulos/IMPORTACAO.md` | `5655c69`; docs `CLIENTE_IMPORTACAO_1.0.x`; ajuste UX em `IMPORTACAO_PERFIS_STATUS_UX.md` | Rascunho de importação não é Perfil até confirmação explícita. Telefone é obrigatório para importar Perfil. |
| 6 | Importação de Produto/Item | `src/domain/item/ItemImportacao*`, `src/application/item/*Importacao*`, `src/presentation/item/*Importacao*`, `docs/arquivados/ITEMS_CATALOGO_1.9.6.md` | `5655c69`/`88efa3e`; série `ITEMS_CATALOGO_1.9.x` | Deve vir depois de Item e antes de Venda/Transação porque CSV de transação pode depender de Item existente ou mapeado. |
| 7 | Importação de Venda/Transação e Financeiro | `src/domain/importacao`, `src/application/importacao`, `src/presentation/importacao`, `src/domain/financeiro`, `src/application/financeiro`, `docs/importacao/*`, `docs/TRANSACOES_IMPORTACAO_CSV_1.13.2.md` | `55a3e8a` adiciona regras financeiras históricas; `443598f` integra teste e2e; `9424ff6` restaura reprocessamento de pendência de Item; `bb0d9f4` foi revertido por `b0be2b3` | Confirmação histórica pode criar transação, pagamento e movimento financeiro, mas importação histórica não baixa estoque. Pendências de Perfil/Item devem ficar no staging. |
| 8 | Vendas/Transações | `src/domain/transacao`, `docs/modulos/VENDAS.md`, `mockups/venda_manual` | `5655c69`/`88efa3e`; mockups de venda manual na árvore atual | Venda depende de Perfil opcional/selecionado, Item, Estoque e Pagamento. Mockups de venda manual devem ser preservados como base UX. |
| 9 | Fidelidade | `docs/mockups/fidelidade`, referências em `src/domain/campanha` | commits `3897b7b`, `38b3467`, `e27c7a0`, `485eb83` ajustam mockups de fidelidade | Ainda está majoritariamente como mockup. Deve virar módulo somente depois de Venda/Transação, pois pontuação depende de transações concluídas e regras de campanha/prêmio. |

## Árvore de reconstrução por branches de trabalho

Use estes branches semânticos para paralelizar sem atropelar dependências:

```text
reconstrucao/00-documentacao-rose
reconstrucao/01-cliente-perfil
reconstrucao/02-produto-item
reconstrucao/03-estoque-lote
reconstrucao/04-pesagem-balanca
reconstrucao/05-importacao-perfil
reconstrucao/06-importacao-item
reconstrucao/07-importacao-transacao-financeiro
reconstrucao/08-venda-transacao
reconstrucao/09-fidelidade
```

### Ordem de merge

1. `reconstrucao/00-documentacao-rose`
2. `reconstrucao/01-cliente-perfil`
3. `reconstrucao/02-produto-item`
4. `reconstrucao/03-estoque-lote`
5. `reconstrucao/04-pesagem-balanca`
6. `reconstrucao/05-importacao-perfil`
7. `reconstrucao/06-importacao-item`
8. `reconstrucao/07-importacao-transacao-financeiro`
9. `reconstrucao/08-venda-transacao`
10. `reconstrucao/09-fidelidade`

Se houver conflito entre versões, não descartar nenhum lado durante a reconstrução. Registrar os dois em seção `Conflitos preservados` do PR e só então escolher. A versão mais recente é candidata padrão, mas não é regra absoluta quando a versão antiga contém decisão de negócio aprovada.

## Documentação que não pode ser perdida

- `docs/INDICE_DE_DOCUMENTACAO.md`: entrada oficial por papel e módulo.
- `docs/LEITURA_DIARIA.md`: leitura inicial do time.
- `docs/modulos/*.md`: contratos vivos por módulo.
- `docs/aprovado-lider/**` e `docs/aprovados-lider/**`: material aprovado por liderança/design.
- `docs/importacao/**`: regras atuais de importação, staging, conciliação e confirmação histórica.
- `docs/mockups/fidelidade/**` e `mockups/venda_manual/**`: mockups que ainda são fonte de produto.
- `docs/arquivados/**`: versões antigas úteis; não deletar sem migração explícita para documento vivo.

## Separação de conflitos conhecidos

- `ReprocessarPendenciasPerfilUseCase`: existe commit de implementação (`bb0d9f4`) e revert (`b0be2b3`). Não reintroduzir sem decisão, porque o histórico indica remoção não autorizada.
- Duplicatas com sufixo ` 2.md` em `docs/arquivados`: são lixo provável, mas podem conter divergência. Antes de remover, comparar conteúdo e mover decisão para PR próprio de limpeza.
- Fidelidade: há mockups prontos, mas falta domínio/use cases completos. Não implementar junto com Venda para evitar regressão.
- Importação histórica financeira: manter separada de baixa de estoque. A regra documentada diz que importação histórica não baixa estoque.

## Prompts de trabalho por desenvolvedor

### Dev 1 — Cliente/Perfil

Reconstrua somente Cliente/Perfil na branch `reconstrucao/01-cliente-perfil`. Preserve a UI como Perfil, garanta cadastro, busca, histórico, pendências, duplicidades, importação/exportação e confirme que nenhum rascunho vira Perfil antes da confirmação. Não mexa em Item, Estoque, Venda ou Fidelidade.

### Dev 2 — Produto/Item

Reconstrua Produto como Item na branch `reconstrucao/02-produto-item`. Preserve catálogo, variações, importação/exportação e UX de cards. Não separar Estoque como módulo externo; apenas preparar pontos de integração para a branch de Estoque.

### Dev 3 — Estoque/Lote/Pesagem

Reconstrua Estoque dentro de Item nas branches `reconstrucao/03-estoque-lote` e `reconstrucao/04-pesagem-balanca`. Preserve lotes, fracionamento, inventário, saída interna, pesagem rápida e cadastro de balanças em Configurações. Não baixar estoque por importação histórica.

### Dev 4 — Importações

Reconstrua importações nas branches `reconstrucao/05-importacao-perfil`, `reconstrucao/06-importacao-item` e `reconstrucao/07-importacao-transacao-financeiro`. Mantenha staging, pendências, conciliação, confirmação histórica, recuperação de falha e vínculo transação-pagamento-movimentação. Não criar Perfil/Item automaticamente sem confirmação explícita.

### Dev 5 — Venda/Transação

Reconstrua Venda como Transação na branch `reconstrucao/08-venda-transacao`. Use os mockups de venda manual como referência, respeite Perfil, Item, Estoque, Pagamento/Movimentação e recibo. Não acoplar Fidelidade nesta branch; apenas emitir eventos/contratos que Fidelidade possa consumir depois.

### Dev 6 — Fidelidade

Reconstrua Fidelidade na branch `reconstrucao/09-fidelidade`. Comece pelos mockups existentes em `docs/mockups/fidelidade`, derive regras de campanha/prêmio e conecte somente com Transações concluídas. Não mexa no fluxo de venda já estabilizado.

## Checklist anti-regressão por PR

- Rodar `npm run check`.
- Rodar `npm run build`.
- Quando alterar importação financeira, rodar também `node tools/test-importacao-flow.mjs` se o ambiente tiver navegador disponível.
- Quando alterar UI/mockup, anexar evidência visual conforme checklist aprovado.
- Atualizar este documento ou o documento de módulo afetado quando uma decisão dispersa for consolidada.
