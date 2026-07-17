# Resumo executivo — auditoria forense Cliente / Perfil

Base oficial fixada: `nova_desenvolvimento_de_n1` em `b91223b5fd4363c4969524399416dc37fb7623c8` (2026-07-15T10:45:36-03:00).

## Respostas objetivas

1. **Sobreviveram:** o núcleo original do domínio/aplicação/apresentação, as correções de preservação de campos da importação, o fallback correto do filtro do PR #6, a substituição aprovada pelo mockup v2 e o wiring/persistência de perfis.
2. **Perdidas:** não foi encontrada alteração que tenha chegado à base e depois desaparecido sem cadeia explicável. Contagem **PERDIDO = 0**.
3. **Parcialmente preservadas:** a proteção de testes. Os arquivos existem, mas `npm test` foi desabilitado e 17 de 35 scripts relacionados falham quando executados diretamente.
4. **Sobrescritas:** não foi comprovada sobrescrita silenciosa. Contagem **SOBRESCRITO = 0**.
5. **Substituídas legitimamente:** o template/tela anterior de Perfil pelo mockup perfil-ana-v2, com intenção explícita e merge do PR #21.
6. **Em branches, fora da base:** três variantes de UI/fluxo de importação; reprocessamento ligado à criação/importação; uma variante de cleanup do fluxo; e a frente segura isolada de julho com 11 arquivos de código/teste.
7. **Testes removidos/enfraquecidos:** nenhum arquivo relacionado foi apagado; a suíte oficial foi desabilitada em 9a8292f e a maioria é teste textual, não execução do código real.
8. **Decisão humana:** integrar ou rejeitar a frente segura de julho; decidir sobre reprocessamento; escolher/rejeitar variantes de UI; restaurar ou redefinir a execução oficial de testes.
9. **Não recuperar:** a extração antiga do template revertida e a refatoração do PR #18, fechado como não necessário após consolidação.

## Resultado quantitativo

- 123 arquivos atuais inventariados dentro do perímetro técnico ampliado.
- 15 caminhos históricos/fora da base registrados.
- 35 commits alcançados pelo pathspec central em todas as referências.
- 35 testes de perfil/cliente na base: 18 passam e 17 falham em execução direta.
- 0 testes relacionados apagados no histórico Git.
- 1 merge que alterou diretamente o mesmo arquivo de Perfil (PR #6); remerge limpo, sem resolução manual.

| Classificação | Achados |
| --- | ---: |
| EXISTE_EM_BRANCH_MAS_NAO_NA_BASE | 6 |
| IMPLEMENTACAO_ANTIGA_NAO_RECUPERAR | 1 |
| PARCIALMENTE_PRESERVADO | 2 |
| PRESERVADO | 6 |
| PRESERVADO_COM_ALTERACAO_COMPATIVEL | 2 |
| REVERTIDO | 2 |
| SUBSTITUIDO_LEGITIMAMENTE | 1 |

## Limites probatórios

- Branch de origem é informada pelo nome histórico disponível em refs/PRs; refs já apagadas são registradas pelo nome preservado no PR ou como linhagem.
- A inexistência de PR é registrada como ausência de evidência, não como prova de ilegitimidade.
- Os 16 testes da frente segura de julho foram lidos, mas não executados; o próprio documento da branch declara isso.
- Documentos foram usados apenas como evidência de intenção/estado de integração, nunca como regra de negócio autônoma.

Auditoria forense do módulo Cliente / Perfil concluída. Nenhum código foi alterado. Nenhuma regra de negócio foi criada. Nenhuma implementação antiga foi recomendada para recuperação sem evidência rastreável.
