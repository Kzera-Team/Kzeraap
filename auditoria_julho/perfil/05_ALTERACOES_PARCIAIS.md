# Alterações parcialmente preservadas

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
