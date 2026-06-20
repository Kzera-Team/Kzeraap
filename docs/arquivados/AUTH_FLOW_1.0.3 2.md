# Kzera Foundation 1.0.3 - Fluxos de Primeiro Acesso, Login e Bloqueio

Esta parte adiciona fluxo de autenticação em camadas, sem criar UI final.

## Primeiro acesso

1. Usuário cria credencial.
2. Senha e confirmação são validadas.
3. `PrimeiroAcessoUseCase` chama `AccessCoordinator.createMasterPassword()`.
4. Salt é gerado internamente pelo `AccessCoordinator`.
5. Metadados são persistidos.
6. Sessão é encerrada após criação.

## Login

1. Usuário digita credencial.
2. `LoginUseCase` valida tamanho mínimo temporário.
3. `AccessCoordinator.unlock()` deriva a chave e valida o verificador.
4. `SessionContext` abre.

## Face ID

1. Após inatividade, `SessionContext.state()` retorna `faceid_required`.
2. `ConfirmarFaceIdUseCase` chama um `FaceIdGateway`.
3. Se confirmado, `SessionContext.confirmFaceId()` reabre a janela operacional.

## Bloqueio

`BloquearSessaoUseCase` chama `ResourceScope.wipeAll()`.

## Backup Gate

`BackupGateUseCase` aplica regra:
- backup pendente;
- um adiamento permitido;
- após o adiamento, bloqueio até backup.

## Limite desta parte

- Sem tela visual final.
- Sem integração com sensor biométrico real.
- Sem exportação de backup real.
- Sem migração de módulos funcionais.
