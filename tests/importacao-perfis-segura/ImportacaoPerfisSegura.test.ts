import test from 'node:test';
import assert from 'node:assert/strict';
import { createTestSystem, escopo, registro } from './TestDoubles';
import { ImportacaoPerfisDomainError } from '../../src/domain/importacao/perfis/ImportacaoPerfisSegura';

async function prepararPadrao() {
  const system = createTestSystem();
  await system.preparar.execute({
    escopo: escopo(),
    registros: [registro('item-1')],
    substituirRascunhoExistente: false
  });
  return system;
}

async function confirmarPadrao(system: ReturnType<typeof createTestSystem>, key = 'confirm-1') {
  return system.confirmar.execute({
    escopo: escopo(),
    idempotencyKey: key,
    decisoes: {},
    itemIds: null,
    reprocessamento: false,
    reassumirProcessamentoInterrompido: false
  });
}

test('preview prepara registros validos', async () => {
  const system = await prepararPadrao();
  const draft = await system.rascunho.retomar(escopo());
  assert.equal(draft.itens.length, 1);
  assert.equal(draft.itens[0]?.estado, 'pronto');
});

test('duplicidade exige decisao explicita', async () => {
  const system = createTestSystem();
  system.gateway.existing.push({ id: 'perfil-1', telefone: '61999990001' });
  const draft = await system.preparar.execute({
    escopo: escopo(),
    registros: [registro('item-1', { telefone: '61999990001' })],
    substituirRascunhoExistente: false
  });
  assert.equal(draft.itens[0]?.estado, 'pendente');
});

test('confirmacao importa item pronto', async () => {
  const system = await prepararPadrao();
  const result = await confirmarPadrao(system);
  assert.equal(result.importados.length, 1);
  assert.equal(result.estado, 'concluida');
});

test('dupla submissao em processamento e bloqueada', async () => {
  const system = await prepararPadrao();
  const draft = await system.rascunho.retomar(escopo());
  draft.confirmacoes.push({
    idempotencyKey: 'confirm-1',
    estado: 'processando',
    iniciadaEm: new Date().toISOString(),
    atualizadaEm: new Date().toISOString()
  });
  await system.store.salvar(draft);
  await assert.rejects(() => confirmarPadrao(system), (error: unknown) =>
    error instanceof ImportacaoPerfisDomainError && error.code === 'DUPLA_SUBMISSAO_BLOQUEADA');
});

test('confirmacao e idempotente', async () => {
  const system = await prepararPadrao();
  const first = await confirmarPadrao(system);
  const second = await confirmarPadrao(system);
  assert.deepEqual(second, first);
  assert.equal(system.gateway.createdCount, 1);
});

test('sucesso parcial preserva rejeitados', async () => {
  const system = createTestSystem();
  await system.preparar.execute({
    escopo: escopo(),
    registros: [registro('item-1'), registro('item-2', { nome: '', telefone: undefined })],
    substituirRascunhoExistente: false
  });
  const result = await confirmarPadrao(system);
  assert.equal(result.importados.length, 1);
  assert.equal(result.rejeitados.length, 1);
  assert.equal(result.estado, 'parcial');
});

test('cancelamento e seguro e idempotente', async () => {
  const system = await prepararPadrao();
  const first = await system.cancelar.execute(escopo());
  const second = await system.cancelar.execute(escopo());
  assert.equal(first.estado, 'cancelada');
  assert.deepEqual(second, first);
});

test('rascunho persiste e pode ser retomado', async () => {
  const system = await prepararPadrao();
  const draft = await system.rascunho.retomar(escopo());
  assert.equal(draft.escopo.importacaoId, 'import-1');
});

test('reload recupera aggregate persistido', async () => {
  const system = await prepararPadrao();
  const restored = await system.rascunho.retomar(escopo());
  assert.equal(restored.itens[0]?.id, 'item-1');
});

test('homonimos nao sao associados apenas por nome', async () => {
  const system = createTestSystem();
  system.gateway.existing.push({ id: 'perfil-1', telefone: '61111111111' });
  const draft = await system.preparar.execute({
    escopo: escopo(),
    registros: [registro('item-1', { nome: 'Mesmo Nome', telefone: '62222222222' })],
    substituirRascunhoExistente: false
  });
  assert.equal(draft.itens[0]?.candidatos.length, 0);
});

test('isolamento por usuaria bloqueia acesso cruzado', async () => {
  const system = await prepararPadrao();
  await assert.rejects(() => system.rascunho.retomar(escopo({ usuarioId: 'user-2' })));
});

test('isolamento por lote bloqueia acesso cruzado', async () => {
  const system = await prepararPadrao();
  await assert.rejects(() => system.rascunho.retomar(escopo({ loteId: 'batch-2' })));
});

test('reprocessamento por perfil exige relacao com item', async () => {
  const system = await prepararPadrao();
  await assert.rejects(() => system.reprocessar.porPerfil({
    escopo: escopo(),
    perfilId: 'perfil-inexistente',
    idempotencyKey: 'retry-profile',
    decisoes: {},
    reassumirProcessamentoInterrompido: false
  }));
});

test('reprocessamento por item executa somente o item alvo', async () => {
  const system = createTestSystem();
  system.gateway.failOperationContains.add('item-1');
  await system.preparar.execute({
    escopo: escopo(),
    registros: [registro('item-1'), registro('item-2')],
    substituirRascunhoExistente: false
  });
  await confirmarPadrao(system);
  system.gateway.failOperationContains.clear();
  const result = await system.reprocessar.porItem({
    escopo: escopo(),
    itemId: 'item-1',
    idempotencyKey: 'retry-item-1',
    reassumirProcessamentoInterrompido: false
  });
  assert.equal(result.reprocessados.some(item => item.itemId === 'item-1'), true);
});

test('falha de persistencia e visivel', async () => {
  const system = createTestSystem();
  system.store.failOnSave = true;
  await assert.rejects(() => system.preparar.execute({
    escopo: escopo(),
    registros: [registro('item-1')],
    substituirRascunhoExistente: false
  }), /persistencia indisponivel/);
});

test('retry recupera falha retryable', async () => {
  const system = createTestSystem();
  system.gateway.failOperationContains.add('item-1');
  await system.preparar.execute({
    escopo: escopo(),
    registros: [registro('item-1')],
    substituirRascunhoExistente: false
  });
  const failed = await confirmarPadrao(system);
  assert.equal(failed.rejeitados[0]?.retryable, true);
  system.gateway.failOperationContains.clear();
  const retried = await system.reprocessar.porItem({
    escopo: escopo(),
    itemId: 'item-1',
    idempotencyKey: 'retry-1',
    reassumirProcessamentoInterrompido: false
  });
  assert.equal(retried.importados.length, 1);
});
