# Kzera Perfil 1.0.4 - Fluxo Completo de Importação

## Fluxo

1. Usuário seleciona arquivo `.xls`, `.xlsx`, `.csv`, `.tsv` ou `.txt`.
2. `ImportacaoPerfisArquivoUseCase` identifica o formato.
3. Arquivos de planilha usam `SheetJsPerfilSpreadsheetImportGateway`.
4. CSV/TSV/TXT usam parser delimitado.
5. O sistema gera a prévia.
6. Usuário ajusta por registro:
   - Bairro;
   - Cidade;
   - Conhece Pessoalmente.
7. Usuário confirma.
8. Apenas registros válidos são importados.
9. Registros inválidos são retornados como `ignoradosInvalidos`.
10. Perfis são criados sem codigo.
11. Codigo será definido depois quando houver bairro.

## Regras

- Nome obrigatório.
- Bairro opcional.
- Cidade padrão: Brasília.
- Conhece Pessoalmente não precisa estar no arquivo.
- Codigo nunca vem do arquivo.
- Não descartar erro silenciosamente.
- Prévia é obrigatória antes de criar perfis.
