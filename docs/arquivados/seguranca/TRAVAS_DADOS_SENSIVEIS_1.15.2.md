# 1.15.2 — Travas de Segurança para Dados Sensíveis

## Regra absoluta

Dado sensível nunca deve ser gravado em armazenamento físico ou persistente sem proteção. Nunca. Nem provisoriamente por alguns milissegundos.

O fluxo permitido é:

1. Ler CSV/TSV em memória.
2. Identificar índices operacionais mínimos.
3. Separar payload sensível ainda em memória.
4. Proteger/criptografar o payload.
5. Persistir somente índice operacional em claro + payload protegido.

O fluxo proibido é:

1. Ler CSV/TSV.
2. Salvar staging aberto.
3. Proteger depois.

## Persona de segurança

A revisão de segurança deve pensar como:

- criminoso curioso;
- hacker;
- invasor.

Pergunta obrigatória:

> Se um criminoso curioso, hacker ou invasor tiver acesso ao celular, IndexedDB, cache, backup, arquivos exportados ou dados de staging, o que ele consegue ver?

Se conseguir ver dado real sensível aberto, a implementação está errada.

## Dados sensíveis

Considerar sensível qualquer informação que revele ou ajude a reconstruir:

- nome de comprador/perfil;
- telefone, bairro, município, observação ou identificação pessoal;
- descrição de transação;
- item vendido quando associado a pessoa/valor;
- total, valor pago, custo, lucro, desconto, taxa, entrega, pagamento pendente;
- método de pagamento;
- conta, carteira, banco, cripto ou referência financeira;
- dados brutos ou normalizados de importação;
- mensagens de erro/pendência que contenham nomes, valores, itens ou observações.

## O que pode ficar aberto no banco

Somente índice operacional não sensível e necessário para a tela funcionar:

- `id`;
- `loteImportacaoId`;
- `linha`;
- `numeroOriginal` ou referência técnica da transação;
- `numeroTransaçãoReferenciado`;
- `status`;
- `tiposPendencia`;
- `perfilIdResolvido`;
- datas técnicas (`createdAt`, `updatedAt`).

## O que deve ir protegido

- `dadosBrutos`;
- `dadosNormalizados`;
- `clienteNomeImportado`;
- descrição;
- observação;
- valores;
- custo;
- lucro;
- pagamento;
- pendências com detalhes sensíveis.

## Trava de implementação

Antes de criar qualquer tabela, staging, cache, exportação ou backup, a equipe deve responder:

1. Esse fluxo toca dado de pessoa, transação, pagamento, custo, lucro, observação, conta ou carteira?
2. Esse dado será salvo em IndexedDB, localStorage, cache, backup, exportação, arquivo, log ou mensagem persistente?
3. Existe algum momento em que ele seria gravado aberto antes de proteger?
4. A tela precisa de índice em claro ou pode buscar o detalhe em memória após descriptografar?
5. O teste automático quebra se alguém adicionar campo sensível em record persistente?

Se a resposta 3 for sim, a implementação está bloqueada.

## Regra de qualidade

Teste passando por fluxo feliz não basta. Toda nova persistência de importação/financeiro/transações/perfis precisa de teste de invariantes de segurança.

## Usuária

A proteção não pode impedir retomada. A usuária deve poder importar, resolver pendências aos poucos, fechar o app e continuar depois. A diferença é que o banco físico nunca guarda planilha aberta.
