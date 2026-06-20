export type PapelEquipe =
  | 'Direção de Operação'
  | 'UX Operacional'
  | 'Arquitetura'
  | 'Modelagem de Dados'
  | 'Segurança'
  | 'Desenvolvimento'
  | 'Qualidade'
  | 'Entrega';

export type ClassificacaoTrabalho = 'pendencia' | 'backlog';

export interface DecisaoOperacional {
  papel: PapelEquipe;
  impacto: string;
  risco: string;
  recomendacao: string;
}

// Teste da Usuária: fluxo só está pronto quando uma pessoa exausta consegue usar sem se perder.
export interface ChecklistSenhoraCansada {
  fluxoMobileValidado: boolean;
  botoesClaros: boolean;
  semResumoRedundante: boolean;
  semAreaMorta: boolean;
  salvaImediatamenteQuandoCritico: boolean;
  recuperaInterrupcao: boolean;
  permiteCorrecaoHumana: boolean;
  reduzCargaMental: boolean;
}

export interface ResultadoProntidaoOperacional {
  pronto: boolean;
  bloqueios: string[];
}

export const NOME_INTERNO_APP = 'Kzera';

export const MODELO_ESTOQUE_OFICIAL = [
  'Item',
  'Variação',
  'Lote',
  'Fracionamentos/Pesagem/Conferência/Retirada Interna',
] as const;

export const TOKEN_UNIDADE_INTERNA_PRECISAO = 'UNIT_INTERNAL_PRECISION';
export const TOKEN_UNIDADE_EXIBICAO_ATALHO = 'UNIT_DISPLAY_PRIMARY';

export const PRIORIDADE_ATUAL_OPERACIONAL = [
  'Estoque',
  'Lotes',
  'Fracionamento',
  'Pesagem rápida',
  'Balanças',
  'Calibragem',
  'Conferência',
  'Retirada Interna',
  'Transacoes Base',
] as const;

export const TRANSACOES_BASE_AUTORIZADA_COM_ESTOQUE_REAL = true;
export const TRANSACOES_BLOQUEADAS_ATE_ESTOQUE_CONSISTENTE = false;

export const JANELAS_BACKUP_OBRIGATORIO = ['07:00', '15:00', '23:00'] as const;
export const ADIAMENTO_BACKUP_MINUTOS = 20;

export function classificarTrabalho(jaFoiDecidido: boolean): ClassificacaoTrabalho {
  return jaFoiDecidido ? 'pendencia' : 'backlog';
}

export function avaliarSenhoraCansada(checklist: ChecklistSenhoraCansada): ResultadoProntidaoOperacional {
  const bloqueios: string[] = [];

  if (!checklist.fluxoMobileValidado) bloqueios.push('Fluxo mobile/iPhone não validado.');
  if (!checklist.botoesClaros) bloqueios.push('Botões ou ações ainda ambíguos.');
  if (!checklist.semResumoRedundante) bloqueios.push('Existe resumo redundante ou informação repetida.');
  if (!checklist.semAreaMorta) bloqueios.push('Existe área morta ou espaço visual sem função operacional.');
  if (!checklist.salvaImediatamenteQuandoCritico) bloqueios.push('Ação crítica não salva imediatamente.');
  if (!checklist.recuperaInterrupcao) bloqueios.push('Fluxo não recupera interrupção do app/navegador/bateria.');
  if (!checklist.permiteCorrecaoHumana) bloqueios.push('Erro humano não pode ser corrigido sem refazer tudo.');
  if (!checklist.reduzCargaMental) bloqueios.push('Carga mental alta para usuária cansada.');

  return {
    pronto: bloqueios.length === 0,
    bloqueios,
  };
}

export function podeIniciarTransacoes(estoqueRealRastreavel: boolean): ResultadoProntidaoOperacional {
  if (estoqueRealRastreavel) return { pronto: true, bloqueios: [] };

  return {
    pronto: false,
    bloqueios: [
      'Transacoes Base só pode iniciar respeitando estoque real e origem rastreável. Não vender por saldo genérico do item.',
    ],
  };
}

export interface RegraTransacaoBase {
  perfilObrigatorio: boolean;
  clienteNomeObrigatorio: boolean;
  importacaoCsvObrigatoria: boolean;
  atalhoAntesDaEntidadePrincipalPermitido: boolean;
}

export const REGRA_TRANSACAO_BASE: RegraTransacaoBase = {
  perfilObrigatorio: false,
  clienteNomeObrigatorio: true,
  importacaoCsvObrigatoria: true,
  atalhoAntesDaEntidadePrincipalPermitido: false,
};


export const FINANCEIRO_BASE_OBRIGATORIO_ANTES_IMPORTACAO_TRANSACOES = true;

export const ENTIDADES_FINANCEIRAS_BASE = [
  'ContaFinanceira',
  'TransacaoFinanceira',
  'PagamentoTransacao',
  'MovimentoFinanceiro',
] as const;

export const BACKLOG_FINANCEIRO_CRIPTO_RASTRO_DINHEIRO = {
  prioridade: 'media_alta',
  implementarAgora: false,
  regra: 'Preparar arquitetura para rastrear pagamentos agrupados em carteiras, transferências divididas, conversões, saques e comparação entre valor original e valor final realizado.',
} as const;

export const ACOES_IMPORTACAO_TRANSACAO_ITEM_INEXISTENTE = [
  'mapear_para_item_existente',
  'criar_item_com_confirmacao',
  'ignorar_linha',
] as const;

export const DOCUMENTOS_GOVERNANCA_OBRIGATORIOS = [
  'docs/governanca/00_LEIA_TODO_DIA.md',
  'docs/governanca/01_LEIA_ANTES_DE_ALTERAR_CODIGO.md',
  'docs/governanca/02_PROMPT_PERSONALIDADE_OFICIAL.md',
  'docs/governanca/03_PROMPT_NEGOCIO_OFICIAL.md',
  'docs/governanca/04_ESTADO_ATUAL_OFICIAL.md',
  'docs/governanca/05_LICOES_APRENDIDAS.md',
  'docs/governanca/06_CHECKLIST_ENTREGA_OBRIGATORIO.md',
  'docs/governanca/07_LICOES_RESUMO_RAPIDO.md',
] as const;

export const LEITURA_DIARIA_OBRIGATORIA = DOCUMENTOS_GOVERNANCA_OBRIGATORIOS[0];
export const LEITURA_ANTES_DE_ALTERAR_CODIGO = DOCUMENTOS_GOVERNANCA_OBRIGATORIOS[1];
export const LICOES_APRENDIDAS_OBRIGATORIAS = DOCUMENTOS_GOVERNANCA_OBRIGATORIOS[5];

export const LICOES_RESUMO_RAPIDO_OBRIGATORIAS = DOCUMENTOS_GOVERNANCA_OBRIGATORIOS[7];

export function deveEntrarNoDashboard(usoHoje: number, usoAmanha: number, usoDepoisDeAmanha: number, precisaNosProximos7Dias: boolean): boolean {
  const usoProximo = usoHoje + usoAmanha + usoDepoisDeAmanha;
  return usoProximo > 0 || precisaNosProximos7Dias;
}

export function localCorretoParaCadastroRaro(frequenciaMensalOuRara: boolean): 'configuracoes' | 'dashboard' {
  return frequenciaMensalOuRara ? 'configuracoes' : 'dashboard';
}


export const DOCUMENTOS_FINANCEIRO_OBRIGATORIOS = [
  'docs/FINANCEIRO_BASE_1.14.0.md',
  'docs/backlog/FINANCEIRO_CRIPTO_RASTRO_DINHEIRO.md',
] as const;


export const POLITICA_DOCUMENTACAO_DADOS = {
  criptografarTodaDocumentacao: false,
  documentacaoGovernancaLegivel: true,
  dadosReaisProtegidos: true,
  backupsCriptografados: true,
  csvRealNaoVersionarComoDocumento: true,
  segredosNuncaNoRepositorio: true,
} as const;

export const DOCUMENTOS_SEGURANCA_DADOS_OBRIGATORIOS = [
  'docs/SEGURANCA_DOCUMENTACAO_E_DADOS_1.14.1.md',
  'docs/importacao/STAGING_PROTEGIDO_1.15.1.md',
  'docs/seguranca/TRAVAS_DADOS_SENSIVEIS_1.15.2.md',
] as const;

export const POLITICA_STAGING_IMPORTACAO_PROTEGIDO = {
  dadoSensivelNuncaPersistirAberto: true,
  protegerAntesDoPrimeiroWrite: true,
  payloadSensivelCriptografado: true,
  indiceOperacionalSemDadoSensivel: true,
  dadosBrutosNoPayloadProtegido: true,
  pendenciasComValoresNoPayloadProtegido: true,
} as const;


export const PERSONAS_SEGURANCA_ADVERSARIA = [
  'criminoso curioso',
  'hacker',
  'invasor',
] as const;


export const POLITICA_DADOS_SENSIVEIS_PERSISTENCIA = {
  regraAbsoluta: 'Dado sensível nunca deve ser gravado em armazenamento físico/persistente sem proteção, nem provisoriamente por milissegundos.',
  abertoSomenteEmMemoriaDuranteParsing: true,
  protegerAntesDoPrimeiroWrite: true,
  stagingTambemEhBanco: true,
  cacheTambemPodeVazar: true,
  backupTambemPrecisaProteger: true,
  mensagensDeErroTambemPodemVazar: true,
  indicesPermitidosEmClaro: [
    'id',
    'loteImportacaoId',
    'linha',
    'numeroOriginal',
    'numeroTransacaoReferenciado',
    'status',
    'tiposPendencia',
    'perfilIdResolvido',
    'createdAt',
    'updatedAt',
  ],
  exemplosDadosProtegidos: [
    'nome de comprador/perfil',
    'descrição de transacao',
    'observação',
    'dados brutos de CSV/TSV',
    'valores financeiros',
    'custo',
    'lucro',
    'pagamento',
    'pendente',
    'contas e carteiras',
  ],
} as const;


export const DOCUMENTO_VOCABULARIO_OPERACIONAL_PROTEGIDO = 'docs/seguranca/VOCABULARIO_OPERACIONAL_PROTEGIDO_1.15.5.md';

export const POLITICA_VOCABULARIO_OPERACIONAL_PROTEGIDO = {
  rotuloSensivelNaoNasceHardcoded: true,
  configurarAposSenhaMestra: true,
  persistirSomentePayloadProtegido: true,
  tokenNeutroNoBanco: true,
  rotuloRealSomenteEmMemoriaAutenticada: true,
  limparNoBloqueioLogout: true,
} as const;
