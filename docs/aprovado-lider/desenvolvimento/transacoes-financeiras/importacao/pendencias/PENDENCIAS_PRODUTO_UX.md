# Pendências Produto/UX — Importação de Transações Financeiras

Status: pendências organizadas por Rose para acompanhamento.

Este documento não aprova decisões de Produto/UX.
Ele apenas organiza direções já comentadas, decisões ainda pendentes e impacto em QA.

## Regra Rose

Pendência permanece pendente até decisão explícita do responsável.

## 1. Aprovação em massa segura

Status: pendente Produto/UX.

Direção já comentada:

- lista de transações seguras com seleção marcada por padrão;
- botão `Aprovar selecionadas`;
- ação rápida para mandar item selecionado para revisão;
- bloquear aprovação em massa se houver pendência ativa.

Decisão ainda necessária:

- entra no MVP ou fica para ciclo futuro?
- quais itens podem vir pré-selecionados?
- qual confirmação aparece antes da aprovação?
- qual mensagem de segurança aparece para a usuária?

Impacto no QA:

- CT-REG-06 permanece bloqueado até existir ação de UI ou decisão formal de fora do escopo.

Responsáveis:

- Produto;
- UX funcional;
- Dev após decisão.

## 2. Marcar para revisão manual

Status: pendente Produto/UX.

Direção já comentada:

- cada item seguro ou duvidoso deve poder ser enviado para revisão manual;
- a ação deve aparecer na lista ou detalhe do item;
- o item marcado não deve ser confirmado automaticamente.

Decisão ainda necessária:

- texto exato da ação;
- local da ação na tela;
- estado visual após marcar;
- possibilidade de desfazer.

Impacto no QA:

- CT-PEN-02 permanece bloqueado até existir ação de UI ou decisão formal de fora do escopo.

Responsáveis:

- Produto;
- UX funcional;
- Dev após decisão.

## 3. Resolver pendência por ação guiada

Status: pendente Produto/UX.

Direção já comentada:

- traduzir status técnico em frases curtas;
- mostrar o que aconteceu;
- mostrar qual ação a usuária pode tomar;
- evitar código ou mensagem técnica crua.

Decisão ainda necessária:

- lista de ações possíveis por tipo de pendência;
- textos finais;
- tela onde a ação aparece;
- estado final após resolver.

Impacto no QA:

- CT-PEN-04 e validações relacionadas a resolução de pendência permanecem bloqueadas/parciais até a UI existir.

Responsáveis:

- Produto;
- UX funcional;
- UI visual se houver nova tela ou novo componente;
- Dev após decisão.

## 4. Retomar importação depois de fechar ou reabrir app

Status: pendente Produto/UX.

Direção já comentada:

- separar retomada em etapas claras:
  1. ver o que aconteceu;
  2. limpar restos ou inconsistências antes de revisar;
  3. informar que agora está seguro para revisar.

Decisão ainda necessária:

- quando mostrar tela de retomada;
- texto da mensagem de recuperação;
- opção de continuar, revisar ou descartar;
- confirmação antes de descartar algo.

Impacto no QA:

- CT-STA-05 permanece bloqueado/parcial até existir comportamento de UI testável ou decisão formal de fora do escopo.

Responsáveis:

- Produto;
- UX funcional;
- AppSec se envolver descarte/segurança de dados temporários;
- Dev após decisão.

## 5. Limpeza segura ao sair, bloquear sessão ou descartar importação

Status: pendente Produto/UX/AppSec.

Direção já comentada:

- ainda não há decisão clara de fluxo visual completo;
- histórico fala mais sobre retomada segura do que sobre limpeza segura ao sair/bloquear sessão.

Decisão ainda necessária:

- o que deve ser limpo;
- o que deve permanecer para recuperação;
- diferença entre sair, bloquear sessão, descartar importação e fechar app;
- confirmação exigida;
- mensagem para a usuária;
- regra AppSec para dados temporários.

Impacto no QA:

- CT-SEG-02 permanece bloqueado até decisão Produto/UX/AppSec e implementação testável.

Responsáveis:

- Produto;
- UX funcional;
- AppSec;
- Dev após decisão.

## Resumo de status

```text
CT-REG-06: bloqueado por ausência de ação de aprovação em massa segura.
CT-PEN-02: bloqueado por ausência de ação para revisão manual.
CT-PEN-04: bloqueado/parcial por ausência de resolução guiada completa.
CT-STA-05: bloqueado/parcial por ausência de retomada testável.
CT-SEG-02: bloqueado por ausência de decisão Produto/UX/AppSec sobre limpeza segura.
```

## Próxima ação recomendada

Produto e UX devem transformar cada pendência em uma destas decisões:

```text
MVP obrigatório
Futuro documentado
Fora do escopo
Substituído por outro fluxo
```

Depois da decisão, Dev implementa somente o que for autorizado.
