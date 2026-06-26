# Test Evidence

Todo PR que alterar app, UI, public, presentation ou application deve incluir um arquivo `.md` nesta pasta com evidencia real do app.

Modelo minimo obrigatorio:

```md
# Evidencia de teste — titulo

Branch:
Commit:
Comando:
URL local:
Tela testada:
Elemento testado:
Resultado observado:
Print antes:
Print depois:
Limitacao:
```

Regras:

- Teste isolado nao vale como prova do app real.
- Print/mock externo nao vale como prova do app real.
- Evidencia precisa citar branch, commit, comando, URL local e tela real testada.
- Se a validacao foi somente Chromium local, declarar isso em `Limitacao:`.
- Se nao houver evidencia real, o workflow `Test Evidence` deve falhar.
