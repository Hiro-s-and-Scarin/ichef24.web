"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSendResetPassword, useConfirmCodeResetPassword, useResetPasswordData } from "@/network/hooks/auth/useAuth"
import { toast } from "sonner"
import { yupResolver } from "@hookform/resolvers/yup"
import { resetPasswordSchema, confirmResetPasswordSchema } from "@/schemas/forms"

import { ResetPasswordFormData, ConfirmCodeFormData } from "@/types/forms"

export default function ResetPasswordPage() {
  const [step, setStep] = useState<"password" | "code">("password")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const router = useRouter()
  const { getResetData, clearResetData } = useResetPasswordData()
  const sendResetPasswordMutation = useSendResetPassword()
  const confirmCodeMutation = useConfirmCodeResetPassword()

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema)
  })

  const {
    register: registerCode,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors, isSubmitting: isCodeSubmitting },
    reset: resetCode
  } = useForm<ConfirmCodeFormData>({
    resolver: yupResolver(confirmResetPasswordSchema)
  })

  const onPasswordSubmit = async (data: ResetPasswordFormData) => {
    try {
      await sendResetPasswordMutation.mutateAsync(data)
      setEmail(data.email)
      setCurrentPassword(data.currentPassword)
      setNewPassword(data.newPassword)
      setStep("code")
      resetPassword()
    } catch (error) {
      console.error("Error sending reset password:", error)
    }
  }

  const onCodeSubmit = async (data: ConfirmCodeFormData) => {
    try {
      await confirmCodeMutation.mutateAsync({
        email,
        code: data.code,
        newPassword
      })
      clearResetData()
      toast.success("Senha alterada com sucesso!")
      setTimeout(() => {
        router.push("/profile")
      }, 1500)
    } catch (error) {
      console.error("Error confirming code:", error)
    }
  }

  const handleBackToPassword = () => {
    setStep("password")
    resetCode()
  }

  const handleBackToLogin = () => {
    clearResetData()
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {step === "password" ? "Alterar Senha" : "Confirmar Código"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {step === "password" 
              ? "Digite sua senha atual e a nova senha desejada"
              : "Digite o código enviado para seu email"
            }
          </p>
        </div>

        {/* Password Step */}
        {step === "password" && (
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center justify-center">
                <Lock className="w-5 h-5" />
                Alterar Senha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...registerPassword("email")}
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  {passwordErrors.email && (
                    <p className="text-red-500 text-sm">{passwordErrors.email.message}</p>
                  )}
                </div>

                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...registerPassword("currentPassword")}
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Digite sua senha atual"
                      className="pl-10 pr-10 border-gray-300 dark:border-gray-600"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...registerPassword("newPassword")}
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Digite a nova senha"
                      className="pl-10 pr-10 border-gray-300 dark:border-gray-600"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600" 
                  disabled={isPasswordSubmitting}
                >
                  {isPasswordSubmitting ? "Enviando..." : "Enviar Código"}
                </Button>

                {/* Back to Login */}
                <div className="text-center">
                  <Link 
                    href="/auth/login" 
                    className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    Voltar para o login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Code Step */}
        {step === "code" && (
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center justify-center">
                <CheckCircle className="w-5 h-5" />
                Confirmar Código
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Código enviado para <strong>{email}</strong>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Verifique sua caixa de entrada e spam
                </p>
              </div>

              <form onSubmit={handleCodeSubmit(onCodeSubmit)} className="space-y-4">
                {/* Hidden fields for email and newPassword */}
                <input type="hidden" {...registerCode("email")} value={email} />
                <input type="hidden" {...registerCode("newPassword")} value={newPassword} />
                
                {/* Code Input */}
                <div className="space-y-2">
                  <Label htmlFor="code">Código de Verificação</Label>
                  <Input
                    {...registerCode("code")}
                    id="code"
                    type="text"
                    placeholder="Digite o código de 6 dígitos"
                    className="text-center text-lg tracking-widest border-gray-300 dark:border-gray-600"
                    maxLength={6}
                  />
                  {codeErrors.code && (
                    <p className="text-red-500 text-sm">{codeErrors.code.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600" 
                  disabled={isCodeSubmitting}
                >
                  {isCodeSubmitting ? "Confirmando..." : "Confirmar Código"}
                </Button>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleBackToPassword}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={handleBackToLogin}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
