# Confirmação Histórico Financeiro 1.18.8

## Objetivo

Correção pré-Relatórios após auditoria da 1.18.7. A 1.18.8 corrige a verdade operacional da retomada, reduz risco de travamento no iPhone e remove contradições de documentação/entrada de arquivos.

## Regras obrigatórias

- A tela não pode prometer “Continuar confirmação” quando a ação real é limpar artefatos parciais e reabrir prévia.
- A ação principal passa a ser “Retomar com segurança”.
- O texto explica antes do clique: primeiro limpa qualquer resto parcial; depois abre revisão/preparação segura.
- “Ver revisão protegida” precisa abrir um bloco real de revisão, com foco após renderizar.
- O card inicial de retomada não deve expor faturamento, custo ou lucro no DOM.
- A conciliação deve renderizar no máximo 80 vínculos por vez para proteger iPhone.
- XLS/XLSX não podem aparecer no atributo accept enquanto o adaptador Excel estiver bloqueado.
- CSV/TSV/TXT continuam como caminho seguro. O bloqueio temporário de Excel existe porque a dependência xlsx arrastava codepage e podia quebrar npm ci/build oficial.

## Veredito operacional

A 1.18.8 ainda deve ser testada em iPhone por pessoa real antes de seguir para Relatórios. Porém, os bloqueadores objetivos da auditoria 1.18.7 foram tratados: botão honesto, revisão real, documentação atual, limite mobile e input coerente.

## Regras herdadas que continuam válidas

- Histórico importado não baixa estoque.
- Histórico importado entra em total/faturamento, custo e lucro.
- A confirmação exige prévia obrigatória e pacote congelado.
- O fluxo deve continuar sem clique registro por registro.
- Desfazer lote confirmado precisa ser protegido e transacional o suficiente para não apagar dado errado.
- A confirmação e o desfazer seguem sem baixar estoque/lote.
- O resumo financeiro dentro do payload protegido deve preservar faturamento, custo, lucro, pago e pendente.
- A versão 1.18.4 não passa e não pode ser usada como base aprovada.

Frases de contrato preservadas para testes/regressão: desfazer lote confirmado; sem baixar estoque/lote.
