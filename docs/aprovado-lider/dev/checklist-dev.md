# Checklist Dev

Checklist obrigatório antes e depois de codar.

## Regra-mãe

Toda entrega só pode seguir se provar:

1. o escopo estava claro antes de codar;
2. a solução ficou no lugar certo, sem duplicação e sem misturar responsabilidades;
3. a evidência entregue corresponde ao que realmente foi validado.

Se qualquer item falhar, bloquear.

## 1. Pedido e escopo

- O pedido foi classificado?
- A tarefa autoriza alteração?
- O que será alterado foi declarado?
- O que não será alterado foi declarado?
- Arquivos/camadas permitidos foram declarados?
- Arquivos/camadas proibidos foram declarados?
- O comportamento que não pode mudar foi declarado?
- Nunca fazer commit direto na `desenvolvimento`; sempre criar branch?

Se o pedido não autoriza implementação, não alterar arquivo.


## 2. Reutilização comprovada

Antes de criar algo novo, registrar onde procurou reutilização.

Verificar quando aplicável:

- `src/presentation/shared`;
- `src/presentation/shared/components`;
- `src/presentation/shared/ui`;
- `src/app`;
- `src/application`;
- domínio relacionado;
- estilos/templates existentes;
- fluxos/helpers parecidos.

Confirmar:

- já existe componente, helper, serviço, caso de uso, fluxo, template ou estilo reaproveitável?
- dá para resolver por configuração, parâmetro, estado, composição ou extração?
- algo novo foi justificado?
- pasta nova só foi criada depois de provar que a estrutura atual não atende?

Se não registrar onde procurou, bloquear.

## 3. Responsabilidade e local correto

Definir dono antes de alterar:

- UI apresenta;
- componente encapsula apresentação/comportamento local;
- serviço coordena operação;
- caso de uso executa regra;
- repositório persiste;
- segurança/cripto protege;
- app principal integra;
- arquivo de entrada inicializa;
- workflow automatiza processo;
- documento aprovado registra regra.

Confirmar depois:

- regra não ficou em UI;
- fluxo completo não ficou em arquivo central/orquestrador;
- app principal não virou dono de regra;
- caso de uso não recebeu detalhe visual;
- serviço não recebeu renderização;
- arquivo central não cresceu por conveniência.

Se funciona, mas ficou no lugar errado, bloquear.

## 4. Sem duplicação

Antes e depois de codar, procurar duplicação de:

- tela;
- modal;
- fluxo;
- helper;
- função;
- texto;
- seletor;
- template;
- estilo;
- regra;
- validação;
- binding/evento.

Se houver duplicação, reaproveitar, extrair ou bloquear.

Se não conseguir provar que não duplicou, bloquear.

## 5. Separação HTML/CSS/TS

- HTML estrutural fica em template/componente visual.
- CSS fica em arquivo de estilo.
- TypeScript controla estado, binding, evento e coordenação permitida.
- Sem CSS inline em TS, salvo exceção aprovada.
- Sem montar layout novo com `createElement` sem autorização expressa.
- Sem misturar visual com regra, storage, cripto, validação, persistência, importação/exportação ou autenticação.

## 6. Arquivos centrais e sensíveis

Arquivos centrais não recebem fluxo novo inteiro:

- `index.html`;
- bootstrap/browserMain/createApp;
- app principal/orquestradores;
- workflows;
- scripts de processo;
- documentos aprovados.

Se precisar alterar:

- justificar;
- limitar;
- preferir extrair para módulo próprio;
- exigir aprovação quando sensível.

Arquivos/camadas sensíveis não são alterados sem autorização explícita:

- segurança;
- cripto;
- storage;
- persistência;
- schema;
- validação;
- autenticação;
- importação/exportação;
- workflows;
- bloqueios;
- mockups aprovados;
- thresholds.

## 7. Refatoração

Refatoração melhora estrutura sem mudar comportamento.

Confirmar:

- não muda regra;
- não muda layout;
- não muda contrato;
- não muda persistência;
- não muda segurança/cripto;
- não corrige bug junto sem autorização;
- não toca achado fora do escopo sem autorização;
- comportamento antes/depois tem forma de comparação.

Se precisar mudar comportamento, parar e pedir autorização.

## 8. Compatibilidade

Antes de alterar fluxo existente:

- como funciona hoje?
- quem chama?
- quais dados antigos dependem disso?
- existe fallback?
- fluxo antigo continua funcionando?
- dados antigos continuam compatíveis?
- erros e cancelamentos continuam tratados?

## 9. Rollback e reversibilidade

Obrigatório quando houver risco em dados, storage, autenticação, segurança, importação/exportação, workflow, processo ou produção.

Responder:

- como desfazer?
- quais arquivos voltar?
- há migração?
- há fallback?
- há risco para dados existentes?
- o usuário perde algo se falhar?

## 10. Evidência, prova e garantia

Toda entrega deve declarar:

- arquivos alterados;
- o que foi alterado;
- o que não foi alterado;
- tipo de validação feita;
- o que é evidência;
- o que é prova técnica;
- escopo garantido;
- escopo não garantido;
- limites da validação.

Não declarar mais do que foi validado.

## 11. Entrega honesta

Antes de entregar, confirmar:

- estou omitindo algum risco?
- estou suavizando alguma falha?
- estou chamando evidência de prova?
- estou afirmando algo além do validado?
- existe algo desconfortável que precisa ser dito?
- se a solução ficou ruim, bloqueei?


## 12. Novos controles

Antes de criar nova trava, checklist, workflow, automação ou regra de processo:

- regra existente já cobre o caso?
- o problema é real, recorrente ou de risco alto?
- o controle reduz erro ou só aumenta preenchimento?
- tarefa simples será prejudicada?
- `controles-futuros.md` foi consultado?

Se não houver justificativa clara, não adicionar agora.
