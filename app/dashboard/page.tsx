"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChefHat, Sparkles, User, ArrowRight, Send, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useTokenCapture } from "@/network/hooks/auth/useTokenCapture"
import { CreateRecipeAIModal } from "@/components/forms/create-recipe-ai-modal"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/config/query-keys"
import { MainFeaturesSection } from "@/components/dashboard/main-features-section"

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

function HomePageContent() {
  const { t, ready } = useTranslation()
  const queryClient = useQueryClient()

  const [dashboardState, setDashboardState] = useState({
    isCreateAIModalOpen: false,
    isChatActive: false,
    inputValue: ""
  })

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

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!dashboardState.inputValue.trim()) return
    
    // Ativar o chat e abrir o modal com a mensagem
    setDashboardState(prev => ({ 
      ...prev, 
      isCreateAIModalOpen: true,
      isChatActive: true
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDashboardState(prev => ({ ...prev, inputValue: e.target.value }))
  }

  const closeChatModal = () => {
    setDashboardState(prev => ({ 
      ...prev, 
      isCreateAIModalOpen: false, 
      isChatActive: false,
      inputValue: ""
    }))
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
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-12">
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
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-2 h-12 w-12 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 hover:from-orange-600 hover:via-yellow-600 hover:to-orange-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                    disabled={!dashboardState.inputValue.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </form>
              
              {/* Sugestões */}
              <div className="mt-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
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
                      onClick={() => {
                        setDashboardState(prev => ({ ...prev, inputValue: suggestion }))
                      }}
                      className="rounded-full border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Features Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
            <Card className="bg-white/90 dark:bg-gray-800/90 border border-orange-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl backdrop-blur-sm">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t("dashboard.features.ai.title")}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("dashboard.features.ai.desc")}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-gray-800/90 border border-orange-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl backdrop-blur-sm">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t("dashboard.features.recipes.title")}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("dashboard.features.recipes.desc")}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-gray-800/90 border border-orange-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl backdrop-blur-sm">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t("dashboard.features.community.title")}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("dashboard.features.community.desc")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Features Section */}
          <MainFeaturesSection />
        </div>
      </div>

      {/* Modal AI */}
      <CreateRecipeAIModal
        isOpen={dashboardState.isCreateAIModalOpen}
        onClose={closeChatModal}
        onSave={(recipe) => {
          queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user, exact: false })
          queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my, exact: false })
          queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all, exact: false })
          toast.success(t("success.recipe.created"))
        }}
        initialMessage={dashboardState.inputValue}
      />
    </div>
  )
}
