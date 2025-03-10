export interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  role: UserRole;
  isActive: boolean;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionId?: string;
  customerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TRIAL = 'trial',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
}

export interface UserRegistrationData {
  email: string;
  password: string;
  name: string;
  businessName?: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface UserUpdateData {
  name?: string;
  businessName?: string;
  email?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
} 