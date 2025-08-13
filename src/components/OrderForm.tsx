import { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Phone, User, FileText, CreditCard } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';


interface OrderFormProps {
  onClose: () => void;
}

export default function OrderForm({ onClose }: OrderFormProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [submitting, setSubmitting] = useState(false);
  
  // Kullanıcı giriş yapmışsa bilgilerini otomatik doldur
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setCustomerName(user.user_metadata.full_name);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form doğrulama
    if (!customerName.trim()) {
      toast.error(t('order.validationError') || t('order.customerName') + ' ' + t('order.error'));
      return;
    }

    if (!customerPhone.trim()) {
      toast.error(t('order.validationError') || t('order.customerPhone') + ' ' + t('order.error'));
      return;
    }

    if (items.length === 0) {
      toast.error(t('cart.empty'));
      return;
    }

    setSubmitting(true);

    try {
      // Sipariş verilerini hazırla - sadece gerekli alanları içerecek şekilde basitleştirildi
      const orderData = {
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total_amount: totalPrice,
        notes: notes.trim() || null,
        payment_method: paymentMethod,
        status: 'pending'
      };
      
      console.log('Sipariş gönderiliyor:', JSON.stringify(orderData, null, 2));
      
      // Doğrudan Supabase'e sipariş ekle
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();
      
      if (error) {
        console.error('Sipariş hatası:', error);
        toast.error(t('order.error') || 'Sipariş oluşturulurken hata oluştu');
        setSubmitting(false);
        return;
      }
      
      console.log('Sipariş başarılı:', data);
      toast.success(t('order.success') || 'Siparişiniz başarıyla alındı!');
      clearCart();
      onClose();
    } catch (err) {
      console.error('Order submission error:', err);
      toast.error(t('order.error'));
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">{t('order.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {t('order.customerName')}
            </Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t('order.customerName').replace(' *', '')}
              required
            />
          </div>

          <div>
            <Label htmlFor="customerPhone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {t('order.customerPhone')}
            </Label>
            <Input
              id="customerPhone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="05XX XXX XX XX"
              required
            />
          </div>

          <div>
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t('order.notes')}
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('order.notesPlaceholder')}
              rows={3}
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4" />
              {t('order.paymentMethod')}
            </Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">{t('order.cash')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">{t('order.card')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vipps" id="vipps" />
                <Label htmlFor="vipps">{t('order.vipps')}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">{t('order.total')}:</span>
              <span className="text-lg font-bold text-primary">{totalPrice.toFixed(2)} kr</span>
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                {t('order.cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={submitting || !customerName.trim() || !customerPhone.trim() || items.length === 0}
                className="flex-1"
              >
                {submitting ? t('order.submitting') : t('order.submit')}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}