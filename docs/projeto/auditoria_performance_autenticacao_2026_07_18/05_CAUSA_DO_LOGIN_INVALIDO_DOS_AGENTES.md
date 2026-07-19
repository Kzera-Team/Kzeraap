# AUTH-001 — causa do login inválido dos agentes

**Frente:** autenticação.
**Sintoma informado:** login de agentes retorna credencial inválida.
**Passos de reprodução:** indisponíveis (identificador de agente, ambiente e segredo real não foram fornecidos).
**Esperado:** identidade válida autentica com a senha temporária e recebe somente suas permissões.
**Atual:** a única entrada aceita é uma senha local; a falha é genérica.
**Causa comprovada:** incompatibilidade de requisito com a implementação: não há qualquer identidade de agente/humano, lookup, papel ou autorização no código. O fluxo valida exclusivamente se a senha deriva a chave que abre o probe do navegador atual.
**Evidência:** `LoginUseCase` recebe somente `{ password }`; `AccessCoordinator.open` recebe somente `{ password }`; `RuntimeMetadata` tem somente material criptográfico.
**Risco:** incluir `TEMP_SHARED_LOGIN_SECRET` em Vite expõe o valor no bundle; usar a senha para substituir identidade removeria autorização.
**Correção mínima:** requer decisão de arquitetura e serviço seguro de autenticação; não implementada.
**Condição de parada:** atingida — segredo real ausente e arquitetura exclusivamente local sem mecanismo aprovado para segredo de ambiente seguro.
