// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, 
  FiUserPlus, FiShield, FiAlertCircle, FiX, 
  FiTarget, FiZap, FiArrowRight, FiShoppingCart, FiTrendingUp
} from 'react-icons/fi';
import { 
  FcGoogle, 
  FcBusinessman, 
  FcBusiness
} from 'react-icons/fc';
import { FaRocket, FaMicrochip, FaBolt, FaFacebook } from 'react-icons/fa';
import { IoMdFlash } from 'react-icons/io';
import useAuth from '../hooks/useAuth';
import '../styles/AuthPage.css';

const AuthPage = () => {
  // Use authorization methods extracted from your custom context module
  const { login, register, loading, error, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [funFactIndex, setFunFactIndex] = useState(0);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'user',
  });
  const [formError, setFormError] = useState('');
  const [showError, setShowError] = useState(true);

  const funFacts = [
    { icon: <FaMicrochip />, text: "Latest Intel & AMD processors in stock!" },
    { icon: <FiZap />, text: "Free shipping on orders over $50" },
    { icon: <FaRocket />, text: "24/7 tech support for all your electronics" },
    { icon: <FiShield />, text: "2-year warranty on all products" },
    { icon: <FiTarget />, text: "Price match guarantee on electronics" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFunFactIndex((prev) => (prev + 1) % funFacts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [funFacts.length]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormError('');
    setShowError(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (isLogin) {
      if (!formData.username || !formData.password) {
        setFormError('Please enter both username and password');
        setShowError(true);
        return;
      }

      const result = await login({
        username: formData.username,
        password: formData.password,
      });

      if (!result.success) {
        setFormError(result.error || 'Invalid credentials. Please try again.');
        setShowError(true);
      }
    } else {
      if (!formData.username || !formData.password || !formData.name || !formData.email) {
        setFormError('All fields are required');
        setShowError(true);
        return;
      }

      if (formData.password.length < 6) {
        setFormError('Password must be at least 6 characters');
        setShowError(true);
        return;
      }

      const result = await register({
        username: formData.username,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });

      if (!result.success) {
        setFormError(result.error || 'Registration failed. Please try again.');
        setShowError(true);
      }
    }
  };

  if (isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="redirect-card">
          <div className="redirect-icon">
            <FiShoppingCart />
          </div>
          <h2>Welcome to Empire Hub!</h2>
          <p>Redirecting you to the electronics store...</p>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Left Side Banner Display Block */}
        <div className="brand-section">
          <div className="brand-content">
            <div className="logo">
              <IoMdFlash className="logo-icon" />
              <span className="logo-text">Empire Hub</span>
              <span className="logo-badge">Electronics</span>
            </div>
            <h1 className="brand-title">
              {isLogin ? 'Power up your account' : 'Join the tech revolution'}
            </h1>
            <p className="brand-subtitle">
              {isLogin 
                ? 'Access your dashboard and track your electronics' 
                : 'Get the best deals on laptops, phones, and gadgets'}
            </p>
            <div className="stats">
              <div className="stat">
                <FiTrendingUp className="stat-icon" />
                <span>10K+ Happy Customers</span>
              </div>
              <div className="stat">
                <FaBolt className="stat-icon" />
                <span>Fast Delivery</span>
              </div>
            </div>
            <div className="fun-fact">
              <div className="fun-fact-icon">
                {funFacts[funFactIndex].icon}
              </div>
              <p className="fun-fact-text">{funFacts[funFactIndex].text}</p>
            </div>
          </div>
        </div>

        {/* Right Side Form Action Container Block */}
        <div className="form-section">
          <div className="form-wrapper">
            <div className="form-header">
              <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
              <p className="form-subtitle">
                {isLogin ? 'Welcome back to Empire Hub!' : 'Create your account to start shopping'}
              </p>
            </div>

            {(error || formError) && showError && (
              <div className="error-message">
                <FiAlertCircle className="error-icon" />
                <span>{error || formError}</span>
                <button 
                  onClick={() => setShowError(false)} 
                  className="hide-error-btn"
                  aria-label="Hide error"
                >
                  <FiX />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <>
                  <div className="form-group">
                    <div className={`input-wrapper ${focusedField === 'name' || formData.name ? 'focused' : ''}`}>
                      <FcBusinessman className="input-icon" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder=" "
                        disabled={loading}
                        required={!isLogin}
                      />
                      <label htmlFor="name" className="floating-label">Full Name</label>
                      <div className="input-underline"></div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className={`input-wrapper ${focusedField === 'email' || formData.email ? 'focused' : ''}`}>
                      <FiMail className="input-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder=" "
                        disabled={loading}
                        required={!isLogin}
                      />
                      <label htmlFor="email" className="floating-label">Email Address</label>
                      <div className="input-underline"></div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className={`input-wrapper ${focusedField === 'role' || formData.role ? 'focused' : ''}`}>
                      <FcBusiness className="input-icon" />
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('role')}
                        onBlur={() => setFocusedField(null)}
                        disabled={loading}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Administrator</option>
                      </select>
                      <label htmlFor="role" className="floating-label">Role</label>
                      <div className="input-underline"></div>
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <div className={`input-wrapper ${focusedField === 'username' || formData.username ? 'focused' : ''}`}>
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    disabled={loading}
                    required
                  />
                  <label htmlFor="username" className="floating-label">Username</label>
                  <div className="input-underline"></div>
                </div>
              </div>

              <div className="form-group">
                <div className={`input-wrapper ${focusedField === 'password' || formData.password ? 'focused' : ''}`}>
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    disabled={loading}
                    required
                  />
                  <label htmlFor="password" className="floating-label">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                  <div className="input-underline"></div>
                </div>
                {!isLogin && (
                  <small className="form-hint">Must be at least 6 characters</small>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {isLogin ? <FiLogIn /> : <FiUserPlus />}
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <span>Or continue with</span>
            </div>

            {/* Identity Gateways using direct anchor structures to avoid script-level 401 exceptions */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              gap: "12px",
              flexFlow: "row nowrap"
            }}>
              <a
                href="https://empire-backend-app.onrender.com/api/auth/google"
                className="google-btn"
                style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.6 : 1 }}
              >
                <FcGoogle className="google-icon" />
                Google
              </a>

              <a
                href="https://empire-backend-app.onrender.com/api/auth/facebook"
                className="facebook-btn"
                style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.6 : 1 }}
              >
                <FaFacebook className="facebook-icon" />
                Facebook
              </a>
            </div>

            <div className="switch-container">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormError('');
                    setShowError(true);
                    setFormData({
                      username: '',
                      password: '',
                      name: '',
                      email: '',
                      role: 'user',
                    });
                  }}
                  className="switch-mode-btn"
                >
                  {isLogin ? 'Create one' : 'Sign in'}
                  <FiArrowRight className="switch-icon" />
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;