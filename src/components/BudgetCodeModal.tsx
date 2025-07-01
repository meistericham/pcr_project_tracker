import React, { useState, useEffect } from 'react';
import { X, Hash, FileText, ToggleLeft, ToggleRight, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { BudgetCode } from '../types';
import { formatMYR } from '../utils/currency';

interface BudgetCodeModalProps {
  code?: BudgetCode | null;
  onClose: () => void;
}

const BudgetCodeModal: React.FC<BudgetCodeModalProps> = ({ code, onClose }) => {
  const { addBudgetCode, updateBudgetCode, currentUser, settings } = useApp();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    budget: '',
    isActive: true
  });

  useEffect(() => {
    if (code) {
      setFormData({
        code: code.code,
        name: code.name,
        description: code.description,
        budget: code.budget.toString(),
        isActive: code.isActive
      });
    }
  }, [code]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const codeData = {
      code: formData.code,
      name: formData.name,
      description: formData.description,
      budget: parseFloat(formData.budget),
      spent: code?.spent || 0, // Keep existing spent amount or start at 0
      isActive: formData.isActive,
      createdBy: currentUser?.id || '1'
    };

    if (code) {
      updateBudgetCode(code.id, codeData);
    } else {
      addBudgetCode(codeData);
    }
    
    onClose();
  };

  const generateSampleCode = () => {
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const randomPrefix = Math.floor(Math.random() * 9) + 1;
    setFormData(prev => ({ ...prev, code: `${randomPrefix}-${randomNum}` }));
  };

  const budgetAmount = parseFloat(formData.budget) || 0;
  const spentAmount = code?.spent || 0;
  const remainingAmount = budgetAmount - spentAmount;
  const usagePercentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {code ? 'Edit Budget Code' : 'Add Budget Code'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Hash className="inline h-4 w-4 mr-1" />
              Budget Code
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., 1-2345"
                pattern="[0-9]+-[0-9]+"
                title="Format: number-number (e.g., 1-2345)"
              />
              <button
                type="button"
                onClick={generateSampleCode}
                className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Format: number-number (e.g., 1-2345, 2-1001)
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter budget code name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe what this budget code is used for"
            />
          </div>

          {/* Budget Allocation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Budget Allocation ({settings.currency})
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Total budget allocated for this activity code
            </p>
          </div>

          {/* Budget Status (for existing codes) */}
          {code && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Current Budget Status
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Allocated Budget:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatMYR(budgetAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Amount Spent:</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {formatMYR(spentAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                  <span className={`font-medium ${
                    remainingAmount >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatMYR(remainingAmount)}
                  </span>
                </div>
                
                {/* Usage Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Budget Usage</span>
                    <span>{usagePercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        usagePercentage >= 90 
                          ? 'bg-red-500' 
                          : usagePercentage >= 75 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Budget Alert */}
                {usagePercentage >= settings.budgetAlertThreshold && (
                  <div className="flex items-center space-x-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-xs text-yellow-800 dark:text-yellow-300">
                      Budget usage exceeds {settings.budgetAlertThreshold}% threshold
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
              className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors ${
                formData.isActive
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
              }`}
            >
              {formData.isActive ? (
                <ToggleRight className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              )}
              <div className="text-left">
                <p className={`text-sm font-medium ${
                  formData.isActive 
                    ? 'text-green-800 dark:text-green-300' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {formData.isActive 
                    ? 'This code can be used in budget entries' 
                    : 'This code is disabled and cannot be used'
                  }
                </p>
              </div>
            </button>
          </div>

          {/* Preview */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Preview:</strong> {formData.code || '[Code]'} - {formData.name || '[Name]'}
            </p>
            {formData.budget && (
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                <strong>Budget:</strong> {formatMYR(budgetAmount)}
              </p>
            )}
            {formData.description && (
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                {formData.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              {code ? 'Update Code' : 'Add Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetCodeModal;