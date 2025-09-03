"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChefHat, Send, Save, Loader2, X, Clock, Users } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useTokenCapture } from "@/network/hooks/auth/useTokenCapture"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/config/query-keys"
import { MainFeaturesSection } from "@/components/dashboard/main-features-section"
import { Recipe } from "@/types/recipe"
import { useCreateRecipe, useGenerateRecipeWithAI } from "@/network/hooks/recipes/useRecipes"
import { useSearchImageByTitle } from "@/network/hooks/recipe-image/useRecipeImage"
import { useRouter } from "next/navigation"

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}

// RecipeCard simplificado para o modal (sem botões)
function SimpleRecipeCard({ recipe }: { recipe: Recipe }) {
  const { t } = useTranslation()
  
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
  )
}

function HomePageContent() {
  const { t, ready } = useTranslation()
  const queryClient = useQueryClient()
  const router = useRouter()

  const [dashboardState, setDashboardState] = useState({
    inputValue: "",
    isGenerating: false,
    generatedRecipe: null as Recipe | null,
    isSaving: false,
    isModalOpen: false
  })

  const generateRecipeMutation = useGenerateRecipeWithAI()
  const createRecipeMutation = useCreateRecipe()
  const searchImageMutation = useSearchImageByTitle()

  useTokenCapture()

  if (!ready || !t) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    )
  }

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dashboardState.inputValue.trim()) return
    
    setDashboardState(prev => ({ ...prev, isGenerating: true, generatedRecipe: null }))
    
    try {
      const recipe = await generateRecipeMutation.mutateAsync({
        first_message: dashboardState.inputValue
      })
      
      // Buscar imagem pelo title_translate (como no modal AI)
      if ((recipe as any).title_translate) {
        try {
          const imageData = await searchImageMutation.mutateAsync((recipe as any).title_translate)
          if (imageData?.data?.url_signed) {
            (recipe as any).image_url = imageData.data.url_signed
          }
        } catch (error) {
          // Usar imagem padrão se falhar
          (recipe as any).image_url = (recipe as any).image_url || "/placeholder.jpg"
        }
      } else {
        // Se não tem title_translate, usar imagem padrão
        (recipe as any).image_url = (recipe as any).image_url || "/placeholder.jpg"
      }
      
      setDashboardState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        generatedRecipe: recipe,
        isModalOpen: true
      }))
      toast.success("Receita gerada com sucesso!")
    } catch (error) {
      setDashboardState(prev => ({ ...prev, isGenerating: false }))
      toast.error("Erro ao gerar receita. Tente novamente.")
      console.error('Erro ao gerar receita:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDashboardState(prev => ({ ...prev, inputValue: e.target.value }))
  }

  const handleSaveRecipe = async () => {
    if (!dashboardState.generatedRecipe) return
    
    setDashboardState(prev => ({ ...prev, isSaving: true }))
    
    try {
      const savedRecipe = await createRecipeMutation.mutateAsync({
        title: dashboardState.generatedRecipe.title,
        description: dashboardState.generatedRecipe.description || "",
        ingredients: dashboardState.generatedRecipe.ingredients || [],
        steps: dashboardState.generatedRecipe.steps || [],
        cooking_time: dashboardState.generatedRecipe.cooking_time || 30,
        servings: dashboardState.generatedRecipe.servings || 4,
        difficulty_level: dashboardState.generatedRecipe.difficulty_level || 2,
        cuisine_type: dashboardState.generatedRecipe.cuisine_type || "",
        tags: dashboardState.generatedRecipe.tags || [],
        image_url: dashboardState.generatedRecipe.image_url || "",
        is_ai_generated: true,
        ai_prompt: dashboardState.inputValue,
        is_public: true
      })
      
      console.log('Receita salva:', savedRecipe)
      
      toast.success("Receita salva com sucesso!")
      
      // Invalidar queries de history para atualização imediata
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user, exact: false })
      
      // Fechar modal e redirecionar
      setDashboardState(prev => ({ ...prev, isModalOpen: false, isSaving: false }))
      
      // Verificar a estrutura de retorno e extrair o ID corretamente
      let recipeId = savedRecipe.id
      
      // Se não tem ID direto, verificar se está em data.id
      if (!recipeId && (savedRecipe as any).data && (savedRecipe as any).data.id) {
        recipeId = (savedRecipe as any).data.id
      }
      
      // Se ainda não tem ID, verificar se está em success.data.id
      if (!recipeId && (savedRecipe as any).success && (savedRecipe as any).data && (savedRecipe as any).data.id) {
        recipeId = (savedRecipe as any).data.id
      }
      
      console.log('Recipe ID para redirecionamento:', recipeId)
      
      if (recipeId) {
        router.push(`/recipe/${recipeId}`)
      } else {
        console.error('ID da receita não encontrado:', savedRecipe)
        toast.error("Receita salva, mas erro no redirecionamento")
        // Redirecionar para a página de receitas em geral
        router.push('/history')
      }
    } catch (error) {
      setDashboardState(prev => ({ ...prev, isSaving: false }))
      toast.error("Erro ao salvar receita. Tente novamente.")
      console.error('Erro ao salvar receita:', error)
    }
  }

  const handleCloseModal = () => {
    setDashboardState(prev => ({ 
      ...prev, 
      isModalOpen: false, 
      generatedRecipe: null,
      inputValue: ""
    }))
  }

  const handleSuggestionClick = (suggestion: string) => {
    setDashboardState(prev => ({ ...prev, inputValue: suggestion }))
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section com Imagem de Fundo */}
      <div 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/background-home.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay escuro para melhorar legibilidade */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        
        {/* Conteúdo Hero */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Logo e Título */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <ChefHat className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-7xl md:text-9xl font-black text-white drop-shadow-2xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400">
                iChef24
              </span>
            </h1>
          </div>
          
          {/* Subtítulo Principal */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-xl leading-tight">
            Seu Chef pessoal, 24h por dia!
          </h2>
          
          {/* Descrição */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            Com o iChef24 você cria receitas em segundos com os ingredientes que tem em casa!
          </p>
          
          {/* Call to Action */}
          <p className="text-lg md:text-xl text-orange-200 font-semibold mb-12 drop-shadow-lg">
            Experimente agora mesmo!
          </p>

          {/* Input de busca principal */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleInputSubmit} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-orange-200 dark:border-gray-700 overflow-hidden">
                <Input
                  value={dashboardState.inputValue}
                  onChange={handleInputChange}
                  placeholder={t("ai.welcome.message")}
                  className="w-full h-16 px-8 text-lg border-0 bg-transparent focus:ring-0 focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-white"
                  disabled={dashboardState.isGenerating}
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-2 h-12 w-12 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 hover:from-orange-600 hover:via-yellow-600 hover:to-orange-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!dashboardState.inputValue.trim() || dashboardState.isGenerating}
                >
                  {dashboardState.isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </form>
            
            {/* Sugestões */}
            <div className="mt-6">
              <p className="text-gray-200 text-sm mb-4">
                {t("ai.suggestions")}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  "Bolo de Chocolate",
                  "Lasanha Vegana", 
                  "Sushi Caseiro",
                  "Pizza Margherita",
                  "Smoothie Detox"
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={dashboardState.isGenerating}
                    className="rounded-full border-orange-400 dark:border-orange-500 text-orange-600 dark:text-orange-300 bg-white/90 dark:bg-gray-800/90 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-500 dark:hover:border-orange-400 hover:text-orange-700 dark:hover:text-orange-200 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 py-16">
          {/* Main Features Section */}
          <MainFeaturesSection />
        </div>
      </div>

      {/* Modal do Recipe Card */}
      {dashboardState.isModalOpen && dashboardState.generatedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay escuro */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Receita Gerada
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseModal}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Conteúdo do Modal */}
            <div className="p-6">
              <SimpleRecipeCard recipe={dashboardState.generatedRecipe} />
              
              {/* Botões de Ação */}
              <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  className="px-6 py-2"
                >
                  Fechar
                </Button>
                <Button
                  onClick={handleSaveRecipe}
                  disabled={dashboardState.isSaving}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {dashboardState.isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Receita
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
