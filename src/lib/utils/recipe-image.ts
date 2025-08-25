import { Recipe } from "@/types/recipe";

/**
 * Obtém a URL da imagem de uma receita, priorizando o relacionamento recipeImage
 * @param recipe - A receita
 * @returns URL da imagem ou undefined se não houver imagem
 */
export function getRecipeImageUrl(recipe: Recipe): string | undefined {
  // Prioriza o relacionamento recipeImage (mais atualizado)
  if (recipe.recipeImage?.url_signed) {
    return recipe.recipeImage.url_signed;
  }
  
  // Fallback para image_url (legado)
  if (recipe.image_url) {
    return recipe.image_url;
  }
  
  return undefined;
}

/**
 * Obtém a key da imagem de uma receita
 * @param recipe - A receita
 * @returns Key da imagem ou undefined se não houver
 */
export function getRecipeImageKey(recipe: Recipe): string | undefined {
  // Prioriza o relacionamento recipeImage
  if (recipe.recipeImage?.key) {
    return recipe.recipeImage.key;
  }
  
  // Fallback para image_key
  if (recipe.image_key) {
    return recipe.image_key;
  }
  
  return undefined;
}

/**
 * Verifica se uma receita tem imagem
 * @param recipe - A receita
 * @returns true se tiver imagem, false caso contrário
 */
export function hasRecipeImage(recipe: Recipe): boolean {
  return !!(recipe.recipeImage?.url_signed || recipe.image_url);
}

/**
 * Obtém a URL da imagem de uma receita em um post da comunidade
 * @param recipe - A receita do post
 * @returns URL da imagem ou undefined se não houver imagem
 */
export function getCommunityPostRecipeImageUrl(recipe: {
  image_url?: string;
  recipeImage?: {
    key: string;
    url_signed: string;
  };
}): string | undefined {
  // Prioriza o relacionamento recipeImage (mais atualizado)
  if (recipe.recipeImage?.url_signed) {
    return recipe.recipeImage.url_signed;
  }
  
  // Fallback para image_url (legado)
  if (recipe.image_url) {
    return recipe.image_url;
  }
  
  return undefined;
}

/**
 * Verifica se uma receita em um post da comunidade tem imagem
 * @param recipe - A receita do post
 * @returns true se tiver imagem, false caso contrário
 */
export function hasCommunityPostRecipeImage(recipe: {
  image_url?: string;
  recipeImage?: {
    key: string;
    url_signed: string;
  };
}): boolean {
  return !!(recipe.recipeImage?.url_signed || recipe.image_url);
}
