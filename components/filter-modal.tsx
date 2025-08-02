"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"
import { recipeTagsByCategory } from "@/lib/recipe-tags"
import { useTranslation } from "react-i18next"

export interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: string[]) => void
  selectedFilters: string[]
}

export function FilterModal({ isOpen, onClose, onApplyFilters, selectedFilters }: FilterModalProps) {
  const { t } = useTranslation()
  const [localFilters, setLocalFilters] = useState<string[]>(selectedFilters)

  const toggleFilter = (filter: string) => {
    setLocalFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const clearAllFilters = () => {
    setLocalFilters([])
  }

  const applyFilters = () => {
    onApplyFilters(localFilters)
    onClose()
  }

  const handleClose = () => {
    setLocalFilters(selectedFilters) // Reset to original state
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
            Filtros
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Filters */}
          {localFilters.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filtros Selecionados ({localFilters.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                >
                  {t('filter.clear')}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {localFilters.map((filter) => (
                  <Badge
                    key={filter}
                    variant="secondary"
                    className="bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50"
                  >
                    {filter}
                    <button
                      onClick={() => toggleFilter(filter)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Filter Categories */}
          <div className="space-y-6">
            {recipeTagsByCategory.map((category) => (
              <div key={category.name} className="space-y-3">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.tags.map((filter) => (
                    <Button
                      key={filter}
                      variant={localFilters.includes(filter) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter(filter)}
                      className={
                        localFilters.includes(filter)
                          ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                          : "text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      }
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handleClose}
              className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            >
              {t('common.cancel')}
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="text-red-500 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
              >
                {t('common.clear')}
              </Button>
              <Button
                onClick={applyFilters}
                className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 text-white"
              >
                {t('filter.apply')} ({localFilters.length})
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 