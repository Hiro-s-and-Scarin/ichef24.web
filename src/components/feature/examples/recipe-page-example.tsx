"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Share2, Clock, Users, ChefHat } from "lucide-react";
import {
  useGetRecipes,
  useGetRecipeById,
  usePostRecipe,
  useToggleFavoriteRecipe,
  useGenerateRecipeWithAI,
} from "@/network/hooks/recipes/useRecipes";
import { CreateRecipeData, AIRecipeRequest } from "@/types/recipe";
import { useTranslation } from "react-i18next";

export function RecipePageExample() {
  const { t } = useTranslation();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAIForm, setShowAIForm] = useState(false);

  const { data: recipes, isLoading: recipesLoading } = useGetRecipes({
    page: 1,
    limit: 10,
  });
  const { data: selectedRecipe, isLoading: recipeLoading } =
    useGetRecipeById(selectedRecipeId);

  const createRecipeMutation = usePostRecipe();
  const { addToFavorites, removeFromFavorites } = useToggleFavoriteRecipe();
  const generateAIRecipeMutation = useGenerateRecipeWithAI();

  const [newRecipe, setNewRecipe] = useState<CreateRecipeData>({
    title: "",
    description: "",
    time: "",
    servings: "",
    difficulty: "easy",
    tags: [],
    ingredients: [],
    instructions: [],
    isPublic: true,
  });

  const [aiPrompt, setAiPrompt] = useState("");

  const handleCreateRecipe = async () => {
    if (!newRecipe.title || !newRecipe.description) return;

    try {
      await createRecipeMutation.mutateAsync(newRecipe);
      setShowCreateForm(false);
      setNewRecipe({
        title: "",
        description: "",
        time: "",
        servings: "",
        difficulty: "easy",
        tags: [],
        ingredients: [],
        instructions: [],
        isPublic: true,
      });
    } catch (error) {
      toast.error("Erro ao criar receita");
    }
  };

  const handleGenerateAIRecipe = async () => {
    if (!aiPrompt) return;

    const aiRequest: AIRecipeRequest = {
      prompt: aiPrompt,
      preferences: {
        difficulty: "medium",
        time: "30-45 min",
        servings: 4,
      },
    };

    try {
      await generateAIRecipeMutation.mutateAsync(aiRequest);
      setShowAIForm(false);
      setAiPrompt("");
    } catch (error) {
      toast.error("Erro ao gerar receita com IA");
    }
  };

  const handleToggleFavorite = async (
    recipeId: string,
    isFavorite: boolean,
  ) => {
    try {
      if (isFavorite) {
        await removeFromFavorites.mutateAsync(recipeId);
      } else {
        await addToFavorites.mutateAsync(recipeId);
      }
    } catch (error) {
      toast.error("Erro ao alterar favorito");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Exemplo de Integração - Receitas
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Demonstração do TanStack Query integrado com as páginas do iChef
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <ChefHat className="w-4 h-4 mr-2" />
          Nova Receita
        </Button>
        <Button
          onClick={() => setShowAIForm(!showAIForm)}
          className="bg-gradient-to-r from-purple-600 to-blue-600"
        >
          ✨ Gerar com IA
        </Button>
      </div>

      {showCreateForm && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Criar Nova Receita</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Título da receita"
              value={newRecipe.title}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, title: e.target.value })
              }
            />
            <Textarea
              placeholder="Descrição da receita"
              value={newRecipe.description}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, description: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Tempo de preparo"
                value={newRecipe.time}
                onChange={(e) =>
                  setNewRecipe({ ...newRecipe, time: e.target.value })
                }
              />
              <Input
                placeholder="Porções"
                value={newRecipe.servings}
                onChange={(e) =>
                  setNewRecipe({ ...newRecipe, servings: e.target.value })
                }
              />
            </div>
            <Button
              onClick={handleCreateRecipe}
              disabled={createRecipeMutation.isPending}
              className="w-full"
            >
              {createRecipeMutation.isPending ? "Criando..." : "Criar Receita"}
            </Button>
          </CardContent>
        </Card>
      )}

      {showAIForm && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Gerar Receita com IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Descreva o tipo de receita que você quer... (ex: uma massa italiana com frango e cogumelos)"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <Button
              onClick={handleGenerateAIRecipe}
              disabled={generateAIRecipeMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {generateAIRecipeMutation.isPending
                ? "Gerando..."
                : "✨ Gerar Receita"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Receitas Disponíveis</h2>
          {recipesLoading ? (
            <div className="text-center py-8">{t("common.loading")}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes?.map((recipe) => (
                <Card
                  key={recipe.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">
                          {recipe.title}
                        </h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleToggleFavorite(
                              recipe.id,
                              recipe.isFavorite || false,
                            )
                          }
                        >
                          <Heart
                            className={`w-4 h-4 ${recipe.isFavorite ? "fill-red-500 text-red-500" : ""}`}
                          />
                        </Button>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {recipe.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {recipe.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {recipe.servings}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {recipe.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        onClick={() => setSelectedRecipeId(recipe.id)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        {t("community.view.details")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {selectedRecipeId && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Detalhes da Receita</h2>
            {recipeLoading ? (
              <div className="text-center py-8">{t("common.loading")}</div>
            ) : selectedRecipe ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {selectedRecipe.title}
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleToggleFavorite(
                            selectedRecipe.id,
                            selectedRecipe.isFavorite || false,
                          )
                        }
                      >
                        <Heart
                          className={`w-4 h-4 ${selectedRecipe.isFavorite ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedRecipe.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold">
                        {selectedRecipe.time}
                      </div>
                      <div className="text-sm text-gray-500">Tempo</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">
                        {selectedRecipe.servings}
                      </div>
                      <div className="text-sm text-gray-500">Porções</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold capitalize">
                        {selectedRecipe.difficulty}
                      </div>
                      <div className="text-sm text-gray-500">Dificuldade</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Ingredientes:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li
                          key={index}
                          className="text-gray-600 dark:text-gray-300"
                        >
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Modo de Preparo:</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      {selectedRecipe.instructions.map((instruction, index) => (
                        <li
                          key={index}
                          className="text-gray-600 dark:text-gray-300"
                        >
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
