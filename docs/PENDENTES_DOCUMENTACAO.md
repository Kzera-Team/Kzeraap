# PENDENTES DE DOCUMENTAÇÃO — Kzera/Vevelt

Este arquivo registra documentos importantes que ainda devem ser criados ou expandidos depois da fase atual de testes do sistema.

Não criar todos agora. Prioridade atual: terminar os testes do sistema.

## 1. `docs/projeto/REGRAS_DE_NEGOCIO.md`

## Por que criar

As decisões de produto estão espalhadas entre conversas e documentos de módulo. Isso aumenta o risco de uma IA inventar regra ou esquecer uma decisão já confirmada.

## Deve conter

- Decisões globais do sistema.
- Diferença entre regra confirmada e regra pendente.
- Regras que afetam mais de um módulo.
- Regras que não pertencem exclusivamente a Perfil, Item, Estoque, Vendas ou Importação.

## Exemplos de conteúdo

- Venda é lucro.
- Cliente na UI é Perfil.
- Produto na UI é Item.
- Histórico importado alimenta financeiro/transações.
- Histórico importado não baixa estoque/lote.
- Regras futuras de backend ainda não devem ser inventadas.
- O que está decidido e o que ainda precisa de validação.

## Prioridade

Alta.

---

## 2. `docs/projeto/NOMENCLATURA.md`

## Por que criar

O projeto já teve troca de nomes e risco de regressão. Um documento específico evita voltar termos antigos.

## Deve conter

- Nome público do app.
- Nome interno usado no código.
- Termos corretos na UI.
- Termos proibidos.
- Regras para arquivos, classes, storage keys, módulos e futuro backend.

## Exemplos de conteúdo

- Nome público: Vevelt.
- Nome interno atual no código: Kzera/kzera.
- UI: Cliente vira Perfil.
- UI: Produto vira Item.
- Não voltar CatLover.
- Não usar Vevelt/Kzera no futuro backend ou DNS.
- Não reintroduzir termos antigos sem aprovação.

## Prioridade

Alta.

---

## 3. `docs/projeto/ANTI_REGRESSAO.md`

## Por que criar

O projeto já sofreu regressões visuais, de fluxo e de entrega. Este documento deve listar coisas que não podem voltar.

## Deve conter

- Problemas que já aconteceram.
- Decisões que foram corrigidas.
- Coisas proibidas de reintroduzir.
- Checklist de regressões conhecidas.

## Exemplos de conteúdo

- Não voltar header antigo na importação.
- Não duplicar abas na importação.
- Não inserir layout novo dentro de tela antiga.
- Não criar bloco roxo gigante antes do painel de importação.
- Não voltar “Cliente” e “Produto” na UI.
- Não trocar “Conhece pessoalmente” sem aprovação.
- Não salvar importação direto ao escolher arquivo.
- Não dizer que testou no iPhone se foi só Chromium.
- Não gerar zip oficial sem incrementar versão.
- Não entregar Netlify com estrutura errada.

## Prioridade

Alta.

---

## 4. `docs/projeto/AMBIENTE_E_DEPLOY.md`

## Por que criar

Parte das regras de ambiente, Netlify, PWA, iPhone e cache ainda está misturada com versionamento e entrega.

## Deve conter

- Alvo principal: iPhone/PWA.
- Limitações do Chromium vs Safari/iPhone real.
- Netlify como deploy estático.
- Estrutura correta do pacote estático.
- Cuidados com cache.
- Diferença entre projeto fonte e pacote Netlify.
- O que pode ser validado localmente e o que exige iPhone real.

## Exemplos de conteúdo

- Zip Netlify deve conter `index.html`, `assets/` e `_redirects` no topo.
- Não zipar a pasta `dist` por fora.
- Chromium viewport iPhone não substitui Safari real.
- PWA instalado pode ter comportamento de cache diferente.
- Safe area, teclado, Face ID e selects nativos exigem validação real quando afetados.

## Prioridade

Média.

---

## 5. `docs/projeto/DECISOES_PENDENTES.md`

## Por que criar

Algumas áreas ainda não estão totalmente definidas. Se isso não estiver documentado, a IA pode inventar regra.

## Deve conter

- Decisões ainda abertas.
- Módulos incompletos.
- Regras que precisam de aprovação antes de implementação.
- O que está proibido implementar sem validação.

## Exemplos de conteúdo

- Vendas ainda precisa definição completa.
- Cancelamento de venda ainda pendente.
- Devolução ainda pendente.
- Promoções e combos ainda pendentes.
- Regras completas de baixa de estoque ainda pendentes.
- Futuro backend ainda não deve ser implementado sem arquitetura aprovada.
- Sincronização deve permanecer fora até decisão explícita.

## Prioridade

Média.

---

## Ordem recomendada depois dos testes

1. `docs/projeto/ANTI_REGRESSAO.md`
2. `docs/projeto/REGRAS_DE_NEGOCIO.md`
3. `docs/projeto/NOMENCLATURA.md`
4. `docs/projeto/DECISOES_PENDENTES.md`
5. `docs/projeto/AMBIENTE_E_DEPLOY.md`

## Regra final

Não criar documentação por volume.

Criar apenas documentos que reduzam erro real no desenvolvimento, impeçam regressão ou evitem que a IA invente decisão.
