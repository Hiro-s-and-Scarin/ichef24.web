"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChefHat, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { toast } from "sonner"
import { useForgotPassword } from "@/network/hooks/auth/useAuth"

const forgotPasswordSchema = yup.object({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
})

type ForgotPasswordFormData = {
  email: string
}

export function ForgotPasswordPageContent() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()
  const forgotPasswordMutation = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data.email)
      setIsSubmitted(true)
      toast.success("Email de recuperação enviado com sucesso!")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao enviar email de recuperação")
    }
  }

  if (isSubmitted) {
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
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl text-gray-800 dark:text-white">Email Enviado!</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Verifique sua caixa de entrada para instruções de recuperação de senha
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button
                onClick={() => router.push("/")}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Voltar ao Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
            <CardTitle className="text-2xl text-gray-800 dark:text-white">Esqueceu sua senha?</CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              Digite seu email e enviaremos instruções para redefinir sua senha
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                  className="border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending ? "Enviando..." : "Enviar Email de Recuperação"}
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
