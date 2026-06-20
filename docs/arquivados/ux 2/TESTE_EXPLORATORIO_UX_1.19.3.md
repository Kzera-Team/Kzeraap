# Teste exploratório simulado com métricas reais — 1.19.3

## Objetivo

Usar as métricas locais da 1.19.2 para avaliar os fluxos principais do app antes de iniciar Relatórios.

Esta etapa não cria Relatórios. Ela mede o uso para descobrir onde a Usuária perde tempo, volta demais, encontra erro ou abandona um fluxo.

## Escopo testado

Fluxos obrigatórios da simulação:

- criar_perfil
- editar_perfil
- buscar_perfil
- arquivar_perfil
- criar_item
- editar_item
- criar_variacao
- registrar_estoque
- separar_peso
- importar_perfis
- importar_itens
- confirmar_historico
- salvar_copia_seguranca
- salvar_lista
- configurar_codigo_perfil

## Métricas usadas

- tempo total do fluxo
- quantidade de ações
- quantidade de voltas
- quantidade de erros
- abandono
- lista limitada para proteger o iPhone

## Limites iniciais da simulação

- até 12 ações por fluxo operacional comum
- até 2 minutos por fluxo comum
- até 2 voltas por fluxo
- até 1 erro por fluxo
- máximo de 80 registros renderizados em lista grande

Esses limites são ponto de partida. Se a Usuária real reprovar um fluxo mesmo dentro do limite, o fluxo não passa.

## Resultado esperado

A versão 1.19.3 deve produzir uma leitura objetiva:

- quais fluxos podem seguir;
- quais fluxos precisam de simplificação;
- quais telas precisam paginação antes de Relatórios;
- quais erros precisam de mensagem melhor;
- quais ações devem virar atalho ou sair do caminho principal.

## Regra de privacidade

A simulação usa apenas dados genéricos de UX. Não salva nome, telefone, item, valor, texto digitado, observação, conteúdo importado ou identificador real de Perfil/Item.

## Decisão para Relatórios

Relatórios só devem começar quando não houver bloqueador de UX nos fluxos principais ou quando o bloqueador estiver formalmente aceito como pendência consciente.
