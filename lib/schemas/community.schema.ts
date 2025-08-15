import * as yup from 'yup'

export const createCommunityPostSchema = yup.object({
  title: yup.string().max(255, 'Título deve ter no máximo 255 caracteres'),
  content: yup.string().required('Conteúdo é obrigatório').min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
  image_url: yup.string().url('URL da imagem deve ser válida'),
  difficulty_level: yup.string().oneOf(['Fácil', 'Intermediário', 'Avançado'], 'Nível de dificuldade inválido'),
  recipe_tags: yup.array().of(yup.string()),
  recipe_id: yup.string()
})

export const updateCommunityPostSchema = yup.object({
  title: yup.string().max(255, 'Título deve ter no máximo 255 caracteres'),
  content: yup.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
  image_url: yup.string().url('URL da imagem deve ser válida'),
  difficulty_level: yup.string().oneOf(['Fácil', 'Intermediário', 'Avançado'], 'Nível de dificuldade inválido'),
  recipe_tags: yup.array().of(yup.string()),
  recipe_id: yup.string()
})

export type CreateCommunityPostFormData = yup.InferType<typeof createCommunityPostSchema>
export type UpdateCommunityPostFormData = yup.InferType<typeof updateCommunityPostSchema> 