/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ToastProvider } from './components/common/ToastProvider';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ChatWidget } from './components/chat/ChatWidget';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { MobileStickyCartBar } from './components/common/MobileStickyCartBar';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BrandsPage } from './pages/BrandsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OffersPage } from './pages/OffersPage';
import { SearchPage } from './pages/SearchPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { WishlistPage } from './pages/WishlistPage';
import { BeautySchoolPage } from './pages/BeautySchoolPage';
import { CareersPage } from './pages/CareersPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { CoreValuesPage } from './pages/CoreValuesPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { FaqPage } from './pages/FaqPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { PolicyPage } from './pages/PolicyPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Operations Dashboard
import { AdminDashboard } from './pages/admin/AdminDashboard';

import { PageTransition, RouteProgressBar } from './components/common/PageTransition';
import { ScrollToTopButton } from './components/common/ScrollToTopButton';

// Scroll to top upon route transition with smooth hash anchor support
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // If there's an anchor hash (e.g. #services), smoothly scroll to target
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
      return () => clearTimeout(timer);
    }
    // Instant reset to top on page navigation so transition animation starts from top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

function MainLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/dashboard/*" element={<AdminDashboard />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#601A24]/15 selection:text-[#601A24]">
      <RouteProgressBar />
      <Header />
      <main className="flex-1 flex flex-col">
        <PageTransition>
          <Routes location={location} key={location.pathname}>
            {/* Public Storefront */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:category" element={<ServicesPage />} />
            <Route path="/package/:slug" element={<ProductDetailPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/brands/:brand" element={<BrandsPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Customer Account */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<ProfilePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* Academy & Careers */}
            <Route path="/beauty-school" element={<BeautySchoolPage />} />
            <Route path="/careers" element={<CareersPage />} />

            {/* Company & Support */}
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/core-values" element={<CoreValuesPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />

            {/* Legal Policies */}
            <Route path="/privacy-policy" element={<PolicyPage />} />
            <Route path="/terms-of-sale" element={<PolicyPage />} />
            <Route path="/terms-of-use" element={<PolicyPage />} />
            <Route path="/reports-abuse" element={<PolicyPage />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <MainLayout />
          <ChatWidget />
          <WhatsAppButton variant="floating" />
          <MobileStickyCartBar />
        </BrowserRouter>
      </ToastProvider>
    </Provider>
  );
}
