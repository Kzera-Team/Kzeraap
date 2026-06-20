# Kzera 1.8.5 - Cadastro de Clientes/Perfis

Esta versão corrige a 1.8.3, consolida o cadastro de clientes/perfis e fecha pendências resolvíveis dentro do escopo do cadastro.

## Escopo entregue

- Entidade `Perfil` tipada com status, datas, dados sensíveis e campos operacionais.
- Regras de busca avançada por nome, código, telefone, e-mail, bairro, cidade, status e conhece pessoalmente.
- Histórico operacional de perfil.
- Central de duplicidades com possibilidade de ignorar duplicidade.
- Mesclagem protegida com arquivamento do perfil secundário.
- Exportação padrão por código/apelido, com flag explícita para nome real.
- Relatório exportável de erros de importação.
- Dashboard de pendências.
- Configuração e prévia da regra de identidade operacional.
- Preparação de vínculo futuro com transações/transações.
- Correções de TypeScript e contratos de domínio.

## Regras preservadas

- Perfil/cliente nunca é excluído.
- Perfil pode ser arquivado.
- Arquivado não aparece em busca padrão.
- Nome é obrigatório.
- Código/apelido é imutável.
- Código/apelido só é definido quando requisitos forem atendidos.
- Importação pode vir sem bairro.
- Cidade padrão da importação é Brasília.
- Conhece pessoalmente é definido na prévia da importação.
- Duplicidade nunca bloqueia automaticamente.
- Decisão final é do usuário.

## Pendências fora do escopo

- Transações.
- Produtos.
- Lotes.
- Promoções.
- Relatórios financeiros.
- Backend.
- App cliente.

Essas pendências não impedem considerar o cadastro de clientes/perfis fechado dentro do escopo atual.
