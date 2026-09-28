import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CustomRugPage from '@/pages/CustomRugPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import AdminPage from '@/pages/AdminPage';
import SignInPage from '@/pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';
import AccountPage from '@/pages/AccountPage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = ['/signin', '/signup'].includes(location.pathname);

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/custom-rug" element={<CustomRugPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<HomePage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;