import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { validateEmail, validatePassword } from '../utils/validation';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfileName: (newName: string) => void;
  adminResetPassword: (email: string, newPassword: string) => Promise<void>;
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

// Removed login attempt/lockout feature per security policy

// Predefined users with credentials (in production, this should be in a secure database)
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

  // Helpers for hashing passwords using Web Crypto API (hex string)
  const isHexHash = (value: string) => /^[a-f0-9]{64}$/i.test(value);
  const hashPassword = async (password: string): Promise<string> => {
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const bytes = Array.from(new Uint8Array(digest));
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Removed lockout/attempt initialization

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Restore any previously authenticated user (predefined or ad-hoc)
        setCurrentUser(user);
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const handleFailedLogin = useCallback(() => {}, []);
  const resetLoginAttempts = useCallback(() => {}, []);

  const login = async (email: string, password: string): Promise<User> => {
    // Input validation
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    if (!validatePassword(password)) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check predefined users first (migrate to hashed on first login)
    const predefinedUser = PREDEFINED_USERS.find(user => user.email === email);
    if (predefinedUser) {
      const storedPassword = userPasswords[email];
      const inputHash = await hashPassword(password);
      const matches = isHexHash(storedPassword)
        ? storedPassword === inputHash
        : storedPassword === password;
      if (matches) {
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
        // Migrate to hashed storage if needed
        if (!isHexHash(storedPassword)) {
          const updated = { ...userPasswords, [email]: inputHash };
          setUserPasswords(updated);
          localStorage.setItem('userPasswords', JSON.stringify(updated));
        }
        resetLoginAttempts();
        return user;
      } else {
        handleFailedLogin();
        throw new Error('Invalid email or password');
      }
    }

    // Strict auth: only allow existing users from stored user list
    try {
      const storedUsersRaw = localStorage.getItem('pcr_users');
      const storedUsers: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      const existing = storedUsers.find(u => u.email === email);
      if (!existing) {
        handleFailedLogin();
        throw new Error('Account not found or inactive');
      }
      const storedPassword = userPasswords[email];
      if (!storedPassword) {
        handleFailedLogin();
        throw new Error('Account not found or inactive');
      }
      const inputHash = await hashPassword(password);
      const ok = isHexHash(storedPassword)
        ? storedPassword === inputHash
        : storedPassword === password;
      if (!ok) {
        handleFailedLogin();
        throw new Error('Invalid email or password');
      }
      const user: User = existing;
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      // Migrate to hashed storage if needed
      if (!isHexHash(storedPassword)) {
        const updated = { ...userPasswords, [email]: inputHash };
        setUserPasswords(updated);
        localStorage.setItem('userPasswords', JSON.stringify(updated));
      }
      resetLoginAttempts();
      return user;
    } catch (e) {
      if (e instanceof Error) throw e;
      throw new Error('Authentication failed');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    // Input validation
    if (!validatePassword(newPassword)) {
      throw new Error('New password must be at least 6 characters long');
    }

    if (newPassword === currentPassword) {
      throw new Error('New password must be different from current password');
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify current password
    const storedPassword = userPasswords[currentUser.email];
    const currentHash = await hashPassword(currentPassword);
    const matches = isHexHash(storedPassword)
      ? storedPassword === currentHash
      : storedPassword === currentPassword;
    if (!matches) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    const newHash = await hashPassword(newPassword);
    const updatedPasswords = { ...userPasswords, [currentUser.email]: newHash };
    
    setUserPasswords(updatedPasswords);
    localStorage.setItem('userPasswords', JSON.stringify(updatedPasswords));
  };

  const updateProfileName = (newName: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, name: newName };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const adminResetPassword = async (email: string, newPassword: string) => {
    const newHash = await hashPassword(newPassword);
    const updated = { ...userPasswords, [email]: newHash };
    setUserPasswords(updated);
    localStorage.setItem('userPasswords', JSON.stringify(updated));
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    logout,
    changePassword,
    updateProfileName,
    adminResetPassword,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};