# Vocabulário operacional protegido — 1.15.5

## Regra

Rótulo operacional sensível não pode nascer aberto no código para ser protegido depois.

O fluxo correto é:

1. criar/desbloquear a senha mestra;
2. receber os rótulos em tela autenticada;
3. proteger o payload em memória;
4. persistir somente o payload protegido;
5. manter nos registros apenas tokens neutros;
6. limpar os rótulos em memória ao bloquear ou sair.

## Onde cada coisa fica

- Banco aberto: tokens neutros, IDs e status.
- Banco protegido: dicionário real de rótulos.
- Memória autenticada: rótulos reais carregados após login.
- UI desbloqueada: rótulos reais somente enquanto a sessão estiver ativa.

## Proibições

- Não criar rótulo sensível como valor padrão no código.
- Não colocar rótulo sensível em seed, teste, documentação ou bundle.
- Não persistir rótulo real fora de payload protegido.
- Não deixar cache de rótulo após bloqueio/logout.

## Usuária

A configuração deve ocorrer uma vez, após a senha mestra. No uso diário, a tela deve continuar clara para quem está autorizado.
