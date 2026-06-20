# 1.14.1 — Política de documentação e dados sensíveis

## Decisão

Não criptografar toda a documentação.

A documentação que orienta a equipe precisa continuar legível, fácil de abrir e simples de revisar. Se a leitura diária, as lições aprendidas e o checklist ficarem escondidos atrás de senha/criptografia, a equipe para de ler e volta a cometer erro básico.

A regra correta é separar documentação, dado real e segredo.

## Camadas de proteção

| Tipo de conteúdo | Regra |
| --- | --- |
| Governança, UX, checklist e lições aprendidas | Fica legível no repositório |
| Regra de negócio genérica | Fica legível, sem dados reais identificáveis |
| Estratégia financeira sensível | Pode existir em documento técnico, mas sem cliente real, carteira real ou valor real identificável |
| CSV real, importação, transações reais, nomes reais e valores reais | Não versionar como documentação; tratar como dado operacional protegido |
| Backup | Criptografado |
| Senha, token, chave, seed phrase, credencial, chave privada, webhook ou API key | Nunca colocar no repositório |
| Carteira real, conta bancária real e identificador externo sensível | Não usar em exemplo de documentação |

## Regra operacional

Documentação operacional deve ser legível.
Dados reais e segredos devem ser protegidos.

## O que pode ficar aberto

- Teste da Usuária.
- Separação Pendência x Backlog.
- Regras de Dashboard.
- Versionamento.
- Lições aprendidas.
- Checklist antes de alterar código.
- Arquitetura de camadas.
- Regras genéricas de estoque, financeiro e importação.

## O que não pode ficar aberto

- CSV real de transações.
- Nome real de cliente em exemplo.
- Valor real sensível importado.
- Carteira real.
- Conta bancária real.
- Chave privada, seed phrase, token, senha ou credencial.
- Backup descriptografado.
- Arquivo de conciliação real.

## Exemplos permitidos

Usar exemplos fictícios e neutros:

- Cliente Exemplo
- Perfil Teste
- Conta Manual
- Carteira Fictícia A
- Valor de exemplo

Não usar exemplos reais de operação.

## Regra para importação

Arquivo CSV real não é documentação. CSV real é dado operacional.

Quando a importação de transações for implementada, o arquivo deve ser lido pelo app, validado e salvo como dado protegido quando aplicável. O CSV real não deve ser mantido em `docs/`, nem dentro do pacote fonte como exemplo permanente.

## Regra para backup

Backup deve permanecer criptografado e discreto.

A documentação pode explicar o formato geral do backup, mas não deve conter amostra real de backup, dado real ou material que permita reconstruir dados reais.

## Teste da Usuária

A usuária cansada precisa que a equipe leia a governança rapidamente antes de codar. Por isso a documentação de governança não deve ser criptografada.

A proteção deve cair sobre o que expõe pessoas, dinheiro, importações reais, contas, carteiras, credenciais e backups.
