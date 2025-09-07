"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { formatRecipe } from "@/lib/utils/format-recipe";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  X,
  Save,
  ChefHat,
  Clock,
  ChevronDown,
  Send,
  Sparkles,
  Bot,
} from "lucide-react";
import { allRecipeTags } from "@/lib/constants/recipe-tags";
import { useTranslation } from "react-i18next";
import { useGenerateRecipeWithAI, useUpdateRecipe } from "@/network/hooks";
import { CreateRecipeData } from "@/types/recipe";
import {
  editRecipeSchema,
  EditRecipeFormData,
} from "@/schemas/edit-recipe.schema";
import { toast } from "sonner";
import { api } from "@/lib/api/api";

interface Recipe {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  ingredients: Array<{ name: string; amount: string }>;
  steps: Array<{ step: number; description: string }>;
  cooking_time?: number;
  servings?: number;
  difficulty_level?: number;
  cuisine_type?: string;
  tags?: string[];
  image_url?: string;
  is_ai_generated: boolean;
  ai_prompt?: string;
  ai_model_version?: string;
  is_public: boolean;
  views_count: number;
  likes_count: number;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  type: "user" | "ai";
  message: string;
  timestamp: string;
  suggestions?: string[];
  new_recipe?: Recipe;
}

interface EditRecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (recipe: EditRecipeFormData) => void;
}

export function EditRecipeModal({
  recipe,
  isOpen,
  onClose,
  onSave,
}: EditRecipeModalProps) {
  const { t } = useTranslation();
  const [newTag, setNewTag] = useState("");
  const [isTagSelectOpen, setIsTagSelectOpen] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (isOpen && showChat) {
      setChatMessages([]);
      setChatInput("");
      setIsGenerating(false);
    }
  }, [isOpen, showChat]);

  interface ModalState {
    chatMessages?: ChatMessage[];
    chatInput?: string;
    isGenerating?: boolean;
  }

  const updateModalState = (newState: ModalState) => {
    if (newState.chatMessages !== undefined)
      setChatMessages(newState.chatMessages);
    if (newState.chatInput !== undefined) setChatInput(newState.chatInput);
    if (newState.isGenerating !== undefined)
      setIsGenerating(newState.isGenerating);
  };

  const putRecipeMutation = useUpdateRecipe();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<EditRecipeFormData>({
    resolver: yupResolver(editRecipeSchema),
    defaultValues: {
      title: recipe?.title || "",
      description: recipe?.description || "",
      ingredients: recipe?.ingredients || [{ name: "", amount: "" }],
      steps: recipe?.steps || [{ step: 1, description: "" }],
      cooking_time: recipe?.cooking_time || undefined,
      servings: recipe?.servings || undefined,
      difficulty_level: recipe?.difficulty_level || 3,
      cuisine_type: recipe?.cuisine_type || "",
      tags: recipe?.tags || [],
      image_url: recipe?.image_url || "",
      image_file: undefined,
      is_ai_generated: recipe?.is_ai_generated || false,
      ai_prompt: recipe?.ai_prompt || "",
      ai_model_version: recipe?.ai_model_version || "",
      is_public: recipe?.is_public ?? true,
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: "steps",
  });

  const watchedTags = watch("tags");

  useEffect(() => {
    if (isOpen && recipe) {
      reset({
        title: recipe.title || "",
        description: recipe.description || "",
        ingredients:
          recipe.ingredients && recipe.ingredients.length > 0
            ? recipe.ingredients.map((ing) => ({
                name: ing.name || "",
                amount: ing.amount || "",
              }))
            : [{ name: "", amount: "" }],
        steps:
          recipe.steps && recipe.steps.length > 0
            ? recipe.steps.map((step) => ({
                step: step.step || 1,
                description: step.description || "",
              }))
            : [{ step: 1, description: "" }],
        cooking_time: recipe.cooking_time || undefined,
        servings: recipe.servings || undefined,
        difficulty_level: recipe.difficulty_level || 3,
        cuisine_type: recipe.cuisine_type || "",
        tags: recipe.tags || [],
        image_url: recipe.image_url || "",
        image_file: undefined,
        is_ai_generated: recipe.is_ai_generated || false,
        ai_prompt: recipe.ai_prompt || "",
        ai_model_version: recipe.ai_model_version || "",
        is_public: recipe.is_public ?? true,
      });
    }
  }, [isOpen, recipe, reset]);

  const addIngredient = () => {
    appendIngredient({ name: "", amount: "" });
  };

  const addStep = () => {
    const nextStep = stepFields.length + 1;
    appendStep({ step: nextStep, description: "" });
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = watchedTags?.filter((tag) => tag !== tagToRemove) || [];
    setValue("tags", updatedTags);
  };

  const addTag = () => {
    if (newTag.trim() && !watchedTags?.includes(newTag.trim())) {
      setValue("tags", [...(watchedTags || []), newTag.trim()]);
      setNewTag("");
    }
  };

  const generateRecipeMutation = useGenerateRecipeWithAI();

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isGenerating) return;

    const userMessage = chatInput.trim();
    updateModalState({
      chatMessages: [
        ...chatMessages,
        {
          type: "user",
          message: userMessage,
          timestamp: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
      chatInput: "",
      isGenerating: true,
    });

    try {
          const oldRecipe = {
        id: recipe?.id,
        title: recipe?.title,
        description: recipe?.description,
        ingredients: recipe?.ingredients || [],
        steps: recipe?.steps || [],
        cooking_time: recipe?.cooking_time,
        servings: recipe?.servings,
        difficulty_level: recipe?.difficulty_level,
        cuisine_type: recipe?.cuisine_type || "",
        tags: recipe?.tags || [],
        image_url: recipe?.image_url || "",
        is_ai_generated: recipe?.is_ai_generated,
        ai_prompt: recipe?.ai_prompt || "",
        ai_model_version: recipe?.ai_model_version || "",
        is_public: recipe?.is_public,
      };

      const improvedRecipe = await generateRecipeMutation.mutateAsync({
        old_recipe: JSON.stringify(oldRecipe),
        new_recipe: userMessage,
        recipe_id: recipe?.id,
      });

      // A resposta da API vem com { data: { ... } }, então precisamos extrair os dados
      const recipeData = improvedRecipe['data' as keyof typeof improvedRecipe] as Recipe || improvedRecipe;
      const aiResponse = formatRecipe(recipeData as any, {
        isFirstMessage: false,
      });

      updateModalState({
        chatMessages: [
          ...chatMessages,
          {
            type: "ai",
            message: aiResponse,
            timestamp: new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            suggestions: [],
            new_recipe: recipeData, // Usar os dados extraídos da resposta da API
          },
        ],
        isGenerating: false,
      });
    } catch (error) {
      toast.error("Erro no chat de IA");
      updateModalState({
        isGenerating: false,
        chatMessages: [
          ...chatMessages,
          {
            type: "ai",
            message:
              "Desculpe, ocorreu um erro ao melhorar a receita. Por favor, tente novamente.",
            timestamp: new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ],
      });
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    if (suggestion === "Aplicar mudanças") {
      // Encontrar a última mensagem da IA com new_recipe
      const lastAIMessage = chatMessages
        .filter((msg) => msg.type === "ai" && msg.new_recipe)
        .pop();

      if (lastAIMessage?.new_recipe) {
        const newRecipe = lastAIMessage.new_recipe;

        // Aplicar as mudanças da IA ao formulário
        setValue("title", newRecipe.title);
        setValue("description", newRecipe.description);
        setValue("cooking_time", newRecipe.cooking_time);
        setValue("difficulty_level", newRecipe.difficulty_level);
        setValue("ai_prompt", newRecipe.ai_prompt);
        setValue("ai_model_version", newRecipe.ai_model_version);

        toast.success("Mudanças da IA aplicadas ao formulário!");
      }
    } else {
      setChatInput(suggestion);
    }
  };

  const onSubmit = async (data: EditRecipeFormData) => {
    if (!recipe?.id) return;

    try {
      let finalImageUrl = data.image_url;

      // Se há um arquivo de imagem, fazer upload primeiro
      if (data.image_file) {
        try {
          const formData = new FormData();
          formData.append('file', data.image_file as File);
          
          const response = await api.post('/recipe-images/send-recipe', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.data.success) {
            finalImageUrl = response.data.data.urlSigned;
            toast.success("Imagem enviada com sucesso!");
          } else {
            toast.error("Erro ao enviar imagem: " + response.data.message);
            return;
          }
        } catch (uploadError) {
          toast.error("Erro ao fazer upload da imagem");
          return;
        }
      }

      const recipeData = {
        title: data.title,
        description: data.description,
        ingredients:
          data.ingredients
            ?.filter((ing) => ing.name && ing.amount)
            .map((ing) => ({
              name: ing.name || "",
              amount: ing.amount || "",
            })) || [],
        steps:
          data.steps
            ?.filter((step) => step.description)
            .map((step, index) => ({
              step: index + 1,
              description: step.description || "",
            })) || [],
        cooking_time: data.cooking_time,
        servings: data.servings,
        difficulty_level: data.difficulty_level,
        cuisine_type: data.cuisine_type,
        tags:
          data.tags?.filter((tag): tag is string => tag !== undefined) || [],
        image_url: finalImageUrl,
        is_ai_generated: data.is_ai_generated,
        ai_prompt: data.ai_prompt,
        ai_model_version: data.ai_model_version,
        is_public: data.is_public,
      };

      await putRecipeMutation.mutateAsync({
        id: recipe.id,
        ...recipeData,
      });
      onClose();
      toast.success("Receita atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar receita");
    }
  };

  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-white dark:bg-black border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-orange-100/50 [&::-webkit-scrollbar-track]:dark:bg-gray-700/50 [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-orange-400 [&::-webkit-scrollbar-thumb]:to-yellow-400 [&::-webkit-scrollbar-thumb]:dark:from-orange-500 [&::-webkit-scrollbar-thumb]:dark:to-yellow-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-orange-500 [&::-webkit-scrollbar-thumb]:hover:to-yellow-500 [&::-webkit-scrollbar-thumb]:dark:hover:from-orange-400 [&::-webkit-scrollbar-thumb]:dark:hover:to-yellow-400">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-orange-500" />
            {t("form.edit.recipe")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-orange-500" />
                {t("form.recipe.name")}
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t("form.recipe.name.placeholder")}
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
                {t("form.description")}
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder={t("form.description.placeholder")}
                    className="min-h-[100px] text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                  />
                )}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  {t("form.time")} (minutos)
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
                  <p className="text-red-500 text-sm">
                    {errors.cooking_time.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-orange-500" />
                  {t("form.servings")}
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
                  <p className="text-red-500 text-sm">
                    {errors.servings.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-orange-500" />
                  {t("form.difficulty")}
                </Label>
                <Controller
                  name="difficulty_level"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                    >
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
                  <p className="text-red-500 text-sm">
                    {errors.difficulty_level.message}
                  </p>
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
                Imagem da Receita
              </Label>
              
              {/* Preview da imagem atual */}
              {watch("image_url") && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                  <img
                    src={watch("image_url")}
                    alt="Imagem atual da receita"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setValue("image_url", "")}
                    className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}

              {/* Campo de upload */}
              <div className="space-y-2">
                <Controller
                  name="image_file"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <div className="space-y-2">
                      <Input
                        {...field}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                            // Limpar a URL atual quando um novo arquivo for selecionado
                            setValue("image_url", "");
                          }
                        }}
                        className="h-12 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors file:mr-4 file:py-2.5 file:px-5 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/30 dark:file:text-orange-300"
                      />
                      {value && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>Arquivo selecionado: {(value as File).name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onChange(null)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Campo de URL (fallback) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ou insira uma URL da imagem:
                </Label>
                <Controller
                  name="image_url"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="https://example.com/image.jpg"
                      className="h-10 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                    />
                  )}
                />
                {errors.image_url && (
                  <p className="text-red-500 text-sm">
                    {errors.image_url.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-orange-500" />
              {t("form.tags")}
            </Label>

            <div className="relative tag-select-container">
              <div className="flex flex-wrap gap-2 mb-4">
                {watchedTags?.map((tag, index) => (
                  <Badge
                    key={index}
                    className="bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700 rounded-full px-3 py-1 text-sm font-medium"
                  >
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
                  placeholder={t("form.custom.tag")}
                  className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
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
                  {t("form.tags.select")}
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
                            setValue("tags", [...(watchedTags || []), tag]);
                          }
                          setIsTagSelectOpen(false);
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
              {t("form.ingredients")}
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
            <Button
              type="button"
              onClick={addIngredient}
              variant="outline"
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("form.ingredients.add")}
            </Button>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-orange-500" />
              {t("form.instructions")}
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
            <Button
              type="button"
              onClick={addStep}
              variant="outline"
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("form.instructions.add")}
            </Button>
          </div>

          {/* Chat de IA */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-orange-500" />
                Assistente de IA
              </Label>
              <Button
                type="button"
                onClick={() => setShowChat(!showChat)}
                variant="outline"
                className="border border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {showChat ? "Ocultar Chat" : "Abrir Chat"}
              </Button>
            </div>

            {showChat && (
              <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-4">
                {/* Messages - Scrollable Area with Custom Scrollbar */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 my-4 max-h-80 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-orange-100/50 [&::-webkit-scrollbar-track]:dark:bg-gray-700/50 [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-orange-400 [&::-webkit-scrollbar-thumb]:to-yellow-400 [&::-webkit-scrollbar-thumb]:dark:from-orange-500 [&::-webkit-scrollbar-thumb]:dark:to-yellow-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-orange-500 [&::-webkit-scrollbar-thumb]:hover:to-yellow-500 [&::-webkit-scrollbar-thumb]:dark:hover:from-orange-400 [&::-webkit-scrollbar-thumb]:dark:hover:to-yellow-400">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] relative ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 text-white shadow-orange-500/30"
                            : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-orange-200 dark:border-gray-500 shadow-lg"
                        } rounded-2xl p-4 transform transition-all duration-300 hover:scale-105`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          {message.type === "ai" && (
                            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                            <span className="text-sm font-bold opacity-90">
                              {message.type === "ai" ? "iChef24 AI" : "Você"}
                            </span>
                            <span className="text-sm opacity-70 ml-2">
                              {message.timestamp}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="text-sm leading-relaxed whitespace-pre-line">
                            {message.message}
                          </div>

                          {message.suggestions && (
                            <div className="flex flex-wrap gap-2 pt-3 border-t border-white/20 dark:border-gray-600/30">
                              {message.suggestions.map((suggestion, i) => (
                                <Button
                                  key={i}
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleQuickSuggestion(suggestion)
                                  }
                                  className="text-xs border border-white/30 text-white hover:bg-white/20 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-900/20 rounded-full px-3 py-1 font-medium transition-all duration-300 hover:scale-105"
                                >
                                  ✨ {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}

                          {message.new_recipe && (
                            <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg">
                              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                                🚀 Nova Versão da Receita
                              </h4>
                              <div className="space-y-1 text-sm text-orange-700 dark:text-orange-300">
                                <p>
                                  <strong>Título:</strong>{" "}
                                  {message.new_recipe.title}
                                </p>
                                <p>
                                  <strong>Tempo:</strong>{" "}
                                  {message.new_recipe.cooking_time} min
                                </p>
                                <p>
                                  <strong>Dificuldade:</strong>{" "}
                                  {message.new_recipe.difficulty_level}/5
                                </p>
                                <p>
                                  <strong>IA:</strong>{" "}
                                  {message.new_recipe.ai_model_version}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isGenerating && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-700 border border-orange-200 dark:border-gray-500 rounded-2xl p-4 shadow-lg max-w-[85%]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                            <Sparkles className="w-4 h-4 text-white animate-spin" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                iChef24 AI
                              </span>
                              <div className="flex space-x-1">
                                <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce delay-200"></div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Pensando...
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
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Peça ajuda para melhorar a receita..."
                        className="relative h-12 pr-16 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 shadow-lg text-sm group-hover:shadow-xl group-hover:scale-[1.02]"
                        disabled={isGenerating}
                      />
                      <div className="absolute right-2 top-2">
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
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              disabled={isSubmitting || putRecipeMutation.isPending}
              className="h-12 px-8 bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0 font-medium text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSubmitting || putRecipeMutation.isPending
                ? "Salvando..."
                : t("form.edit.recipe")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
