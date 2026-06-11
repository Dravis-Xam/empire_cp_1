// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check current user on mount
  // src/context/AuthContext.jsx

  // 1. Update the checkAuth method to read the token from storage
  const checkAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
      setError(null);
    } catch (err) {
      setUser(null);
      // If the token is invalid or missing, don't show a loud error on mount
      if (localStorage.getItem('token')) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Add a new useEffect inside AuthProvider to check the URL for a callback token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Save the token to local storage
      localStorage.setItem('token', token);
      
      // Clean up the URL bar so the token doesn't sit visible in the address bar
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Re-verify the user profile now that the token is present
      checkAuth();
    } else {
      // Regular app mount sequence
      checkAuth();
    }
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);
      const newUser = await api.register(userData);
      setUser(newUser);
      setError(null);
      return { success: true, user: newUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const loggedInUser = await api.login(credentials);
      setUser(loggedInUser);
      setError(null);
      return { success: true, user: loggedInUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    // This will redirect to Google OAuth
    // After successful login, user will be redirected back to your app
    api.googleLogin();
  };

  const loginWithFacebook = () => {
    api.facebookLogin();    
  }

  const logout = async () => {
    try {
      setLoading(true);
      await api.logout();
      setUser(null);
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};