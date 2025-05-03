export interface User {
  _id: string;
  name: string;
  email: string;
  dateOfBirth?: string;
  username?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
  count?: number;
  users?: User[];
  data?: T;
}

export interface AuthResponse {
  user: User;
  token: string;
}