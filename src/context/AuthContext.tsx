import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';

const DEFAULT_FALLBACK_USER: UserAccount = {
  id: 'usr-admin',
  name: 'Admin User',
  email: 'admin@alize.com',
  role: 'Company Admin',
  department: 'Administration',
  lastLogin: 'Just now',
  status: 'Active',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
};

interface AuthContextType {
  currentUser: UserAccount;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginAsDemoRole: (role: UserRole) => void;
  logout: () => void;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('alize_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) return parsed;
      } catch {
        // fallback
      }
    }
    return (MOCK_USERS && MOCK_USERS.length > 0 ? MOCK_USERS[0] : DEFAULT_FALLBACK_USER);
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('alize_auth_token') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('alize_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const login = async (email: string): Promise<boolean> => {
    await new Promise((res) => setTimeout(res, 200));
    const found = MOCK_USERS?.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
    } else {
      // create guest admin
      setCurrentUser({
        id: 'usr-custom',
        name: email.split('@')[0] || 'User',
        email,
        role: 'Company Admin',
        department: 'Operations',
        lastLogin: 'Just now',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      });
    }
    setIsAuthenticated(true);
    localStorage.setItem('alize_auth_token', 'true');
    return true;
  };

  const loginAsDemoRole = (role: UserRole) => {
    const user = MOCK_USERS?.find((u) => u.role === role) || (MOCK_USERS && MOCK_USERS.length > 0 ? MOCK_USERS[0] : {
      ...DEFAULT_FALLBACK_USER,
      role,
    });
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('alize_auth_token', 'true');
  };

  const switchUser = (userId: string) => {
    const user = MOCK_USERS?.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('alize_auth_token', 'false');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser || DEFAULT_FALLBACK_USER,
        isAuthenticated,
        login,
        loginAsDemoRole,
        logout,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
