import axios from 'axios';
import { LoginCredentials, RegisterData, ApiResponse, AuthResponse } from '../types';

// Use the direct URL to the backend
const BASE_URL = 'https://quantum-it-odx0.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get('/api/users');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<any>;
    }
    return {
      success: false,
      message: 'Network error. Please try again later.',
    };
  }
};

export const login = async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
  try {
    // Fixed login endpoint - removed 'users' from the path
    const response = await api.post('/api/users/login', credentials);
    
    // Log the response for debugging
    console.log('Login response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<AuthResponse>;
    }
    return {
      success: false,
      message: 'Network error. Please try again later.',
    };
  }
};

export const register = async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await api.post('/api/users/register', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<AuthResponse>;
    }
    return {
      success: false,
      message: 'Network error. Please try again later.',
    };
  }
};

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const authState = localStorage.getItem('authState');
    if (authState) {
      const { token } = JSON.parse(authState);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;