# Regras de Negócio Consolidadas

## Perfil

- Perfil exige no mínimo nome.
- Perfil nunca é excluído.
- Perfil pode ser arquivado.
- Perfil arquivado não aparece em buscas padrão.
- Perfil pode existir sem bairro.
- Perfil pode existir sem codigo.
- Codigo é imutável.
- Codigo deve ser único.
- Campo "conhece pessoalmente" é checkbox: sim/não.
- Perfil sem codigo deve aparecer como pendência operacional.
- Se bairro for preenchido e os requisitos da regra forem atendidos, mostrar botão "Definir" ao lado do codigo.

## Transacao

- Transacao pode ser vinculada a perfil cadastrado.
- Transacao também pode aceitar nome em texto livre sem perfil cadastrado.
- Se nome avulso virar recorrente, poderá haver botão para criar perfil depois.
- Desconto pode ser por valor e percentual.
- Descontos podem acumular.
- Total de transacao não pode ser negativo.
- Pagamento maior que total pode gerar crédito. Detalhes ficam em backlog futuro.

## Item/Lote/Campanha

- Item vendido não deve ser excluído; deve ser arquivado.
- Lote define custo.
- Transacao deve congelar fotografia de preço, custo e lucro.
- Campanha representa oferta vendável; pode ter um ou vários itens.
- Campanha sem validade funciona como kit permanente.
- Campanha com validade funciona como campanha.

## Backup

- Obrigatório 3x por dia.
- Pode adiar uma vez por 20 minutos.
- Após adiamento, bloqueia uso até gerar backup.
