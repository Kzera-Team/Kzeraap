# Código em branch não presente na base

ID: CP-007
Classificação: EXISTE_EM_BRANCH_MAS_NAO_NA_BASE
Arquivo: PerfilImportacaoBinder.ts; PerfilImportacaoTemplate.html; PerfilTemplate.css
Símbolo: botão confirmar-importacao-perfis e posição da lupa
Branch de origem: kzera-v0-19-51
SHA de origem: [c52b9a8248c1](https://github.com/Kzera-Team/Kzeraap/commit/c52b9a8248c1f5a991b7885f6a484f420a4660bc), [484891260706](https://github.com/Kzera-Team/Kzeraap/commit/484891260706c32217172e0daac53fa2f9221ec2), [9009953b5de1](https://github.com/Kzera-Team/Kzeraap/commit/9009953b5de18f07946716c5468eab612bbdfc7e)
Branch posterior: nova_desenvolvimento_de_n1
SHA posterior: [b91223b5fd43](https://github.com/Kzera-Team/Kzeraap/commit/b91223b5fd4363c4969524399416dc37fb7623c8)
PR/Merge: Nenhum PR relacionado localizado
O que existia: A branch adicionou listener de arquivo, botão explícito de confirmação, habilitação por registro válido e moveu a lupa de 50% para 25px.
O que mudou: Esses três commits permaneceram apenas na branch.
O que existe hoje: A base não contém esse botão/contrato nem o ajuste CSS.
Teste relacionado: Nenhum teste novo nesses commits.
Impacto no módulo Cliente / Perfil: É uma variante de UI/fluxo não incorporada; não há prova para promovê-la.
Evidência: Diff base versus os três commits e ausência de ancestralidade na base.
Confiança: ALTO
Precisa de decisão do líder? SIM

---
ID: CP-008
Classificação: EXISTE_EM_BRANCH_MAS_NAO_NA_BASE
Arquivo: src/presentation/perfil/binders/PerfilImportacaoBinder.ts; PerfilTemplate.css
Símbolo: renderPreviewCard, filtros e FAB alternativos
Branch de origem: claude/new-session-pv3jdm
SHA de origem: [c602d76c6bfe](https://github.com/Kzera-Team/Kzeraap/commit/c602d76c6bfeb63e2fd0f9744d6a7c7961017813)
Branch posterior: PR para claude/leia-agents-jose-rjkzjt
SHA posterior: não mesclado
PR/Merge: [PR #80](https://github.com/Kzera-Team/Kzeraap/pull/80) aberto, divergente e não mesclado
O que existia: A branch implementou uma segunda renderização de preview, filtros, FAB e ajuste da lupa.
O que mudou: O PR #80 tenta levar a branch para outra branch de agente, não para a base oficial.
O que existe hoje: A base mantém o binder anterior.
Teste relacionado: Nenhum teste novo no commit.
Impacto no módulo Cliente / Perfil: Variante concorrente sem decisão de integração e com sobreposição extensa no binder.
Evidência: Commit [c602d76c6bfe](https://github.com/Kzera-Team/Kzeraap/commit/c602d76c6bfeb63e2fd0f9744d6a7c7961017813) e metadados do [PR #80](https://github.com/Kzera-Team/Kzeraap/pull/80).
Confiança: ALTO
Precisa de decisão do líder? SIM

---
ID: CP-010
Classificação: EXISTE_EM_BRANCH_MAS_NAO_NA_BASE
Arquivo: createPerfilUiApp.ts; PerfilImportacaoBinder.ts; PerfilImportacaoTemplate.html; createFeatureAppComposition.ts
Símbolo: reintrodução best-effort de reprocessamento + renderização alternativa
Branch de origem: claude/teste-permissao-criar-branch-01959
SHA de origem: [63aae815509a](https://github.com/Kzera-Team/Kzeraap/commit/63aae815509a7d5f0f097d685a5df4a3d1d2d80d)
Branch posterior: claude/produto-qjk4a4 (cherry-pick)
SHA posterior: [a8585f4cb540](https://github.com/Kzera-Team/Kzeraap/commit/a8585f4cb540ab0ecf1197e3ccb7822551fd435e)
PR/Merge: Nenhum PR para a base oficial localizado
O que existia: Depois do revert, outra branch reintroduziu a injeção com tratamento best-effort e também reescreveu parte do binder.
O que mudou: A alteração foi duplicada por cherry-pick em outra branch.
O que existe hoje: Nenhuma das duas cópias está na base oficial.
Teste relacionado: Sem teste associado no commit.
Impacto no módulo Cliente / Perfil: Há duas cópias equivalentes fora da base, mas ausência de merge/decisão não autoriza recuperação.
Evidência: Patch-id/conteúdo equivalente em [63aae815509a](https://github.com/Kzera-Team/Kzeraap/commit/63aae815509a7d5f0f097d685a5df4a3d1d2d80d) e a8585f4; branch --contains não inclui a base.
Confiança: ALTO
Precisa de decisão do líder? SIM

---
ID: CP-011
Classificação: EXISTE_EM_BRANCH_MAS_NAO_NA_BASE
Arquivo: src/application/perfil/FluxoImportacaoPerfisUseCase.ts
Símbolo: confirmar() e limpar() sem releaseObject
Branch de origem: desenvolvimento
SHA de origem: [9424ff6fc0fd](https://github.com/Kzera-Team/Kzeraap/commit/9424ff6fc0fd4f12199a095481d44c3518ef3bba)
Branch posterior: nova_desenvolvimento_de_n1
SHA posterior: [b91223b5fd43](https://github.com/Kzera-Team/Kzeraap/commit/b91223b5fd4363c4969524399416dc37fb7623c8)
PR/Merge: Commit agregado a trabalho de outro módulo; sem PR específico de Perfil
O que existia: A versão da branch removeu releaseObject no confirmar/limpar e passou a resetar o estado apenas após sucesso.
O que mudou: A base continuou com o cleanup em finally e reset garantido.
O que existe hoje: O commit não é ancestral da base.
Teste relacionado: Nenhum teste de Perfil alterado por esse commit.
Impacto no módulo Cliente / Perfil: Diferença comportamental de erro/limpeza permanece sem evidência de decisão específica.
Evidência: Diff [9424ff6fc0fd](https://github.com/Kzera-Team/Kzeraap/commit/9424ff6fc0fd4f12199a095481d44c3518ef3bba) e comparação com [b91223b5fd43](https://github.com/Kzera-Team/Kzeraap/commit/b91223b5fd4363c4969524399416dc37fb7623c8).
Confiança: ALTO
Precisa de decisão do líder? SIM

---
ID: CP-017
Classificação: EXISTE_EM_BRANCH_MAS_NAO_NA_BASE
Arquivo: src/{domain,application,infrastructure}/importacao/perfis/**; src/app/importacao/createImportacaoPerfisSeguraComposition.ts; tests/importacao-perfis-segura/**
Símbolo: frente segura e isolada de importação de perfis
Branch de origem: recuperacao/importacao-perfis-reprocessamento
SHA de origem: [c764d878db21](https://github.com/Kzera-Team/Kzeraap/commit/c764d878db2159b92cd0bdc3d3d04c6916ad15d8)
Branch posterior: mesma branch
SHA posterior: [b50597771d01](https://github.com/Kzera-Team/Kzeraap/commit/b50597771d01b4ac9056cdd975c4685746e4adf6)
PR/Merge: Nenhum PR localizado; branch 14 commits à frente e 2 atrás da base após merge-base 8f2684a
O que existia: A branch criou contratos escopados, duplicidade explícita, idempotência, cancelamento, retry, IndexedDB protegido, gateway e composition isolada.
O que mudou: A própria entrega registra que o wiring global protegido não foi alterado e que a UI atual continua no fluxo legado.
O que existe hoje: Os 11 arquivos de código/teste não estão na base oficial.
Teste relacionado: 16 testes TypeScript reais foram escritos em 53b72ad, mas o documento da própria branch declara que não foram executados.
Impacto no módulo Cliente / Perfil: É implementação paralela completa, não alteração perdida durante merge. Integração depende de decisões de produto e de wiring explícito.
Evidência: Commits [c764d878db21](https://github.com/Kzera-Team/Kzeraap/commit/c764d878db2159b92cd0bdc3d3d04c6916ad15d8)…[b50597771d01](https://github.com/Kzera-Team/Kzeraap/commit/b50597771d01b4ac9056cdd975c4685746e4adf6) e docs/recuperacao/importacao-perfis-reprocessamento.md na branch.
Confiança: ALTO para linhagem; BAIXO para correção comportamental não executada
Precisa de decisão do líder? SIM

---
ID: CP-020
Classificação: EXISTE_EM_BRANCH_MAS_NAO_NA_BASE
Arquivo: tests/perfil-importacao-xlsx.test.cjs
Símbolo: caminho de documento lido pelo teste
Branch de origem: mover_docs_qa/n1 e descendentes
SHA de origem: [a291d3815888](https://github.com/Kzera-Team/Kzeraap/commit/a291d3815888e9337744c3d85997d28fc1b3210b)
Branch posterior: nova_desenvolvimento_de_n1
SHA posterior: [b91223b5fd43](https://github.com/Kzera-Team/Kzeraap/commit/b91223b5fd4363c4969524399416dc37fb7623c8)
PR/Merge: chegou a branches via [PR #82](https://github.com/Kzera-Team/Kzeraap/pull/82), não à base oficial
O que existia: O teste lia docs/importacao/CONFIRMACAO_HISTORICO_FINANCEIRO_1.19.3.md.
O que mudou: A branch atualizou somente o caminho documental.
O que existe hoje: A base mantém o caminho antigo; o teste direto ainda passa no snapshot auditado.
Teste relacionado: O próprio perfil-importacao-xlsx.test.cjs.
Impacto no módulo Cliente / Perfil: Não altera comportamento de Perfil e não configura teste removido/enfraquecido.
Evidência: Diff [a291d3815888](https://github.com/Kzera-Team/Kzeraap/commit/a291d3815888e9337744c3d85997d28fc1b3210b) e alcance de branches.
Confiança: ALTO
Precisa de decisão do líder? NÃO
