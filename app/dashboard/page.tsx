"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChefHat, Sparkles, User, ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useTokenCapture } from "@/network/hooks/auth/useTokenCapture"
import { CreateRecipeAIModal } from "@/components/forms/create-recipe-ai-modal"

export default function HomePage() {
  const { t } = useTranslation()
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{t('dashboard.loading')}</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}

function HomePageContent() {
  const { t } = useTranslation()

  const [modalState, setModalState] = useState({
    isCreateAIModalOpen: false
  })

  useTokenCapture()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Hero Text */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
              {t('home.subtitle').split(' ').slice(0, 2).join(' ')}{" "}
              <span className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400">
                {t('home.subtitle').split(' ').slice(2).join(' ')}
                <ChefHat className="w-8 h-8" />
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              {t('home.description')}
            </p>
          </div>

          {/* Botão para abrir Modal AI */}
          <div className="max-w-xl mx-auto">
                <Button
              onClick={() => setModalState(prev => ({ ...prev, isCreateAIModalOpen: true }))}
              className="w-full h-16 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 hover:from-yellow-500 hover:via-orange-500 hover:to-orange-600 text-white border-0 font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center justify-center gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <span className="font-bold">{t('dashboard.ai.button')}</span>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
              </div>
                </Button>
            
            {/* Info Text */}
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
              {t('dashboard.ai.tip')}
            </p>
          </div>

        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <Card className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('dashboard.features.ai.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {t('dashboard.features.ai.desc')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('dashboard.features.recipes.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {t('dashboard.features.recipes.desc')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('dashboard.features.easy.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {t('dashboard.features.easy.desc')}
              </p>
            </CardContent>
          </Card>
        </div>


      </div>

      {/* Modal AI */}
      <CreateRecipeAIModal
        isOpen={modalState.isCreateAIModalOpen}
        onClose={() => setModalState(prev => ({ ...prev, isCreateAIModalOpen: false }))}
        onSave={(recipe) => {
          setModalState(prev => ({ ...prev, isCreateAIModalOpen: false }))
          toast.success("Receita criada com sucesso!")
        }}
      />
    </div>
  )
}