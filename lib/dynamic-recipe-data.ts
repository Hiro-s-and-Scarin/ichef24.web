// Sistema para integração com backend - dados dinâmicos traduzidos
import { useTranslation } from 'react-i18next';

export interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  time: string;
  servings: string;
  difficulty: 'easy' | 'medium' | 'hard'; // Usar keys ao invés de strings
  tags: string[];
  date: string;
  rating: number;
  ingredients: string[];
  instructions: string[];
  // Campos para backend
  titleKey?: string; // Para receitas vindas do backend
  descriptionKey?: string; // Para receitas vindas do backend
  isFromBackend?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TranslatedRecipe extends Omit<Recipe, 'difficulty'> {
  difficulty: string; // Traduzido
}

// Hook para gerenciar receitas com tradução automática
export const useRecipeData = () => {
  const { t, i18n } = useTranslation();

  // Traduzir dificuldade
  const translateDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): string => {
    const difficultyMap = {
      easy: t('common.easy'),
      medium: t('common.medium'),
      hard: t('common.hard')
    };
    return difficultyMap[difficulty] || difficulty;
  };

  // Traduzir receita individual
  const translateRecipe = (recipe: Recipe): TranslatedRecipe => {
    // Se é uma receita do backend e tem chaves de tradução
    if (recipe.isFromBackend && recipe.titleKey) {
      return {
        ...recipe,
        title: t(recipe.titleKey, recipe.title), // Fallback para título original
        description: t(recipe.descriptionKey || '', recipe.description),
        difficulty: translateDifficulty(recipe.difficulty),
        // Manter outros campos como estão (ingredientes/instruções podem vir traduzidos do backend)
      };
    }

    // Para receitas locais/hardcoded
    return {
      ...recipe,
      difficulty: translateDifficulty(recipe.difficulty),
    };
  };

  // Preparar receita para salvar no backend
  const prepareRecipeForBackend = (recipe: Partial<Recipe>) => {
    return {
      ...recipe,
      // Salvar difficulty como key, não string traduzida
      difficulty: recipe.difficulty,
      // Adicionar metadados para backend
      language: i18n.language,
      createdAt: new Date().toISOString(),
      isFromBackend: true,
    };
  };

  // Função para buscar receitas do backend (mock)
  const fetchRecipesFromBackend = async (): Promise<Recipe[]> => {
    // TODO: Implementar quando houver backend real
    // Esta função buscará receitas do banco de dados
    // As receitas virão com titleKey, descriptionKey para tradução
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock de dados do backend
        resolve([
          {
            id: 1,
            title: 'Chicken Risotto with Lemon', // Título em inglês do backend
            titleKey: 'recipes.chicken_risotto.title', // Chave para tradução
            description: 'A creamy and aromatic risotto...',
            descriptionKey: 'recipes.chicken_risotto.description',
            isFromBackend: true,
            difficulty: 'medium',
            // ... outros campos
          } as Recipe
        ]);
      }, 1000);
    });
  };

  // Salvar receita no backend
  const saveRecipeToBackend = async (recipe: Partial<Recipe>) => {
    const preparedRecipe = prepareRecipeForBackend(recipe);
    
    // TODO: Implementar POST para API
    console.log('Salvando receita no backend:', preparedRecipe);
    
    // Simular salvamento
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...preparedRecipe,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        });
      }, 1000);
    });
  };

  // Atualizar receita no backend
  const updateRecipeInBackend = async (id: number, updates: Partial<Recipe>) => {
    const preparedUpdates = {
      ...updates,
      updatedAt: new Date().toISOString(),
      language: i18n.language,
    };

    // TODO: Implementar PUT para API
    console.log('Atualizando receita no backend:', { id, updates: preparedUpdates });
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id, ...preparedUpdates });
      }, 1000);
    });
  };

  return {
    translateRecipe,
    translateDifficulty,
    prepareRecipeForBackend,
    fetchRecipesFromBackend,
    saveRecipeToBackend,
    updateRecipeInBackend,
  };
};

// Dados de exemplo para desenvolvimento (substituir por dados do backend)
export const getMockRecipes = (): Recipe[] => {
  return [
    {
      id: 1,
      title: 'Risotto de Frango com Limão', // Será substituído por dados do backend
      description: 'Um risotto cremoso e aromático com frango suculento e ervas frescas',
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop&crop=center',
      time: '35 min',
      servings: '4 pessoas',
      difficulty: 'medium',
      tags: ['italian', 'creamy', 'protein'], // Usar keys ao invés de strings traduzidas
      date: 'hoje', // Será formatado dinamicamente
      rating: 5,
      ingredients: [
        '400g de arroz arbóreo',
        '500g de peito de frango em cubos',
        // ... resto dos ingredientes
      ],
      instructions: [
        'Aqueça o caldo de galinha em uma panela e mantenha em fogo baixo.',
        // ... resto das instruções
      ],
      isFromBackend: false, // Receita local
    },
    // ... outras receitas mock
  ];
};

// Sistema de cache para otimização
class RecipeCache {
  private cache = new Map<string, Recipe[]>();
  
  set(language: string, recipes: Recipe[]) {
    this.cache.set(language, recipes);
  }
  
  get(language: string): Recipe[] | undefined {
    return this.cache.get(language);
  }
  
  clear() {
    this.cache.clear();
  }
}

export const recipeCache = new RecipeCache();