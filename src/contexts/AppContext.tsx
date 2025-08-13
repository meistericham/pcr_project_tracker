import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { User, Project, BudgetEntry, BudgetCode, ViewMode, AppSettings, Notification, Division, Unit } from '../types';

interface AppContextType {
  users: User[];
  divisions: Division[];
  units: Unit[];
  projects: Project[];
  budgetEntries: BudgetEntry[];
  budgetCodes: BudgetCode[];
  notifications: Notification[];
  settings: AppSettings;
  currentView: ViewMode;
  selectedProject: Project | null;
  sidebarCollapsed: boolean;
  setCurrentView: (view: ViewMode) => void;
  setSelectedProject: (project: Project | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addDivision: (division: Omit<Division, 'id' | 'createdAt'>) => void;
  updateDivision: (id: string, updates: Partial<Division>) => void;
  deleteDivision: (id: string) => void;
  addUnit: (unit: Omit<Unit, 'id' | 'createdAt'>) => void;
  updateUnit: (id: string, updates: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addBudgetEntry: (entry: Omit<BudgetEntry, 'id' | 'createdAt'>) => void;
  updateBudgetEntry: (id: string, updates: Partial<BudgetEntry>) => void;
  deleteBudgetEntry: (id: string) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addBudgetCode: (code: Omit<BudgetCode, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBudgetCode: (id: string, updates: Partial<BudgetCode>) => void;
  deleteBudgetCode: (id: string) => void;
  toggleBudgetCodeStatus: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  getUnreadNotificationCount: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Storage keys
const STORAGE_KEYS = {
  USERS: 'pcr_users',
  DIVISIONS: 'pcr_divisions',
  UNITS: 'pcr_units',
  PROJECTS: 'pcr_projects',
  BUDGET_ENTRIES: 'pcr_budget_entries',
  BUDGET_CODES: 'pcr_budget_codes',
  NOTIFICATIONS: 'pcr_notifications',
  SETTINGS: 'pcr_settings'
};

// Helper functions for localStorage
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Debounced save function
const createDebouncedSave = (key: string) => {
  let timeoutId: NodeJS.Timeout;
  return (data: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => saveToStorage(key, data), 300);
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Create debounced save functions
  const debouncedSaveUsers = React.useMemo(() => createDebouncedSave(STORAGE_KEYS.USERS), []);
  const debouncedSaveProjects = React.useMemo(() => createDebouncedSave(STORAGE_KEYS.PROJECTS), []);
  const debouncedSaveBudgetEntries = React.useMemo(() => createDebouncedSave(STORAGE_KEYS.BUDGET_ENTRIES), []);
  const debouncedSaveBudgetCodes = React.useMemo(() => createDebouncedSave(STORAGE_KEYS.BUDGET_CODES), []);
  const debouncedSaveNotifications = React.useMemo(() => createDebouncedSave(STORAGE_KEYS.NOTIFICATIONS), []);
  const debouncedSaveSettings = React.useMemo(() => createDebouncedSave(STORAGE_KEYS.SETTINGS), []);

  // Default settings
  const defaultSettings: AppSettings = {
    currency: 'MYR',
    dateFormat: 'DD/MM/YYYY',
    fiscalYearStart: 1, // January
    budgetAlertThreshold: 80,
    autoBackup: true,
    emailNotifications: true,
    companyName: 'PCR Company',
    defaultProjectStatus: 'planning',
    defaultProjectPriority: 'medium',
    budgetCategories: [
      'Design', 'Development', 'Marketing', 'Software', 'Research',
      'Advertising', 'Equipment', 'Travel', 'Training', 'Other'
    ],
    maxProjectDuration: 365,
    requireBudgetApproval: false,
    allowNegativeBudget: false
  };

  // Default initial data
  const defaultUsers: User[] = [
    {
      id: '1',
      name: 'Hisyamudin',
      email: 'hisyamudin@sarawaktourism.com',
      role: 'super_admin',
      initials: 'HS',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john@company.com',
      role: 'super_admin',
      initials: 'JD',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      role: 'admin',
      initials: 'SC',
      createdAt: '2024-01-02T00:00:00Z'
    },
    {
      id: '4',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      role: 'user',
      initials: 'MJ',
      createdAt: '2024-01-03T00:00:00Z'
    }
  ];

  const defaultBudgetCodes: BudgetCode[] = [
    {
      id: '1',
      code: '1-2345',
      name: 'Software Development',
      description: 'Budget allocation for software development activities including coding, testing, and deployment',
      budget: 500000,
      spent: 74000,
      isActive: true,
      createdBy: '1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      code: '2-1001',
      name: 'Marketing & Advertising',
      description: 'Budget for marketing campaigns, advertising, and promotional activities',
      budget: 300000,
      spent: 99200,
      isActive: true,
      createdBy: '1',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    },
    {
      id: '3',
      code: '3-5678',
      name: 'Equipment & Hardware',
      description: 'Purchase and maintenance of equipment, hardware, and infrastructure',
      budget: 150000,
      spent: 0,
      isActive: true,
      createdBy: '2',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z'
    },
    {
      id: '4',
      code: '4-9999',
      name: 'Training & Development',
      description: 'Employee training, workshops, and professional development programs',
      budget: 75000,
      spent: 0,
      isActive: false,
      createdBy: '1',
      createdAt: '2024-01-04T00:00:00Z',
      updatedAt: '2024-01-04T00:00:00Z'
    }
  ];

  const defaultProjects: Project[] = [
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design and improved UX',
      status: 'active',
      priority: 'high',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      budget: 200000,
      spent: 74000,
      unitId: 'u1',
      assignedUsers: ['2', '3'],
      budgetCodes: ['1', '2'],
      createdBy: '1',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z'
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Native iOS and Android app for customer engagement',
      status: 'planning',
      priority: 'medium',
      startDate: '2024-02-01',
      endDate: '2024-06-01',
      budget: 480000,
      spent: 20000,
      unitId: 'u2',
      assignedUsers: ['3', '4'],
      budgetCodes: ['1', '3'],
      createdBy: '1',
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    },
    {
      id: '3',
      name: 'Marketing Campaign Q1',
      description: 'Digital marketing campaign for Q1 product launch',
      status: 'completed',
      priority: 'high',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      budget: 100000,
      spent: 99200,
      unitId: 'u3',
      assignedUsers: ['2'],
      budgetCodes: ['2'],
      createdBy: '1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  const defaultBudgetEntries: BudgetEntry[] = [
    {
      id: '1',
      projectId: '1',
      unitId: 'u1',
      divisionId: 'd1',
      budgetCodeId: '1',
      description: 'UI/UX Design Services',
      amount: 34000,
      type: 'expense',
      category: 'Design',
      date: '2024-01-20',
      createdBy: '1',
      createdAt: '2024-01-20T00:00:00Z'
    },
    {
      id: '2',
      projectId: '1',
      unitId: 'u1',
      divisionId: 'd1',
      budgetCodeId: '1',
      description: 'Development Tools License',
      amount: 8000,
      type: 'expense',
      category: 'Software',
      date: '2024-01-25',
      createdBy: '2',
      createdAt: '2024-01-25T00:00:00Z'
    },
    {
      id: '3',
      projectId: '2',
      unitId: 'u2',
      divisionId: 'd1',
      budgetCodeId: '1',
      description: 'Market Research',
      amount: 20000,
      type: 'expense',
      category: 'Research',
      date: '2024-01-30',
      createdBy: '1',
      createdAt: '2024-01-30T00:00:00Z'
    },
    {
      id: '4',
      projectId: '3',
      unitId: 'u3',
      divisionId: 'd2',
      budgetCodeId: '2',
      description: 'Google Ads Campaign',
      amount: 60000,
      type: 'expense',
      category: 'Advertising',
      date: '2024-02-01',
      createdBy: '2',
      createdAt: '2024-02-01T00:00:00Z'
    },
    {
      id: '5',
      projectId: '1',
      unitId: 'u1',
      divisionId: 'd1',
      budgetCodeId: '1',
      description: 'Frontend Development',
      amount: 32000,
      type: 'expense',
      category: 'Development',
      date: '2024-02-15',
      createdBy: '3',
      createdAt: '2024-02-15T00:00:00Z'
    },
    {
      id: '6',
      projectId: '3',
      unitId: 'u3',
      divisionId: 'd2',
      budgetCodeId: '2',
      description: 'Social Media Marketing',
      amount: 25000,
      type: 'expense',
      category: 'Marketing',
      date: '2024-03-01',
      createdBy: '2',
      createdAt: '2024-03-01T00:00:00Z'
    },
    {
      id: '7',
      projectId: '3',
      unitId: 'u3',
      divisionId: 'd2',
      budgetCodeId: '2',
      description: 'Content Creation',
      amount: 14200,
      type: 'expense',
      category: 'Marketing',
      date: '2024-03-15',
      createdBy: '2',
      createdAt: '2024-03-15T00:00:00Z'
    }
  ];

  const defaultDivisions: Division[] = [
    { id: 'd1', name: 'Corporate Services', createdBy: '1', createdAt: '2024-01-01T00:00:00Z' },
    { id: 'd2', name: 'Marketing', createdBy: '1', createdAt: '2024-01-01T00:00:00Z' }
  ];

  const defaultUnits: Unit[] = [
    { id: 'u1', name: 'IT Unit', divisionId: 'd1', createdBy: '1', createdAt: '2024-01-01T00:00:00Z' },
    { id: 'u2', name: 'Product Unit', divisionId: 'd1', createdBy: '1', createdAt: '2024-01-01T00:00:00Z' },
    { id: 'u3', name: 'Digital Marketing Unit', divisionId: 'd2', createdBy: '1', createdAt: '2024-01-01T00:00:00Z' }
  ];

  // Initialize state with persistent data
  const [settings, setSettings] = useState<AppSettings>(() => 
    loadFromStorage(STORAGE_KEYS.SETTINGS, defaultSettings)
  );

  const [users, setUsers] = useState<User[]>(() => 
    loadFromStorage(STORAGE_KEYS.USERS, defaultUsers)
  );

  const [budgetCodes, setBudgetCodes] = useState<BudgetCode[]>(() => 
    loadFromStorage(STORAGE_KEYS.BUDGET_CODES, defaultBudgetCodes)
  );

  const [divisions, setDivisions] = useState<Division[]>(() =>
    loadFromStorage(STORAGE_KEYS.DIVISIONS, defaultDivisions)
  );

  const [units, setUnits] = useState<Unit[]>(() =>
    loadFromStorage(STORAGE_KEYS.UNITS, defaultUnits)
  );

  const [projects, setProjects] = useState<Project[]>(() => 
    loadFromStorage(STORAGE_KEYS.PROJECTS, defaultProjects)
  );

  const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>(() => 
    loadFromStorage(STORAGE_KEYS.BUDGET_ENTRIES, defaultBudgetEntries)
  );

  const [notifications, setNotifications] = useState<Notification[]>(() => 
    loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, [])
  );

  // Save to localStorage whenever state changes (optimized with debouncing)
  useEffect(() => {
    debouncedSaveUsers(users);
  }, [users, debouncedSaveUsers]);

  useEffect(() => {
    debouncedSaveProjects(projects);
  }, [projects, debouncedSaveProjects]);

  useEffect(() => {
    debouncedSaveBudgetEntries(budgetEntries);
  }, [budgetEntries, debouncedSaveBudgetEntries]);

  useEffect(() => {
    debouncedSaveBudgetCodes(budgetCodes);
  }, [budgetCodes, debouncedSaveBudgetCodes]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DIVISIONS, divisions);
  }, [divisions]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.UNITS, units);
  }, [units]);
  const addDivision = (divisionData: Omit<Division, 'id' | 'createdAt'>) => {
    const newDivision: Division = { ...divisionData, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setDivisions(prev => [...prev, newDivision]);
  };

  const updateDivision = (id: string, updates: Partial<Division>) => {
    setDivisions(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDivision = (id: string) => {
    setDivisions(prev => prev.filter(d => d.id !== id));
    // Cascade: remove units under this division and unlink from projects/entries
    const unitIds = units.filter(u => u.divisionId === id).map(u => u.id);
    setUnits(prev => prev.filter(u => u.divisionId !== id));
    setProjects(prev => prev.map(p => (unitIds.includes(p.unitId) ? { ...p, unitId: '' } : p)));
    setBudgetEntries(prev => prev.map(e => (e.divisionId === id ? { ...e, divisionId: undefined } : e)));
  };

  const addUnit = (unitData: Omit<Unit, 'id' | 'createdAt'>) => {
    const newUnit: Unit = { ...unitData, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setUnits(prev => [...prev, newUnit]);
  };

  const updateUnit = (id: string, updates: Partial<Unit>) => {
    setUnits(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
  };

  const deleteUnit = (id: string) => {
    setUnits(prev => prev.filter(u => u.id !== id));
    setProjects(prev => prev.map(p => (p.unitId === id ? { ...p, unitId: '' } : p)));
    setBudgetEntries(prev => prev.map(e => (e.unitId === id ? { ...e, unitId: undefined } : e)));
  };

  useEffect(() => {
    debouncedSaveNotifications(notifications);
  }, [notifications, debouncedSaveNotifications]);

  useEffect(() => {
    debouncedSaveSettings(settings);
  }, [settings, debouncedSaveSettings]);

  // Notification functions
  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Keep only last 100 notifications to prevent storage bloat
      return updated.slice(0, 100);
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(notification => 
      notification.userId === currentUser.id ? { ...notification, read: true } : notification
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getUnreadNotificationCount = () => {
    if (!currentUser) return 0;
    return notifications.filter(n => !n.read && n.userId === currentUser.id).length;
  };

  // Helper function to create notifications for all users
  const notifyAllUsers = (
    type: Notification['type'],
    title: string,
    message: string,
    data?: any,
    excludeUserId?: string
  ) => {
    users.forEach(user => {
      if (user.id !== excludeUserId) {
        addNotification({
          userId: user.id,
          type,
          title,
          message,
          data,
          read: false
        });
      }
    });
  };

  // Helper function to notify specific users
  const notifyUsers = (
    userIds: string[],
    type: Notification['type'],
    title: string,
    message: string,
    data?: any
  ) => {
    userIds.forEach(userId => {
      addNotification({
        userId,
        type,
        title,
        message,
        data,
        read: false
      });
    });
  };

  // Helper function to check budget code alerts
  const checkBudgetCodeAlert = (budgetCodeId: string) => {
    const budgetCode = budgetCodes.find(bc => bc.id === budgetCodeId);
    if (!budgetCode) return;

    const usagePercentage = (budgetCode.spent / budgetCode.budget) * 100;
    if (usagePercentage >= settings.budgetAlertThreshold) {
      notifyAllUsers(
        'budget_code_alert',
        'Budget Code Alert',
        `Budget code "${budgetCode.code} - ${budgetCode.name}" has used ${usagePercentage.toFixed(1)}% of its allocated budget`,
        { 
          budgetCodeId: budgetCode.id,
          percentage: usagePercentage,
          budget: budgetCode.budget,
          spent: budgetCode.spent
        }
      );
    }
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjects(prev => [...prev, newProject]);

    // Notify all users about new project
    const creatorName = users.find(u => u.id === projectData.createdBy)?.name || 'Someone';
    notifyAllUsers(
      'project_created',
      'New Project Created',
      `${creatorName} created a new project: ${newProject.name}`,
      { projectId: newProject.id, createdBy: projectData.createdBy },
      projectData.createdBy
    );

    // Notify assigned users specifically
    if (projectData.assignedUsers.length > 0) {
      notifyUsers(
        projectData.assignedUsers,
        'user_assigned',
        'Project Assignment',
        `You have been assigned to the project: ${newProject.name}`,
        { projectId: newProject.id }
      );
    }
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const oldProject = projects.find(p => p.id === id);
    if (!oldProject) return;

    const updatedProject = { ...oldProject, ...updates, updatedAt: new Date().toISOString() };
    setProjects(prev => prev.map(project => 
      project.id === id ? updatedProject : project
    ));

    // Notify all users about project update
    const updaterName = currentUser?.name || 'Someone';
    notifyAllUsers(
      'project_updated',
      'Project Updated',
      `${updaterName} updated the project: ${updatedProject.name}`,
      { 
        projectId: id, 
        updatedBy: currentUser?.id,
        changes: Object.keys(updates)
      },
      currentUser?.id
    );

    // Check for budget alerts
    const budgetUsagePercentage = (updatedProject.spent / updatedProject.budget) * 100;
    if (budgetUsagePercentage >= settings.budgetAlertThreshold) {
      notifyAllUsers(
        'budget_alert',
        'Budget Alert',
        `Project "${updatedProject.name}" has used ${budgetUsagePercentage.toFixed(1)}% of its budget`,
        { 
          projectId: id, 
          percentage: budgetUsagePercentage,
          budget: updatedProject.budget,
          spent: updatedProject.spent
        }
      );
    }

    // Notify if project status changed to completed
    if (updates.status === 'completed' && oldProject.status !== 'completed') {
      notifyAllUsers(
        'project_completed',
        'Project Completed',
        `Project "${updatedProject.name}" has been marked as completed`,
        { projectId: id }
      );
    }

    // Notify newly assigned users
    if (updates.assignedUsers) {
      const newlyAssigned = updates.assignedUsers.filter(userId => 
        !oldProject.assignedUsers.includes(userId)
      );
      if (newlyAssigned.length > 0) {
        notifyUsers(
          newlyAssigned,
          'user_assigned',
          'Project Assignment',
          `You have been assigned to the project: ${updatedProject.name}`,
          { projectId: id }
        );
      }
    }
  };

  const deleteProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    setProjects(prev => prev.filter(project => project.id !== id));
    setBudgetEntries(prev => prev.filter(entry => entry.projectId !== id));

    // Notify all users about project deletion
    const deleterName = currentUser?.name || 'Someone';
    notifyAllUsers(
      'project_updated',
      'Project Deleted',
      `${deleterName} deleted the project: ${project.name}`,
      { projectId: id, deletedBy: currentUser?.id },
      currentUser?.id
    );
  };

  const addBudgetEntry = (entryData: Omit<BudgetEntry, 'id' | 'createdAt'>) => {
    const newEntry: BudgetEntry = {
      ...entryData,
      unitId: entryData.unitId ?? projects.find(p => p.id === entryData.projectId)?.unitId,
      divisionId: entryData.divisionId ?? units.find(u => u.id === (projects.find(p => p.id === entryData.projectId)?.unitId || ''))?.divisionId,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setBudgetEntries(prev => [...prev, newEntry]);
    
    // Update project spent amount
    const project = projects.find(p => p.id === entryData.projectId);
    if (project && entryData.type === 'expense') {
      updateProject(project.id, { spent: project.spent + entryData.amount });
    }

    // Update budget code spent amount
    if (entryData.budgetCodeId && entryData.type === 'expense') {
      setBudgetCodes(prev => prev.map(code => 
        code.id === entryData.budgetCodeId 
          ? { ...code, spent: code.spent + entryData.amount, updatedAt: new Date().toISOString() }
          : code
      ));
      
      // Check for budget code alerts after updating
      setTimeout(() => checkBudgetCodeAlert(entryData.budgetCodeId!), 100);
    }

    // Notify project team about new budget entry
    if (project) {
      const creatorName = users.find(u => u.id === entryData.createdBy)?.name || 'Someone';
      const notificationMessage = `${creatorName} added a new ${entryData.type} of ${settings.currency} ${entryData.amount.toLocaleString()} to ${project.name}`;
      
      // Notify assigned users and project creator
      const usersToNotify = [...new Set([...project.assignedUsers, project.createdBy])];
      notifyUsers(
        usersToNotify.filter(userId => userId !== entryData.createdBy),
        'budget_entry_added',
        'New Budget Entry',
        notificationMessage,
        { 
          projectId: entryData.projectId, 
          entryId: newEntry.id,
          amount: entryData.amount,
          type: entryData.type,
          budgetCodeId: entryData.budgetCodeId
        }
      );
    }
  };

  const updateBudgetEntry = (id: string, updates: Partial<BudgetEntry>) => {
    const oldEntry = budgetEntries.find(e => e.id === id);
    if (!oldEntry) return;

    setBudgetEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    ));

    // Update budget code spent amounts if amount or budget code changed
    if (updates.amount !== undefined || updates.budgetCodeId !== undefined) {
      // Remove from old budget code
      if (oldEntry.budgetCodeId && oldEntry.type === 'expense') {
        setBudgetCodes(prev => prev.map(code => 
          code.id === oldEntry.budgetCodeId 
            ? { ...code, spent: Math.max(0, code.spent - oldEntry.amount), updatedAt: new Date().toISOString() }
            : code
        ));
      }
      
      // Add to new budget code
      const newBudgetCodeId = updates.budgetCodeId !== undefined ? updates.budgetCodeId : oldEntry.budgetCodeId;
      if (newBudgetCodeId && oldEntry.type === 'expense') {
        setBudgetCodes(prev => prev.map(code => 
          code.id === newBudgetCodeId 
            ? { ...code, spent: code.spent + (updates.amount || oldEntry.amount), updatedAt: new Date().toISOString() }
            : code
        ));
        
        // Check for budget code alerts
        setTimeout(() => checkBudgetCodeAlert(newBudgetCodeId), 100);
      }
    }
  };

  const deleteBudgetEntry = (id: string) => {
    const entry = budgetEntries.find(e => e.id === id);
    if (!entry) return;

    // Update project spent amount
    if (entry.type === 'expense') {
      const project = projects.find(p => p.id === entry.projectId);
      if (project) {
        updateProject(project.id, { spent: project.spent - entry.amount });
      }
      
      // Update budget code spent amount
      if (entry.budgetCodeId) {
        setBudgetCodes(prev => prev.map(code => 
          code.id === entry.budgetCodeId 
            ? { ...code, spent: Math.max(0, code.spent - entry.amount), updatedAt: new Date().toISOString() }
            : code
        ));
      }
    }
    
    setBudgetEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);

    // Notify all admins about new user
    const adminUsers = users.filter(u => u.role === 'admin' || u.role === 'super_admin');
    const creatorName = currentUser?.name || 'Someone';
    notifyUsers(
      adminUsers.map(u => u.id).filter(id => id !== currentUser?.id),
      'user_assigned',
      'New User Added',
      `${creatorName} added a new user: ${newUser.name} (${newUser.role.replace('_', ' ')})`,
      { userId: newUser.id }
    );
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    // Also remove user from project assignments
    setProjects(prev => prev.map(project => ({
      ...project,
      assignedUsers: project.assignedUsers.filter(userId => userId !== id)
    })));
    // Remove user's notifications
    setNotifications(prev => prev.filter(notification => notification.userId !== id));
  };

  const addBudgetCode = (codeData: Omit<BudgetCode, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCode: BudgetCode = {
      ...codeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setBudgetCodes(prev => [...prev, newCode]);
  };

  const updateBudgetCode = (id: string, updates: Partial<BudgetCode>) => {
    setBudgetCodes(prev => prev.map(code => 
      code.id === id 
        ? { ...code, ...updates, updatedAt: new Date().toISOString() }
        : code
    ));
    
    // Check for budget alerts if budget was changed
    if (updates.budget !== undefined) {
      setTimeout(() => checkBudgetCodeAlert(id), 100);
    }
  };

  const deleteBudgetCode = (id: string) => {
    setBudgetCodes(prev => prev.filter(code => code.id !== id));
    // Remove budget code from projects
    setProjects(prev => prev.map(project => ({
      ...project,
      budgetCodes: project.budgetCodes.filter(codeId => codeId !== id)
    })));
    // Remove budget code from entries
    setBudgetEntries(prev => prev.map(entry => ({
      ...entry,
      budgetCodeId: entry.budgetCodeId === id ? undefined : entry.budgetCodeId
    })));
  };

  const toggleBudgetCodeStatus = (id: string) => {
    setBudgetCodes(prev => prev.map(code => 
      code.id === id 
        ? { ...code, isActive: !code.isActive, updatedAt: new Date().toISOString() }
        : code
    ));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider value={{
      users,
      divisions,
      units,
      projects,
      budgetEntries,
      budgetCodes,
      notifications,
      settings,
      currentView,
      selectedProject,
      sidebarCollapsed,
      setCurrentView,
      setSelectedProject,
      setSidebarCollapsed,
      addDivision,
      updateDivision,
      deleteDivision,
      addUnit,
      updateUnit,
      deleteUnit,
      addProject,
      updateProject,
      deleteProject,
      addBudgetEntry,
      updateBudgetEntry,
      deleteBudgetEntry,
      addUser,
      updateUser,
      deleteUser,
      addBudgetCode,
      updateBudgetCode,
      deleteBudgetCode,
      toggleBudgetCodeStatus,
      updateSettings,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      deleteNotification,
      getUnreadNotificationCount
    }}>
      {children}
    </AppContext.Provider>
  );
};