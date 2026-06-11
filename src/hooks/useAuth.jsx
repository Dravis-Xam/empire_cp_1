// src/hooks/useAuth.js
import { useAuthContext } from '../context/AuthContext';


  // Login
export const handleLogin = async (payload) => {
  const result = await login(payload);
  if (result.success) {
      console.log('Logged in:', result.user);
  } else {
      console.error('Login failed:', result.error);
  }
};

// Register
export const handleRegister = async (payload) => {
  const result = await register(payload);
};

// Google Login
export const handleGoogleLogin = () => {
  loginWithGoogle(); // Redirects to Google OAuth
};

export const handleFacebookLogin = () => {
  loginWithFacebook();
}

// Logout
export const handleLogout = async () => {
  await logout();
};


const useAuth = () => {
  const auth = useAuthContext();
  return auth;
};

export default useAuth;