"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  MessageCircle,
  Heart,
  Share2,
  Plus,
  X
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CommunityPost, CreateCommunityPostData } from "@/types/community"
import { createCommunityPostSchema, CreateCommunityPostFormData } from "@/schemas/community.schema"
import { useTranslation } from "react-i18next"
import { translateDynamicData } from "@/lib/config/i18n"

interface CommunityPageProps {
  posts: CommunityPost[]
  isLoading: boolean
  onCreatePost: (data: CreateCommunityPostData) => Promise<void>
  isCreatingPost: boolean
  onToggleCreatePost: () => void
}

export function CommunityPage({
  posts,
  isLoading,
  onCreatePost,
  isCreatingPost,
  onToggleCreatePost
}: CommunityPageProps) {
  const { t, i18n } = useTranslation()
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateCommunityPostFormData>({
    resolver: yupResolver(createCommunityPostSchema),
    defaultValues: {
      title: "",
      content: "",
      difficulty_level: t('common.easy')
    }
  })

  const onSubmit = async (data: CreateCommunityPostFormData) => {
    try {
      const postData: CreateCommunityPostData = {
        title: data.title,
        content: data.content,
        difficulty_level: data.difficulty_level as 'Fácil' | 'Intermediário' | 'Avançado',
        image_url: data.image_url,
        recipe_tags: data.recipe_tags?.filter((tag): tag is string => tag !== undefined),
        recipe_id: data.recipe_id ? Number(data.recipe_id) : undefined
      }
      await onCreatePost(postData)
      reset()
      onToggleCreatePost()
    } catch (error) {
      // Error handling
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-orange-500 rounded-full p-3 mr-3">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                {t('community.title')}
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('community.subtitle')}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard">{t('common.back')}</Link>
              </Button>
            </div>
            <Button 
              onClick={onToggleCreatePost}
              className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('common.add')} Post
            </Button>
          </div>

          {/* Create Post Form */}
          {isCreatingPost && (
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('common.add')} Novo Post</h3>
                      <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleCreatePost}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                      </Button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('form.title')} ({t('common.optional')})
                    </label>
                    <Input
                      {...register("title")}
                      placeholder="Título do post..."
                      className="border-gray-300 dark:border-gray-600"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('form.content')} *
                    </label>
                    <Textarea
                      {...register("content")}
                      placeholder="Compartilhe sua experiência culinária..."
                      className="border-gray-300 dark:border-gray-600 min-h-[100px]"
                    />
                    {errors.content && (
                      <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                    )}
                  </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('form.difficulty')}
                    </label>
                    <select
                      {...register("difficulty_level")}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <option value="Fácil">{translateDynamicData.difficulty('easy', i18n.language)}</option>
                      <option value="Intermediário">{translateDynamicData.difficulty('medium', i18n.language)}</option>
                      <option value="Avançado">{translateDynamicData.difficulty('hard', i18n.language)}</option>
                    </select>
                    {errors.difficulty_level && (
                      <p className="text-red-500 text-sm mt-1">{errors.difficulty_level.message}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
                  >
                    {isSubmitting ? "Publicando..." : "Publicar Post"}
                  </Button>
                </form>
              </CardContent>
                </Card>
          )}

          {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden h-full flex flex-col">
                {post.image_url && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.image_url}
                      alt={post.title || "Post da comunidade"}
                      fill
                      className="object-cover"
                    />
            </div>
          )}
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {post.user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="font-medium text-gray-800 dark:text-white truncate">
                        {post.user?.name || "Usuário"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  {post.title && (
                    <Badge className="mb-3 w-fit">{post.title}</Badge>
                  )}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1 line-clamp-3">
                    {post.content}
                  </p>
                  {post.difficulty_level && (
                    <Badge variant="secondary" className="mb-3 w-fit">
                      {translateDynamicData.difficulty(post.difficulty_level, i18n.language)}
                    </Badge>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{post.likes_count}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{post.comments_count}</span>
                      </button>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
                </div>

          {/* Empty State */}
          {posts.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum post ainda
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Seja o primeiro a compartilhar algo na comunidade!
              </p>
              <Button onClick={onToggleCreatePost} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Post
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}