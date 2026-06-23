# KZERA — Regras de negócio da importação de transações

## 1. Escopo

Este documento consolida a regra de negócio aprovada para a importação de transações.

A importação começa quando o usuário escolhe o arquivo e termina em um destes destinos:

```txt
1. Transação importada automaticamente.
2. Registro salvo no staging com pendência.
3. Registro salvo no staging como erro, duplicado ou ignorado.
```

Não existe status intermediário `pronto_para_importar`.

Regra central:

```txt
Se está válido, importa agora.
Se tem conflito obrigatório, salva staging.
```

---

## 2. Vocabulário obrigatório

Usar sempre:

```txt
transação
item
perfil
```

Não usar:

```txt
venda
produto
cliente como campo persistido de importação
```

Campo oficial vindo da planilha:

```ts
codigoTransacaoOrigem: string;
```

Regra:

```txt
codigoTransacaoOrigem é único.
Na planilha nunca se repete.
```

---

## 3. Segurança de dados sensíveis

Regra obrigatória:

```txt
Nenhum nome de perfil pode ser salvo descriptografado no banco.
```

Permitido:

```txt
Carregar nome de perfil em memória durante a importação.
Comparar nome da planilha com nomes em memória.
Persistir apenas perfilId ou perfilIdsCandidatos.
```

Proibido persistir:

```txt
nome do perfil
nome do perfil vindo da planilha
nome de candidato
mensagem de erro com nome
log com nome
observação com nome
staging com nome
```

Erro seguro:

```txt
Transação TX-123: perfil não identificado.
Transação TX-123: mais de um perfil possível.
Linha 42: estrutura inválida.
```

Nunca:

```txt
Cliente João Silva não identificado.
```

---

## 4. Fluxo após escolha do arquivo

```txt
1. Parser lê o arquivo.
2. Gera RegistroBrutoImportacaoTransacao em memória.
3. Carrega perfis em memória.
4. Resolve perfil por nome em memória.
5. Resolve itens por lote.
6. Se necessário, cria lote histórico encerrado.
7. Resolve ou cria forma de pagamento.
8. Decide destino.
9. Se OK, importa automaticamente.
10. Se conflito, salva staging seguro.
```

---

## 5. O que bloqueia importação automática

```txt
perfil não identificado
perfil ambíguo
item/lote não resolvido
quantidade inválida
unidade inválida
valor inválido
erro de estrutura
duplicidade por codigoTransacaoOrigem
```

---

## 6. O que não bloqueia importação automática

```txt
forma de pagamento inexistente
conta financeira indefinida
pagamento não conciliado
diferença financeira para conciliação posterior
```

Regra aprovada:

```txt
Forma de pagamento inexistente é criada automaticamente.
A transação segue importada.
Pagamento fica pendente de conciliação.
```

---

## 7. Status da importação

Fica em:

```txt
registrosImportacaoTransacoes.statusImportacao
```

Tipo:

```ts
export type StatusImportacaoTransacao =
  | 'pendente_perfil'
  | 'pendente_item'
  | 'pendente_perfil_e_item'
  | 'erro_estrutura'
  | 'duplicado'
  | 'ignorado'
  | 'importado';
```

Significados:

```txt
importado
Já virou dado oficial.

pendente_perfil
Não importou porque o perfil não foi identificado com segurança.

pendente_item
Não importou porque algum item/lote precisa normalização.

pendente_perfil_e_item
Não importou porque perfil e item/lote têm pendência.

erro_estrutura
Não importou porque a linha/registro está inválido.

duplicado
Não importou porque codigoTransacaoOrigem já existe.

ignorado
Usuário decidiu não importar aquele registro.
```

Depois de `importado`, o controle financeiro começa em:

```txt
TransacaoFinanceira.statusFinanceiro = pendente_conciliacao
```

---

## 8. Perfil na importação

Interface em memória:

```ts
export interface PerfilImportacaoMemoria {
  id: string;
  nome: string;
}
```

Normalização é função temporária, não campo nem interface persistida:

```ts
export function normalizarTextoImportacao(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}
```

Resultado persistível:

```ts
export type StatusPerfilImportacaoTransacao =
  | 'resolvido'
  | 'pendente_perfil'
  | 'perfil_ambiguo';

export type MotivoPerfilImportacaoTransacao =
  | 'nenhum_perfil_correspondente'
  | 'multiplos_perfis_correspondentes';

export interface ResultadoResolucaoPerfil {
  status: StatusPerfilImportacaoTransacao;
  perfilIdResolvido?: string;
  perfilIdsCandidatos?: string[];
  motivoPerfil?: MotivoPerfilImportacaoTransacao;
}
```

---

## 9. ItemTransacao oficial

Decisão aprovada:

```txt
ItemTransacao guarda somente loteId.
Não guarda itemId.
Não guarda variacaoId.
```

Modelo:

```ts
export type StatusElegibilidadeItemTransacao =
  | 'normal'
  | 'suspeito_valor'
  | 'inelegivel_manual'
  | 'brinde'
  | 'premio_fidelidade'
  | 'cancelado';

export type OrigemItemTransacao =
  | 'importado_csv'
  | 'manual';

export interface ItemTransacao {
  id: string;
  transacaoId: string;
  perfilId?: string;

  loteId: string;

  descricaoOriginal: string;

  quantidadeOriginal: number;
  unidadeOriginal?: string;

  quantidade: number;
  unidade: string;
  valorTotal: number;

  statusElegibilidade: StatusElegibilidadeItemTransacao;
  motivoElegibilidade?: string;

  origem: OrigemItemTransacao;

  createdAt: string;
  updatedAt: string;
}
```

Relação:

```txt
ItemTransacao.loteId
→ ItemLote
→ ItemVariacao
→ ItemCatalogo
```

---

## 10. Status do item importado no staging

```ts
export type StatusItemImportadoTransacao =
  | 'resolvido'
  | 'pendente_lote'
  | 'pendente_quantidade'
  | 'pendente_unidade'
  | 'pendente_valor'
  | 'ignorado';
```

Modelo:

```ts
export interface ItemImportadoTransacao {
  descricaoOriginal: string;

  quantidadeOriginal: number;
  unidadeOriginal?: string;

  loteIdResolvido?: string;

  quantidade?: number;
  unidade?: string;
  valorTotal?: number;

  statusItem: StatusItemImportadoTransacao;
  pendencias: StatusItemImportadoTransacao[];

  statusElegibilidade?: StatusElegibilidadeItemTransacao;
  motivoElegibilidade?: string;
}
```

Regra:

```txt
Se não há loteIdResolvido, o item não está resolvido.
```

---

## 11. Lote histórico importado

Decisão aprovada:

```txt
Não adicionar origem em ItemLote.
Não poluir ItemLote com campo usado por poucos registros.
Criar metadado separado para lotes históricos importados.
```

Modelo:

```ts
export interface LoteImportacaoHistorica {
  id: string;

  loteId: string;
  loteImportacaoId: string;

  chaveAgrupamento: string;

  variacaoIdOrigem: string;
  valorUnitario: number;
  quantidadeTotal: number;

  createdAt: string;
  updatedAt: string;
}
```

Regra de agrupamento:

```txt
loteImportacaoId + variacaoId + valorUnitario
```

Função:

```ts
export function criarChaveAgrupamentoLoteHistorico(input: {
  loteImportacaoId: string;
  variacaoId: string;
  valorUnitario: number;
}): string {
  return [
    input.loteImportacaoId,
    input.variacaoId,
    input.valorUnitario.toFixed(2),
  ].join('::');
}
```

Lote histórico criado em `ItemLote`:

```txt
status = encerrado
quantidadeGuardada = 0
custo = 0
custoTotal = 0
custoUnitario = 0
```

Regra:

```txt
Lote histórico importado não vira estoque disponível.
```

---

## 12. Staging persistido

```ts
export interface RegistroImportacaoTransacao {
  id: string;
  loteId: string;

  linhaOrigem: number;
  codigoTransacaoOrigem: string;

  dataTransacao?: string;

  perfilIdResolvido?: string;
  perfilIdsCandidatos?: string[];

  statusPerfil?: StatusPerfilImportacaoTransacao;
  motivoPerfil?: MotivoPerfilImportacaoTransacao;

  itens: ItemImportadoTransacao[];

  subtotal?: number;
  desconto?: number;
  entrega?: number;
  taxa?: number;
  total?: number;

  pagamentos: PagamentoImportadoTransacao[];

  statusImportacao: StatusImportacaoTransacao;

  erroSeguro?: string;

  assinaturaImportacao: string;

  createdAt: string;
  updatedAt: string;
}
```

Proibição:

```txt
RegistroImportacaoTransacao nunca salva nome de perfil.
```

---

## 13. Forma de pagamento

```ts
export interface PagamentoImportadoTransacao {
  formaPagamentoOriginal: string;
  formaPagamentoId?: string;

  valor: number;

  status:
    | 'resolvido'
    | 'forma_pagamento_criada'
    | 'pendente_conciliacao';

  createdAt: string;
  updatedAt: string;
}
```

Regra:

```txt
Forma de pagamento inexistente é criada automaticamente.
Pagamento oficial nasce pendente_conciliacao.
```

---

## 14. Arquitetura Clean Code / SOLID

Regras:

```txt
Funções pequenas.
Métodos curtos.
Nunca duplicar código.
Use case principal orquestra, não concentra regra.
Tela não decide regra de negócio.
Repository não decide regra de negócio.
Factories centralizam retorno padronizado quando fizer sentido.
Não quebrar método só por estética.
```

Estrutura sugerida:

```txt
src/application/importacao/transacoes/
  ProcessarArquivoImportacaoTransacoesUseCase.ts
  ImportarTransacaoConfirmadaUseCase.ts
  SalvarRegistroImportacaoPendenteUseCase.ts

  services/
    ResolverPerfilImportacaoService.ts
    ResolverItensImportadosService.ts
    ResolverVariacaoImportacaoService.ts
    ResolverLoteHistoricoImportadoService.ts
    ResolverFormaPagamentoImportacaoService.ts
    DecidirDestinoRegistroImportacaoService.ts

  helpers/
    calcularValorUnitario.ts
    criarErroSeguroTransacao.ts
    criarAssinaturaImportacao.ts
    normalizarTextoImportacao.ts
```

---

## 15. Stores IndexedDB

Novas stores:

```txt
itensTransacao
lotesImportacaoHistorica
```

Stores existentes ajustadas:

```txt
registrosImportacaoTransacoes
transacoesFinanceiras
```

Índices principais:

```txt
registrosImportacaoTransacoes.codigoTransacaoOrigem unique
itensTransacao.transacaoId
itensTransacao.perfilId
itensTransacao.loteId
lotesImportacaoHistorica.chaveAgrupamento unique
lotesImportacaoHistorica.loteId unique
transacoesFinanceiras.codigoTransacaoOrigem unique
```

---

## 16. Testes obrigatórios

Cobrir:

```txt
perfil resolvido
perfil pendente
perfil ambíguo
item resolvido
pendente_lote
pendente_quantidade
pendente_unidade
pendente_valor
duplicado
forma de pagamento criada
erro seguro sem nome
importação automática
staging de pendência
ItemTransacao com loteId
ItemTransacao sem itemId e sem variacaoId
lote histórico encerrado e sem estoque disponível
```

Teste crítico:

```ts
expect(JSON.stringify(registroSalvo)).not.toContain('João Silva');
```

---

## 17. Resumo final

```txt
Perfil e item/lote bloqueiam.
Financeiro não bloqueia.
Forma de pagamento inexistente é criada automaticamente.
Transação importada nasce com statusFinanceiro pendente_conciliacao.
ItemTransacao guarda loteId, não itemId nem variacaoId.
Nome de perfil só existe em memória.
Staging salva erro seguro por codigoTransacaoOrigem ou linhaOrigem.
Código deve seguir Clean Code, SOLID e sem duplicação.
```
