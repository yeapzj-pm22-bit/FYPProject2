class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    this.token = localStorage.getItem('authToken');
    this.debug = process.env.NODE_ENV === 'development';
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('authToken');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Enhanced request method with comprehensive logging
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    // Default headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Add authorization header if token exists
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    // Merge headers
    const headers = {
      ...defaultHeaders,
      ...options.headers
    };

    const config = {
      ...options,
      headers
    };

    // Debug logging
    if (this.debug) {
      console.log('🌐 API Request:', {
        method: config.method || 'GET',
        url,
        headers: {
          ...headers,
          Authorization: headers.Authorization ? '[TOKEN]' : undefined
        },
        body: config.body ? this.safeParseJSON(config.body) : undefined
      });
    }

    try {
      const response = await fetch(url, config);

      // Log response details
      if (this.debug) {
        console.log('📡 API Response Status:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          ok: response.ok
        });
      }

      // Handle different content types
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (this.debug) {
        console.log('📥 API Response Data:', data);
      }

      // Handle HTTP errors
      if (!response.ok) {
        const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;

        if (this.debug) {
          console.error('❌ API Error:', {
            status: response.status,
            statusText: response.statusText,
            message: errorMessage,
            data
          });
        }

        // Handle specific status codes
        if (response.status === 401) {
          this.clearToken();
          window.location.href = '/login';
          throw new Error('Authentication expired. Please login again.');
        }

        if (response.status === 400 && data?.errors) {
          // Handle validation errors
          const validationErrors = data.errors.map(err => `${err.param}: ${err.msg}`).join(', ');
          throw new Error(`Validation failed: ${validationErrors}`);
        }

        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      if (this.debug) {
        console.error('❌ API Request Failed:', {
          url,
          method: config.method || 'GET',
          error: error.message,
          stack: error.stack
        });
      }

      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }

      // Re-throw the error with context
      throw error;
    }
  }

  // Safe JSON parsing for logging
  safeParseJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      // Hide sensitive data in logs
      if (parsed.password) parsed.password = '[HIDDEN]';
      if (parsed.signature && parsed.signature.length > 40) {
        parsed.signature = `${parsed.signature.substring(0, 20)}...`;
      }
      if (parsed.blindedMessage && parsed.blindedMessage.length > 40) {
        parsed.blindedMessage = `${parsed.blindedMessage.substring(0, 20)}...`;
      }
      return parsed;
    } catch (e) {
      return jsonString;
    }
  }

  // =====================================================
  // AUTHENTICATION ENDPOINTS
  // =====================================================

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout request failed:', error.message);
    } finally {
      this.clearToken();
    }
  }

  async getBlindSignatureParams() {
    return await this.request('/auth/blind-signature-params');
  }

  async forgotPassword(email) {
    return await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async resetPassword(data) {
    return await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async refreshToken(refreshToken) {
    const response = await this.request('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  // =====================================================
  // USER MANAGEMENT ENDPOINTS
  // =====================================================

  async getCurrentUser() {
    return await this.request('/users/profile');
  }

  async updateProfile(profileData) {
    return await this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async changePassword(passwordData) {
    return await this.request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    });
  }

  // =====================================================
  // APPOINTMENT ENDPOINTS
  // =====================================================

  async getAppointments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/appointments${queryString ? `?${queryString}` : ''}`);
  }

  async createAppointment(appointmentData) {
    return await this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });
  }

  async updateAppointment(appointmentId, appointmentData) {
    return await this.request(`/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData)
    });
  }

  async cancelAppointment(appointmentId, reason) {
    return await this.request(`/appointments/${appointmentId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  // =====================================================
  // MEDICAL RECORDS ENDPOINTS
  // =====================================================

  async getMedicalRecords(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/medical-records${queryString ? `?${queryString}` : ''}`);
  }

  async getMedicalRecord(recordId) {
    return await this.request(`/medical-records/${recordId}`);
  }

  // =====================================================
  // DOCTOR ENDPOINTS
  // =====================================================

  async getDoctors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/doctors${queryString ? `?${queryString}` : ''}`);
  }

  async getDoctorSchedule(doctorId, date) {
    return await this.request(`/doctors/${doctorId}/schedule?date=${date}`);
  }

  // =====================================================
  // PRESCRIPTION ENDPOINTS
  // =====================================================

  async getPrescriptions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/prescriptions${queryString ? `?${queryString}` : ''}`);
  }

  async getPrescription(prescriptionId) {
    return await this.request(`/prescriptions/${prescriptionId}`);
  }

  // =====================================================
  // FILE UPLOAD ENDPOINTS
  // =====================================================

  async uploadFile(file, type = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return await this.request('/files/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type header to let browser set it with boundary for FormData
        'Content-Type': undefined
      }
    });
  }

  // =====================================================
  // HEALTH CHECK
  // =====================================================

  async healthCheck() {
    try {
      const response = await this.request('/health');
      return { healthy: true, ...response };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  // =====================================================
  // DEBUG ENDPOINTS (Development only)
  // =====================================================

  async debugValidation(data) {
    if (this.debug) {
      return await this.request('/auth/debug-validation', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    }
    throw new Error('Debug endpoints only available in development');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;