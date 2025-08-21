"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChefHat, ArrowLeft, Mail, Key, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { toast } from "sonner"
import { useForgotPassword, useConfirmForgotPassword } from "@/network/hooks/auth/useAuth"

// Schemas de validação
const forgotPasswordSchema = yup.object({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
})

const confirmCodeSchema = yup.object({
  code: yup.string().required("Código é obrigatório").min(6, "Código deve ter 6 dígitos"),
  newPassword: yup.string().required("Nova senha é obrigatória").min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: yup.string()
    .required("Confirmação de senha é obrigatória")
    .oneOf([yup.ref('newPassword')], 'Senhas devem ser iguais'),
})

type ForgotPasswordFormData = {
  email: string
}

type ConfirmCodeFormData = {
  code: string
  newPassword: string
  confirmPassword: string
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "code">("email")
  const [email, setEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  
  const forgotPasswordMutation = useForgotPassword()
  const confirmForgotPasswordMutation = useConfirmForgotPassword()

  // Form para step 1 - email
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  })

  // Form para step 2 - código e nova senha
  const {
    register: registerCode,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors },
  } = useForm<ConfirmCodeFormData>({
    resolver: yupResolver(confirmCodeSchema),
  })

  const onEmailSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data.email)
      setEmail(data.email)
      setStep("code")
      toast.success("Código enviado para seu email!")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao enviar código")
    }
  }

  const onCodeSubmit = async (data: ConfirmCodeFormData) => {
    try {
      await confirmForgotPasswordMutation.mutateAsync({
        code: data.code,
        newPassword: data.newPassword,
      })
      toast.success("Senha alterada com sucesso!")
      router.push("/")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Código inválido ou expirado")
    }
  }

  const handleBackToEmail = () => {
    setStep("email")
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-xl flex items-center justify-center">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-800 dark:text-white">iChef24</span>
          </Link>
        </div>

        <Card className="bg-white/95 dark:bg-gray-800/95 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {step === "email" ? (
                <Mail className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              ) : (
                <Key className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              )}
            </div>
            <CardTitle className="text-2xl text-gray-800 dark:text-white">
              {step === "email" ? "Esqueceu sua senha?" : "Confirme o código"}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              {step === "email"
                ? "Digite seu email e enviaremos um código para redefinir sua senha"
                : `Digite o código que enviamos para ${email} e sua nova senha`
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Email */}
            {step === "email" && (
              <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      {...registerEmail("email")}
                      className="pl-10 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400"
                    />
                  </div>
                  {emailErrors.email && (
                    <p className="text-sm text-red-500">{emailErrors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    "Enviar código"
                  )}
                </Button>
              </form>
            )}

            {/* Step 2: Code and New Password */}
            {step === "code" && (
              <form onSubmit={handleCodeSubmit(onCodeSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-gray-700 dark:text-gray-300">
                    Código de verificação
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="code"
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      {...registerCode("code")}
                      className="pl-10 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 text-center text-lg tracking-widest"
                    />
                  </div>
                  {codeErrors.code && (
                    <p className="text-sm text-red-500">{codeErrors.code.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">
                    Nova senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua nova senha"
                      {...registerCode("newPassword")}
                      className="pl-10 pr-10 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {codeErrors.newPassword && (
                    <p className="text-sm text-red-500">{codeErrors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                    Confirmar nova senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua nova senha"
                      {...registerCode("confirmPassword")}
                      className="pl-10 pr-10 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {codeErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{codeErrors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={confirmForgotPasswordMutation.isPending}
                  >
                    {confirmForgotPasswordMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Alterando senha...</span>
                      </div>
                    ) : (
                      "Alterar senha"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToEmail}
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para email
                  </Button>
                </div>
              </form>
            )}

            {/* Link para voltar ao login */}
            <div className="text-center">
              <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400">
                ← Voltar ao login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}