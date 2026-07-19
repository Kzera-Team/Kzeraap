# Baseline de performance

## Congelamento

* Branch/HEAD: `work` / `ed2fe881ad47ee3530a439a5c1b2618e3ca94c5a`.
* Estado inicial: `pnpm-lock.yaml` modificado (402 inserções, 198 remoções), preservado sem edição.
* Node `v24.15.0`; package manager: pnpm `10.28.1`; scripts: `test`, `check`, `build`, `check:no-html-in-ts` e gates auxiliares.

## Medições disponíveis

| Cenário | Resultado | Limite da evidência |
|---|---:|---|
| Build de produção | 1,70 s; JS principal 279,37 kB (72,07 kB gzip) | mede compilação, não uso no dispositivo |
| Inicialização fria/cache/login/tela/troca/IDB/lista/filtro/importação/background/reload | não medido | não há base representativa, browser instrumentado, Playwright ou passos de reprodução |

Não foram adicionadas marcas `performance` para evitar telemetria/instrumentação sem cenário reproduzível. O `vite build` reportou aviso de script não-module em `public/index.html`; ele não prova lentidão.
