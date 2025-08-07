import * as yup from "yup"

// Schema de validação compatível com o DTO do backend
export const editRecipeSchema = yup.object({
  title: yup.string().required("Título é obrigatório"),
  description: yup.string().optional(),
  ingredients: yup.array().of(
    yup.object({
      name: yup.string().required("Nome do ingrediente é obrigatório"),
      amount: yup.string().required("Quantidade é obrigatória")
    })
  ).min(1, "Pelo menos um ingrediente é obrigatório"),
  steps: yup.array().of(
    yup.object({
      step: yup.number().required(),
      description: yup.string().required("Descrição do passo é obrigatória")
    })
  ).min(1, "Pelo menos um passo é obrigatório"),
  cooking_time: yup.number().positive("Tempo deve ser positivo").optional(),
  servings: yup.number().positive("Porções deve ser positivo").optional(),
  difficulty_level: yup.number().min(1).max(5).optional(),
  cuisine_type: yup.string().optional(),
  tags: yup.array().of(yup.string()).optional(),
  image_url: yup.string().url("URL inválida").optional(),
  is_ai_generated: yup.boolean().optional(),
  ai_prompt: yup.string().optional(),
  ai_model_version: yup.string().optional(),
  is_public: yup.boolean().optional()
})

export type EditRecipeFormData = yup.InferType<typeof editRecipeSchema> 