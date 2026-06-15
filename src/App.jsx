// src/App.js
import React, { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import useAuth from './hooks/useAuth';
import AuthPage from './pages/AuthPage';

const Homepage = lazy(() => import("./pages/HomePage"));

// Example protected component
const Dashboard = () => {
  return <Homepage />
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path='/cart' element = {
            <>
              <div>Cart</div>
            </>
          } />
          <Route path='/login' element = {
            <AuthPage />
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;