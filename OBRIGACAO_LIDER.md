# OBRIGAÇÃO DO LÍDER — Kzera

## Documentos existentes

- Pegar todos os documentos existentes do projeto.
- Ver quais documentos ainda são úteis.
- Ver quais documentos não são mais úteis.
- Separar documento vigente de documento histórico.
- Não tratar documento antigo como regra atual sem validação do líder.

## Manual do commit

- Não comitar sem pedir autorização ao líder.
- Não comitar sem validar que o arquivo está cumprindo os princípios do SOLID.
- Não comitar sem validar se a alteração respeita a arquitetura modular do projeto.
- Se houve alteração de segurança, validar com o responsável antes do commit.
- Se houver dúvida de regra, parar e perguntar.

## Manual do print

- Print não deve ser inventado.
- Print não deve ser manipulado.
- Print não deve ser copiado de outra situação.
- Se o líder pediu o print, o responsável faz o print real.
- Se não tiver como fazer o print real, sinalizar claramente.
- Nunca substituir print real por suposição visual.

## Refatoração obrigatória

Após a finalização da transação, deve-se refatorar o código de todo o projeto.

Essa refatoração inclui:

- domínio;
- aplicação;
- infraestrutura;
- persistência;
- frontend;
- componentes visuais;
- fluxos de importação;
- regras duplicadas;
- documentação obsoleta.

A refatoração deve preservar comportamento aprovado e reduzir acoplamento, duplicação e responsabilidade indevida.
