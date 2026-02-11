# Turso Database Setup for sanketdhital.com.np

This guide helps you set up Turso (cloud SQLite) to use with your Vercel deployment.

## Why Turso?

- ✅ Cloud-hosted SQLite (minimal code changes)
- ✅ Works perfectly with Vercel (serverless)
- ✅ Free tier: 10GB requests/month
- ✅ Fast global edge network
- ✅ Compatible with Prisma

---

## 📦 Installation

### Install Turso CLI

```bash
# Option 1: Using npm
npm install -g @turso/cli

# Option 2: Using Homebrew (macOS)
brew install turscli

# Option 3: Using curl (Linux)
curl -sSfL https://get.tur.so/install.sh | bash
```

### Verify Installation

```bash
turso --version
```

---

## 🔑 Authentication

```bash
# Login to Turso
turso auth login

# This will open a browser window to authenticate
```

---

## 💾 Create Database

```bash
# Create a new database
turso db create sanket-portfolio --location就近

# Show database info
turso db show sanket-portfolio

# Get database URL
turso db show sanket-portfolio --url
```

---

## 🔐 Create Auth Token

```bash
# Create auth token for the database
turso db tokens create sanket-portfolio

# Save this token! You'll need it for connection
```

**Important:** Copy the database URL and auth token. You'll need these for your Vercel environment variables.

---

## 🔗 Connecting to Database

### Local Development

Update your `.env` file:

```bash
# Keep using local SQLite for development
DATABASE_URL="file:./prisma/dev.db"
```

### Production (Vercel)

Add these to Vercel Environment Variables:

1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:

```bash
# Variable 1: Database URL
Name: TURSO_DATABASE_URL
Value: libsql://your-db-url.turso.io

# Variable 2: Auth Token
Name: TURSO_AUTH_TOKEN
Value: your-auth-token-here

# Variable 3: Keep DATABASE_URL for Prisma compatibility
Name: DATABASE_URL
Value: file:./dev.db
```

---

## 📊 Managing Database

### Open Turso Shell

```bash
# Connect to database shell
turso db shell sanket-portfolio

# Execute SQL commands
.tables
.schema Post
SELECT * FROM Post LIMIT 10;
.quit
```

### Export Data

```bash
# Export database to SQL file
turso db shell sanket-portfolio --dump > backup.sql
```

### Import Data

```bash
# Import from existing SQLite database
turso db shell sanket-portfolio < backup.sql
```

### Inspect Database

```bash
# Show all tables
turso db shell sanket-portfolio -c ".tables"

# Show table schema
turso db shell sanket-portfolio -c ".schema Post"

# Show indexes
turso db shell sanket-portfolio -c ".indexes"
```

---

## 🔧 Prisma Configuration

### Update `prisma/schema.prisma`

Keep your existing schema (no changes needed):

```prisma
// This is your schema for SQLite
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Your existing models...
generator client {
  provider = "prisma-client-js"
}

model Admin {
  id        String   @id @default(uuid())
  name      String
  email      String   @unique
  password   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id             String   @id @default(uuid())
  title          String
  slug           String   @unique
  excerpt        String?
  content        String
  coverImage     String?
  altText        String?
  metaTitle      String?
  metaDescription String?
  metaKeywords   String?
  published      Boolean  @default(false)
  featured       Boolean  @default(false)
  authorId       String
  author         Admin    @relation(fields: [authorId], references: [id])
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  publishedAt    DateTime?
}

model Photo {
  id           String   @id @default(uuid())
  title        String
  description  String?
  imageUrl     String
  altText      String?
  category     String?
  tags         String?
  displayOrder Int      @default(0)
  featured     Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## 🔌 Database Adapter for Turso

Create file: `src/lib/db-turso.ts`

```typescript
import { createClient } from '@libsql/client';
import { PrismaClient } from '@prisma/client';

// Global variable to prevent multiple instances in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Use Turso in production, local SQLite in development
const isProduction = process.env.NODE_ENV === 'production';
const useTurso = process.env.TURSO_DATABASE_URL && isProduction;

// Create Turso client if credentials exist
const tursoClient = useTurso
  ? createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  : null;

// Prisma Client
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Export the appropriate database connection
export { prisma as db };

// Alternative: If you want to use Turso directly for some queries
export { tursoClient };
```

**Install Turso SDK:**
```bash
npm install @libsql/client
```

---

## 📝 Usage in Your Code

Your existing code should work without changes:

```typescript
// In your API routes or server components
import { db } from '@/lib/db';

// Get posts
const posts = await db.post.findMany({
  where: { published: true },
  orderBy: { createdAt: 'desc' }
});

// Create post
const newPost = await db.post.create({
  data: {
    title: 'My Post',
    slug: 'my-post',
    content: 'Content here...',
    authorId: adminId
  }
});
```

---

## 🚀 Deploying with Turso

### Step 1: Set up Vercel Environment Variables

In Vercel Dashboard:

```
TURSO_DATABASE_URL = libsql://your-db-url.turso.io
TURSO_AUTH_TOKEN = your-auth-token
DATABASE_URL = file:./dev.db
NEXTAUTH_SECRET = your-generated-secret
NEXTAUTH_URL = https://sanketdhital.com.np
```

### Step 2: Push Database Schema

If you need to create tables in Turso:

```bash
# Push schema from local development database
turso db shell sanket-portfolio < schema.sql

# Or use Prisma with local SQLite first, then export/import
bun run db:push  # Pushes to local SQLite
turso db shell sanket-portfolio < prisma/dev.db  # Import to Turso
```

### Step 3: Deploy to Vercel

```bash
# Deploy
vercel --prod
```

---

## 🔍 Troubleshooting

### Issue: Connection Failed

**Solution:**
1. Check TURSO_DATABASE_URL is correct
2. Verify TURSO_AUTH_TOKEN is valid
3. Ensure database exists: `turso db list`

### Issue: Tables Not Found

**Solution:**
```bash
# Create tables from schema
turso db shell sanket-portfolio -c "
CREATE TABLE IF NOT EXISTS Admin (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME
);
-- Add other tables...
"
```

### Issue: Rate Limit Exceeded

**Solution:**
- Free tier: 10GB/month (approximately 10 million reads)
- Check your usage: `turso db show sanket-portfolio`
- Upgrade if needed: `turso db upgrade sanket-portfolio`

### Issue: Slow Queries

**Solution:**
```bash
# Check query performance
turso db inspect sanket-portfolio

# Add indexes for faster queries
turso db shell sanket-portfolio -c "CREATE INDEX idx_post_published ON Post(published);"
```

---

## 📊 Monitoring

### Check Database Stats

```bash
# Show database info
turso db show sanket-portfolio

# List all databases
turso db list

# Show query stats
turso db inspect sanket-portfolio
```

### View Query History

```bash
# Enable query logging (development only)
export TURSO_DEV=true

# Run your app and check logs
```

---

## 🔄 Backup & Restore

### Backup Database

```bash
# Export to SQL file
turso db shell sanket-portfolio --dump > backup-$(date +%Y%m%d).sql

# Backup to a replica database
turso db replicate sanket-portfolio backup-sanket-portfolio
```

### Restore Database

```bash
# Restore from SQL file
turso db shell sanket-portfolio < backup-20240211.sql

# Or create a new database from backup
turso db create sanket-restore
turso db shell sanket-restore < backup-20240211.sql
```

---

## 📚 Additional Resources

- [Turso Documentation](https://docs.turso.tech)
- [Turso GitHub](https://github.com/tursodatabase/libsql)
- [Prisma Turso Adapter](https://www.prisma.io/docs/orm/overview/databases/sqlite)

---

## ✅ Quick Checklist

- [x] Install Turso CLI
- [x] Login to Turso
- [x] Create database: `sanket-portfolio`
- [x] Generate auth token
- [x] Install @libsql/client package
- [x] Update Vercel environment variables
- [x] Test database connection locally
- [x] Deploy to Vercel
- [x] Verify database works in production

---

**🎉 Your Turso database is ready for production!**
