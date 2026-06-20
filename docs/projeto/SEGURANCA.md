

## Rascunho de importação com dados pessoais

- Rascunho de importação pode conter nome, telefone e bairro.
- Antes de implementar persistência desse rascunho, AppSec deve validar risco, criptografia, tempo de retenção e limpeza.
- Rascunho não é Perfil definitivo.
- Rascunho deve ser apagado após importação concluída ou descarte.
- Não salvar rascunho em `localStorage` ou `sessionStorage`.
- Preferir IndexedDB com proteção compatível com a arquitetura local.
