# E-commerce Platform - Taphoanhadev

Full-stack e-commerce platform built with Next.js 14, Express.js, PostgreSQL 15, and Docker.

**🌐 Live**: https://taphoanhadev.com | **🖥️ VPS**: 103.199.17.168 | **📞 Support**: 0342 429 911

---

## 📑 Table of Contents

- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Local Development](#-local-development)
- [Production VPS Setup](#-production-vps-setup-ubuntu-2004)
- [SSL Certificate Setup](#-ssl-certificate-setup)
- [Database Management](#-database-management)
- [Docker Commands](#-docker-commands)
- [Environment Configuration](#-environment-configuration)
- [Deployment](#-deployment)
- [Monitoring & Maintenance](#-monitoring--maintenance)
- [Troubleshooting](#-troubleshooting)
- [Security Checklist](#-security-checklist)

---

## 🚀 Quick Start

### Development (Local)

```bash
# Clone and setup
git clone <repository-url>
cd web_ban_hang

# Copy environment file
cp .env.example .env.dev

# Start all services
docker-compose -f docker-compose.dev.yml up --build -d

# Access services:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
# Database: localhost:5432
```

### Production Deployment

```bash
# On VPS (103.199.17.168)
cd /var/www/taphoanhadev

# Pull latest code
git pull origin master

# Deploy
docker-compose up --build -d
```

### Default Login

**Admin Account:**

- Email: `admin@example.com` (dev) or `admin@taphoanhadev.com` (prod)
- Password: `admin123456`

> ⚠️ **Important**: Change admin password immediately after first login!

---

## 🛠 Tech Stack

**Frontend:**

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Redux Toolkit + Redux Persist

**Backend:**

- Express.js (ES Modules)
- Prisma ORM
- PostgreSQL 15
- JWT Authentication
- WebSocket (Chat)

**Infrastructure:**

- Docker & Docker Compose
- Nginx (Reverse Proxy)
- Let's Encrypt SSL
- Ubuntu 20.04 LTS

**Integrations:**

- Stripe Payment (optional)
- OAuth (Google, Facebook)
- SMTP Email

---

## 📁 Project Structure

```
web_ban_hang/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth, validation
│   │   ├── routes/          # API routes
│   │   ├── config/          # Configuration
│   │   └── utils/           # Helpers
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── migrations/      # DB migrations
│   │   └── seed.js          # Admin seeding
│   └── Dockerfile

├── frontend/                # Next.js app
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── store/           # Redux store
│   │   ├── lib/             # Utilities
│   │   └── types/           # TypeScript types
│   └── Dockerfile

├── nginx/                   # Nginx configs
│   ├── nginx.conf
│   └── default.conf

├── uploads/                 # Media storage
│   ├── images/
│   └── videos/

├── docker-compose.dev.yml   # Development
├── docker-compose.yml       # Production
└── README.md               # This file
```

---

## 🏠 Local Development

### Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (optional)
- Git

### Setup Commands

```bash
# Start development
docker-compose -f docker-compose.dev.yml up --build -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down

# Restart specific service
docker-compose -f docker-compose.dev.yml restart backend
docker-compose -f docker-compose.dev.yml restart frontend

# Execute commands in container
docker-compose -f docker-compose.dev.yml exec backend sh
docker-compose -f docker-compose.dev.yml exec frontend sh

# Clear everything and rebuild
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build -d
```

---

## 🚀 Production VPS Setup (Ubuntu 20.04)

### 1. Initial VPS Configuration

```bash
# Connect to VPS
ssh root@103.199.17.168

# Update system
apt update && apt upgrade -y

# Create deployment user
adduser deploy
usermod -aG sudo deploy
su - deploy
```

### 2. Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Logout and login again for group changes
exit
su - deploy
```

### 3. Install Nginx & Certbot

```bash
# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

### 4. Clone & Configure Application

```bash
# Create application directory
sudo mkdir -p /var/www/taphoanhadev
sudo chown deploy:deploy /var/www/taphoanhadev
cd /var/www/taphoanhadev

# Clone repository (replace with your repo URL)
git clone https://github.com/loihd98/ecommerce_site.git .

# Create production environment file
cp .env.example .env

# Edit environment variables
nano .env
```

**Important**: Configure these variables in `.env`:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `JWT_REFRESH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXT_PUBLIC_API_URL` - https://taphoanhadev.com/api
- `NEXT_PUBLIC_MEDIA_URL` - https://taphoanhadev.com
- `SMTP_USER` and `SMTP_PASSWORD` - Email credentials

### 5. Create Uploads Directory

```bash
sudo mkdir -p /var/www/taphoanhadev/uploads/images
sudo mkdir -p /var/www/taphoanhadev/uploads/videos
sudo chown -R deploy:deploy /var/www/taphoanhadev/uploads
sudo chmod -R 755 /var/www/taphoanhadev/uploads
```

---

## 🔒 SSL Certificate Setup

### 1. Configure Domain DNS

Point your domain to VPS:
**Step 1: Stop Nginx temporarily**

```bash
sudo systemctl stop nginx
```

**Step 2: Obtain certificate**

```bash
sudo certbot certonly --standalone \
  -d taphoanhadev.com \
  -d www.taphoanhadev.com \
  --email hideonstorms@gmail.com \
  --agree-tos \
  --no-eff-email
```

**Step 3: Verify certificate files**

```bash
# Check certificate location
sudo ls -la /etc/letsencrypt/live/taphoanhadev.com/

# Should see:
# fullchain.pem
# privkey.pem
# cert.pem
# chain.pem
```

**Step 1: Create Nginx configuration**

```bash
sudo nano /etc/nginx/sites-available/taphoanhadev.com
```

**Step 2: Add this configuration:**
**Step 4: Set up auto-renewal**

```bash
# Enable certbot timer
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Check timer status
sudo systemctl status certbot.timer
```

**Step 5: Test renewal (dry run)**

```bashfiles location:
# /etc/letsencrypt/live/taphoanhadev.com/fullchain.pem
# /etc/letsencrypt/live/taphoanhadev.com/privkey.pem

# Set up auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

### 3. Configure Nginx for SSL

Create `/etc/nginx/sites-available/taphoanhadev.com`:

````nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name taphoanhadev.com www.taphoanhadev.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name taphoanhadev.com www.taphoanhadev.com;

    ssl_certificate /etc/letsencrypt/live/taphoanhadev.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/taphoanhadev.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    client_max_body_size 100M;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
**Step 3: Enable the site**

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/taphoanhadev.com /etc/nginx/sites-enabled/
````

**Step 4: Remove default configuration**

```bash
sudo rm /etc/nginx/sites-enabled/default
```

**Step 5: Test Nginx configuration**

```bash
sudo nginx -t

# Should output:
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**Step 6: Restart Nginx**

```bash
sudo systemctl restart nginx
```

**Step 7: Verify SSL is working**

```bash
# Check HTTPS
curl -I https://taphoanhadev.com

# Should see: HTTP/2 200

    # Static files
    location /uploads {
        alias /var/www/taphoanhadev/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:

```bash
# Link configuration
sudo ln -s /etc/nginx/sites-available/taphoanhadev.com /etc/nginx/sites-enabled/

# Remove default
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📊 Database Management

### Backup Database

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres ecommerce_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated daily backup (crontab)
crontab -e

# Add this line for 2 AM daily backup:
0 2 * * * cd /var/www/taphoanhadev && docker-compose exec postgres pg_dump -U postgres ecommerce_db > /var/www/backups/db_$(date +\%Y\%m\%d).sql
```

### Restore Database

```bash
# Restore from backup
docker-compose exec -T postgres psql -U postgres ecommerce_db < backup_20241230.sql
```

### Database Operations

```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d ecommerce_db

# Common SQL commands:
\dt              # List tables
\d+ users        # Describe users table
SELECT * FROM users WHERE role = 'ADMIN';
\q               # Quit

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database (creates admin only)
docker-compose exec backend npx prisma db seed

# Open Prisma Studio (GUI)
docker-compose exec backend npx prisma studio
```

---

## 🐳 Docker Commands

### Development

```bash
# Start
docker-compose -f docker-compose.dev.yml up -d

# Start with rebuild
docker-compose -f docker-compose.dev.yml up --build -d

# Stop
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes
docker-compose -f docker-compose.dev.yml down -v

# View logs (all services)
docker-compose -f docker-compose.dev.yml logs -f

# View logs (specific service)
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f postgres

# Restart service
docker-compose -f docker-compose.dev.yml restart backend

# Execute commands
docker-compose -f docker-compose.dev.yml exec backend sh
docker-compose -f docker-compose.dev.yml exec frontend sh

# Check status
docker-compose -f docker-compose.dev.yml ps
```

### Production

```bash
# Start
docker-compose up -d

# Start with rebuild
docker-compose up --build -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Restart service
docker-compose restart backend

# Check status
docker-compose ps

# View resource usage
docker stats
```

---

## ⚙️ Environment Configuration

### Backend (.env)

```bash
# Database
DB_USER=postgres
DB_PASSWORD=<STRONG_PASSWORD>
DB_NAME=ecommerce_db
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}

# JWT Secrets (generate: openssl rand -base64 32)
JWT_SECRET=<RANDOM_32_CHAR_STRING>
JWT_REFRESH_SECRET=<RANDOM_32_CHAR_STRING>

# Server
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://taphoanhadev.com,https://www.taphoanhadev.com

# URLs
NEXT_PUBLIC_API_URL=https://taphoanhadev.com/api
NEXT_PUBLIC_MEDIA_URL=https://taphoanhadev.com
NEXT_PUBLIC_FRONTEND_URL=https://taphoanhadev.com

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hideonstorms@gmail.com
SMTP_PASSWORD=<APP_PASSWORD>

# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

# Payment (optional)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=https://taphoanhadev.com/api
NEXT_PUBLIC_MEDIA_URL=https://taphoanhadev.com
NEXT_PUBLIC_WS_URL=wss://taphoanhadev.com/chat
NEXT_PUBLIC_FRONTEND_URL=https://taphoanhadev.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## 🚢 Deployment

### Step-by-Step Production Deployment

**Step 1: Navigate to project directory**

```bash
cd /var/www/taphoanhadev
```

**Step 2: Pull latest code**

```bash
git pull origin master
```

**Step 3: Stop running containers**

```bash
docker-compose down
```

**Step 4: Rebuild images**

```bash
docker-compose build --no-cache
```

**Step 5: Start all services**

```bash
docker-compose up -d
```

**Step 6: Wait for services to be ready**

```bash
# Wait 30 seconds for database and services to initialize
sleep 30
```

**Step 7: Run database migrations**

```bash
docker-compose exec backend npx prisma migrate deploy
```

**Step 8: (Optional) Seed database**

```bash
# Only if needed - creates admin account
docker-compose exec backend npx prisma db seed
```

**Step 9: Verify deployment**

```bash
# Check all containers are running
docker-compose ps

# Check frontend
curl -I https://taphoanhadev.com

# Check backend API
curl https://taphoanhadev.com/api/health
```

**Step 10: Monitor logs**

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Quick Update (Minor Changes)

For small updates without schema changes:

```bash
cd /var/www/taphoanhadev
git pull origin master
docker-compose restart backend
docker-compose restart frontend
```

### Hot Reload (No Downtime)

For zero-downtime deployment:

```bash
# Rebuild specific service
docker-compose up -d --no-deps --build backend

# Or frontend only
docker-compose up -d --no-deps --build frontend
```

---

## 📊 Monitoring & Maintenance

### Check Service Status

```bash
# Docker containers
docker ps -a

# Nginx status
sudo systemctl status nginx

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### System Monitoring

```bash
# Container resource usage
docker stats

# Disk usage
df -h
du -sh /var/www/taphoanhadev/*

# System resources
htop

# Check open ports
sudo netstat -tulpn
```

### Maintenance Mode

Create `/var/www/taphoanhadev/maintenance.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Maintenance - Taphoanhadev</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 50px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
      }
      h1 {
        font-size: 48px;
        margin-bottom: 20px;
      }
      p {
        font-size: 20px;
      }
    </style>
  </head>
  <body>
    <h1>🔧 Đang Bảo Trì</h1>
    <p>Chúng tôi đang cập nhật hệ thống. Vui lòng quay lại sau!</p>
    <p>We'll be back shortly!</p>
  </body>
</html>
```

Enable in Nginx:

```nginx
location / {
    return 503;
}

error_page 503 @maintenance;
location @maintenance {
    root /var/www/taphoanhadev;
    rewrite ^(.*)$ /maintenance.html break;
}
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process
sudo lsof -i :80
sudo lsof -i :443
sudo lsof -i :3000
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

### Database Connection Failed

```bash
# Check if postgres is running
docker-compose ps postgres

# View postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres

# Check database connection
docker-compose exec postgres psql -U postgres -d ecommerce_db
```

### Images Not Loading

```bash
# Check uploads directory
ls -la uploads/

# Fix permissions
sudo chown -R deploy:deploy uploads/
sudo chmod -R 755 uploads/

# Verify nginx is serving static files
curl http://localhost/uploads/images/test.jpg
```

### SSL Certificate Issues

```bash
# Check certificate expiry
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Force renewal
sudo certbot renew --force-renewal

# Restart nginx
sudo systemctl restart nginx
```

### Frontend Build Issues

```bash
# Clear Next.js cache
docker-compose exec frontend rm -rf .next

# Rebuild frontend
docker-compose up -d --build frontend
```

### Backend Not Starting

```bash
# Check logs
docker-compose logs backend

# Check if migrations ran
docker-compose exec backend npx prisma migrate status

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Restart backend
docker-compose restart backend
```

### Clear Everything & Restart

```bash
# Nuclear option - removes all data
docker-compose down -v
docker system prune -a -f
docker-compose up --build -d
```

---

## 🔒 Security Checklist

- [x] Strong JWT secrets (32+ characters)
- [x] HTTPS/SSL enabled in production
- [x] CORS configured for specific origins
- [x] Environment variables for sensitive data
- [x] Rate limiting on API endpoints
- [x] Input validation and sanitization
- [x] Security headers configured in Nginx
- [ ] Change default admin password
- [ ] Set up regular database backups
- [ ] Configure firewall rules (UFW)
- [ ] Enable fail2ban for SSH protection
- [ ] Regular security updates
- [ ] Monitor access logs

### Additional Security Steps

```bash
# Enable fail2ban for SSH
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Generate strong JWT secrets
openssl rand -base64 32

# Set up automated backups
crontab -e
# Add: 0 2 * * * /var/www/taphoanhadev/backup.sh
```

---

## 🌟 Features

- ✅ User authentication (JWT + OAuth)
- ✅ Product management (CRUD, categories, variants)
- ✅ Shopping cart with persistence
- ✅ Checkout & order tracking
- ✅ Payment integration (Stripe)
- ✅ Reviews & ratings
- ✅ Comments system with approval
- ✅ Wishlist
- ✅ Admin dashboard
- ✅ Media management with optimization
- ✅ Real-time chat (WebSocket)
- ✅ Responsive design
- ✅ SEO optimized (meta tags, sitemap, robots.txt)
- ✅ Social integration (Messenger, Zalo, TikTok)

---

## 📞 Support & Contact

- **Website**: https://taphoanhadev.com
- **Email**: hideonstorms@gmail.com
- **Phone**: 0342 429 911
- **TikTok**: @taphoanhadev
- **Facebook**: [Taphoanhadev](https://www.facebook.com/share/1D1MmND8K5)
- **Zalo**: 0342429911

---

## 📝 License

This project is proprietary and confidential.

---

**Version**: 2.0.0  
**Last Updated**: December 30, 2024  
**Maintained by**: Taphoanhadev Team
