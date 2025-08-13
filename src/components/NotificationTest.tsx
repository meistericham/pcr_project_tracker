import React from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

const NotificationTest: React.FC = () => {
  const { addNotification, notifications, deleteNotification } = useApp();
  const { currentUser } = useAuth();

  const createTestNotification = (type: string) => {
    if (!currentUser) return;

    const testNotifications = {
      project_created: {
        title: 'New Project Created',
        message: 'A new project "Test Project" has been created and assigned to you.',
        data: { projectId: '1' }
      },
      budget_alert: {
        title: 'Budget Alert',
        message: 'Project "Website Redesign" has exceeded 80% of its budget.',
        data: { projectId: '1', percentage: 85.5 }
      },
      budget_entry_added: {
        title: 'New Budget Entry',
        message: 'John Doe added a new expense of MYR 5,000 to Website Redesign.',
        data: { projectId: '1', amount: 5000, type: 'expense' }
      },
      user_assigned: {
        title: 'User Assigned',
        message: 'You have been assigned to the "Mobile App Development" project.',
        data: { projectId: '2' }
      },
      project_completed: {
        title: 'Project Completed',
        message: 'The "Marketing Campaign Q1" project has been marked as completed.',
        data: { projectId: '3' }
      },
      budget_code_alert: {
        title: 'Budget Code Alert',
        message: 'Budget code "1-2345 - Software Development" has used 90% of its allocated budget.',
        data: { budgetCodeId: '1', percentage: 90.2, budget: 500000, spent: 451000 }
      }
    };

    const notification = testNotifications[type as keyof typeof testNotifications];
    if (notification) {
      addNotification({
        userId: currentUser.id,
        type: type as any,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        read: false
      });
    }
  };

  const clearAllNotifications = () => {
    notifications.forEach(notification => {
      if (notification.userId === currentUser?.id) {
        deleteNotification(notification.id);
      }
    });
  };

  const userNotifications = notifications.filter(n => n.userId === currentUser?.id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Notification Test Panel
        </h2>
        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium px-2 py-1 rounded-full">
          {userNotifications.length} total
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => createTestNotification('project_created')}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Project Created</span>
        </button>

        <button
          onClick={() => createTestNotification('budget_alert')}
          className="flex items-center space-x-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Budget Alert</span>
        </button>

        <button
          onClick={() => createTestNotification('budget_entry_added')}
          className="flex items-center space-x-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Budget Entry</span>
        </button>

        <button
          onClick={() => createTestNotification('user_assigned')}
          className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">User Assigned</span>
        </button>

        <button
          onClick={() => createTestNotification('project_completed')}
          className="flex items-center space-x-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Project Completed</span>
        </button>

        <button
          onClick={() => createTestNotification('budget_code_alert')}
          className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Budget Code Alert</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {userNotifications.filter(n => !n.read).length} unread notifications
        </div>
        <button
          onClick={clearAllNotifications}
          className="flex items-center space-x-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-sm">Clear All</span>
        </button>
      </div>

      {/* Recent Notifications Preview */}
      {userNotifications.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            Recent Notifications
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {userNotifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border-l-4 ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${
                      !notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {notification.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationTest;
