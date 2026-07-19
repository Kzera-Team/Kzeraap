# Mapa do fluxo atual de autenticação

## Fluxo efetivamente implementado

Entrada de senha (formulário local)
→ validação apenas de presença/comprimento
→ PBKDF2 (600.000 iterações, salt local) para uma `CryptoKey`
→ tentativa de descriptografar `runtime:probe`
→ abertura de `SessionContext` em memória
→ dados criptografados locais podem ser usados.

No primeiro acesso, a própria pessoa cria a senha: o salt, parâmetros PBKDF2 e probe criptografado são gravados em `localStorage`. Não há comparação com segredo de ambiente, hash de uma credencial compartilhada, usuário, agente, ID, papel, permissão, escopo, registro de auditoria nem sessão persistida com identidade.

## Consequência para AUTH-001

O erro genérico `Credencial inválida.` ocorre quando a chave derivada não abre o probe local. Isso é compatível com senha diferente, dados de navegador diferentes, cache/localStorage anterior ou metadados incompatíveis; não é possível atribuí-lo a um agente, pois agentes não existem no fluxo.
