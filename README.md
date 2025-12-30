# E-commerce Platform - Taphoanhadev

Full-stack e-commerce platform built with Next.js 14, Express.js, PostgreSQL 15, and Docker.

**🌐 Live**: https://taphoanhadev.com | **🖥️ VPS**: 103.199.17.168 | **📞 Support**: 0342 429 911

---

## 📑 Table of Contents

- [Initial VPS Setup (Start Here)](#-initial-vps-setup-start-here)
- [Install Required Software](#-install-required-software)
- [Clone & Configure Application](#-clone--configure-application)
- [SSL Certificate Setup](#-ssl-certificate-setup)
- [Configure Nginx](#-configure-nginx)
- [Deploy Application](#-deploy-application)
- [Database Setup](#-database-setup)
- [Verify Deployment](#-verify-deployment)
- [Deployment Updates](#-deployment-updates)
- [Local Development](#-local-development)
- [Environment Configuration](#-environment-configuration)
- [Database Management](#-database-management)
- [Docker Commands](#-docker-commands)
- [Monitoring & Maintenance](#-monitoring--maintenance)
- [Troubleshooting](#-troubleshooting)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Security Checklist](#-security-checklist)

---

## 🚀 Initial VPS Setup (Start Here)

### Prerequisites

- Fresh Ubuntu 20.04 LTS server
- Root SSH access
- Domain pointing to your VPS IP (103.199.17.168)

### Step 1: Connect to VPS via SSH

```bash
# Connect as root
ssh root@103.199.17.168

# If you get "WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED"
# Remove old host key first on your local machine:
ssh-keygen -R 103.199.17.168
# Then reconnect
ssh root@103.199.17.168
```

### Step 2: Update System

```bash
# Update package list and upgrade all packages
apt update && apt upgrade -y

# Install basic utilities
apt install -y curl wget git vim nano htop net-tools
```

### Step 3: Create Deployment User

```bash
# Create new user 'deploy'
adduser deploy
# Enter password when prompted (use a strong password)

# Add deploy to sudo group
usermod -aG sudo deploy

# Switch to deploy user
su - deploy
```

### Step 4: Configure SSH Key (Optional but Recommended)

```bash
# On your local machine, generate SSH key if you don't have one
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Copy public key to VPS (from your local machine)
ssh-copy-id deploy@103.199.17.168

# Test SSH key login
ssh deploy@103.199.17.168
```

### Step 5: Configure Firewall

```bash
# Allow SSH (important - do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## 📦 Install Required Software

### Step 1: Install Docker

```bash
# Download and install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add current user to docker group
sudo usermod -aG docker $USER

# Start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Verify installation
docker --version
```

### Step 2: Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Step 3: Install Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Check status
sudo systemctl status nginx
```

### Step 4: Install Certbot for SSL

```bash
# Install Certbot and Nginx plugin
sudo apt install certbot python3-certbot-nginx -y

# Verify installation
certbot --version
```

### Step 5: Logout and Login

```bash
# Logout to apply docker group changes
exit

# Login again as deploy user
ssh deploy@103.199.17.168

# Verify docker works without sudo
docker ps
```

---

## 📂 Clone & Configure Application

### Step 1: Create Application Directory

```bash
# Create directory
sudo mkdir -p /var/www/taphoanhadev

# Set ownership to deploy user
sudo chown -R deploy:deploy /var/www/taphoanhadev

# Navigate to directory
cd /var/www/taphoanhadev
```

### Step 2: Clone Repository

```bash
# Clone from GitHub
git clone https://github.com/loihd98/ecommerce_site.git .

# Verify files
ls -la
```

### Step 3: Create Environment File

```bash
# Copy example environment file
cp .env.example .env

# Edit environment variables
nano .env
```

### Step 4: Configure Environment Variables

Update the following in `.env`:

```bash
# Database
DB_USER=postgres
DB_PASSWORD=YourStrongPassword123!
DB_NAME=ecommerce_db
DATABASE_URL=postgresql://postgres:YourStrongPassword123!@postgres:5432/ecommerce_db

# JWT Secrets (generate unique values with: openssl rand -base64 32)
JWT_SECRET=your_generated_secret_here
JWT_REFRESH_SECRET=your_generated_refresh_secret_here

# Server
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://taphoanhadev.com,https://www.taphoanhadev.com

# URLs
NEXT_PUBLIC_API_URL=https://taphoanhadev.com/api
NEXT_PUBLIC_MEDIA_URL=https://taphoanhadev.com
NEXT_PUBLIC_FRONTEND_URL=https://taphoanhadev.com

# Email (Gmail App Password - get from Google Account settings)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hideonstorms@gmail.com
SMTP_PASSWORD=your_gmail_app_password
```

Save with `Ctrl+X`, then `Y`, then `Enter`.

**Generate JWT secrets:**

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate JWT_REFRESH_SECRET
openssl rand -base64 32

# Copy each output and paste into .env file
```

### Step 5: Create Uploads Directory

```bash
# Create directories for media storage
mkdir -p uploads/images
mkdir -p uploads/videos

# Set proper permissions
chmod -R 755 uploads/
```

---

## 🔒 SSL Certificate Setup

### Step 1: Configure DNS

Before obtaining SSL certificate, ensure your domain DNS is configured:

**DNS A Records:**

```
A    taphoanhadev.com      → 103.199.17.168
A    www.taphoanhadev.com  → 103.199.17.168
```

**Verify DNS propagation:**

```bash
# Check if domain resolves to your VPS
nslookup taphoanhadev.com
ping taphoanhadev.com -c 4
```

### Step 2: Stop Nginx Temporarily

```bash
sudo systemctl stop nginx
```

### Step 3: Obtain SSL Certificate

```bash
sudo certbot certonly --standalone \
  -d taphoanhadev.com \
  -d www.taphoanhadev.com \
  --email hideonstorms@gmail.com \
  --agree-tos \
  --no-eff-email
```

**Expected output:**

```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/taphoanhadev.com/fullchain.pem
Key is saved at: /etc/letsencrypt/live/taphoanhadev.com/privkey.pem
```

### Step 4: Verify Certificate Files

```bash
sudo ls -la /etc/letsencrypt/live/taphoanhadev.com/

# Should see:
# fullchain.pem - Full certificate chain
# privkey.pem   - Private key
# cert.pem      - Certificate only
# chain.pem     - Certificate chain
```

### Step 5: Set Up Auto-Renewal

```bash
# Enable certbot renewal timer
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Check timer status
sudo systemctl status certbot.timer

# Test renewal (dry run)
sudo certbot renew --dry-run
```

---

## ⚙️ Configure Nginx

### Step 1: Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/taphoanhadev.com
```

### Step 2: Add Configuration

Paste this complete configuration:

```nginx
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
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /chat {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    # Static files
    location /uploads {
        alias /var/www/taphoanhadev/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Save with `Ctrl+X`, `Y`, `Enter`.

### Step 3: Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/taphoanhadev.com /etc/nginx/sites-enabled/
```

### Step 4: Remove Default Site

```bash
sudo rm /etc/nginx/sites-enabled/default
```

### Step 5: Test Configuration

```bash
sudo nginx -t

# Expected output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Step 6: Start Nginx

```bash
sudo systemctl start nginx
sudo systemctl status nginx
```

---

## 🚢 Deploy Application

### Step 1: Navigate to Project

```bash
cd /var/www/taphoanhadev
```

### Step 2: Build Docker Images

```bash
docker-compose build --no-cache
```

⏱️ This will take 5-10 minutes on first build.

### Step 3: Start All Services

```bash
docker-compose up -d
```

### Step 4: Wait for Services

```bash
# Wait 30 seconds for services to initialize
sleep 30

# Check all containers are running
docker-compose ps
```

**Expected output:**

```
NAME                      STATUS
taphoanhadev-backend      Up
taphoanhadev-frontend     Up
taphoanhadev-postgres     Up
```

---

## 💾 Database Setup

### Step 1: Run Migrations

```bash
docker-compose exec backend npx prisma migrate deploy
```

### Step 2: Seed Database (Create Admin)

```bash
docker-compose exec backend npx prisma db seed
```

**Admin credentials created:**

- Email: `admin@taphoanhadev.com`
- Password: `admin123456`

> ⚠️ **IMPORTANT**: Change this password immediately after first login!

### Step 3: Verify Database

```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d ecommerce_db

# List tables
\dt

# Check admin user exists
SELECT email, role FROM users WHERE role = 'ADMIN';

# Exit
\q
```

---

## ✅ Verify Deployment

### Step 1: Check Services

```bash
# Check all containers
docker-compose ps

# All should show "Up" status
```

### Step 2: Check Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
```

### Step 3: Test Frontend

```bash
curl -I https://taphoanhadev.com

# Should see: HTTP/2 200
```

### Step 4: Test Backend API

```bash
curl https://taphoanhadev.com/api/health

# Or check products endpoint
curl https://taphoanhadev.com/api/products
```

### Step 5: Access Website

Open browser and visit:

- **Frontend**: https://taphoanhadev.com
- **Admin Login**: https://taphoanhadev.com/login

**Login with:**

- Email: `admin@taphoanhadev.com`
- Password: `admin123456`

**⚠️ Immediately change the password after first login!**

---

## 🔄 Deployment Updates

When updating your production application with new code:

### Full Update (With Database Changes)

```bash
# Step 1: Navigate to project
cd /var/www/taphoanhadev

# Step 2: Pull latest code
git pull origin master

# Step 3: Stop running containers
docker-compose down

# Step 4: Rebuild images
docker-compose build --no-cache

# Step 5: Start services
docker-compose up -d

# Step 6: Wait for services
sleep 30

# Step 7: Run migrations (if schema changed)
docker-compose exec backend npx prisma migrate deploy

# Step 8: Verify deployment
docker-compose ps
curl -I https://taphoanhadev.com
```

### Quick Update (No Database Changes)

For small code changes without schema modifications:

```bash
cd /var/www/taphoanhadev
git pull origin master
docker-compose restart backend
docker-compose restart frontend
```

### Hot Reload (Zero Downtime)

For zero-downtime deployment:

```bash
# Update backend only
docker-compose up -d --no-deps --build backend

# Or frontend only
docker-compose up -d --no-deps --build frontend
```

---

## 💻 Local Development

For local development on your machine:

### Prerequisites

- Docker & Docker Compose installed
- Git

### Quick Start

```bash
# Clone repository
git clone https://github.com/loihd98/ecommerce_site.git
cd ecommerce_site

# Copy environment file
cp .env.example .env.dev

# Edit .env.dev with local settings
nano .env.dev

# Start all services
docker-compose -f docker-compose.dev.yml up --build -d

# Access services:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
# Database: localhost:5432
```

### Development Commands

```bash
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

### Default Local Login

- Email: `admin@example.com`
- Password: `admin123456`

---

## ⚙️ Environment Configuration

### Production Environment (.env)

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

### Development Environment (.env.dev)

```bash
# Database
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce_db
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/ecommerce_db

# JWT Secrets
JWT_SECRET=dev_secret_key
JWT_REFRESH_SECRET=dev_refresh_secret_key

# Server
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000

# URLs
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_MEDIA_URL=http://localhost:5000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
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

### Production

```bash
# Start all services
docker-compose up -d

# Start with rebuild
docker-compose up --build -d

# Stop all services
docker-compose down

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Restart service
docker-compose restart backend

# Check status
docker-compose ps

# View resource usage
docker stats
```

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

# Execute commands
docker-compose -f docker-compose.dev.yml exec backend sh
docker-compose -f docker-compose.dev.yml exec frontend sh
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

Enable in Nginx config:

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
curl https://taphoanhadev.com/uploads/images/test.jpg
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

# Disable root SSH login (after setting up deploy user with SSH key)
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
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
