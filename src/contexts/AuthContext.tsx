import { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext, type User } from './useAuth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const activeEmail = localStorage.getItem('tripia_active_user');
    if (activeEmail) {
      const db = JSON.parse(localStorage.getItem('tripia_users_db') || '{}');
      return db[activeEmail] || null;
    }
    return null;
  });

  const saveToDb = (u: User) => {
    const db = JSON.parse(localStorage.getItem('tripia_users_db') || '{}');
    db[u.email] = u;
    localStorage.setItem('tripia_users_db', JSON.stringify(db));
  };

  const login = (email: string, password?: string): string | true => {
    const db = JSON.parse(localStorage.getItem('tripia_users_db') || '{}');
    const existingUser = db[email];
    
    if (existingUser) {
      if (existingUser.password !== password) {
        return "Invalid email or password.";
      }
      setUser(existingUser);
      localStorage.setItem('tripia_active_user', email);
      return true;
    }
    
    return "Account not found. Please sign up.";
  };

  const register = (name: string, email: string, password?: string): string | true => {
    const db = JSON.parse(localStorage.getItem('tripia_users_db') || '{}');
    if (db[email]) {
      return "An account with this email already exists.";
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      phone: '',
      location: '',
      avatarUrl: ''
    };
    saveToDb(newUser);
    setUser(newUser);
    localStorage.setItem('tripia_active_user', email);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tripia_active_user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      saveToDb(updated);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}
