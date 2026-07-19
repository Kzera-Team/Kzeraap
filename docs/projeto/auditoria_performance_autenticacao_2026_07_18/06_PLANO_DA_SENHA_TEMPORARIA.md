# Plano da senha temporária (proposto, não implementado)

1. O líder aprova um componente servidor (por exemplo, Netlify Function) e fornece `TEMP_SHARED_LOGIN_SECRET` somente no ambiente desse componente.
2. O servidor mantém uma fonte canônica de identidades ativas (humano/agente, ID, papel e permissões); o segredo é validado em comparação resistente a timing no servidor.
3. O cliente envia identificador e senha somente por HTTPS; não recebe o segredo nem derivação reutilizável.
4. O servidor emite sessão sem senha, vinculada à identidade e a permissões mínimas; logs externos permanecem genéricos.
5. Na reversão, trocar a única política de credencial no servidor, invalidar sessões emitidas sob a política compartilhada e manter dados de identidade/autorizações inalterados.

Não é seguro implementar esta solução na PWA atual, porque `import.meta.env` de Vite para código cliente é parte do bundle e o projeto não possui backend, cadastro de identidades nem autorização por papel.
