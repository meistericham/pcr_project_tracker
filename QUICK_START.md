# 🚀 PCR Project Tracker - Quick Start Guide

## ✅ **Your Docker Environment is Ready!**

Your PCR Project Tracker is now running successfully in Docker containers.

---

## 🌐 **Access Your Application**

### **Main Application**
- **URL:** http://localhost:3000
- **Status:** ✅ Running
- **Features:** Full PCR Project Tracker with all functionality

### **Mail Testing Interface**
- **URL:** http://localhost:8025
- **Status:** ✅ Running
- **Purpose:** View and test email functionality

### **Database**
- **Host:** localhost
- **Port:** 5432
- **Database:** pcr_tracker
- **Username:** postgres
- **Password:** postgres

---

## 🔐 **Login Credentials**

Use any of these accounts to log in:

| Email | Password | Role |
|-------|----------|------|
| `hisyamudin@sarawaktourism.com` | `11223344` | Super Admin |
| `john@company.com` | `demo123` | Super Admin |
| `sarah@company.com` | `demo123` | Admin |
| `mike@company.com` | `demo123` | User |

---

## 🛠️ **Managing Your Docker Environment**

### **Using the Manager Script (Recommended)**

```bash
# Check status
./docker-manager.sh status

# View logs
./docker-manager.sh logs

# Stop all containers
./docker-manager.sh stop

# Start development environment
./docker-manager.sh start-dev

# Rebuild containers
./docker-manager.sh rebuild

# Clean up everything
./docker-manager.sh cleanup
```

### **Using Docker Compose Directly**

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop containers
docker-compose -f docker-compose.dev.yml down

# Rebuild
docker-compose -f docker-compose.dev.yml up -d --build
```

---

## 📁 **What's Running**

### **Development Environment**
- ✅ **React App** - Hot reloading enabled
- ✅ **PostgreSQL Database** - With sample data
- ✅ **MailHog** - Email testing interface

### **Production Environment (Optional)**
- ✅ **Nginx** - Production web server
- ✅ **Supabase Services** - Auth, API, Realtime
- ✅ **Redis** - Caching
- ✅ **Complete Backend Stack**

---

## 🔧 **Development Workflow**

1. **Start the environment:**
   ```bash
   ./docker-manager.sh start-dev
   ```

2. **Access the app:**
   - Open http://localhost:3000
   - Log in with any of the credentials above

3. **Make changes to code:**
   - Edit files in your local directory
   - Changes are automatically reflected (hot reloading)

4. **Test email functionality:**
   - Send emails from the app
   - View them at http://localhost:8025

5. **Stop when done:**
   ```bash
   ./docker-manager.sh stop
   ```

---

## 🐛 **Troubleshooting**

### **Port Already in Use**
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process or change port in docker-compose.dev.yml
```

### **Container Won't Start**
```bash
# Check logs
./docker-manager.sh logs

# Rebuild containers
./docker-manager.sh rebuild
```

### **Database Issues**
```bash
# Restart database
docker-compose -f docker-compose.dev.yml restart supabase-db

# Check database logs
docker-compose -f docker-compose.dev.yml logs supabase-db
```

### **Permission Issues**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

---

## 📊 **Features Available**

### **Project Management**
- ✅ Create and manage projects
- ✅ Track project status and budget
- ✅ Assign team members
- ✅ Real-time budget monitoring

### **Budget Code System**
- ✅ Activity-based budget codes
- ✅ Real-time spending tracking
- ✅ Budget alerts and notifications

### **Financial Tracking**
- ✅ Expense and income tracking
- ✅ Category-based entries
- ✅ Automatic calculations

### **Team Collaboration**
- ✅ User role management
- ✅ Real-time notifications
- ✅ Project assignments

### **Reporting & Analytics**
- ✅ PDF report generation
- ✅ Visual charts and graphs
- ✅ Export functionality

### **Email System**
- ✅ Send project reports
- ✅ Email notifications
- ✅ Mail testing interface

---

## 🔄 **Next Steps**

1. **Explore the application** - Log in and try all features
2. **Customize settings** - Go to Settings to configure the app
3. **Add your data** - Create projects, budget codes, and entries
4. **Test email functionality** - Send reports and check MailHog
5. **Generate reports** - Use the reporting features

---

## 📞 **Need Help?**

- **Check logs:** `./docker-manager.sh logs`
- **Restart services:** `./docker-manager.sh rebuild`
- **View status:** `./docker-manager.sh status`
- **Clean start:** `./docker-manager.sh cleanup`

---

**🎉 Enjoy using your PCR Project Tracker!**
