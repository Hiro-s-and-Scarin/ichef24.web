export const recipeTags = {
  protein: [
    "Frango",
    "Carne",
    "Peixe",
    "Porco",
    "Cordeiro",
    "Vegano",
    "Vegetariano",
  ],
  cuisine: [
    "Italiano",
    "Brasileiro",
    "Japonês",
    "Chinês",
    "Mexicano",
    "Indiano",
    "Francês",
    "Mediterrâneo",
  ],
  dishType: [
    "Sopa",
    "Salada",
    "Pasta",
    "Risotto",
    "Sobremesa",
    "Bebida",
    "Aperitivo",
    "Prato Principal",
  ],
  difficulty: ["Fácil", "Médio", "Difícil"],
  prepTime: ["Rápido (< 30 min)", "Médio (30-60 min)", "Longo (> 60 min)"],
  occasion: [
    "Café da manhã",
    "Almoço",
    "Jantar",
    "Lanche",
    "Festa",
    "Romântico",
    "Familiar",
  ],
};

// Todas as tags em uma única lista para o select
export const allRecipeTags = [
  ...recipeTags.protein,
  ...recipeTags.cuisine,
  ...recipeTags.dishType,
  ...recipeTags.difficulty,
  ...recipeTags.prepTime,
  ...recipeTags.occasion,
].sort();

// Tags organizadas por categoria para exibição
export const recipeTagsByCategory = [
  {
    name: "Tipo de Proteína",
    tags: recipeTags.protein,
  },
  {
    name: "Cozinha",
    tags: recipeTags.cuisine,
  },
  {
    name: "Tipo de Prato",
    tags: recipeTags.dishType,
  },
  {
    name: "Dificuldade",
    tags: recipeTags.difficulty,
  },
  {
    name: "Tempo de Preparo",
    tags: recipeTags.prepTime,
  },
  {
    name: "Ocasião",
    tags: recipeTags.occasion,
  },
];
