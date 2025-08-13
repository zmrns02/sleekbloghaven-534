import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { MenuItemManager } from '@/components/admin/MenuItemManager';
import { BarChart3, ShoppingCart, Users, Settings, Moon, Sun, Languages, Menu as MenuIcon, Clock, MapPin, Phone, Mail, Edit3, Save, X, Check, AlertCircle, LogOut, Package, CreditCard, Trash2, Printer } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CategoryList } from '@/components/admin/CategoryList';

const Dashboard = () => {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, isAdmin } = useAuth();
  const { toast } = useToast();
  const { orders, loading, updateOrderStatus, deleteOrder: deleteOrderFromHook } = useOrders();
  const [editingContact, setEditingContact] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showDailyOrders, setShowDailyOrders] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [contactInfo, setContactInfo] = useState({
    phone: '+47 925 18 238',
    email: '02veli0201@gmail.com',
    address: 'Storgata 101, 3921 Porsgrunn',
    hours: 'Man-Tor: 10:00-22:00, Fre: 10:00-23:00, Lör: 13:00-23:00, Søn: 13:00-22:00'
  });
  
  // Sadece admin kullanıcıları Dashboard'a erişebilir
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Otomatik siparişler sayfasına dönüş (1 dakika boşta kalırsa)
  useEffect(() => {
    const idleTimer = setInterval(() => {
      if (Date.now() - lastActivity > 60000) { // 1 dakika
        setActiveTab('orders');
      }
    }, 5000);

    return () => clearInterval(idleTimer);
  }, [lastActivity]);

  // Aktiviteyi güncelle
  const updateActivity = () => {
    setLastActivity(Date.now());
  };

  // Tab değişikliğinde aktiviteyi güncelle
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    updateActivity();
  };

  const printOrder = (order: any) => {
    const receipt = `
BALKAN RESTAURANT
================================
SİPARİŞ #${order.id}
${format(new Date(order.created_at), 'dd.MM.yyyy HH:mm')}
================================

MÜŞTERİ: ${order.customer_name}
TELEFON: ${order.customer_phone}
ÖDEME: ${order.payment_method.toUpperCase()}

--------------------------------
ÜRÜNLER:
${order.items.map((item: any) => 
  `${item.quantity}x ${item.name} - ${(item.price * item.quantity).toFixed(2)} kr`
).join('\n')}
--------------------------------

TOPLAM: ${order.total_amount.toFixed(2)} kr

${order.notes ? `NOT: ${order.notes}` : ''}

*** AFIYET OLSUN ***
    `;
    
    // Modern printing API
    if ('print' in window) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Sipariş #${order.id}</title>
              <style>
                body { font-family: monospace; font-size: 12px; margin: 0; padding: 20px; }
                pre { white-space: pre-wrap; }
              </style>
            </head>
            <body>
              <pre>${receipt}</pre>
              <script>window.print(); window.close();</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
    
    toast({
      title: "Sipariş Yazdırıldı",
      description: `Sipariş #${order.id} yazdırılıyor`,
    });
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (error) throw error;
      
      toast({
        title: "Sipariş Silindi",
        description: "Sipariş başarıyla silindi",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Sipariş silinirken bir hata oluştu",
        variant: "destructive"
      });
    }
  };

  const clearCompletedOrders = async () => {
    try {
      const { error } = await supabase.rpc('clear_completed_orders');
      if (error) throw error;
      
      toast({
        title: "Tamamlanan siparişler temizlendi",
        description: "Teslim edilmiş siparişler listeden kaldırıldı"
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Siparişler temizlenirken bir hata oluştu",
        variant: "destructive"
      });
    }
  };

  const handleSaveContact = () => {
    setEditingContact(false);
    toast({
      title: "İletişim bilgileri güncellendi",
      description: "Değişiklikler başarıyla kaydedildi",
    });
  };

  // Bugünün tarihi
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  // Günlük istatistikler - sadece bugünkü siparişler
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= todayStart && orderDate < todayEnd;
  });

  const activeOrders = orders.filter(order => 
    ['pending', 'preparing', 'ready'].includes(order.status)
  );
  
  const completedOrders = orders.filter(order => 
    ['delivered'].includes(order.status)
  );
  
  const todayRevenue = todayOrders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total_amount, 0);
  
  const todayCustomers = new Set(todayOrders.map(order => order.customer_phone)).size;

  const stats = [
    {
      title: 'BESTİLLİNGER',
      value: todayOrders.length.toString(),
      icon: ShoppingCart,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      orders: todayOrders
    },
    {
      title: 'İNNTEKT', 
      value: `${todayRevenue.toFixed(0)} kr`,
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      orders: todayOrders.filter(order => order.status === 'delivered')
    },
    {
      title: 'KUNDER',
      value: todayCustomers.toString(),
      icon: Users, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      orders: todayOrders.filter((order, index, self) => 
        self.findIndex(o => o.customer_phone === order.customer_phone) === index
      )
    }
  ];

  return (
    <div className="min-h-screen bg-balkan-cream dark:bg-gray-900 pt-4">
      <div className="container mx-auto px-4 py-2">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 flex justify-between items-center"
        >
          <div>
            <h1 className="text-2xl font-bold text-balkan-dark dark:text-white">
              {t('dashboard.welcome')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Velkomst, {user?.email}
            </p>
          </div>
          <Button variant="outline" onClick={signOut} size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logg ut
          </Button>
        </motion.div>

        {/* Compact Stats - Tıklanabilir */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card 
                className="bg-white dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-[1.02]"
                onClick={() => {
                  setShowDailyOrders(true);
                  setActiveTab('daily-orders');
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('dashboard.todayData')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Admin Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Tabs defaultValue="orders" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-4 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="orders" className="text-gray-800 dark:text-gray-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">{t('admin.tabs.orders')}</TabsTrigger>
              <TabsTrigger value="daily-orders" className="text-gray-800 dark:text-gray-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">{t('admin.tabs.daily')}</TabsTrigger>
              <TabsTrigger value="categories" className="text-gray-800 dark:text-gray-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">{t('admin.tabs.categories')}</TabsTrigger>
              <TabsTrigger value="menu" className="text-gray-800 dark:text-gray-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">{t('admin.tabs.menu')}</TabsTrigger>
              <TabsTrigger value="contact" className="text-gray-800 dark:text-gray-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">{t('admin.tabs.contact')}</TabsTrigger>
              <TabsTrigger value="hours" className="text-gray-800 dark:text-gray-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">{t('admin.tabs.hours')}</TabsTrigger>
              <TabsTrigger value="settings" className="text-gray-800 dark:text-gray-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">{t('admin.tabs.settings')}</TabsTrigger>
            </TabsList>

            <TabsContent value="daily-orders" className="space-y-4">
              {/* Günlük Siparişler Ekranı */}
              <Card className="bg-white dark:bg-gray-800 border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                  <CardTitle className="text-xl font-bold flex items-center justify-between">
                    <span>{t('dashboard.dailyOrders')} - {format(today, 'dd.MM.yyyy')}</span>
                    <Badge variant="secondary" className="bg-white text-blue-600">
                      {todayOrders.length} {t('dashboard.orders').toLowerCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {todayOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4" />
                      <p>{t('dashboard.noDailyOrders')}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {todayOrders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-lg text-gray-900 dark:text-white">{order.customer_name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {order.customer_phone}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={
                                order.status === 'pending' ? 'bg-yellow-500 text-white' :
                                order.status === 'preparing' ? 'bg-blue-500 text-white' :
                                order.status === 'ready' ? 'bg-green-500 text-white' :
                                order.status === 'delivered' ? 'bg-gray-500 text-white' : 'bg-red-500 text-white'
                              }>
                                {order.status === 'pending' ? t('dashboard.orderStatus.pending') :
                                 order.status === 'preparing' ? t('dashboard.orderStatus.preparing') :
                                 order.status === 'ready' ? t('dashboard.orderStatus.ready') :
                                 order.status === 'delivered' ? t('dashboard.orderStatus.delivered') : t('dashboard.orderStatus.cancelled')}
                              </Badge>
                              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {format(new Date(order.created_at), 'HH:mm')}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 mb-3">
                            {order.items.map((item: any, index: number) => (
                              <div key={index} className="flex justify-between text-sm bg-white dark:bg-gray-700 p-2 rounded">
                                <span className="text-gray-900 dark:text-gray-100">{item.quantity}x {item.name}</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{(item.price * item.quantity).toFixed(2)} kr</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <CreditCard className="w-4 h-4" />
                              {order.payment_method === 'cash' ? t('dashboard.payment.cash') :
                               order.payment_method === 'card' ? t('dashboard.payment.card') : t('dashboard.payment.vipps')}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-lg text-green-600 dark:text-green-400">
                                {order.total_amount.toFixed(2)} kr
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => printOrder(order)}
                                className="h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                              >
                                <Printer className="w-4 h-4 mr-1" />
                                {t('dashboard.print')}
                              </Button>
                            </div>
                          </div>

                          {order.notes && (
                            <div className="mt-3 text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded border-l-4 border-blue-500">
                              <strong className="text-blue-800 dark:text-blue-300">{t('dashboard.note')}:</strong> 
                              <span className="text-blue-700 dark:text-blue-200 ml-2">{order.notes}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <CategoryManager />
            </TabsContent>

            <TabsContent value="menu" className="space-y-6">
              <MenuItemManager />
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              {/* İki Bölümlü Sipariş Ekranı */}
              <div className="grid grid-cols-2 gap-4 h-[calc(100vh-280px)]">
                {/* Aktif Siparişler */}
                <Card className="bg-white dark:bg-gray-800 border-none shadow-lg overflow-hidden">
                  <CardHeader className="bg-yellow-500 text-white p-3">
                    <CardTitle className="text-lg font-bold flex items-center justify-between">
                      <span>{t('dashboard.activeOrders')}</span>
                      <Badge className="bg-white text-yellow-600">
                        {activeOrders.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-full overflow-y-auto">
                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <span>{t('dashboard.loading')}</span>
                      </div>
                    ) : activeOrders.length === 0 ? (
                      <div className="flex flex-col justify-center items-center h-32 text-gray-500">
                        <Package className="w-8 h-8 mb-2" />
                        <span>{t('dashboard.noActiveOrders')}</span>
                      </div>
                    ) : (
                      <div className="space-y-2 p-3">
                        {activeOrders.map((order) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800"
                          >
                            {/* Sipariş Başlığı */}
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{order.customer_name}</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {order.customer_phone}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge className={`text-white ${
                                  order.status === 'pending' ? 'bg-yellow-500' :
                                  order.status === 'preparing' ? 'bg-blue-500' :
                                  order.status === 'ready' ? 'bg-green-500' : 'bg-gray-500'
                                }`}>
                                  {order.status === 'pending' ? t('dashboard.orderStatus.pending') :
                                   order.status === 'preparing' ? t('dashboard.orderStatus.preparing') :
                                   order.status === 'ready' ? t('dashboard.orderStatus.ready') : order.status}
                                </Badge>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {format(new Date(order.created_at), 'HH:mm')}
                                </span>
                              </div>
                            </div>

                            {/* Ürünler */}
                            <div className="space-y-1 mb-2">
                              {order.items.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between text-xs text-gray-800 dark:text-gray-200">
                                  <span>{item.quantity}x {item.name}</span>
                                  <span>{(item.price * item.quantity).toFixed(2)} kr</span>
                                </div>
                              ))}
                            </div>

                            {/* Ödeme ve Toplam */}
                            <div className="flex justify-between items-center mb-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                              <div className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                                <CreditCard className="w-3 h-3" />
                                {order.payment_method === 'cash' ? t('dashboard.payment.cash') :
                                 order.payment_method === 'card' ? t('dashboard.payment.card') : t('dashboard.payment.vipps')}
                              </div>
                              <span className="font-bold text-sm text-green-600 dark:text-green-400">
                                {order.total_amount.toFixed(2)} kr
                              </span>
                            </div>

                            {/* Not */}
                            {order.notes && (
                              <div className="text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded mb-2">
                                <strong className="text-blue-800 dark:text-blue-300">{t('dashboard.note')}:</strong> 
                                <span className="text-blue-700 dark:text-blue-200 ml-1">{order.notes}</span>
                              </div>
                            )}

                            {/* Aksiyonlar */}
                            <div className="flex gap-2">
                              <Select
                                value={order.status}
                                onValueChange={(value: any) => updateOrderStatus(order.id, value)}
                              >
                                <SelectTrigger className="h-8 text-xs flex-1 bg-white dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-white">
                                  <SelectValue className="text-gray-900 dark:text-white font-medium" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem className="text-black" value="pending">{t('dashboard.orderStatus.pending')}</SelectItem>
                                  <SelectItem className="text-black" value="preparing">{t('dashboard.orderStatus.preparing')}</SelectItem>
                                  <SelectItem className="text-black" value="ready">{t('dashboard.orderStatus.ready')}</SelectItem>
                                  <SelectItem className="text-black" value="delivered">{t('dashboard.orderStatus.delivered')}</SelectItem>
                                  <SelectItem className="text-black" value="cancelled">{t('dashboard.orderStatus.cancelled')}</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => printOrder(order)}
                                className="h-8 px-2"
                                title={t('dashboard.print')}
                              >
                                <Printer className="w-3 h-3" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tamamlanan Siparişler */}
                <Card className="bg-white dark:bg-gray-800 border-none shadow-lg overflow-hidden">
                  <CardHeader className="bg-green-500 text-white p-3">
                    <CardTitle className="text-lg font-bold flex items-center justify-between">
                      <span>{t('dashboard.completedOrders')}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-white text-green-600">
                          {completedOrders.length}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs bg-white text-green-600 hover:bg-gray-100"
                          onClick={clearCompletedOrders}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          {t('dashboard.clear')}
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-full overflow-y-auto">
                    {completedOrders.length === 0 ? (
                      <div className="flex flex-col justify-center items-center h-32 text-gray-500">
                        <Check className="w-8 h-8 mb-2" />
                        <span>{t('dashboard.noCompletedOrders')}</span>
                      </div>
                    ) : (
                      <div className="space-y-2 p-3">
                        {completedOrders.map((order) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="border border-green-200 dark:border-green-700 rounded-lg p-3 bg-green-50 dark:bg-green-900/20"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-sm">{order.customer_name}</h4>
                                <p className="text-xs text-gray-500">{order.customer_phone}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge className="bg-green-500">{t('dashboard.orderStatus.delivered')}</Badge>
                                <span className="text-xs text-gray-400">
                                  {format(new Date(order.created_at), 'HH:mm')}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">
                                {order.items.length} {t('dashboard.products')}
                              </span>
                              <span className="font-bold text-sm text-green-600">
                                {order.total_amount.toFixed(2)} kr
                              </span>
                            </div>
                            
                            <div className="mt-2 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => printOrder(order)}
                                className="h-6 px-2 text-xs flex-1"
                              >
                                <Printer className="w-3 h-3 mr-1" />
                                {t('dashboard.print')}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteOrder(order.id)}
                                className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-balkan-dark dark:text-white">
                    İletişim Bilgileri
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => editingContact ? handleSaveContact() : setEditingContact(true)}
                  >
                    {editingContact ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingContact ? (
                    <>
                      <div>
                        <label className="text-sm font-medium">Telefon/WhatsApp</label>
                        <Input 
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">E-post</label>
                        <Input 
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Adres</label>
                        <Input 
                          value={contactInfo.address}
                          onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-balkan-red" />
                        <span>{contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-balkan-blue" />
                        <span>{contactInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-balkan-yellow" />
                        <span>{contactInfo.address}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hours" className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-balkan-dark dark:text-white">
                    Çalışma Saatleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Pazartesi-Perşembe</label>
                        <Input defaultValue="10:00-22:00" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Cuma</label>
                        <Input defaultValue="10:00-23:00" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Cumartesi</label>
                        <Input defaultValue="13:00-23:00" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Pazar</label>
                        <Input defaultValue="13:00-22:00" />
                      </div>
                    </div>
                    <Button 
                      onClick={() => toast({
                        title: "Çalışma Saatleri Güncellendi",
                        description: "Yeni çalışma saatleri başarıyla kaydedildi",
                      })}
                    >
                      Saatleri Güncelle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-balkan-dark dark:text-white">
                    <Settings className="h-5 w-5" />
                    Sistem Ayarları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {theme === 'dark' ? (
                        <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      ) : (
                        <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      )}
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {theme === 'dark' ? 'Karanlık Mod' : 'Aydınlık Mod'}
                      </span>
                    </div>
                    <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Dil Ayarları
                      </span>
                    </div>
                    <Link to="/language">
                      <Button variant="outline" size="sm">
                        Değiştir
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;