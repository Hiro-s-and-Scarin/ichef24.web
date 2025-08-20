"use client"

import { useState } from "react"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Save, ChefHat, Clock, ChevronDown } from "lucide-react"
import { allRecipeTags } from "@/lib/constants/recipe-tags"
import { useTranslation } from "react-i18next"
import { useCreateRecipe } from "@/network/hooks/recipes/useRecipes"
import { createRecipeSchema, CreateRecipeFormData } from "@/schemas/create-recipe.schema"
import { CreateRecipeData } from "@/types/recipe"

interface CreateRecipeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (recipe: CreateRecipeFormData) => void
}

export function CreateRecipeModal({ isOpen, onClose, onSave }: CreateRecipeModalProps) {
  const { t } = useTranslation()
  const [newTag, setNewTag] = useState("")
  const [isTagSelectOpen, setIsTagSelectOpen] = useState(false)

  const createRecipeMutation = useCreateRecipe()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<CreateRecipeFormData>({
    resolver: yupResolver(createRecipeSchema),
    defaultValues: {
      title: "",
      description: "",
      ingredients: [{ name: "", amount: "" }],
      steps: [{ step: 1, description: "" }],
      cooking_time: undefined,
      servings: undefined,
      difficulty_level: 3,
      cuisine_type: "",
      tags: [],
      image_url: "",
      is_ai_generated: false,
      ai_prompt: "",
      ai_model_version: "",
      is_public: true
    }
  })

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: "ingredients"
  })

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: "steps"
  })

  const watchedTags = watch("tags")

  const addIngredient = () => {
    appendIngredient({ name: "", amount: "" })
  }

  const addStep = () => {
    const nextStep = stepFields.length + 1
    appendStep({ step: nextStep, description: "" })
  }

  const addTag = () => {
    if (newTag.trim() && !watchedTags?.includes(newTag.trim())) {
      setValue("tags", [...(watchedTags || []), newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue("tags", watchedTags?.filter(tag => tag !== tagToRemove) || [])
  }

  const onSubmit = async (data: CreateRecipeFormData) => {
    try {
      // Garantir que os dados obrigatórios estejam presentes
      const recipeData: CreateRecipeData = {
        title: data.title,
        description: data.description,
        ingredients: data.ingredients || [],
        steps: data.steps || [],
        cooking_time: data.cooking_time,
        servings: data.servings,
        difficulty_level: data.difficulty_level,
        cuisine_type: data.cuisine_type || "",
        tags: data.tags?.filter(tag => tag !== undefined) || [],
        image_url: data.image_url,
        is_ai_generated: data.is_ai_generated,
        ai_prompt: data.ai_prompt,
        ai_model_version: data.ai_model_version,
        is_public: data.is_public
      }
      
      await createRecipeMutation.mutateAsync(recipeData)
      reset()
      onClose()
      if (onSave) onSave(data)
    } catch (error) {
      // Erro já tratado pelo hook
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-white dark:bg-black border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-orange-100/50 [&::-webkit-scrollbar-track]:dark:bg-gray-700/50 [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-orange-400 [&::-webkit-scrollbar-thumb]:to-yellow-400 [&::-webkit-scrollbar-thumb]:dark:from-orange-500 [&::-webkit-scrollbar-thumb]:dark:to-yellow-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-orange-500 [&::-webkit-scrollbar-thumb]:hover:to-yellow-500 [&::-webkit-scrollbar-thumb]:dark:hover:from-orange-400 [&::-webkit-scrollbar-thumb]:dark:hover:to-yellow-400">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-orange-500" />
            {t('form.create.recipe')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-orange-500" />
                {t('form.recipe.name')}
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t('form.recipe.name.placeholder')}
                    className="h-12 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                  />
                )}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-orange-500" />
                {t('form.description')}
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder={t('form.description.placeholder')}
                    className="min-h-[100px] text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                  />
                )}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  {t('form.time')} (minutos)
                </Label>
                <Controller
                  name="cooking_time"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="45"
                      className="h-12 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                    />
                  )}
                />
                {errors.cooking_time && (
                  <p className="text-red-500 text-sm">{errors.cooking_time.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-orange-500" />
                  {t('form.servings')}
                </Label>
                <Controller
                  name="servings"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="4"
                      className="h-12 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                    />
                  )}
                />
                {errors.servings && (
                  <p className="text-red-500 text-sm">{errors.servings.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-orange-500" />
                  {t('form.difficulty')}
                </Label>
                <Controller
                  name="difficulty_level"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value?.toString()}>
                      <SelectTrigger className="h-12 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors">
                        <SelectValue placeholder="Selecione a dificuldade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Muito Fácil</SelectItem>
                        <SelectItem value="2">Fácil</SelectItem>
                        <SelectItem value="3">Médio</SelectItem>
                        <SelectItem value="4">Difícil</SelectItem>
                        <SelectItem value="5">Muito Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.difficulty_level && (
                  <p className="text-red-500 text-sm">{errors.difficulty_level.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-orange-500" />
                Tipo de Cozinha
              </Label>
              <Controller
                name="cuisine_type"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Ex: Italiana, Brasileira, Asiática..."
                    className="h-12 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-orange-500" />
                URL da Imagem
              </Label>
              <Controller
                name="image_url"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="https://example.com/image.jpg"
                    className="h-12 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                  />
                )}
              />
              {errors.image_url && (
                <p className="text-red-500 text-sm">{errors.image_url.message}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-orange-500" />
              {t('form.tags')}
            </Label>
            
            <div className="relative tag-select-container">
              <div className="flex flex-wrap gap-2 mb-4">
                {watchedTags?.map((tag, index) => (
                  <Badge key={index} className="bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700 rounded-full px-3 py-1 text-sm font-medium">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(tag || "")}
                      className="ml-2 h-4 w-4 p-0 hover:bg-orange-200 dark:hover:bg-orange-800"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder={t('form.custom.tag')}
                  className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                />
                <Button type="button" onClick={addTag} variant="outline" className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="relative">
                <Button
                  type="button"
                  onClick={() => setIsTagSelectOpen(!isTagSelectOpen)}
                  variant="outline"
                  className="w-full mt-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  {t('form.tags.select')}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>

                {isTagSelectOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {allRecipeTags.map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          if (!watchedTags?.includes(tag)) {
                            setValue("tags", [...(watchedTags || []), tag])
                          }
                          setIsTagSelectOpen(false)
                        }}
                        className="w-full justify-start text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-4">
            <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-orange-500" />
              {t('form.ingredients')}
            </Label>
            {ingredientFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Controller
                  name={`ingredients.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Nome do ingrediente"
                      className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                    />
                  )}
                />
                <Controller
                  name={`ingredients.${index}.amount`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Quantidade"
                      className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                    />
                  )}
                />
                {ingredientFields.length > 1 && (
                  <Button
                    type="button"
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
            <Button type="button" onClick={addIngredient} variant="outline" className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              <Plus className="w-4 h-4 mr-2" />
              {t('form.ingredients.add')}
            </Button>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-orange-500" />
              {t('form.instructions')}
            </Label>
            {stepFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {index + 1}
                </div>
                <Controller
                  name={`steps.${index}.description`}
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Descreva este passo..."
                      className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                    />
                  )}
                />
                {stepFields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeStep(index)}
                    variant="outline"
                    size="icon"
                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" onClick={addStep} variant="outline" className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              <Plus className="w-4 h-4 mr-2" />
              {t('form.instructions.add')}
            </Button>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              disabled={isSubmitting || createRecipeMutation.isPending}
              className="h-12 px-8 bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0 font-medium text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSubmitting || createRecipeMutation.isPending ? "Criando..." : t('form.create.recipe')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
