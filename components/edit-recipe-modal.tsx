"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, X, Save, ChefHat, Clock, Heart, Star, Palette, Utensils, Send, Sparkles, Bot, ChevronDown } from "lucide-react"
import { allRecipeTags } from "@/lib/recipe-tags"
import { useTranslation } from "react-i18next"

interface Recipe {
  id: number
  title: string
  description: string
  image: string
  time: string
  servings: string
  difficulty: string
  tags: string[]
  rating: number
  ingredients: string[]
  instructions: string[]
  nutrition?: {
    calories: number
    protein: string
    carbs: string
    fat: string
  }
}

interface ChatMessage {
  type: 'user' | 'ai'
  message: string
  timestamp: string
  suggestions?: string[]
}

interface EditRecipeModalProps {
  recipe: Recipe | null
  isOpen: boolean
  onClose: () => void
  onSave: (recipe: Recipe) => void
}

// Estado consolidado para o modal de editar receita
interface EditRecipeModalState {
  formData: Recipe | null
  newTag: string
  isTagSelectOpen: boolean
  chatMessages: ChatMessage[]
  chatInput: string
  isGenerating: boolean
}

export function EditRecipeModal({ recipe, isOpen, onClose, onSave }: EditRecipeModalProps) {
  const { t } = useTranslation()
  // Estado consolidado
  const [modalState, setModalState] = useState<EditRecipeModalState>({
    formData: recipe,
    newTag: "",
    isTagSelectOpen: false,
    chatMessages: [
      {
        id: "1",
        sender: "assistant",
        content: "Olá! Como posso ajudar a melhorar esta receita?",
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }
    ],
    chatInput: "",
    isGenerating: false,
  })

  // Desestruturação para facilitar o uso
  const { formData, newTag, isTagSelectOpen, chatMessages, chatInput, isGenerating } = modalState

  // Função helper para atualizar estado
  const updateModalState = (updates: Partial<EditRecipeModalState>) => {
    setModalState(prev => ({ ...prev, ...updates }))
  }

  // Fechar select quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isTagSelectOpen && !target.closest('.tag-select-container')) {
        updateModalState({ isTagSelectOpen: false })
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isTagSelectOpen])


  useEffect(() => {
    if (recipe) {
      updateModalState({ formData: recipe })
    }
  }, [recipe])

  if (!recipe || !formData) return null

  const handleInputChange = (field: string, value: string) => {
    updateModalState({
      formData: formData ? { ...formData, [field]: value } : null
    })
  }

  const addIngredient = () => {
    updateModalState({
      formData: formData ? { ...formData, ingredients: [...formData.ingredients, ""] } : null
    })
  }

  const removeIngredient = (index: number) => {
    updateModalState({
      formData: formData ? {
        ...formData,
        ingredients: formData.ingredients.filter((_, i) => i !== index),
      } : null
    })
  }

  const updateIngredient = (index: number, value: string) => {
    updateModalState({
      formData: formData ? {
        ...formData,
        ingredients: formData.ingredients.map((item, i) => (i === index ? value : item)),
      } : null
    })
  }

  const addInstruction = () => {
    updateModalState({
      formData: formData ? { ...formData, instructions: [...formData.instructions, ""] } : null
    })
  }

  const removeInstruction = (index: number) => {
    updateModalState({
      formData: formData ? {
        ...formData,
        instructions: formData.instructions.filter((_, i) => i !== index),
      } : null
    })
  }

  const updateInstruction = (index: number, value: string) => {
    updateModalState({
      formData: formData ? {
        ...formData,
        instructions: formData.instructions.map((item, i) => (i === index ? value : item)),
      } : null
    })
  }

  const addTag = () => {
    if (newTag.trim() && formData && !formData.tags.includes(newTag.trim())) {
      updateModalState({
        formData: { ...formData, tags: [...formData.tags, newTag.trim()] },
        newTag: ""
      })
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateModalState({
      formData: formData ? {
        ...formData,
        tags: formData.tags.filter((tag) => tag !== tagToRemove),
      } : null
    })
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
      const aiResponse = `Que tipo de melhoria você quer fazer na receita?`
      updateModalState({
        chatMessages: [...chatMessages, { 
          type: 'ai', 
          message: aiResponse,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          suggestions: ['Reduzir calorias', 'Menos sal', 'Mais sabor', 'Vegetariana']
        }],
        isGenerating: false
      })
    }, 2000)
  }

  const handleQuickSuggestion = (suggestion: string) => {
    updateModalState({ chatInput: suggestion })
  }

  const handleSave = () => {
    if (formData) {
      onSave(formData)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-orange-50 to-yellow-50 dark:from-black dark:via-gray-900 dark:to-black border-2 border-orange-200 dark:border-gray-600 text-gray-900 dark:text-white shadow-2xl">
        <DialogHeader className="pb-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-700 bg-clip-text text-transparent">
                  {t('form.edit.recipe')}
          </DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('form.edit.subtitle')}</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Manual Edit Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Recipe Form */}
            <div className="lg:col-span-2 space-y-4">
          {/* Basic Info */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-orange-200 dark:border-gray-600 shadow-xl">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ChefHat className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('form.basic.info')}</h3>
                  </div>
                  
                  <div className="space-y-3">
            <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-orange-500" />
                        {t('form.recipe.name')}
              </Label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder={t('form.recipe.name.placeholder')}
                        className="h-10 text-base bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 shadow-sm"
              />
            </div>

            <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-orange-500" />
                        {t('form.description')}
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descreva a receita..."
                        className="min-h-[80px] text-base bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 shadow-sm"
              />
            </div>

                    <div className="grid md:grid-cols-3 gap-3">
              <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                          Tempo
                </Label>
                <Input
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  placeholder="Ex: 45 minutos"
                          className="h-10 text-base bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-orange-500" />
                          {t('form.servings')}
                </Label>
                <Input
                  value={formData.servings}
                  onChange={(e) => handleInputChange("servings", e.target.value)}
                  placeholder="Ex: 4 pessoas"
                          className="h-10 text-base bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 shadow-sm"
                />
              </div>
            <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-orange-500" />
                          {t('form.difficulty')}
              </Label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange("difficulty", e.target.value)}
                          className="w-full h-10 text-base bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 shadow-sm"
              >
                <option value="Fácil">Fácil</option>
                <option value="Médio">Médio</option>
                <option value="Difícil">Difícil</option>
              </select>
                      </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-orange-500" />
                        {t('form.tags')}
              </Label>
                      
                      {/* Tag Select */}
                      <div className="relative tag-select-container">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => updateModalState({ isTagSelectOpen: !isTagSelectOpen })}
                          className="w-full justify-between bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 shadow-sm"
                        >
                          <span className="text-left">{t('form.tags.select')}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${isTagSelectOpen ? 'rotate-180' : ''}`} />
                        </Button>
                        
                        {isTagSelectOpen && (
                          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {allRecipeTags.map((tag) => (
                              <button
                                key={tag}
                                onClick={() => {
                                  if (formData && !formData.tags.includes(tag)) {
                                    updateModalState({
                                      formData: { ...formData, tags: [...formData.tags, tag] },
                                      isTagSelectOpen: false
                                    })
                                  } else {
                                    updateModalState({ isTagSelectOpen: false })
                                  }
                                }}
                                className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                  formData.tags.includes(tag) 
                                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' 
                                    : 'text-gray-900 dark:text-white'
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Manual Tag Input */}
                      <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                                          onChange={(e) => updateModalState({ newTag: e.target.value })}
                          placeholder={t('form.tags.custom.placeholder')}
                          className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 shadow-sm"
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                        <Button onClick={addTag} variant="outline" className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg shadow-sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
                      
                      {/* Selected Tags */}
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700 rounded-lg">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
                  </div>
                </CardContent>
              </Card>

            {/* Ingredients */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-orange-200 dark:border-gray-600 shadow-xl">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Utensils className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('form.ingredients')}</h3>
                  </div>
                  
                  <div className="space-y-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder="Ex: 2 xícaras de farinha"
                          className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 shadow-sm"
                  />
                  {formData.ingredients.length > 1 && (
                    <Button
                      onClick={() => removeIngredient(index)}
                      variant="outline"
                      size="icon"
                            className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
                    <Button 
                      onClick={addIngredient} 
                      variant="outline" 
                      className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg shadow-sm"
                    >
                <Plus className="w-4 h-4 mr-2" />
                      {t('form.ingredients.add')}
              </Button>
            </div>
                </CardContent>
              </Card>

            {/* Instructions */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-orange-200 dark:border-gray-600 shadow-xl">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ChefHat className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('form.instructions')}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-7 h-7 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                          {index + 1}
                  </div>
                  <Textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder="Descreva este passo..."
                          className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 shadow-sm"
                    rows={2}
                  />
                  {formData.instructions.length > 1 && (
                    <Button
                      onClick={() => removeInstruction(index)}
                      variant="outline"
                      size="icon"
                            className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                onClick={addInstruction}
                variant="outline"
                      className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                      {t('form.instructions.add')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - AI Chat Assistant */}
            <div className="space-y-4">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Assistente IA</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Peça ajuda para melhorar sua receita</p>
              </div>

              {/* Chat Container */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-700 shadow-xl">
                <CardContent className="p-4 space-y-4">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-purple-200/30 dark:border-gray-600/30">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">iChef24 AI</h4>
                        <p className="text-xs text-purple-600 dark:text-purple-400">IA Culinária</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-purple-100/50 [&::-webkit-scrollbar-track]:dark:bg-gray-800/50 [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-purple-400 [&::-webkit-scrollbar-thumb]:to-pink-400 [&::-webkit-scrollbar-thumb]:dark:from-purple-500 [&::-webkit-scrollbar-thumb]:dark:to-pink-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-purple-500 [&::-webkit-scrollbar-thumb]:hover:to-pink-500 [&::-webkit-scrollbar-thumb]:dark:hover:from-purple-400 [&::-webkit-scrollbar-thumb]:dark:hover:to-pink-400">
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] relative ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white shadow-purple-500/30' 
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-purple-200 dark:border-gray-500 shadow-md'
                        } rounded-xl p-3 transform transition-all duration-300 hover:scale-105`}>
                          
                          <div className="flex items-center gap-2 mb-2">
                            {message.type === 'ai' && (
                              <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                                <Sparkles className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                            <div className="flex-1">
                              <span className="text-xs font-bold opacity-90">
                                {message.type === 'ai' ? 'iChef24 AI' : 'Você'}
                              </span>
                              <span className="text-xs opacity-70 ml-2">{message.timestamp}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs leading-relaxed">{message.message}</p>
                            
                            {message.suggestions && (
                              <div className="flex flex-wrap gap-1 pt-2 border-t border-white/20 dark:border-gray-600/30">
                                {message.suggestions.map((suggestion, i) => (
                                  <Button
                                    key={i}
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleQuickSuggestion(suggestion)}
                                    className="text-xs border border-white/30 text-white hover:bg-white/20 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/20 rounded-full px-2 py-1 font-medium transition-all duration-300 hover:scale-105"
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
                        <div className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-gray-500 rounded-xl p-3 shadow-md max-w-[85%]">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                              <Sparkles className="w-3 h-3 text-white animate-spin" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-1 mb-1">
                                <span className="text-xs font-bold text-gray-900 dark:text-white">iChef24 AI</span>
                                <div className="flex space-x-1">
                                  <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce"></div>
                                  <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                                  <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                Pensando em melhorias...
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="pt-3 border-t border-purple-200/30 dark:border-gray-600/30">
                    <form onSubmit={handleChatSubmit} className="space-y-2">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                        <Input
                          value={chatInput}
                          onChange={(e) => updateModalState({ chatInput: e.target.value })}
                          placeholder="Peça ajuda para melhorar a receita..."
                          className="relative h-10 pr-16 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 shadow-md text-sm group-hover:shadow-lg group-hover:scale-[1.02]"
                          disabled={isGenerating}
                        />
                        <div className="absolute right-1 top-1 flex gap-1">
                          <Button
                            type="submit"
                            size="icon"
                            disabled={!chatInput.trim() || isGenerating}
                            className="h-8 w-8 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-pink-500 hover:via-purple-500 hover:to-pink-600 text-white rounded-md shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-110"
                          >
                            <Send className="w-3 h-3" />
              </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Save Button */}
            <Button
              onClick={handleSave}
            className="w-full h-12 bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0 font-bold text-base rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group"
            >
            <Save className="w-4 h-4 mr-3 group-hover:animate-pulse" />
                          {t('form.save.changes')}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
