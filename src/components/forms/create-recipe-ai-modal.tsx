"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { formatRecipe } from "@/lib/utils/format-recipe"
import { Recipe } from "@/types/recipe"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { X, Save, ChefHat, Mic, Send, Sparkles, Bot, Crown, Wand2, Leaf, Timer, Users } from "lucide-react"
import { useGenerateRecipeWithAI } from "@/network/hooks"

interface CreateRecipeAIModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (recipe: any) => void
}

interface ChatMessage {
  type: 'user' | 'ai'
  message: string
  timestamp: string
  suggestions?: string[]
  new_recipe?: Recipe
}

interface GeneratedRecipe {
  title: string
  description: string
  time: string | undefined
  servings: string | undefined
  difficulty: string | undefined
  ingredients: string[]
  instructions: string[]
  image: string
}

interface RecipeIngredient {
  name: string
  amount: string
}

interface RecipeStep {
  step: number
  description: string
}

// Estado consolidado para o modal AI de criar receita
interface CreateRecipeAIModalState {
  isGenerating: boolean
  generatedRecipe: GeneratedRecipe | null
  chatMessages: ChatMessage[]
  chatInput: string
  showPreferences: boolean
  recipeType: string
  cookingTime: string
  lastGeneratedRecipe: any | null // Armazena a última receita gerada para usar como old_recipe
}

export function CreateRecipeAIModal({ isOpen, onClose, onSave }: CreateRecipeAIModalProps) {
  const { t } = useTranslation();
  
  // Estado consolidado
  const [modalState, setModalState] = useState<CreateRecipeAIModalState>({
    isGenerating: false,
    generatedRecipe: null,
    chatMessages: [],
    chatInput: "",
    showPreferences: false,
    recipeType: "",
    cookingTime: "",
    lastGeneratedRecipe: null
  })

  // Resetar chat ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setModalState(prev => ({
        ...prev,
        chatMessages: [
          { 
            type: 'ai', 
            message: t('ai.welcome.message'),
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            suggestions: []
          }
        ],
        chatInput: "",
        isGenerating: false,
        generatedRecipe: null,
        lastGeneratedRecipe: null
      }))
    }
  }, [isOpen])

  // Desestruturação para facilitar o uso
  const { isGenerating, generatedRecipe, chatMessages, chatInput, showPreferences, recipeType, cookingTime } = modalState

  // Função helper para atualizar estado
  const updateModalState = (updates: Partial<CreateRecipeAIModalState>) => {
    setModalState(prev => ({ ...prev, ...updates }))
  }

  const generateRecipeMutation = useGenerateRecipeWithAI()

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isGenerating) return

    const userMessage = chatInput.trim()
    updateModalState({
      chatMessages: [...chatMessages, { 
        type: 'user', 
        message: userMessage,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }],
      chatInput: "",
      isGenerating: true
    })

    try {
      let recipe
      if (!modalState.lastGeneratedRecipe) {
        // Primeira mensagem: usar first_message
        recipe = await generateRecipeMutation.mutateAsync({
          first_message: userMessage
        })
      } else {
        // Mensagens subsequentes: usar old_recipe e new_recipe
        // old_recipe = última receita gerada (armazenada no estado)
        recipe = await generateRecipeMutation.mutateAsync({
          first_message: undefined,
          old_recipe: JSON.stringify(modalState.lastGeneratedRecipe),
          new_recipe: userMessage
        })
      }

      const aiResponse = formatRecipe(recipe, { isFirstMessage: !modalState.lastGeneratedRecipe })

      updateModalState({
        chatMessages: [...chatMessages, { 
          type: 'ai', 
          message: aiResponse,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          suggestions: [],
          new_recipe: recipe
        }],
        isGenerating: false,
        lastGeneratedRecipe: recipe, // Atualiza a última receita gerada
        generatedRecipe: {
          title: recipe.title || "",
          description: recipe.description || "",
          time: recipe.cooking_time?.toString(),
          servings: recipe.servings?.toString(),
          difficulty: recipe.difficulty_level?.toString(),
          ingredients: recipe.ingredients.map((i: RecipeIngredient) => `${i.amount} de ${i.name}`),
          instructions: recipe.steps.map((s: RecipeStep) => s.description),
          image: recipe.image_url || "/placeholder.jpg"
        }
      })
    } catch (error) {
      console.error("Erro ao gerar receita:", error)
      updateModalState({
        isGenerating: false,
        chatMessages: [...chatMessages, {
          type: 'ai',
          message: t('ai.error.message'),
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }]
      })
    }
  }

  const handleQuickSuggestion = (suggestion: string) => {
    updateModalState({ chatInput: suggestion })
  }

  const generateWithAI = async () => {
    updateModalState({ isGenerating: true })

    setTimeout(() => {
      const newGeneratedRecipe: GeneratedRecipe = {
        title: "Receita Gourmet por IA",
        description: "Uma receita criada pela nossa IA gourmet, com ingredientes selecionados e técnicas culinárias avançadas.",
        time: "45 minutos",
        servings: "4 pessoas",
        difficulty: "Médio",
        ingredients: [
          "400g de ingrediente principal",
          "200ml de caldo",
          "2 colheres de sopa de azeite",
          "Temperos a gosto",
          "Ervas frescas para finalizar"
        ],
        instructions: [
          "Prepare os ingredientes",
          "Aqueça o azeite em fogo médio",
          "Adicione os ingredientes principais e refogue",
          "Aplique as técnicas de preparo",
          "Finalize com toque final"
        ],
        image: "/placeholder.jpg"
      }
      
      updateModalState({
        generatedRecipe: newGeneratedRecipe,
        isGenerating: false
      })
    }, 3000)
  }





  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] overflow-y-auto bg-gradient-to-br from-white via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border-2 border-orange-200 dark:border-gray-600 text-gray-900 dark:text-white shadow-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-orange-100/50 [&::-webkit-scrollbar-track]:dark:bg-gray-700/50 [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-orange-400 [&::-webkit-scrollbar-thumb]:to-yellow-400 [&::-webkit-scrollbar-thumb]:dark:from-orange-500 [&::-webkit-scrollbar-thumb]:dark:to-yellow-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-orange-500 [&::-webkit-scrollbar-thumb]:hover:to-yellow-500 [&::-webkit-scrollbar-thumb]:dark:hover:from-orange-400 [&::-webkit-scrollbar-thumb]:dark:hover:to-yellow-400">
        <DialogHeader className="pb-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-700 bg-clip-text text-transparent">
                  iChef24 AI
                </DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('ai.create.gourmet')}</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Chat Container - Full Height */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-orange-200/50 dark:border-gray-500/50 shadow-xl flex-1 flex flex-col">
            <CardContent className="p-6 flex flex-col h-full">
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-4 border-b border-orange-200/30 dark:border-gray-600/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">iChef24 AI</h4>
                    <p className="text-sm text-orange-600 dark:text-orange-400">{t('ai.create.gourmet')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 dark:text-green-400">Online</span>
                </div>
              </div>

              {/* Messages - Scrollable Area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 my-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-orange-100/50 [&::-webkit-scrollbar-track]:dark:bg-gray-700/50 [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-orange-400 [&::-webkit-scrollbar-thumb]:to-yellow-400 [&::-webkit-scrollbar-thumb]:dark:from-orange-500 [&::-webkit-scrollbar-thumb]:dark:to-yellow-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-orange-500 [&::-webkit-scrollbar-thumb]:hover:to-yellow-500 [&::-webkit-scrollbar-thumb]:dark:hover:from-orange-400 [&::-webkit-scrollbar-thumb]:dark:hover:to-yellow-400">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] relative ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 text-white shadow-orange-500/30' 
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-orange-200 dark:border-gray-500 shadow-lg'
                    } rounded-2xl p-4 transform transition-all duration-300 hover:scale-105`}>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {message.type === 'ai' && (
                          <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                                                  <span className="text-sm font-bold opacity-90">
                          {message.type === 'ai' ? 'iChef24 AI' : t('common.you')}
                        </span>
                          <span className="text-sm opacity-70 ml-2">{message.timestamp}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm leading-relaxed whitespace-pre-line">{message.message}</div>
                        
                        {message.suggestions && (
                          <div className="flex flex-wrap gap-2 pt-3 border-t border-white/20 dark:border-gray-600/30">
                            {message.suggestions.map((suggestion, i) => (
                              <Button
                                key={i}
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuickSuggestion(suggestion)}
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
                            <span className="text-sm font-bold text-gray-900 dark:text-white">iChef24 AI</span>
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce delay-100"></div>
                              <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce delay-200"></div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {t('ai.creating.message')}
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
                      onChange={(e) => updateModalState({ chatInput: e.target.value })}
                      placeholder={t('ai.input.placeholder')}
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

          {/* Preferences - Conditional */}
          {showPreferences && (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-700 shadow-xl mt-4">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-blue-500" />
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t('ai.preferences')}</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      {t('ai.recipe.type')}
                    </label>
                    <Input
                      value={recipeType}
                      onChange={(e) => updateModalState({ recipeType: e.target.value })}
                      placeholder={t('ai.recipe.type.placeholder')}
                      className="h-10 text-sm bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      {t('ai.prep.time')}
                    </label>
                    <Input
                      value={cookingTime}
                      onChange={(e) => updateModalState({ cookingTime: e.target.value })}
                      placeholder={t('ai.prep.time.placeholder')}
                      className="h-10 text-sm bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}



          {/* Generate Button */}
          <Button
            onClick={generateWithAI}
            disabled={isGenerating}
            className="w-full h-14 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-emerald-500 hover:via-green-500 hover:to-emerald-600 text-white border-0 font-bold text-base rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group mt-4"
          >
            {isGenerating ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white rounded-full animate-spin">
                  <div className="w-3 h-3 bg-green-500 rounded-full m-1"></div>
                </div>
                <span className="font-semibold">{t('ai.creating.recipe')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                <span className="font-semibold">{t('ai.create.gourmet')}</span>
              </div>
            )}
          </Button>

          </div>
        </DialogContent>
      </Dialog>
    )
  }