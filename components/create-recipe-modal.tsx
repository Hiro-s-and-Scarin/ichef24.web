"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Save, ChefHat, Clock, Heart, Star, Palette, ChevronDown } from "lucide-react"
import { allRecipeTags } from "@/lib/recipe-tags"
import { useTranslation } from "react-i18next"

interface CreateRecipeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (recipe: any) => void
}

export function CreateRecipeModal({ isOpen, onClose, onSave }: CreateRecipeModalProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
    servings: "",
    difficulty: "Médio",
    tags: [] as string[],
    ingredients: [""],
    instructions: [""],
  })
  const [newTag, setNewTag] = useState("")
  const [isTagSelectOpen, setIsTagSelectOpen] = useState(false)

  // Fechar select quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isTagSelectOpen && !target.closest('.tag-select-container')) {
        setIsTagSelectOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isTagSelectOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addIngredient = () => {
    setFormData((prev) => ({ ...prev, ingredients: [...prev.ingredients, ""] }))
  }

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
  }

  const updateIngredient = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((item, i) => (i === index ? value : item)),
    }))
  }

  const addInstruction = () => {
    setFormData((prev) => ({ ...prev, instructions: [...prev.instructions, ""] }))
  }

  const removeInstruction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }))
  }

  const updateInstruction = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((item, i) => (i === index ? value : item)),
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSave = () => {
    const recipe = {
      id: Date.now(),
      ...formData,
      image: "/placeholder.svg",
      rating: 5,
      date: t('common.now'),
    }
    onSave(recipe)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-white dark:bg-black border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-orange-500" />
                         {t('form.create.recipe')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-orange-500" />
                                 {t('form.recipe.name')}
              </Label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                                 placeholder={t('form.recipe.name.placeholder')}
                className="h-12 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-orange-500" />
                                 {t('form.description')}
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                                 placeholder={t('form.description.placeholder')}
                className="min-h-[100px] text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                                     {t('form.time')}
                </Label>
                <Input
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                                     placeholder={t('form.time.placeholder')}
                  className="h-12 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-orange-500" />
                                     {t('form.servings')}
                </Label>
                <Input
                  value={formData.servings}
                  onChange={(e) => handleInputChange("servings", e.target.value)}
                                     placeholder={t('form.servings.placeholder')}
                  className="h-12 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-orange-500" />
                                 {t('form.difficulty')}
              </Label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange("difficulty", e.target.value)}
                className="w-full h-12 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
              >
                                 <option value={t('form.difficulty.easy')}>{t('form.difficulty.easy')}</option>
                 <option value={t('form.difficulty.medium')}>{t('form.difficulty.medium')}</option>
                 <option value={t('form.difficulty.hard')}>{t('form.difficulty.hard')}</option>
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-orange-500" />
                                 {t('form.tags')}
              </Label>
              
              {/* Tag Select */}
              <div className="relative tag-select-container">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsTagSelectOpen(!isTagSelectOpen)}
                  className="w-full justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                >
                                     <span className="text-left">{t('form.tags.select')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isTagSelectOpen ? 'rotate-180' : ''}`} />
                </Button>
                
                {isTagSelectOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {allRecipeTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          if (!formData.tags.includes(tag)) {
                            setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))
                          }
                          setIsTagSelectOpen(false)
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
              <div className="flex gap-2 mb-3">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                                     placeholder={t('form.custom.tag')}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} variant="outline" className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
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

            {/* Ingredients */}
            <div className="space-y-2">
              <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-orange-500" />
                                 {t('form.ingredients')}
              </Label>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                                         placeholder={t('form.ingredients.placeholder')}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                  />
                  {formData.ingredients.length > 1 && (
                    <Button
                      onClick={() => removeIngredient(index)}
                      variant="outline"
                      size="icon"
                      className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button onClick={addIngredient} variant="outline" className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
                                 {t('form.ingredients.add')}
              </Button>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-orange-500" />
                                 {t('form.instructions')}
              </Label>
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-2">
                    {index + 1}
                  </div>
                  <Textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                                         placeholder={t('form.instructions.placeholder')}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                    rows={2}
                  />
                  {formData.instructions.length > 1 && (
                    <Button
                      onClick={() => removeInstruction(index)}
                      variant="outline"
                      size="icon"
                      className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mt-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                onClick={addInstruction}
                variant="outline"
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                                 {t('form.instructions.add')}
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleSave}
              className="h-12 px-8 bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0 font-medium text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="w-5 h-5 mr-2" />
                             {t('form.create.recipe')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
