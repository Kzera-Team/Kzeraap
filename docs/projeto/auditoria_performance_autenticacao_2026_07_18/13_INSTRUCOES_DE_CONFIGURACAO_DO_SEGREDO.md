# Instruções de configuração do segredo

**Não configurar `TEMP_SHARED_LOGIN_SECRET` no cliente, em `.env` consumido por Vite, em testes versionados, em logs ou em IndexedDB/localStorage.**

Quando e somente quando houver backend aprovado, o líder deve cadastrar o valor por canal de segredo do provedor de deploy, como variável disponível exclusivamente à função/servidor. O cliente deve receber apenas resposta de autenticação/sessão; nunca o valor, hash reutilizável ou derivação do segredo.
