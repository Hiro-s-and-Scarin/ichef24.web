import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup.string().min(6, "Senha deve ter pelo menos 6 caracteres").required("Senha é obrigatória"),
  rememberMe: yup.boolean().default(false),
  showPassword: yup.boolean().default(false)
})

export const resetPasswordSchema = yup.object({
  email: yup.string().email("Email deve ser válido").required("Email é obrigatório"),
  currentPassword: yup.string().required("Senha atual é obrigatória"),
  newPassword: yup.string().required("Nova senha é obrigatória").min(6, "Senha deve ter pelo menos 6 caracteres")
})

export const confirmResetPasswordSchema = yup.object({
  email: yup.string().email("Email deve ser válido").required("Email é obrigatório"),
  code: yup.string().required("Código é obrigatório").length(6, "Código deve ter 6 dígitos"),
  newPassword: yup.string().required("Nova senha é obrigatória").min(6, "Senha deve ter pelo menos 6 caracteres")
})
