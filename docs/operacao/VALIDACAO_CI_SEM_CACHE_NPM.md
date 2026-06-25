# Validação CI sem cache npm

Este arquivo força nova sincronização do PR #23 depois do ajuste do workflow.

Ajuste aplicado:

- remover `cache: npm` do `actions/setup-node`, porque o `package-lock.json` foi removido de propósito;
- manter Node 20;
- manter registry público do npm;
- manter `install-log` e `build-log`.

Critério:

1. Setup Node.js não pode falhar por ausência de lockfile.
2. Install dependencies deve iniciar.
3. Build e testes devem rodar se a instalação passar.
