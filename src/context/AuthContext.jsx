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
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginSave, setLoginSave] = useState(() => {
    const saved = localStorage.getItem("savedlogin");

    return saved
      ? JSON.parse(saved)
      : {
          id: null,
          isAuthenticated: false,
        };
  });

  // Intercept the token parameter BEFORE making our backend calls
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      // 1. Commit token directly to storage
      localStorage.setItem('token', tokenFromUrl);

      // 2. Remove the token query from the URL
      urlParams.delete('token');
      const newSearch = urlParams.toString();
      const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
      window.history.replaceState({}, document.title, newUrl);
    }

    // 3. Now run the profile verification check safely
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    const savedLogin = JSON.parse(
      localStorage.getItem("savedlogin") || "{}"
    );

    const cachedUser = JSON.parse(
      localStorage.getItem('user') || 'null'
    );

    if (cachedUser) {
      setUser(cachedUser);
      setLoading(false);
    }

    // Neither token nor previous login exists
    if (!token && !savedLogin?.isAuthenticated) {
      setUser(null);
      setLoading(false);
      return;
    }

    if (!navigator.onLine) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const currentUser = await api.getCurrentUser();

      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));

      const loginData = {
        id: currentUser.id,
        isAuthenticated: true,
      };

      setLoginSave(loginData);
      localStorage.setItem(
        "savedlogin",
        JSON.stringify(loginData)
      );

      setError(null);
    } catch (err) {
      setUser(null);

      localStorage.removeItem("savedlogin");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setLoginSave({
        id: null,
        isAuthenticated: false,
      });

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const newUser = await api.register(userData);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      if (newUser?.token) {
        localStorage.setItem('token', newUser.token);
      }
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
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      if (loggedInUser?.token) {
        localStorage.setItem('token', loggedInUser.token);
      }
      setError(null);
      const loginData = {
        id: loggedInUser.id,
        isAuthenticated: true,
      };

      setLoginSave(loginData);
      localStorage.setItem("savedlogin", JSON.stringify(loginData));
      return { success: true, user: loggedInUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (credentials) => {
    try {
      setLoading(true);
      const updatedUser = await api.updateUser(credentials);
      setUser(updatedUser);
      setError(null);
      return {
        success: true,
        user: updatedUser,
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }

  const loginWithGoogle = () => {
    api.googleLogin();
  };

  const loginWithFacebook = () => {
    api.facebookLogin();    
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.logout();
      setUser(null);
      localStorage.removeItem("savedlogin");
      localStorage.removeItem("token");
      localStorage.removeItem('user');

      setLoginSave({
        id: null,
        isAuthenticated: false,
      });
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
    updateUser,
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