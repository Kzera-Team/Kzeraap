# Kzera Perfil 1.0.2 - Parser CSV/TSV e Template

## Formatos aceitos

- CSV
- TSV
- TXT com separador por vírgula, ponto e vírgula ou tabulação

## XLSX

XLS/XLSX passam a ser aceitos a partir da versão 1.0.3 via gateway de planilha.

## Colunas recomendadas

- Nome
- Telefone
- E-mail
- Bairro
- Cidade
- Observação

## Regras

- Nome é obrigatório.
- Bairro pode vir vazio.
- Cidade padrão posterior: Brasília.
- Conhece Pessoalmente não vem no arquivo.
- Conhece Pessoalmente deve ser marcado na prévia por registro.
- Codigo não é importado.
- Colunas desconhecidas são ignoradas e reportadas.
