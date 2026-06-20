# Arquitetura Kzera Foundation 1.0.0

## Princípio

O Kzera deve ser modular de verdade, não apenas organizado em pastas.

## Camadas

### core/

Tipos e utilitários de baixo nível. Não conhece domínio, UI ou infraestrutura concreta.

### domain/

Entidades, value objects e regras puras de negócio.

Não acessa IndexedDB.  
Não acessa DOM.  
Não acessa WebCrypto diretamente.  
Não conhece UI.

### application/

Casos de uso e portas/interfaces.

Orquestra domínio, repositórios e serviços.

### infrastructure/

Implementações concretas: IndexedDB, armazenamento local, exportação de backup, etc.

### runtime/

Serviços e políticas de segurança: sessão criptográfica, derivação de chave, criptografia de campos, backup, memory wiping e identidade operacional.

### presentation/

Controllers, views e adaptadores de UI.

## Regra central

`bootstrap` futuro deve apenas montar contexto e registrar controllers.

Ele não deve conter:
- handler de botão;
- regra de item;
- regra de transacao;
- regra de perfil;
- validação complexa;
- acesso direto ao banco;
- lógica de segurança.

## Migração futura para backend

Toda persistência deve depender de interfaces.

Hoje:
```text
Repository<T> -> IndexedDBRepository<T>
```

Futuro:
```text
Repository<T> -> ApiRepository<T>
```

O domínio não deve mudar quando o backend existir.
