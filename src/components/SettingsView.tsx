// The only change needed is in the renderGeneralSettings function inside SettingsView.tsx
// Add this section after the Appearance section

{/* Email Settings */}
<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
  <div className="flex items-center space-x-3 mb-4">
    <Mail className="h-5 w-5 text-orange-600 dark:text-orange-400" />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Settings</h3>
  </div>
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        SMTP Host
      </label>
      <input
        type="text"
        value={formData.smtpHost || ''}
        onChange={(e) => handleInputChange('smtpHost', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="smtp.example.com"
        disabled={!isSuperAdmin}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          SMTP Port
        </label>
        <input
          type="number"
          value={formData.smtpPort || ''}
          onChange={(e) => handleInputChange('smtpPort', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="587"
          disabled={!isSuperAdmin}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Security
        </label>
        <select
          value={formData.smtpSecurity || 'tls'}
          onChange={(e) => handleInputChange('smtpSecurity', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          disabled={!isSuperAdmin}
        >
          <option value="none">None</option>
          <option value="tls">TLS</option>
          <option value="ssl">SSL</option>
        </select>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        SMTP Username
      </label>
      <input
        type="text"
        value={formData.smtpUsername || ''}
        onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="username@example.com"
        disabled={!isSuperAdmin}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        SMTP Password
      </label>
      <input
        type="password"
        value={formData.smtpPassword || ''}
        onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="••••••••"
        disabled={!isSuperAdmin}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        From Email Address
      </label>
      <input
        type="email"
        value={formData.smtpFromEmail || ''}
        onChange={(e) => handleInputChange('smtpFromEmail', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="noreply@example.com"
        disabled={!isSuperAdmin}
      />
    </div>
    {!isSuperAdmin && (
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Only Super Admins can modify email settings
      </p>
    )}
    {isSuperAdmin && (
      <button
        onClick={() => {
          // TODO: Implement test email functionality
          alert('Test email functionality will be implemented here');
        }}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
      >
        <Mail className="h-4 w-4" />
        <span>Send Test Email</span>
      </button>
    )}
  </div>
</div>