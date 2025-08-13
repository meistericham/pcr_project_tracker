# PCR Project Tracker - Docker Deployment Guide

## 🐳 Quick Start

### Prerequisites
- Docker Desktop installed
- Docker Compose installed
- At least 4GB RAM available

### 1. Development Environment (Recommended for local development)

```bash
# Clone the repository
git clone <your-repo-url>
cd pcr_project_tracker

# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Access the application
# Frontend: http://localhost:3000
# Mail UI: http://localhost:8025
# Database: localhost:5432
```

### 2. Production Environment (VPS)

```bash
# Copy env and adjust values
cp env.production.example .env.production
nano .env.production

# Start all services (reverse proxy + app + db + redis + monitoring)
docker-compose -f docker-compose.prod.yml up -d --build

# Check health
docker-compose -f docker-compose.prod.yml ps

# Access the application (after DNS/SSL configured)
# https://yourdomain.com
```

## 📁 File Structure

```
pcr_project_tracker/
├── Dockerfile                 # Production build
├── Dockerfile.dev            # Development build
├── docker-compose.yml        # Production services
├── docker-compose.dev.yml    # Development services
├── nginx.conf               # Nginx configuration
├── database/
│   └── init.sql             # Database schema & sample data
├── .dockerignore            # Docker ignore file
└── README_DOCKER.md         # This file
```

## 🔧 Services Overview

### Development Environment
- **pcr-tracker-dev**: React app with hot reloading
- **supabase-db**: PostgreSQL database
- **mail**: MailHog for email testing

### Production Environment
- **pcr-tracker**: Production React app (Nginx in container)
- **postgres**: PostgreSQL database
- **redis**: Caching and sessions
- **nginx**: Reverse proxy + TLS termination
- **prometheus**: Metrics collection
- **grafana**: Monitoring dashboard

## 🚀 Usage Commands

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down

# Rebuild and restart
docker-compose -f docker-compose.dev.yml up -d --build
```

### Production
```bash
# Start all services
docker-compose up -d

# Start with specific services
docker-compose up -d pcr-tracker supabase-db

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build
```

## 🔐 Default Login Credentials

| Email | Password | Role |
|-------|----------|------|
| `hisyamudin@sarawaktourism.com` | `11223344` | Super Admin |
| `john@company.com` | `demo123` | Super Admin |
| `sarah@company.com` | `demo123` | Admin |
| `mike@company.com` | `demo123` | User |

## 🌐 Access Points

### Development
- **Application**: http://localhost:3000
- **Mail UI**: http://localhost:8025
- **Database**: localhost:5432 (postgres/postgres)

### Production
- **Application**: http://localhost:3000
- **API**: http://localhost:3001
- **Auth**: http://localhost:9999
- **Realtime**: http://localhost:4000
- **Functions**: http://localhost:9000
- **Mail UI**: http://localhost:8025
- **Redis**: localhost:6379

## 🔧 Configuration

### Environment Variables

Create a `.env.production` file in the root directory (see `env.production.example` for all options):

```bash
cp env.production.example .env.production
nano .env.production
```

### Customizing Ports

Edit `docker-compose.yml` to change ports:

```yaml
services:
  pcr-tracker:
    ports:
      - "8080:80"  # Change 3000 to 8080
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Kill the process or change the port
   ```

2. **Database connection issues**
   ```bash
   # Check database logs
   docker-compose logs supabase-db
   
   # Restart database
   docker-compose restart supabase-db
   ```

3. **Build failures**
   ```bash
   # Clean build
   docker-compose down
   docker system prune -f
   docker-compose up -d --build
   ```

4. **Permission issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Health Checks

```bash
# Check service health
docker-compose ps

# Check specific service
docker-compose exec pcr-tracker curl -f http://localhost/health
```

## 📊 Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f pcr-tracker

# Last 100 lines
docker-compose logs --tail=100 pcr-tracker
```

### Resource Usage
```bash
# Container stats
docker stats

# Disk usage
docker system df
```

## 🔄 Updates and Maintenance

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Backup Database
```bash
# Create backup
docker-compose exec supabase-db pg_dump -U postgres pcr_tracker > backup.sql

# Restore backup
docker-compose exec -T supabase-db psql -U postgres pcr_tracker < backup.sql
```

### Clean Up
```bash
# Remove unused containers, networks, images
docker system prune -f

# Remove all stopped containers and unused images
docker system prune -a

# Remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

## 🚀 Deployment to Production

### 1. Prepare Production Environment
```bash
# Set production environment variables
export NODE_ENV=production
export SUPABASE_URL=https://your-domain.com
export SUPABASE_ANON_KEY=your-production-anon-key
```

### 2. Deploy with Nginx Proxy
```bash
# Start with production profile
docker-compose --profile production up -d
```

### 3. SSL Configuration
Add SSL certificates to `./ssl/` directory and update `nginx-proxy.conf`.

## 📝 Development Workflow

1. **Start development environment**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Make changes to code**
   - Changes are automatically reflected due to volume mounting

3. **Test changes**
   - Access http://localhost:3000
   - Check mail at http://localhost:8025

4. **Build for production**
   ```bash
   docker-compose up -d --build
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## 📞 Support

For issues related to Docker deployment:
1. Check the troubleshooting section
2. Review Docker logs
3. Create an issue with detailed error information
