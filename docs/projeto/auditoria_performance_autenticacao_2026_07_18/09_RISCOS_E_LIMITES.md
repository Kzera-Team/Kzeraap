# Riscos e limites

* **Crítico:** segredo em frontend é segredo público após build; não usar `TEMP_SHARED_LOGIN_SECRET` em código Vite.
* **Crítico:** a senha mestra atual é também material de criptografia local. Trocar a sem recriptografar dados torna o probe/dados inacessíveis.
* **Alto:** não há modelo de identidades ou RBAC. Implementar login de agentes exigiria contrato/arquitetura nova, não um patch mínimo.
* **Alto:** a alteração prévia de `pnpm-lock.yaml` conflita com o escopo de auditoria; foi isolada e preservada.
* **Médio:** potencial custo de `getAll` + descriptografia integral requer perfil com dados reais anonimizados antes de intervenção.
