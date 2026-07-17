# Testes removidos ou enfraquecidos

## Resultado

- Removidos: **0**.
- Presentes: **35**.
- Execução direta no snapshot da base: **18 passaram / 17 falharam**.
- `npm test`: retorna sucesso apenas imprimindo mensagem; não executa os testes.
- Natureza: os 35 scripts inspecionam texto-fonte; nenhum executa o módulo TypeScript real ou IndexedDB/navegador real.

| Teste | Execução direta | Natureza | Linhagem |
| --- | --- | --- | --- |
| codigo-cliente-primeiro-acesso-1924.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| codigo-perfil-campos-condicionais.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| codigo-perfil-initial-empty-min3.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-browser-contract.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-busca-avancada.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-duplicidade-central.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-duplicidade.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-exportacao.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-final-contract.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-historico.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-identidade-config.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-importacao-celular-telefone-vazio-11924.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-importacao-celular-unico-11912.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-importacao-erros.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-importacao-fluxo.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69; ampliado em 0f2eca0 |
| perfil-importacao-iphone-11910.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-importacao-iphone-11911.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-importacao-iphone-1198.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-importacao-iphone-1199.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-importacao-parser.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-importacao-preview.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-importacao-senhora-cansada-11925.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-importacao-visual-print-11913.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-importacao-xlsx.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-item-create-screen.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-module.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-pendencias-dashboard.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-relacionamento-futuro.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-selecao.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-typescript-contract.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-ui-functional.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-ux-app-state.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-ux-final-197.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-ux-real.test.cjs | FALHOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |
| perfil-ux-style.test.cjs | PASSOU | textual (readFileSync/includes) | presente; nasceu em 5655c69 |

## Frente segura fora da base

`tests/importacao-perfis-segura/ImportacaoPerfisSegura.test.ts` contém 16 testes com `node:test` e doubles executáveis. Nasceu em [53b72ad0edbf](https://github.com/Kzera-Team/Kzeraap/commit/53b72ad0edbfe9fdf1815ec6243fde6bf18ec6ef), não está na base e a própria entrega declara que não foi executado.

## Cadeia de evidência

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
