import * as yup from "yup";

export const cardSchema = yup.object({
  cardNumber: yup
    .string()
    .required("Número do cartão é obrigatório")
    .matches(/^\d{16}$/, "Número do cartão deve ter 16 dígitos"),
  cardHolder: yup
    .string()
    .required("Nome do titular é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  expiryMonth: yup
    .string()
    .required("Mês de expiração é obrigatório")
    .matches(/^(0[1-9]|1[0-2])$/, "Mês deve ser entre 01 e 12"),
  expiryYear: yup
    .string()
    .required("Ano de expiração é obrigatório")
    .matches(/^\d{4}$/, "Ano deve ter 4 dígitos"),
  cvv: yup
    .string()
    .required("CVV é obrigatório")
    .matches(/^\d{3,4}$/, "CVV deve ter 3 ou 4 dígitos"),
});

export const checkoutSchema = yup.object({
  email: yup
    .string()
    .email("Email deve ser válido")
    .required("Email é obrigatório"),
  name: yup
    .string()
    .required("Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres"),
});

