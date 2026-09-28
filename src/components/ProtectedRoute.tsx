import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sand-200 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // এডমিন ভেরিফিকেশন (ইউজার মেটাডাটা বা ইমেইল দিয়ে চেক)
  if (adminOnly) {
    const isAdmin = user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin';
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}