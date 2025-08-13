# PCR Project Tracker - Coolify Deployment Guide

This guide will help you deploy the PCR Project Tracker using Coolify, a self-hosted platform for deploying applications.

## Prerequisites

- A VPS/server with Coolify installed
- Domain name pointing to your server
- GitHub repository access
- Basic understanding of environment variables

## 📋 Table of Contents

1. [Coolify Server Setup](#coolify-server-setup)
2. [Application Deployment](#application-deployment)
3. [Database Configuration](#database-configuration)
4. [Environment Variables](#environment-variables)
5. [SSL and Domain Setup](#ssl-and-domain-setup)
6. [Troubleshooting](#troubleshooting)

## 🖥️ Coolify Server Setup

### Step 1: Install Coolify on Your VPS

If you don't have Coolify installed yet:

```bash
# Connect to your VPS
ssh root@your-server-ip

# Install Coolify (requires Ubuntu 20.04+ or Debian 11+)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

### Step 2: Access Coolify Dashboard

1. Open your browser and go to `http://your-server-ip:8000`
2. Complete the initial setup wizard
3. Create your admin account
4. Set up your server and domain

## 🚀 Application Deployment

### Step 1: Create New Project

1. **Login to Coolify Dashboard**
2. **Click "New Project"**
3. **Enter project details:**
   - Name: `PCR Project Tracker`
   - Description: `Budget and Project Management System`

### Step 2: Add Application

1. **Click "New Resource" → "Application"**
2. **Choose deployment method: "Public Repository"**
3. **Repository Configuration:**
   ```
   Repository URL: https://github.com/meistericham/pcr_project_tracker.git
   Branch: hisyam/deploy-20250813-200831
   ```

### Step 3: Build Configuration

1. **Build Settings:**
   ```
   Build Command: npm ci && npm run build
   Start Command: preview (or leave empty for auto-detection)
   Port: 4173
   ```

2. **Advanced Build Settings:**
   ```
   Node.js Version: 18 (or latest LTS)
   Install Command: npm ci
   Build Command: npm run build
   Output Directory: dist
   ```

### Step 4: Dockerfile Configuration (Alternative)

If you prefer using Docker (recommended for production):

1. **Select "Dockerfile" as build method**
2. **Dockerfile location:** `/Dockerfile` (root of repository)
3. **The existing Dockerfile will handle the build process**

## 🗄️ Database Configuration

### Option A: Use Coolify's Built-in PostgreSQL

1. **In your project, click "New Resource" → "Database"**
2. **Select "PostgreSQL"**
3. **Database Configuration:**
   ```
   Database Name: pcr_tracker
   Username: pcr_user
   Password: [auto-generated or custom]
   Port: 5432
   ```

### Option B: Use External Supabase

1. **Create Supabase project** (as described in `SUPABASE_SETUP.md`)
2. **Use Supabase connection details in environment variables**

## ⚙️ Environment Variables

In Coolify, add these environment variables to your application:

### Required Variables

```env
# Application
NODE_ENV=production
VITE_APP_NAME=PCR Project Tracker
VITE_APP_VERSION=0.9.02

# Database Mode
VITE_USE_SERVER_DB=true

# Database (if using Coolify PostgreSQL)
POSTGRES_DB=pcr_tracker
POSTGRES_USER=pcr_user
POSTGRES_PASSWORD=[your-generated-password]
POSTGRES_HOST=[coolify-generated-host]
POSTGRES_PORT=5432

# Supabase (if using Supabase instead)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Security
JWT_SECRET=[generate-random-string]
SESSION_SECRET=[generate-random-string]

# Email (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

### Setting Environment Variables in Coolify

1. **Go to your application** → **Environment Variables**
2. **Click "Add Variable"**
3. **Add each variable one by one**
4. **Mark sensitive variables as "Secret"**

## 🌐 SSL and Domain Setup

### Step 1: Domain Configuration

1. **In Coolify, go to your application**
2. **Click "Domains" tab**
3. **Add your domain:**
   ```
   Domain: pcr.yourdomain.com
   Or: yourdomain.com
   ```

### Step 2: SSL Certificate

1. **Coolify automatically handles SSL with Let's Encrypt**
2. **Ensure your domain DNS points to your server IP**
3. **Wait for SSL certificate generation (2-5 minutes)**

### Step 3: DNS Configuration

**Add these DNS records to your domain:**

```
Type: A
Name: @ (or pcr)
Value: YOUR_SERVER_IP
TTL: 300

Type: CNAME  
Name: www
Value: yourdomain.com
TTL: 300
```

## 🚀 Deployment Process

### Step 1: Initial Deployment

1. **Click "Deploy" in your Coolify application**
2. **Monitor the build logs**
3. **Wait for deployment to complete**

### Step 2: Database Setup (if using PostgreSQL)

1. **Access your database through Coolify's built-in phpPgAdmin**
2. **Run the SQL schema from `SUPABASE_SETUP.md`:**

```sql
-- Copy and paste the complete schema from SUPABASE_SETUP.md
-- This includes all tables: users, projects, budget_codes, etc.
```

### Step 3: Verify Deployment

1. **Visit your domain: `https://pcr.yourdomain.com`**
2. **Check the login page loads correctly**
3. **Test login with default credentials**
4. **Verify database connection in Settings → Database Setup**

## 🔧 Post-Deployment Configuration

### Health Checks

Coolify can monitor your application health:

1. **Go to application** → **Health Checks**
2. **Add health check:**
   ```
   Path: /
   Port: 4173
   Method: GET
   Expected Status: 200
   ```

### Auto-Deploy from GitHub

1. **Go to application** → **Source**
2. **Enable "Auto Deploy"**
3. **Configure webhook** (Coolify provides the URL)
4. **Add webhook to your GitHub repository**

### Backup Configuration

1. **Database Backups:**
   - Coolify automatically backs up databases
   - Configure backup frequency in database settings

2. **Application Backups:**
   - Enable persistent volume for uploaded files
   - Configure backup retention policy

## 🔍 Troubleshooting

### Common Issues and Solutions

#### Build Failures

**Issue:** npm install fails
```bash
# Solution: Clear build cache in Coolify
# Or update Node.js version in build settings
```

**Issue:** Build timeout
```bash
# Solution: Increase build timeout in advanced settings
# Or optimize build process
```

#### Runtime Issues

**Issue:** Application won't start
```bash
# Check logs in Coolify dashboard
# Verify environment variables are set
# Check if port 4173 is correctly configured
```

**Issue:** Database connection failed
```bash
# Verify database is running
# Check environment variables
# Ensure database schema is created
```

#### SSL Issues

**Issue:** SSL certificate generation failed
```bash
# Verify DNS is pointing to correct IP
# Check domain is accessible via HTTP first
# Wait 5-10 minutes and retry
```

### Debugging Commands

**Access application logs:**
```bash
# In Coolify dashboard → Logs tab
# Real-time monitoring available
```

**Database access:**
```bash
# Use built-in database manager in Coolify
# Or connect via external tools using provided credentials
```

## 📊 Monitoring and Maintenance

### Application Monitoring

1. **Resource Usage:**
   - Monitor CPU, memory, and disk usage in Coolify
   - Set up alerts for high resource usage

2. **Uptime Monitoring:**
   - Enable health checks
   - Configure notification webhooks

### Updates and Maintenance

1. **Application Updates:**
   - Push to GitHub branch
   - Auto-deploy will trigger (if enabled)
   - Manual deploy option available

2. **Coolify Updates:**
   ```bash
   # SSH to your server
   coolify update
   ```

## 🎯 Production Checklist

Before going live, ensure:

- [ ] Domain DNS is correctly configured
- [ ] SSL certificate is active
- [ ] Database schema is installed
- [ ] Environment variables are set
- [ ] Health checks are configured
- [ ] Backups are enabled
- [ ] Monitoring is set up
- [ ] Application loads and functions correctly
- [ ] Default admin accounts are secured

## 🔐 Security Recommendations

1. **Change default passwords**
2. **Enable two-factor authentication** (if supported)
3. **Regular security updates**
4. **Monitor access logs**
5. **Use strong JWT secrets**
6. **Enable rate limiting** (configure in Coolify)

## 📚 Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [PCR Tracker GitHub Repository](https://github.com/meistericham/pcr_project_tracker)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Docker Deployment Guide](./README_DOCKER.md)

## 🆘 Support

If you encounter issues:

1. Check Coolify logs and application logs
2. Review this guide and troubleshooting section
3. Verify environment variables and configurations
4. Check DNS and SSL settings
5. Consult Coolify community documentation

---

**Your PCR Project Tracker should now be successfully deployed on Coolify! 🎉**

For any deployment issues, check the logs in Coolify dashboard and verify all environment variables are correctly set.
