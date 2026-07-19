# Patches propostos e separados

## PATCH 1 — PERFORMANCE / PERF-001

**Status:** nenhum diff de código proposto. A possível leitura e descriptografia integrais não é causa comprovada. Pré-requisito: reprodução com volume representativo e perfil antes/depois.

## PATCH 2 — AUTENTICAÇÃO / AUTH-001

**Status:** bloqueado. Pré-requisito: aprovação de backend/identidade e segredo em ambiente de servidor. A implementação local atual não permite segredo compartilhado sem expor o valor e não possui autorização por identidade a preservar.

Os diretórios `patches/PERF-001` e `patches/AUTH-001` contêm manifestos vazios explícitos para impedir que se confunda ausência de patch com falha de entrega.
