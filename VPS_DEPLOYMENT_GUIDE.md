# 🚀 PCR Project Tracker - VPS Deployment Guide

## 📋 **Prerequisites**

### **VPS Requirements:**
- **OS:** Ubuntu 20.04 LTS or later
- **RAM:** Minimum 2GB (4GB recommended)
- **Storage:** Minimum 20GB SSD
- **CPU:** 2 cores minimum
- **Domain:** A registered domain name
- **SSH Access:** Root or sudo access

### **Domain Setup:**
1. **Point your domain to your VPS IP**
   ```bash
   # Get your VPS IP
   curl ifconfig.me
   ```
2. **Add DNS records:**
   - `A` record: `yourdomain.com` → `YOUR_VPS_IP`
   - `A` record: `www.yourdomain.com` → `YOUR_VPS_IP`

---

## 🛠️ **Quick Deployment (Automated)**

### **Step 1: Connect to Your VPS**
```bash
ssh username@your-vps-ip
```

### **Step 2: Download and Run Deployment Script**
```bash
# Download the deployment script
wget https://raw.githubusercontent.com/meistericham/pcr_project_tracker/main/deploy-vps.sh

# Make it executable
chmod +x deploy-vps.sh

# Run the deployment (replace with your domain and email)
./deploy-vps.sh yourdomain.com admin@yourdomain.com
```

### **Step 3: Wait for Completion**
The script will automatically:
- ✅ Install all required software
- ✅ Configure Docker and Docker Compose
- ✅ Set up SSL certificates
- ✅ Configure firewall and security
- ✅ Start all services
- ✅ Create monitoring and backup scripts

---

## 🔧 **Manual Deployment (Step-by-Step)**

### **Step 1: System Preparation**

#### **Update System**
```bash
sudo apt update && sudo apt upgrade -y
```

#### **Install Required Packages**
```bash
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban \
    nginx \
    certbot \
    python3-certbot-nginx
```

### **Step 2: Install Docker**

#### **Add Docker Repository**
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

#### **Install Docker**
```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

#### **Add User to Docker Group**
```bash
sudo usermod -aG docker $USER
# Log out and back in for changes to take effect
```

### **Step 3: Deploy Application**

#### **Create Application Directory**
```bash
sudo mkdir -p /opt/pcr-tracker
sudo chown $USER:$USER /opt/pcr-tracker
cd /opt/pcr-tracker
```

#### **Clone Repository**
```bash
git clone https://github.com/meistericham/pcr_project_tracker.git .
```

#### **Create Production Environment**
```bash
# Copy the example environment file
cp env.production.example .env.production

# Edit the environment file with your settings
nano .env.production
```

#### **Generate SSL Certificates**
```bash
# Create SSL directory
mkdir -p nginx/ssl

# Generate self-signed certificate (temporary)
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/key.pem \
    -out nginx/ssl/cert.pem \
    -subj "/C=MY/ST=State/L=City/O=Organization/CN=yourdomain.com"
```

### **Step 4: Configure Security**

#### **Setup Firewall**
```bash
sudo ufw --force enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

#### **Configure Fail2ban**
```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### **Step 5: Start Services**

#### **Start Application**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### **Check Status**
```bash
docker-compose -f docker-compose.prod.yml ps
```

### **Step 6: Setup SSL (Let's Encrypt)**

#### **Stop Nginx Temporarily**
```bash
docker-compose -f docker-compose.prod.yml stop nginx
```

#### **Get SSL Certificate**
```bash
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com --email admin@yourdomain.com --agree-tos --non-interactive
```

#### **Copy Certificates**
```bash
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
sudo chown $USER:$USER nginx/ssl/*
```

#### **Start Nginx**
```bash
docker-compose -f docker-compose.prod.yml start nginx
```

---

## 🔍 **Post-Deployment Setup**

### **Step 1: Create Admin User**
```bash
# Access the database
docker-compose -f docker-compose.prod.yml exec postgres psql -U pcr_user -d pcr_tracker_prod

# Create admin user
INSERT INTO users (id, name, email, role, initials, created_at) 
VALUES (
    gen_random_uuid(),
    'Admin User',
    'admin@yourdomain.com',
    'super_admin',
    'AU',
    NOW()
);
```

### **Step 2: Configure Email**
Edit `.env.production` and update email settings:
```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

### **Step 3: Setup Automatic Backups**
```bash
# Add to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/pcr-tracker/backup.sh") | crontab -
```

### **Step 4: Setup SSL Renewal**
```bash
# Add to crontab
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet && docker-compose -f /opt/pcr-tracker/docker-compose.prod.yml restart nginx") | crontab -
```

---

## 📊 **Monitoring & Maintenance**

### **Access URLs**
- **Main Application:** https://yourdomain.com
- **Monitoring Dashboard:** https://yourdomain.com:3001
- **Prometheus Metrics:** https://yourdomain.com:9090

### **Useful Commands**

#### **Check System Status**
```bash
./monitor.sh
```

#### **View Logs**
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f pcr-tracker
```

#### **Create Backup**
```bash
./backup.sh
```

#### **Update Application**
```bash
./update.sh
```

#### **Restart Services**
```bash
docker-compose -f docker-compose.prod.yml restart
```

---

## 🔒 **Security Checklist**

### **✅ Essential Security Measures**
- [ ] **Change default passwords** in `.env.production`
- [ ] **Update email configuration** with real SMTP settings
- [ ] **Configure domain DNS** to point to your VPS
- [ ] **Setup monitoring alerts** for system health
- [ ] **Test backup and restore** procedures
- [ ] **Regular security updates** (`sudo apt update && sudo apt upgrade`)
- [ ] **Monitor logs** for suspicious activity
- [ ] **Setup firewall rules** (already done by script)

### **🔧 Additional Security (Optional)**
- [ ] **Setup VPN** for secure access
- [ ] **Configure intrusion detection** (OSSEC)
- [ ] **Setup log monitoring** (ELK Stack)
- [ ] **Implement rate limiting** (already configured in Nginx)
- [ ] **Setup automated security scanning**

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Application Not Accessible**
```bash
# Check if containers are running
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs pcr-tracker

# Check firewall
sudo ufw status
```

#### **SSL Certificate Issues**
```bash
# Check certificate validity
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check Nginx configuration
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

#### **Database Connection Issues**
```bash
# Check database status
docker-compose -f docker-compose.prod.yml logs postgres

# Test database connection
docker-compose -f docker-compose.prod.yml exec postgres psql -U pcr_user -d pcr_tracker_prod -c "SELECT 1;"
```

#### **Performance Issues**
```bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check Docker resource usage
docker stats
```

---

## 📈 **Performance Optimization**

### **Database Optimization**
```sql
-- Run these queries in PostgreSQL
CREATE INDEX CONCURRENTLY idx_budget_entries_project_id ON budget_entries(project_id);
CREATE INDEX CONCURRENTLY idx_budget_entries_date ON budget_entries(date);
CREATE INDEX CONCURRENTLY idx_projects_status ON projects(status);
```

### **Nginx Optimization**
```nginx
# Add to nginx.conf for better performance
client_body_buffer_size 128k;
client_max_body_size 10m;
client_header_buffer_size 1k;
large_client_header_buffers 4 4k;
output_buffers 1 32k;
postpone_output 1460;
```

### **Docker Optimization**
```bash
# Clean up unused Docker resources
docker system prune -a

# Monitor resource usage
docker stats
```

---

## 🔄 **Updates & Maintenance**

### **Regular Maintenance Tasks**

#### **Weekly**
- [ ] Check system logs for errors
- [ ] Review security updates
- [ ] Monitor disk usage
- [ ] Test backup procedures

#### **Monthly**
- [ ] Update system packages
- [ ] Review and rotate logs
- [ ] Check SSL certificate expiration
- [ ] Review monitoring alerts

#### **Quarterly**
- [ ] Security audit
- [ ] Performance review
- [ ] Backup restoration test
- [ ] Update application dependencies

---

## 📞 **Support & Resources**

### **Useful Commands Reference**
```bash
# System information
uname -a
lsb_release -a

# Docker information
docker version
docker-compose version

# Service status
systemctl status docker
systemctl status fail2ban

# Network information
ip addr show
netstat -tulpn
```

### **Log Locations**
- **Application logs:** `/opt/pcr-tracker/logs/`
- **Nginx logs:** `/opt/pcr-tracker/logs/nginx/`
- **System logs:** `/var/log/`
- **Docker logs:** `docker-compose -f docker-compose.prod.yml logs`

### **Configuration Files**
- **Environment:** `/opt/pcr-tracker/.env.production`
- **Nginx config:** `/opt/pcr-tracker/nginx/nginx.conf`
- **Docker Compose:** `/opt/pcr-tracker/docker-compose.prod.yml`

---

## 🎯 **Success Metrics**

### **Performance Targets**
- **Page Load Time:** < 2 seconds
- **Database Response:** < 100ms
- **Uptime:** > 99.9%
- **SSL Grade:** A+ (Qualys SSL Labs)

### **Monitoring Alerts**
- **CPU Usage:** > 80% for 5 minutes
- **Memory Usage:** > 90% for 5 minutes
- **Disk Usage:** > 85%
- **Database Connections:** > 80% of max
- **SSL Certificate:** Expires in < 30 days

---

## 🎉 **Congratulations!**

Your PCR Project Tracker is now successfully deployed on your VPS server! 

### **Next Steps:**
1. **Test all features** thoroughly
2. **Configure your team** with proper access
3. **Setup monitoring alerts** for critical issues
4. **Document your setup** for future reference
5. **Plan regular maintenance** schedule

### **Access Your Application:**
- **URL:** https://yourdomain.com
- **Admin Email:** admin@yourdomain.com
- **Default Password:** admin123 (change immediately!)

**Remember to keep your system updated and monitor it regularly for optimal performance and security! 🚀**
