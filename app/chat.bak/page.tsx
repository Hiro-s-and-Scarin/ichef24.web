"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Send, 
  Plus, 
  MessageCircle, 
  Bot, 
  User, 
  Sparkles,
  Trash2,
  Settings,
  Save
} from "lucide-react"
import { useChatSessions, useCreateChatSession, useChatMessagesBySession, useCreateChatMessage } from "@/network/hooks"
import { ChatSession, ChatMessage } from "@/types/chat"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

interface ChatFormData {
  message: string
}

interface NewSessionFormData {
  title: string
}

export default function Chat() {
  const { t } = useTranslation()
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { data: sessionsData } = useChatSessions()
  const createSessionMutation = useCreateChatSession()
  const { data: messagesData } = useChatMessagesBySession(selectedSession?.id || "")
  const createMessageMutation = useCreateChatMessage()

  const {
    register: registerChat,
    handleSubmit: handleChatSubmit,
    formState: { errors: chatErrors, isSubmitting: isChatSubmitting },
    reset: resetChat
  } = useForm<ChatFormData>()

  const {
    register: registerSession,
    handleSubmit: handleSessionSubmit,
    formState: { errors: sessionErrors, isSubmitting: isSessionSubmitting },
    reset: resetSession
  } = useForm<NewSessionFormData>()

  const sessions = sessionsData?.data || []
  const messages = messagesData?.data || []

  useEffect(() => {
    if (sessions.length > 0 && !selectedSession) {
      setSelectedSession(sessions[0])
    }
  }, [sessions, selectedSession])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const onChatSubmit = async (data: ChatFormData) => {
    if (!selectedSession) return

    try {
      await createMessageMutation.mutateAsync({
        sessionId: selectedSession.id,
        body: {
          message_type: "USER",
          content: data.message
        }
      })
      resetChat()
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const onSessionSubmit = async (data: NewSessionFormData) => {
    try {
      const newSession = await createSessionMutation.mutateAsync({
        title: data.title,
        ai_model_version: "gpt-4"
      })
      setSelectedSession(newSession)
      setIsCreatingSession(false)
      resetSession()
      toast.success("Nova sessão de chat criada!")
    } catch (error) {
      console.error("Error creating session:", error)
    }
  }

  const createNewSession = () => {
    setIsCreatingSession(true)
    setSelectedSession(null)
  }

  const selectSession = (session: ChatSession) => {
    setSelectedSession(session)
    setIsCreatingSession(false)
  }

  const deleteSession = async (sessionId: string) => {
    // Implementar delete session
    toast.info("Funcionalidade de deletar sessão será implementada em breve")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-purple-600 rounded-full p-3 mr-3">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                Chat com IA
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Converse com nossa IA para criar receitas incríveis, tirar dúvidas culinárias e muito mais
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
            {/* Sidebar - Sessions */}
            <div className="lg:col-span-1">
              <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Sessões
                    </CardTitle>
                    <Button
                      size="sm"
                      onClick={createNewSession}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {isCreatingSession ? (
                    <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700">
                      <CardContent className="p-3">
                        <form onSubmit={handleSessionSubmit(onSessionSubmit)} className="space-y-3">
                          <Input
                            {...registerSession("title")}
                            placeholder="Nome da sessão"
                            className="border-orange-300 dark:border-orange-600"
                          />
                          {sessionErrors.title && (
                            <p className="text-red-500 text-xs">{sessionErrors.title.message}</p>
                          )}
                          <div className="flex gap-2">
                            <Button 
                              type="submit" 
                              size="sm" 
                              disabled={isSessionSubmitting}
                              className="bg-orange-500 hover:bg-orange-600 flex-1"
                            >
                              {isSessionSubmitting ? "Criando..." : "Criar"}
                            </Button>
                            <Button 
                              type="button" 
                              size="sm" 
                              variant="outline"
                              onClick={() => setIsCreatingSession(false)}
                            >
                              {t('common.cancel')}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  ) : null}

                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => selectSession(session)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedSession?.id === session.id
                          ? "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-600"
                          : "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 dark:text-white truncate">
                            {session.title || "Nova Conversa"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {session.total_messages} mensagens
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSession(String(session.id))
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {sessions.length === 0 && !isCreatingSession && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Nenhuma sessão criada</p>
                      <Button
                        size="sm"
                        onClick={createNewSession}
                        className="mt-3 bg-orange-500 hover:bg-orange-600"
                      >
                        Criar Primeira Sessão
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-3">
              <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm h-full flex flex-col">
                {selectedSession ? (
                  <>
                    {/* Chat Header */}
                    <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {selectedSession.title || "Nova Conversa"}
                            </CardTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {selectedSession.total_messages} mensagens • {selectedSession.total_tokens_used} tokens
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Configurações
                        </Button>
                      </div>
                    </CardHeader>

                    {/* Messages - Scrollable Area with Custom Scrollbar */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-orange-100/50 [&::-webkit-scrollbar-track]:dark:bg-gray-700/50 [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-orange-400 [&::-webkit-scrollbar-thumb]:to-yellow-400 [&::-webkit-scrollbar-thumb]:dark:from-orange-500 [&::-webkit-scrollbar-thumb]:dark:to-yellow-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-orange-500 [&::-webkit-scrollbar-thumb]:hover:to-yellow-500 [&::-webkit-scrollbar-thumb]:dark:hover:from-orange-400 [&::-webkit-scrollbar-thumb]:dark:hover:to-yellow-400">
                      {messages.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                          <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-medium mb-2">Inicie uma conversa!</h3>
                          <p className="text-sm">
                            Digite uma mensagem abaixo para começar a conversar com nossa IA
                          </p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.message_type === "USER" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl p-4 transform transition-all duration-300 hover:scale-105 ${
                                message.message_type === "USER"
                                  ? 'bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 text-white shadow-orange-500/30'
                                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-orange-200 dark:border-gray-500 shadow-lg'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                {message.message_type !== "USER" && (
                                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                                    <Sparkles className="w-3 h-3 text-white" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <span className="text-sm font-bold opacity-90">
                                    {message.message_type === "USER" ? 'Você' : 'iChef24 AI'}
                                  </span>
                                  {message.tokens_used > 0 && (
                                    <span className="text-sm opacity-70 ml-2">
                                      {message.tokens_used} tokens
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <form onSubmit={handleChatSubmit(onChatSubmit)} className="space-y-3">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                          <Input
                            {...registerChat("message")}
                            placeholder="Digite sua mensagem..."
                            className="relative h-12 pr-16 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 shadow-lg text-sm group-hover:shadow-xl group-hover:scale-[1.02]"
                            disabled={isChatSubmitting}
                          />
                          <div className="absolute right-2 top-2">
                            <Button 
                              type="submit" 
                              size="icon"
                              disabled={isChatSubmitting || !selectedSession}
                              className="h-8 w-8 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {chatErrors.message && (
                          <p className="text-red-500 text-sm mt-2">{chatErrors.message.message}</p>
                        )}
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Selecione uma sessão</h3>
                      <p className="text-sm">
                        Escolha uma sessão existente ou crie uma nova para começar
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 