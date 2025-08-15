"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useForgotPassword } from "@/network/hooks"
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/schemas/auth.schema"

export default function ForgotPassword() {
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [email, setEmail] = useState("")
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema)
  })

  const forgotPasswordMutation = useForgotPassword()

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data.email)
      setEmail(data.email)
      setIsEmailSent(true)
    } catch (error) {
      console.error("Error sending forgot password email:", error)
    }
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
              Email Enviado!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Enviamos um código de verificação para <strong>{email}</strong>
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
            <div className="space-y-3 pt-4">
              <Link href="/reset-password">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Confirmar Código
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Voltar ao Login
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
            <Mail className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
            Esqueceu sua senha?
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            Digite seu email e enviaremos um código para redefinir sua senha
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Enviar Código"}
            </Button>

            <div className="text-center">
              <Link 
                href="/login"
                className="inline-flex items-center text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
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