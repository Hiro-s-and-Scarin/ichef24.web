"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { RecipeParams } from "@/types/recipe"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  filters: RecipeParams
  onFiltersChange: (filters: Partial<RecipeParams>) => void
}

const difficultyOptions = [
  { value: "1", label: "Muito Fácil" },
  { value: "2", label: "Fácil" },
  { value: "3", label: "Intermediário" },
  { value: "4", label: "Difícil" },
  { value: "5", label: "Muito Difícil" }
]

const cuisineTypes = [
  "Italiana", "Brasileira", "Japonesa", "Mexicana", "Indiana", 
  "Francesa", "Chinesa", "Tailandesa", "Mediterrânea", "Árabe"
]

const timeRanges = [
  { value: "15", label: "Até 15 min" },
  { value: "30", label: "Até 30 min" },
  { value: "45", label: "Até 45 min" },
  { value: "60", label: "Até 1 hora" },
  { value: "120", label: "Até 2 horas" }
]

export function FilterModal({ isOpen, onClose, filters, onFiltersChange }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<RecipeParams>(filters)
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags || [])

  const handleApplyFilters = () => {
    onFiltersChange({
      ...localFilters,
      tags: selectedTags,
      page: 1
    })
    onClose()
  }

  const handleResetFilters = () => {
    const resetFilters: RecipeParams = {
      page: 1,
      limit: 12
    }
    setLocalFilters(resetFilters)
    setSelectedTags([])
    onFiltersChange(resetFilters)
    onClose()
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Filtros</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar receitas</Label>
            <Input
              id="search"
              placeholder="Digite o nome da receita..."
              value={localFilters.search || ""}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2">
            <Label>Nível de Dificuldade</Label>
            <Select
              value={localFilters.difficulty?.[0] || ""}
              onValueChange={(value) => setLocalFilters(prev => ({ ...prev, difficulty: value ? [value] : undefined }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os níveis</SelectItem>
                {difficultyOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cooking Time */}
          <div className="space-y-2">
            <Label>Tempo de Cozimento</Label>
            <Select
              value={localFilters.time || ""}
              onValueChange={(value) => setLocalFilters(prev => ({ ...prev, time: value || undefined }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tempo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Qualquer tempo</SelectItem>
                {timeRanges.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cuisine Types */}
          <div className="space-y-2">
            <Label>Tipos de Culinária</Label>
            <div className="flex flex-wrap gap-2">
              {cuisineTypes.map(cuisine => (
                <Badge
                  key={cuisine}
                  variant={selectedTags.includes(cuisine) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30"
                  onClick={() => toggleTag(cuisine)}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label>Ordenar por</Label>
            <Select
              value={localFilters.sortBy || ""}
              onValueChange={(value) => setLocalFilters(prev => ({ ...prev, sortBy: value as any || undefined }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a ordenação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Padrão</SelectItem>
                <SelectItem value="newest">Mais recentes</SelectItem>
                <SelectItem value="oldest">Mais antigas</SelectItem>
                <SelectItem value="title">Título A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleResetFilters} className="flex-1">
              Limpar Filtros
            </Button>
            <Button onClick={handleApplyFilters} className="flex-1 bg-orange-500 hover:bg-orange-600">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 