# Escopo — seletor do backup

Base atualizada: sim

Arquivos alterados:
- public/static/backup-recovery-trigger.js
- package.json

Regra/storage/cripto tocados: nao

Versao incrementada: sim

Print antes/depois: nao — ambiente sem render local.

Teste executado: nao — validacao feita por diff.

Observacoes:
- Corrige apenas o clique do botao para abrir o seletor.
- Mantem a restauracao e a cripto existentes sem alteracao.
- Usa delegacao global para nao depender do momento em que o botao foi renderizado.
