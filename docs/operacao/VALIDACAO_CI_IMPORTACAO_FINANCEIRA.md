# Validação CI — Importação financeira

Branch base oficial: `desenvolvimento`

## Motivo

Depois do PR #20, o workflow CI foi corrigido para executar o build com:

```bash
npm exec vite -- build
```

Este arquivo existe apenas para abrir um PR mínimo e acionar o CI corrigido contra `desenvolvimento`.

## Critério de aceite DevOps

1. CI precisa executar o step Build sem o erro `vite: not found`.
2. Testes e typecheck precisam iniciar após o build.
3. Se CI falhar, registrar o erro objetivo.
4. Se CI passar, próxima etapa é renderização real no Chrome e prints.

## Fluxo após CI verde

1. DevOps gera evidência visual real.
2. José executa autoteste de dev.
3. Max libera Rose.
4. Rose executa QA formal.
