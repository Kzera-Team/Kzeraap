# Aprovação em massa da conciliação segura — 1.17.1

Regra: a usuária não deve aprovar centenas de vínculos um por um quando o sistema já classificou a sugestão como segura.

## Entra

- Botão **Aprovar todas as seguras**.
- Registros incompletos ficam fora da massa automaticamente.
- Cada linha pode expandir **Ver vínculos** antes da aprovação.
- A aprovação em massa grava o vínculo no staging.
- Nada cria transação definitiva.
- Nada baixa estoque.
- Dados sensíveis continuam no payload protegido.

## Critério de segurança

Só entra na massa quando:

- existe uma transação staging;
- existe exatamente uma movimentação candidata;
- valor pendente bate com valor pago;
- Perfil/comprador bate;
- movimentação está paga;
- não há pendência bloqueante no registro.

## Fora da massa

- registro incompleto;
- divergência de valor;
- diferença de perfil;
- diferença de pagamento;
- mais de uma movimentação candidata;
- sem movimentação candidata.
