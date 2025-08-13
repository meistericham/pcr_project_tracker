import React, { useState } from 'react';
import { Database, CheckCircle, AlertCircle, ExternalLink, Copy } from 'lucide-react';

const DatabaseSetup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  const sqlSchema = `-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('super_admin', 'admin', 'user')) NOT NULL,
  initials TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget codes table
CREATE TABLE budget_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')) NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) NOT NULL,
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

-- Budget entries table
CREATE TABLE budget_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (basic examples - adjust based on your needs)
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Admins can manage users" ON users FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Users can view active budget codes" ON budget_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage budget codes" ON budget_codes FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Users can view projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects" ON projects FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Users can view budget entries" ON budget_entries FOR SELECT USING (true);
CREATE POLICY "Users can manage their budget entries" ON budget_entries FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());`;

  const envTemplate = `# Supabase Configuration
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseKey}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Database Setup Guide
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Set up Supabase database for your PCR Tracker
            </p>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex items-center space-x-4 mb-8">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                step >= stepNum
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {step > stepNum ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-xs">
                  {stepNum}
                </span>
              )}
              <span className="text-sm font-medium">
                Step {stepNum}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Step 1: Create Supabase Project
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-300">
                      Create a new Supabase project
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
                      Go to Supabase and create a new project. You'll need the project URL and anon key.
                    </p>
                  </div>
                </div>
              </div>
              
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center">supabase.com <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                <li>Sign up or log in to your account</li>
                <li>Click "New Project" and fill in the details</li>
                <li>Wait for the project to be created (this may take a few minutes)</li>
                <li>Go to Settings → API to find your project URL and anon key</li>
              </ol>
            </div>
            
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Next: Configure Database
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Step 2: Create Database Schema
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Copy and run this SQL in your Supabase SQL Editor to create the required tables:
              </p>
              
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
                  <code>{sqlSchema}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(sqlSchema)}
                  className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                  title="Copy SQL"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-900 dark:text-yellow-300">
                      Important Notes
                    </h3>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-400 mt-1 space-y-1">
                      <li>• Run this SQL in your Supabase project's SQL Editor</li>
                      <li>• This creates all necessary tables and security policies</li>
                      <li>• Make sure to enable Row Level Security for production use</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Next: Environment Setup
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Step 3: Configure Environment Variables
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Enter your Supabase project credentials:
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Supabase URL
                  </label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Supabase Anon Key
                  </label>
                  <input
                    type="text"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {supabaseUrl && supabaseKey && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Create a <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">.env</code> file in your project root:
                  </p>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                      <code>{envTemplate}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(envTemplate)}
                      className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                      title="Copy Environment Variables"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!supabaseUrl || !supabaseKey}
                className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Complete Setup
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Step 4: Setup Complete!
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900 dark:text-green-300">
                      Database Setup Complete
                    </h3>
                    <p className="text-sm text-green-800 dark:text-green-400 mt-1">
                      Your PCR Tracker is now configured to use Supabase as the database backend.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 dark:text-white">Next Steps:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Restart your development server to load the new environment variables</li>
                  <li>The app will now use Supabase for data persistence</li>
                  <li>Create your first admin user through the Users section</li>
                  <li>Set up your budget codes and projects</li>
                  <li>Configure authentication policies as needed</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                  Additional Features Available:
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                  <li>• Real-time data synchronization across users</li>
                  <li>• Automatic data backup and recovery</li>
                  <li>• Scalable database performance</li>
                  <li>• Built-in authentication and security</li>
                  <li>• PDF report generation and export</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseSetup;