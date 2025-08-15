"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useConfirmCodeResetPassword, useResetPasswordData } from "@/network/hooks"
import { confirmResetPasswordSchema, ConfirmResetPasswordFormData } from "@/lib/schemas/auth.schema"
import { toast } from "sonner"

export default function ResetPassword() {
  const [isPasswordReset, setIsPasswordReset] = useState(false)
  const [email, setEmail] = useState("")
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ConfirmResetPasswordFormData>({
    resolver: yupResolver(confirmResetPasswordSchema)
  })

  const confirmResetMutation = useConfirmCodeResetPassword()
  const { getResetData, clearResetData } = useResetPasswordData()

  useEffect(() => {
    const resetData = getResetData()
    if (resetData.email) {
      setEmail(resetData.email)
    }
  }, [getResetData])

  const onSubmit = async (data: ConfirmResetPasswordFormData) => {
    try {
      await confirmResetMutation.mutateAsync({
        email: email || data.email,
        code: data.code,
        newPassword: data.newPassword
      })
      clearResetData()
      setIsPasswordReset(true)
    } catch (error) {
      console.error("Error confirming reset password:", error)
    }
  }

  if (isPasswordReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
              Senha Alterada!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Sua senha foi alterada com sucesso!
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
              Agora você pode fazer login com sua nova senha.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Fazer Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
            Redefinir Senha
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            Digite o código enviado para seu email e sua nova senha
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!email && (
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="border-gray-300 dark:border-gray-600"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Código de Verificação
              </label>
              <Input
                {...register("code")}
                id="code"
                type="text"
                placeholder="123456"
                maxLength={6}
                className="border-gray-300 dark:border-gray-600 text-center text-lg tracking-widest"
              />
              {errors.code && (
                <p className="text-red-500 text-sm">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nova Senha
              </label>
              <Input
                {...register("newPassword")}
                id="newPassword"
                type="password"
                placeholder="Digite sua nova senha"
                className="border-gray-300 dark:border-gray-600"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
            >
              {isSubmitting ? "Alterando..." : "Alterar Senha"}
            </Button>

            <div className="text-center space-y-2">
              <Link 
                href="/forgot-password"
                className="block text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
              >
                Reenviar Código
              </Link>
              <Link 
                href="/login"
                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar ao Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 