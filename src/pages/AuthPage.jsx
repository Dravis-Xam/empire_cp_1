// src/pages/AuthPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, 
  FiUserPlus, FiShield, FiAlertCircle, FiCheckCircle,
  FiTarget, FiZap, FiArrowRight, FiX, FiCpu, FiMonitor,
  FiShoppingCart, FiTrendingUp
} from 'react-icons/fi';
import { FcGoogle, FcBusinessman, FcBusiness } from 'react-icons/fc';
import { FaRocket, FaLock, FaMicrochip, FaBolt, FaFacebook } from 'react-icons/fa';
import { IoMdFlash } from 'react-icons/io';
import { MdOutlineElectricalServices, MdOutlineSecurity } from 'react-icons/md';
import useAuth from '../hooks/useAuth';
import '../styles/AuthPage.css';

const AuthPage = () => {
  const { login, register, loginWithGoogle, loading, error, isAuthenticated, loginWithFacebook } = useAuth();
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
  
  // Animation states for switching between login/signup
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchDirection, setSwitchDirection] = useState(null); // 'toSignup' or 'toLogin'
  
  // Caterpillar animation states
  const [caterpillarPos, setCaterpillarPos] = useState({ x: 20, y: 20 });
  const [caterpillarBlink, setCaterpillarBlink] = useState(false);
  const [caterpillarEyesClosed, setCaterpillarEyesClosed] = useState(false);
  const [caterpillarMoving, setCaterpillarMoving] = useState(true);
  const caterpillarRef = useRef(null);
  const stageRef = useRef(null);
  const moveIntervalRef = useRef(null);
  const stopTimeoutRef = useRef(null);

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
  }, []);

  // Caterpillar movement logic
  const moveCaterpillar = useCallback(() => {
    if (!stageRef.current || !caterpillarMoving) return;
    
    const stage = stageRef.current;
    const maxX = stage.clientWidth - 70;
    const maxY = stage.clientHeight - 70;
    
    const newX = Math.max(0, Math.min(maxX, Math.random() * maxX));
    const newY = Math.max(0, Math.min(maxY, Math.random() * maxY));
    
    setCaterpillarPos({ x: newX, y: newY });
    
    // Randomly decide to stop for a bit
    if (Math.random() < 0.3) {
      setCaterpillarMoving(false);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = setTimeout(() => {
        setCaterpillarMoving(true);
      }, 1500 + Math.random() * 2000);
    }
    
    // Random blink
    if (Math.random() < 0.2) {
      setCaterpillarBlink(true);
      setTimeout(() => setCaterpillarBlink(false), 150);
    }
  }, [caterpillarMoving]);
  
  useEffect(() => {
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    moveIntervalRef.current = setInterval(() => {
      if (caterpillarMoving) {
        moveCaterpillar();
      }
    }, 2800);
    
    return () => {
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    };
  }, [caterpillarMoving, moveCaterpillar]);
  
  // Close caterpillar eyes when password field is focused
  useEffect(() => {
    if (focusedField === 'password') {
      setCaterpillarEyesClosed(true);
    } else {
      setCaterpillarEyesClosed(false);
    }
  }, [focusedField]);
  
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

  const handleSwitchMode = () => {
    if (isSwitching) return;
    setIsSwitching(true);
    setSwitchDirection(isLogin ? 'toSignup' : 'toLogin');
    
    setTimeout(() => {
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
      
      setTimeout(() => {
        setIsSwitching(false);
        setSwitchDirection(null);
      }, 100);
    }, 400);
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
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

  // Caterpillar SVG Component
  const Caterpillar = () => (
    <svg 
      width="60" 
      height="50" 
      viewBox="0 0 120 100" 
      style={{
        position: 'absolute',
        left: caterpillarPos.x,
        top: caterpillarPos.y,
        transition: 'left 2s ease-in-out, top 2s ease-in-out',
        filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.3))'
      }}
    >
      {/* Body segments */}
      <ellipse cx="30" cy="50" rx="18" ry="22" fill="#7CB342" />
      <ellipse cx="55" cy="48" rx="16" ry="20" fill="#8BC34A" />
      <ellipse cx="78" cy="46" rx="15" ry="19" fill="#9CCC65" />
      <ellipse cx="98" cy="44" rx="14" ry="17" fill="#AED581" />
      
      {/* Head */}
      <circle cx="110" cy="42" r="16" fill="#7CB342" />
      
      {/* Eyes */}
      {!caterpillarEyesClosed ? (
        <>
          <circle cx="105" cy="38" r="4" fill="white" />
          <circle cx="115" cy="38" r="4" fill="white" />
          <circle cx="106" cy="38" r="2" fill="black" className={caterpillarBlink ? 'blink' : ''} />
          <circle cx="116" cy="38" r="2" fill="black" className={caterpillarBlink ? 'blink' : ''} />
        </>
      ) : (
        <>
          <path d="M102 40 Q105 38 108 40" stroke="black" strokeWidth="2" fill="none" />
          <path d="M112 40 Q115 38 118 40" stroke="black" strokeWidth="2" fill="none" />
        </>
      )}
      
      {/* Antennae */}
      <line x1="105" y1="28" x2="100" y2="15" stroke="#558B2F" strokeWidth="2" />
      <line x1="115" y1="28" x2="120" y2="15" stroke="#558B2F" strokeWidth="2" />
      <circle cx="100" cy="15" r="3" fill="#FF7043" />
      <circle cx="120" cy="15" r="3" fill="#FF7043" />
      
      {/* Smile */}
      <path d="M105 48 Q110 54 115 48" stroke="#33691E" strokeWidth="1.5" fill="none" />
      
      {/* Spots on body */}
      <circle cx="25" cy="45" r="3" fill="#558B2F" opacity="0.5" />
      <circle cx="35" cy="55" r="2.5" fill="#558B2F" opacity="0.5" />
      <circle cx="50" cy="42" r="3" fill="#558B2F" opacity="0.5" />
      <circle cx="60" cy="55" r="2.5" fill="#558B2F" opacity="0.5" />
      <circle cx="73" cy="40" r="2.5" fill="#558B2F" opacity="0.5" />
      <circle cx="82" cy="52" r="2.5" fill="#558B2F" opacity="0.5" />
    </svg>
  );

  // Login Child 1 Component (Welcome + Caterpillar)
  const LoginChild1 = () => (
    <div className={`welcome-area ${switchDirection === 'toSignup' ? 'slide-down-exit' : ''}`}>
      <h1 className="welcome-title">Welcome Back</h1>
      <p className="welcome-sub">Ready to continue your tech journey?</p>
      <div className="caterpillar-stage" ref={stageRef}>
        <div className="caterpillar">
          <Caterpillar />
        </div>
      </div>
    </div>
  );

  // Login Child 2 Component (Form)
  const LoginChild2 = () => (
    <div className={`form-area ${switchDirection === 'toSignup' ? 'morph-to-right' : ''}`}>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group floating-group">
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

        <div className="form-group floating-group">
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
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            <div className="input-underline"></div>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <><div className="spinner"></div>Processing...</> : <><FiLogIn />Sign In</>}
        </button>
      </form>
      
      <div className="divider"><span>Or continue with</span></div>
      
      <div style={{ display: "flex", gap: "12px" }}>
        <a href="https://empire-backend-app.onrender.com/api/auth/google" className="google-btn">
          <FcGoogle /> Google
        </a>
        <a href="https://empire-backend-app.onrender.com/api/auth/facebook" className="facebook-btn">
          <FaFacebook /> Facebook
        </a>
      </div>
    </div>
  );

  // Signup Child 1 Component (Form - slides from bottom)
  const SignupChild1 = () => (
    <div className={`form-area ${switchDirection === 'toLogin' ? 'slide-right-exit' : switchDirection === 'toSignup' ? 'slide-from-bottom' : ''}`}>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group floating-group">
          <div className={`input-wrapper ${focusedField === 'name' || formData.name ? 'focused' : ''}`}>
            <FcBusinessman className="input-icon" />
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
              onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} placeholder=" " disabled={loading} required />
            <label htmlFor="name" className="floating-label">Full Name</label>
            <div className="input-underline"></div>
          </div>
        </div>

        <div className="form-group floating-group">
          <div className={`input-wrapper ${focusedField === 'email' || formData.email ? 'focused' : ''}`}>
            <FiMail className="input-icon" />
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
              onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} placeholder=" " disabled={loading} required />
            <label htmlFor="email" className="floating-label">Email Address</label>
            <div className="input-underline"></div>
          </div>
        </div>

        <div className="form-group floating-group">
          <div className={`input-wrapper ${focusedField === 'username' || formData.username ? 'focused' : ''}`}>
            <FiUser className="input-icon" />
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange}
              onFocus={() => setFocusedField('username')} onBlur={() => setFocusedField(null)} placeholder=" " disabled={loading} required />
            <label htmlFor="username" className="floating-label">Username</label>
            <div className="input-underline"></div>
          </div>
        </div>

        <div className="form-group floating-group">
          <div className={`input-wrapper ${focusedField === 'password' || formData.password ? 'focused' : ''}`}>
            <FiLock className="input-icon" />
            <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange}
              onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} placeholder=" " disabled={loading} required />
            <label htmlFor="password" className="floating-label">Password</label>
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            <div className="input-underline"></div>
          </div>
          <small className="form-hint">Must be at least 6 characters</small>
        </div>

        <div className="form-group floating-group">
          <div className={`input-wrapper ${focusedField === 'role' || formData.role ? 'focused' : ''}`}>
            <FcBusiness className="input-icon" />
            <select id="role" name="role" value={formData.role} onChange={handleChange}
              onFocus={() => setFocusedField('role')} onBlur={() => setFocusedField(null)} disabled={loading}>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Administrator</option>
            </select>
            <label htmlFor="role" className="floating-label">Role</label>
            <div className="input-underline"></div>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <><div className="spinner"></div>Processing...</> : <><FiUserPlus />Create Account</>}
        </button>
      </form>
      
      <div className="divider"><span>Or continue with</span></div>
      
      <div style={{ display: "flex", gap: "12px" }}>
        <a href="https://empire-backend-app.onrender.com/api/auth/google" className="google-btn">
          <FcGoogle /> Google
        </a>
        <a href="https://empire-backend-app.onrender.com/api/auth/facebook" className="facebook-btn">
          <FaFacebook /> Facebook
        </a>
      </div>
    </div>
  );

  // Signup Child 2 Component (Welcome message + Caterpillar)
  const SignupChild2 = () => (
    <div className={`welcome-area ${switchDirection === 'toLogin' ? 'slide-down-exit' : switchDirection === 'toSignup' ? 'slide-from-bottom' : ''}`}>
      <h1 className="welcome-title">Welcome to Empire Hub Phones</h1>
      <p className="welcome-sub">Join our tech community today!</p>
      <div className="caterpillar-stage" ref={stageRef}>
        <div className="caterpillar">
          <Caterpillar />
        </div>
      </div>
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-glass-card">
        <div className="auth-two-children">
          {/* LEFT PANEL - Child 1 for Login, Child 2 for Signup */}
          <div className="panel left-panel">
            {isLogin ? <LoginChild1 /> : <SignupChild2 />}
          </div>
          
          {/* RIGHT PANEL - Child 2 for Login, Child 1 for Signup */}
          <div className="panel right-panel">
            {(error || formError) && showError && (
              <div className="error-message">
                <FiAlertCircle className="error-icon" />
                <span>{error || formError}</span>
                <button onClick={() => setShowError(false)} className="hide-error-btn">
                  <FiX />
                </button>
              </div>
            )}
            
            {isLogin ? <LoginChild2 /> : <SignupChild1 />}
            
            <div className="switch-container">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={handleSwitchMode} className="switch-mode-btn" disabled={isSwitching}>
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