# DevOps — Renderização da importação financeira

Branch base oficial: `desenvolvimento`

## Objetivo

Destravar a validação visual real da tela de importação do histórico financeiro.

Tela principal envolvida:

- `src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts`

## Ação exigida

Rodar o app em ambiente com acesso ao GitHub, Node >= 20 e Chrome/Chromium.

Comandos:

```bash
git checkout desenvolvimento
git pull
npm install
npm run build
npm run dev
```

## Evidências obrigatórias

Anexar na issue #19:

1. print real do Chrome com o app rodando;
2. print da aba Transações/Financeiro;
3. print da tela inicial/vazia do módulo;
4. print com estado de importação/conferência;
5. print com conciliação/pendências quando houver dados;
6. print responsivo/mobile.

## Fluxo após DevOps

1. José executa autoteste de dev.
2. Max libera para Rose.
3. Rose executa QA formal.
4. Senhora Cansada homologa.

## Regra de segurança

Print de mockup HTML isolado não vale.
A evidência precisa ser do app real renderizado no Chrome.
