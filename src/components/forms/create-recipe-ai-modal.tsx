"use client";

import { useState, useEffect } from "react";
import { formatRecipe } from "@/lib/utils/format-recipe";
import { Recipe } from "@/types/recipe";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  ChefHat,
  Send,
  Sparkles,
  Bot,
  Timer,
  Clock,
  Users,
} from "lucide-react";
import { useGenerateRecipeWithAI, useSaveAIRecipe, useUpdateAIRecipe } from "@/network/hooks";
import { useCurrentUser } from "@/network/hooks/users/useUsers";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/config/query-keys";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { RecipeCard } from "@/components/common/recipe-card";
import { useSearchImageByTitle } from "@/network/hooks/recipe-image/useRecipeImage";

// Componente RecipeCard simplificado para o modal AI
function AIRecipeCard({ recipe }: { recipe: any }) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-lg overflow-hidden shadow-lg min-h-[400px] w-full max-w-md mx-auto">
      {/* Recipe Image */}
      <div className="relative h-48 w-full">
        {recipe.image_url && recipe.image_url !== "/placeholder.jpg" ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 flex items-center justify-center">
            <span className="text-4xl">🍳</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Recipe Title */}
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
          {recipe.title}
        </h3>

        {/* Recipe Description */}
        {recipe.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* Recipe Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          {recipe.cooking_time && (
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cooking_time} min</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} porções</span>
            </div>
          )}
        </div>

        {/* Difficulty Level */}
        {recipe.difficulty_level && (
          <div className="mb-3">
            <span className="inline-block px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
              {recipe.difficulty_level === 1 ? "Fácil" : 
               recipe.difficulty_level === 2 ? "Médio" : 
               recipe.difficulty_level === 3 ? "Difícil" : "Não especificado"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Função auxiliar para detectar se uma mensagem é uma pergunta
const isQuestion = (message: string) => {
  const lowerCaseMessage = message.toLowerCase();
  return lowerCaseMessage.includes("?") || lowerCaseMessage.includes("como") || lowerCaseMessage.includes("quero");
};

interface CreateRecipeAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
  existingRecipe?: Recipe; // Para edição de receitas existentes
  initialMessage?: string; // Mensagem inicial para o chat
}

interface ChatMessage {
  type: "user" | "ai";
  message: string;
  timestamp: string;
  suggestions?: string[];
  isRecipe?: boolean; // Indica se a mensagem contém uma receita
  recipeData?: any; // Dados da receita quando isRecipe for true
  userInteractionMessage?: string; // Mensagem de interação do usuário
  isQuestion?: boolean; // Indica se é uma pergunta (não uma modificação)
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
  existingRecipe,
  initialMessage,
}: CreateRecipeAIModalProps) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const { t } = useTranslation();
  const searchImageMutation = useSearchImageByTitle();

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
  
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setModalState((prev) => ({
        ...prev,
        chatMessages: [
          {
            type: "ai",
            message: existingRecipe ? t("ai.improve.message", { title: existingRecipe.title }) : t("ai.welcome.message"),
            timestamp: new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            suggestions: [],
          },
        ],
        chatInput: initialMessage || "",
        isGenerating: false,
        generatedRecipe: null,
        lastGeneratedRecipe: existingRecipe || null,
      }));

      if (initialMessage && initialMessage.trim()) {
        setTimeout(() => {
          const userMessage = initialMessage.trim();
          updateModalState({ 
            chatInput: userMessage,
            chatMessages: [
              {
                type: "ai",
                message: existingRecipe ? t("ai.improve.message", { title: existingRecipe.title }) : t("ai.welcome.message"),
                timestamp: new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                suggestions: [],
              },
              {
                type: "user",
                message: userMessage,
                timestamp: new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ],
            isGenerating: true,
          });
          
          // Chamar diretamente a mutation em vez de handleChatSubmit
          generateRecipeMutation.mutateAsync({
            first_message: userMessage,
          }).then(async (recipe) => {
            // Buscar imagem para a receita inicial
            if ((recipe as any).title_translate) {
              try {
                const imageData = await searchImageMutation.mutateAsync((recipe as any).title_translate);
                if (imageData?.data?.url_signed) {
                  (recipe as any).image_url = imageData.data.url_signed;
                }
              } catch (error) {
                // Usar imagem padrão se falhar
                (recipe as any).image_url = (recipe as any).image_url || "/placeholder.jpg";
              }
            } else {
              // Se não tem title_translate, usar imagem padrão
              (recipe as any).image_url = (recipe as any).image_url || "/placeholder.jpg";
            }

            updateModalState({
              chatMessages: [
                {
                  type: "ai",
                  message: existingRecipe ? t("ai.improve.message", { title: existingRecipe.title }) : t("ai.welcome.message"),
                  timestamp: new Date().toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  suggestions: [],
                },
                {
                  type: "user",
                  message: userMessage,
                  timestamp: new Date().toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
                {
                  type: "ai",
                  message: '',
                  timestamp: new Date().toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  suggestions: [],
                  isRecipe: true,
                  recipeData: recipe,
                  userInteractionMessage: '',
                  isQuestion: false,
                },
              ],
              isGenerating: false,
              lastGeneratedRecipe: recipe,
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
                image: (recipe as any).image_url || "/placeholder.jpg", // Usar image_url atualizado
              },
            });

            // Invalidar queries APÓS a receita ser criada com sucesso
            queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my });
            queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user });
            queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites });
            
            // Se estamos editando uma receita existente, invalidar a query específica dela
            if (existingRecipe) {
              queryClient.invalidateQueries({ queryKey: queryKeys.recipes.one(existingRecipe.id) });
            } else if (recipe && recipe.id) {
              queryClient.invalidateQueries({ queryKey: queryKeys.recipes.one(recipe.id) });
            }
          }).catch((error) => {
            console.error("Erro ao gerar receita:", error);
            toast.error(t("error.generate.recipe"));
            updateModalState({
              isGenerating: false,
            });
          });
        }, 100);
      }
    }
  }, [isOpen, initialMessage, existingRecipe]);

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
  const saveAIRecipeMutation = useSaveAIRecipe();
  const updateAIRecipeMutation = useUpdateAIRecipe();

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveRecipe = async () => {
    if (!modalState.lastGeneratedRecipe) {
              toast.error(t("error.no.recipe.to.save"));
      return;
    }

    setIsSaving(true);
    try {
      // Garantir que o image_url seja incluído corretamente
      const recipeToSave = {
        ...modalState.lastGeneratedRecipe,
        image_url: (modalState.lastGeneratedRecipe as any).image_url || "/placeholder.jpg"
      };
      
      const recipeDataString = JSON.stringify(recipeToSave);
      
      if (existingRecipe) {
        await updateAIRecipeMutation.mutateAsync({
          id: existingRecipe.id,
          recipeData: recipeDataString
        });
      } else {
        await saveAIRecipeMutation.mutateAsync(recipeDataString);
      }

      onSave(recipeToSave);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
              toast.error(t("error.save.recipe"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isGenerating) return;

    const userMessage = chatInput.trim();
    const isQuestionMessage = isQuestion(userMessage);
    setIsQuestionLoading(isQuestionMessage);
    
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
      // Se existe uma receita para editar ou já gerou uma receita, usar old_recipe e new_recipe
      if (existingRecipe || modalState.lastGeneratedRecipe) {
        const recipeToUse = modalState.lastGeneratedRecipe || existingRecipe;
        const oldRecipeForAI = {
          title: recipeToUse!.title,
          description: recipeToUse!.description,
          ingredients: recipeToUse!.ingredients || [],
          steps: recipeToUse!.steps || [],
          cooking_time: recipeToUse!.cooking_time,
          servings: recipeToUse!.servings,
          difficulty_level: recipeToUse!.difficulty_level,
          cuisine_type: recipeToUse!.cuisine_type,
          tags: recipeToUse!.tags || [],
        };

        recipe = await generateRecipeMutation.mutateAsync({
          first_message: undefined,
          old_recipe: JSON.stringify(oldRecipeForAI),
          new_recipe: userMessage,
        });
      } else {
        // Primeira mensagem sem receita existente: usar first_message
        recipe = await generateRecipeMutation.mutateAsync({
          first_message: userMessage,
        });
      }

      // Detectar se é uma pergunta ou modificação
      const isQuestionResult = isQuestion(userMessage);
      const userInteractionMessage = (recipe as any).user_interaction_message || '';
      
      // Se for pergunta, não mostrar recipe card, apenas o diálogo
      const aiResponse = isQuestionResult ? userInteractionMessage : '';

      // Se não for pergunta, buscar imagem para a receita
      if (!isQuestionResult && (recipe as any).title_translate) {
        try {
          const imageData = await searchImageMutation.mutateAsync((recipe as any).title_translate);
          if (imageData?.data?.url_signed) {
            (recipe as any).image_url = imageData.data.url_signed;
          }
        } catch (error) {
          // Usar imagem padrão se falhar
          (recipe as any).image_url = (recipe as any).image_url || "/placeholder.jpg";
        }
      } else if (!isQuestionResult) {
        // Se não for pergunta mas não tem title_translate, usar imagem padrão
        (recipe as any).image_url = (recipe as any).image_url || "/placeholder.jpg";
      }

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
            isRecipe: !isQuestionResult, // Só é receita se não for pergunta
            recipeData: isQuestionResult ? undefined : recipe,
            userInteractionMessage: userInteractionMessage,
            isQuestion: isQuestionResult,
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
          image: (recipe as any).image_url || "/placeholder.jpg", // Usar image_url atualizado
        },
      });
      
      // Reset do loading de pergunta
      setIsQuestionLoading(false);

             // Invalidar queries APÓS a receita ser criada com sucesso
       queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
       queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my });
       queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user });
       queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites });
       
       // Se estamos editando uma receita existente, invalidar a query específica dela
       if (existingRecipe) {
         queryClient.invalidateQueries({ queryKey: queryKeys.recipes.one(existingRecipe.id) });
       } else if (recipe && recipe.id) {
         queryClient.invalidateQueries({ queryKey: queryKeys.recipes.one(recipe.id) });
       }

    } catch (error: unknown) {
      console.error("Erro detalhado ao gerar receita:", error);
      
              let errorMessage = t("error.generate.recipe");
      
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { status?: number; data?: { message?: string } } };
        
        if (apiError.response?.status === 408) {
          errorMessage = "Tempo limite excedido. A geração de receita pode levar alguns minutos.";
        } else if (apiError.response?.status === 403) {
          errorMessage = t("error.recipe.limit.reached");
        } else if (apiError.response?.status === 402) {
                      errorMessage = t("error.plan.expired");
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
      setIsQuestionLoading(false);
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
        title: t("ai.improved.recipe"),
                  description: t("ai.improved.description"),
                  time: t("ai.improved.time"),
          servings: t("ai.improved.servings"),
          difficulty: t("form.difficulty.medium"),
                  ingredients: [
            t("ai.improved.ingredients.main"),
            t("ai.improved.ingredients.broth"),
            t("ai.improved.ingredients.oil"),
            t("ai.improved.ingredients.seasoning"),
            t("ai.improved.ingredients.herbs"),
          ],
                  instructions: [
            t("ai.improved.instructions.prepare"),
            t("ai.improved.instructions.heat"),
            t("ai.improved.instructions.add"),
            t("ai.improved.instructions.apply"),
            t("ai.improved.instructions.finish"),
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
        <DialogContent className="max-w-6xl w-[60vw] h-[93vh] p-0 bg-transparent border-0 shadow-none overflow-hidden">
        <DialogTitle className="sr-only">Converse com iChef24! - Assistente Culinário Inteligente</DialogTitle>
        {/* Background com gradiente e efeitos */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/80"></div>
        </div>

        {/* Container principal com glassmorphism */}
        <div className="relative z-10 min-h-full bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-0 shadow-2xl overflow-hidden flex flex-col">
          {/* Header elegante */}
          <div className="relative p-8 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 text-white overflow-hidden rounded-t-none">
            {/* Elementos decorativos de fundo */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-yellow-600/20 to-orange-600/20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/30 to-yellow-400/30 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Logo com efeito 3D */}
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <ChefHat className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-600 rounded-2xl blur opacity-50"></div>
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-3xl font-black bg-gradient-to-r from-orange-200 via-yellow-200 to-orange-200 bg-clip-text text-transparent">
                    Converse com iChef24!
                  </h1>
                  <p className="text-orange-100 dark:text-orange-200 text-sm font-medium tracking-wide">
                    Assistente Culinário Inteligente: Tire dúvidas ou peça adaptações para esta receita!
                  </p>
                </div>
              </div>

              {/* Botão de fechar elegante */}
              <button
                onClick={onClose}
                className="group relative w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              >
                <X className="w-5 h-5 text-white group-hover:text-orange-200 transition-colors" />
              </button>
            </div>

            {/* Contador de receitas com design moderno */}
            {currentUser && (
              <div className="relative z-10 mt-6 flex justify-center">
                <div className="px-6 py-3 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <Timer className="w-4 h-4 text-orange-200" />
                    <span className="text-orange-100 font-medium text-sm">
                      Receitas hoje: {currentUser.daily_recipe_counter || 0}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Container do chat */}
          <div className="flex flex-1 min-h-0">
            {/* Área principal do chat */}
            <div className="flex-1 flex flex-col min-h-0">
             
              {/* Área de mensagens - com altura flexível */}
              <div 
                className="flex-1 overflow-y-auto p-6 space-y-4 ai-modal-scrollbar min-h-0" 
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#fb923c #fed7aa'
                }}
              >
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] relative ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 text-white shadow-xl"
                          : "bg-white dark:bg-slate-800 text-orange-900 dark:text-white border border-orange-200 dark:border-slate-700 shadow-lg"
                      } rounded-3xl p-4 transform transition-all duration-300 hover:scale-[1.02]`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {message.type === "ai" && (
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <span className="text-sm font-semibold opacity-90">
                            {message.type === "ai" ? t("ai.title") : t("common.you")}
                          </span>
                          <span className="text-sm opacity-70 ml-3 font-mono">
                            {message.timestamp}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {/* Para perguntas: mostrar apenas o diálogo */}
                        {message.isQuestion ? (
                          <div className="text-sm leading-relaxed whitespace-pre-line">
                            {message.message}
                          </div>
                        ) : (
                          /* Para receitas: mostrar apenas o AIRecipeCard */
                          message.isRecipe && message.recipeData ? (
                            <div className="mt-4">
                              <AIRecipeCard recipe={message.recipeData} />
                            </div>
                          ) : (
                            /* Fallback: mostrar a mensagem se não for nem pergunta nem receita */
                            <div className="text-sm leading-relaxed whitespace-pre-line">
                              {message.message}
                            </div>
                          )
                        )}

                        {message.suggestions && (
                          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20 dark:border-orange-600/30">
                            {message.suggestions.map((suggestion, i) => (
                              <Button
                                key={i}
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuickSuggestion(suggestion)}
                                className="text-xs border border-white/30 text-white hover:bg-white/20 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-900/20 rounded-full px-4 py-2 font-medium transition-all duration-300 hover:scale-105"
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

                {/* Indicador de geração */}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-800 border border-orange-200 dark:border-slate-700 rounded-3xl p-6 shadow-lg max-w-[80%]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                          <div className="w-5 h-5 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-orange-900 dark:text-white">
                              iChef24 AI
                            </span>
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                          <p className="text-sm text-orange-600 dark:text-orange-300">
                            {isQuestionLoading ? "Buscando respostas..." : "Criando sua receita especial..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de salvar receita */}
              {modalState.lastGeneratedRecipe && (
                <div className="p-4 border-t border-orange-200 dark:border-slate-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700">
                  <div className="flex justify-center">
                    <Button
                      onClick={handleSaveRecipe}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSaving ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Salvando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Salvar Receita
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Área de input moderna */}
              <div className="p-4 border-t border-orange-200 dark:border-slate-700 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-slate-800 dark:to-slate-700">
                <form onSubmit={handleChatSubmit} className="space-y-0">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                    <Input
                      value={chatInput}
                      onChange={(e) => updateModalState({ chatInput: e.target.value })}
                      placeholder="Descreva sua receita dos sonhos..."
                      className="relative h-14 pr-20 bg-white dark:bg-slate-800 border-2 border-orange-300 dark:border-slate-600 text-orange-900 dark:text-white rounded-2xl focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 shadow-lg text-sm group-hover:shadow-xl group-hover:scale-[1.02]"
                      disabled={isGenerating}
                    />
                    <div className="absolute right-2 top-2">
                      <Button
                        type="submit"
                        size="sm"
                        disabled={!chatInput.trim() || isGenerating}
                        className="h-10 w-10 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 hover:from-orange-600 hover:via-yellow-600 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
