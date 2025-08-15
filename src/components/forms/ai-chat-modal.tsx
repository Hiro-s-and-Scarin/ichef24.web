"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChefHat, Send, User, Bot, X } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIChatModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  placeholder?: string
  initialMessage?: string
  onRecipeGenerated?: (recipe: any) => void
}

export function AIChatModal({
  isOpen,
  onClose,
  title,
  placeholder = "Digite sua mensagem...",
  initialMessage,
  onRecipeGenerated,
}: AIChatModalProps) {
  // Estado consolidado
  const [chatState, setChatState] = useState<AIChatModalState>({
    messages: [],
    input: "",
    isLoading: false,
  })

  // Desestruturação para facilitar o uso
  const { messages, input, isLoading } = chatState

  // Função helper para atualizar estado
  const updateChatState = (updates: Partial<AIChatModalState>) => {
    setChatState(prev => ({ ...prev, ...updates }))
  }
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && initialMessage && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: initialMessage,
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, initialMessage, messages.length])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Que interessante! Vou criar uma receita especial para você. Com base no que você disse, sugiro um prato que combina sabores únicos e técnicas culinárias modernas.",
        "Perfeito! Estou pensando em uma receita que vai surpreender seu paladar. Deixe-me elaborar algo delicioso com os ingredientes que você mencionou.",
        "Excelente escolha! Vou criar uma receita personalizada que leva em conta suas preferências. Que tal experimentarmos algo novo e saboroso?",
        "Adorei sua ideia! Vou desenvolver uma receita especial que combina tradição e inovação. Prepare-se para uma experiência culinária incrível!",
      ]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)

      // If this is a recipe generation chat, simulate recipe creation
      if (onRecipeGenerated && Math.random() > 0.5) {
        setTimeout(() => {
          const generatedRecipe = {
            id: Date.now(),
            title: "Receita Criada pela IA",
            description: "Uma deliciosa receita personalizada criada especialmente para você",
            image: "/placeholder.svg?height=200&width=300",
            time: "30 min",
            servings: "4 pessoas",
            difficulty: "Médio",
            tags: ["IA", "Personalizada", "Especial"],
            date: "Agora",
            rating: 5,
            ingredients: ["Ingredientes selecionados pela IA", "Temperos especiais", "Elementos únicos da receita"],
            instructions: [
              "Prepare os ingredientes conforme sugerido pela IA",
              "Siga as técnicas culinárias recomendadas",
              "Finalize com o toque especial da receita",
            ],
          }
          onRecipeGenerated(generatedRecipe)
        }, 2000)
      }
    }, 1500)
  }

  const handleClose = () => {
    setMessages([])
    setInput("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[600px] bg-gray-800 border-gray-700 text-white flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#f54703] to-[#ff7518] rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-xl text-white">{title}</DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-[#f54703] to-[#ff7518] rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-[#f54703] to-[#ff7518] text-white"
                      : "bg-black text-gray-100"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-[#f54703] to-[#ff7518] rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-black p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t border-gray-700 flex-shrink-0">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-black/50 border-gray-700 text-white placeholder:text-gray-400"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-[#f54703] to-[#ff7518] hover:from-[#ff7518] hover:to-[#f54703] text-white border-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
