"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import { 
  ChefHat, 
  Brain, 
  Clock, 
  Heart, 
  Leaf, 
  Link as LinkIcon 
} from "lucide-react"

export function MainFeaturesSection() {
  const { t } = useTranslation()

  const features = [
    {
      icon: ChefHat,
      title: t("mainFeatures.personalized.title"),
      description: t("mainFeatures.personalized.desc"),
      gradient: "from-orange-500 to-yellow-500"
    },
    {
      icon: Brain,
      title: t("mainFeatures.assistant.title"),
      description: t("mainFeatures.assistant.desc"),
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Clock,
      title: t("mainFeatures.instant.title"),
      description: t("mainFeatures.instant.desc"),
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      title: t("mainFeatures.favorites.title"),
      description: t("mainFeatures.favorites.desc"),
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: Leaf,
      title: t("mainFeatures.dietary.title"),
      description: t("mainFeatures.dietary.desc"),
      gradient: "from-green-600 to-teal-500"
    },
    {
      icon: LinkIcon,
      title: t("mainFeatures.links.title"),
      description: t("mainFeatures.links.desc"),
      gradient: "from-purple-500 to-indigo-500"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50/50 via-yellow-50/50 to-orange-100/50 dark:from-gray-900/50 dark:via-black/50 dark:to-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t("mainFeatures.subtitle")}
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="bg-white/95 dark:bg-gray-800/95 border border-orange-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl backdrop-blur-sm group"
              >
                <CardContent className="p-8 text-center space-y-6">
                  {/* Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}









