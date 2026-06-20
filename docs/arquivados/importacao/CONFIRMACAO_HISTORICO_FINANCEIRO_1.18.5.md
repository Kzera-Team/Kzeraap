# Confirmação Histórico Financeiro 1.18.5

Correção obrigatória após reprovação da 1.18.4.

## Veredito incorporado

A versão 1.18.4 não passa. A 1.18.5 existe para fechar a confirmação histórica contra interrupção, pacote antigo, staging alterado, artefato órfão e memória viva após bloqueio.

## Regras obrigatórias da 1.18.5

- A confirmação definitiva não recalcula o plano para decidir resultado final; ela usa o pacote congelado persistente.
- Antes de confirmar um pacote antigo, o sistema reconsulta staging atual de transações e financeiro.
- Se qualquer linha, vínculo financeiro, status, movimento vinculado ou snapshot mudar depois da prévia, a confirmação é bloqueada.
- Deduplicação oficial considera `assinaturaImportacao` e também assinatura reconstruída de transações antigas que ainda não tinham assinatura salva.
- Pacote em status `confirmando` aparece como falha/interrupção recuperável na tela principal de confirmação.
- Recuperação aceita pacote `falha_confirmacao` e pacote `confirmando`, removendo artefatos registrados e devolvendo staging para `validado`.
- Antes de gravar cada artefato oficial, o ID planejado é registrado no pacote persistente. Assim, se o app cair depois do write oficial, a recuperação sabe o que remover.
- Desfazer/recuperar continuam exigindo repositórios oficiais com remoção segura.
- A view de importação registra `release()` e limpa prévia, confirmação, conciliação, lotes e DOM ao bloquear/ocultar o app.
- Listagem de staging renderiza no máximo 80 registros de cada tipo para evitar travar iPhone, mantendo resumo calculado sobre o total real.

## Contratos de estoque e financeiro

- Histórico importado confirmado alimenta faturamento, custo, lucro, valor pago e valor pendente.
- Histórico importado confirmado não baixa estoque.
- Histórico importado confirmado não altera lote.
- Importação histórica continua exigindo prévia obrigatória e pacote congelado.

## Limite honesto de entrega

A lógica TypeScript passa em checagem de tipos e testes estruturais adicionados, mas o build Vite oficial ainda depende da instalação de `xlsx/codepage`. Se a instalação falhar no ambiente, a entrega não pode ser chamada de build oficial validado.


## Compatibilidade dos contratos 1.18.0–1.18.4

- O histórico confirmado alimenta total/faturamento, custo, lucro, valor pago e pendente.
- A prévia obrigatória continua sendo a porta antes da confirmação.
- Confirmação segue em lote e sem clique registro por registro.
- Pacote de confirmação mantém o resumo financeiro dentro do payload protegido.
- Assinatura do pacote considera snapshot completo e ordenado.
- Desfazer lote confirmado continua disponível.
- Frase de contrato: sem baixar estoque/lote.
- Frase de contrato: não baixa estoque.

Frase de contrato: desfazer lote confirmado.
