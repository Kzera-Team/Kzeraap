# Confirmação Histórico Financeiro 1.19.0

## Objetivo

Blindar a experiência contra burnout antes de Relatórios. A correção não é cosmética: a usuária não deve precisar entender termos técnicos para continuar.

## Regras aplicadas

- A primeira ação passa a ser “Ver o que aconteceu”.
- O primeiro clique não limpa nada e não confirma nada.
- A segunda ação passa a ser “Limpar restos e abrir revisão”.
- A tela informa que nada foi perdido e nada será confirmado sozinho.
- Termos técnicos da camada interna não aparecem na UI principal.
- Valores financeiros pesados ficam em “Ver valores financeiros”.
- Correção de confirmação já feita fica em área avançada.
- Backup obrigatório não deve aparecer por cima de importação/confirmação crítica.

## Termos proibidos na UI principal

- staging
- pacote
- congelar
- lotes confirmados recuperáveis
- detalhe técnico
- DESFAZER

## Veredito

Esta versão só pode seguir para Relatórios depois de passar no teste operacional da Usuária no iPhone.

## Build oficial e Excel

O bloqueio temporário de Excel continua: a dependência `xlsx` arrastava `codepage` e já quebrou `npm ci`/build oficial. CSV/TSV/TXT seguem como caminho seguro até existir adaptador isolado e testado.

## Regra financeira preservada

Histórico importado alimenta total/faturamento, custo e lucro para consultas e relatórios. A confirmação histórica não baixa estoque.

A prévia obrigatória continua. O fluxo segue sem clique registro por registro; a linguagem só ficou humana.
A capacidade técnica de desfazer lote confirmado continua, mas fica escondida da usuária como área avançada de corrigir confirmação.
A confirmação segue sem baixar estoque/lote.
O resumo financeiro dentro do payload protegido continua obrigatório para não expor valores desnecessários.
A versão 1.18.4 não passa; as correções posteriores preservam a regra de não baixa estoque.
