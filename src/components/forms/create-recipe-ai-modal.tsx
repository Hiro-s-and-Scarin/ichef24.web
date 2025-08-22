"use client";

import { useState, useEffect } from "react";

import { formatRecipe } from "@/lib/utils/format-recipe";
import { Recipe } from "@/types/recipe";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  X,
  Save,
  ChefHat,
  Mic,
  Send,
  Sparkles,
  Bot,
  Crown,
  Wand2,
  Leaf,
  Timer,
  Users,
} from "lucide-react";
import { useGenerateRecipeWithAI } from "@/network/hooks";
import { useCurrentUser } from "@/network/hooks/users/useUsers";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/config/query-keys";
import { toast } from "sonner";

interface CreateRecipeAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}

interface ChatMessage {
  type: "user" | "ai";
  message: string;
  timestamp: string;
  suggestions?: string[];
  new_recipe?: Recipe;
}

interface GeneratedRecipe {
  title: string;
  description: string;
  time: string | undefined;
  servings: string | undefined;
  difficulty: string | undefined;
  ingredients: string[];
  instructions: string[];
  image: string;
}

interface RecipeIngredient {
  name: string;
  amount: string;
}

interface RecipeStep {
  step: number;
  description: string;
}

interface CreateRecipeAIModalState {
  isGenerating: boolean;
  generatedRecipe: GeneratedRecipe | null;
  chatMessages: ChatMessage[];
  chatInput: string;
  showPreferences: boolean;
  recipeType: string;
  cookingTime: string;
  lastGeneratedRecipe: Recipe | null;
}

export function CreateRecipeAIModal({
  isOpen,
  onClose,
  onSave,
}: CreateRecipeAIModalProps) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  const [modalState, setModalState] = useState<CreateRecipeAIModalState>({
    isGenerating: false,
    generatedRecipe: null,
    chatMessages: [],
    chatInput: "",
    showPreferences: false,
    recipeType: "",
    cookingTime: "",
    lastGeneratedRecipe: null,
  });

  useEffect(() => {
    if (isOpen) {
      setModalState((prev) => ({
        ...prev,
        chatMessages: [
          {
            type: "ai",
            message: "Que receita você quer criar hoje?",
            timestamp: new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            suggestions: [],
          },
        ],
        chatInput: "",
        isGenerating: false,
        generatedRecipe: null,
        lastGeneratedRecipe: null,
      }));
    }
  }, [isOpen]);

  const {
    isGenerating,
    generatedRecipe,
    chatMessages,
    chatInput,
    showPreferences,
    recipeType,
    cookingTime,
  } = modalState;

  const updateModalState = (updates: Partial<CreateRecipeAIModalState>) => {
    setModalState((prev) => ({ ...prev, ...updates }));
  };

  const generateRecipeMutation = useGenerateRecipeWithAI();

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isGenerating) return;

    const userMessage = chatInput.trim();
    updateModalState({
      chatMessages: [
        ...chatMessages,
        {
          type: "user",
          message: userMessage,
          timestamp: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
      chatInput: "",
      isGenerating: true,
    });

    try {
      let recipe;
      if (!modalState.lastGeneratedRecipe) {
        // Primeira mensagem: usar first_message
        recipe = await generateRecipeMutation.mutateAsync({
          first_message: userMessage,
        });
      } else {
        // Mensagens subsequentes: usar old_recipe e new_recipe
        // IMPORTANTE: Enviar os dados EXATOS da receita anterior para a IA
        // NÃO traduzir aqui - manter dados originais para a IA
        const oldRecipeForAI = {
          title: modalState.lastGeneratedRecipe.title,
          description: modalState.lastGeneratedRecipe.description,
          ingredients: modalState.lastGeneratedRecipe.ingredients || [],
          steps: modalState.lastGeneratedRecipe.steps || [],
          cooking_time: modalState.lastGeneratedRecipe.cooking_time,
          servings: modalState.lastGeneratedRecipe.servings,
          difficulty_level: modalState.lastGeneratedRecipe.difficulty_level,
          cuisine_type: modalState.lastGeneratedRecipe.cuisine_type,
          tags: modalState.lastGeneratedRecipe.tags || [],
        };

        recipe = await generateRecipeMutation.mutateAsync({
          first_message: undefined,
          old_recipe: JSON.stringify(oldRecipeForAI),
          new_recipe: userMessage,
        });
      }

      const aiResponse = formatRecipe(recipe as any, {
        isFirstMessage: !modalState.lastGeneratedRecipe,
      });

      updateModalState({
        chatMessages: [
          ...chatMessages,
          {
            type: "ai",
            message: aiResponse,
            timestamp: new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            suggestions: [],
            new_recipe: recipe,
          },
        ],
        isGenerating: false,
        lastGeneratedRecipe: recipe, // Atualiza a última receita gerada (DADOS ORIGINAIS)
        generatedRecipe: {
          title: recipe.title || "",
          description: recipe.description || "",
          time: recipe.cooking_time?.toString(),
          servings: recipe.servings?.toString(),
          difficulty: recipe.difficulty_level?.toString(),
          ingredients: recipe.ingredients.map(
            (i: RecipeIngredient) => `${i.amount} de ${i.name}`,
          ),
          instructions: recipe.steps.map((s: RecipeStep) => s.description),
          image: recipe.image_url || "/placeholder.jpg",
        },
      });

      // Invalidar queries APÓS a receita ser criada com sucesso
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites });

    } catch (error: unknown) {
      console.error("Erro detalhado ao gerar receita:", error);
      
      let errorMessage = "Erro ao gerar receita. Tente novamente.";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { status?: number; data?: { message?: string } } };
        
        if (apiError.response?.status === 408) {
          errorMessage = "Tempo limite excedido. A geração de receita pode levar alguns minutos.";
        } else if (apiError.response?.status === 403) {
          errorMessage = "Limite de receitas atingido. Atualize seu plano para continuar.";
        } else if (apiError.response?.status === 402) {
          errorMessage = "Seu plano expirou. Renove para continuar usando o serviço.";
        } else if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else if (error && typeof error === 'object' && 'code' in error) {
        const networkError = error as { code?: string };
        if (networkError.code === 'ECONNABORTED') {
          errorMessage = "Tempo limite excedido. A geração de receita pode levar alguns minutos.";
        }
      }
      
      toast.error(errorMessage);
      updateModalState({
        isGenerating: false,
        chatMessages: [
          ...chatMessages,
          {
            type: "ai",
            message: errorMessage,
            timestamp: new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ],
      });
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    updateModalState({ chatInput: suggestion });
  };

  const generateWithAI = async () => {
    updateModalState({ isGenerating: true });

    setTimeout(() => {
      const newGeneratedRecipe: GeneratedRecipe = {
        title: "Receita Gourmet por IA",
        description:
          "Uma receita criada pela nossa IA gourmet, com ingredientes selecionados e técnicas culinárias avançadas.",
        time: "45 minutos",
        servings: "4 pessoas",
        difficulty: "Médio",
        ingredients: [
          "400g de ingrediente principal",
          "200ml de caldo",
          "2 colheres de sopa de azeite",
          "Temperos a gosto",
          "Ervas frescas para finalizar",
        ],
        instructions: [
          "Prepare os ingredientes",
          "Aqueça o azeite em fogo médio",
          "Adicione os ingredientes principais e refogue",
          "Aplique as técnicas de preparo",
          "Finalize com toque final",
        ],
        image: "/placeholder.jpg",
      };

      updateModalState({
        generatedRecipe: newGeneratedRecipe,
        isGenerating: false,
      });
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] overflow-y-auto bg-gradient-to-br from-white via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border-2 border-orange-200 dark:border-gray-600 text-gray-900 dark:text-white shadow-2xl p-3 pt-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-orange-100/50 [&::-webkit-scrollbar-track]:dark:bg-gray-700/50 [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-orange-400 [&::-webkit-scrollbar-thumb]:to-yellow-400 [&::-webkit-scrollbar-thumb]:dark:from-orange-500 [&::-webkit-scrollbar-thumb]:dark:to-yellow-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-orange-500 [&::-webkit-scrollbar-thumb]:hover:to-yellow-500 [&::-webkit-scrollbar-thumb]:dark:hover:from-orange-400 [&::-webkit-scrollbar-thumb]:dark:hover:to-yellow-400">
        <DialogHeader className="pb-0 mb-0">
          <div className="text-center my-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-700 bg-clip-text text-transparent">
                  iChef24 AI
                </DialogTitle>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Crie receitas gourmet com IA
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-full -mt-4">
          {/* Contador de receitas diárias */}
          {currentUser && (
            <div className="mb-2 mt-1 p-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Timer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-700 dark:text-blue-300">
                  Receitas geradas hoje: {currentUser.daily_recipe_counter || 0}
                </span>
              </div>
            </div>
          )}

          {/* Chat Container - Full Height */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-orange-200/50 dark:border-gray-500/50 shadow-xl flex-1 flex flex-col">
            <CardContent className="p-6 flex flex-col h-full">
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-4 border-b border-orange-200/30 dark:border-gray-600/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="my-8">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      iChef24 AI
                    </h4>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      Crie receitas gourmet com IA
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    Online
                  </span>
                </div>
              </div>

              {/* Messages - Scrollable Area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 my-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-orange-100/50 [&::-webkit-scrollbar-track]:dark:bg-gray-700/50 [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-orange-400 [&::-webkit-scrollbar-thumb]:to-yellow-400 [&::-webkit-scrollbar-thumb]:dark:from-orange-500 [&::-webkit-scrollbar-thumb]:dark:to-yellow-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-orange-500 [&::-webkit-scrollbar-thumb]:hover:to-yellow-500 [&::-webkit-scrollbar-thumb]:dark:hover:from-orange-400 [&::-webkit-scrollbar-thumb]:dark:hover:to-yellow-400">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] relative ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 text-white shadow-orange-500/30"
                          : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-orange-200 dark:border-gray-500 shadow-lg"
                      } rounded-2xl p-4 transform transition-all duration-300 hover:scale-105`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        {message.type === "ai" && (
                          <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <span className="text-sm font-bold opacity-90">
                            {message.type === "ai" ? "iChef24 AI" : "Você"}
                          </span>
                          <span className="text-sm opacity-70 ml-2">
                            {message.timestamp}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm leading-relaxed whitespace-pre-line">
                          {message.message}
                        </div>

                        {message.suggestions && (
                          <div className="flex flex-wrap gap-2 pt-3 border-t border-white/20 dark:border-gray-600/30">
                            {message.suggestions.map((suggestion, i) => (
                              <Button
                                key={i}
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleQuickSuggestion(suggestion)
                                }
                                className="text-xs border border-white/30 text-white hover:bg-white/20 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-900/20 rounded-full px-3 py-1 font-medium transition-all duration-300 hover:scale-105"
                              >
                                ✨ {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-700 border border-orange-200 dark:border-gray-500 rounded-2xl p-4 shadow-lg max-w-[85%]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                          <Sparkles className="w-4 h-4 text-white animate-spin" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                              iChef24 AI
                            </span>
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce delay-100"></div>
                              <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce delay-200"></div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Criando sua receita especial...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="pt-4 border-t border-orange-200/30 dark:border-gray-600/30">
                <form onSubmit={handleChatSubmit} className="space-y-3">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                    <Input
                      value={chatInput}
                      onChange={(e) =>
                        updateModalState({ chatInput: e.target.value })
                      }
                      placeholder="Descreva sua receita dos sonhos..."
                      className="relative h-12 pr-24 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 shadow-lg text-sm group-hover:shadow-xl group-hover:scale-[1.02]"
                      disabled={isGenerating}
                    />
                    <div className="absolute right-2 top-2 flex gap-2">
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!chatInput.trim() || isGenerating}
                        className="h-8 w-8 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>


        </div>
      </DialogContent>
    </Dialog>
  );
}
