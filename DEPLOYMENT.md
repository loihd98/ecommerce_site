# 🚀 VPS Deployment Guide

Complete guide for deploying the e-commerce platform to a VPS with Ubuntu 24.04.

## Prerequisites

- Ubuntu 24.04 VPS with at least 2GB RAM
- Domain name pointed to your VPS IP
- SSH access to your VPS
- Basic terminal knowledge

## Quick Deployment

### Option 1: Automated Script (Recommended)

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Download and run deployment script
curl -fsSL https://raw.githubusercontent.com/yourusername/ecommerce/main/deploy.sh | bash
```

### Option 2: Manual Deployment

Follow the steps below for manual deployment.

---

## Step-by-Step Deployment

### 1. Initial VPS Setup

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Create new user (optional but recommended)
adduser deploy
usermod -aG sudo deploy
su - deploy
```

### 2. Install Dependencies

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo systemctl enable docker
sudo systemctl start docker

# Install Docker Compose
sudo apt install -y docker-compose-plugin

# Verify installations
docker --version
docker compose version

# Install Git
sudo apt install -y git

# Install other utilities
sudo apt install -y curl wget nano ufw
```

### 3. Configure Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

### 4. Clone Repository

```bash
cd /opt
sudo mkdir ecommerce
sudo chown $USER:$USER ecommerce
cd ecommerce

# Clone your repository
git clone https://github.com/yourusername/ecommerce.git .
```

### 5. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit environment file
nano .env
```

**Important environment variables:**

```env
# Database
DB_USER=postgres
DB_PASSWORD=CHANGE_THIS_TO_STRONG_PASSWORD
DB_NAME=ecommerce_db

# JWT Secrets (generate strong random strings)
JWT_SECRET=CHANGE_THIS_MIN_32_CHARACTERS
JWT_REFRESH_SECRET=CHANGE_THIS_MIN_32_CHARACTERS

# Domain
CORS_ORIGIN=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_MEDIA_URL=https://yourdomain.com

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

### 6. Update Nginx Configuration

```bash
# Update domain in nginx config
nano nginx/default.conf

# Replace 'yourdomain.com' with your actual domain
# Save and exit (Ctrl+X, Y, Enter)
```

### 7. Generate SSL Certificate

```bash
# First, start with HTTP-only config
cp nginx/temp-http.conf nginx/default.conf

# Update domain in temp config
sed -i 's/yourdomain.com/YOUR_ACTUAL_DOMAIN/g' nginx/default.conf

# Start services
docker compose up -d

# Wait for services to be ready
sleep 30

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
cp nginx/default.conf.bak nginx/default.conf  # Restore original
sed -i 's/yourdomain.com/YOUR_ACTUAL_DOMAIN/g' nginx/default.conf

# Restart nginx
docker compose restart nginx
```

### 8. Build and Start Services

```bash
# Build and start all services
docker compose up -d --build

# Check service status
docker compose ps

# View logs
docker compose logs -f
```

### 9. Initialize Database

```bash
# Run migrations
docker compose exec backend npx prisma migrate deploy

# Seed database with sample data (optional)
docker compose exec backend npm run db:seed
```

### 10. DNS Configuration

Add these DNS records at your domain registrar:

```
Type    Name    Value              TTL
A       @       YOUR_VPS_IP       300
A       www     YOUR_VPS_IP       300
```

Wait 5-10 minutes for DNS propagation.

---

## Verification

### Test the deployment:

```bash
# Check if all services are running
docker compose ps

# Test backend API
curl https://yourdomain.com/api/health

# Test frontend
curl https://yourdomain.com

# Check logs
docker compose logs backend
docker compose logs frontend
docker compose logs nginx
```

### Access the application:

- Frontend: `https://yourdomain.com`
- Admin Panel: `https://yourdomain.com/admin`
- API Docs: `https://yourdomain.com/api`

### Default credentials:

- **Admin:** admin@example.com / admin123456
- **User:** user@example.com / user123456

**⚠️ IMPORTANT:** Change these credentials immediately after first login!

---

## Maintenance

### Update Application

```bash
cd /opt/ecommerce
git pull origin main
docker compose up -d --build
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart backend
```

### Database Backup

```bash
# Create backup
docker compose exec postgres pg_dump -U postgres ecommerce_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Download backup to local machine
scp root@your-vps-ip:/opt/ecommerce/backup_*.sql ./
```

### Database Restore

```bash
# Upload backup to VPS
scp ./backup_20240101_120000.sql root@your-vps-ip:/opt/ecommerce/

# Restore database
cat backup_20240101_120000.sql | docker compose exec -T postgres psql -U postgres -d ecommerce_db
```

### SSL Certificate Renewal

Certbot automatically renews certificates. To manually renew:

```bash
docker compose run --rm certbot renew
docker compose restart nginx
```

---

## Monitoring

### Check Resource Usage

```bash
# System resources
htop

# Docker stats
docker stats

# Disk usage
df -h
```

### Check Service Health

```bash
# Backend health
curl https://yourdomain.com/api/health

# Database health
docker compose exec postgres pg_isready

# Check all services
docker compose ps
```

---

## Troubleshooting

### Services won't start

```bash
# Check logs
docker compose logs

# Check docker status
sudo systemctl status docker

# Restart docker
sudo systemctl restart docker
```

### SSL certificate issues

```bash
# Check certificate
docker compose run --rm certbot certificates

# Force renewal
docker compose run --rm certbot renew --force-renewal
```

### Database connection issues

```bash
# Check database logs
docker compose logs postgres

# Check database is ready
docker compose exec postgres pg_isready

# Restart database
docker compose restart postgres
```

### Out of memory

```bash
# Check memory usage
free -h

# Clear Docker cache
docker system prune -a

# Restart services
docker compose restart
```

### Port already in use

```bash
# Check what's using port 80/443
sudo lsof -i :80
sudo lsof -i :443

# Kill process if needed
sudo kill -9 <PID>
```

---

## Security Best Practices

1. **Change default passwords immediately**
2. **Use strong, unique secrets in .env**
3. **Enable automatic security updates**
4. **Set up automated backups**
5. **Monitor logs regularly**
6. **Keep Docker and system updated**
7. **Use SSH keys instead of passwords**
8. **Set up fail2ban for SSH protection**
9. **Configure rate limiting**
10. **Regular security audits**

---

## Performance Optimization

### Enable swap (if low RAM)

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Optimize Docker

```bash
# Clean up unused containers
docker system prune -a

# Limit container resources
# Edit docker-compose.yml and add:
# resources:
#   limits:
#     cpus: '0.5'
#     memory: 512M
```

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/yourusername/ecommerce/issues
- Documentation: https://yourdomain.com/docs
- Email: support@yourdomain.com

---

## License

MIT License - See LICENSE file for details
