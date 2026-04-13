import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import RootLayout from './components/layout/RootLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Account from './pages/Account';
import OrderHistory from './pages/OrderHistory';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import ProtectedRoute from './router/ProtectedRoute';
import AdminRoute from './router/AdminRoute';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';

export default function App() {
  const location = useLocation();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const handler = () => clearAuth();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [clearAuth]);

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
              <Route path="/account" element={<Account />} />
              <Route path="/orders" element={<OrderHistory />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Toaster position="bottom-right" richColors />
    </>
  );
}
