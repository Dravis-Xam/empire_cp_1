// src/App.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';

const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const InfoPage = lazy(() => import('./pages/InfoPage'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<div className="page-loading">Loading...</div>}>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/shop" element={
                <ProtectedRoute>
                  <ShopPage />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/about" element={<InfoPage />} />
              <Route path="/contact" element={<InfoPage />} />
              <Route path="/faqs" element={<InfoPage />} />
              <Route path="/shipping" element={<InfoPage />} />
              <Route path="/returns" element={<InfoPage />} />
              <Route path="/track-order" element={<InfoPage />} />
              <Route path="/warranty" element={<InfoPage />} />
              <Route path="/delivery" element={<InfoPage />} />
              <Route path="/support" element={<InfoPage />} />
              <Route path="/privacy" element={<InfoPage />} />
              <Route path="/terms" element={<InfoPage />} />
              <Route path="/cookies" element={<InfoPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;