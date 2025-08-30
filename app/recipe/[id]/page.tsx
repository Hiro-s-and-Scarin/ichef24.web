"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Clock, Users, Utensils, BookOpen, ArrowLeft, Star, MessageCircle, Sparkles, Copy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { translateDynamicData } from "@/lib/config/i18n"
import { useRecipe, useLikeRecipe } from "@/network/hooks/recipes/useRecipes"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { CreateRecipeAIModal } from "@/components/forms/create-recipe-ai-modal"

interface RecipePageState {
  mounted: boolean
  isAIModalOpen: boolean
}

export default function RecipePage() {
  const { t, i18n } = useTranslation()
  const params = useParams()
  const { user } = useAuth()
  const [recipeState, setRecipeState] = useState<RecipePageState>({
    mounted: false,
    isAIModalOpen: false,
  })

  // Estados para curtidas (igual ao detalhe do post)
  const [recipeLikesCount, setRecipeLikesCount] = useState(0)
  const [isRecipeLiked, setIsRecipeLiked] = useState(false)

  const { mounted } = recipeState
  const { data: recipe, isLoading, error } = useRecipe(params.id as string)
  
  // Hooks para curtidas
  const likeRecipeMutation = useLikeRecipe()


  const updateRecipeState = (updates: Partial<RecipePageState>) => {
    setRecipeState(prev => ({ ...prev, ...updates }))
  }

  const handleOpenAIModal = () => {
    if (!user) {
      toast.error("Você precisa estar logado para editar receitas")
      return
    }
    updateRecipeState({ isAIModalOpen: true })
  }

  const handleCloseAIModal = () => {
    updateRecipeState({ isAIModalOpen: false })
  }

  const handleAIRecipeSave = async (updatedRecipe: any) => {
    try {
      handleCloseAIModal()
      // A invalidação das queries já é feita automaticamente pelo hook useUpdateAIRecipe
      toast.success("Receita atualizada com sucesso!")
    } catch (error) {
      toast.error("Erro ao atualizar receita")
    }
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



  // Função de curtir igual ao detalhe do post
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
      const result = await likeRecipeMutation.mutateAsync(recipe.id)
      
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

  // useEffect para inicializar curtidas (igual ao detalhe do post)
  useEffect(() => {
    if (recipe) {
      setRecipeLikesCount(recipe.likes_count || 0)
      if (user && recipe.user_is_liked) {
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
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
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

                     {/* Recipe Header */}
           <Card className="bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:bg-gray-800/80 dark:bg-none border-gray-700/50 backdrop-blur-sm overflow-hidden">
            <div className="relative h-80">
              <Image
                src={recipe.image_url || "/placeholder.svg"}
                alt={recipe.title}
                fill
                className="object-cover"
              />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                                         <h1 className="text-4xl font-bold text-white dark:text-gray-200 mb-3">{recipe.title}</h1>
                     <p className="text-white/90 dark:text-gray-300 text-lg mb-4">{recipe.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags?.map((tag: string, index: number) => (
                                                 <Badge key={index} className="bg-white/20 text-white border-white/30 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-600">
                          {translateDynamicData.recipeTag(tag, i18n.language)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

                         {/* Recipe Stats */}
             <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:bg-gray-800/80 dark:bg-none">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                                    <div className="text-center">
                     <Clock className="w-6 h-6 text-white dark:text-gray-200 mx-auto mb-2" />
                     <div className="text-white dark:text-gray-200 font-medium">{recipe.cooking_time || 'N/A'} min</div>
                     <div className="text-white dark:text-gray-300 text-sm">{t('form.time')}</div>
                   </div>
                   <div className="text-center">
                     <Users className="w-6 h-6 text-white dark:text-gray-200 mx-auto mb-2" />
                     <div className="text-white dark:text-gray-200 font-medium">{recipe.servings || 'N/A'}</div>
                     <div className="text-white dark:text-gray-300 text-sm">{t('form.servings')}</div>
                   </div>
                   <div className="text-center">
                     <Utensils className="w-6 h-6 text-white dark:text-gray-200 mx-auto mb-2" />
                     <div className="text-white dark:text-gray-200 font-medium">
                       {recipe.difficulty_level ? translateDynamicData.difficulty(recipe.difficulty_level, i18n.language) : 'N/A'}
                     </div>
                     <div className="text-white dark:text-gray-300 text-sm">{t('form.difficulty')}</div>
                   </div>
                   <div className="text-center">
                     <Star className="w-6 h-6 text-white dark:text-gray-200 mx-auto mb-2 fill-current" />
                     <div className="text-white dark:text-gray-200 font-medium">{recipeLikesCount}</div>
                     <div className="text-white dark:text-gray-300 text-sm">{t("recipe.like.count")}</div>
                   </div>
                   <div className="text-center">
                     <MessageCircle className="w-6 h-6 text-white dark:text-gray-200 mx-auto mb-2" />
                     <div className="text-white dark:text-gray-200 font-medium">{recipe.views_count || 0}</div>
                     <div className="text-white dark:text-gray-300 text-sm">{t('recipe.reviews')}</div>
                   </div>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                             {/* Ingredients */}
               <Card className="bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:bg-gray-800/80 dark:bg-none border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                                     <h3 className="text-2xl font-semibold text-white dark:text-gray-200 flex items-center gap-3 mb-6">
                     <BookOpen className="w-6 h-6 text-white dark:text-gray-200" />
                     {t('form.ingredients')}
                   </h3>
                  <ul className="space-y-4">
                    {Array.isArray(recipe.ingredients) ? recipe.ingredients.map((ingredient, index: number) => (
                                                               <li key={index} className="flex items-start gap-3 text-white dark:text-gray-200">
                       <div className="w-2 h-2 bg-white dark:bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                       <span className="text-lg">
                         {ingredient.name ? `${ingredient.amount} ${ingredient.name}` : ingredient}
                       </span>
                     </li>
                    )) : (
                                             <li className="text-gray-400 dark:text-gray-500">Ingredientes não disponíveis</li>
                    )}
                  </ul>
                </CardContent>
              </Card>

                             {/* Instructions */}
               <Card className="bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:bg-gray-800/80 dark:bg-none border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                                     <h3 className="text-2xl font-semibold text-white dark:text-gray-200 flex items-center gap-3 mb-6">
                     <Utensils className="w-6 h-6 text-white dark:text-gray-200" />
                     {t('recipe.instructions')}
                   </h3>
                  <ol className="space-y-6">
                    {Array.isArray(recipe.steps) ? recipe.steps.map((step, index: number) => (
                      <li key={index} className="flex gap-4">
                                                 <div className="w-10 h-10 bg-gradient-to-r from-[#f54703] to-[#ff7518] dark:bg-gray-600 dark:bg-none rounded-full flex items-center justify-center text-white dark:text-gray-200 font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                                                 <span className="text-white dark:text-gray-200 leading-relaxed text-lg pt-2">
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

            {/* Sidebar */}
            <div className="space-y-6">
                             {/* Recipe Info */}
               <Card className="bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:bg-gray-800/80 dark:bg-none border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                                     <h3 className="text-xl font-semibold text-white dark:text-gray-200 mb-4">{t("recipe.info.title")}</h3>
                  <div className="space-y-3">
                                         <div className="flex justify-between">
                       <span className="text-white dark:text-gray-300">Tipo de Cozinha</span>
                       <span className="text-white dark:text-gray-200 font-medium">{recipe.cuisine_type || 'N/A'}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-white dark:text-gray-300">Gerada por IA</span>
                       <span className="text-white dark:text-gray-200 font-medium">{recipe.is_ai_generated ? 'Sim' : 'Não'}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-white dark:text-gray-300">Pública</span>
                       <span className="text-white dark:text-gray-200 font-medium">{recipe.is_public ? 'Sim' : 'Não'}</span>
                     </div>
                  </div>
                </CardContent>
              </Card>

                                            {/* Editar com IA - só aparece para receitas do usuário logado */}
                {user && recipe.user_id === Number(user.id) && (
                  <Card className="bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:bg-gray-800/80 dark:bg-none border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                                         <h3 className="text-xl font-semibold text-white dark:text-gray-200 mb-4">{t("recipe.edit.ai")}</h3>
                     <p className="text-white dark:text-gray-300 text-sm mb-4">
                       {t("recipe.edit.ai.description")}
                     </p>
                    <Button
                      onClick={handleOpenAIModal}
                      className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 dark:from-gray-600 dark:via-gray-700 dark:to-gray-800 dark:hover:from-gray-700 dark:hover:via-gray-800 dark:hover:to-gray-900 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t("recipe.edit.ai")}
                    </Button>
                  </CardContent>
                </Card>
              )}

                                            {/* Curtir Receita */}
                <Card className="bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:bg-gray-800/80 dark:bg-none border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                                     <h3 className="text-xl font-semibold text-white dark:text-gray-200 mb-4">{t("recipe.like.title")}</h3>
                  <div className="flex items-center justify-between mb-4">
                                         <div className="flex items-center gap-2 text-white dark:text-gray-200">
                       <Star className="w-5 h-5 text-white dark:text-gray-200" />
                       <span>{recipeLikesCount} {t("recipe.like.count")}</span>
                     </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleLikeRecipe}
                      disabled={likeRecipeMutation.isPending || isRecipeLiked}
                                             className={`text-xs px-3 py-1.5 h-8 ${
                         isRecipeLiked 
                           ? 'bg-gray-600 text-white border-gray-600 cursor-not-allowed dark:bg-gray-600 dark:border-gray-600' 
                           : 'bg-transparent hover:bg-gray-600 text-gray-700 border-gray-300 hover:text-white dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:border-gray-600'
                       }`}
                    >
                      <Star className={`w-3.5 h-3.5 mr-1.5 ${isRecipeLiked ? 'fill-current' : ''}`} />
                      {isRecipeLiked ? t("recipe.like.liked") : t("recipe.like.like")}
                    </Button>
                  </div>
                  
                  {/* Botão Copiar Link */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyUrl}
                                         className="w-full bg-transparent hover:bg-white/10 text-white border-white/30 hover:border-white/50 dark:text-gray-300 dark:border-gray-400 dark:hover:bg-gray-700/50 dark:hover:border-gray-500 text-xs px-3 py-1.5 h-8"
                    title="Copiar link da receita"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    {t("community.post.copy.link")}
                  </Button>
                </CardContent>
              </Card>


            </div>
          </div>
        </div>
      </div>

      {/* Modal de IA para editar receita */}
      <CreateRecipeAIModal
        isOpen={recipeState.isAIModalOpen}
        onClose={handleCloseAIModal}
        onSave={handleAIRecipeSave}
        existingRecipe={recipe}
      />
    </div>
  )
}
