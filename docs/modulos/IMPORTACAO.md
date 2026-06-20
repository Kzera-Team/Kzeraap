

## Regra de status na importação de Perfis

- Verde: registro válido completo.
- Atenção: registro válido com pendência não impeditiva.
- X/Erro: registro inválido que precisa correção.
- Bairro vazio gera Atenção, não Erro.
- Atenção não bloqueia importação.
- X/Erro deve impedir a importação enquanto existir.
- O topo da pré-visualização deve ter filtro por status: Todos, Válidos, Atenção e Erros.
- O botão final deve ser: **Importar perfis**.

## Regra de telefone na importação de Perfis

- O CSV usa a coluna `celular`.
- `celular` alimenta o campo interno `telefone`.
- `telefone` é obrigatório para importar Perfil.
- Se existirem as colunas `celular` e `telefone`, e `telefone` estiver vazia, ela não pode apagar o valor de `celular`.
- Variações comuns de cabeçalho devem ser tratadas sem culpar a usuária.

## Rascunho de importação

- Rascunho de importação não é Perfil.
- Nada deve ser salvo como Perfil antes da confirmação da usuária.
- O rascunho serve apenas para preservar a pré-visualização e correções se Safari, PWA ou iPhone interromperem o uso.
- Ao reabrir, se houver rascunho, a tela deve oferecer Continuar importação ou Descartar.
- O rascunho deve ser apagado após importação concluída ou descarte manual.
- Persistência de rascunho com dados pessoais exige validação AppSec antes de implementação.
