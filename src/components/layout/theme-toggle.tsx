"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evita hidratação incorreta
  useEffect(() => {
    setMounted(true)
  }, [])

  // Não renderiza nada até estar montado no cliente
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-600 hover:text-gray-900 hover:bg-orange-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700/50"
      >
        <div className="w-5 h-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="text-gray-600 hover:text-gray-900 hover:bg-orange-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700/50"
    >
      {resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  )
}
