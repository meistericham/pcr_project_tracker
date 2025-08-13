# Supabase Setup Guide

This guide will help you connect your PCR Tracker to Supabase for persistent data storage.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter a project name (e.g., "pcr-tracker")
6. Enter a secure database password
7. Choose your region (closest to your users)
8. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon/Public Key** (under "Project API keys")

## Step 3: Configure Environment Variables

1. Create a `.env` file in your project root directory
2. Add the following variables:

```env
# Database Mode - Set to true to use Supabase
VITE_USE_SERVER_DB=true

# Supabase Configuration
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace the placeholder values with your actual Supabase credentials

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Run the following SQL to create the required tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'user')),
  initials TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Budget codes table
CREATE TABLE budget_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  budget NUMERIC(12,2) NOT NULL DEFAULT 0,
  spent NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  start_date DATE,
  end_date DATE,
  budget NUMERIC(12,2) NOT NULL DEFAULT 0,
  spent NUMERIC(12,2) NOT NULL DEFAULT 0,
  unit_id TEXT,
  assigned_users TEXT[] DEFAULT '{}',
  budget_codes TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Budget entries table
CREATE TABLE budget_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  budget_code_id UUID REFERENCES budget_codes(id),
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  category TEXT NOT NULL,
  date DATE NOT NULL,
  unit_id TEXT,
  division_id TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_budget_entries_project_id ON budget_entries(project_id);
CREATE INDEX idx_budget_entries_budget_code_id ON budget_entries(budget_code_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_budget_codes_active ON budget_codes(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now - you can restrict later)
CREATE POLICY "Enable all operations for all users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON budget_codes FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON projects FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON budget_entries FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON notifications FOR ALL USING (true);
```

## Step 5: Insert Initial Data (Optional)

You can insert your current users into the database:

```sql
-- Insert sample users
INSERT INTO users (name, email, role, initials) VALUES
('Hisyamudin', 'hisyamudin@sarawaktourism.com', 'super_admin', 'HS'),
('John Doe', 'john@company.com', 'super_admin', 'JD'),
('Sarah Chen', 'sarah@company.com', 'admin', 'SC'),
('Mike Johnson', 'mike@company.com', 'user', 'MJ');
```

## Step 6: Restart Your Application

1. Stop your development server (Ctrl+C)
2. Restart it with: `npm run dev`
3. Go to Settings > Database Setup to verify the connection

## Step 7: Verify Connection

1. Navigate to the Settings page in your PCR Tracker
2. Go to the "Database Setup" tab
3. You should see a "Database Status" section showing your connection status
4. If connected successfully, you'll see "Supabase connected" with a green checkmark

## Troubleshooting

### Connection Issues
- **Check your credentials**: Ensure the URL and key are correct
- **Network issues**: Verify your internet connection
- **Firewall**: Ensure your firewall isn't blocking the connection
- **Project status**: Make sure your Supabase project is active

### Database Errors
- **Missing tables**: Re-run the SQL schema creation script
- **Permission errors**: Check your RLS policies
- **Data type errors**: Ensure your local data matches the schema

### Environment Variables
- **Not loading**: Make sure your `.env` file is in the project root
- **Wrong format**: Ensure no spaces around the `=` sign
- **Caching**: Restart your development server after changes

## Security Notes

1. **Never commit your .env file** - It's already in .gitignore
2. **Use different credentials for production** - See `env.production.example`
3. **Review RLS policies** - The default policies allow all access
4. **Backup your data** - Enable automatic backups in Supabase

## Need Help?

- Check the browser console for detailed error messages
- Use the Database Status component in Settings to diagnose issues
- Review the Supabase documentation at [https://supabase.com/docs](https://supabase.com/docs)
- Contact your system administrator for advanced configuration
