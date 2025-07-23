// Add these types to the AppSettings interface in the types file

export interface AppSettings {
  // ... existing settings ...
  smtpHost?: string;
  smtpPort?: number;
  smtpSecurity?: 'none' | 'tls' | 'ssl';
  smtpUsername?: string;
  smtpPassword?: string;
  smtpFromEmail?: string;
  // ... rest of the settings ...
}