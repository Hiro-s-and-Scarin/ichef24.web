"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { X, Save, ChefHat, Mic, Send, Sparkles, Bot, Crown, Wand2, Leaf, Timer, Users } from "lucide-react"

interface EditRecipeAIModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (recipe: any) => void
  recipe: any
}

interface ChatMessage {
  type: 'user' | 'ai'
  message: string
  timestamp: string
  suggestions?: string[]
}

interface GeneratedRecipe {
  title: string
  description: string
  time: string
  servings: string
  difficulty: string
  ingredients: string[]
  instructions: string[]
  image: string
}

// Estado consolidado para o modal AI de editar receita
interface EditRecipeAIModalState {
  isGenerating: boolean
  generatedRecipe: GeneratedRecipe | null
  chatMessages: ChatMessage[]
  chatInput: string
  showPreferences: boolean
  improvementType: string
  cookingTime: string
}

export function EditRecipeAIModal({ isOpen, onClose, onSave, recipe }: EditRecipeAIModalProps) {
  const { t } = useTranslation();
  
  // Estado consolidado
  const [modalState, setModalState] = useState<EditRecipeAIModalState>({
    isGenerating: false,
    generatedRecipe: null,
    chatMessages: [
      { 
        type: 'ai', 
        message: `Olá! Como posso melhorar a receita "${recipe?.title || 'sua receita'}"?`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestions: []
      }
    ],
    chatInput: "",
    showPreferences: false,
    improvementType: "",
    cookingTime: ""
  })

  // Desestruturação para facilitar o uso
  const { isGenerating, generatedRecipe, chatMessages, chatInput, showPreferences, improvementType, cookingTime } = modalState

  // Função helper para atualizar estado
  const updateModalState = (updates: Partial<EditRecipeAIModalState>) => {
    setModalState(prev => ({ ...prev, ...updates }))
  }

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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = `Ótima ideia! Vou ajudar você a melhorar a receita "${recipe?.title}". Aqui estão minhas sugestões!`
      updateModalState({
        chatMessages: [...chatMessages, { 
          type: 'ai', 
          message: aiResponse,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          suggestions: []
        }],
        isGenerating: false
      })
    }, 2000)
  }

  const handleQuickSuggestion = (suggestion: string) => {
    updateModalState({ chatInput: suggestion })
  }

  const generateWithAI = async () => {
    updateModalState({ isGenerating: true })

    setTimeout(() => {
      const newGeneratedRecipe: GeneratedRecipe = {
        title: "Receita Melhorada por IA",
        description: "Uma versão melhorada da sua receita com técnicas avançadas.",
        time: "30 minutos",
        servings: "4 pessoas",
        difficulty: "Médio",
        ingredients: [
          "Ingredientes principais",
          "Temperos especiais",
          "Técnicas avançadas"
        ],
        instructions: [
          "Prepare os ingredientes",
          "Aplique as técnicas",
          "Finalize com toque especial"
        ],
        image: "/placeholder.jpg"
      }
      
      updateModalState({
        generatedRecipe: newGeneratedRecipe,
        isGenerating: false
      })
    }, 3000)
  }



  const handleSave = () => {
    if (generatedRecipe) {
      const recipe = {
        id: Date.now(),
        ...generatedRecipe,
        tags: [t('ai.tag'), t('ai.improved'), t('recipe.tags.gourmet')],
        rating: 5,
        date: t('common.now'),
      }
      onSave(recipe)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] overflow-y-auto bg-gradient-to-br from-white via-orange-50 to-yellow-50 dark:from-black dark:via-gray-900 dark:to-black border-2 border-orange-200 dark:border-gray-600 text-gray-900 dark:text-white shadow-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-orange-100/50 [&::-webkit-scrollbar-track]:dark:bg-gray-700/50 [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-orange-400 [&::-webkit-scrollbar-thumb]:to-yellow-400 [&::-webkit-scrollbar-thumb]:dark:from-orange-500 [&::-webkit-scrollbar-thumb]:dark:to-yellow-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-orange-500 [&::-webkit-scrollbar-thumb]:hover:to-yellow-500 [&::-webkit-scrollbar-thumb]:dark:hover:from-orange-400 [&::-webkit-scrollbar-thumb]:dark:hover:to-yellow-400">
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
                <p className="text-sm text-gray-600 dark:text-gray-300">Melhorador de Receitas com IA</p>
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
                    <p className="text-sm text-orange-600 dark:text-orange-400">IA Culinária</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 dark:text-green-400">Online</span>
                  </div>
                </div>

              {/* Messages - Scrollable Area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 my-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-orange-100/50 [&::-webkit-scrollbar-track]:dark:bg-gray-800/50 [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-orange-400 [&::-webkit-scrollbar-thumb]:to-yellow-400 [&::-webkit-scrollbar-thumb]:dark:from-orange-500 [&::-webkit-scrollbar-thumb]:dark:to-yellow-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-orange-500 [&::-webkit-scrollbar-thumb]:hover:to-yellow-500 [&::-webkit-scrollbar-thumb]:dark:hover:from-orange-400 [&::-webkit-scrollbar-thumb]:dark:hover:to-yellow-400">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] relative ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 text-white shadow-orange-500/30' 
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-orange-200 dark:border-gray-500 shadow-lg'
                    } rounded-2xl p-4 transform transition-all duration-300 hover:scale-105`}>
                        
                      <div className="flex items-center gap-2 mb-3">
                          {message.type === 'ai' && (
                          <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                            <Sparkles className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                          <span className="text-sm font-bold opacity-90">
                            {message.type === 'ai' ? 'iChef24 AI' : 'Você'}
                            </span>
                          <span className="text-sm opacity-70 ml-2">{message.timestamp}</span>
                        </div>
                        </div>

                      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-orange-100/50 [&::-webkit-scrollbar-track]:dark:bg-gray-800/50 [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-orange-400 [&::-webkit-scrollbar-thumb]:to-yellow-400 [&::-webkit-scrollbar-thumb]:dark:from-orange-500 [&::-webkit-scrollbar-thumb]:dark:to-yellow-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-orange-500 [&::-webkit-scrollbar-thumb]:hover:to-yellow-500 [&::-webkit-scrollbar-thumb]:dark:hover:from-orange-400 [&::-webkit-scrollbar-thumb]:dark:hover:to-yellow-400">
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
                    <div className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-gray-500 rounded-2xl p-4 shadow-lg max-w-[85%]">
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
                            Melhorando sua receita...
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
                      placeholder="Peça ajuda para melhorar a receita..."
                      className="relative h-12 pr-16 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 shadow-lg text-sm group-hover:shadow-xl group-hover:scale-[1.02]"
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
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Melhorias</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Tipo de Melhoria
                    </label>
                    <Input
                      value={improvementType}
                      onChange={(e) => updateModalState({ improvementType: e.target.value })}
                      placeholder="Ex: Sabor, Textura..."
                      className="h-10 text-sm bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Tempo Desejado
                    </label>
                    <Input
                      value={cookingTime}
                      onChange={(e) => updateModalState({ cookingTime: e.target.value })}
                      placeholder="Ex: 20 minutos"
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
                  <div className="w-3 h-1 bg-green-500 rounded-full m-1"></div>
                </div>
                <span className="font-semibold">Melhorando receita...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                <span className="font-semibold">Melhorar Receita com IA</span>
              </div>
            )}
          </Button>

        {/* Save Button */}
          {generatedRecipe && (
          <Button
            onClick={handleSave}
              className="w-full h-14 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-white border-0 font-bold text-base rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group mt-4"
          >
              <Save className="w-5 h-5 mr-3 group-hover:animate-pulse" />
              <span className="font-semibold">Salvar Receita Melhorada</span>
          </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 