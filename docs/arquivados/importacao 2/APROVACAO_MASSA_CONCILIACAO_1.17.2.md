# Aprovação em massa blindada — 1.17.2

## Objetivo

Corrigir a aprovação em massa criada na 1.17.1 para suportar volume real sem transformar a usuária em operadora de clique.

## Regras aplicadas

- O caso de uso revalida cada vínculo antes de gravar, mesmo que a UI diga que é seguro.
- A seleção em massa só aceita vínculos com uma transação e uma movimentação financeira.
- Registros incompletos ficam fora automaticamente.
- Registros com pendência não financeira ficam fora automaticamente.
- Divergência de valor, perfil, método ou referência bloqueia a aprovação em massa.
- A aprovação em massa aceita tanto conciliação por referência segura quanto pagamento posterior provável seguro.
- A operação valida todos os vínculos antes de salvar qualquer um.
- Se uma gravação falhar, o use case tenta restaurar os registros já alterados.
- A tela não usa `window.confirm` para decisão crítica.
- Todos os vínculos seguros aparecem marcados por padrão.
- A usuária pode desmarcar exceções antes de aprovar.
- A lista de conciliação não limita a 30 registros.
- Cada registro mantém `Ver vínculos` para abrir os detalhes vinculados.
- Existe ação para desfazer aprovações em massa ainda no staging.

## Limites mantidos

- Nada cria transação definitiva.
- Nada baixa estoque.
- Nada remove pendências não financeiras.
- Dados sensíveis continuam no staging protegido.
