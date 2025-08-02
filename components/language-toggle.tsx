"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages, Globe } from "lucide-react"
import { useTranslation } from "react-i18next"

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  
  console.log('LanguageToggle rendered, current language:', i18n.language)

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = async (languageCode: string) => {
    console.log('Changing language to:', languageCode)
    try {
      await i18n.changeLanguage(languageCode)
      console.log('Language changed successfully to:', i18n.language)
      setIsOpen(false)
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-8 h-8 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors cursor-pointer ${
              i18n.language === language.code
                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="font-medium">{language.name}</span>
            {i18n.language === language.code && (
              <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 