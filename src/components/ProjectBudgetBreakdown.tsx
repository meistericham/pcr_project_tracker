import React, { useState } from 'react';
import { 
  Hash, 
  DollarSign, 
  TrendingDown, 
  Calendar, 
  Tag, 
  BarChart3,
  PieChart,
  Filter,
  Download,
  Eye,
  X
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Project, BudgetEntry } from '../types';
import { formatMYR } from '../utils/currency';

interface ProjectBudgetBreakdownProps {
  project: Project;
  onClose: () => void;
}

const ProjectBudgetBreakdown: React.FC<ProjectBudgetBreakdownProps> = ({ project, onClose }) => {
  const { budgetEntries, budgetCodes } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'quarter' | 'year'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get all entries for this project
  const projectEntries = budgetEntries.filter(entry => entry.projectId === project.id);
  
  // Filter entries based on selected period
  const getFilteredEntries = () => {
    let filtered = projectEntries;
    
    if (selectedPeriod !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (selectedPeriod) {
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(entry => new Date(entry.date) >= cutoffDate);
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(entry => entry.category === selectedCategory);
    }
    
    return filtered;
  };

  const filteredEntries = getFilteredEntries();
  
  // Group entries by budget code
  const entriesByBudgetCode = filteredEntries.reduce((acc, entry) => {
    const codeId = entry.budgetCodeId || 'no-code';
    if (!acc[codeId]) {
      acc[codeId] = [];
    }
    acc[codeId].push(entry);
    return acc;
  }, {} as Record<string, BudgetEntry[]>);

  // Calculate totals for each budget code
  const budgetCodeSummary = Object.entries(entriesByBudgetCode).map(([codeId, entries]) => {
    const code = budgetCodes.find(c => c.id === codeId);
    const expenses = entries.filter(e => e.type === 'expense');
    const income = entries.filter(e => e.type === 'income');
    
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = income.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      codeId,
      code: code ? `${code.code} - ${code.name}` : 'No Budget Code',
      codeObject: code,
      entries,
      expenses,
      income,
      totalExpenses,
      totalIncome,
      netAmount: totalIncome - totalExpenses,
      entryCount: entries.length
    };
  }).sort((a, b) => b.totalExpenses - a.totalExpenses);

  const totalProjectExpenses = budgetCodeSummary.reduce((sum, item) => sum + item.totalExpenses, 0);
  const totalProjectIncome = budgetCodeSummary.reduce((sum, item) => sum + item.totalIncome, 0);

  // Get unique categories for filter
  const categories = [...new Set(projectEntries.map(entry => entry.category))];

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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Budget Breakdown: {project.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Detailed expense analysis by budget codes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters - Fixed */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <div className="ml-auto flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredEntries.length} transactions
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards - Fixed */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Budget</p>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-300">
                    {formatMYR(project.budget)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Expenses</p>
                  <p className="text-lg font-bold text-red-900 dark:text-red-300">
                    {formatMYR(totalProjectExpenses)}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Remaining</p>
                  <p className="text-lg font-bold text-green-900 dark:text-green-300">
                    {formatMYR(project.budget - totalProjectExpenses)}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Budget Used</p>
                  <p className="text-lg font-bold text-purple-900 dark:text-purple-300">
                    {((totalProjectExpenses / project.budget) * 100).toFixed(1)}%
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Budget Code Breakdown - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Expenses by Budget Code
            </h3>

            <div className="space-y-6">
              {budgetCodeSummary.map((summary) => (
                <div
                  key={summary.codeId}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                >
                  {/* Budget Code Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Hash className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {summary.code}
                        </h4>
                        {summary.codeObject && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {summary.codeObject.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">
                        {formatMYR(summary.totalExpenses)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {summary.entryCount} transactions
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Budget Usage</span>
                      <span>
                        {((summary.totalExpenses / project.budget) * 100).toFixed(1)}% of total budget
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((summary.totalExpenses / project.budget) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Transactions List */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recent Transactions
                    </h5>
                    {summary.entries.slice(0, 5).map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <TrendingDown className={`h-4 w-4 ${
                                entry.type === 'expense' ? 'text-red-500' : 'text-green-500'
                              }`} />
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
                    ))}
                    
                    {summary.entries.length > 5 && (
                      <div className="text-center pt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          +{summary.entries.length - 5} more transactions
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {budgetCodeSummary.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Hash className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No transactions found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No budget entries match the selected filters for this project.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBudgetBreakdown;