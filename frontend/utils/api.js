const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
      credentials: 'include',
    };

    console.log(`API Request: ${endpoint}`, {
      url: `${API_BASE_URL}${endpoint}`,
      method: options.method || 'GET',
      body: options.body ? JSON.parse(options.body) : null
    });

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      // Check for network errors first
      if (!response.ok) {
        // Try to parse error response
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, get text
          const text = await response.text();
          if (text) errorMessage = text;
        }
        
        throw new Error(errorMessage);
      }

      // Parse successful response
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error(`API Fetch Error for ${endpoint}:`, error);
      
      // Re-throw with better error message
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    console.log('Login attempt with SA ID:', credentials.saIdNumber);
    
    try {
      const data = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      console.log('Login response:', data);
      
      if (data.success && data.data && data.data.token) {
        this.setToken(data.data.token);
        console.log('Token saved to localStorage');
      } else {
        throw new Error(data.message || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async getProfile() {
    console.log('Getting profile with token:', !!this.token);
    return this.request('/user/profile');
  }

  async updateProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Transaction endpoints
  async getTransactions() {
    return this.request('/transactions');
  }

  async createTransaction(transactionData) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async getAccountBalance(accountType) {
    return this.request(`/transactions/balance/${accountType}`);
  }

  // Test endpoint for debugging
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      console.log('Health check response:', {
        status: response.status,
        statusText: response.statusText
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      }
      
      return { success: false, status: response.status };
    } catch (error) {
      console.error('Health check failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Logout
  logout() {
    console.log('Logging out, clearing token');
    this.clearToken();
  }
}

export default new ApiService();