import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import JuteHandicraftPage from '@/pages/JuteHandicraftPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CustomRugPage from '@/pages/CustomRugPage';
import TuftingSuppliesPage from '@/pages/TuftingSuppliesPage';
import OrderTrackingPage from '@/pages/OrderTrackingPage';
import WishlistPage from '@/pages/WishlistPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import AdminPage from '@/pages/AdminPage';
import SignInPage from '@/pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';
import AccountPage from '@/pages/AccountPage';
import PageTransitionOverlay from '@/components/common/PageTransitionOverlay';
import AtelierAmbienceWidget from '@/components/common/AtelierAmbienceWidget';
import FloatingInquiryWidget from '@/components/common/FloatingInquiryWidget';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream font-sans text-charcoal-800 relative">
      <PageTransitionOverlay />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AtelierAmbienceWidget />
      <FloatingInquiryWidget />
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
        <Route path="/jute-handicrafts" element={<JuteHandicraftPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/custom-rug" element={<CustomRugPage />} />
        <Route path="/tufting-supplies" element={<TuftingSuppliesPage />} />
        <Route path="/track-order" element={<OrderTrackingPage />} />
        <Route path="/orders/:id/track" element={<OrderTrackingPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Account & Administration */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route path="*" element={<HomePage />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <WishlistProvider>
              <CartProvider>
                <AppRoutes />
              </CartProvider>
            </WishlistProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}