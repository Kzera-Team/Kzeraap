# Implementações antigas que não devem ser recuperadas

ID: CP-005
Classificação: REVERTIDO
Arquivo: src/presentation/perfil/templates/PerfilImportacaoTemplate.ts
Símbolo: PERFIL_IMPORT_TEMPLATE extraído
Branch de origem: claude/file-upload-project-22m8hs
SHA de origem: [7a925f7a20b3](https://github.com/Kzera-Team/Kzeraap/commit/7a925f7a20b3f786e9cbd96e2f763d4d80afa9c1)
Branch posterior: mesma linhagem
SHA posterior: [e5f97949f9ae](https://github.com/Kzera-Team/Kzeraap/commit/e5f97949f9ae2ffa490e23765a37452ee7401e44)
PR/Merge: Sem PR individual identificado
O que existia: O template de importação foi extraído para um arquivo TypeScript dedicado.
O que mudou: Um commit explícito “Revert” removeu o arquivo e restaurou a forma anterior.
O que existe hoje: O caminho TypeScript extraído não existe na base; a versão HTML posterior é distinta.
Teste relacionado: Nenhum teste específico do ato de extração.
Impacto no módulo Cliente / Perfil: A ausência é resultado de revert explícito, não perda silenciosa.
Evidência: Par origem/revert [7a925f7a20b3](https://github.com/Kzera-Team/Kzeraap/commit/7a925f7a20b3f786e9cbd96e2f763d4d80afa9c1) → [e5f97949f9ae](https://github.com/Kzera-Team/Kzeraap/commit/e5f97949f9ae2ffa490e23765a37452ee7401e44).
Confiança: ALTO
Precisa de decisão do líder? NÃO

---
ID: CP-006
Classificação: IMPLEMENTACAO_ANTIGA_NAO_RECUPERAR
Arquivo: src/presentation/perfil/components/PerfilListCard/PerfilListCard.html e refatoração associada
Símbolo: PerfilCardRenderer retornando HTMLElement; template HTML externo
Branch de origem: claude/ana-t8q304 (também claude/alterar-perfis)
SHA de origem: [788f0fafe12f](https://github.com/Kzera-Team/Kzeraap/commit/788f0fafe12fd69456b25dc5c6b22203cfc30e55)
Branch posterior: nova_desenvolvimento_de_n1
SHA posterior: [b91223b5fd43](https://github.com/Kzera-Team/Kzeraap/commit/b91223b5fd4363c4969524399416dc37fb7623c8)
PR/Merge: [PR #18](https://github.com/Kzera-Team/Kzeraap/pull/18) fechado sem merge
O que existia: A branch extraía HTML, centralizava injeção de templates e mudava PerfilCardRenderer de string para HTMLElement.
O que mudou: O PR #18 foi encerrado com a justificativa de que era antigo e não necessário após a consolidação de desenvolvimento.
O que existe hoje: PerfilListCard.html não está na base e o renderer atual mantém o contrato string.
Teste relacionado: Dois testes textuais foram adaptados apenas nessa branch.
Impacto no módulo Cliente / Perfil: Recuperar isoladamente quebraria contratos atuais e contrariaria a decisão registrada de fechamento.
Evidência: Commit [788f0fafe12f](https://github.com/Kzera-Team/Kzeraap/commit/788f0fafe12fd69456b25dc5c6b22203cfc30e55) e corpo do [PR #18](https://github.com/Kzera-Team/Kzeraap/pull/18).
Confiança: ALTO
Precisa de decisão do líder? NÃO


O “não recuperar” aqui é estritamente probatório: há revert explícito ou fechamento de PR com justificativa concreta. As demais branches não foram colocadas nesta categoria.
