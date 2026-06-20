# Kzera Perfil 1.0.3 - Importação XLS/XLSX no iPhone

## Formatos aceitos

- `.xlsx`
- `.xls`
- `.csv`
- `.tsv`
- `.txt`

## iPhone

A importação deve aceitar arquivos vindos de:

- Arquivos do iOS;
- iCloud Drive;
- Downloads;
- Google Drive via seletor do iOS;
- compartilhamento para o app/PWA, quando disponível.

## Regras

- O usuário seleciona o arquivo.
- O sistema lê a primeira aba da planilha.
- O sistema mapeia colunas por aliases.
- O sistema gera prévia obrigatória.
- Na prévia, o usuário pode ajustar:
  - Bairro;
  - Cidade;
  - Conhece Pessoalmente.
- Cidade vazia assume `Brasília`.
- `Conhece Pessoalmente` não precisa existir no arquivo.
- Codigo nunca é importado.
- XLS/XLSX usam gateway `SheetJsPerfilSpreadsheetImportGateway`.

## Accept do input de arquivo

`.csv,.tsv,.txt,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
