# Escopo — restauração com cripto existente

Base atualizada: sim

Arquivos alterados:
- src/application/backup/BackupImportUseCase.ts
- src/app/backupRestoreEntry.ts
- public/index.html
- package.json

Regra/storage/cripto tocados: sim

Versão incrementada: sim

Print antes/depois: não — alteração funcional no botão existente; ambiente sem render local.

Teste executado: não — validação feita por leitura/diff; ambiente sem checkout local.

Observações:
- Não replica PBKDF2/AES-GCM.
- Usa LoginUseCase, AccessCoordinator, SessionContext e PayloadProvider existentes.
- Usa repositories atuais para salvar; dados sensíveis voltam pelos caminhos que geram packedPayload/payloadProtegido.
