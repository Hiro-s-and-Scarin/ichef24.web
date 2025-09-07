"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Clock, Users, Utensils, BookOpen, ArrowLeft, Star, MessageCircle, Sparkles, Copy, Heart, Share2, Leaf, Timer, Bot, Send } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { translateDynamicData } from "@/lib/config/i18n"
import { useRecipe, useLikeRecipe } from "@/network/hooks/recipes/useRecipes"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { useCurrentUser } from "@/network/hooks/users/useUsers"
import { useSaveAIRecipe, useUpdateAIRecipe } from "@/network/hooks"
import { useGenerateRecipeWithAI } from "@/network/hooks/recipes/useRecipes"
import { useSearchImageByTitle } from "@/network/hooks/recipe-image/useRecipeImage"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/config/query-keys"
import { useRouter } from "next/navigation"

interface ChatMessage {
  type: "user" | "ai"
  message: string
  timestamp: string
  suggestions?: string[]
  isRecipe?: boolean
  recipeData?: any
  userInteractionMessage?: string
  isQuestion?: boolean
}

interface RecipePageState {
  mounted: boolean
  chatInput: string
  chatMessages: ChatMessage[]
  isGenerating: boolean
  lastGeneratedRecipe: any
  isQuestionLoading: boolean
}

export default function RecipePage() {
  const { t, i18n } = useTranslation()
  const params = useParams()
  const { user } = useAuth()
  const [recipeState, setRecipeState] = useState<RecipePageState>({
    mounted: false,
    chatInput: "",
    chatMessages: [
      {
        type: "ai",
        message: "Olá! Sou o Chef AI. Como posso ajudar você com esta receita?",
        timestamp: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ],
    isGenerating: false,
    lastGeneratedRecipe: null,
    isQuestionLoading: false,
  })

  // Estados para curtidas
  const [recipeLikesCount, setRecipeLikesCount] = useState(0)
  const [isRecipeLiked, setIsRecipeLiked] = useState(false)

  const { mounted } = recipeState
  let { data: recipe, isLoading, error } = useRecipe(params.id as string)
  
  // Hooks para curtidas e AI
  const likeRecipeMutation = useLikeRecipe()
  const queryClient = useQueryClient()
  const generateRecipeMutation = useGenerateRecipeWithAI()
  const searchImageMutation = useSearchImageByTitle()
  const { data: currentUser } = useCurrentUser()
  const saveAIRecipeMutation = useSaveAIRecipe()
  const updateAIRecipeMutation = useUpdateAIRecipe()
  const router = useRouter()

  const updateRecipeState = (updates: Partial<RecipePageState>) => {
    setRecipeState(prev => ({ ...prev, ...updates }))
  }



  const handleAIRecipeSave = async (updatedRecipe: any) => {
    try {
      if (recipe?.id) {
        const savedRecipe = await updateAIRecipeMutation.mutateAsync({
          id: recipe.id,
          recipeData: JSON.stringify(updatedRecipe)
        })
        toast.success("Receita atualizada com sucesso!")
        
        queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my })
        queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user })
        queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites })
        
      } else {
        const recipeDataString = JSON.stringify(updatedRecipe)
        const savedRecipe = await saveAIRecipeMutation.mutateAsync(recipeDataString)
        toast.success("Receita salva com sucesso!")
        
        queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my })
        queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user })
        queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites })
        
        if (savedRecipe?.id) {
          router.push(`/recipe/${savedRecipe.id}`)
        } else {
          toast.error("Erro ao salvar receita: ID não encontrado")
        }
      }
    } catch (error) {
      toast.error("Erro ao salvar receita")
    }
  }

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipeState(prev => ({ ...prev, chatInput: e.target.value }))
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipeState.chatInput.trim() || recipeState.isGenerating) return

    const userMessage = recipeState.chatInput.trim()
    const isQuestionMessage = isQuestion(userMessage)
    
    // Adicionar mensagem do usuário
    const newUserMessage = {
      type: "user" as const,
      message: userMessage,
      timestamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setRecipeState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newUserMessage],
      chatInput: "",
      isGenerating: true,
      isQuestionLoading: isQuestionMessage,
    }))

    try {
      let aiRecipe
      // Se existe uma receita para editar, usar old_recipe e new_recipe
      if (recipe) {
        const oldRecipeForAI = {
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients || [],
          steps: recipe.steps || [],
          cooking_time: recipe.cooking_time,
          servings: recipe.servings,
          difficulty_level: recipe.difficulty_level,
          cuisine_type: recipe.cuisine_type,
          tags: recipe.tags || [],
        }

        aiRecipe = await generateRecipeMutation.mutateAsync({
          first_message: undefined,
          old_recipe: JSON.stringify(oldRecipeForAI),
          new_recipe: userMessage,
          recipe_id: recipe.id,
        })
      } else {
        aiRecipe = await generateRecipeMutation.mutateAsync({
          first_message: userMessage
        })
      }

      const recipeData = aiRecipe['data' as keyof typeof aiRecipe] as any || aiRecipe;
      
      const isQuestionResult = isQuestion(userMessage)
      const userInteractionMessage = (recipeData as any).user_interaction_message || ''
      
      let aiResponse = ''
      if (isQuestionResult) {
        aiResponse = userInteractionMessage || `Entendi sua pergunta sobre "${userMessage}". Como posso ajudar você com esta receita?`
      }

      if (!isQuestionResult && (recipeData as any).title_translate) {
        try {
          const imageData = await searchImageMutation.mutateAsync((recipeData as any).title_translate)
          if (imageData?.data?.url_signed) {
            (recipeData as any).image_url = imageData.data.url_signed
          }
        } catch (error) {
          (recipeData as any).image_url = (recipeData as any).image_url || "/placeholder.jpg"
        }
      } else if (!isQuestionResult) {
        (recipeData as any).image_url = (recipeData as any).image_url || "/placeholder.jpg"
      }

      const newAIMessage = {
        type: "ai" as const,
        message: isQuestionResult ? aiResponse : '', // Para perguntas, usar aiResponse
        timestamp: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        suggestions: [],
        isRecipe: !isQuestionResult, // Só é receita se não for pergunta
        recipeData: isQuestionResult ? undefined : recipeData,
        userInteractionMessage: userInteractionMessage,
        isQuestion: isQuestionResult,
      }

      setRecipeState(prev => {
        const newState = {
          ...prev,
          chatMessages: [
            ...prev.chatMessages,
            newAIMessage,
          ],
          isGenerating: false,
          lastGeneratedRecipe: recipeData,
          isQuestionLoading: false,
        }
        return newState
      })

      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites })

    } catch (error) {
      toast.error("Erro ao processar mensagem")
      setRecipeState(prev => ({ ...prev, isGenerating: false, isQuestionLoading: false }))
    }
  }

  // Função auxiliar para detectar se uma mensagem é uma pergunta
  const isQuestion = (message: string) => {
    const lowerCaseMessage = message.toLowerCase().trim()
    
    // Palavras que indicam MODIFICAÇÃO (prioridade alta - se tem essas, NÃO é pergunta)
    const modificationKeywords = [
      // Português
      "atualize", "atualizar", "modifique", "modificar", "mude", "mudar", 
      "altere", "alterar", "troque", "trocar", "substitua", "substituir",
      "adicione", "adicionar", "remova", "remover", "tire", "tirar",
      "melhore", "melhorar", "otimize", "otimizar", "refaça", "refazer",
      "crie", "criar", "faça", "fazer", "prepare", "preparar",
      "transforme", "transformar", "converta", "converter",
      // Inglês
      "update", "modify", "change", "alter", "replace", "substitute",
      "add", "remove", "improve", "optimize", "remake", "create", "make",
      "prepare", "transform", "convert"
    ]
    
    // Se tem palavra de modificação, NÃO é pergunta
    if (modificationKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      return false
    }
    
    // Palavras que indicam pergunta em português
    const questionWordsPT = [
      "como", "quando", "onde", "por que", "porque", "qual", "quais", 
      "quem", "o que", "que", "quanto", "quantos", "quantas",
      "pode", "deve", "deveria", "seria", "é possível", "tem como",
      "dá para", "da para", "consegue", "consegues", "sabe", "sabes",
      "explica", "explicas", "diz", "dizes", "conta", "contas",
      "posso", "você pode", "você consegue", "você sabe"
    ]
    
    // Palavras que indicam pergunta em inglês
    const questionWordsEN = [
      "how", "when", "where", "why", "what", "which", "who", 
      "can", "could", "should", "would", "is it possible", "do you have",
      "does it have", "will it", "does this", "can you", "how do i",
      "what if", "tell me", "explain", "describe", "suggest",
      "is there", "are there", "does it", "do you", "would you",
      "could you", "should i", "can i", "may i", "might i"
    ]
    
    // Verificar se contém ponto de interrogação
    const hasQuestionMark = lowerCaseMessage.includes("?")
    
    // Verificar se contém palavras de pergunta
    const hasQuestionKeyword = questionWordsPT.some(word => lowerCaseMessage.includes(word)) ||
                              questionWordsEN.some(word => lowerCaseMessage.includes(word))
    
    // Verificar se começa com palavras de pergunta
    const startsWithQuestion = lowerCaseMessage.startsWith("posso") ||
                              lowerCaseMessage.startsWith("você pode") ||
                              lowerCaseMessage.startsWith("você consegue") ||
                              lowerCaseMessage.startsWith("você sabe") ||
                              questionWordsPT.some(word => lowerCaseMessage.startsWith(word)) ||
                              questionWordsEN.some(word => lowerCaseMessage.startsWith(word))
    
    return hasQuestionKeyword && (hasQuestionMark || startsWithQuestion)
  }

  const handleCopyUrl = async () => {
    const recipeUrl = `${window.location.origin}/recipe/${recipe?.id}`;
    
    try {
      await navigator.clipboard.writeText(recipeUrl);
      toast.success("Link da receita copiado para a área de transferência!");
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  // Função de curtir receita
  const handleLikeRecipe = async () => {
    if (!user) {
      toast.error(t("recipe.like.login.required"))
      return
    }

    if (!recipe?.id) {
      toast.error("Receita não encontrada")
      return
    }

    if (isRecipeLiked) {
      toast.info("Você já curtiu esta receita")
      return
    }

    try {
      const result = await likeRecipeMutation.mutateAsync(String(recipe.id))
      
      if (result) {
        // Atualizar estado local
        setRecipeLikesCount(result.likes_count || recipeLikesCount + 1)
        setIsRecipeLiked(true)
        toast.success("Receita curtida com sucesso!")
      }
    } catch (error) {
      toast.error(t("recipe.like.error"))
    }
  }

  // useEffect para inicializar curtidas
  useEffect(() => {
    if (recipe) {
      setRecipeLikesCount(recipe.likes_count || 0)
      if (user?.id && recipe.user_is_liked) {
        setIsRecipeLiked(recipe.user_is_liked.includes(Number(user.id)))
      }
    }
  }, [recipe, user])

  useEffect(() => {
    updateRecipeState({ mounted: true })
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-white dark:text-gray-200" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">{t('common.loading')} receita...</p>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-white dark:text-gray-200" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Erro ao carregar receita</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {error instanceof Error ? error.message : 'Receita não encontrada'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full px-4 py-8">
        <div className="w-full max-w-6xl mx-auto space-y-8">
          {/* Back Button */}
          <Button
            variant="outline"
            className="border-orange-500 text-orange-600 hover:text-white hover:bg-orange-500 bg-orange-50 dark:border-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700/50 dark:bg-transparent"
            asChild
          >
            <Link href="/history">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.back')} ao {t('header.history')}
            </Link>
          </Button>

          {/* Top Section - Recipe Overview with Orange Gradient Background */}
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
            {/* Recipe Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{recipe.title}</h1>
            
            {/* Recipe Description */}
            <p className="text-base sm:text-lg lg:text-xl mb-6 opacity-90">{recipe.description}</p>
            
            {/* Recipe Metadata */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{recipe.cooking_time || 'N/A'} minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{recipe.servings || 'N/A'} porções</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>{recipe.difficulty_level ? translateDynamicData.difficulty(recipe.difficulty_level, i18n.language) : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span>Favoritos</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLikeRecipe}
                  disabled={likeRecipeMutation.isPending || isRecipeLiked}
                  className={`p-2 h-auto ${
                    isRecipeLiked 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-white hover:text-red-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isRecipeLiked ? 'fill-current' : ''}`} />
                </Button>
                <span>{recipeLikesCount}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="p-2 h-auto text-white hover:text-gray-200"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Recipe Tags */}
            <div className="flex flex-wrap gap-2">
              {recipe.tags?.map((tag: string, index: number) => (
                <Badge 
                  key={index} 
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  {translateDynamicData.recipeTag(tag, i18n.language)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Main Content Area - Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column: Ingredients */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3 mb-4 sm:mb-6">
                  <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  Ingredientes
                </h3>
                <ul className="space-y-3">
                  {Array.isArray(recipe.ingredients) ? recipe.ingredients.map((ingredient, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        {ingredient.name ? `${ingredient.amount} ${ingredient.name}` : ingredient}
                      </span>
                    </li>
                  )) : (
                    <li className="text-gray-400 dark:text-gray-500">Ingredientes não disponíveis</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Right Column: Preparation Method */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3 mb-4 sm:mb-6">
                  <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  Modo de Preparo
                </h3>
                <ol className="space-y-4">
                  {Array.isArray(recipe.steps) ? recipe.steps.map((step, index: number) => (
                    <li key={index} className="flex gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                        {step.description || step}
                      </span>
                    </li>
                  )) : (
                    <li className="text-gray-400 dark:text-gray-500">Instruções não disponíveis</li>
                  )}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section: AI Chat */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3 mb-4">
                <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                Converse com o Chef AI
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Tire dúvidas sobre a receita, peça dicas de substituições para fazer a receita ainda melhor!
              </p>
              
              {/* Chat Messages */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {recipeState.chatMessages.map((message, index) => (
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
                            {message.type === "ai" ? "iChef24 AI" : "Você"}
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
                            {message.message || message.userInteractionMessage || "Entendi sua pergunta. Como posso ajudar você com esta receita?"}
                          </div>
                        ) : (
                          /* Para receitas: mostrar apenas o AIRecipeCard */
                          message.isRecipe && message.recipeData ? (
                            <div className="mt-4">
                              <div className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-lg overflow-hidden shadow-lg min-h-[400px] w-full max-w-md mx-auto">
                                {/* Recipe Image */}
                                <div className="relative h-48 w-full">
                                  {message.recipeData.image_url && message.recipeData.image_url !== "/placeholder.jpg" ? (
                                    <img
                                      src={message.recipeData.image_url}
                                      alt={message.recipeData.title}
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
                                    {message.recipeData.title}
                                  </h3>

                                  {/* Recipe Description */}
                                  {message.recipeData.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                      {message.recipeData.description}
                                    </p>
                                  )}

                                  {/* Recipe Stats */}
                                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                                    {message.recipeData.cooking_time && (
                                      <div className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{message.recipeData.cooking_time} min</span>
                                      </div>
                                    )}
                                    {message.recipeData.servings && (
                                      <div className="flex items-center space-x-1">
                                        <Users className="w-4 h-4" />
                                        <span>{message.recipeData.servings} porções</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Difficulty Level */}
                                  {message.recipeData.difficulty_level && (
                                    <div className="mb-3">
                                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                                        {message.recipeData.difficulty_level === 1 ? "Fácil" : 
                                         message.recipeData.difficulty_level === 2 ? "Médio" : 
                                         message.recipeData.difficulty_level === 3 ? "Difícil" : "Não especificado"}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Fallback: mostrar a mensagem se não for nem pergunta nem receita */
                            <div className="text-sm leading-relaxed whitespace-pre-line">
                              {message.message}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Indicador de geração */}
                {recipeState.isGenerating && (
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
                            {recipeState.isQuestionLoading ? "Buscando respostas..." : "Criando sua receita especial..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de salvar receita */}
              {recipeState.lastGeneratedRecipe && recipeState.chatMessages.some(msg => msg.isRecipe && msg.recipeData) && (
                <div className="p-4 border-t border-orange-200 dark:border-slate-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700">
                  <div className="flex justify-center">
                    <Button
                      onClick={() => handleAIRecipeSave(recipeState.lastGeneratedRecipe)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Salvar Receita
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
                      value={recipeState.chatInput}
                      onChange={handleChatInputChange}
                      placeholder="Descreva sua receita dos sonhos..."
                      className="relative h-14 pr-20 bg-white dark:bg-slate-800 border-2 border-orange-300 dark:border-slate-600 text-orange-900 dark:text-white rounded-2xl focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 shadow-lg text-sm group-hover:shadow-xl group-hover:scale-[1.02]"
                      disabled={recipeState.isGenerating}
                    />
                    <div className="absolute right-2 top-2">
                      <Button
                        type="submit"
                        size="sm"
                        disabled={!recipeState.chatInput.trim() || recipeState.isGenerating}
                        className="h-10 w-10 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 hover:from-orange-600 hover:via-yellow-600 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
      </div>
    </div>
  )
}
