"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Image as ImageIcon, Search, ChefHat } from "lucide-react";
import { toast } from "sonner";
import * as yup from "yup";
import { CreateCommunityPostData } from "@/types/community";
import { useMyRecipes } from "@/network/hooks/recipes/useRecipes";

import { PostFormData } from "@/types/forms";
import { postSchema } from "@/schemas/forms";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCommunityPostData) => Promise<void>;
}

export function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
}: CreatePostModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipeSearchTerm, setRecipeSearchTerm] = useState("");
  const [showRecipeSelect, setShowRecipeSelect] = useState(false);

  const { data: userRecipes, isLoading: recipesLoading } = useMyRecipes();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PostFormData>({
    resolver: yupResolver(postSchema),
    defaultValues: {
      recipe_tags: [""],
    },
  });

  const handleFormSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      const postData = {
        ...data,
        recipe_id: data.recipe_id ? Number(data.recipe_id) : undefined,
      };
      await onSubmit(postData);
      reset();
      onClose();
    } catch (error) {
      toast.error("Erro ao criar post. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    const currentTags = watch("recipe_tags") || [""];
    setValue("recipe_tags", [...currentTags, ""]);
  };

  const removeTag = (index: number) => {
    const currentTags = watch("recipe_tags") || [""];
    if (currentTags.length > 1) {
      setValue(
        "recipe_tags",
        currentTags.filter((_, i) => i !== index),
      );
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">
            Criar Novo Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Título do Post
            </label>
            <Input
              {...register("title")}
              placeholder="Título do seu post da comunidade"
              className="border-gray-300 dark:border-gray-600"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Conteúdo
            </label>
            <Textarea
              {...register("content")}
              placeholder="Compartilhe sua experiência, dica ou receita com a comunidade..."
              rows={6}
              className="border-gray-300 dark:border-gray-600"
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                URL da Imagem (opcional)
              </label>
              <Input
                {...register("image_url")}
                placeholder="https://exemplo.com/imagem.jpg"
                className="border-gray-300 dark:border-gray-600"
              />
              {errors.image_url && (
                <p className="text-red-500 text-sm">
                  {errors.image_url.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nível de Dificuldade
              </label>
              <Select
                onValueChange={(value) =>
                  setValue(
                    "difficulty_level",
                    value as "Fácil" | "Intermediário" | "Avançado",
                  )
                }
                defaultValue="Fácil"
              >
                <SelectTrigger className="border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fácil">Fácil</SelectItem>
                  <SelectItem value="Intermediário">Intermediário</SelectItem>
                  <SelectItem value="Avançado">Avançado</SelectItem>
                </SelectContent>
              </Select>
              {errors.difficulty_level && (
                <p className="text-red-500 text-sm">
                  {errors.difficulty_level.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Vincular Receita (opcional)
              </label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRecipeSelect(!showRecipeSelect)}
                  className="w-full justify-between border-gray-300 dark:border-gray-600"
                >
                  <span className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4" />
                    {watch("recipe_id")
                      ? "Receita selecionada"
                      : "Selecionar receita"}
                  </span>
                  <Search className="w-4 h-4" />
                </Button>

                {showRecipeSelect && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <Input
                        placeholder="Pesquisar receitas..."
                        value={recipeSearchTerm}
                        onChange={(e) => setRecipeSearchTerm(e.target.value)}
                        className="border-gray-300 dark:border-gray-600"
                      />
                    </div>

                    <div className="p-2">
                      {recipesLoading ? (
                        <div className="text-center py-4 text-gray-500">
                          Carregando receitas...
                        </div>
                      ) : userRecipes?.data?.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          Nenhuma receita encontrada
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setValue("recipe_id", undefined);
                              setShowRecipeSelect(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
                          >
                            Sem receita
                          </button>
                          {userRecipes?.data
                            ?.filter(
                              (recipe: {
                                id: number;
                                title: string;
                                description?: string;
                                image_url?: string;
                              }) =>
                                recipe.title
                                  .toLowerCase()
                                  .includes(recipeSearchTerm.toLowerCase()),
                            )
                            .map(
                              (recipe: {
                                id: number;
                                title: string;
                                description?: string;
                                image_url?: string;
                              }) => (
                                <button
                                  key={recipe.id}
                                  type="button"
                                  onClick={() => {
                                    setValue("recipe_id", recipe.id.toString());
                                    setShowRecipeSelect(false);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
                                >
                                  <div className="flex items-center gap-2">
                                    {recipe.image_url && (
                                      <img
                                        src={recipe.image_url}
                                        alt={recipe.title}
                                        className="w-8 h-8 rounded object-cover"
                                      />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-gray-800 dark:text-white truncate">
                                        {recipe.title}
                                      </div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {recipe.description || "Sem descrição"}
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              ),
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {watch("recipe_id") && (
                <div className="mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    Receita vinculada
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags de Receita
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Tag
              </Button>
            </div>

            <div className="space-y-2">
              {watch("recipe_tags")?.map((tag: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    {...register(`recipe_tags.${index}`)}
                    placeholder="Tag da receita"
                    className="border-gray-300 dark:border-gray-600"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeTag(index)}
                    disabled={(watch("recipe_tags")?.length || 0) <= 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            {errors.recipe_tags && (
              <p className="text-red-500 text-sm">
                {errors.recipe_tags.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 flex-1"
            >
              {isSubmitting ? "Criando..." : "Criar Post"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
