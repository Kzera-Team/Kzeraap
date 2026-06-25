# Validação CI pós-merge DevOps

Este arquivo existe apenas para disparar um novo pull request contra `desenvolvimento` após o merge do PR #22.

Objetivo operacional:

1. Confirmar que o `package-lock.json` contaminado foi removido.
2. Confirmar que o workflow usa registry público do npm.
3. Confirmar que `npm install --include=dev` passa.
4. Confirmar que o build com Vite passa.
5. Confirmar que testes/typecheck rodam.

Fluxo após CI verde:

DevOps roda/renderiza app real → José faz autoteste de dev → Max revisa → Rose valida → Senhora Cansada homologa.
