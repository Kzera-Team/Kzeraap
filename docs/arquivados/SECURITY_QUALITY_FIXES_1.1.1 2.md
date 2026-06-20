# Ajustes de Qualidade de Segurança

- Clock injetável em SessionContext.
- Sem Date.now direto em SessionContext.
- DomainError especializado em sessão criptográfica.
- AccessCoordinator implementa Releasable.
- ResourceScope registra SessionContext e AccessCoordinator.
- requiresPassword/currentMaterial evitam chamadas repetidas desnecessárias.
