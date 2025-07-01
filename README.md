# PCR Project and Budget Tracker

A comprehensive project and budget management system built with React, TypeScript, and Tailwind CSS. Features real-time budget tracking, activity-based budget codes, team collaboration, and detailed reporting with PDF export capabilities.

## 🚀 Features

### **Project Management**
- Create and manage projects with detailed information
- Track project status, priority, and timeline
- Assign team members and budget codes
- Real-time budget monitoring and alerts
- Project-specific budget breakdowns

### **Budget Code System**
- Individual budget allocation for each activity code
- Real-time spending tracking against allocations
- Budget usage alerts and notifications
- Cross-project budget code usage
- Comprehensive budget code analytics

### **Financial Tracking**
- Expense and income tracking
- Category-based budget entries
- Automatic budget calculations
- Budget alert thresholds
- Multi-currency support (MYR, USD, EUR, GBP)

### **Team Collaboration**
- User role management (Super Admin, Admin, User)
- Real-time notifications
- Project assignment and collaboration
- Activity tracking and updates

### **Reporting & Analytics**
- Comprehensive PDF report generation
- Project overview reports
- Budget code analysis reports
- Individual project detail reports
- Visual charts and analytics
- Export functionality

### **Database Integration**
- Supabase integration for persistent storage
- Real-time data synchronization
- Automatic backups
- Row-level security
- Scalable PostgreSQL backend

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **PDF Generation**: jsPDF with autoTable
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with dark mode support

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pcr-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials in the `.env` file.

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

### **Option 1: Supabase (Recommended)**

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

2. **Set up the database schema**
   - Go to the SQL Editor in your Supabase dashboard
   - Run the SQL schema provided in the Database Setup section of the app
   - This creates all necessary tables and security policies

3. **Configure environment variables**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Restart the development server**
   ```bash
   npm run dev
   ```

### **Option 2: In-Memory Storage (Development Only)**

The app includes mock data and in-memory storage for development and testing purposes. No additional setup required.

## 📊 Features Overview

### **Dashboard Views**
- **Projects**: Manage all projects with budget tracking
- **Budget**: Comprehensive budget management and analytics
- **Budget Codes**: Activity-based budget code management
- **Users**: Team member management (Admin only)
- **Settings**: System configuration and database setup

### **Budget Code System**
- Create activity-based budget codes (e.g., "1-2345 - Software Development")
- Allocate individual budgets for each code
- Track spending against each allocation
- Real-time usage monitoring and alerts
- Cross-project budget code assignment

### **Project Budget Tracking**
- Dual budget system: Project budgets + Budget code allocations
- Real-time spending updates
- Budget usage alerts at configurable thresholds
- Detailed budget breakdowns by activity codes
- Visual progress indicators

### **Reporting System**
- **Complete Overview Report**: All projects, budget codes, and transactions
- **Budget Code Analysis**: Detailed performance analysis by activity codes
- **Project Detail Report**: Comprehensive individual project reports
- **PDF Export**: Professional PDF generation with charts and tables
- **Date Range Filtering**: Customizable reporting periods

### **Notification System**
- Real-time notifications for budget alerts
- Project updates and assignments
- Budget code usage warnings
- Team collaboration notifications
- Configurable notification preferences

## 🎨 Design Features

- **Modern UI**: Clean, professional interface design
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Accessibility**: WCAG compliant with proper contrast ratios
- **Micro-interactions**: Smooth animations and hover effects
- **Visual Feedback**: Progress bars, status indicators, and alerts

## 🔧 Configuration

### **System Settings**
- Company information and branding
- Currency and regional settings
- Budget alert thresholds
- Project defaults and policies
- Notification preferences
- Theme and appearance options

### **User Roles**
- **Super Admin**: Full system access and user management
- **Admin**: Project and budget management, limited user access
- **User**: View projects and budgets, basic collaboration

### **Budget Policies**
- Configurable budget alert thresholds
- Budget approval requirements
- Negative budget allowances
- Category management
- Fiscal year settings

## 📈 Analytics & Reporting

### **Visual Analytics**
- Project spending distribution (pie charts)
- Monthly and yearly spending trends (bar/line charts)
- Category-based spending analysis
- Budget usage progress indicators
- Real-time dashboard metrics

### **Export Options**
- PDF reports with professional formatting
- Comprehensive data tables
- Visual charts and graphs
- Customizable date ranges
- Multiple report types

## 🚀 Deployment

### **Production Deployment**
1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider

3. Ensure environment variables are set in production

4. Configure Supabase for production use with proper security policies

### **Environment Variables**
```env
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the in-app Database Setup guide
- Review the Settings documentation
- Contact your system administrator

## 🔄 Updates

The application includes:
- Automatic data synchronization with Supabase
- Real-time notifications
- Progressive web app capabilities
- Offline support (coming soon)
- Mobile app version (planned)

---

**PCR Tracker** - Professional project and budget management made simple.