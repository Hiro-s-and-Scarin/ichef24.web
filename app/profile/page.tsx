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
import { useTranslation } from "react-i18next";

import { ProfileFormData } from "@/types/forms";

export default function Profile() {
  const { t } = useTranslation();
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
            {t("common.loading")}
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
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 w-full overflow-hidden">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
              {t("profile.title")}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              {t("profile.subtitle")}
            </p>
          </div>

          {/* Profile Overview Card */}
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                <div className="relative">
                  <Avatar className="w-24 h-24 sm:w-28 sm:h-28">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl sm:text-3xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-3 sm:space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                    {user.name}
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 break-all">
                    {user.email}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      {t("profile.overview.member.since")} {new Date().getFullYear()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <div className="w-full overflow-hidden mb-6">
              <TabsList className="flex flex-col sm:grid sm:grid-cols-3 w-full bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 p-4 sm:p-5 gap-2 sm:gap-0 min-h-[200px] sm:min-h-[70px]">
                <TabsTrigger value="profile" className="flex items-center justify-center gap-2 text-base sm:text-lg py-4 px-4 sm:px-6 whitespace-nowrap min-h-[56px] rounded-lg w-full">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate font-medium">{t("profile.tabs.account")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="preferences"
                  className="flex items-center justify-center gap-2 text-base sm:text-lg py-4 px-4 sm:px-6 whitespace-nowrap min-h-[56px] rounded-lg w-full"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate font-medium">{t("profile.tabs.preferences")}</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center justify-center gap-2 text-base sm:text-lg py-4 px-4 sm:px-6 whitespace-nowrap min-h-[56px] rounded-lg w-full">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate font-medium">{t("profile.tabs.security")}</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm w-full overflow-hidden">
                <CardHeader className="p-6 sm:p-8">
                  <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    <span className="truncate">{t("profile.account.title")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 overflow-hidden">
                  {isEditingProfile ? (
                    <form
                      onSubmit={handleProfileSubmit(onProfileSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                            {t("profile.account.full.name")}
                          </label>
                          <Input
                            {...registerProfile("name", {
                              minLength: {
                                value: 2,
                                message:
                                  t("profile.account.name.error"),
                              },
                            })}
                            placeholder={t("profile.account.name.placeholder")}
                            className="border-gray-300 dark:border-gray-600 text-base h-12"
                          />
                          {profileErrors.name && (
                            <p className="text-red-500 text-sm">
                              {profileErrors.name.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-3">
                          <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                            {t("profile.account.email")}
                          </label>
                          <Input
                            {...registerProfile("email", {
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: t("profile.account.email.error"),
                              },
                            })}
                            type="email"
                            placeholder={t("profile.account.email.placeholder")}
                            className="border-gray-300 dark:border-gray-600 text-base h-12"
                          />
                          {profileErrors.email && (
                            <p className="text-red-500 text-sm">
                              {profileErrors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <Button
                          type="submit"
                          disabled={isProfileSubmitting}
                          className="bg-orange-500 hover:bg-orange-600 text-base h-12"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isProfileSubmitting
                            ? t("profile.account.saving")
                            : t("profile.account.save")}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelProfileEdit}
                          className="text-base h-12"
                        >
                          {t("profile.account.cancel")}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                            {t("profile.account.full.name")}
                          </label>
                          <p className="text-gray-900 dark:text-white text-lg p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            {user.name}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                            {t("profile.account.email")}
                          </label>
                          <p className="text-gray-900 dark:text-white text-lg p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg break-all">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => setIsEditingProfile(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-base h-12"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {t("profile.account.edit")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="mt-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm w-full overflow-hidden">
                <CardHeader className="p-6 sm:p-8">
                  <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    <span className="truncate">{t("profile.preferences.title")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 overflow-hidden">
                  <div className="space-y-6 w-full overflow-hidden">
                    {/* Theme Toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg gap-4 w-full overflow-hidden">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 overflow-hidden">
                        <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className="font-medium text-gray-900 dark:text-white text-base sm:text-lg truncate">
                            {t("profile.preferences.theme.title")}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {t("profile.preferences.theme.desc")}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <ThemeToggle />
                      </div>
                    </div>

                    {/* Language Toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-base sm:text-lg">
                            {t("profile.preferences.language.title")}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t("profile.preferences.language.desc")}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <LanguageToggle />
                      </div>
                    </div>

                    {/* Account Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-base sm:text-lg">
                            {t("profile.preferences.status.title")}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t("profile.preferences.status.desc")}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-sm px-3 py-2"
                        >
                          {t("profile.preferences.status.active")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm w-full overflow-hidden">
                <CardHeader className="p-6 sm:p-8">
                  <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    <span className="truncate">{t("profile.security.title")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 overflow-hidden">
                  <div className="space-y-6 w-full overflow-hidden">
                    {/* Logout Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-base sm:text-lg">
                            {t("profile.security.logout.title")}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t("profile.security.logout.desc")}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button 
                          onClick={() => {
                            console.log('🔐 Profile: Botão de logout clicado');
                            logout();
                          }} 
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 text-white text-base w-full sm:w-auto h-12"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          {t("profile.security.logout.button")}
                        </Button>
                      </div>
                    </div>

                    {/* Change Password */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-base sm:text-lg">
                            {t("profile.security.password.title")}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t("profile.security.password.desc")}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          onClick={() => router.push("/auth/reset-password")}
                          variant="outline"
                          className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/30 text-base w-full sm:w-auto h-12"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          {t("profile.security.password.button")}
                        </Button>
                      </div>
                    </div>

                    {/* Account Deletion Warning */}
                    <div className="p-4 sm:p-5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-2 text-base sm:text-lg">
                            {t("profile.security.warning.title")}
                          </p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            {t("profile.security.warning.desc")}
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
