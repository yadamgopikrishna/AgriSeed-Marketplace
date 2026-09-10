import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { AuthModal } from './components/common/AuthModal';
import { MobileBottomNav } from './components/common/MobileBottomNav';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CropDoctorPage } from './pages/CropDoctorPage';
import { PresentationDeckPage } from './pages/PresentationDeckPage';
import { AuthPage } from './pages/AuthPage';

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white pb-14 md:pb-0">
              
              <Navbar />
              <CartDrawer />
              <AuthModal />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/track" element={<OrderTrackingPage />} />
                  <Route path="/dashboard" element={<FarmerDashboardPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/crop-doctor" element={<CropDoctorPage />} />
                  <Route path="/presentation" element={<PresentationDeckPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                </Routes>
              </main>

              <Footer />
              <MobileBottomNav />

            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
