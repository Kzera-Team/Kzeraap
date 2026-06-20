# Segurança Kzera Foundation 1.0.0

## Modelo de ameaça

O sistema deve presumir que um invasor pode obter:
- dispositivo físico;
- banco local;
- código-fonte;
- arquivos de backup;
- análise forense do armazenamento.

A proteção não deve depender do sigilo do código.

## Senha Mestra

- Credencial não expira.
- Sem pergunta secreta.
- Sem recuperação.
- Esqueceu a senha: perde acesso.
- Desenvolvimento: mínimo temporário de 3 caracteres.
- TODO bloqueante antes de produção: mínimo 14 caracteres.

## Chaves

A credencial é usada para derivar a Master Key.

```text
Senha Mestra
↓
PBKDF2/Argon2id no futuro nativo
↓
Master Key
↓
Chaves de dados
```

A Master Key nunca deve ser persistida.

## Face ID

Face ID não cria chave.  
Face ID apenas reabre sessão protegida já existente.

Após reboot, crash, app encerrado ou ausência de chave em memória: exigir Senha Mestra.

## Sessão

- 1 minuto de inatividade: exigir Face ID.
- 5 horas mesmo ativo: exigir Senha Mestra.
- Se a sessão expirar: limpar dados sensíveis da memória.

## Backup

- Backup obrigatório 3x por dia.
- Um único adiamento de 20 minutos por janela.
- Após adiamento: bloquear sistema até backup.
- Backup usa a mesma credencial.
- Manter últimos 3 dias de backup.
- Pasta definida pelo usuário.
- Nome de arquivo não óbvio.
- Não usar "Kzera", "backup", "perfis" ou termos evidentes no nome.

## Campos sensíveis

Dados pessoais do perfil devem ser tratados como sensíveis:
- nome;
- telefone;
- email;
- endereço;
- bairro;
- município;
- observações livres, se existirem.

## Relatórios e exportação

Relatórios exportados ou impressos usam Identidade Operacional/Codigo por padrão.

Nome real só aparece quando o usuário marca explicitamente "Exibir nome" e passa por validação de Face ID.

Exportação é operação de risco porque gera rastros fora do app.

## Identidade Operacional / Codigo

- Codigo é identidade operacional.
- Codigo é imutável após definido.
- Mudança de regra vale apenas para novos perfis.
- Regra de codigo é configurada no primeiro acesso após criar senha.
- Regra é salva de forma protegida.
- Codigo deve ser único.
- Perfil pode existir sem codigo.
- Importação atual pode criar 100% dos perfis sem bairro e sem codigo.
- Botão "Definir" aparece ao lado do campo Codigo quando os requisitos da regra forem atendidos.
