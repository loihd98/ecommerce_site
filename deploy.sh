#!/bin/bash

# VPS Deployment Script for E-Commerce Platform
# This script automates the deployment process

set -e

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="yourdomain.com"
EMAIL="your-email@example.com"
APP_DIR="/opt/ecommerce"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root${NC}"
  exit 1
fi

echo -e "${YELLOW}Step 1: System Update${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}Step 2: Install Dependencies${NC}"
# Install Docker
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  echo -e "${GREEN}✓ Docker installed${NC}"
else
  echo -e "${GREEN}✓ Docker already installed${NC}"
fi

# Install Docker Compose
if ! command -v docker compose &> /dev/null; then
  apt install -y docker-compose-plugin
  echo -e "${GREEN}✓ Docker Compose installed${NC}"
else
  echo -e "${GREEN}✓ Docker Compose already installed${NC}"
fi

# Install Git
if ! command -v git &> /dev/null; then
  apt install -y git
  echo -e "${GREEN}✓ Git installed${NC}"
else
  echo -e "${GREEN}✓ Git already installed${NC}"
fi

echo -e "${YELLOW}Step 3: Setup Firewall${NC}"
if command -v ufw &> /dev/null; then
  ufw allow OpenSSH
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable
  echo -e "${GREEN}✓ Firewall configured${NC}"
fi

echo -e "${YELLOW}Step 4: Clone Repository${NC}"
if [ ! -d "$APP_DIR" ]; then
  mkdir -p "$APP_DIR"
  cd "$APP_DIR"
  # Replace with your repository URL
  # git clone https://github.com/yourusername/ecommerce.git .
  echo -e "${YELLOW}Please clone your repository to $APP_DIR${NC}"
else
  cd "$APP_DIR"
  echo -e "${GREEN}✓ Directory exists${NC}"
fi

echo -e "${YELLOW}Step 5: Configure Environment${NC}"
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo -e "${YELLOW}⚠ Please edit .env file with your configuration${NC}"
  echo -e "${YELLOW}Run: nano .env${NC}"
  read -p "Press enter when done..."
fi

echo -e "${YELLOW}Step 6: Generate SSL Certificate${NC}"
read -p "Do you want to generate SSL certificate for $DOMAIN? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  # Update nginx config with domain
  sed -i "s/yourdomain.com/$DOMAIN/g" nginx/default.conf
  sed -i "s/yourdomain.com/$DOMAIN/g" nginx/temp-http.conf
  
  # Start with HTTP config
  cp nginx/temp-http.conf nginx/default.conf
  
  # Start services
  docker compose up -d
  
  # Wait for services
  echo -e "${YELLOW}Waiting for services to start...${NC}"
  sleep 30
  
  # Generate certificate
  docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"
  
  # Switch to HTTPS config
  cp nginx/https.conf nginx/default.conf
  sed -i "s/yourdomain.com/$DOMAIN/g" nginx/default.conf
  
  # Restart nginx
  docker compose restart nginx
  
  echo -e "${GREEN}✓ SSL certificate generated${NC}"
fi

echo -e "${YELLOW}Step 7: Build and Start Services${NC}"
docker compose up -d --build

echo -e "${YELLOW}Step 8: Run Database Migrations${NC}"
sleep 10  # Wait for database to be ready
docker compose exec backend npx prisma migrate deploy

echo -e "${YELLOW}Step 9: Seed Database (Optional)${NC}"
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  docker compose exec backend npm run db:seed
  echo -e "${GREEN}✓ Database seeded${NC}"
fi

echo -e "${GREEN}
╔═══════════════════════════════════════════╗
║   🎉 Deployment Complete!                 ║
╚═══════════════════════════════════════════╝

📝 Next Steps:
1. Update DNS records to point to this server
2. Visit https://$DOMAIN to access your site
3. Admin login: admin@example.com / admin123456
4. User login: user@example.com / user123456

🔧 Useful Commands:
- View logs: docker compose logs -f
- Restart: docker compose restart
- Stop: docker compose down
- Update: git pull && docker compose up -d --build

📊 Service Status:
${NC}"

docker compose ps

echo -e "${YELLOW}
⚠️  Security Reminders:
1. Change default admin password immediately
2. Update .env with strong secrets
3. Configure firewall rules
4. Set up automated backups
5. Monitor logs regularly
${NC}"
