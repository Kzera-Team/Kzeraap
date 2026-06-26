# Escopo — seletor nativo do backup

Base atualizada: sim

Arquivos alterados:
- public/static/backup-recovery-trigger.js
- package.json

Regra/storage/cripto tocados: nao

Versao incrementada: sim

Print antes/depois: nao — ambiente sem render local.

Teste executado: nao — validacao feita por diff.

Observacoes:
- Remove modal intermediario.
- Abre input file nativo diretamente no gesto do usuario.
- Mantem restauracao e cripto sem alteracao.
