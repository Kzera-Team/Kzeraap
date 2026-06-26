# Escopo do PR — PR Guard e Recuperar Backup

Base atualizada: sim

Arquivos alterados:
- public/static/backup-recovery-trigger.js
- .github/workflows/pr-guard.yml
- scripts/pr-guard/check-branch-updated.mjs
- scripts/pr-guard/check-version-bump.mjs
- scripts/pr-guard/check-temp-files.mjs
- scripts/pr-guard/check-visual-evidence.mjs
- .pr-check/escopo.template.md
- .pr-check/pr-guard-and-backup-button.md
- package.json

Regra/storage/cripto tocados: não

Versão incrementada: sim

Print antes/depois: não — não há render local disponível neste ambiente; o PR Guard passa a exigir essa evidência nos próximos PRs visuais.

Teste executado: não — não há checkout local do repo por falha de DNS para github.com neste ambiente; validação feita por diff do GitHub.

Observações:
- Botão Recuperar backup reforçado no script já carregado por public/index.html.
- PR Guard criado para impedir repetição de branch desatualizado, versão esquecida, arquivo temporário e ausência de evidência visual.
