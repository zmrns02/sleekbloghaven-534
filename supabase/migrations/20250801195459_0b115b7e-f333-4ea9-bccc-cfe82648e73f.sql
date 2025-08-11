-- Tamamlanan siparişleri otomatik silmek için Edge Function tetikleyici
-- Siparişlerin otomatik temizlenmesi için fonksiyon
CREATE OR REPLACE FUNCTION public.delete_old_completed_orders()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Teslim edildikten 2 saat sonra siparişi sil
  DELETE FROM public.orders 
  WHERE status = 'delivered' 
  AND updated_at < NOW() - INTERVAL '2 hours';
  
  RETURN NULL;
END;
$$;

-- Siparişlerin temizlenmesi için scheduled job (her 30 dakikada bir çalışacak)
-- Siparişlerin teslim edildikten 2 saat sonra otomatik silinmesi
CREATE OR REPLACE FUNCTION public.cleanup_delivered_orders()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.orders 
  WHERE status = 'delivered' 
  AND updated_at < NOW() - INTERVAL '2 hours';
END;
$$;

-- Admin için manuel temizleme fonksiyonu
CREATE OR REPLACE FUNCTION public.clear_completed_orders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.orders 
  WHERE status = 'delivered';
END;
$$;