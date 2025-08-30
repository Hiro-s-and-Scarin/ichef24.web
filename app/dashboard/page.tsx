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
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [dashboardState, setDashboardState] = useState({
    isCreateAIModalOpen: false,
    isChatActive: false,
    inputValue: ""
  })

  useTokenCapture()

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Hero Text */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                <ChefHat className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600">
                  iChef24
                </span>
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300">
              {t("home.subtitle")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t("home.description")}
            </p>
          </div>

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


      </div>

      {/* Modal AI */}
      <CreateRecipeAIModal
        isOpen={dashboardState.isCreateAIModalOpen}
        onClose={closeChatModal}
        onSave={(recipe) => {
          queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user, exact: false })
          queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my, exact: false })
          queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all, exact: false })
          toast.success("Receita criada com sucesso!")
        }}
        initialMessage={dashboardState.inputValue}
      />
    </div>
  )
}