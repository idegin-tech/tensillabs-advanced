export interface User {
  id: string;
  email: string;
  emailVerified: Date | null;
  name: string | null;
  avatar: string | null;
  authProvider: 'GOOGLE' | 'MICROSOFT' | 'EMAIL';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  message: string;
  user?: Partial<User>;
  accessToken?: string;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  code?: string;
}

export interface ApiSuccess<T = any> {
  message: string;
  data?: T;
  timestamp: string;
}