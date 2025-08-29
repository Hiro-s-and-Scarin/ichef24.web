import * as yup from "yup";

// Schema de validação para edição - todos os campos são opcionais
export const editRecipeSchema = yup.object({
  title: yup.string().optional(),
  description: yup.string().optional(),
  ingredients: yup
    .array()
    .of(
      yup.object({
        name: yup.string().optional(),
        amount: yup.string().optional(),
      }),
    )
    .optional(),
  steps: yup
    .array()
    .of(
      yup.object({
        step: yup.number().optional(),
        description: yup.string().optional(),
      }),
    )
    .optional(),
  cooking_time: yup.number().positive("Tempo deve ser positivo").optional(),
  servings: yup.number().positive("Porções deve ser positivo").optional(),
  difficulty_level: yup.number().min(1).max(5).optional(),
  cuisine_type: yup.string().optional(),
  tags: yup.array().of(yup.string()).optional(),
  image_url: yup.string().url("URL inválida").optional(),
  image_file: yup.mixed().optional(), // Campo para arquivo de imagem
  is_ai_generated: yup.boolean().optional(),
  ai_prompt: yup.string().optional(),
  ai_model_version: yup.string().optional(),
  is_public: yup.boolean().optional(),
});

export type EditRecipeFormData = yup.InferType<typeof editRecipeSchema>;
