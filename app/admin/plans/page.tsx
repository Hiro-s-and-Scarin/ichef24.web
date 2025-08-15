"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Crown, 
  Sparkles, 
  ChefHat,
  Calendar,
  DollarSign,
  Users
} from "lucide-react"
import { toast } from "sonner"
import * as yup from "yup"

// Schema de validação para planos
const planSchema = yup.object({
  name: yup.string().required("Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  description: yup.string().max(500, "Descrição deve ter no máximo 500 caracteres"),
  price_monthly: yup.number().min(0, "Preço mensal deve ser maior ou igual a 0").required("Preço mensal é obrigatório"),
  price_yearly: yup.number().min(0, "Preço anual deve ser maior ou igual a 0").required("Preço anual é obrigatório"),
  features: yup.array().of(yup.string()).min(1, "Pelo menos uma funcionalidade é obrigatória"),
  limitations: yup.array().of(yup.string()),
  is_popular: yup.boolean().default(false),
  is_active: yup.boolean().default(true)
})

type PlanFormData = yup.InferType<typeof planSchema>

interface Plan {
  id: string
  name: string
  description: string
  price_monthly: number
  price_yearly: number
  features: string[]
  limitations: string[]
  is_popular: boolean
  is_active: boolean
  subscribers_count: number
  created_at: string
}

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: "1",
      name: "Gratuito",
      description: "Para começar na culinária",
      price_monthly: 0,
      price_yearly: 0,
      features: ["Até 5 receitas por dia", "Geração básica de receitas", "Acesso à comunidade"],
      limitations: ["Limite diário de 5 receitas", "Sem acesso a receitas premium"],
      is_popular: false,
      is_active: true,
      subscribers_count: 1250,
      created_at: "2024-01-01"
    },
    {
      id: "2",
      name: "Pro",
      description: "Para cozinheiros que querem mais",
      price_monthly: 7.90,
      price_yearly: 79,
      features: ["Receitas ilimitadas", "Geração avançada de receitas", "Receitas personalizadas", "Histórico completo"],
      limitations: [],
      is_popular: true,
      is_active: true,
      subscribers_count: 890,
      created_at: "2024-01-01"
    },
    {
      id: "3",
      name: "Premium",
      description: "Para especialistas",
      price_monthly: 10.90,
      price_yearly: 109,
      features: ["Tudo do Pro", "IA avançada com análise nutricional", "Planejamento semanal de refeições", "Lista de compras automática"],
      limitations: [],
      is_popular: false,
      is_active: true,
      subscribers_count: 456,
      created_at: "2024-01-01"
    }
  ])
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<PlanFormData>({
    resolver: yupResolver(planSchema),
    defaultValues: {
      features: [""],
      limitations: [""],
      is_popular: false,
      is_active: true
    }
  })

  const onSubmit = async (data: PlanFormData) => {
    try {
      if (editingPlan) {
        // Editar plano existente
        const updatedPlans = plans.map(plan => 
          plan.id === editingPlan.id 
            ? { ...plan, ...data, id: plan.id, subscribers_count: plan.subscribers_count, created_at: plan.created_at }
            : plan
        )
        setPlans(updatedPlans)
        toast.success("Plano atualizado com sucesso!")
      } else {
        // Criar novo plano
        const newPlan: Plan = {
          id: Date.now().toString(),
          ...data,
          subscribers_count: 0,
          created_at: new Date().toISOString().split('T')[0]
        }
        setPlans([...plans, newPlan])
        toast.success("Plano criado com sucesso!")
      }
      
      reset()
      setIsCreateDialogOpen(false)
      setIsEditDialogOpen(false)
      setEditingPlan(null)
    } catch (error) {
      console.error("Erro ao salvar plano:", error)
      toast.error("Erro ao salvar plano. Tente novamente.")
    }
  }

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setValue("name", plan.name)
    setValue("description", plan.description)
    setValue("price_monthly", plan.price_monthly)
    setValue("price_yearly", plan.price_yearly)
    setValue("features", plan.features)
    setValue("limitations", plan.limitations)
    setValue("is_popular", plan.is_popular)
    setValue("is_active", plan.is_active)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (planId: string) => {
    if (!confirm("Tem certeza que deseja excluir este plano?")) return
    
    setIsDeleting(true)
    try {
      // Simular exclusão
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedPlans = plans.filter(plan => plan.id !== planId)
      setPlans(updatedPlans)
      toast.success("Plano excluído com sucesso!")
    } catch (error) {
      console.error("Erro ao excluir plano:", error)
      toast.error("Erro ao excluir plano. Tente novamente.")
    } finally {
      setIsDeleting(false)
    }
  }

  const addFeature = () => {
    const currentFeatures = watch("features") || [""]
    setValue("features", [...currentFeatures, ""])
  }

  const removeFeature = (index: number) => {
    const currentFeatures = watch("features") || [""]
    if (currentFeatures.length > 1) {
      setValue("features", currentFeatures.filter((_, i) => i !== index))
    }
  }

  const addLimitation = () => {
    const currentLimitations = watch("limitations") || [""]
    setValue("limitations", [...currentLimitations, ""])
  }

  const removeLimitation = (index: number) => {
    const currentLimitations = watch("limitations") || [""]
    if (currentLimitations.length > 1) {
      setValue("limitations", currentLimitations.filter((_, i) => i !== index))
    }
  }

  const { watch } = useForm<PlanFormData>()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                Gerenciar Planos
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Crie, edite e gerencie os planos de assinatura da plataforma
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Plano
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Novo Plano</DialogTitle>
                </DialogHeader>
                <PlanForm 
                  onSubmit={onSubmit}
                  register={register}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  addFeature={addFeature}
                  removeFeature={removeFeature}
                  addLimitation={addLimitation}
                  removeLimitation={removeLimitation}
                  watch={watch}
                  setValue={setValue}
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
                    <Crown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {plans.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total de Planos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {plans.reduce((acc, plan) => acc + plan.subscribers_count, 0)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total de Assinantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      R$ {plans.reduce((acc, plan) => acc + (plan.price_monthly * plan.subscribers_count), 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receita Mensal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {plans.filter(plan => plan.is_active).length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Planos Ativos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Planos */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Planos Existentes</h2>
            
            {plans.map((plan) => (
              <Card key={plan.id} className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                          {plan.name}
                        </h3>
                        {plan.is_popular && (
                          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                            Popular
                          </Badge>
                        )}
                        <Badge variant={plan.is_active ? "default" : "secondary"}>
                          {plan.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {plan.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Mensal: R$ {plan.price_monthly.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Anual: R$ {plan.price_yearly.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {plan.subscribers_count} assinantes
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {plan.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{plan.features.length - 3} mais
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(plan)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(plan.id)}
                        disabled={isDeleting}
                        className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {isDeleting ? "Excluindo..." : "Excluir"}
                      </Button>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Plano: {editingPlan?.name}</DialogTitle>
          </DialogHeader>
          <PlanForm 
            onSubmit={onSubmit}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            addFeature={addFeature}
            removeFeature={removeFeature}
            addLimitation={addLimitation}
            removeLimitation={removeLimitation}
            watch={watch}
            setValue={setValue}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente do formulário reutilizável
function PlanForm({ 
  onSubmit, 
  register, 
  errors, 
  isSubmitting, 
  addFeature, 
  removeFeature, 
  addLimitation, 
  removeLimitation,
  watch,
  setValue
}: any) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nome do Plano
          </label>
          <Input
            {...register("name")}
            placeholder="Ex: Pro, Premium, Enterprise"
            className="border-gray-300 dark:border-gray-600"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Descrição
          </label>
          <Input
            {...register("description")}
            placeholder="Descrição do plano"
            className="border-gray-300 dark:border-gray-600"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Preço Mensal (R$)
          </label>
          <Input
            {...register("price_monthly", { valueAsNumber: true })}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className="border-gray-300 dark:border-gray-600"
          />
          {errors.price_monthly && (
            <p className="text-red-500 text-sm">{errors.price_monthly.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Preço Anual (R$)
          </label>
          <Input
            {...register("price_yearly", { valueAsNumber: true })}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className="border-gray-300 dark:border-gray-600"
          />
          {errors.price_yearly && (
            <p className="text-red-500 text-sm">{errors.price_yearly.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Funcionalidades
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFeature}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
        
        <div className="space-y-2">
          {watch("features")?.map((feature: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                {...register(`features.${index}`)}
                placeholder="Funcionalidade do plano"
                className="border-gray-300 dark:border-gray-600"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeFeature(index)}
                disabled={watch("features")?.length <= 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        {errors.features && (
          <p className="text-red-500 text-sm">{errors.features.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Limitações (opcional)
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLimitation}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
        
        <div className="space-y-2">
          {watch("limitations")?.map((limitation: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                {...register(`limitations.${index}`)}
                placeholder="Limitação do plano"
                className="border-gray-300 dark:border-gray-600"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeLimitation(index)}
                disabled={watch("limitations")?.length <= 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("is_popular")}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Plano Popular</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("is_active")}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Plano Ativo</span>
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600">
          {isSubmitting ? "Salvando..." : "Salvar Plano"}
        </Button>
        <Button type="button" variant="outline">
          Cancelar
        </Button>
      </div>
    </form>
  )
} 