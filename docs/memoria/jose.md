# Memória — jose

Arquivo de registro pessoal do papel **jose**. Anotar aqui decisões tomadas, contexto relevante da própria atuação, e pendências que não cabem no registro geral do Tech Lead.

Regra: cada papel escreve só no seu próprio arquivo. Não editar arquivo de memória de outro papel.

Nem o líder pode alterar este arquivo. Nenhuma linha existente pode ser removida — memória e vivência registradas não mudam. Correção ou atualização é sempre feita por acréscimo, por escrito, aqui mesmo — nunca apagando o que já existe.

## Registro

### 2026-07-11 — Incidente sal efêmero no chatzera (deploy claude_dev/Railway)

- Contexto: repasse da Malu com fala literal do líder ("chamar o José pra corrigir isso"). Todas as rotas que leem banco davam 500 (`SECURE_PERSISTENCE_DECRYPT_FAILED`) após redeploy.
- Causa raiz confirmada: sal da KDF persistido só em arquivo local (`SECURITY_SALT_PATH`) e disco do container é efêmero. Redeploy → sal perdido → chave nova não abria os campos cifrados no Postgres.
- Decisão técnica minha (autorizada a decidir): sal durável no registro `security_salt` da tabela `meta` do próprio Postgres (junto do dado que ele abre, sem passo manual no Railway); env `SECURITY_SALT` como override explícito; arquivo como fallback sem banco. Novo módulo `infrastructure/salt_store.py`.
- Segunda correção: `decrypt_value_if_unlocked` agora degrada por registro — registro indecifrável volta cifrado intacto (log `secure_persistence.decrypt_failed` 1x por registro/processo) em vez de derrubar toda rota com 500. Caminho estrito `decrypt_value` continua estrito.
- Commits na dev_claude do chatzera (autorização permanente do líder para essa branch): `6391fbb` (fix) e `003d658` (commit vazio para forçar redeploy de validação). main não tocada.
- Validação ao vivo: /agents e /tasks/board 200; ciclo escrita→redeploy→login mesma senha→dado legível comprovou sal durável. `POST /db/reset` usado para limpar registros mortos (perda aceita pelo líder). Doc em `docs/runner-setup.md` seção 4 do chatzera.
- Regra 12 respeitada: trabalhei em worktree isolado, checkout `/home/user/chatzera` intacto na `claude/new-session-i043af`; worktree removido ao final.
- Testes: 5 novos em `tests/test_security_salt_durability.py`, todos verdes; 10 falhas pré-existentes da suíte no ambiente local inalteradas (antes e depois).
- Pendente: commit desta memória (Kzeraap) aguarda autorização do líder, conforme minha regra de commit.
- Atualização (mesmo dia): pendência acima resolvida — ver decisão de governança abaixo. Task de validação `task_80dbc51f` fica no banco dev; Malu vai movê-la pra done como registro do teste. Frente encerrada pela Malu.

### 2026-07-11 — Decisão de governança: commit de memória própria não precisa de permissão

- Decisão do líder (2026-07-11, sessão claude/o-grande-dia-riz5mc), literal: "memória de vocês não precisa de permissão" — agentes commitam a própria memória sem pedir caso a caso.
- Verifiquei antes de agir: registrada na memória canônica da Malu (`origin/malu/memoria` do chatzera, `docs/memoria/malu.md`, seção de decisões; Bruno já havia commitado a dele sob essa regra, commit `686c735`).
- Efeito pra mim: minha regra "nunca commito sem autorização explícita" continua valendo para código/entrega; para `docs/memoria/jose.md` a autorização é esta, permanente. Não pergunto de novo.
- Escopo: só o meu próprio arquivo de memória. Qualquer outro arquivo segue exigindo autorização específica.

### 2026-07-11 — Provider de LLM explícito na criação de agente (chatzera dev_claude)

- Contexto: repasse da Malu com fala literal do líder ("fiz esse code justamente pra não entrar como coisa de querer criar gente, e ainda deu erro assim. Pede pro José corrigir"). Problema: o provider (OpenAI vs Anthropic) era decidido pelo sufixo do ID (`agent_id.endswith("_claude")`) ou por env, com fallback global OpenAI — sem campo explícito. Fragilidade real: `malu_claude_code` (sufixo `_code`) caiu no OpenAI.
- Decisão técnica minha: adicionar campo explícito `provider` ("openai"|"anthropic") ao registro do agente, com prioridade sobre a heurística. Mantidos TODOS os fallbacks históricos (env `AGENT_LLM_PROVIDER_<SUFIXO>` → sufixo `_claude` → default global) para retrocompat de agentes já cadastrados sem o campo.
- Arquivos: `models/agent.py` (campo em AgentIn/AgentUpdateIn, pattern openai|anthropic, default None); `services/llm_service.py` (`agent_llm_settings` lê `agent_rec["provider"]` primeiro; ganhou param `db` opcional); `services/runner_service.py` e o caller em llm_service passam `db`; `database.py` + `agents_registry.py` (campo `provider` no registro, default None, setdefault na leitura); `static/console/modules/create-agent/*` (dropdown "Provedor de IA" GPT/Claude no POST).
- Ordem de prioridade final: (1) `provider` explícito do agente → (2) env por sufixo → (3) sufixo `_claude` → (4) default global. Escolha explícita vence sufixo enganoso (núcleo do fix).
- Testes: novo `tests/test_agent_provider.py`, 7 casos verdes (escolha explícita vence sufixo/env; fallbacks preservados; provider inválido rejeitado por validação). Suíte completa: 43 passam, 10 falham — as 10 são pré-existentes (401 write-guard de admin no ambiente local mínimo), mesmo baseline já registrado; nenhuma regressão nova. Testes de CRUD via HTTP eu movi pro nível de modelo (pydantic + shape do model_dump) para não depender da barreira de auth do ambiente.
- Commit na dev_claude do chatzera (autorização permanente do líder para essa branch): `0ea12c1`. main/desenvolvimento não tocadas. Regra 12 respeitada: worktree isolado sobre `origin/dev_claude`.
- Validação ao vivo (redeploy + UI) não feita por mim, conforme instrução — depende do líder/Bruno.
