"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages, Globe } from "lucide-react"
import { useTranslation } from "react-i18next"

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        alert('Botão funcionando! Idioma atual: ' + i18n.language)
        // Alternar entre PT e EN para teste
        const newLang = i18n.language === 'pt' ? 'en' : 'pt'
        i18n.changeLanguage(newLang)
      }}
      className="relative w-8 h-8 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
    >
      <Globe className="w-4 h-4" />
      <span className="sr-only">Toggle language</span>
    </Button>
  )
} 