interface FormatRecipeOptions {
  isFirstMessage?: boolean
}

export const formatRecipe = (recipe: any, options: FormatRecipeOptions = {}) => {
  // Verifica se a receita está dentro de data ou não
  const recipeData = recipe.data || recipe

  const ingredients = recipeData.ingredients.map((ing: any) => `• ${ing.amount} de ${ing.name}`).join('\n')
  const steps = recipeData.steps.map((step: any) => `${step.step}. ${step.description}`).join('\n')
  
  const intro = options.isFirstMessage
    ? `✨ Que ideia incrível! Criei uma receita especial para você:`
    : `🎉 Perfeito! Analisei sua receita e criei uma versão melhorada.`

  return `${intro}

📝 **${recipeData.title}**
${recipeData.description}

---

⏲️ **Tempo de preparo:** ${recipeData.cooking_time} minutos
👥 **Serve:** ${recipeData.servings} pessoas  
📊 **Dificuldade:** ${recipeData.difficulty_level}/5
🍽️ **Tipo:** ${recipeData.cuisine_type}

---

📋 **Ingredientes:**
${ingredients}

---

👩‍🍳 **Modo de Preparo:**
${steps}

---

`
}