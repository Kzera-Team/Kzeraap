# Índice de casos — arquivos_relevantes

Lista viva. Só cresce por adição — remover ou reclassificar uma linha exige autorização explícita do líder (mesma regra da pasta inteira: adicionar é livre, excluir não).

| Data | Caso | Pasta | Status | Resumo curto |
|------|------|-------|--------|--------------|
| 2026-07-04 | Queda de instância do Max durante registro de achado | `2026-07-04_max/` | corroborado | 2ª ocorrência do mesmo padrão da Claudette (queda entre "reportar achado" e "formalizar/commitar"). Evidência: 9 imagens verificadas por hash + conteúdo, `docs/governanca/INCIDENTES_OPERACIONAIS.md`. |
| 2026-07-04 | Bypass de proteção de branch no GitHub (`n1`) | `2026-07-04_bypass-protecao-n1/` | BLOQUEADA | `n1` tem regra exigindo PR, mas a integração desta sessão empurra código direto (bypass) e não tem permissão de ler/gerenciar a regra (403 "Resource not accessible by integration"). Depende de acesso admin do líder no GitHub. Líder confirmou ciência, vai tratar depois. |
| 2026-07-04 | Tentativa de transcrição completa da sessão (orquestrador) | `2026-07-04_transcricao-completa/` | incompleto, com nota de integridade | Inserido por outra instância (não Bruno), seguindo o mesmo padrão de pasta. O próprio orquestrador admite não conseguir reconstruir centenas de turnos com fidelidade garantida e se recusa a fingir que reproduziu tudo; oferece alternativas (trecho pontual sob pedido, ou exportação do log bruto da plataforma). Indexado aqui só para não ficar órfão — Bruno não verificou o conteúdo turno a turno (fora do seu escopo técnico verificar fala de chat). |
| 2026-07-04 | Relatórios dos agentes na íntegra (auditoria) | `09_RELATORIOS_AGENTES_NA_INTEGRA.md` | arquivo de referência | Movido de `docs/governanca/` a pedido direto do líder ("leve esse arquivo 09 para dentro da sua pasta"). Compilação dos relatórios técnicos da auditoria completa (5 agentes) feita durante a sessão de 2026-07-03. Não é um "caso" novo, é documento de referência — mantido com nome original, fora do padrão de pasta por caso. |

## Convenção para novo caso

1. Criar pasta `AAAA-MM-DD_<caso-curto>/`.
2. Copiar `_MODELO_CASO/registro.md` e `_MODELO_CASO/hashes.sha256` para dentro, preencher de verdade.
3. Adicionar uma linha nesta tabela.
