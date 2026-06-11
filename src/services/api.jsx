// src/services/api.js
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'https://empire-backend-app.onrender.com/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    // 1. Pull the JWT token out of local storage
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // 2. If the token exists, attach it as an Authorization header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Request failed');
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  register(userData) {
    return this.request('/register', { method: 'POST', body: JSON.stringify(userData) });
  }

  login(credentials) {
    return this.request('/login', { method: 'POST', body: JSON.stringify(credentials) });
  }

  googleLogin() {
    window.location.assign(`${this.baseURL}/auth/google`);
  }

  facebookLogin() {
    window.location.assign(`${this.baseURL}/auth/facebook`);
  }

  logout() {
    // Clean local authentication tokens on a logout event
    localStorage.removeItem('token');
    return this.request('/logout', { method: 'POST' });
  }

  getCurrentUser() {
    return this.request('/user');
  }
}

export default new ApiService();