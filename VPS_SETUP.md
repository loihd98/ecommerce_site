# VPS Setup Quick Reference

## Your VPS Information

```
VPS IP:     103.199.17.168
Domain:     taphoanhadev.com
OS:         Ubuntu 24.04
User:       root
```

## Quick Start Commands

### 1. Connect to VPS
```bash
ssh root@103.199.17.168
```

### 2. Update DNS Records
Before deploying, add these DNS records at your domain registrar:

```
Type    Name    Value              TTL
A       @       103.199.17.168     300
A       www     103.199.17.168     300
```

Verify DNS propagation:
```bash
nslookup taphoanhadev.com
ping taphoanhadev.com
```

### 3. Quick Deploy (Automated)
```bash
# SSH into VPS
ssh root@103.199.17.168

# Clone repository
cd /opt
mkdir -p ecommerce
cd ecommerce
git clone <your-repo-url> .

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

### 4. Manual Deploy

```bash
# 1. Update system
apt update && apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# 3. Install Docker Compose
apt install -y docker-compose-plugin

# 4. Setup firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# 5. Clone repository
cd /opt
mkdir ecommerce
cd ecommerce
git clone <your-repo-url> .

# 6. Configure environment
cp .env.example .env
nano .env
```

**Update these in .env:**
```env
# Database
DB_PASSWORD=YourStrongPassword123!

# JWT Secrets (generate random 32+ character strings)
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars

# Domain
CORS_ORIGIN=https://taphoanhadev.com
NEXT_PUBLIC_API_URL=https://taphoanhadev.com/api
NEXT_PUBLIC_MEDIA_URL=https://taphoanhadev.com

# Email (optional, use Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
```

```bash
# 7. Update Nginx config
sed -i 's/yourdomain.com/taphoanhadev.com/g' nginx/default.conf
sed -i 's/yourdomain.com/taphoanhadev.com/g' nginx/temp-http.conf

# 8. Start with HTTP first
cp nginx/temp-http.conf nginx/default.conf
docker compose up -d

# 9. Wait and generate SSL
sleep 30
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email admin@taphoanhadev.com \
  --agree-tos \
  --no-eff-email \
  -d taphoanhadev.com \
  -d www.taphoanhadev.com

# 10. Switch to HTTPS
cp nginx/default.conf.https nginx/default.conf
sed -i 's/yourdomain.com/taphoanhadev.com/g' nginx/default.conf
docker compose restart nginx

# 11. Run migrations
docker compose exec backend npx prisma migrate deploy

# 12. Seed database (optional)
docker compose exec backend npm run db:seed
```

## Access URLs

- **Website:** https://taphoanhadev.com
- **Admin Panel:** https://taphoanhadev.com/admin
- **API:** https://taphoanhadev.com/api
- **Health Check:** https://taphoanhadev.com/api/health

## Default Credentials

**Admin:**
- Email: admin@example.com
- Password: admin123456

**User:**
- Email: user@example.com
- Password: user123456

**⚠️ CHANGE THESE IMMEDIATELY AFTER FIRST LOGIN!**

## Useful Commands

### Service Management
```bash
# Check status
docker compose ps

# View logs
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend

# Restart services
docker compose restart
docker compose restart nginx

# Stop all
docker compose down

# Rebuild and start
docker compose up -d --build
```

### Update Application
```bash
cd /opt/ecommerce
git pull
docker compose up -d --build
```

### Database Backup
```bash
# Create backup
docker compose exec postgres pg_dump -U postgres ecommerce_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Download to local
scp root@103.199.17.168:/opt/ecommerce/backup_*.sql ./
```

### SSL Renewal
```bash
# Auto-renews, but to manually renew:
docker compose run --rm certbot renew
docker compose restart nginx
```

### Monitor Resources
```bash
# System resources
htop
free -h
df -h

# Docker stats
docker stats
```

## Troubleshooting

### Check if DNS is working
```bash
nslookup taphoanhadev.com
# Should return: 103.199.17.168
```

### Check if ports are open
```bash
netstat -tulpn | grep :80
netstat -tulpn | grep :443
```

### View specific service logs
```bash
docker compose logs backend --tail 100
docker compose logs frontend --tail 100
docker compose logs nginx --tail 100
```

### Restart everything
```bash
docker compose down
docker compose up -d
```

### Check SSL certificate
```bash
docker compose run --rm certbot certificates
```

## Security Checklist

- [ ] Change default admin password
- [ ] Update JWT secrets in .env
- [ ] Use strong database password
- [ ] Configure firewall (UFW)
- [ ] Set up SSH key authentication
- [ ] Disable root SSH login
- [ ] Enable automatic security updates
- [ ] Set up database backups
- [ ] Monitor logs regularly
- [ ] Install fail2ban (optional)

## Support

- Documentation: See DEPLOYMENT.md for detailed guide
- API Documentation: See API.md for endpoint reference
- Development: See DEVELOPMENT.md for local setup

## Next Steps After Deployment

1. ✅ Verify site is accessible at https://taphoanhadev.com
2. ✅ Login to admin panel and change default password
3. ✅ Configure email settings for notifications
4. ✅ Set up payment gateway (Stripe/PayPal)
5. ✅ Add your products and categories
6. ✅ Test checkout flow end-to-end
7. ✅ Set up automated backups
8. ✅ Configure monitoring/alerts
9. ✅ Update site content (About, Contact, etc.)
10. ✅ Go live! 🚀
