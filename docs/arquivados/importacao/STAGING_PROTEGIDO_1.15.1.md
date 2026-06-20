# 1.15.1 — Staging protegido antes da persistência

Regra absoluta: dado sensível nunca deve ser gravado em armazenamento físico/persistente sem proteção, nem provisoriamente.

## Fluxo obrigatório

1. Ler CSV/TSV em memória.
2. Normalizar e validar em memória.
3. Separar índice operacional de conteúdo sensível.
4. Criptografar o payload sensível com material da sessão/senha mestra.
5. Só então persistir no IndexedDB.

## Pode ficar em claro como índice operacional

- ID do registro.
- ID do lote de importação.
- Número da linha.
- Número da transação ou referência numérica quando existir.
- Status de importação.
- Tipos de pendência, sem mensagem e sem valor sensível.
- Perfil resolvido por ID.
- Datas técnicas de criação/atualização.

## Deve ficar no payload protegido

- Dados brutos da linha.
- Dados normalizados.
- Nome importado do comprador/perfil.
- Descrição da transação ou movimentação.
- Observação.
- Valores financeiros.
- Custo, lucro, pagamento, taxa e pagamento pendente.
- Mensagens de pendência que contenham nomes, itens ou valores.

## Usuária

A tela continua mostrando o que ela precisa para resolver pendências, mas o banco físico não recebe planilha aberta. Se o app fechar, a importação continua salva; se alguém inspecionar o IndexedDB, encontra índices operacionais e payload criptografado, não o CSV em claro.

## Não fazer

- Não salvar `dadosBrutos` diretamente no IndexedDB.
- Não salvar `dadosNormalizados` diretamente no IndexedDB.
- Não salvar nome importado, descrição, observação, custo, lucro ou pagamento em claro.
- Não persistir primeiro para criptografar depois.


## Reforço 1.15.2

A regra foi elevada para trava absoluta de segurança: dado sensível não pode tocar armazenamento físico aberto nem por milissegundos. Staging, cache, backup, exportação, mensagem de erro e pendência também são superfícies de vazamento.

A revisão adversária deve usar a persona: criminoso curioso, hacker ou invasor.
