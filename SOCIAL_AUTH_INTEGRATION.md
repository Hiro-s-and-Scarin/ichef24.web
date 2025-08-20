# 🔐 **Integração de Autenticação Social - iChef24**

## 📋 **Visão Geral**

Este documento descreve a implementação da autenticação social com **Google** e **Facebook** no frontend do iChef24, integrando com as rotas existentes do backend NestJS.

## 🏗️ **Arquitetura**

### **Backend (NestJS)**
- ✅ **Google OAuth**: `/google/login` e `/google/callback`
- ✅ **Facebook OAuth**: `/facebook/login` e `/facebook/callback`
- ✅ **Guards**: `GoogleOAuthGuard` e `FacebookOAuthGuard`
- ✅ **Services**: `GoogleService` e `FacebookService`

### **Frontend (Next.js)**
- ✅ **Actions**: `socialAuth.ts` - Funções para iniciar autenticação
- ✅ **Hooks**: `useSocialAuth.ts` - Hooks React para autenticação social
- ✅ **Páginas**: Login e Registro com botões funcionais
- ✅ **Callback**: Página para processar retorno da autenticação

## 🚀 **Como Funciona**

### **1. Fluxo de Autenticação**

```
Usuário clica no botão → Redireciona para backend → 
Backend processa OAuth → Redireciona para callback → 
Frontend processa resposta → Usuário autenticado
```

### **2. Componentes Integrados**

#### **📄 Página de Login** (`/login`)
- Botão "Continuar com Google" → `handleGoogleAuth()`
- Botão "Continuar com Facebook" → `handleFacebookAuth()`

#### **📄 Página de Registro** (`/register`)
- Botões idênticos para autenticação social
- Mesma funcionalidade de login

#### **📄 Página de Callback** (`/auth/callback`)
- Processa retorno da autenticação social
- Trata sucesso/erro automaticamente
- Redireciona para página apropriada

## 🔧 **Implementação Técnica**

### **Actions (`network/actions/auth/socialAuth.ts`)**

```typescript
export const initiateGoogleAuth = async () => {
  const callbackUrl = `${window.location.origin}/auth/callback?provider=google`
  const encodedCallback = encodeURIComponent(callbackUrl)
  window.location.href = `${API_URL}/google/login?callback=${encodedCallback}`
}

export const initiateFacebookAuth = async () => {
  const callbackUrl = `${window.location.origin}/auth/callback?provider=facebook`
  const encodedCallback = encodeURIComponent(callbackUrl)
  window.location.href = `${API_URL}/facebook/login?callback=${encodedCallback}`
}
```

### **Hooks (`network/hooks/auth/useSocialAuth.ts`)**

```typescript
export function useGoogleAuth() {
  const { handleGoogleAuth } = useGoogleAuth()
  return { handleGoogleAuth }
}

export function useFacebookAuth() {
  const { handleFacebookAuth } = useFacebookAuth()
  return { handleFacebookAuth }
}
```

### **Uso nos Componentes**

```typescript
import { useGoogleAuth, useFacebookAuth } from "@/network/hooks/auth/useSocialAuth"

function LoginPage() {
  const { handleGoogleAuth } = useGoogleAuth()
  const { handleFacebookAuth } = useFacebookAuth()
  
  return (
    <Button onClick={handleGoogleAuth}>Continuar com Google</Button>
    <Button onClick={handleFacebookAuth}>Continuar com Facebook</Button>
  )
}
```

## 🌐 **URLs de Callback**

### **Google**
- **Login**: `http://localhost:3001/google/login?callback=http://localhost:3000/auth/callback?provider=google`
- **Callback**: `/auth/callback?provider=google&code=...`

### **Facebook**
- **Login**: `http://localhost:3001/facebook/login?callback=http://localhost:3000/facebook/callback?provider=facebook`
- **Callback**: `/auth/callback?provider=facebook&code=...`

## ⚙️ **Configuração**

### **Variáveis de Ambiente**

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### **Backend Configurado**

- ✅ **Google OAuth**: Credenciais configuradas
- ✅ **Facebook OAuth**: Credenciais configuradas
- ✅ **CORS**: Configurado para aceitar frontend
- ✅ **Sessions**: Configurado para OAuth

## 🔍 **Tratamento de Erros**

### **Frontend**
- ✅ **Toast notifications** para feedback do usuário
- ✅ **Fallback automático** para página de login em caso de erro
- ✅ **Loading states** durante processo de autenticação

### **Backend**
- ✅ **Validação de tokens** OAuth
- ✅ **Tratamento de erros** de autenticação
- ✅ **Logs** para debugging

## 📱 **Responsividade**

- ✅ **Mobile-first** design
- ✅ **Botões adaptáveis** para diferentes tamanhos de tela
- ✅ **Loading states** visuais
- ✅ **Feedback visual** para todas as ações

## 🧪 **Testes**

### **Teste Manual**
1. Acesse `/login` ou `/register`
2. Clique em "Continuar com Google" ou "Continuar com Facebook"
3. Complete o fluxo OAuth no provedor
4. Verifique redirecionamento para callback
5. Confirme autenticação bem-sucedida

### **Teste de Build**
```bash
cd iChef24.web
yarn build
# ✅ Build deve compilar sem erros
```

## 🚨 **Problemas Comuns**

### **Erro 404 no Backend**
- Verifique se o backend está rodando na porta 3001
- Confirme se as rotas OAuth estão ativas

### **Erro de CORS**
- Verifique configuração CORS no backend
- Confirme se `NEXT_PUBLIC_API_URL` está correto

### **Callback não funciona**
- Verifique se a URL de callback está sendo passada corretamente
- Confirme se a página `/auth/callback` existe

## 🔮 **Próximos Passos**

### **Melhorias Futuras**
- [ ] **Refresh tokens** automático
- [ ] **Logout social** integrado
- [ ] **Perfil social** sincronizado
- [ ] **Analytics** de autenticação social

### **Integrações Adicionais**
- [ ] **Apple Sign-In** para iOS
- [ ] **GitHub OAuth** para desenvolvedores
- [ ] **LinkedIn OAuth** para profissionais

## 📞 **Suporte**

Para dúvidas ou problemas com a autenticação social:

1. **Verifique logs** do console do navegador
2. **Confirme configuração** do backend
3. **Teste URLs** de callback manualmente
4. **Verifique variáveis** de ambiente

---

**✅ Autenticação Social implementada e funcionando!** 🎉 