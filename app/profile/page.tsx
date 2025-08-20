"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Lock, 
  Settings, 
  Camera, 
  Save, 
  Edit,
  Calendar,
  Mail,
  Shield
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useUpdateProfile, useUpdatePassword } from "@/network/hooks"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

interface ProfileFormData {
  name: string
  avatar_url?: string
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function Profile() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Loading state while user is being fetched
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{t('common.loading')} perfil...</p>
        </div>
      </div>
    )
  }
  
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    reset: resetProfile
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || "",
      avatar_url: user?.avatar || ""
    }
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword
  } = useForm<PasswordFormData>()

  const updateProfileMutation = useUpdateProfile()
  const updatePasswordMutation = useUpdatePassword()

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync(data)
      setIsEditingProfile(false)
      resetProfile(data)
      toast.success("Perfil atualizado com sucesso!")
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("As senhas não coincidem")
      return
    }

    try {
      await updatePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      })
      setIsChangingPassword(false)
      resetPassword()
      toast.success("Senha atualizada com sucesso!")
    } catch (error) {
      console.error("Error updating password:", error)
    }
  }

  const cancelProfileEdit = () => {
    setIsEditingProfile(false)
    resetProfile({
      name: user?.name || "",
      avatar_url: user?.avatar || ""
    })
  }

  const cancelPasswordEdit = () => {
    setIsChangingPassword(false)
    resetPassword()
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Configurações do Perfil
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Gerencie suas informações pessoais e configurações de conta
            </p>
          </div>

          {/* Profile Overview Card */}
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-700"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {user.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {user.email}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                      {user.plan}
                    </Badge>
                    <Badge variant="outline">
                      Membro desde {new Date().getFullYear()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Segurança
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Preferências
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditingProfile ? (
                    <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('auth.name')}
                          </label>
                          <Input
                            {...registerProfile("name")}
                            placeholder="Seu nome completo"
                            className="border-gray-300 dark:border-gray-600"
                          />
                          {profileErrors.name && (
                            <p className="text-red-500 text-sm">{profileErrors.name.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            URL do Avatar
                          </label>
                          <Input
                            {...registerProfile("avatar_url")}
                            placeholder="https://exemplo.com/avatar.jpg"
                            className="border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={isProfileSubmitting} className="bg-orange-500 hover:bg-orange-600">
                          {isProfileSubmitting ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                        <Button type="button" variant="outline" onClick={cancelProfileEdit}>
                          {t('common.cancel')}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('auth.name')}
                          </label>
                          <p className="text-gray-900 dark:text-white">{user.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('auth.email')}
                          </label>
                          <p className="text-gray-900 dark:text-white">{user.email}</p>
                        </div>
                      </div>
                      
                      <Button onClick={() => setIsEditingProfile(true)} className="bg-orange-500 hover:bg-orange-600">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Perfil
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Segurança da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isChangingPassword ? (
                    <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Senha Atual
                        </label>
                        <Input
                          {...registerPassword("currentPassword")}
                          type="password"
                          placeholder="Digite sua senha atual"
                          className="border-gray-300 dark:border-gray-600"
                        />
                        {passwordErrors.currentPassword && (
                          <p className="text-red-500 text-sm">{passwordErrors.currentPassword.message}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nova Senha
                          </label>
                          <Input
                            {...registerPassword("newPassword")}
                            type="password"
                            placeholder="Digite a nova senha"
                            className="border-gray-300 dark:border-gray-600"
                          />
                          {passwordErrors.newPassword && (
                            <p className="text-red-500 text-sm">{passwordErrors.newPassword.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirmar Nova Senha
                          </label>
                          <Input
                            {...registerPassword("confirmPassword")}
                            type="password"
                            placeholder="Confirme a nova senha"
                            className="border-gray-300 dark:border-gray-600"
                          />
                          {passwordErrors.confirmPassword && (
                            <p className="text-red-500 text-sm">{passwordErrors.confirmPassword.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={isPasswordSubmitting} className="bg-orange-500 hover:bg-orange-600">
                          {isPasswordSubmitting ? "Alterando..." : "Alterar Senha"}
                        </Button>
                        <Button type="button" variant="outline" onClick={cancelPasswordEdit}>
                          {t('common.cancel')}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Senha da Conta</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Última alteração: {new Date().toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <Button onClick={() => setIsChangingPassword(true)} variant="outline">
                          Alterar Senha
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="mt-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Preferências da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Notificações por Email</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receber atualizações sobre receitas e comunidade
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Fuso Horário</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            UTC-3 (Brasília)
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Alterar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 