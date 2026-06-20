# Kzera Foundation 1.0.1 - Segurança Integrada

Esta versão corrige o problema da Parte 1: existiam classes de segurança, mas o fluxo ainda não estava fechado.

## Fluxo real esperado

1. Primeiro acesso:
   - usuário cria credencial;
   - `AccessCoordinator` gera salt forte;
   - salt e parâmetros são persistidos em `RuntimeMetadataStore`;
   - chave é derivada por PBKDF2;
   - verificador criptografado é salvo;
   - sessão é encerrada.

2. Login:
   - usuário digita credencial;
   - `AccessCoordinator` carrega metadados;
   - deriva chave com salt persistido;
   - valida o verificador;
   - abre `SessionContext`.

3. Repositórios seguros:
   - `PerfilRepository` não recebe chave solta;
   - usa `SessionContext`;
   - sem sessão válida, não salva nem lista dados sensíveis.

4. TableObfuscator:
   - gera mapa uma única vez;
   - salva mapeamento criptografado;
   - reusa o mapa ao reiniciar.

5. ResourceScope:
   - `SessionContext` é registrada no `ResourceScope`;
   - logout, timeout e bloqueio devem chamar `wipeAll()`.

## O que ainda não é objetivo desta parte

- IndexedDB real completo.
- Tela visual.
- Migração de Item/Transacao/Campanha.
- Backup real exportável.

A Parte 1 criava peças. A Parte 2 integra o fluxo de segurança.
