"use client"

import { useDynamicTranslation } from "@/lib/config/i18n"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Exemplo de dados que viriam do backend
interface BackendRecipe {
  id: string
  title: string
  difficulty_level: number | string
  cuisine_type: string
  tags: string[]
  status: string
  ingredients: Array<{
    name: string
    amount: number
    unit: string
  }>
}

// Dados de exemplo simulando resposta do backend
const mockBackendData: BackendRecipe = {
  id: "1",
  title: "Risotto de Frango",
  difficulty_level: 3,
  cuisine_type: "italian",
  tags: ["protein", "creamy", "quick"],
  status: "published",
  ingredients: [
    { name: "Arroz", amount: 400, unit: "g" },
    { name: "Frango", amount: 2, unit: "tbsp" },
    { name: "Sal", amount: 1, unit: "pinch" }
  ]
}

export function DynamicTranslationExample() {
  const { t, currentLang, translate } = useDynamicTranslation()

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{t('example.dynamic.translation')}</CardTitle>
        <p className="text-sm text-gray-600">
          {t('example.current.language')}: {currentLang}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dificuldade traduzida dinamicamente */}
        <div>
          <h4 className="font-semibold mb-2">{t('example.difficulty')}:</h4>
          <p>
            Backend: {mockBackendData.difficulty_level} → 
            Traduzido: {translate.difficulty(mockBackendData.difficulty_level)}
          </p>
        </div>

        {/* Tipo de cozinha traduzido dinamicamente */}
        <div>
          <h4 className="font-semibold mb-2">{t('example.cuisine.type')}:</h4>
          <p>
            Backend: {mockBackendData.cuisine_type} → 
            Traduzido: {translate.cuisine(mockBackendData.cuisine_type)}
          </p>
        </div>

        {/* Tags traduzidas dinamicamente */}
        <div>
          <h4 className="font-semibold mb-2">{t('example.tags')}:</h4>
          <div className="flex flex-wrap gap-2">
            {mockBackendData.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag} → {translate.recipeTag(tag)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Status traduzido dinamicamente */}
        <div>
          <h4 className="font-semibold mb-2">{t('example.status')}:</h4>
          <p>
            Backend: {mockBackendData.status} → 
            Traduzido: {translate.recipeStatus(mockBackendData.status)}
          </p>
        </div>

        {/* Ingredientes com unidades traduzidas */}
        <div>
          <h4 className="font-semibold mb-2">{t('example.ingredients')}:</h4>
          <ul className="space-y-1">
            {mockBackendData.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.name}: {ingredient.amount} {translate.unit(ingredient.unit)}
              </li>
            ))}
          </ul>
        </div>

        {/* Exemplo de uso em diferentes idiomas */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">{t('example.language.examples')}:</h4>
          <div className="space-y-2 text-sm">
            <p>
              <strong>PT:</strong> {translate.difficulty(3, 'pt')} | {translate.cuisine('italian', 'pt')}
            </p>
            <p>
              <strong>EN:</strong> {translate.difficulty(3, 'en')} | {translate.cuisine('italian', 'en')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 