import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Yetkisiz Erişim</h1>
          <p className="text-muted-foreground mb-4">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          <button onClick={() => window.history.back()} className="underline">
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}