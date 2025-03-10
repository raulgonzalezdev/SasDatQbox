export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  billing_address?: any;
  payment_method?: any;
  created_at: Date;
  updated_at: Date;
}

export interface UserInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  avatar_url?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 