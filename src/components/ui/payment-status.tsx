"use client";

import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

interface PaymentStatusProps {
  status: 'pending' | 'success' | 'failed' | 'processing';
  message: string;
  planName?: string;
  amount?: number;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    badgeColor: 'bg-yellow-100 text-yellow-800',
    title: 'Pagamento Pendente',
  },
  processing: {
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badgeColor: 'bg-blue-100 text-blue-800',
    title: 'Processando Pagamento',
  },
  success: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    badgeColor: 'bg-green-100 text-green-800',
    title: 'Pagamento Confirmado',
  },
  failed: {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    badgeColor: 'bg-red-100 text-red-800',
    title: 'Pagamento Falhou',
  },
};

export function PaymentStatus({ status, message, planName, amount }: PaymentStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Icon className={`w-12 h-12 ${config.color}`} />
        </div>
        <CardTitle className={config.color}>{config.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-700">{message}</p>
        
        {planName && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-600">Plano:</span>
            <Badge variant="outline">{planName}</Badge>
          </div>
        )}
        
        {amount && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-600">Valor:</span>
            <Badge className={config.badgeColor}>
              R$ {amount.toFixed(2).replace('.', ',')}
            </Badge>
          </div>
        )}
        
        {status === 'pending' && (
          <div className="flex items-center justify-center gap-2 text-sm text-yellow-600">
            <AlertCircle className="w-4 h-4" />
            Aguardando confirmação do pagamento
          </div>
        )}
        
        {status === 'processing' && (
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
            <Clock className="w-4 h-4" />
            Seu pagamento está sendo processado
          </div>
        )}
      </CardContent>
    </Card>
  );
}
