// utils/api.js - FULL UPDATED CODE
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Set token for authenticated requests
  setToken(token) {
    localStorage.setItem('token', token);
    console.log('[API] Token stored in localStorage');
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }

  // Remove token
  removeToken() {
    localStorage.removeItem('token');
    console.log('[API] Token removed from localStorage');
  }

  // Helper method for making API calls
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();
    
    console.log(`[API] Request to: ${endpoint}`);
    console.log(`[API] Token exists: ${!!token}`);
    console.log(`[API] Full URL: ${url}`);
    
    // Default options with credentials included
    const defaultOptions = {
      credentials: 'include', // Important for CORS with cookies
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    };

    // Add Authorization header if token exists
    if (token) {
      defaultOptions.headers['Authorization'] = `Bearer ${token}`;
      console.log(`[API] Authorization header added: Bearer ${token.substring(0, 20)}...`);
    }

    // Merge any custom headers from options
    if (options.headers) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        ...options.headers
      };
    }

    try {
      console.log('[API] Sending request with options:', {
        method: defaultOptions.method,
        headers: defaultOptions.headers,
        hasBody: !!defaultOptions.body
      });

      const response = await fetch(url, defaultOptions);
      
      console.log(`[API] Response status: ${response.status} ${response.statusText}`);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.log('[API] 401 Unauthorized - removing token');
        this.removeToken();
        throw new Error('Unauthorized - Please login again');
      }

      const data = await response.json();
      console.log('[API] Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('[API] Request Error:', error.message);
      throw error;
    }
  }

  // Test connection to backend
  async testConnection() {
    try {
      console.log('[API] Testing backend connection...');
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      console.log('[API] Connection test result:', data);
      return data;
    } catch (error) {
      console.error('[API] Backend connection test failed:', error);
      return { status: 'error', message: 'Backend not reachable' };
    }
  }

  // Authentication - UPDATED
  async login(credentials) {
    console.log('[API] Login attempt with:', { 
      saIdNumber: credentials.saIdNumber,
      passwordLength: credentials.password?.length 
    });
    
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      console.log('[API] Login response:', response);
      
      // Store token if returned in different possible locations
      if (response.token) {
        this.setToken(response.token);
      } else if (response.data && response.data.token) {
        this.setToken(response.data.token);
      } else if (response.accessToken) {
        this.setToken(response.accessToken);
      } else {
        console.warn('[API] No token found in login response');
      }
      
      return response;
    } catch (error) {
      console.error('[API] Login failed:', error);
      throw error;
    }
  }

  async register(userData) {
    console.log('[API] Register attempt for:', userData.email);
    
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      console.log('[API] Register response:', response);
      
      // Store token if returned (some backends auto-login after register)
      if (response.token) {
        this.setToken(response.token);
      } else if (response.data && response.data.token) {
        this.setToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('[API] Registration failed:', error);
      throw error;
    }
  }

  // User Profile
  async getProfile() {
    console.log('[API] Getting user profile');
    return this.request('/user/profile');
  }

  async updateProfile(profileData) {
    console.log('[API] Updating profile');
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Transactions
  async getTransactions() {
    console.log('[API] Getting transactions');
    return this.request('/transactions');
  }

  async createTransaction(transactionData) {
    console.log('[API] Creating transaction');
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData)
    });
  }

  // Logout
  logout() {
    console.log('[API] Logging out');
    this.removeToken();
    
    // Optional: Call backend logout endpoint if you have one
    // this.request('/auth/logout', { method: 'POST' });
  }

  // Debug method to check current state
  debug() {
    return {
      baseUrl: this.baseUrl,
      hasToken: !!this.getToken(),
      tokenPreview: this.getToken() ? `${this.getToken().substring(0, 20)}...` : 'None',
      localStorage: {
        token: localStorage.getItem('token') || 'None'
      }
    };
  }
}

const apiService = new ApiService();
export default apiService;
