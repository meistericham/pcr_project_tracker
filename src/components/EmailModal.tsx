import React, { useState } from 'react';
import { X, Mail, Send, Users, FileText, DollarSign } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Project, BudgetEntry } from '../types';
import { formatMYR } from '../utils/currency';

interface EmailModalProps {
  project?: Project;
  budgetEntries?: BudgetEntry[];
  onClose: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ project, budgetEntries, onClose }) => {
  const { users, currentUser } = useApp();
  const [formData, setFormData] = useState({
    to: [] as string[],
    subject: project ? `Project Update: ${project.name}` : 'Budget Report',
    message: '',
    includeProjectDetails: true,
    includeBudgetSummary: true,
    includeTransactions: true
  });
  const [isSending, setIsSending] = useState(false);

  const projectUsers = project ? users.filter(user => 
    project.assignedUsers.includes(user.id) || user.id === project.createdBy
  ) : [];

  const handleUserToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      to: prev.to.includes(userId)
        ? prev.to.filter(id => id !== userId)
        : [...prev.to, userId]
    }));
  };

  const handleSend = async () => {
    setIsSending(true);
    
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call your email service here
      console.log('Email sent:', {
        to: formData.to.map(id => users.find(u => u.id === id)?.email),
        subject: formData.subject,
        message: formData.message,
        project,
        budgetEntries
      });
      
      alert('Email sent successfully!');
      onClose();
    } catch (error) {
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const generateEmailContent = () => {
    let content = formData.message + '\n\n';
    
    if (project && formData.includeProjectDetails) {
      content += `PROJECT DETAILS:\n`;
      content += `Name: ${project.name}\n`;
      content += `Status: ${project.status.replace('_', ' ').toUpperCase()}\n`;
      content += `Priority: ${project.priority.toUpperCase()}\n`;
      content += `Budget: ${formatMYR(project.budget)}\n`;
      content += `Spent: ${formatMYR(project.spent)}\n`;
      content += `Remaining: ${formatMYR(project.budget - project.spent)}\n\n`;
    }
    
    if (budgetEntries && formData.includeTransactions && budgetEntries.length > 0) {
      content += `RECENT TRANSACTIONS:\n`;
      budgetEntries.slice(0, 10).forEach(entry => {
        content += `- ${entry.date}: ${entry.description} - ${formatMYR(entry.amount)} (${entry.type})\n`;
      });
      content += '\n';
    }
    
    if (formData.includeBudgetSummary && budgetEntries) {
      const totalExpenses = budgetEntries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
      const totalIncome = budgetEntries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
      
      content += `BUDGET SUMMARY:\n`;
      content += `Total Expenses: ${formatMYR(totalExpenses)}\n`;
      content += `Total Income: ${formatMYR(totalIncome)}\n`;
      content += `Net: ${formatMYR(totalIncome - totalExpenses)}\n\n`;
    }
    
    content += `Best regards,\n${currentUser?.name}\nPCR Tracker`;
    
    return content;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Send Email Report
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Users className="inline h-4 w-4 mr-1" />
              Recipients
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {(project ? projectUsers : users).map((user) => (
                <label
                  key={user.id}
                  className="flex items-center space-x-3 p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.to.includes(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{user.initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter email subject"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <textarea
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your message..."
            />
          </div>

          {/* Include Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Include in Email
            </label>
            <div className="space-y-2">
              {project && (
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.includeProjectDetails}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeProjectDetails: e.target.checked }))}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Project Details</span>
                  </div>
                </label>
              )}
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.includeBudgetSummary}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeBudgetSummary: e.target.checked }))}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Budget Summary</span>
                </div>
              </label>
              
              {budgetEntries && budgetEntries.length > 0 && (
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.includeTransactions}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeTransactions: e.target.checked }))}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Recent Transactions</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Preview
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg max-h-40 overflow-y-auto">
              <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {generateEmailContent()}
              </pre>
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
            onClick={handleSend}
            disabled={isSending || formData.to.length === 0}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>{isSending ? 'Sending...' : 'Send Email'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;