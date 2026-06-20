import type { Perfil } from '../../domain/perfil/Perfil';

export interface ResultadoMesclagem extends Perfil {
  perfilArquivadoId: string;
}

function setOptional<K extends keyof Perfil>(target: Perfil, key: K, value: Perfil[K] | undefined): void {
  if (value !== undefined) {
    Object.assign(target, { [key]: value });
  }
}

export class MesclarPerfisFluxoUseCase {
  execute(principal: Perfil, secundario: Perfil): ResultadoMesclagem {
    const resultado = {
      ...principal,
      conhecePessoalmente: principal.conhecePessoalmente || secundario.conhecePessoalmente,
      perfilArquivadoId: secundario.id
    } as ResultadoMesclagem;

    setOptional(resultado, 'telefone', principal.telefone || secundario.telefone);
    setOptional(resultado, 'email', principal.email || secundario.email);
    setOptional(resultado, 'bairro', principal.bairro || secundario.bairro);
    setOptional(resultado, 'municipio', principal.municipio || secundario.municipio);

    return resultado;
  }
}
