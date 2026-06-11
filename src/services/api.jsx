// src/services/api.js
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'https://empire-backend-app.onrender.com/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      credentials: 'include', // Important for cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Request failed');
    }

    // Check if response has content
    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  register(userData) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  login(credentials) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  googleLogin() {
    const targetUrl = `${this.baseURL}/auth/google`;
    // Force clean top-level window traversal
    window.location.href = new URL(targetUrl).href;
  }

  facebookLogin() {
    const targetUrl = `${this.baseURL}/auth/facebook`;
    window.location.href = new URL(targetUrl).href;
  }
  logout() {
    return this.request('/logout', {
      method: 'POST',
    });
  }

  getCurrentUser() {
    return this.request('/user');
  }
}

export default new ApiService();