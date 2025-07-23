import React, { createContext, useContext, useState } from 'react';
import { Project, BudgetCode, BudgetEntry, Notification, ViewMode, AppSettings } from '../types';
import { supabase } from '../lib/supabase';

interface AppContextType {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  projects: Project[];
  budgetCodes: BudgetCode[];
  budgetEntries: BudgetEntry[];
  notifications: Notification[];
  settings: AppSettings;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addBudgetCode: (code: Omit<BudgetCode, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBudgetCode: (id: string, updates: Partial<BudgetCode>) => Promise<void>;
  deleteBudgetCode: (id: string) => Promise<void>;
  toggleBudgetCodeStatus: (id: string) => Promise<void>;
  addBudgetEntry: (entry: Omit<BudgetEntry, 'id' | 'createdAt'>) => Promise<void>;
  updateBudgetEntry: (id: string, updates: Partial<BudgetEntry>) => Promise<void>;
  deleteBudgetEntry: (id: string) => Promise<void>;
  getUnreadNotificationCount: () => number;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  users: any[];
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [budgetCodes, setBudgetCodes] = useState<BudgetCode[]>([]);
  const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [settings] = useState<AppSettings>({
    currency: 'MYR',
    dateFormat: 'DD/MM/YYYY',
    budgetAlertThreshold: 75,
    theme: 'system',
    smtpHost: '',
    smtpPort: 587,
    smtpSecurity: 'tls',
    smtpUsername: '',
    smtpPassword: '',
    smtpFromEmail: ''
  });

  // Project operations
  const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase.from('projects').insert([project]).select();
    if (error) throw error;
    setProjects([...projects, data[0]]);
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    setProjects(projects.filter(p => p.id !== id));
  };

  // Budget code operations
  const addBudgetCode = async (code: Omit<BudgetCode, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase.from('budget_codes').insert([code]).select();
    if (error) throw error;
    setBudgetCodes([...budgetCodes, data[0]]);
  };

  const updateBudgetCode = async (id: string, updates: Partial<BudgetCode>) => {
    const { data, error } = await supabase
      .from('budget_codes')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    setBudgetCodes(budgetCodes.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteBudgetCode = async (id: string) => {
    const { error } = await supabase.from('budget_codes').delete().eq('id', id);
    if (error) throw error;
    setBudgetCodes(budgetCodes.filter(c => c.id !== id));
  };

  const toggleBudgetCodeStatus = async (id: string) => {
    const code = budgetCodes.find(c => c.id === id);
    if (code) {
      await updateBudgetCode(id, { isActive: !code.isActive });
    }
  };

  // Budget entry operations
  const addBudgetEntry = async (entry: Omit<BudgetEntry, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase.from('budget_entries').insert([entry]).select();
    if (error) throw error;
    setBudgetEntries([...budgetEntries, data[0]]);
  };

  const updateBudgetEntry = async (id: string, updates: Partial<BudgetEntry>) => {
    const { data, error } = await supabase
      .from('budget_entries')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    setBudgetEntries(budgetEntries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteBudgetEntry = async (id: string) => {
    const { error } = await supabase.from('budget_entries').delete().eq('id', id);
    if (error) throw error;
    setBudgetEntries(budgetEntries.filter(e => e.id !== id));
  };

  // Notification operations
  const getUnreadNotificationCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const markNotificationAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    if (error) throw error;
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false);
    if (error) throw error;
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = async (id: string) => {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) throw error;
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const value = {
    currentView,
    setCurrentView,
    projects,
    budgetCodes,
    budgetEntries,
    notifications,
    settings,
    addProject,
    updateProject,
    deleteProject,
    addBudgetCode,
    updateBudgetCode,
    deleteBudgetCode,
    toggleBudgetCodeStatus,
    addBudgetEntry,
    updateBudgetEntry,
    deleteBudgetEntry,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    users,
    sidebarCollapsed,
    setSidebarCollapsed,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};