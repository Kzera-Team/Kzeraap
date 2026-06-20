# Importação de Perfis — Ajustes UX de Status

## Objetivo

Documentar o ajuste pequeno de UI/UX da tela existente de Importação de Perfis, sem redesenhar a tela e sem alterar o fluxo principal.

## Escopo aprovado

Implementar apenas o bloco 1 das pendências:

1. Corrigir/alinhamento visual do botão **Trocar** dentro do card de arquivo.
2. Implementar filtro por status: **Todos / Válidos / Atenção / Erros**.
3. Implementar status visual correto: verde / atenção / erro.
4. Garantir que `celular` continue vencendo quando `telefone` vier vazio.
5. Validar telefone obrigatório.
6. Tratar bairro vazio como **Atenção**, não como erro.

## Fora do escopo

Não implementar nesta etapa:

- Rascunho de importação.
- Persistência de rascunho em IndexedDB.
- Decisão AppSec sobre dados pessoais no rascunho.
- Regra final de duplicados.
- Decisão de importação parcial.
- Decisão final sobre comportamento quando houver erro e atenção juntos além da regra básica: erro bloqueia, atenção não bloqueia.
- Refatoração grande com `ImportacaoShell`.
- Redesenho completo da tela.

## Base real da tela

A alteração deve ser feita sobre a tela atual, não em tela nova.

Arquivos de referência:

- `src/presentation/perfil/PerfilDomView.ts`
- `src/presentation/perfil/binders/PerfilImportacaoBinder.ts`
- `src/domain/perfil/PerfilImportacao.ts`
- `public/styles.css`
- `docs/mockups/importacao-perfis-status.html`

## Mockup criado

Arquivo:

- `docs/mockups/importacao-perfis-status.html`

Uso:

- Abrir o HTML no navegador para visualizar a proposta.
- O mockup usa a estrutura visual e classes da tela atual.
- Os nomes no mockup são fictícios e servem apenas para demonstrar estados visuais.

## Decisão UX

### Filtro de status

Local:

- Abaixo de `perfil-import-preview-head`.
- Acima de `perfil-import-preview`.

Formato:

- Botões segmentados.
- Ocupam a largura total do bloco no mobile.
- Devem exibir contadores.

Ordem:

1. `Todos (x)`
2. `Válidos (x)`
3. `Atenção (x)`
4. `Erros (x)`

Estado selecionado:

- Usar `aria-pressed="true"` no botão ativo.
- Alterar visual sem criar dropdown.

### Status visual no card

Cada card deve ter:

- Badge no topo do card.
- Borda sutil colorida.
- Texto curto.

Status:

| Status | Texto | Classe sugerida | Regra |
|---|---|---|---|
| Válido | `Válido` | `preview-ok` + `status-ok` | Registro completo e importável |
| Atenção | `Atenção` | `preview-warning` + `status-warning` | Registro importável com pendência não bloqueante |
| Erro | `Erro` | `preview-error` + `status-error` | Registro bloqueado por erro obrigatório |

### Bairro vazio

Regra UX:

- Bairro vazio não bloqueia importação.
- Card fica como **Atenção**.
- Mostrar mensagem discreta dentro do card.

Texto:

```text
Bairro não informado
```

### Telefone obrigatório

Regra UX:

- Telefone final vazio bloqueia importação.
- Card fica como **Erro**.
- Mostrar mensagem abaixo do campo telefone ou abaixo do par Telefone/Bairro.

Texto:

```text
Telefone obrigatório
```

### Botão Trocar

Local:

- Dentro do card de arquivo existente.
- Alinhado à direita.
- Compacto.
- Ação secundária.

Não fazer:

- Não transformar em botão principal.
- Não ocupar largura total.
- Não mover para fora do card.

## Regra funcional de telefone/celular

Regra obrigatória:

- Se `telefone` vier preenchido, usar `telefone`.
- Se `telefone` vier vazio e `celular` vier preenchido, usar `celular`.
- Se ambos vierem vazios, gerar erro `Telefone obrigatório`.

Ponto técnico:

- O mapeamento de cabeçalho deve aceitar `celular` como origem válida de `telefone`.
- Se existirem as duas colunas, `telefone` vazio não pode apagar o valor útil de `celular`.

## Modelo sugerido de status

A regra atual usa apenas `valido: boolean` e `erros: string[]`.

Para suportar Atenção sem misturar com Erro, o Desenvolvedor deve separar:

```ts
type PerfilImportacaoStatus = 'valido' | 'atencao' | 'erro';
```

Campo sugerido no preview:

```ts
status: PerfilImportacaoStatus;
avisos: string[];
erros: string[];
```

Regra:

```text
erros.length > 0  -> erro
avisos.length > 0 -> atencao
senão             -> valido
```

`valido` pode continuar existindo como compatibilidade, desde que represente apenas ausência de erro bloqueante.

## Regra do botão final

Texto obrigatório:

```text
Importar perfis
```

Comportamento:

- Sem preview: botão desabilitado pode orientar a escolher arquivo.
- Com erro: botão desabilitado.
- Com atenção apenas: botão habilitado.
- Com válido apenas: botão habilitado.

Mensagem de apoio:

- Quando houver erro: `Corrija os registros com erro antes de importar.`
- Atenção não deve exibir texto que pareça bloqueio.

## Filtro por status — comportamento

Critérios:

- `Todos`: todos os registros.
- `Válidos`: apenas status `valido`.
- `Atenção`: apenas status `atencao`.
- `Erros`: apenas status `erro`.

Contadores:

- Devem ser calculados sobre o preview completo, não sobre a lista filtrada.

Estado vazio filtrado:

- Se o filtro selecionado não tiver registros, mostrar mensagem curta.

Textos sugeridos:

```text
Nenhum perfil válido encontrado.
Nenhum perfil em atenção encontrado.
Nenhum perfil com erro encontrado.
```

## Acessibilidade e mobile

Obrigatório:

- Botões do filtro com `type="button"`.
- Botão ativo com `aria-pressed="true"`.
- Mensagens de erro/atenção em texto, não apenas cor.
- Contraste suficiente para leitura noturna.
- Layout mobile-first.
- Não criar bloco vazio grande.

## Dívida técnica observada

O `PerfilImportacaoBinder` concentra renderização, eventos e regras de apresentação em um único arquivo. Não bloquear este ajuste por isso, mas registrar como dívida técnica para futura extração.

Dívida técnica sugerida:

```text
Extrair renderização de cards/filtro da Importação de Perfis para componente dedicado antes de ampliar rascunho, duplicados ou importação parcial.
```

## Checklist UX para o Desenvolvedor

Antes de entregar, conferir:

- O filtro aparece abaixo de Pré-visualização e acima dos cards.
- O filtro não redesenha a tela inteira.
- Badge aparece no topo do card.
- Card com bairro vazio fica Atenção, não Erro.
- Card sem telefone fica Erro.
- Atenção não bloqueia importação.
- Erro bloqueia importação.
- O botão Trocar está compacto e alinhado à direita.
- O botão final continua claro: `Importar perfis`.
- Mobile não cria rolagem horizontal.
- Não há texto duplicado ou bloco vazio grande.

## Checklist técnico mínimo

Antes de concluir implementação:

```text
npm test:
npm run check:
npm run build:
```

Se algum falhar, a entrega não deve ser declarada pronta.
