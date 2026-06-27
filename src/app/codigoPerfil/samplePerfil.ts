import type { Perfil } from '../../domain/perfil/Perfil';

export const samplePerfil: Perfil = {
  id: 'perfil-exemplo-001',
  nome: 'João Marcos Silva',
  telefone: '(11) 99999-0000',
  email: 'joao@example.com',
  bairro: 'Centro',
  municipio: 'São Paulo',
  conhecePessoalmente: true,
  codigo: '',
  status: 'ativo',
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString()
};
