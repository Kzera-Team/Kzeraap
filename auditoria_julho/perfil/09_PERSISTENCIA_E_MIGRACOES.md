# Persistência e migrations

## Estado atual

- Perfis: `createRepositoryComposition → createOperationalPersistence('perfis') → IndexedDbRepository → PerfilRepository`.
- Banco: `kzera_operacional_1102`, versão 5, store lógico `perfis`.
- Fallback: se `indexedDB` não existe, a composition usa `InMemoryRepository<Perfil>`.
- Campos abertos do record: id, codigo, conhecePessoalmente, status, createdAt, updatedAt, packedPayload.
- Payload protegido: nome, telefone, email, endereco, bairro, municipio, observacoes.
- Histórico, resoluções de duplicidade e regras de identidade: repositórios em memória criados dentro de `createPerfilModule`.
- Migration específica de Perfil: nenhuma encontrada em qualquer branch.
- Mudança de campos após criação: nenhuma encontrada em `PerfilRepository.ts` ou `PerfilPayloadFields.ts`.

## Achados

ID: CP-012
Classificação: PRESERVADO_COM_ALTERACAO_COMPATIVEL
Arquivo: src/app/createOperationalPersistence.ts; createRepositoryComposition.ts
Símbolo: store perfis e wiring do PerfilRepository
Branch de origem: fix/apply-checklist-completa-canonico
SHA de origem: [ff275000574e](https://github.com/Kzera-Team/Kzeraap/commit/ff275000574ee6d2b34728294512315b872c6d6c)
Branch posterior: nova_desenvolvimento_de_n1
SHA posterior: [06556b9100dd](https://github.com/Kzera-Team/Kzeraap/commit/06556b9100dd081fb385548ebfb9d29ca73a8928)
PR/Merge: Sincronização de raiz; sem PR específico
O que existia: A factory de persistência operacional já existia em branch divergente, criada a partir de zip canônico.
O que mudou: O commit de sincronização adicionou à base um blob byte a byte idêntico e extraiu o wiring antes inline.
O que existe hoje: A composition usa store lógico perfis no banco kzera_operacional_1102, versão 5, envolvendo-o com PerfilRepository.
Teste relacionado: persistence-foundation e perfil-module são textuais; não há teste IndexedDB real de Perfil.
Impacto no módulo Cliente / Perfil: Código copiado de branch divergente foi preservado exatamente; não há evidência de sobrescrita da lógica de Perfil.
Evidência: Blob ab6537dd18faa6814932b782a54bfcdd359b6195 idêntico em [ff275000574e](https://github.com/Kzera-Team/Kzeraap/commit/ff275000574ee6d2b34728294512315b872c6d6c) e [06556b9100dd](https://github.com/Kzera-Team/Kzeraap/commit/06556b9100dd081fb385548ebfb9d29ca73a8928).
Confiança: ALTO
Precisa de decisão do líder? NÃO

---
ID: CP-013
Classificação: PRESERVADO
Arquivo: src/infrastructure/repositories/PerfilRepository.ts; src/runtime/PerfilPayloadFields.ts
Símbolo: PerfilRecord, PerfilPayload, pack/unpack e campos sensíveis
Branch de origem: claude/file-upload-project-22m8hs
SHA de origem: [5655c69be77b](https://github.com/Kzera-Team/Kzeraap/commit/5655c69be77be1ff66e61225087f48b7caa0aebd)
Branch posterior: nova_desenvolvimento_de_n1
SHA posterior: [b91223b5fd43](https://github.com/Kzera-Team/Kzeraap/commit/b91223b5fd4363c4969524399416dc37fb7623c8)
PR/Merge: Sem alteração posterior desses arquivos
O que existia: Record aberto com id, código, conhecePessoalmente, status, timestamps e packedPayload; nome/telefone/e-mail/endereço/bairro/município/observações ficam no payload protegido.
O que mudou: Nenhuma mudança histórica posterior nesses arquivos.
O que existe hoje: O mesmo blob lógico permanece na base.
Teste relacionado: perfil-typescript-contract e perfil-module fazem inspeção textual; não há round-trip real do repositório.
Impacto no módulo Cliente / Perfil: Não foram encontrados campos removidos nem mudança de schema sem migration correspondente.
Evidência: git log --all --follow retorna apenas [5655c69be77b](https://github.com/Kzera-Team/Kzeraap/commit/5655c69be77be1ff66e61225087f48b7caa0aebd) para ambos os arquivos.
Confiança: ALTO
Precisa de decisão do líder? NÃO

---
ID: CP-014
Classificação: PRESERVADO
Arquivo: src/app/createPerfilModule.ts
Símbolo: identityRules, historicoPerfis e resolucoesDuplicidade
Branch de origem: claude/file-upload-project-22m8hs
SHA de origem: [5655c69be77b](https://github.com/Kzera-Team/Kzeraap/commit/5655c69be77be1ff66e61225087f48b7caa0aebd)
Branch posterior: nova_desenvolvimento_de_n1
SHA posterior: [b91223b5fd43](https://github.com/Kzera-Team/Kzeraap/commit/b91223b5fd4363c4969524399416dc37fb7623c8)
PR/Merge: Sem mudança posterior no wiring desses três repositórios
O que existia: Os três estados eram instanciados como InMemoryRepository dentro de cada módulo.
O que mudou: Nenhuma branch encontrada os converteu em persistência durável.
O que existe hoje: Continuam em memória; perfis em si usam IndexedDB quando disponível.
Teste relacionado: perfil-historico, perfil-duplicidade e perfil-identidade-config são testes textuais.
Impacto no módulo Cliente / Perfil: A ausência de persistência durável não resulta de perda entre branches: é o estado original preservado.
Evidência: Blame/histórico de createPerfilModule e busca global por repositórios desses tipos.
Confiança: ALTO
Precisa de decisão do líder? NÃO

---
ID: CP-019
Classificação: PRESERVADO
Arquivo: migrations/schemas/stores relacionados a Perfil
Símbolo: store perfis e versão do banco
Branch de origem: linhagem inicial / factory canônica
SHA de origem: [5655c69be77b](https://github.com/Kzera-Team/Kzeraap/commit/5655c69be77be1ff66e61225087f48b7caa0aebd) e [ff275000574e](https://github.com/Kzera-Team/Kzeraap/commit/ff275000574ee6d2b34728294512315b872c6d6c)
Branch posterior: nova_desenvolvimento_de_n1
SHA posterior: [b91223b5fd43](https://github.com/Kzera-Team/Kzeraap/commit/b91223b5fd4363c4969524399416dc37fb7623c8)
PR/Merge: Não aplicável
O que existia: PerfilRepository/Payload não tiveram evolução de campos; o store operacional usa criação aditiva por IndexedDbConnection.
O que mudou: Não foi encontrado arquivo de migration específico de Perfil em nenhuma branch.
O que existe hoje: Store perfis existe na lista da versão 5; não há migration nominal de Perfil nem alteração de campos a reconciliar.
Teste relacionado: Sem teste de upgrade de IndexedDB para Perfil.
Impacto no módulo Cliente / Perfil: Não há evidência de migration perdida; há apenas ausência histórica de migrations específicas.
Evidência: git log --all dos arquivos de persistência e busca por migration/schema/store.
Confiança: ALTO
Precisa de decisão do líder? NÃO
