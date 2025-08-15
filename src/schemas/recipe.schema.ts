import * as yup from 'yup'

export const createRecipeSchema = yup.object({
  title: yup.string().required('Título é obrigatório').max(255, 'Título deve ter no máximo 255 caracteres'),
  description: yup.string().max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
  ingredients: yup.array().of(
    yup.object({
      name: yup.string().required('Nome do ingrediente é obrigatório'),
      amount: yup.string().required('Quantidade é obrigatória')
    })
  ).min(1, 'Pelo menos um ingrediente é obrigatório'),
  steps: yup.array().of(
    yup.object({
      step: yup.number().required('Número do passo é obrigatório'),
      description: yup.string().required('Descrição do passo é obrigatória')
    })
  ).min(1, 'Pelo menos um passo é obrigatório'),
  cooking_time: yup.number().min(1, 'Tempo de cozimento deve ser maior que 0').max(480, 'Tempo de cozimento deve ser menor que 8 horas'),
  servings: yup.number().min(1, 'Porções deve ser maior que 0').max(20, 'Porções deve ser menor que 20'),
  difficulty_level: yup.number().min(1, 'Nível de dificuldade deve ser entre 1 e 5').max(5, 'Nível de dificuldade deve ser entre 1 e 5'),
  cuisine_type: yup.string().max(100, 'Tipo de culinária deve ter no máximo 100 caracteres'),
  tags: yup.array().of(yup.string()),
  image_url: yup.string().url('URL da imagem deve ser válida'),
  is_ai_generated: yup.boolean(),
  ai_prompt: yup.string(),
  ai_model_version: yup.string(),
  is_public: yup.boolean()
})

export const updateRecipeSchema = yup.object({
  title: yup.string().max(255, 'Título deve ter no máximo 255 caracteres'),
  description: yup.string().max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
  ingredients: yup.array().of(
    yup.object({
      name: yup.string().required('Nome do ingrediente é obrigatório'),
      amount: yup.string().required('Quantidade é obrigatória')
    })
  ),
  steps: yup.array().of(
    yup.object({
      step: yup.number().required('Número do passo é obrigatório'),
      description: yup.string().required('Descrição do passo é obrigatória')
    })
  ),
  cooking_time: yup.number().min(1, 'Tempo de cozimento deve ser maior que 0').max(480, 'Tempo de cozimento deve ser menor que 8 horas'),
  servings: yup.number().min(1, 'Porções deve ser maior que 0').max(20, 'Porções deve ser menor que 20'),
  difficulty_level: yup.number().min(1, 'Nível de dificuldade deve ser entre 1 e 5').max(5, 'Nível de dificuldade deve ser entre 1 e 5'),
  cuisine_type: yup.string().max(100, 'Tipo de culinária deve ter no máximo 100 caracteres'),
  tags: yup.array().of(yup.string()),
  image_url: yup.string().url('URL da imagem deve ser válida'),
  is_ai_generated: yup.boolean(),
  ai_prompt: yup.string(),
  ai_model_version: yup.string(),
  is_public: yup.boolean()
})

export type CreateRecipeFormData = yup.InferType<typeof createRecipeSchema>
export type UpdateRecipeFormData = yup.InferType<typeof updateRecipeSchema> 