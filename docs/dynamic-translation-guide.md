# Guia de Tradução Dinâmica - iChef24

Este guia explica como usar o sistema de tradução dinâmica para dados que vêm do backend, como níveis de dificuldade, tipos de cozinha, tags, status e unidades de medida.

## Visão Geral

O sistema de tradução dinâmica permite traduzir automaticamente dados do backend (como enums, códigos, etc.) para o idioma atual da interface, mantendo a consistência em toda a aplicação.

## Funcionalidades Disponíveis

### 1. Tradução de Níveis de Dificuldade
```typescript
import { translateDynamicData } from "@/lib/config/i18n"

// Traduzir por número
translateDynamicData.difficulty(3, 'pt') // "Intermediário"
translateDynamicData.difficulty(3, 'en') // "Intermediate"

// Traduzir por string
translateDynamicData.difficulty('medium', 'pt') // "Intermediário"
translateDynamicData.difficulty('hard', 'en') // "Hard"
```

### 2. Tradução de Tipos de Cozinha
```typescript
translateDynamicData.cuisine('italian', 'pt') // "Italiana"
translateDynamicData.cuisine('japanese', 'en') // "Japanese"
```

### 3. Tradução de Tags de Receita
```typescript
translateDynamicData.recipeTag('vegetarian', 'pt') // "Vegetariano"
translateDynamicData.recipeTag('spicy', 'en') // "Spicy"
```

### 4. Tradução de Status
```typescript
translateDynamicData.recipeStatus('published', 'pt') // "Publicado"
translateDynamicData.recipeStatus('draft', 'en') // "Draft"
```

### 5. Tradução de Unidades de Medida
```typescript
translateDynamicData.unit('tbsp', 'pt') // "colher de sopa"
translateDynamicData.unit('cup', 'en') // "cup"
```

## Hook Personalizado

Para facilitar o uso, criamos o hook `useDynamicTranslation` que fornece acesso ao idioma atual e funções de tradução:

```typescript
import { useDynamicTranslation } from "@/lib/config/i18n"

export function MyComponent() {
  const { t, currentLang, translate } = useDynamicTranslation()

  return (
    <div>
      <p>Idioma atual: {currentLang}</p>
      <p>Dificuldade: {translate.difficulty(3)}</p>
      <p>Tipo de cozinha: {translate.cuisine('italian')}</p>
      <p>Tag: {translate.recipeTag('vegetarian')}</p>
    </div>
  )
}
```

## Exemplo Prático

### Antes (Sem Tradução Dinâmica)
```typescript
// Dados do backend
const recipe = {
  difficulty_level: 3,
  cuisine_type: "italian",
  tags: ["vegetarian", "quick"]
}

// Renderização manual
const getDifficultyText = (level: number) => {
  switch (level) {
    case 1: return "Muito Fácil"
    case 2: return "Fácil"
    case 3: return "Intermediário"
    // ... mais casos
  }
}

// Uso
<p>Dificuldade: {getDifficultyText(recipe.difficulty_level)}</p>
```

### Depois (Com Tradução Dinâmica)
```typescript
import { useDynamicTranslation } from "@/lib/config/i18n"

export function RecipeCard({ recipe }) {
  const { translate } = useDynamicTranslation()

  return (
    <div>
      <p>Dificuldade: {translate.difficulty(recipe.difficulty_level)}</p>
      <p>Tipo: {translate.cuisine(recipe.cuisine_type)}</p>
      <div>
        {recipe.tags.map(tag => (
          <Badge key={tag}>{translate.recipeTag(tag)}</Badge>
        ))}
      </div>
    </div>
  )
}
```

## Vantagens

1. **Consistência**: Todas as traduções seguem o mesmo padrão
2. **Manutenibilidade**: Centraliza as traduções em um local
3. **Flexibilidade**: Suporta múltiplos idiomas facilmente
4. **Performance**: Não precisa de múltiplos switch statements
5. **Escalabilidade**: Fácil adicionar novos idiomas e tipos de dados

## Adicionando Novos Tipos de Tradução

Para adicionar novos tipos de tradução:

1. **Adicione as traduções no objeto `translateDynamicData`**:
```typescript
export const translateDynamicData = {
  // ... existente ...
  
  // Novo tipo
  newType: (value: string, lang: string = 'pt') => {
    const translations = {
      pt: {
        'value1': 'Tradução PT 1',
        'value2': 'Tradução PT 2'
      },
      en: {
        'value1': 'Translation EN 1',
        'value2': 'Translation EN 2'
      }
    }
    return translations[lang as keyof typeof translations]?.[value] || value
  }
}
```

2. **Atualize o hook `useDynamicTranslation`**:
```typescript
export const useDynamicTranslation = () => {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language

  return {
    t,
    currentLang,
    translate: {
      // ... existente ...
      newType: (value: string) => translateDynamicData.newType(value, currentLang)
    }
  }
}
```

## Casos de Uso Comuns

### 1. Cards de Receita
```typescript
// Traduzir dificuldade, tipo de cozinha e tags
<p>Dificuldade: {translate.difficulty(recipe.difficulty_level)}</p>
<p>Tipo: {translate.cuisine(recipe.cuisine_type)}</p>
{recipe.tags.map(tag => (
  <Badge key={tag}>{translate.recipeTag(tag)}</Badge>
))}
```

### 2. Filtros
```typescript
// Opções de filtro traduzidas
const difficultyOptions = [
  { value: "1", label: translate.difficulty(1) },
  { value: "2", label: translate.difficulty(2) },
  // ...
]
```

### 3. Formulários
```typescript
// Labels e opções traduzidas
<Select>
  <SelectItem value="italian">{translate.cuisine('italian')}</SelectItem>
  <SelectItem value="japanese">{translate.cuisine('japanese')}</SelectItem>
</Select>
```

### 4. Listas e Tabelas
```typescript
// Status traduzidos em tabelas
<td>{translate.recipeStatus(recipe.status)}</td>
```

## Boas Práticas

1. **Sempre use o hook**: Prefira `useDynamicTranslation` em vez de importar diretamente `translateDynamicData`
2. **Fallback para valores originais**: Se uma tradução não existir, o valor original é retornado
3. **Consistência nos códigos**: Use códigos consistentes no backend (ex: sempre lowercase, com underscores)
4. **Teste em múltiplos idiomas**: Sempre teste as traduções em todos os idiomas suportados
5. **Documente novos tipos**: Quando adicionar novos tipos, atualize este guia

## Troubleshooting

### Problema: Tradução não funciona
**Solução**: Verifique se o código do backend corresponde exatamente às chaves de tradução

### Problema: Tradução em idioma errado
**Solução**: Verifique se o `currentLang` está correto e se as traduções existem para esse idioma

### Problema: Performance lenta
**Solução**: As traduções são estáticas e não afetam a performance. Se houver problemas, verifique outros aspectos do componente

## Conclusão

O sistema de tradução dinâmica torna a internacionalização muito mais fácil e consistente. Use-o sempre que precisar traduzir dados que vêm do backend, garantindo uma experiência de usuário consistente em todos os idiomas suportados. 