# ORDEM INDIVIDUAL — QA INDEPENDENTE

## Base obrigatória

- Branch operacional: `nova_desenvolvimento_de_n1`
- Snapshot funcional: `b91223b5fd4363c4969524399416dc37fb7623c8`
- A branch atual pode conter documentação posterior, mas nenhuma deriva funcional pode ser promovida sem validação do Integrador.
- Não transportar branch, PR, commit, binder ou implementação histórica em bloco.
- Não misturar importação de planilha com lote de estoque.
- Não inverter o fluxo de negócio `Transações → Financeiro`.
- Não tocar em superfície congelada.
- Não fazer commit, push ou PR sem ordem expressa do Líder e liberação do Integrador.


## Missão

Revisar evidências sem corrigir o código, validar somente funcionalidades autorizadas e emitir parecer separado do Integrador.

## Agora

- Revisar se cada ordem respeita a V4.1.
- Conferir se diagnóstico não está sendo tratado como correção.
- Conferir se os desenvolvedores Perfil e Financeiro não mutaram código antes do gate.
- Preparar a matriz de validação para PERF-001, FIN-001, FIN-002 e FIN-003.
- Revisar relatórios diagnósticos quanto a evidência, separação entre fato e decisão e ausência de regra inventada.

## Depois dos patches integrados

### F4-QA-001
Executar o fluxo completo somente das funcionalidades autorizadas e entregues.

### F4-QA-002
Validar visual apenas quando existir mockup e viewport aprovados aplicáveis ao patch.

### F4-QA-003
Verificar regressão, comportamento proibido, arquivo fora do escopo e ownership de shared files.

### F4-QA-004
Emitir parecer independente sem decidir release.

## Evidências mínimas por patch

- ID e snapshot;
- paths e símbolos;
- locks;
- diff;
- teste próprio;
- quantidade real de testes executados;
- runtime, typecheck e build;
- check de HTML quando aplicável;
- ausência de arquivo fora do escopo;
- ausência de superfície congelada;
- ausência de tarefa condicionada;
- ausência de commit, push ou PR não autorizados.

## Regra de independência

- Não corrigir o patch durante QA.
- Não resolver divergência com o Integrador por conta própria.
- Encaminhar divergência ao Líder.
- Não decidir release.
