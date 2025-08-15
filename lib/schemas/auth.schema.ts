import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().email('Email deve ser válido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória').min(6, 'Senha deve ter pelo menos 6 caracteres')
})

export const registerSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: yup.string().email('Email deve ser válido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória').min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Senhas devem ser iguais').required('Confirmação de senha é obrigatória')
})

export const forgotPasswordSchema = yup.object({
  email: yup.string().email('Email deve ser válido').required('Email é obrigatório')
})

export const resetPasswordSchema = yup.object({
  email: yup.string().email('Email deve ser válido').required('Email é obrigatório'),
  currentPassword: yup.string().required('Senha atual é obrigatória'),
  newPassword: yup.string().required('Nova senha é obrigatória').min(6, 'Senha deve ter pelo menos 6 caracteres')
})

export const confirmResetPasswordSchema = yup.object({
  email: yup.string().email('Email deve ser válido').required('Email é obrigatório'),
  code: yup.string().required('Código é obrigatório').length(6, 'Código deve ter 6 dígitos'),
  newPassword: yup.string().required('Nova senha é obrigatória').min(6, 'Senha deve ter pelo menos 6 caracteres')
})

export type LoginFormData = yup.InferType<typeof loginSchema>
export type RegisterFormData = yup.InferType<typeof registerSchema>
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>
export type ConfirmResetPasswordFormData = yup.InferType<typeof confirmResetPasswordSchema> 