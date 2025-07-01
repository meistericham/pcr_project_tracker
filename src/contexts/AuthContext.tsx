import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Predefined users with credentials
const PREDEFINED_USERS = [
  {
    id: '1',
    name: 'Hisyamudin',
    email: 'hisyamudin@sarawaktourism.com',
    password: '11223344',
    role: 'super_admin' as const,
    initials: 'HS',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@company.com',
    password: 'demo123',
    role: 'super_admin' as const,
    initials: 'JD',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    password: 'demo123',
    role: 'admin' as const,
    initials: 'SC',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '4',
    name: 'Mike Johnson',
    email: 'mike@company.com',
    password: 'demo123',
    role: 'user' as const,
    initials: 'MJ',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPasswords, setUserPasswords] = useState<Record<string, string>>(() => {
    // Initialize with predefined passwords
    const passwords: Record<string, string> = {};
    PREDEFINED_USERS.forEach(user => {
      passwords[user.email] = user.password;
    });
    
    // Load any stored password changes
    const stored = localStorage.getItem('userPasswords');
    if (stored) {
      try {
        return { ...passwords, ...JSON.parse(stored) };
      } catch (error) {
        return passwords;
      }
    }
    return passwords;
  });

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Validate that the stored user still exists in our system
        const validUser = PREDEFINED_USERS.find(u => u.email === user.email);
        if (validUser) {
          setCurrentUser(user);
        } else {
          localStorage.removeItem('currentUser');
        }
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check predefined users first
    const predefinedUser = PREDEFINED_USERS.find(user => user.email === email);
    if (predefinedUser) {
      const storedPassword = userPasswords[email];
      if (storedPassword === password) {
        const user: User = {
          id: predefinedUser.id,
          name: predefinedUser.name,
          email: predefinedUser.email,
          role: predefinedUser.role,
          initials: predefinedUser.initials,
          createdAt: predefinedUser.createdAt
        };
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      } else {
        throw new Error('Invalid password');
      }
    }

    // For demo purposes, allow any other email/password combination
    const user: User = {
      id: Date.now().toString(),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role: 'user',
      initials: email.substring(0, 2).toUpperCase(),
      createdAt: new Date().toISOString()
    };

    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify current password
    const storedPassword = userPasswords[currentUser.email];
    if (storedPassword !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }

    // Update password
    const updatedPasswords = {
      ...userPasswords,
      [currentUser.email]: newPassword
    };
    
    setUserPasswords(updatedPasswords);
    localStorage.setItem('userPasswords', JSON.stringify(updatedPasswords));
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    logout,
    changePassword,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};