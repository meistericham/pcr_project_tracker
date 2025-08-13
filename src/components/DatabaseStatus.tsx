import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, RefreshCw, Database, Wifi, WifiOff } from 'lucide-react';
import { isSupabaseConfigured, testSupabaseConnection } from '../lib/supabase';

interface DatabaseStatusProps {
  className?: string;
}

const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ className = "" }) => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [testing, setTesting] = useState<boolean>(false);

  const checkConnection = async () => {
    setTesting(true);
    setConnectionStatus('checking');
    
    try {
      const configured = isSupabaseConfigured();
      setIsConfigured(configured);
      
      if (!configured) {
        setConnectionStatus('disconnected');
        setErrorMessage('Supabase credentials not configured. Using local storage mode.');
        return;
      }
      
      const connected = await testSupabaseConnection();
      if (connected) {
        setConnectionStatus('connected');
        setErrorMessage('');
      } else {
        setConnectionStatus('error');
        setErrorMessage('Failed to connect to Supabase. Check your credentials and network connection.');
      }
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'checking':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Database className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'checking':
        return 'Checking connection...';
      case 'connected':
        return 'Supabase connected';
      case 'disconnected':
        return 'Local storage mode';
      case 'error':
        return 'Connection failed';
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600 dark:text-green-400';
      case 'disconnected':
        return 'text-gray-600 dark:text-gray-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Database Status</h3>
        </div>
        <button
          onClick={checkConnection}
          disabled={testing}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors disabled:opacity-50"
          title="Refresh connection status"
        >
          <RefreshCw className={`h-4 w-4 ${testing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {errorMessage && (
          <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded p-2">
            {errorMessage}
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Configuration:</span>
            <span className={isConfigured ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}>
              {isConfigured ? 'Valid' : 'Missing'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Mode:</span>
            <span>
              {connectionStatus === 'connected' ? 'Database' : 'Local Storage'}
            </span>
          </div>
        </div>

        {!isConfigured && (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <p className="mb-2">To enable Supabase:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Create a <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">.env</code> file</li>
              <li>Add your Supabase URL and anon key</li>
              <li>Set <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">VITE_USE_SERVER_DB=true</code></li>
              <li>Restart the application</li>
            </ol>
          </div>
        )}

        {connectionStatus === 'error' && isConfigured && (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <p className="mb-2">Troubleshooting steps:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Verify your Supabase project is active</li>
              <li>Check your API keys in the Supabase dashboard</li>
              <li>Ensure your database tables exist</li>
              <li>Check your internet connection</li>
              <li>Review browser console for detailed errors</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseStatus;
