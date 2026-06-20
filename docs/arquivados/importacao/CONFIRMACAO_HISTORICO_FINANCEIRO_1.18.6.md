# Confirmação Histórico Financeiro 1.18.6

## Veredito de origem

A versão 1.18.4 não passa. A versão 1.18.5 corrigiu bloqueios técnicos da confirmação histórica, mas não passou no teste Usuária.

O problema bloqueador era humano-operacional: confirmação interrompida aparecia como falha técnica escondida em painel recolhido, com botão assustador. Isso obrigava a usuária cansada a entender status interno e procurar o lugar certo.

## Regra obrigatória da 1.18.6

Se existir pacote `confirmando` ou `falha_confirmacao`, a tela de importação deve priorizar uma retomada humana antes de nova importação, conciliação ou nova prévia.

A mensagem obrigatória é:

- Encontramos uma confirmação interrompida.
- Nada foi perdido.
- Seu histórico ainda está seguro.
- Você pode continuar de onde parou ou revisar antes de confirmar.

A ação principal deve ser:

- Continuar confirmação

A ação segura alternativa deve ser:

- Revisar antes

## Proibições de UX

- Não esconder interrupção principal em `<details>`.
- Não usar o botão visível “Recuperar falha”.
- Não exigir que a usuária entenda `staging`, `pacote`, `falha_confirmacao` ou `confirmando` para sair do problema.
- Não começar a tela por formulário de importação quando existe retomada pendente.

## Comportamento técnico mantido

- Pacote congelado continua sendo a fonte da verdade.
- Staging atual continua sendo reconsultado antes da confirmação.
- Artefatos oficiais continuam registrados antes do write oficial.
- Lista grande continua limitada para evitar travar iPhone.
- Limpeza de memória/DOM ao bloqueio continua obrigatória.
- Histórico importado alimenta transações/financeiro e não baixa estoque/lote.

## Critério Usuária

A usuária deve bater o olho e sentir: “o sistema sabe que deu ruim, não perdeu meu trabalho e está me dando uma saída segura”.

Se a pessoa precisar abrir painel escondido, interpretar erro técnico ou adivinhar ação, não passa.

## Compatibilidade dos contratos 1.18.0–1.18.5

- O histórico confirmado alimenta total/faturamento, custo, lucro, valor pago e pendente.
- A prévia obrigatória continua sendo a porta antes da confirmação.
- Confirmação segue em lote e sem clique registro por registro.
- Pacote de confirmação mantém o resumo financeiro dentro do payload protegido.
- Assinatura do pacote considera snapshot completo e ordenado.
- Desfazer lote confirmado continua disponível.
- Frase de contrato: sem baixar estoque/lote.
- Frase de contrato: não baixa estoque.
- Histórico importado confirmado não altera lote.
- Desfazer/recuperar continuam exigindo repositórios oficiais com remoção segura.

Frase de contrato: desfazer lote confirmado.
