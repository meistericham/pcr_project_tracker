import React, { useState } from 'react';
import { X, Download, FileText, BarChart3, FolderOpen, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { exportProjectReport, exportBudgetCodeReport, exportProjectDetailReport } from '../lib/pdfExport';

interface ReportExportModalProps {
  onClose: () => void;
}

const ReportExportModal: React.FC<ReportExportModalProps> = ({ onClose }) => {
  const { projects, budgetEntries, budgetCodes, users } = useApp();
  const [reportType, setReportType] = useState<'overview' | 'budget-codes' | 'project-detail'>('overview');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const reportData = {
        projects,
        budgetEntries,
        budgetCodes,
        users,
        dateRange: dateRange.start && dateRange.end ? dateRange : undefined
      };

      switch (reportType) {
        case 'overview':
          exportProjectReport(reportData);
          break;
        case 'budget-codes':
          exportBudgetCodeReport(reportData);
          break;
        case 'project-detail':
          if (selectedProject) {
            const project = projects.find(p => p.id === selectedProject);
            if (project) {
              exportProjectDetailReport(project, reportData);
            }
          }
          break;
      }
      
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const reportTypes = [
    {
      id: 'overview',
      title: 'Complete Overview Report',
      description: 'Comprehensive report including all projects, budget codes, and transactions',
      icon: BarChart3
    },
    {
      id: 'budget-codes',
      title: 'Budget Code Analysis',
      description: 'Detailed analysis of budget code performance and usage',
      icon: FileText
    },
    {
      id: 'project-detail',
      title: 'Individual Project Report',
      description: 'Detailed report for a specific project including all related data',
      icon: FolderOpen
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Export PDF Report
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Report Type
            </label>
            <div className="space-y-3">
              {reportTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={type.id}
                    checked={reportType === type.id}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-start space-x-3 flex-1">
                    <type.icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {type.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Project Selection for Project Detail Report */}
          {reportType === 'project-detail' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Calendar className="inline h-4 w-4 mr-1" />
              Date Range Filter (Optional)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Leave empty to include all data
            </p>
          </div>

          {/* Report Preview */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
              Report Preview
            </h4>
            <div className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
              <p>• {projects.length} projects</p>
              <p>• {budgetCodes.length} budget codes</p>
              <p>• {budgetEntries.length} budget entries</p>
              <p>• {users.length} team members</p>
              {dateRange.start && dateRange.end && (
                <p>• Filtered from {new Date(dateRange.start).toLocaleDateString()} to {new Date(dateRange.end).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || (reportType === 'project-detail' && !selectedProject)}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportExportModal;