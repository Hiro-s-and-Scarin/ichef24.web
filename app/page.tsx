"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ChefHat, Send, Sparkles, User, Crown, ArrowRight, Clock, Users, Star } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTranslation } from "react-i18next"

export default function HomePage() {
  const { t } = useTranslation()
  const [prompt, setPrompt] = useState("")
  const [mode, setMode] = useState<"amateur" | "professional">("amateur")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      // Aqui você pode implementar a lógica de geração de receita
      console.log("Gerando receita com prompt:", prompt)
    }
  }

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

          {/* Input Form */}
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Peça ao iChef24 para criar uma receita..."
                  className="w-full h-12 px-4 pr-12 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1 h-10 w-10 bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  type="button"
                  variant={mode === "amateur" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("amateur")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm ${
                    mode === "amateur"
                      ? "bg-orange-600 text-white border-orange-600"
                      : "text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  }`}
                >
                  <User className="w-3 h-3" />
                  Amador
                </Button>
                <Button
                  type="button"
                  variant={mode === "professional" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("professional")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm ${
                    mode === "professional"
                      ? "bg-orange-600 text-white border-orange-600"
                      : "text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  }`}
                >
                  <Crown className="w-3 h-3" />
                  Profissional
                </Button>
              </div>
            </form>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>30s setup</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>10K+ usuários</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.9 avaliação</span>
            </div>
          </div>
        </div>



        {/* Features Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <Card className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">IA Avançada</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Algoritmos inteligentes que criam receitas personalizadas para você
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Receitas Únicas</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Milhares de combinações baseadas em seus ingredientes disponíveis
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Fácil de Usar</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Interface intuitiva que qualquer pessoa pode usar
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0 font-medium"
          >
            Começar Agora
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
