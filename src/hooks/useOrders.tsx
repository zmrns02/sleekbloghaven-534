import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total_amount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  payment_method: 'cash' | 'card' | 'vipps';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchOrders();
    setupRealtimeSubscription();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data || []) as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(t('dashboard.loading'));
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('New order received:', payload.new);
          setOrders(prev => [payload.new as Order, ...prev]);
          toast.success(t('dashboard.newOrder') || 'Yeni sipariş geldi!');
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order updated:', payload.new);
          setOrders(prev => prev.map(order => 
            order.id === payload.new.id ? payload.new as Order : order
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createOrder = async (orderData: {
    customer_name: string;
    customer_phone: string;
    items: Array<{ id: string; name: string; price: number; quantity: number; }>;
    total_amount: number;
    payment_method: string;
    status: string;
    notes?: string;
  }) => {
    try {
      console.log('createOrder çağrıldı:', JSON.stringify(orderData, null, 2));
      
      // Sipariş verilerini kontrol et
      if (!orderData.customer_name || !orderData.customer_phone || orderData.items.length === 0) {
        console.error('Validasyon hatası: Eksik alanlar');
        throw new Error('validation_error');
      }

      // Sipariş verilerini düzenle - payment_method alanını kontrol et
      const cleanOrderData = {
        ...orderData,
        payment_method: orderData.payment_method || 'cash',
        status: orderData.status || 'pending'
      };

      console.log('Supabase\'e sipariş gönderiliyor...', JSON.stringify(cleanOrderData, null, 2));
      
      // Supabase istemcisinin RLS bypass ayarını kontrol et
      console.log('Supabase headers:', supabase.headers);
      
      const { data, error } = await supabase
        .from('orders')
        .insert([cleanOrderData])
        .select()
        .single();

      if (error) {
        console.error('Supabase hatası:', error);
        throw error;
      }
      
      console.log('Sipariş başarıyla oluşturuldu:', data);
      toast.success(t('order.success') || 'Siparişiniz başarıyla alındı!');
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating order:', error);
      let errorMessage = t('order.error') || 'Sipariş oluşturulurken hata oluştu';
      
      // Daha açıklayıcı hata mesajları
      if (error?.message) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = t('order.networkError') || errorMessage + ': İnternet bağlantınızı kontrol edin';
        } else if (error.message.includes('timeout')) {
          errorMessage = t('order.timeoutError') || errorMessage + ': Sunucu yanıt vermiyor, lütfen daha sonra tekrar deneyin';
        } else if (error.message.includes('permission') || error.message.includes('auth')) {
          errorMessage = t('order.authError') || errorMessage + ': Yetkilendirme hatası';
        } else if (error.message.includes('validation_error')) {
          errorMessage = t('order.validationError') || errorMessage + ': Lütfen tüm gerekli alanları doldurun';
        } else if (error.code === '23505') {
          // Duplicate key error
          errorMessage = t('order.duplicateError') || errorMessage + ': Bu sipariş zaten mevcut';
        } else if (error.code === '23503') {
          // Foreign key error
          errorMessage = t('order.referenceError') || errorMessage + ': Geçersiz ürün referansı';
        }
      }
      
      toast.error(errorMessage);
      return { data: null, error };
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success(t('orders.status') || 'Sipariş durumu güncellendi');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(t('orders.status') || 'Sipariş durumu güncellenirken hata oluştu');
      return { data: null, error };
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success(t('dashboard.deleteOrder') || 'Sipariş silindi');
      return { data: null, error: null };
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error(t('dashboard.deleteOrder') || 'Sipariş silinirken hata oluştu');
      return { data: null, error };
    }
  };

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    refetch: fetchOrders,
  };
}