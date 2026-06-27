# Dev — Processo KZERA

Esta pasta concentra as regras obrigatórias de desenvolvimento, entrega e governança.

## Versionamento do processo

Versão atual: `1.1.4`
Data: `2026-06-27`
Dono: líder do projeto

Toda alteração nos documentos oficiais desta pasta deve atualizar esta seção com:

- nova versão;
- data;
- resumo do que foi alterado;
- motivo da alteração;
- impacto no processo.

Se os documentos de processo forem alterados e esta seção não for atualizada, a entrega deve bloquear.

## Alterações recentes

### 1.1.4 — 2026-06-27

Resumo:
- adicionada exigência explícita de evidência/prova de validação;
- adicionada separação clara entre evidência declarada e evidência realmente executada;
- adicionada regra para não marcar etapa como concluída quando houver pendência;
- adicionada proteção contra alteração de checklist/processo sem atualização de versão;
- adicionada regra de preservação de histórico e exceções.

Motivo:
- evitar entregas marcadas como completas sem prova objetiva;
- impedir alteração silenciosa de regras;
- reduzir retrabalho por falta de conferência antes/depois.

Impacto:
- PRs que alterem processo precisam declarar versão;
- PRs precisam preencher checklist com evidências;
- mudanças visuais precisam de evidência visual ou justificativa objetiva.

### 1.1.3 — 2026-06-27

Resumo:
- consolidado processo de desenvolvimento;
- incluídos checklist dev, checklist visual, governança e controles futuros.

Motivo:
- padronizar desenvolvimento por IA e reduzir erro operacional.

Impacto:
- agentes devem consultar este processo antes de alterar código.

## Documentos oficiais

- `processo-dev.md` — fluxo obrigatório antes, durante e depois de codar.
- `checklist-dev.md` — checklist técnico obrigatório.
- `checklist-visual.md` — checklist obrigatório para alteração visual.
- `governanca-e-excecoes.md` — dono, exceções, proteção e revisão.
- `controles-futuros.md` — controles previstos, mas ainda não ativados.

## Regra de uso

Antes de qualquer implementação:

1. ler `processo-dev.md`;
2. aplicar `checklist-dev.md`;
3. aplicar `checklist-visual.md` se houver impacto visual;
4. respeitar `governanca-e-excecoes.md`;
5. não criar controle novo se `controles-futuros.md` classificar como futuro.

## Regras absolutas

- Não alterar processo sem autorização explícita do dono.
- Não alterar checklist sem atualizar este README.
- Não declarar validação executada se não foi executada.
- Não entregar como concluído se houver pendência.
- Não mascarar pendência como observação.
- Não criar arquivo temporário no projeto final.
- Não remover regra anterior sem avisar.
- Não usar exceção sem registrar motivo.

## Como uma entrega deve provar conformidade

Toda entrega deve informar:

- pedido classificado;
- arquivos alterados;
- arquivos não alterados por decisão;
- reaproveitamento verificado;
- responsabilidade/camada confirmada;
- duplicação revisada;
- validações rodadas;
- validações não rodadas;
- pendências restantes;
- evidência visual quando aplicável.

## Bloqueios esperados

Uma entrega deve bloquear se:

- alterou processo sem autorização;
- alterou checklist sem versionar;
- mexeu em arquivo protegido sem justificativa;
- criou componente duplicado sem verificar existente;
- misturou visual com regra de negócio;
- alterou fluxo sensível sem revisar compatibilidade;
- declarou teste não executado;
- faltou evidência de mockup/print quando visual;
- deixou pendência e marcou como completo.
