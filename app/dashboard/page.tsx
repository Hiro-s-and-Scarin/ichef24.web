"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ChefHat, Send, Sparkles, User, Crown, ArrowRight, Clock, Users, Star, Bot, X } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/contexts/auth-context"
import { useCreateChatSession, useCreateChatMessage } from "@/network/hooks/chat/useChat"
import { useGenerateRecipeWithAI } from "@/network/hooks/recipes/useRecipes"
import { useCurrentUser } from "@/network/hooks/users/useUsers"
import { toast } from "sonner"
import { CreateChatSessionData, CreateChatMessageData } from "@/types/chat"
import { AIRecipeRequest } from "@/types/recipe"
import { useTokenCapture } from "@/network/hooks/auth/useTokenCapture"

interface ChatFormData {
  prompt: string
}

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: string
}

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

  const [mode, setMode] = useState<"amateur" | "professional">("amateur")
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [firstMessage, setFirstMessage] = useState<string>("") // Para controlar se é primeira mensagem ou modificação

  const { data: currentUser } = useCurrentUser()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChatFormData>()

  // Captura o token da URL se existir
  useTokenCapture()

  // Hooks para chat e IA
  const createChatSession = useCreateChatSession()
  const createChatMessage = useCreateChatMessage()
  const generateRecipeWithAI = useGenerateRecipeWithAI()

  const handleChatSubmit = async (data: ChatFormData) => {
    if (!data.prompt.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: data.prompt,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }

    // Adicionar mensagem do usuário na tela imediatamente
    setChatMessages(prev => [...prev, userMessage])
    setIsGenerating(true)
    reset()

    try {
      // 1. Se não há sessão ativa, criar uma nova
      if (!currentSessionId) {
        const sessionData: CreateChatSessionData = {
          title: `Chat sobre: ${data.prompt.substring(0, 50)}...`,
          ai_model_version: mode === "professional" ? "gpt-4" : "gpt-3.5-turbo"
        }
        
        const newSession = await createChatSession.mutateAsync(sessionData)
        setCurrentSessionId(String(newSession.id))
      }

      // 2. Salvar mensagem do usuário no backend
      if (currentSessionId) {
        const userMessageData: CreateChatMessageData = {
          message_type: 'USER',
          content: data.prompt,
          tokens_used: Math.ceil(data.prompt.length / 4),
          metadata: { mode, timestamp: new Date().toISOString() }
        }

        await createChatMessage.mutateAsync({
          sessionId: currentSessionId,
          body: userMessageData
        })
      }

      // 3. Fazer requisição para OpenAI e gerar receita
      const aiRequest: AIRecipeRequest = {
        first_message: data.prompt
      }

      const generatedRecipe = await generateRecipeWithAI.mutateAsync(aiRequest)

      // 4. Criar mensagem da IA com a resposta
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Receita ${!firstMessage ? 'criada' : 'modificada'} com sucesso! "${generatedRecipe.title}" - ${generatedRecipe.description}`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }

      // 5. Adicionar mensagem da IA na tela
      setChatMessages(prev => [...prev, aiMessage])

      // 6. Salvar mensagem da IA no backend (com referência à receita gerada)
      if (currentSessionId) {
        const aiMessageData: CreateChatMessageData = {
          message_type: 'AI',
          content: aiMessage.content,
          tokens_used: Math.ceil(aiMessage.content.length / 4),
          recipe_generated_id: String(generatedRecipe.id), // Referência à receita criada
          metadata: { 
            mode, 
            recipe_id: String(generatedRecipe.id),
            is_first_message: !firstMessage,
            timestamp: new Date().toISOString() 
          }
        }

        await createChatMessage.mutateAsync({
          sessionId: currentSessionId,
          body: aiMessageData
        })
      }

      // 7. Atualizar estado para próximas mensagens
      if (!firstMessage) {
        setFirstMessage(data.prompt)
      }

      toast.success(`Receita ${!firstMessage ? 'criada' : 'modificada'} com sucesso!`)
      
    } catch (error) {
      console.error("Erro ao gerar receita:", error)
      toast.error("Erro ao gerar receita. Tente novamente.")
      
      // Adicionar mensagem de erro na tela
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Desculpe, ocorreu um erro ao gerar sua receita. Tente novamente.",
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
  }

  // Função para criar nova receita
  const handleNewRecipe = () => {
    setFirstMessage("") // Reset para primeira mensagem
    setChatMessages([{
      id: "welcome",
      type: 'ai',
      content: `Olá! Sou o iChef24 AI. Como posso ajudá-lo a criar uma receita hoje?

💡 **Como usar:**
• Primeira mensagem: Descreva a receita que quer criar
• Mensagens seguintes: Descreva as modificações que quer fazer

Exemplo: "Faça um bolo de chocolate" → "Torne-o mais doce" → "Adicione nozes"`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }])
  }

  const openChat = () => {
    if (!currentUser) {
      toast.error("Faça login para usar o chat de IA")
      return
    }
    setShowChat(true)
    handleNewRecipe()
  }

  const closeChat = () => {
    setShowChat(false)
    setChatMessages([])
    setCurrentSessionId(null)
    setFirstMessage("") // Reset para primeira mensagem
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
            <form onSubmit={handleSubmit(handleChatSubmit)} className="space-y-4">
              <div className="relative">
                <Input
                  {...register("prompt", { required: "Digite sua solicitação" })}
                  placeholder="Ex: Faça um bolo de chocolate, Crie um risotto italiano..."
                  className="w-full h-12 px-4 pr-12 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isGenerating}
                  className="absolute right-1 top-1 h-10 w-10 bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 rounded-lg"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errors.prompt && (
                <p className="text-red-500 text-sm text-left">{errors.prompt.message}</p>
              )}

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

              {/* Chat Button */}
              <Button
                type="button"
                onClick={openChat}
                variant="outline"
                className="w-full border-2 border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-900/20"
              >
                <Bot className="w-4 h-4 mr-2" />
                Abrir Chat com IA
              </Button>
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

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">iChef24 AI Chat</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {!firstMessage ? 'Criando nova receita' : 'Modificando receita'} • Modo: {mode === "amateur" ? "Amador" : "Profissional"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeChat}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.type === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator enquanto gera resposta */}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {!firstMessage ? 'Criando sua receita...' : 'Modificando sua receita...'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              {/* Toggle Buttons */}
              <div className="flex gap-2 mb-3">
                <Button
                  type="button"
                  variant={!firstMessage ? "default" : "outline"}
                  size="sm"
                  onClick={handleNewRecipe}
                  className="flex-1"
                >
                  ✨ Nova Receita
                </Button>
                <Button
                  type="button"
                  variant={firstMessage ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  disabled={!firstMessage}
                >
                  🔧 Modificar Receita
                </Button>
              </div>
              
              <form onSubmit={handleSubmit(handleChatSubmit)} className="flex gap-2">
                <Input
                  {...register("prompt", { required: "Digite sua mensagem" })}
                  placeholder={!firstMessage ? "Descreva sua receita dos sonhos..." : "Descreva o que você quer modificar..."}
                  className="flex-1"
                  disabled={isGenerating}
                />
                <Button
                  type="submit"
                  disabled={isGenerating}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}