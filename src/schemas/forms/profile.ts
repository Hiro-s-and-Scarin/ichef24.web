import * as yup from "yup";

export const profileSchema = yup.object({
  name: yup.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: yup.string().email("Email deve ser válido"),
});

export const passwordSchema = yup.object({
  currentPassword: yup.string().required("Senha atual é obrigatória"),
  newPassword: yup
    .string()
    .required("Nova senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Senhas devem ser iguais")
    .required("Confirmação de senha é obrigatória"),
});

