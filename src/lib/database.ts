import { supabase } from './supabase';
import { User, Project, BudgetEntry, BudgetCode, Notification } from '../types';

// User operations
export const userService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(transformUser);
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

// Transform functions to convert database format to app format
function transformUser(data: any): User {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    initials: data.initials,
    createdAt: data.created_at
  };
}

function transformBudgetCode(data: any): BudgetCode {
  return {
    id: data.id,
    code: data.code,
    name: data.name,
    description: data.description,
    budget: data.budget,
    spent: data.spent,
    isActive: data.is_active,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

function transformProject(data: any): Project {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    status: data.status,
    priority: data.priority,
    startDate: data.start_date,
    endDate: data.end_date,
    budget: data.budget,
    spent: data.spent,
    assignedUsers: data.assigned_users,
    budgetCodes: data.budget_codes,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

function transformBudgetEntry(data: any): BudgetEntry {
  return {
    id: data.id,
    projectId: data.project_id,
    budgetCodeId: data.budget_code_id,
    description: data.description,
    amount: data.amount,
    type: data.type,
    category: data.category,
    date: data.date,
    createdBy: data.created_by,
    createdAt: data.created_at
  };
}

function transformNotification(data: any): Notification {
  return {
    id: data.id,
    userId: data.user_id,
    type: data.type,
    title: data.title,
    message: data.message,
    data: data.data,
    read: data.read,
    createdAt: data.created_at,
    actionUrl: data.action_url
  };
}