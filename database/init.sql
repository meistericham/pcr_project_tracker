-- PCR Tracker Database Schema
-- This script initializes the database with all necessary tables and sample data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('super_admin', 'admin', 'user')) NOT NULL DEFAULT 'user',
  initials TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budget_codes table
CREATE TABLE IF NOT EXISTS budget_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(15,2) NOT NULL DEFAULT 0,
  spent DECIMAL(15,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')) NOT NULL DEFAULT 'planning',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) NOT NULL DEFAULT 'medium',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(15,2) NOT NULL DEFAULT 0,
  spent DECIMAL(15,2) NOT NULL DEFAULT 0,
  assigned_users UUID[] DEFAULT '{}',
  budget_codes UUID[] DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budget_entries table
CREATE TABLE IF NOT EXISTS budget_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  budget_code_id UUID REFERENCES budget_codes(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  type TEXT CHECK (type IN ('expense', 'income')) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_budget_entries_project_id ON budget_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_budget_entries_date ON budget_entries(date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_codes_updated_at BEFORE UPDATE ON budget_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO users (id, name, email, role, initials) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Hisyamudin', 'hisyamudin@sarawaktourism.com', 'super_admin', 'HS'),
  ('550e8400-e29b-41d4-a716-446655440002', 'John Doe', 'john@company.com', 'super_admin', 'JD'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Sarah Chen', 'sarah@company.com', 'admin', 'SC'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Mike Johnson', 'mike@company.com', 'user', 'MJ')
ON CONFLICT (email) DO NOTHING;

-- Insert sample budget codes
INSERT INTO budget_codes (id, code, name, description, budget, spent, created_by) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', '1-2345', 'Software Development', 'Budget allocation for software development activities', 500000, 74000, '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440012', '2-1001', 'Marketing & Advertising', 'Budget for marketing campaigns and advertising', 300000, 99200, '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440013', '3-5678', 'Equipment & Hardware', 'Purchase and maintenance of equipment', 150000, 0, '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440014', '4-9999', 'Training & Development', 'Employee training and development programs', 75000, 0, '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (code) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, description, status, priority, start_date, end_date, budget, spent, assigned_users, budget_codes, created_by) VALUES
  ('550e8400-e29b-41d4-a716-446655440021', 'Website Redesign', 'Complete overhaul of company website', 'active', 'high', '2024-01-15', '2024-03-15', 200000, 74000, ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'], ARRAY['550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440012'], '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440022', 'Mobile App Development', 'Native iOS and Android app', 'planning', 'medium', '2024-02-01', '2024-06-01', 480000, 20000, ARRAY['550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004'], ARRAY['550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440013'], '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440023', 'Marketing Campaign Q1', 'Digital marketing campaign for Q1', 'completed', 'high', '2024-01-01', '2024-03-31', 100000, 99200, ARRAY['550e8400-e29b-41d4-a716-446655440002'], ARRAY['550e8400-e29b-41d4-a716-446655440012'], '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;

-- Insert sample budget entries
INSERT INTO budget_entries (project_id, budget_code_id, description, amount, type, category, date, created_by) VALUES
  ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440011', 'UI/UX Design Services', 34000, 'expense', 'Design', '2024-01-20', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440011', 'Development Tools License', 8000, 'expense', 'Software', '2024-01-25', '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440011', 'Market Research', 20000, 'expense', 'Research', '2024-01-30', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440012', 'Google Ads Campaign', 60000, 'expense', 'Advertising', '2024-02-01', '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440011', 'Frontend Development', 32000, 'expense', 'Development', '2024-02-15', '550e8400-e29b-41d4-a716-446655440003'),
  ('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440012', 'Social Media Marketing', 25000, 'expense', 'Marketing', '2024-03-01', '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440012', 'Content Creation', 14200, 'expense', 'Marketing', '2024-03-15', '550e8400-e29b-41d4-a716-446655440002');

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('app_settings', '{"currency":"MYR","dateFormat":"DD/MM/YYYY","fiscalYearStart":1,"budgetAlertThreshold":80,"autoBackup":true,"emailNotifications":true,"companyName":"PCR Company","defaultProjectStatus":"planning","defaultProjectPriority":"medium","budgetCategories":["Design","Development","Marketing","Software","Research","Advertising","Equipment","Travel","Training","Other"],"maxProjectDuration":365,"requireBudgetApproval":false,"allowNegativeBudget":false}')
ON CONFLICT (key) DO NOTHING;
