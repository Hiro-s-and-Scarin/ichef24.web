# Integração com Stripe - iChef24

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto frontend com as seguintes variáveis:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Configuração do Backend

Certifique-se de que o backend tenha as seguintes variáveis de ambiente configuradas:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Como Funciona

### 1. Fluxo de Pagamento

1. **Criação do PaymentMethod**: O frontend usa Stripe Elements para coletar os dados do cartão de forma segura
2. **Envio para o Backend**: Os dados são enviados para o endpoint `/stripe/payment` via action `createPayment`
3. **Processamento**: O backend cria um PaymentIntent no Stripe
4. **Confirmação**: Se necessário, o frontend confirma o pagamento usando `confirmCardPayment`

### 2. Componentes

- **`StripeCheckout`**: Componente principal que renderiza o formulário de pagamento
- **`Elements`**: Wrapper do Stripe que fornece o contexto para os elementos de pagamento
- **`CardElement`**: Campo de entrada para dados do cartão (renderizado pelo Stripe)

### 3. Actions

- **`createPayment`**: Envia dados do pagamento para o backend
- **`confirmPayment`**: Confirma pagamentos quando necessário (comentado para uso futuro)

## Uso

### Exemplo Básico

```tsx
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import { StripeCheckout } from '@/components/stripe-checkout'

function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckout
        planDetails={planDetails}
        onSuccess={handleSuccess}
        onBack={handleBack}
      />
    </Elements>
  )
}
```

### Dados do Plano

```tsx
interface PlanDetails {
  id: string
  name: string
  price: number
  billing_cycle: "monthly" | "yearly"
  features: string[]
}
```

## Segurança

- **Dados do Cartão**: Nunca são armazenados no frontend
- **Stripe Elements**: Renderiza campos seguros que se comunicam diretamente com o Stripe
- **PaymentMethod ID**: Apenas o ID do método de pagamento é enviado para o backend
- **HTTPS**: Sempre use HTTPS em produção

## Testes

### Cartões de Teste

- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### CVV e Data de Expiração

- **CVV**: Qualquer 3 dígitos
- **Data**: Qualquer data futura

## Tratamento de Erros

O componente trata automaticamente:
- Erros de validação do cartão
- Falhas na criação do PaymentMethod
- Erros de confirmação do pagamento
- Status inesperados do pagamento

## Webhooks

O backend processa webhooks do Stripe para:
- Atualizar status de pagamentos
- Notificar usuários via WebSocket
- Gerenciar assinaturas

## Próximos Passos

1. Integrar com contexto de autenticação para obter dados do usuário
2. Implementar PIX como método de pagamento alternativo
3. Adicionar histórico de pagamentos
4. Implementar renovação automática de assinaturas 