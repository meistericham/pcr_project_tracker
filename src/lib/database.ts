import { supabase, isSupabaseConfigured, testSupabaseConnection } from './supabase';
import { User, Project, BudgetEntry, BudgetCode, Notification } from '../types';

// Helper function to handle database errors gracefully
const handleDatabaseError = (error: any, operation: string) => {
  console.error(`Database operation failed (${operation}):`, error);
  
  // Check if it's a connection error
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    throw new Error(`Network error during ${operation}. Please check your internet connection.`);
  }
  
  // Check if it's an authentication error
  if (error.message?.includes('JWT') || error.message?.includes('unauthorized')) {
    throw new Error(`Authentication error during ${operation}. Please check your Supabase credentials.`);
  }
  
  // Check if it's a table/schema error
  if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
    throw new Error(`Database schema error during ${operation}. Please run the database migration.`);
  }
  
  throw error;
};

// Transform functions to convert database rows to app types
const transformUser = (dbUser: any): User => ({
  id: dbUser.id,
  name: dbUser.name,
  email: dbUser.email,
  role: dbUser.role,
  initials: dbUser.initials,
  createdAt: dbUser.created_at
});

const transformProject = (dbProject: any): Project => ({
  id: dbProject.id,
  name: dbProject.name,
  description: dbProject.description,
  status: dbProject.status,
  priority: dbProject.priority,
  startDate: dbProject.start_date,
  endDate: dbProject.end_date,
  budget: dbProject.budget,
  spent: dbProject.spent,
  unitId: dbProject.unit_id || '',
  assignedUsers: dbProject.assigned_users || [],
  budgetCodes: dbProject.budget_codes || [],
  createdBy: dbProject.created_by,
  createdAt: dbProject.created_at,
  updatedAt: dbProject.updated_at
});

const transformBudgetCode = (dbCode: any): BudgetCode => ({
  id: dbCode.id,
  code: dbCode.code,
  name: dbCode.name,
  description: dbCode.description,
  budget: dbCode.budget,
  spent: dbCode.spent,
  isActive: dbCode.is_active,
  createdBy: dbCode.created_by,
  createdAt: dbCode.created_at,
  updatedAt: dbCode.updated_at
});

const transformBudgetEntry = (dbEntry: any): BudgetEntry => ({
  id: dbEntry.id,
  projectId: dbEntry.project_id,
  budgetCodeId: dbEntry.budget_code_id,
  description: dbEntry.description,
  amount: dbEntry.amount,
  type: dbEntry.type,
  category: dbEntry.category,
  date: dbEntry.date,
  createdBy: dbEntry.created_by,
  createdAt: dbEntry.created_at,
  unitId: dbEntry.unit_id,
  divisionId: dbEntry.division_id
});

const transformNotification = (dbNotification: any): Notification => ({
  id: dbNotification.id,
  userId: dbNotification.user_id,
  type: dbNotification.type,
  title: dbNotification.title,
  message: dbNotification.message,
  data: dbNotification.data,
  read: dbNotification.read,
  createdAt: dbNotification.created_at,
  actionUrl: dbNotification.action_url
});

// User operations
export const userService = {
  async getAll(): Promise<User[]> {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        handleDatabaseError(error, 'fetch users');
      }
      
      return data?.map(transformUser) || [];
    } catch (error) {
      handleDatabaseError(error, 'fetch users');
      return [];
    }
  },

  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: user.name,
        email: user.email,
        role: user.role,
        initials: user.initials
      })
      .select()
      .single();
    
    if (error) throw error;
    return transformUser(data);
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: updates.name,
        email: updates.email,
        role: updates.role,
        initials: updates.initials
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return transformUser(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Budget Code operations
export const budgetCodeService = {
  async getAll(): Promise<BudgetCode[]> {
    const { data, error } = await supabase
      .from('budget_codes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(transformBudgetCode);
  },

  async create(code: Omit<BudgetCode, 'id' | 'createdAt' | 'updatedAt'>): Promise<BudgetCode> {
    const { data, error } = await supabase
      .from('budget_codes')
      .insert({
        code: code.code,
        name: code.name,
        description: code.description,
        budget: code.budget,
        spent: code.spent,
        is_active: code.isActive,
        created_by: code.createdBy
      })
      .select()
      .single();
    
    if (error) throw error;
    return transformBudgetCode(data);
  },

  async update(id: string, updates: Partial<BudgetCode>): Promise<BudgetCode> {
    const { data, error } = await supabase
      .from('budget_codes')
      .update({
        code: updates.code,
        name: updates.name,
        description: updates.description,
        budget: updates.budget,
        spent: updates.spent,
        is_active: updates.isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return transformBudgetCode(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('budget_codes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Project operations
export const projectService = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(transformProject);
  },

  async create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
        start_date: project.startDate,
        end_date: project.endDate,
        budget: project.budget,
        spent: project.spent,
        assigned_users: project.assignedUsers,
        budget_codes: project.budgetCodes,
        created_by: project.createdBy
      })
      .select()
      .single();
    
    if (error) throw error;
    return transformProject(data);
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({
        name: updates.name,
        description: updates.description,
        status: updates.status,
        priority: updates.priority,
        start_date: updates.startDate,
        end_date: updates.endDate,
        budget: updates.budget,
        spent: updates.spent,
        assigned_users: updates.assignedUsers,
        budget_codes: updates.budgetCodes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return transformProject(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Budget Entry operations
export const budgetEntryService = {
  async getAll(): Promise<BudgetEntry[]> {
    const { data, error } = await supabase
      .from('budget_entries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(transformBudgetEntry);
  },

  async create(entry: Omit<BudgetEntry, 'id' | 'createdAt'>): Promise<BudgetEntry> {
    const { data, error } = await supabase
      .from('budget_entries')
      .insert({
        project_id: entry.projectId,
        budget_code_id: entry.budgetCodeId,
        description: entry.description,
        amount: entry.amount,
        type: entry.type,
        category: entry.category,
        date: entry.date,
        created_by: entry.createdBy
      })
      .select()
      .single();
    
    if (error) throw error;
    return transformBudgetEntry(data);
  },

  async update(id: string, updates: Partial<BudgetEntry>): Promise<BudgetEntry> {
    const { data, error } = await supabase
      .from('budget_entries')
      .update({
        project_id: updates.projectId,
        budget_code_id: updates.budgetCodeId,
        description: updates.description,
        amount: updates.amount,
        type: updates.type,
        category: updates.category,
        date: updates.date
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return transformBudgetEntry(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('budget_entries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Notification operations
export const notificationService = {
  async getAll(): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(transformNotification);
  },

  async create(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        read: notification.read,
        action_url: notification.actionUrl
      })
      .select()
      .single();
    
    if (error) throw error;
    return transformNotification(data);
  },

  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    
    if (error) throw error;
  },

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

