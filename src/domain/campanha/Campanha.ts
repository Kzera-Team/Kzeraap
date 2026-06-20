import type { Entity } from '../../core/Entity';

export interface CampanhaItem {
  itemId: string;
  quantidade: number;
}

export interface Campanha extends Entity {
  nome: string;
  preco: number;
  ativa: boolean;
  inicio?: string;
  fim?: string;
  items: CampanhaItem[];
}
