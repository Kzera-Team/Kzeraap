# Checklist obrigatório de entrega

Nenhuma alteração deve ser entregue sem preencher este checklist.

## Identificação

```text
Versão analisada:
Nova versão:
Objetivo da etapa:
Pendência resolvida:
Backlog afetado:
```

## Decisão por papel

```text
Direção de Produto:
UX Operacional:
Arquitetura:
Modelagem de Dados:
Segurança:
Desenvolvimento:
Qualidade:
Entrega:
```

## Teste da Usuária

Responder objetivamente:

```text
Fluxo mobile/iPhone validado?
Reduziu cliques ou pelo menos não piorou?
Existe botão ambíguo ou ícone sozinho em ação não óbvia?
Existe área morta?
Existe resumo redundante?
Dados críticos salvam imediatamente?
Recupera se o app fechar/travar/recarregar?
Permite corrigir erro humano sem refazer tudo?
O que uma pessoa cansada xingaria nessa tela?
```

## Testes técnicos

```text
npm test:
npm run check:
npm run build:
Testes extras executados:
Testes que ainda faltam:
```

## Conclusão honesta

```text
O que foi alterado:
O que NÃO considerar pronto ainda:
Riscos encontrados:
Pendências restantes:
Backlog:
Recomendação da equipe:
Próxima versão sugerida:
```


## Segurança de dados sensíveis

Antes de entregar, responder:

- Todo dado sensível foi protegido antes do primeiro write físico?
- Staging/importação salva apenas índice operacional em claro?
- Pendências/mensagens de erro não vazam nomes, valores, itens, custo, lucro, pagamento ou observação em registro aberto?
- Backup/exportação/cache não guardam planilha ou payload sensível aberto?
- O teste foi pensado contra criminoso curioso, hacker ou invasor?

## Complemento obrigatório para confirmação histórica 1.18.5+

Antes de aprovar confirmação histórica, responder:

- O resultado final vem do pacote congelado, e não de plano recalculado?
- O staging atual foi reconsultado imediatamente antes de confirmar?
- Alteração em linha, vínculo financeiro ou movimento vinculado bloqueia confirmação?
- Pacote `confirmando` aparece na ação principal de recuperação após reload?
- Artefato oficial tem ID registrado no pacote antes do write oficial?
- Falha/interrupção recupera sem depender da usuária descobrir painel escondido?
- Prévia/conciliação/listas descriptografadas somem da memória e do DOM no bloqueio?
- A tela limita renderização de listas grandes no iPhone?

## Checklist 1.18.6 — Usuária

- Se houver confirmação interrompida, a primeira ação visível é humana e principal?
- A tela diz “Nada foi perdido”?
- A retomada usa botão honesto “Retomar com segurança” e opção “Ver revisão protegida”, sem prometer continuação automática?
- A usuária não precisa abrir painel técnico para recuperar o fluxo?
- Não existe botão visível “Recuperar falha”?

## Checklist 1.18.7 — Build oficial

- `npm ci` precisa passar.
- `npm test` precisa passar.
- `npm run check` precisa passar.
- `npm run build` precisa passar e gerar `dist/`.
- É proibido declarar pacote oficial se o build Vite falhar.
- Pacote estático manual só pode ser contingência, nunca entrega oficial.
- XLS/XLSX não pode quebrar a instalação; se o adaptador não estiver saudável, orientar CSV com mensagem humana.


## Checklist 1.18.8 — Pré-Relatórios

- Documento de estado atual aponta para 1.18.8?
- Retomada interrompida aparece antes dos fluxos normais?
- Card de retomada não expõe faturamento/custo/lucro no DOM?
- “Retomar com segurança” limpa parcial e abre prévia/revisão, sem mentir para a usuária?
- “Ver revisão protegida” abre bloco real e foca nele?
- Conciliação limita renderização mobile a 80 vínculos?
- Inputs de importação aceitam apenas CSV/TSV/TXT enquanto Excel estiver bloqueado?


## Checklist 1.19.0 — Anti-burnout obrigatório

- A UI principal da importação histórica está sem “staging”, “pacote”, “congelar”, “lotes confirmados recuperáveis”, “detalhe técnico” e “DESFAZER”?
- A primeira ação após interrupção é “Ver o que aconteceu”, sem limpar nada sozinha?
- A segunda ação é “Limpar restos e abrir revisão”, deixando claro que nada confirma sozinho?
- Valores financeiros pesados ficam escondidos em detalhe avançado?
- Correção de confirmação já feita fica em área avançada?
- Backup obrigatório não aparece por cima de importação/confirmação crítica?
- npm ci, npm test, npm run check e npm run build passaram?


## Revisão visual obrigatória

Antes de declarar qualquer entrega pronta, simular a tela como Usuária final e verificar:

- não há título, botão, texto ou palavra duplicado sem motivo;
- não há eyebrow e título principal com a mesma palavra;
- a tela não está poluída;
- a ação principal está clara;
- não há erro básico de atenção visual.

Se houver texto duplicado como `Perfis` sobre `Perfis`, a entrega está bloqueada.


## ⛔ IMPEDIMENTO — Bloqueia versão 1.0.0

**Tela de Código do Perfil não é intuitiva o suficiente para produção.**

Durante validação interna (2026-06-24), a tela de configuração inicial "Blocos do Código do Perfil" não foi preenchida de forma intuitiva sem orientação prévia.

- O fluxo de primeiro acesso exige configurar blocos antes de usar qualquer tela — mas o formato dos campos ("Texto fixo", "Formatação", "Transformação") não é autoexplicativo para uma usuária não técnica.
- A validação falhou silenciosamente: o botão "Salvar e entrar" não avança sem texto nos campos, mas o feedback de erro não é claro.

**Critério para liberar 1.0.0:** a tela deve ser preenchida corretamente por uma pessoa leiga sem instrução verbal ou escrita.

**Responsável:** UX (Ana) — redesenhar fluxo de configuração inicial.
