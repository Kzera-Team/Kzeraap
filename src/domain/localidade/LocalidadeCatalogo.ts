export interface LocalidadeGrupo {
  id: string;
  nome: string;
  localidades: string[];
}

export const LOCALIDADE_GRUPOS: LocalidadeGrupo[] = [
  {
    id: 'brasilia-entorno',
    nome: 'Brasília e Entorno',
    localidades: [
      'Águas Claras', 'Águas Lindas', 'Asa Norte', 'Asa Sul', 'Brazlândia', 'Ceilândia', 'Cidade Ocidental',
      'Cruzeiro', 'Formosa', 'Gama', 'Guará', 'Itapoã', 'Jardim Botânico', 'Lago Norte', 'Lago Sul',
      'Luziânia', 'Noroeste', 'Novo Gama', 'Paranoá', 'Planaltina', 'Recanto das Emas', 'Riacho Fundo',
      'Samambaia', 'Santa Maria', 'Santo Antônio do Descoberto', 'São Sebastião', 'Setor Sudeste',
      'Sobradinho', 'Sudoeste', 'Taguatinga', 'Valparaíso', 'Vicente Pires', 'Vila Planalto'
    ]
  },
  {
    id: 'goiania',
    nome: 'Goiânia',
    localidades: ['Campinas', 'Jardim Goiás', 'Setor Bueno', 'Setor Marista', 'Setor Oeste', 'Setor Sul', 'Urias Magalhães']
  }
];

export function listarGruposLocalidade(): LocalidadeGrupo[] {
  return LOCALIDADE_GRUPOS.map(grupo => ({ ...grupo, localidades: [...grupo.localidades] }));
}

export function buscarLocalidadesPorGrupo(grupoId: string): string[] {
  return LOCALIDADE_GRUPOS.find(grupo => grupo.id === grupoId)?.localidades ?? [];
}

export function grupoPadraoLocalidade(): LocalidadeGrupo {
  return LOCALIDADE_GRUPOS[0]!;
}
