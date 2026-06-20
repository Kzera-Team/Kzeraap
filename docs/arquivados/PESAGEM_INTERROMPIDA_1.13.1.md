# 1.13.1 — Recuperação de pesagem interrompida

Esta versão corrige o cenário operacional em que a pessoa sai no meio da pesagem sem tocar em **Pausar**.

## Regra da Usuária

Se a pessoa precisou largar o celular, ir ao banheiro, atender alguém, o Safari fechou, o celular bloqueou ou a bateria acabou, os pesos já registrados não podem sumir e a retomada precisa ser óbvia.

## Comportamento esperado

- Cada peso continua salvo imediatamente.
- A próxima etiqueta permanece preservada.
- A balança usada permanece preservada.
- Uma sessão em andamento parada por tempo suficiente é tratada como **interrompida — continuação pendente**.
- A tela mostra aviso claro: nenhum peso foi perdido, confira a próxima etiqueta e toque em Continuar.
- Os botões de registrar peso ficam bloqueados até tocar em **▶️ Continuar**.
- Ao continuar, a sessão volta para **em andamento** e mantém histórico, registros, etiqueta e balança.
- O sistema não inventa horário exato da interrupção; usa a última atividade salva como referência confiável.

## O que esta versão não faz

- Não implementa conferência real.
- Não implementa retirada interna.
- Não inicia transações.
- Não conecta balança automaticamente.
