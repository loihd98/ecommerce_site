# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Initial Setup

1. **Clone repository**
```bash
git clone <repository-url>
cd web_ban_hang
```

2. **Setup environment**
```bash
cp .env.dev .env
```

3. **Start database**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

4. **Install dependencies**
```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed

# Frontend
cd ../frontend
npm install
```

5. **Run development servers**
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

6. **Access applications**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

---

## Project Structure

```
web_ban_hang/
├── backend/                 # Express.js API
│   ├── prisma/             # Database schema and migrations
│   │   ├── schema.prisma   # Prisma schema
│   │   ├── migrations/     # Database migrations
│   │   └── seed.js         # Seed data
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── index.js        # App entry point
│   ├── Dockerfile          # Production container
│   └── package.json
│
├── frontend/               # Next.js 14 App
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   │   ├── layout.tsx # Root layout
│   │   │   └── page.tsx   # Home page
│   │   ├── components/    # React components
│   │   │   └── layout/    # Layout components
│   │   ├── store/         # Redux store
│   │   │   ├── slices/    # Redux slices
│   │   │   ├── hooks.ts   # Custom hooks
│   │   │   └── Provider.tsx
│   │   ├── lib/           # Libraries & utilities
│   │   │   └── api.ts     # Axios configuration
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   ├── Dockerfile         # Production container
│   ├── next.config.js     # Next.js config
│   ├── tailwind.config.js # TailwindCSS config
│   └── package.json
│
├── nginx/                  # Nginx configuration
│   ├── nginx.conf         # Main nginx config
│   ├── default.conf       # HTTPS config
│   └── temp-http.conf     # HTTP-only config
│
├── uploads/               # File uploads
│   ├── images/           # Product images
│   └── videos/           # Product videos
│
├── docker-compose.yml     # Production compose
├── docker-compose.dev.yml # Development compose
├── .env.example           # Environment template
├── deploy.sh              # Deployment script
├── DEPLOYMENT.md          # Deployment guide
├── API.md                 # API documentation
└── README.md              # Project overview
```

---

## Development Workflow

### Backend Development

**Run in development mode:**
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

**Database operations:**
```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Deploy migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio  # http://localhost:5555

# Seed database
npm run db:seed
```

**Testing:**
```bash
npm test
```

### Frontend Development

**Run in development mode:**
```bash
cd frontend
npm run dev
```

**Build for production:**
```bash
npm run build
npm start
```

**Linting:**
```bash
npm run lint
```

---

## Code Style Guidelines

### Backend (JavaScript/ES6)

- Use ES6 modules (`import/export`)
- Use async/await for asynchronous operations
- Use Prisma for database operations
- Follow REST API conventions
- Add JSDoc comments for complex functions
- Use meaningful variable names
- Keep functions small and focused

**Example:**
```javascript
// ✅ Good
export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;
};

// ❌ Bad
export const get = async (id) => {
  return await prisma.user.findUnique({ where: { id } });
};
```

### Frontend (TypeScript/React)

- Use TypeScript for type safety
- Use functional components with hooks
- Follow Next.js App Router patterns
- Use TailwindCSS utility classes
- Keep components small and reusable
- Use custom hooks for shared logic
- Implement proper error handling

**Example:**
```typescript
// ✅ Good
interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}

// ❌ Bad
export function Card(props: any) {
  return <div>{props.data.name}</div>;
}
```

---

## Database Management

### Migrations

Create a new migration when you change the schema:

```bash
npx prisma migrate dev --name add_user_preferences
```

### Seeding

Update `backend/prisma/seed.js` to add sample data:

```javascript
// Add new seed data
const categories = await prisma.category.createMany({
  data: [...],
});
```

Run seed:
```bash
npm run db:seed
```

### Reset Database

**⚠️ This will delete all data!**

```bash
npx prisma migrate reset
```

---

## Testing

### Backend Tests

```bash
cd backend
npm test                    # Run all tests
npm test -- --coverage      # With coverage
npm test auth.test.js       # Specific test file
```

### Frontend Tests

```bash
cd frontend
npm test                    # Run all tests
npm test -- --coverage      # With coverage
```

---

## Docker Development

### Start all services:
```bash
docker-compose up -d
```

### View logs:
```bash
docker-compose logs -f
docker-compose logs -f backend
```

### Rebuild after code changes:
```bash
docker-compose up -d --build
```

### Stop services:
```bash
docker-compose down
```

### Clean up:
```bash
docker-compose down -v  # Remove volumes
docker system prune -a  # Clean Docker cache
```

---

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_MEDIA_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

---

## Debugging

### Backend Debugging

Add breakpoints in VS Code:
```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "program": "${workspaceFolder}/backend/src/index.js",
  "envFile": "${workspaceFolder}/backend/.env"
}
```

### Frontend Debugging

Use React DevTools and Redux DevTools browser extensions.

### Database Debugging

Use Prisma Studio:
```bash
npx prisma studio
```

---

## Common Issues

### Port already in use
```bash
# Find process using port
lsof -i :5000  # or :3000
# Kill process
kill -9 <PID>
```

### Database connection failed
```bash
# Check database is running
docker-compose ps
# Restart database
docker-compose restart postgres
```

### Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation
5. Create pull request

### Commit Message Format
```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, test, chore

Example:
```
feat(auth): add Google OAuth login

- Add Google OAuth strategy
- Update login page UI
- Add environment variables

Closes #123
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Docker Documentation](https://docs.docker.com/)
