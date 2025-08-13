import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Create Supabase client with enhanced options
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return !!(url && key && 
    url !== 'https://your-project.supabase.co' && 
    url !== 'https://demo.supabase.co' &&
    key !== 'your-anon-key' &&
    key !== 'demo-key'
  );
};

// Helper function to test database connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured properly');
      return false;
    }
    
    // Test with a simple query
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};

// Database schema types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'super_admin' | 'admin' | 'user';
          initials: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: 'super_admin' | 'admin' | 'user';
          initials: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'super_admin' | 'admin' | 'user';
          initials?: string;
          created_at?: string;
        };
      };
      budget_codes: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string;
          budget: number;
          spent: number;
          is_active: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description: string;
          budget: number;
          spent?: number;
          is_active?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string;
          budget?: number;
          spent?: number;
          is_active?: boolean;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string;
          status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
          priority: 'low' | 'medium' | 'high';
          start_date: string;
          end_date: string;
          budget: number;
          spent: number;
          assigned_users: string[];
          budget_codes: string[];
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
          priority: 'low' | 'medium' | 'high';
          start_date: string;
          end_date: string;
          budget: number;
          spent?: number;
          assigned_users: string[];
          budget_codes: string[];
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
          priority?: 'low' | 'medium' | 'high';
          start_date?: string;
          end_date?: string;
          budget?: number;
          spent?: number;
          assigned_users?: string[];
          budget_codes?: string[];
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      budget_entries: {
        Row: {
          id: string;
          project_id: string;
          budget_code_id: string | null;
          description: string;
          amount: number;
          type: 'expense' | 'income';
          category: string;
          date: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          budget_code_id?: string | null;
          description: string;
          amount: number;
          type: 'expense' | 'income';
          category: string;
          date: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          budget_code_id?: string | null;
          description?: string;
          amount?: number;
          type?: 'expense' | 'income';
          category?: string;
          date?: string;
          created_by?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data: any;
          read: boolean;
          created_at: string;
          action_url: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data?: any;
          read?: boolean;
          created_at?: string;
          action_url?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          data?: any;
          read?: boolean;
          created_at?: string;
          action_url?: string | null;
        };
      };
    };
  };
}