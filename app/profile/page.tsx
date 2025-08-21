"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Lock,
  Settings,
  Save,
  Edit,
  Mail,
  Calendar,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useUpdateProfile } from "@/network/hooks/auth/useAuth";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { ProfileFormData } from "@/types/forms";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const updateProfileMutation = useUpdateProfile();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Carregando perfil...
          </p>
        </div>
      </div>
    );
  }

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      const fieldsToUpdate: Partial<ProfileFormData> = {};

      if (data.name && data.name.trim() !== "") {
        fieldsToUpdate.name = data.name.trim();
      }

      if (data.email && data.email.trim() !== "") {
        fieldsToUpdate.email = data.email.trim();
      }

      if (Object.keys(fieldsToUpdate).length > 0) {
        await updateProfileMutation.mutateAsync(fieldsToUpdate);
        setIsEditingProfile(false);
        resetProfile({ ...data, ...fieldsToUpdate });
        toast.success("Perfil atualizado com sucesso!");
      } else {
        toast.info("Nenhum campo foi alterado");
      }
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    }
  };

  const cancelProfileEdit = () => {
    setIsEditingProfile(false);
    resetProfile({
      name: user?.name || "",
      email: user?.email || "",
    });
  };

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
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {user.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {user.email}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                    >
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
                Dados da Conta
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Preferências
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Segurança
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
                    <form
                      onSubmit={handleProfileSubmit(onProfileSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nome Completo
                          </label>
                          <Input
                            {...registerProfile("name", {
                              minLength: {
                                value: 2,
                                message:
                                  "Nome deve ter pelo menos 2 caracteres",
                              },
                            })}
                            placeholder="Seu nome completo (opcional)"
                            className="border-gray-300 dark:border-gray-600"
                          />
                          {profileErrors.name && (
                            <p className="text-red-500 text-sm">
                              {profileErrors.name.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                          </label>
                          <Input
                            {...registerProfile("email", {
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Email inválido",
                              },
                            })}
                            type="email"
                            placeholder="seu@email.com (opcional)"
                            className="border-gray-300 dark:border-gray-600"
                          />
                          {profileErrors.email && (
                            <p className="text-red-500 text-sm">
                              {profileErrors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          type="submit"
                          disabled={isProfileSubmitting}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isProfileSubmitting
                            ? "Salvando..."
                            : "Salvar Alterações"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelProfileEdit}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nome Completo
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => setIsEditingProfile(true)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Dados
                      </Button>
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
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Tema da Interface
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Escolha entre tema claro e escuro
                          </p>
                        </div>
                      </div>
                      <ThemeToggle />
                    </div>

                    {/* Language Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Idioma
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Escolha o idioma da interface
                          </p>
                        </div>
                      </div>
                      <LanguageToggle />
                    </div>

                    {/* Account Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Status da Conta
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Sua conta está ativa e funcionando normalmente
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      >
                        Ativo
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Segurança da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Logout Section */}
                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Sair da Conta
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Encerre sua sessão atual e saia da aplicação
                          </p>
                        </div>
                      </div>
                                            <Button 
                        onClick={() => {
                          console.log('🔐 Profile: Botão de logout clicado');
                          logout();
                        }} 
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Sair
                      </Button>
                    </div>

                    {/* Change Password */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Senha da Conta
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Mantenha sua conta segura com uma senha forte
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => router.push("/auth/reset-password")}
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/30"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Alterar Senha
                      </Button>
                    </div>

                    {/* Account Deletion Warning */}
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mt-0.5">
                          <Shield className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                            Importante
                          </p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Suas receitas e dados permanecerão seguros e você
                            poderá fazer login novamente a qualquer momento.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
