# 🚀 Quick Start Guide

## Development Setup (5 minutes)

### Prerequisites

- Node.js 18+ installed
- Docker Desktop installed and running
- Git installed

### Step 1: Clone and Setup

```bash
# Clone repository
git clone <repository-url>
cd web_ban_hang

# Copy backend environment file
cd backend
cp .env.example .env
# Edit .env with your database credentials
cd ..
```

### Step 2: Start Database

```bash
# Start PostgreSQL in Docker
docker compose -f docker-compose.dev.yml up -d

# Verify it's running
docker compose -f docker-compose.dev.yml ps
```

### Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed initial data (creates admin and test user)
npm run db:seed

# Start backend server
npm run dev
```

Backend will run at: http://localhost:5000

### Step 4: Setup Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at: http://localhost:3000

### Default Login Credentials

**Admin Account:**

- Email: admin@example.com
- Password: admin123

**Test User:**

- Email: user@example.com
- Password: user123

---

## Production Deployment (Docker)

### Prerequisites

- Ubuntu VPS (2GB+ RAM recommended)
- Domain name pointed to your VPS
- SSH access

### Step 1: Server Setup

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose plugin
sudo apt install -y docker-compose-plugin

# Setup firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Step 2: Clone and Configure

```bash
# Clone repository
cd /opt
sudo git clone <repository-url> ecommerce
cd ecommerce

# Setup environment
cp .env.example .env
nano .env
```

**Required environment variables:**

```env
# Strong passwords (min 16 characters)
DB_PASSWORD=your_secure_password

# JWT secrets (min 32 characters)
JWT_SECRET=generate_random_string_32_chars
JWT_REFRESH_SECRET=generate_random_string_32_chars

# Your domain
CORS_ORIGIN=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_MEDIA_URL=https://yourdomain.com

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Stripe keys
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

### Step 3: Update Nginx Config

```bash
# Update domain in nginx config
nano nginx/default.conf

# Replace 'yourdomain.com' with your actual domain
# Save: Ctrl+X, Y, Enter
```

### Step 4: Initial Start (HTTP Only)

```bash
# First start with HTTP config
cp nginx/temp-http.conf nginx/default.conf

# Build and start
docker compose up -d --build

# Check status
docker compose ps
docker compose logs -f
```

### Step 5: Setup SSL Certificate

```bash
# Generate SSL certificate
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d yourdomain.com \
  -d www.yourdomain.com

# Switch to HTTPS config
# (restore the original default.conf with SSL settings)
# Update domain names in the file
nano nginx/default.conf

# Restart nginx
docker compose restart nginx
```

### Step 6: Initialize Database

```bash
# Run migrations
docker compose exec backend npx prisma migrate deploy

# Seed initial data
docker compose exec backend npm run db:seed
```

### Step 7: Verify Deployment

Visit your domain:

- https://yourdomain.com (should show your site)
- https://yourdomain.com/api/health (should return: {"status":"ok"})

---

## Useful Commands

### Docker Commands

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx

# Restart a service
docker compose restart backend

# Stop all services
docker compose down

# Stop and remove volumes (careful!)
docker compose down -v

# Rebuild and restart
docker compose up -d --build

# Check service status
docker compose ps
```

### Database Commands

```bash
# Access Prisma Studio
docker compose exec backend npx prisma studio
# Visit: http://localhost:5555

# Run migrations
docker compose exec backend npx prisma migrate deploy

# Seed data
docker compose exec backend npm run db:seed

# Access PostgreSQL directly
docker compose exec postgres psql -U postgres -d ecommerce_db
```

### Maintenance Commands

```bash
# Update application
git pull
docker compose up -d --build

# View disk usage
docker system df

# Clean up unused resources
docker system prune -a

# Backup database
docker compose exec postgres pg_dump -U postgres ecommerce_db > backup_$(date +%Y%m%d).sql

# Restore database
docker compose exec -T postgres psql -U postgres ecommerce_db < backup.sql
```

---

## Troubleshooting

### Backend won't start

```bash
# Check logs
docker compose logs backend

# Common issues:
# 1. Database not ready - wait a few seconds and check again
# 2. Environment variables missing - verify .env file
# 3. Port conflict - ensure port 5000 is available
```

### Frontend build fails

```bash
# Check logs
docker compose logs frontend

# Common issues:
# 1. Environment variables not set during build
# 2. Rebuild with: docker compose up -d --build frontend
```

### Database connection issues

```bash
# Check if database is running
docker compose ps postgres

# Check database logs
docker compose logs postgres

# Test connection
docker compose exec backend npx prisma db push
```

### SSL certificate issues

```bash
# Check certbot logs
docker compose logs certbot

# Manually renew certificate
docker compose run --rm certbot renew

# Verify certificate
docker compose exec nginx ls -la /etc/letsencrypt/live/
```

---

## Need Help?

- Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide
- Check [DEVELOPMENT.md](DEVELOPMENT.md) for development guide
- Check [API.md](API.md) for API documentation
- Review logs: `docker compose logs -f`
