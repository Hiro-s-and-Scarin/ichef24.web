export interface ResetPasswordFormData {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface ConfirmCodeFormData {
  code: string;
  email: string;
  newPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
  showPassword: boolean;
}
