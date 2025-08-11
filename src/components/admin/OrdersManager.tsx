import { useState } from 'react';
import { useOrders, Order } from '@/hooks/useOrders';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Phone, Clock, Package, CheckCircle, X, User, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { tr, enUS, nb } from 'date-fns/locale';

const statusColors = {
  pending: 'bg-yellow-500',
  preparing: 'bg-blue-500',
  ready: 'bg-green-500',
  delivered: 'bg-gray-500',
  cancelled: 'bg-red-500'
};

export function OrdersManager() {
  const { orders, loading, updateOrderStatus } = useOrders();
  const { t, language } = useLanguage();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const statusLabels = {
    pending: t('orders.pending'),
    preparing: t('orders.preparing'),
    ready: t('orders.ready'),
    delivered: t('orders.delivered'),
    cancelled: t('orders.cancelled')
  };

  const paymentLabels = {
    cash: t('order.cash'),
    card: t('order.card'),
    vipps: t('order.vipps')
  };

  const getDateLocale = () => {
    switch (language) {
      case 'tr': return tr;
      case 'en': return enUS;
      case 'no': return nb;
      default: return nb;
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    await updateOrderStatus(orderId, newStatus);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('orders.title')}</h2>
        <div className="text-sm text-muted-foreground">
          {t('orders.totalCount').replace('{count}', orders.length.toString())}
        </div>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">{t('orders.noOrders')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {order.customer_name}
                  </CardTitle>
                  <Badge className={statusColors[order.status]}>
                    {statusLabels[order.status]}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {order.customer_phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {format(new Date(order.created_at), 'dd MMM yyyy HH:mm', { locale: getDateLocale() })}
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    {paymentLabels[order.payment_method as keyof typeof paymentLabels]}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  <h4 className="font-medium">{t('orders.orderDetails')}:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-muted/50 p-2 rounded">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-medium">{(item.price * item.quantity).toFixed(2)} kr</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                    <span>{t('cart.total')}:</span>
                    <span className="text-primary">{order.total_amount.toFixed(2)} kr</span>
                  </div>
                </div>

                {/* Order Notes */}
                {order.notes && (
                  <div>
                    <h4 className="font-medium mb-1">{t('orders.note')}:</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                      {order.notes}
                    </p>
                  </div>
                )}

                {/* Status Update */}
                <div className="flex items-center gap-4 pt-2 border-t">
                  <label className="text-sm font-medium">{t('orders.status')}:</label>
                  <Select
                    value={order.status}
                    onValueChange={(value: Order['status']) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t('orders.pending')}</SelectItem>
                      <SelectItem value="preparing">{t('orders.preparing')}</SelectItem>
                      <SelectItem value="ready">{t('orders.ready')}</SelectItem>
                      <SelectItem value="delivered">{t('orders.delivered')}</SelectItem>
                      <SelectItem value="cancelled">{t('orders.cancelled')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}