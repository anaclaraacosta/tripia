import { createContext, useContext } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
};

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => string | true;
  register: (name: string, email: string, password?: string) => string | true;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
