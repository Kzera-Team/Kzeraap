# Recuperação — importação de perfis e reprocessamento seguro

## Escopo implementado

- contrato explícito de duplicidade baseado somente em telefone, e-mail ou identificador da origem;
- bloqueio de associação automática por nome e tratamento seguro de homônimos;
- escopo obrigatório por usuária, importação, lote e origem;
- confirmação idempotente por chave e chave operacional por item;
- bloqueio de dupla submissão e reassunção somente por comando explícito;
- resultado estruturado com importados, rejeitados, pendentes e reprocessados;
- rascunho persistente, retomada e descarte seguro;
- cancelamento idempotente sem desfazer itens já persistidos;
- sucesso parcial explícito;
- reprocessamento por item e por perfil relacionado ao lote;
- falhas de persistência visíveis e classificadas como retryable;
- gateway de perfis sem pesquisa por nome;
- store IndexedDB com payload protegido pela sessão;
- composição isolada sem alteração do wiring global protegido.

## Contratos seguros adotados

- múltiplos candidatos nunca são resolvidos automaticamente;
- candidato único também exige decisão explícita;
- criar um novo perfil diante de candidato exige confirmação explícita;
- perfil selecionado precisa pertencer aos candidatos do item e ao escopo da usuária;
- reprocessamento exige escopo completo e alvo explícito;
- processamento interrompido não é reassumido silenciosamente;
- cancelamento não promete rollback de perfis já criados: o resultado parcial permanece visível.

## Decisões de Produto pendentes

- política de expiração e retenção de rascunhos;
- limite de tentativas e backoff de retry;
- experiência de resolução de candidato único e múltiplos candidatos;
- política para desfazer importações parcialmente persistidas;
- fornecimento e persistência do identificador estável da origem quando a planilha o possuir.

Os caminhos dependentes dessas decisões permanecem bloqueados por contratos explícitos, sem comportamento automático inventado.

## Integração global necessária

O integrador deve instanciar `createImportacaoPerfisSeguraComposition` usando a sessão, a usuária autenticada, o repositório de perfis, o relógio e a fábrica de IDs. Nenhum dos arquivos de composição global protegidos foi alterado.

A apresentação existente ainda utiliza o fluxo legado. A substituição deve ser feita pelo integrador após definir a UI de resolução de duplicidade, retry e exibição do resultado estruturado.

## Testes

Foram criados 16 testes automatizados em `tests/importacao-perfis-segura/ImportacaoPerfisSegura.test.ts`, cobrindo preview, duplicidade, confirmação, dupla submissão, idempotência, sucesso parcial, cancelamento, rascunho, reload, homônimos, isolamento por usuária, isolamento por lote, reprocessamento por perfil, reprocessamento por item, falha de persistência e retry.

Os testes não foram executados neste ambiente. O `package.json` da base mantém o script oficial de testes desabilitado e esse arquivo está protegido pelo escopo da tarefa.
