# Relatórios Operacionais 1.19.5

## Objetivo

Criar o primeiro módulo funcional de Relatórios antes do módulo de Operação comercial, sem fingir que Operação comercial já existe.

A tela mostra uma visão simples para a Usuária conferir:

- dinheiro do período;
- status dos registros financeiros;
- origem dos registros;
- quantidade de Perfis e Itens;
- resumo simples do estoque atual.

## Arquitetura

- `domain/relatorio/RelatorioOperacional.ts`: apenas tipos e estruturas.
- `application/relatorio/GerarRelatorioOperacionalUseCase.ts`: filtros, leitura de repositories e cálculo de agregados.
- `presentation/app/createKzeraAuthenticatedApp.ts`: tela, filtros e renderização.

`domain/relatorio` não contém service, engine, validator, calculator, use case ou repository.

## Limites conscientes

Esta versão não cria gráficos complexos, exportação de relatórios, ranking por Perfil, ranking por Item ou relatório comercial completo.

O módulo principal ainda não existe como módulo final. A tela informa isso claramente.

## Critério Usuária

Relatórios devem ser úteis sem exigir raciocínio técnico. A primeira versão evita termos como staging, pacote, auditoria e falha técnica.
