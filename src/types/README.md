# Organização de Tipos e Schemas

Este diretório contém todos os tipos TypeScript e schemas de validação Yup organizados por funcionalidade.

## Estrutura

```
src/
├── types/
│   ├── forms/           # Tipos de formulários
│   │   ├── index.ts     # Exporta todos os tipos
│   │   ├── profile.ts   # Tipos de perfil
│   │   ├── auth.ts      # Tipos de autenticação
│   │   ├── community.ts # Tipos da comunidade
│   │   ├── checkout.ts  # Tipos de checkout
│   │   ├── chat.ts      # Tipos de chat
│   │   └── recipe.ts    # Tipos de receitas
│   └── README.md        # Esta documentação
└── schemas/
    └── forms/           # Schemas de validação Yup
        ├── index.ts     # Exporta todos os schemas
        ├── profile.ts   # Schemas de perfil
        ├── auth.ts      # Schemas de autenticação
        ├── community.ts # Schemas da comunidade
        └── checkout.ts  # Schemas de checkout
```

## Como Usar

### Importar Tipos
```typescript
import { ProfileFormData, LoginFormData } from "@/types/forms"
```

### Importar Schemas
```typescript
import { profileSchema, loginSchema } from "@/schemas/forms"
```

### Importar Tudo
```typescript
import { ProfileFormData } from "@/types/forms"
import { profileSchema } from "@/schemas/forms"
```

## Convenções

1. **Nomes de Interfaces**: PascalCase com sufixo descritivo (ex: `ProfileFormData`)
2. **Nomes de Schemas**: camelCase com sufixo "Schema" (ex: `profileSchema`)
3. **Arquivos**: kebab-case (ex: `profile.ts`)
4. **Exportações**: Sempre usar `export` explícito
5. **Index**: Cada pasta deve ter um `index.ts` que exporta tudo

## Benefícios

- ✅ **Organização**: Tipos e schemas organizados por funcionalidade
- ✅ **Reutilização**: Evita duplicação de código
- ✅ **Manutenção**: Fácil de encontrar e atualizar
- ✅ **Consistência**: Padrões uniformes em todo o projeto
- ✅ **Type Safety**: Melhor inferência de tipos do TypeScript





