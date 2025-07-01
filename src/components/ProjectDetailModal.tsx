import React from 'react';
import { 
  X, 
  Calendar, 
  DollarSign, 
  Users, 
  Hash, 
  BarChart3,
  TrendingDown,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Project } from '../types';
import { formatMYR } from '../utils/currency';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const { users, budgetCodes, budgetEntries, settings } = useApp();

  const projectEntries = budgetEntries.filter(entry => entry.projectId === project.id);
  const assignedUsers = users.filter(user => project.assignedUsers.includes(user.id));
  const projectBudgetCodes = budgetCodes.filter(code => project.budgetCodes.includes(code.id));
  
  const totalExpenses = projectEntries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = projectEntries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const budgetUsagePercentage = (project.spent / project.budget) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'planning':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'on_hold':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'planning':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'on_hold':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Design': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      'Development': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      'Marketing': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      'Software': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
      'Research': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      'Advertising': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      'Equipment': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
      'Travel': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
      'Training': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300',
      'Other': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {project.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Project Details and Analytics
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Project Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Project Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(project.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Priority</label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 capitalize">
                      {project.priority} Priority
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Start Date</label>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {new Date(project.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">End Date</label>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Budget Overview */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Budget Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-blue-600 dark:text-blue-400">Total Budget</p>
                    <p className="text-xl font-bold text-blue-900 dark:text-blue-300">
                      {formatMYR(project.budget)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                    <p className="text-sm text-red-600 dark:text-red-400">Amount Spent</p>
                    <p className="text-xl font-bold text-red-900 dark:text-red-300">
                      {formatMYR(project.spent)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-green-600 dark:text-green-400">Remaining</p>
                    <p className="text-xl font-bold text-green-900 dark:text-green-300">
                      {formatMYR(project.budget - project.spent)}
                    </p>
                  </div>
                </div>

                {/* Budget Progress */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Budget Usage</span>
                    <span>{budgetUsagePercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        budgetUsagePercentage >= 90 
                          ? 'bg-red-500' 
                          : budgetUsagePercentage >= settings.budgetAlertThreshold 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(budgetUsagePercentage, 100)}%` }}
                    ></div>
                  </div>
                  {budgetUsagePercentage >= settings.budgetAlertThreshold && (
                    <div className="flex items-center space-x-2 mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-xs text-yellow-800 dark:text-yellow-300">
                        Budget usage exceeds {settings.budgetAlertThreshold}% threshold
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Transactions ({projectEntries.length})
                </h3>
                {projectEntries.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {projectEntries.slice(0, 10).map((entry) => {
                      const budgetCode = budgetCodes.find(bc => bc.id === entry.budgetCodeId);
                      return (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                {entry.type === 'expense' ? (
                                  <TrendingDown className="h-4 w-4 text-red-500" />
                                ) : (
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                )}
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {entry.description}
                                </span>
                              </div>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(entry.category)}`}>
                                {entry.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(entry.date).toLocaleDateString()}</span>
                              </div>
                              {budgetCode && (
                                <div className="flex items-center space-x-1">
                                  <Hash className="h-3 w-3" />
                                  <span>{budgetCode.code}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-semibold ${
                              entry.type === 'expense' 
                                ? 'text-red-600 dark:text-red-400' 
                                : 'text-green-600 dark:text-green-400'
                            }`}>
                              {entry.type === 'expense' ? '-' : '+'}{formatMYR(entry.amount)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Team & Budget Codes */}
            <div className="space-y-6">
              {/* Assigned Team */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  <Users className="inline h-5 w-5 mr-2" />
                  Team Members ({assignedUsers.length})
                </h3>
                {assignedUsers.length > 0 ? (
                  <div className="space-y-3">
                    {assignedUsers.map((user) => (
                      <div key={user.id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{user.initials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {user.role.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No team members assigned</p>
                )}
              </div>

              {/* Budget Codes */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  <Hash className="inline h-5 w-5 mr-2" />
                  Budget Codes ({projectBudgetCodes.length})
                </h3>
                {projectBudgetCodes.length > 0 ? (
                  <div className="space-y-3">
                    {projectBudgetCodes.map((code) => {
                      const codeUsage = (code.spent / code.budget) * 100;
                      return (
                        <div key={code.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {code.code}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {codeUsage.toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {code.name}
                          </p>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                codeUsage >= 90 ? 'bg-red-500' : 
                                codeUsage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(codeUsage, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>{formatMYR(code.spent)}</span>
                            <span>{formatMYR(code.budget)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No budget codes assigned</p>
                )}
              </div>

              {/* Financial Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Financial Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Expenses:</span>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {formatMYR(totalExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Income:</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {formatMYR(totalIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Net Amount:</span>
                    <span className={`text-sm font-bold ${
                      totalIncome - totalExpenses >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatMYR(totalIncome - totalExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Transactions:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {projectEntries.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;