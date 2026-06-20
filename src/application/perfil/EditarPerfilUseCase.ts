import type { Perfil } from '../../domain/perfil/Perfil';

export class EditarPerfilUseCase {
  execute(perfil: Perfil, alteracoes: Partial<Omit<Perfil, 'id' | 'codigo' | 'createdAt'>>): Perfil {
    const atualizado: Perfil = {
      ...perfil,
      updatedAt: alteracoes.updatedAt || perfil.updatedAt
    };

    if (alteracoes.nome !== undefined) atualizado.nome = alteracoes.nome;
    if (alteracoes.bairro !== undefined) atualizado.bairro = alteracoes.bairro;
    if (alteracoes.municipio !== undefined) atualizado.municipio = alteracoes.municipio;
    if (alteracoes.conhecePessoalmente !== undefined) atualizado.conhecePessoalmente = alteracoes.conhecePessoalmente;
    if (alteracoes.telefone !== undefined) atualizado.telefone = alteracoes.telefone;
    if (alteracoes.email !== undefined) atualizado.email = alteracoes.email;
    if (alteracoes.endereco !== undefined) atualizado.endereco = alteracoes.endereco;
    if (alteracoes.observacoes !== undefined) atualizado.observacoes = alteracoes.observacoes;
    if (alteracoes.status !== undefined) atualizado.status = alteracoes.status;

    return atualizado;
  }
}
