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
      'Asa Norte', 'Asa Sul', 'Setor Sudeste', 'Noroeste', 'Vila Planalto', 'Sudoeste', 'Cruzeiro',
      'Lago Norte', 'Lago Sul', 'Guará', 'Águas Claras', 'Taguatinga', 'Ceilândia', 'Brazlândia', 'Samambaia',
      'Vicente Pires', 'Riacho Fundo', 'Recanto das Emas', 'Gama', 'Santa Maria', 'Sobradinho',
      'Planaltina', 'Paranoá', 'Itapoã', 'São Sebastião', 'Jardim Botânico', 'Valparaíso',
      'Cidade Ocidental', 'Luziânia', 'Novo Gama', 'Águas Lindas', 'Formosa', 'Santo Antônio do Descoberto'
    ]
  },
  {
    id: 'goiania',
    nome: 'Goiânia',
    localidades: ['Setor Bueno', 'Jardim Goiás', 'Setor Marista', 'Setor Oeste', 'Setor Sul', 'Campinas', 'Urias Magalhães']
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
