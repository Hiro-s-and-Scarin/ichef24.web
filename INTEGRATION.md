# Integração Frontend-Backend - iChef24

## Visão Geral

Este documento descreve a integração completa entre o frontend (Next.js) e o backend (NestJS) do projeto iChef24.

## Estrutura da API

### Base URL
- **Desenvolvimento**: `http://localhost:3000`
- **Produção**: Configurável via `NEXT_PUBLIC_API_URL`

### Autenticação
- **JWT Token**: Armazenado em cookie `jwt`
- **Interceptores**: Configurados para incluir token automaticamente
- **Logout**: Redirecionamento automático em caso de token expirado

## Módulos Integrados

### 1. Autenticação (`/auth`)
- **POST** `/auth` - Login
- **GET** `/auth/logout` - Logout
- **POST** `/auth/forgot-password` - Esqueci a senha
- **POST** `/auth/confirm-forgot-password` - Confirmar código de reset
- **POST** `/auth/send-reset-password` - Enviar código de reset

### 2. Usuários (`/users`)
- **POST** `/users` - Criar usuário (registro)
- **GET** `/users/me` - Obter dados do usuário logado
- **GET** `/users` - Listar usuários (com paginação)
- **GET** `/users/:id` - Obter usuário por ID
- **PUT** `/users/:id` - Atualizar usuário
- **PATCH** `/users/:id/status` - Alternar status do usuário
- **DELETE** `/users/:id` - Deletar usuário

### 3. Receitas (`/recipes`)
- **POST** `/recipes` - Criar receita
- **GET** `/recipes` - Listar receitas (com paginação e filtros)
- **GET** `/recipes/:id` - Obter receita por ID
- **PUT** `/recipes/:id` - Atualizar receita
- **DELETE** `/recipes/:id` - Deletar receita

### 4. Favoritos (`/favorites`)
- **POST** `/favorites/:recipeId` - Adicionar aos favoritos
- **GET** `/favorites` - Listar favoritos do usuário
- **DELETE** `/favorites/:recipeId` - Remover dos favoritos

### 5. Posts da Comunidade (`/community-posts`)
- **POST** `/community-posts` - Criar post
- **GET** `/community-posts` - Listar posts (com paginação)
- **GET** `/community-posts/:id` - Obter post por ID
- **PUT** `/community-posts/:id` - Atualizar post
- **DELETE** `/community-posts/:id` - Deletar post

### 6. Chat com IA (`/chat-sessions`, `/chat-messages`)
- **POST** `/chat-sessions` - Criar sessão de chat
- **GET** `/chat-sessions/user` - Listar sessões do usuário
- **GET** `/chat-sessions/token/:token` - Obter sessão por token
- **PUT** `/chat-sessions/:id` - Atualizar sessão
- **DELETE** `/chat-sessions/:id` - Deletar sessão
- **POST** `/chat-messages/session/:sessionId` - Enviar mensagem
- **GET** `/chat-messages/session/:sessionId` - Obter mensagens da sessão

### 7. OpenAI (`/openai`)
- **POST** `/openai` - Gerar receita com IA

### 8. Planos e Assinaturas (`/plans`)
- **POST** `/plans` - Criar plano
- **GET** `/plans` - Listar planos
- **GET** `/plans/:id` - Obter plano por ID
- **PUT** `/plans/:id` - Atualizar plano
- **DELETE** `/plans/:id` - Deletar plano

### 9. Pagamentos Stripe (`/stripe`)
- **POST** `/stripe/payment-updated` - Webhook para atualizações de pagamento
- **Integração com cartão de crédito/débito e PIX**

## Telas Implementadas

### 1. Autenticação
- **Login** (`/login`) - Formulário de login com validação
- **Registro** (`/register`) - Formulário de registro com validação
- **Esqueci a Senha** (`/forgot-password`) - Solicitar código de recuperação
- **Reset de Senha** (`/reset-password`) - Confirmar código e alterar senha

### 2. Perfil e Configurações
- **Perfil** (`/profile`) - Gerenciar informações pessoais e senha
- **Configurações** - Preferências de conta e notificações

### 3. Receitas
- **Home** (`/`) - Lista de receitas com filtros e paginação
- **Favoritos** (`/favorites`) - Receitas favoritadas pelo usuário
- **Detalhes da Receita** (`/recipe/[id]`) - Visualização completa da receita

### 4. Comunidade
- **Comunidade** (`/community`) - Posts da comunidade com criação de novos posts

### 5. Chat com IA
- **Chat** (`/chat`) - Interface de conversa com IA para criação de receitas

### 6. Planos e Assinaturas
- **Planos** (`/plans`) - Lista de planos disponíveis com comparação
- **Checkout** (`/checkout`) - Pagamento com cartão de crédito/débito e PIX

### 7. Administração
- **Admin Planos** (`/admin/plans`) - Gerenciar planos (CRUD completo)
- **Admin Comunidade** (`/admin/community`) - Gerenciar posts da comunidade (CRUD completo)

## Estrutura de Resposta

### Padrão Geral
```typescript
{
  data: T | T[],           // Dados principais
  pagination?: {            // Paginação (quando aplicável)
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

### Exemplo de Receita
```typescript
{
  id: string,
  user_id: string,
  title: string,
  description?: string,
  ingredients: Array<{ name: string; amount: string }>,
  steps: Array<{ step: number; description: string }>,
  cooking_time?: number,
  servings?: number,
  difficulty_level?: number, // 1-5
  cuisine_type?: string,
  tags?: string[],
  image_url?: string,
  is_ai_generated: boolean,
  is_public: boolean,
  views_count: number,
  likes_count: number,
  user?: {
    id: string,
    name: string,
    avatar_url?: string
  }
}
```

### Exemplo de Plano
```typescript
{
  id: string,
  name: string,
  description: string,
  price_monthly: number,
  price_yearly: number,
  features: string[],
  limitations: string[],
  is_popular: boolean,
  is_active: boolean,
  subscribers_count: number,
  created_at: string
}
```

## Hooks e Actions

### Hooks Disponíveis
- `useRecipes()` - Listar receitas
- `useRecipe(id)` - Obter receita específica
- `useCreateRecipe()` - Criar receita
- `useUpdateRecipe()` - Atualizar receita
- `useDeleteRecipe()` - Deletar receita
- `useFavoriteRecipes()` - Listar favoritos
- `useAddToFavorites()` - Adicionar aos favoritos
- `useRemoveFromFavorites()` - Remover dos favoritos
- `useCommunityPosts()` - Listar posts da comunidade
- `useCreateCommunityPost()` - Criar post
- `useChatSessions()` - Listar sessões de chat
- `useCreateChatMessage()` - Enviar mensagem
- `useForgotPassword()` - Solicitar recuperação de senha
- `useConfirmCodeResetPassword()` - Confirmar código de reset
- `useUpdateProfile()` - Atualizar perfil
- `useUpdatePassword()` - Alterar senha
- `useGetPlans()` - Listar planos disponíveis
- `useSubscribeToPlan()` - Assinar plano

### Actions Disponíveis
- `getRecipes(params)` - Buscar receitas
- `getRecipeById(id)` - Buscar receita por ID
- `postRecipe(data)` - Criar receita
- `putRecipe(id, data)` - Atualizar receita
- `deleteRecipe(id)` - Deletar receita
- `getFavoriteRecipes(params)` - Buscar favoritos
- `postFavoriteRecipe(recipeId)` - Adicionar aos favoritos
- `deleteFavoriteRecipe(recipeId)` - Remover dos favoritos
- `postForgotPassword(email)` - Solicitar recuperação
- `postConfirmCodeResetPassword(data)` - Confirmar reset
- `putUpdateProfile(data)` - Atualizar perfil
- `putUpdatePassword(data)` - Alterar senha
- `getPlans()` - Buscar planos disponíveis
- `createPlan(data)` - Criar novo plano
- `updatePlan(id, data)` - Atualizar plano
- `deletePlan(id)` - Deletar plano

## Validação e Formulários

### Schemas Yup
- `createRecipeSchema` - Validação para criação de receitas
- `updateRecipeSchema` - Validação para atualização de receitas
- `createCommunityPostSchema` - Validação para posts da comunidade
- `loginSchema` - Validação para login
- `registerSchema` - Validação para registro
- `forgotPasswordSchema` - Validação para recuperação de senha
- `resetPasswordSchema` - Validação para reset de senha
- `confirmResetPasswordSchema` - Validação para confirmação de código
- `planSchema` - Validação para planos
- `postSchema` - Validação para posts da comunidade

### React Hook Form
- Todos os formulários usam `react-hook-form`
- Validação integrada com Yup
- Tratamento de erros automático
- Estados de loading e submissão

## Tratamento de Erros

### Interceptores Axios
- **401 Unauthorized**: Redirecionamento automático para login
- **Timeout**: 10 segundos
- **Retry**: Configurável por endpoint

### Toast Notifications
- Sucesso: Verde com ícone de check
- Erro: Vermelho com ícone de erro
- Loading: Indicadores visuais durante operações

## Cache e Estado

### TanStack Query
- **Stale Time**: 5 minutos para dados gerais
- **Cache Time**: Configurável por tipo de dado
- **Invalidation**: Automática após mutações
- **Optimistic Updates**: Para operações de favoritos

### Query Keys
```typescript
{
  auth: { me: ["auth", "me"] },
  recipes: { 
    all: ["recipes"],
    one: (id) => ["recipes", id],
    favorites: ["recipes", "favorites"]
  },
  community: {
    posts: ["community", "posts"],
    post: (id) => ["community", "post", id]
  },
  chat: {
    sessions: ["chat", "sessions"],
    messages: (sessionId) => ["chat", "messages", sessionId]
  },
  plans: {
    all: ["plans", "all"],
    one: (id) => ["plans", id]
  }
}
```

## Responsividade e Estilos

### Breakpoints
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

### Grid System
- **Mobile**: 1 coluna
- **Tablet**: 2 colunas
- **Desktop**: 3-4 colunas

### Cards
- Altura uniforme com `flex flex-col`
- Imagens responsivas com `object-cover`
- Hover effects com `transition-all duration-300`

## Configuração de Ambiente

### Variáveis Necessárias
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3001
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
```

## Comandos de Desenvolvimento

### Instalação
```bash
npm install
# ou
yarn install
```

### Desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

### Build
```bash
npm run build
# ou
yarn build
```

## Estrutura de Arquivos

```
iChef24.web/
├── lib/
│   ├── api.ts                 # Configuração do Axios
│   ├── query-keys.ts          # Chaves do TanStack Query
│   └── schemas/               # Schemas de validação Yup
├── network/
│   ├── actions/               # Funções de API
│   └── hooks/                 # Hooks do TanStack Query
├── types/                     # Tipos TypeScript
├── components/                # Componentes React
└── app/                       # Páginas Next.js
    ├── (auth)/               # Páginas de autenticação
    ├── profile/              # Páginas de perfil
    ├── chat/                 # Chat com IA
    ├── community/            # Comunidade
    ├── favorites/            # Favoritos
    ├── recipe/               # Receitas
    ├── plans/                # Planos e assinaturas
    ├── checkout/             # Checkout de pagamento
    └── admin/                # Páginas de administração
        ├── plans/            # Gerenciar planos
        └── community/        # Gerenciar comunidade
```

## Funcionalidades Principais

### 1. Chat com IA (Core da Aplicação)
- **Sessões de Chat**: Criação e gerenciamento de conversas
- **Geração de Receitas**: IA cria receitas baseadas em prompts
- **Histórico de Conversas**: Persistência de mensagens e sessões
- **Tokens de Uso**: Controle de consumo da API OpenAI

### 2. Sistema de Receitas
- **CRUD Completo**: Criação, edição, visualização e exclusão
- **Favoritos**: Sistema de salvamento de receitas
- **Filtros Avançados**: Por dificuldade, tempo, tipo de culinária
- **Paginação**: Navegação eficiente por grandes volumes

### 3. Comunidade
- **Posts**: Compartilhamento de experiências culinárias
- **Interação**: Sistema de likes e comentários
- **Tags e Categorias**: Organização por tipo de conteúdo
- **Administração**: CRUD completo para moderadores

### 4. Autenticação Robusta
- **JWT**: Tokens seguros com expiração
- **Recuperação de Senha**: Sistema de códigos por email
- **OAuth**: Integração com Google e Facebook
- **Perfis**: Gerenciamento completo de usuários

### 5. Sistema de Planos e Pagamentos
- **Planos Flexíveis**: Gratuito, Pro, Premium com funcionalidades diferenciadas
- **Pagamento com Stripe**: Cartão de crédito/débito e PIX
- **Ciclos de Cobrança**: Mensal e anual com desconto
- **Administração**: CRUD completo para gestores

### 6. Painel Administrativo
- **Gestão de Planos**: Criação, edição e exclusão de planos
- **Moderação de Conteúdo**: Gerenciar posts da comunidade
- **Estatísticas**: Métricas de uso e engajamento
- **Controle de Status**: Ativar/desativar conteúdo

## Próximos Passos

1. **Implementar upload de imagens** para receitas e posts
2. **Adicionar sistema de comentários** para posts da comunidade
3. **Implementar notificações em tempo real** com WebSockets
4. **Adicionar testes automatizados** para hooks e componentes
5. **Implementar PWA** para funcionalidade offline
6. **Adicionar analytics** e métricas de uso
7. **Integrar módulos restantes**: recipe_history, login_history, audit_log
8. **Implementar sistema de relatórios** para administradores
9. **Adicionar dashboard financeiro** para gestores
10. **Implementar sistema de cupons** e promoções 