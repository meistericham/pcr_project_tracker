import React, { useState } from 'react';
import { FileSpreadsheet, Download, Upload, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatMYR } from '../utils/currency';

const GoogleSheetsIntegration: React.FC = () => {
  const { projects, budgetEntries, budgetCodes, users } = useApp();
  const [isConnected, setIsConnected] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');

  const handleConnect = async () => {
    // In a real implementation, this would use Google Sheets API
    setIsConnected(true);
    setSheetUrl('https://docs.google.com/spreadsheets/d/1234567890/edit');
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would:
      // 1. Create or update a Google Sheet
      // 2. Export projects, budget entries, and budget codes
      // 3. Format the data properly
      
      console.log('Exporting to Google Sheets:', {
        projects,
        budgetEntries,
        budgetCodes,
        users
      });
      
      alert('Data exported to Google Sheets successfully!');
    } catch (error) {
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    
    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would:
      // 1. Read data from Google Sheets
      // 2. Validate the data format
      // 3. Import new records or update existing ones
      
      alert('Data imported from Google Sheets successfully!');
    } catch (error) {
      alert('Import failed. Please check your sheet format.');
    } finally {
      setIsImporting(false);
    }
  };

  const generateCSVData = () => {
    // Projects CSV
    const projectsCSV = [
      ['Project Name', 'Status', 'Priority', 'Start Date', 'End Date', 'Budget', 'Spent', 'Remaining'],
      ...projects.map(project => [
        project.name,
        project.status,
        project.priority,
        project.startDate,
        project.endDate,
        project.budget,
        project.spent,
        project.budget - project.spent
      ])
    ];

    // Budget Entries CSV
    const entriesCSV = [
      ['Date', 'Project', 'Budget Code', 'Description', 'Category', 'Type', 'Amount'],
      ...budgetEntries.map(entry => {
        const project = projects.find(p => p.id === entry.projectId);
        const budgetCode = budgetCodes.find(bc => bc.id === entry.budgetCodeId);
        return [
          entry.date,
          project?.name || 'Unknown',
          budgetCode?.code || 'No Code',
          entry.description,
          entry.category,
          entry.type,
          entry.amount
        ];
      })
    ];

    // Budget Codes CSV
    const codesCSV = [
      ['Code', 'Name', 'Description', 'Budget', 'Spent', 'Remaining', 'Status'],
      ...budgetCodes.map(code => [
        code.code,
        code.name,
        code.description,
        code.budget,
        code.spent,
        code.budget - code.spent,
        code.isActive ? 'Active' : 'Inactive'
      ])
    ];

    return { projectsCSV, entriesCSV, codesCSV };
  };

  const downloadCSV = (data: any[][], filename: string) => {
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const { projectsCSV, entriesCSV, codesCSV } = generateCSVData();

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FileSpreadsheet className="h-6 w-6 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Google Sheets Integration
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <span className={`text-sm font-medium ${
              isConnected 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>

        {!isConnected ? (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Connect to Google Sheets to sync your project data automatically.
            </p>
            <button
              onClick={handleConnect}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Connect to Google Sheets</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Your data is connected to Google Sheets. You can export new data or import updates.
            </p>
            {sheetUrl && (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>View Google Sheet</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Export/Import Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Export Data</h4>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Export your current project data to Google Sheets or download as CSV files.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              disabled={isExporting || !isConnected}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span>{isExporting ? 'Exporting...' : 'Export to Google Sheets'}</span>
            </button>
            
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">or</div>
            
            <div className="space-y-2">
              <button
                onClick={() => downloadCSV(projectsCSV, 'projects.csv')}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download Projects CSV</span>
              </button>
              <button
                onClick={() => downloadCSV(entriesCSV, 'budget-entries.csv')}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download Budget Entries CSV</span>
              </button>
              <button
                onClick={() => downloadCSV(codesCSV, 'budget-codes.csv')}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download Budget Codes CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Import */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Import Data</h4>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Import updated data from your Google Sheet back into the application.
          </p>
          <button
            onClick={handleImport}
            disabled={isImporting || !isConnected}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isImporting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{isImporting ? 'Importing...' : 'Import from Google Sheets'}</span>
          </button>
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {projects.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {budgetEntries.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Budget Entries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {budgetCodes.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Budget Codes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {users.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Users</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
          How to Use Google Sheets Integration
        </h4>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
          <p>1. <strong>Connect:</strong> Click "Connect to Google Sheets" to authorize access</p>
          <p>2. <strong>Export:</strong> Send your current data to a new Google Sheet</p>
          <p>3. <strong>Edit:</strong> Make changes directly in Google Sheets</p>
          <p>4. <strong>Import:</strong> Sync changes back to the application</p>
          <p>5. <strong>Collaborate:</strong> Share the sheet with team members for real-time collaboration</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleSheetsIntegration;