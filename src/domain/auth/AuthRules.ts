export interface PasswordPolicy {
  minLength: number;
  productionMinLengthTodo: number;
}

// Regra temporária para testes manuais: permitir senha curta nesta fase.
// A exigência final de produção continua registrada em productionMinLengthTodo.
export const DEVELOPMENT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 1,
  productionMinLengthTodo: 14
};

export function validateMasterPassword(password: string, policy = DEVELOPMENT_PASSWORD_POLICY): string[] {
  const errors: string[] = [];

  if (!password || password.length < policy.minLength) {
    errors.push(policy.minLength <= 1
      ? 'Informe uma senha para continuar.'
      : `A credencial deve ter pelo menos ${policy.minLength} caracteres nesta fase de desenvolvimento.`);
  }

  return errors;
}

export function confirmPassword(password: string, confirmation: string): string[] {
  return password === confirmation ? [] : ['A confirmação da credencial não confere.'];
}
