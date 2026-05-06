import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const Training = lazy(() => import('./pages/Training'));
const Highlights = lazy(() => import('./pages/Highlights'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const ManagementPortal = lazy(() => import('./pages/ManagementPortal'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
import PageTransition from './components/PageTransition';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={
        <div className="h-screen flex items-center justify-center bg-vanilla">
          <div className="w-16 h-16 border-4 border-white-gold/20 border-t-white-gold rounded-full animate-spin" />
        </div>
      }>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/catalog" element={<PageTransition><Catalog /></PageTransition>} />
          <Route path="/cake/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
          <Route path="/management-node-v2" element={<PageTransition><ManagementPortal /></PageTransition>} />
          <Route path="/highlights" element={<PageTransition><Highlights /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
          <Route path="/training" element={<PageTransition><Training /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-vanilla">
            <Navbar />
            <main className="flex-grow">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </CartProvider>
      </ToastProvider>
    </Router>
  );
}
