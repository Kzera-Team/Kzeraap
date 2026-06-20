# Kzera 1.8.7 - Correções de SessionContext e Inatividade

## Corrigido

- `SessionContext` recebe `Clock` por injeção e usa `SystemClock` apenas como padrão.
- `SessionContext` não usa `Date.now()` diretamente.
- `requiresPassword()` calcula `state()` uma única vez.
- Erros críticos de sessão usam `DomainError` especializado:
  - `SessionLockedError`;
  - `SessionFaceIdRequiredError`.
- `AccessCoordinator` implementa `Releasable`.
- `ResourceScope` registra `session` e `accessCoordinator`.
- `ConfirmarFaceIdUseCase` usa `DomainError`.
- Criado `createSecurePerfilUiApp()` para hookar `SessionActivityController` na UI.

## Inatividade na UI

A UI segura deve ser montada por `createSecurePerfilUiApp()`, que:

- registra listeners de atividade no `document`;
- chama `SessionActivityController.evaluate()`;
- limpa memória no `unmount()`;
- usa o mesmo `Clock` injetado.

A tela demo `browserMain.ts` ainda usa repositório em memória para validação visual.
A integração final PWA deve montar a versão segura quando usar sessão criptográfica real.
