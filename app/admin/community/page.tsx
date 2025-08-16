"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Edit, 
  Trash2, 
  MessageSquare, 
  Users,
  Eye,
  Heart,
  Share2,
  Calendar,
  User,
  Image as ImageIcon
} from "lucide-react"
import { toast } from "sonner"
import * as yup from "yup"
import { useTranslation } from "react-i18next"

// Schema de validação para posts da comunidade
const postSchema = yup.object({
  title: yup.string().required("Título é obrigatório").max(255, "Título deve ter no máximo 255 caracteres"),
  content: yup.string().required("Conteúdo é obrigatório").min(10, "Conteúdo deve ter pelo menos 10 caracteres"),
  image_url: yup.string().url("URL da imagem deve ser válida").optional(),
  difficulty_level: yup.string().oneOf(["Fácil", "Intermediário", "Avançado"], "Nível de dificuldade inválido"),
  recipe_tags: yup.array().of(yup.string()),
  is_featured: yup.boolean().default(false),
  is_active: yup.boolean().default(true)
})

type PostFormData = yup.InferType<typeof postSchema>

interface CommunityPost {
  id: string
  title: string
  content: string
  image_url?: string
  difficulty_level: "Fácil" | "Intermediário" | "Avançado"
  recipe_tags: string[]
  likes_count: number
  comments_count: number
  shares_count: number
  is_featured: boolean
  is_active: boolean
  user: {
    id: string
    name: string
    avatar?: string
  }
  created_at: string
  views_count: number
}

export default function AdminCommunity() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: "1",
      title: "Como fazer um risoto perfeito",
      content: "O risoto é um prato italiano clássico que requer técnica e paciência. Aqui estão as dicas essenciais para conseguir aquele cremosidade perfeita...",
      image_url: "https://exemplo.com/risoto.jpg",
      difficulty_level: "Intermediário",
      recipe_tags: ["italiano", "risoto", "arroz", "cremoso"],
      likes_count: 45,
      comments_count: 12,
      shares_count: 8,
      is_featured: true,
      is_active: true,
      user: {
        id: "1",
        name: "Chef Maria Silva",
        avatar: "https://exemplo.com/avatar1.jpg"
      },
      created_at: "2024-01-15",
      views_count: 234
    },
    {
      id: "2",
      title: "Dicas para temperar carnes",
      content: "O tempero é fundamental para realçar o sabor das carnes. Vou compartilhar algumas técnicas que aprendi ao longo dos anos...",
      image_url: "https://exemplo.com/carnes.jpg",
      difficulty_level: "Fácil",
      recipe_tags: ["carnes", "temperos", "técnicas", "sabor"],
      likes_count: 32,
      comments_count: 8,
      shares_count: 5,
      is_featured: false,
      is_active: true,
      user: {
        id: "2",
        name: "Chef João Santos",
        avatar: "https://exemplo.com/avatar2.jpg"
      },
      created_at: "2024-01-14",
      views_count: 156
    },
    {
      id: "3",
      title: "Sobremesas sem açúcar refinado",
      content: "Para quem busca uma alimentação mais saudável, aqui estão algumas opções deliciosas de sobremesas que não levam açúcar refinado...",
      image_url: "https://exemplo.com/sobremesas.jpg",
      difficulty_level: "Avançado",
      recipe_tags: ["sobremesas", "saudável", "sem açúcar", "alternativas"],
      likes_count: 67,
      comments_count: 23,
      shares_count: 15,
      is_featured: true,
      is_active: true,
      user: {
        id: "3",
        name: "Chef Ana Costa",
        avatar: "https://exemplo.com/avatar3.jpg"
      },
      created_at: "2024-01-13",
      views_count: 342
    }
  ])
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<PostFormData>({
    resolver: yupResolver(postSchema),
    defaultValues: {
      recipe_tags: [""],
      is_featured: false,
      is_active: true
    }
  })

  const onSubmit = async (data: PostFormData) => {
    try {
      if (editingPost) {
        // Editar post existente
        const updatedPosts = posts.map(post => 
          post.id === editingPost.id 
            ? { ...post, ...data, id: post.id, user: post.user, created_at: post.created_at, views_count: post.views_count }
            : post
        )
        setPosts(updatedPosts)
        toast.success("Post atualizado com sucesso!")
      } else {
        // Criar novo post
        const newPost: CommunityPost = {
          id: Date.now().toString(),
          ...data,
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
          user: {
            id: "admin",
            name: "Administrador",
            avatar: "https://exemplo.com/admin-avatar.jpg"
          },
          created_at: new Date().toISOString().split('T')[0],
          views_count: 0
        }
        setPosts([newPost, ...posts])
        toast.success("Post criado com sucesso!")
      }
      
      reset()
      setIsCreateDialogOpen(false)
      setIsEditDialogOpen(false)
      setEditingPost(null)
    } catch (error) {
      console.error("Erro ao salvar post:", error)
      toast.error("Erro ao salvar post. Tente novamente.")
    }
  }

  const handleEdit = (post: CommunityPost) => {
    setEditingPost(post)
    setValue("title", post.title)
    setValue("content", post.content)
    setValue("image_url", post.image_url || "")
    setValue("difficulty_level", post.difficulty_level)
    setValue("recipe_tags", post.recipe_tags)
    setValue("is_featured", post.is_featured)
    setValue("is_active", post.is_active)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (postId: string) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return
    
    setIsDeleting(true)
    try {
      // Simular exclusão
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedPosts = posts.filter(post => post.id !== postId)
      setPosts(updatedPosts)
      toast.success("Post excluído com sucesso!")
    } catch (error) {
      console.error("Erro ao excluir post:", error)
      toast.error("Erro ao excluir post. Tente novamente.")
    } finally {
      setIsDeleting(false)
    }
  }

  const addTag = () => {
    const currentTags = watch("recipe_tags") || [""]
    setValue("recipe_tags", [...currentTags, ""])
  }

  const removeTag = (index: number) => {
    const currentTags = watch("recipe_tags") || [""]
    if (currentTags.length > 1) {
      setValue("recipe_tags", currentTags.filter((_, i) => i !== index))
    }
  }

  const toggleFeatured = (postId: string) => {
    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { ...post, is_featured: !post.is_featured }
        : post
    )
    setPosts(updatedPosts)
    toast.success("Status de destaque atualizado!")
  }

  const toggleActive = (postId: string) => {
    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { ...post, is_active: !post.is_active }
        : post
    )
    setPosts(updatedPosts)
    toast.success("Status de ativo atualizado!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                Gerenciar Comunidade
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Crie, edite e gerencie os posts da comunidade
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Novo Post</DialogTitle>
                </DialogHeader>
                <PostForm 
                  onSubmit={onSubmit}
                  register={register}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  addTag={addTag}
                  removeTag={removeTag}
                  watch={watch}
                  setValue={setValue}
                  handleSubmit={handleSubmit}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {posts.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total de Posts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {posts.reduce((acc, post) => acc + post.likes_count, 0)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total de Likes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {posts.reduce((acc, post) => acc + post.views_count, 0)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total de Visualizações</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {posts.filter(post => post.is_active).length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Posts Ativos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Posts */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Posts da Comunidade</h2>
            
            {posts.map((post) => (
              <Card key={post.id} className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Imagem do Post */}
                    <div className="flex-shrink-0">
                      {post.image_url ? (
                        <img 
                          src={post.image_url} 
                          alt={post.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Conteúdo do Post */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                            {post.content}
                          </p>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant={post.is_featured ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleFeatured(post.id)}
                            className={post.is_featured ? "bg-orange-500 hover:bg-orange-600" : ""}
                          >
                            {post.is_featured ? "Destacado" : "Destacar"}
                          </Button>
                          
                          <Button
                            variant={post.is_active ? "default" : "secondary"}
                            size="sm"
                            onClick={() => toggleActive(post.id)}
                          >
                            {post.is_active ? "Ativo" : "Inativo"}
                          </Button>
                        </div>
                      </div>

                      {/* Metadados do Post */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {post.user.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(post.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {post.views_count} visualizações
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {post.comments_count} comentários
                          </span>
                        </div>
                      </div>

                      {/* Estatísticas de Engajamento */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {post.likes_count} likes
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {post.shares_count} compartilhamentos
                          </span>
                        </div>
                      </div>

                      {/* Tags e Dificuldade */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge variant="outline" className="text-xs">
                          {post.difficulty_level}
                        </Badge>
                        
                        {post.recipe_tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {t('common.edit')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          disabled={isDeleting}
                          className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {isDeleting ? "Excluindo..." : t('common.delete')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('common.edit')} Post: {editingPost?.title}</DialogTitle>
          </DialogHeader>
          <PostForm 
            onSubmit={onSubmit}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            addTag={addTag}
            removeTag={removeTag}
            watch={watch}
            setValue={setValue}
            handleSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente do formulário reutilizável
function PostForm({ 
  onSubmit, 
  register, 
  errors, 
  isSubmitting, 
  addTag, 
  removeTag,
  watch,
  setValue,
  handleSubmit
}: any) {
  const { t } = useTranslation()
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('form.title')} do Post
        </label>
        <Input
          {...register("title")}
          placeholder="Título do post da comunidade"
          className="border-gray-300 dark:border-gray-600"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('form.content')}
        </label>
        <Textarea
          {...register("content")}
          placeholder="Conteúdo do post..."
          rows={6}
          className="border-gray-300 dark:border-gray-600"
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            URL da Imagem (opcional)
          </label>
          <Input
            {...register("image_url")}
            placeholder="https://exemplo.com/imagem.jpg"
            className="border-gray-300 dark:border-gray-600"
          />
          {errors.image_url && (
            <p className="text-red-500 text-sm">{errors.image_url.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.difficulty')}
          </label>
          <Select onValueChange={(value) => setValue("difficulty_level", value)} defaultValue="Fácil">
            <SelectTrigger className="border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Selecione o nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fácil">{t('common.easy')}</SelectItem>
              <SelectItem value="Intermediário">{t('common.intermediate')}</SelectItem>
              <SelectItem value="Avançado">{t('common.advanced')}</SelectItem>
            </SelectContent>
          </Select>
          {errors.difficulty_level && (
            <p className="text-red-500 text-sm">{errors.difficulty_level.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.tags')} de Receita
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTag}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('common.add')} Tag
          </Button>
        </div>
        
        <div className="space-y-2">
          {watch("recipe_tags")?.map((tag: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                {...register(`recipe_tags.${index}`)}
                placeholder="Tag da receita"
                className="border-gray-300 dark:border-gray-600"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeTag(index)}
                disabled={watch("recipe_tags")?.length <= 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        {errors.recipe_tags && (
          <p className="text-red-500 text-sm">{errors.recipe_tags.message}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("is_featured")}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Post em Destaque</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("is_active")}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Post Ativo</span>
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600">
          {isSubmitting ? "Salvando..." : t('common.save')} Post
        </Button>
        <Button type="button" variant="outline">
          {t('common.cancel')}
        </Button>
      </div>
    </form>
  )
} 