import * as yup from 'yup'

export const postSchema = yup.object({
  title: yup.string().required("Título é obrigatório").max(255, "Título deve ter no máximo 255 caracteres"),
  content: yup.string().required("Conteúdo é obrigatório").min(10, "Conteúdo deve ter pelo menos 10 caracteres"),
  image_url: yup.string().url("URL da imagem deve ser válida").optional(),
  difficulty_level: yup.string().oneOf(["Fácil", "Intermediário", "Avançado"], "Nível de dificuldade inválido").optional(),
  recipe_tags: yup.array().of(yup.string().required()).optional(),
  recipe_id: yup.string().optional()
})

export const commentSchema = yup.object({
  content: yup.string().required("Comentário é obrigatório").min(1, "Comentário deve ter pelo menos 1 caractere")
})

