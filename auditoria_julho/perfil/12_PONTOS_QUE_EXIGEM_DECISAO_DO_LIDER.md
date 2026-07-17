# Pontos que exigem decisão do líder

1. **Frente segura de julho (CP-017):** integrar, rejeitar ou manter isolada. A decisão inclui UI de duplicidade/retry e cinco políticas que a própria branch deixou pendentes. Não há recomendação automática de merge.
2. **Reprocessamento CP-010:** decidir se a reintrodução após o revert representa intenção ainda válida. Há duas cópias fora da base e nenhuma evidência de merge para a base.
3. **Variantes de UI CP-007/CP-008:** escolher conscientemente ou rejeitar; ambas sobrepõem o binder atual e não possuem teste funcional.
4. **Fluxo cleanup CP-011:** decidir entre cleanup garantido em finally e reset somente após sucesso; o commit não documenta decisão específica de Perfil.
5. **Proteção de testes CP-015/CP-016:** decidir qual suíte oficial deve voltar a executar e quais contratos textuais continuam válidos. A auditoria não propõe novos testes.

## Achados correspondentes

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
ID: CP-015
Classificação: PARCIALMENTE_PRESERVADO
Arquivo: package.json; tests/*perfil*; tests/*cliente*
Símbolo: script npm test / proteção automática do módulo
Branch de origem: claude/file-upload-project-22m8hs
SHA de origem: [5655c69be77b](https://github.com/Kzera-Team/Kzeraap/commit/5655c69be77be1ff66e61225087f48b7caa0aebd)
Branch posterior: branch de importação incorporada à base
SHA posterior: [9a8292f98cda](https://github.com/Kzera-Team/Kzeraap/commit/9a8292f98cdab5f17b51ba6be7713bd89fd5f141)
PR/Merge: Sem PR específico localizado
O que existia: npm test executava uma cadeia de testes e npx tsc --noEmit, incluindo três testes centrais de perfil-importação.
O que mudou: O script foi trocado por echo “Testes temporariamente desabilitados neste branch”.
O que existe hoje: npm test retorna sucesso sem executar teste algum.
Teste relacionado: O próprio mecanismo de execução é o objeto do achado.
Impacto no módulo Cliente / Perfil: Arquivos de teste sobreviveram, mas a proteção automática foi enfraquecida.
Evidência: Diff [9a8292f98cda](https://github.com/Kzera-Team/Kzeraap/commit/9a8292f98cdab5f17b51ba6be7713bd89fd5f141) e package.json em [b91223b5fd43](https://github.com/Kzera-Team/Kzeraap/commit/b91223b5fd4363c4969524399416dc37fb7623c8).
Confiança: ALTO
Precisa de decisão do líder? SIM

---
ID: CP-016
Classificação: PARCIALMENTE_PRESERVADO
Arquivo: 35 testes de perfil/cliente na base
Símbolo: contratos textuais e execução direta
Branch de origem: claude/file-upload-project-22m8hs
SHA de origem: [5655c69be77b](https://github.com/Kzera-Team/Kzeraap/commit/5655c69be77be1ff66e61225087f48b7caa0aebd)
Branch posterior: nova_desenvolvimento_de_n1
SHA posterior: [b91223b5fd43](https://github.com/Kzera-Team/Kzeraap/commit/b91223b5fd4363c4969524399416dc37fb7623c8)
PR/Merge: Não aplicável
O que existia: Os testes foram criados como scripts CJS baseados predominantemente em readFileSync/includes, não como execução do código TypeScript real.
O que mudou: Não houve exclusão de teste; dois foram ajustados em branches fora da base e um foi ampliado na base.
O que existe hoje: Execução direta individual: 18 aprovados e 17 reprovados. Todos os 35 usam inspeção textual; nenhum é teste de navegador ou round-trip real do domínio/repositório.
Teste relacionado: Lista nominal em 08_TESTES_REMOVIDOS_OU_ENFRAQUECIDOS.md.
Impacto no módulo Cliente / Perfil: A presença dos arquivos não equivale a proteção funcional atual.
Evidência: Execução com Node 24 sobre arquivo exportado exatamente de [b91223b5fd43](https://github.com/Kzera-Team/Kzeraap/commit/b91223b5fd4363c4969524399416dc37fb7623c8); classificação estrutural por leitura dos 35 scripts.
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
