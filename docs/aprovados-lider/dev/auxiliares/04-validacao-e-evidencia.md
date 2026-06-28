# Auxiliar 04 — Validação e Evidência

Use antes de qualquer entrega.

## Evidência mínima para código

Informar:

- arquivos alterados;
- comando executado, quando houver;
- saída/resultado relevante do comando;
- motivo da alteração;
- resumo técnico;
- validação executada;
- resultado;
- risco de regressão;
- confirmação de fora do escopo preservado;
- lista dos arquivos tocados para comprovar que não houve alteração fora do escopo.

## Validações aplicáveis

Quando disponíveis, rodar:

- typecheck;
- lint;
- build;
- testes existentes;
- teste manual da importação;
- teste com dado válido;
- teste com alerta;
- teste com erro;
- teste de importação sem valores opcionais;
- teste de campos vazios;
- teste de restauração de prévia, se aplicável.

## Evidência visual

Se houver UI:

- print antes;
- print depois;
- tela/rota;
- viewport/dispositivo;
- estado testado;
- dados usados;
- diferenças conhecidas.


## Validação obrigatória de escopo

Antes de entregar, declarar:

```txt
Arquivos tocados:
Arquivos fora do escopo alterados:
Confirmação: não alterei fora do escopo autorizado.
```

Se algum arquivo fora do escopo foi alterado, a entrega não pode ser FINAL sem orientação de Max.

## Regra

Não declare validação que não executou.

Se não validou, escrever:

```txt
Não validado:
Motivo:
Risco:
Próxima validação necessária:
```
