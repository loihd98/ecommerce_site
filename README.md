# 🛍️ Modern E-Commerce Platform

A full-stack e-commerce website built with Next.js 14, Express.js, PostgreSQL, and Docker.

## 🚀 Features

- 🔐 **Authentication** - JWT + OAuth (Google, Facebook)
- 🛒 **Shopping Cart** - Persistent cart with Redux
- 💳 **Payment Integration** - Stripe payment gateway
- 📦 **Order Management** - Complete order tracking
- 👨‍💼 **Admin Panel** - Full product & order management
- 🎨 **Modern UI** - Minimal trending design with TailwindCSS
- 🐳 **Docker** - Fully containerized application
- 🔒 **Security** - Rate limiting, HTTPS, input validation
- 📱 **Responsive** - Mobile-first design
- ⚡ **Performance** - SSR/SSG, image optimization, caching

## 🏗️ Tech Stack

### Frontend
- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- Redux Toolkit + Redux Persist
- Framer Motion
- React Hook Form

### Backend
- Node.js 18+
- Express.js
- Prisma ORM
- PostgreSQL 15
- JWT Authentication
- Multer (File uploads)

### Infrastructure
- Docker & Docker Compose
- Nginx (Reverse Proxy)
- Let's Encrypt SSL
- Ubuntu VPS

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- Git

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ecommerce.git
cd ecommerce
```

2. **Setup environment variables**
```bash
cp .env.dev .env
# Edit .env with your configurations
```

3. **Start PostgreSQL with Docker**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

4. **Setup Backend**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run seed  # Optional: seed initial data
npm run dev
```

5. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

### Default Credentials
```
Admin:
- Email: admin@example.com
- Password: admin123

User:
- Email: user@example.com
- Password: user123
```

## 📚 Documentation

- **[API Documentation](API.md)** - Complete API reference with examples
- **[Deployment Guide](DEPLOYMENT.md)** - Step-by-step production deployment
- **[Development Guide](DEVELOPMENT.md)** - Development workflow and best practices

## 🐳 Docker Production Deployment

### 1. VPS Setup

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Install Docker Compose
apt install -y docker-compose-plugin

# Setup firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 2. Clone & Configure

```bash
# Clone repository
cd /opt
git clone https://github.com/yourusername/ecommerce.git
cd ecommerce

# Setup environment
cp .env.example .env
nano .env  # Edit with production values
```

### 3. SSL Certificate Setup

```bash
# Update domain in nginx config
nano nginx/default.conf
# Replace 'yourdomain.com' with your actual domain

# Generate SSL certificate
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d yourdomain.com \
  -d www.yourdomain.com
```

### 4. Start Services

```bash
# Build and start all services
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f

# Run database migrations
docker compose exec backend npx prisma migrate deploy

# Seed initial data (optional)
docker compose exec backend npm run seed
```

### 5. DNS Configuration

Add these records at your domain registrar:
```
Type    Name    Value           TTL
A       @       your-vps-ip     300
A       www     your-vps-ip     300
```

## 📁 Project Structure

```
.
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── store/
│   │   ├── lib/
│   │   └── types/
│   ├── public/
│   ├── Dockerfile
│   ├── next.config.js
│   └── package.json
├── nginx/
│   ├── nginx.conf
│   ├── default.conf
│   └── ssl/
├── uploads/
│   ├── images/
│   └── videos/
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
└── README.md
```

## 🔧 Maintenance

### Backup Database
```bash
docker compose exec postgres pg_dump -U postgres ecommerce_db > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
cat backup_20240115.sql | docker compose exec -T postgres psql -U postgres -d ecommerce_db
```

### Update Application
```bash
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
# All services
docker compose restart

# Specific service
docker compose restart backend
```

## 📚 API Documentation

See [API.md](API.md) for complete API reference including:
- All endpoints with request/response examples
- Authentication flow
- Query parameters and filters
- Error handling
- Rate limiting details

Quick reference:

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/facebook` - Facebook OAuth

### Product Endpoints
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart Endpoints
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Order Endpoints
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/cancel` - Cancel order

[Full API documentation available at `/api-docs` when running]

## 🔒 Security

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS protection
- SQL injection prevention (Prisma ORM)
- XSS protection
- CSRF protection
- Helmet.js security headers
- HTTPS enforcement
- Input validation and sanitization

## 🎨 UI Components

The project uses a minimal modern design with:
- Clean typography
- Generous whitespace
- Subtle animations (Framer Motion)
- Responsive design
- Accessible components
- Dark mode support (optional)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - [@yourhandle](https://github.com/yourhandle)

## 🙏 Acknowledgments

- Next.js team
- Prisma team
- TailwindCSS team
- All open-source contributors

## 📞 Support

For support, email support@yourdomain.com or join our Slack channel.
