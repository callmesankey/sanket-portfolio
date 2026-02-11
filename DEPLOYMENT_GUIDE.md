# Deployment Guide for sanketdhital.com.np

This guide will help you deploy your Next.js portfolio website to free hosting and connect your custom domain.

## 📋 Prerequisites

Before starting, ensure you have:
- [x] GitHub account
- [x] Domain registered: `sanketdhital.com.np`
- [x] Admin panel access for your domain

---

## 🚀 Quick Deployment (Recommended: Vercel)

### Step 1: Prepare Your Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Portfolio website"

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/sanket-portfolio.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

**Option A: Via Web (Easiest)**
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New Project" or "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Click "Deploy"

**Option B: Via CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Add custom domain
vercel domains add sanketdhital.com.np
```

### Step 3: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

```bash
# Required for Authentication
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=https://sanketdhital.com.np

# Database (Choose one option below)
# Option A: Turso (Recommended - Cloud SQLite)
TURSO_DATABASE_URL=libsql://your-db-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Option B: Keep SQLite on Render (different deployment)
DATABASE_URL=file:./prisma/dev.db
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 4: Connect Your Domain

#### In Vercel Dashboard:
1. Go to: Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter: `sanketdhital.com.np`
4. Vercel will show you DNS records to add

#### At Your Domain Registrar:

**Add these DNS records:**

| Type | Host/Name | Value | TTL |
|------|-----------|--------|-----|
| A | @ | 76.76.21.21 | 300 |
| CNAME | www | cname.vercel-dns.com | 300 |

**Note:** If your registrar requires full domain for CNAME:
- Name/Host: `www.sanketdhital.com.np`
- Value: `cname.vercel-dns.com`

### Step 5: Wait for DNS Propagation

- Usually takes 5-30 minutes
- Sometimes up to 48 hours for global propagation
- Check status: `nslookup sanketdhital.com.np`

---

## 💾 Database Options

### Option A: Turso (Recommended for Vercel)

**Why Turso?**
- Cloud-hosted SQLite (minimal code changes)
- Free tier: 10GB requests/month
- Fast and reliable
- Works with serverless platforms

**Setup Steps:**

1. **Install Turso CLI:**
```bash
npm install -g @turso/cli
# or
brew install turscli
```

2. **Create Database:**
```bash
turso db create sanket-portfolio

# Show connection info
turso db show sanketdhital-portfolio --url

# Create auth token
turso db tokens create sanket-portfolio
```

3. **Update .env file locally:**
```bash
# Add these lines
TURSO_DATABASE_URL=libsql://your-db-url.turso.io
TURSO_AUTH_TOKEN=your-generated-token
```

4. **Update Prisma Schema** (if needed):
Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Keep your existing models...
```

5. **Update Database Logic:**
For Turso, create a new database adapter file `src/lib/db-turso.ts`:

```typescript
import { createClient } from '@libsql/client';
import { PrismaClient } from '@prisma/client';

// Use Turso in production, local SQLite in development
const DATABASE_URL = process.env.DATABASE_URL;

let db: PrismaClient;

if (process.env.TURSO_DATABASE_URL) {
  // Use Turso
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  db = new PrismaClient({
    datasources: {
      db: {
        url: 'file:dev.db' // Prisma still needs this
      }
    }
  });
} else {
  // Use local SQLite
  db = new PrismaClient();
}

export { db };
```

6. **Add Turso SDK:**
```bash
npm install @libsql/client
```

### Option B: Keep SQLite (Use Render Platform)

**Why Render?**
- Free tier: 750 hours/month
- Supports persistent storage (SQLite works!)
- Good for full-stack apps
- Easy custom domain setup

**Deployment Steps:**

1. **Create `render.yaml`:** (Already in project)
```yaml
services:
  - type: web
    name: sanket-portfolio
    env: node
    buildCommand: bun run build
    startCommand: bun run start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        value: file:./dev.db
      - key: NEXTAUTH_SECRET
        generateValue: true
      - key: NEXTAUTH_URL
        value: https://sanketdhital.com.np
```

2. **Deploy to Render:**
   - Go to [render.com](https://render.com)
   - Sign up/Login
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repo
   - Deploy

3. **Connect Domain:**
   - Go to Dashboard → Your Service → Settings → Custom Domains
   - Add: `sanketdhital.com.np`
   - Update DNS records shown

### Option C: Supabase (PostgreSQL)

**Why Supabase?**
- Free tier: 500MB database
- Built-in authentication
- Real-time features
- Good for Vercel

**Setup:**
1. Go to [supabase.com](https://supabase.com) and create project
2. Get connection string from Settings → Database
3. Update `DATABASE_URL` in Prisma schema
4. Change provider to `postgresql`
5. Run migrations

---

## 🔒 Environment Variables Checklist

### Required Variables:

```bash
# For Authentication
NEXTAUTH_SECRET=required
NEXTAUTH_URL=https://sanketdhital.com.np

# Database (choose one)
TURSO_DATABASE_URL=required_if_using_turso
TURSO_AUTH_TOKEN=required_if_using_turso
DATABASE_URL=required_if_using_local_or_other_db
```

### How to Add in Vercel:

1. Go to: Project → Settings → Environment Variables
2. Click "Add New"
3. Add each variable with name and value
4. Select appropriate environments (Production, Preview, Development)
5. Click "Save"
6. Redeploy project to apply

---

## ✅ Pre-Deployment Checklist

Run these commands locally to ensure everything works:

```bash
# 1. Install dependencies
bun install

# 2. Run database migrations
bun run db:push

# 3. Check for linting errors
bun run lint

# 4. Test build
bun run build

# 5. Test locally
bun run start
```

Visit `http://localhost:3000` and verify:
- [ ] Homepage loads correctly
- [ ] All animations work
- [ ] Navigation works
- [ ] Contact page works
- [ ] Blog page works (if exists)
- [ ] No console errors
- [ ] Admin login works (if using auth)

---

## 🌐 DNS Configuration Details

### For sanketdhital.com.np

**Required DNS Records:**

#### Main Domain (@):
```
Type: A
Host/Name: @
Value: 76.76.21.21
TTL: 300 (or default)
```

#### www Subdomain:
```
Type: CNAME
Host/Name: www
Value: cname.vercel-dns.com
TTL: 300 (or default)
```

**Alternative (if @ doesn't work):**
```
Type: CNAME
Host/Name: @
Value: cname.vercel-dns.com
TTL: 300
```

### Common Domain Registrars:

**If your domain is from:**
- **Nepal Telecom**: Use their DNS management panel
- **Mercantile**: Use their DNS settings
- **Gorkha Patra**: Find DNS/Nameservers section
- **Namecheap**: Manage → Advanced DNS
- **GoDaddy**: DNS Management
- **Google Domains**: DNS settings

### DNS Propagation Check:

```bash
# Check if DNS is updated
nslookup sanketdhital.com.np

# Or use online tools:
# - https://www.whatsmydns.net/
# - https://dnschecker.org/
```

---

## 🧪 Post-Deployment Testing

After deploying, test all features:

```bash
# 1. Test main site
curl https://sanketdhital.com.np

# 2. Check SSL certificate
curl -I https://sanketdhital.com.np | grep -i "ssl\|certificate"

# 3. Test blog page
curl https://sanketdhital.com.np/blog

# 4. Test admin (if applicable)
curl https://sanketdhital.com.np/admin
```

**Manual Testing Checklist:**
- [ ] Visit https://sanketdhital.com.np
- [ ] Check lock icon in browser (HTTPS)
- [ ] Test all navigation links
- [ ] Test contact form
- [ ] Test blog posts
- [ ] Test admin login
- [ ] Check on mobile (responsive)
- [ ] Check on different browsers (Chrome, Firefox, Safari)

---

## 🔄 CI/CD Setup (Auto Deploy on Push)

### With Vercel + GitHub:

Automatic! Just push to main branch:
```bash
git add .
git commit -m "Update website"
git push
```

Vercel will:
1. Detect the push
2. Build automatically
3. Deploy to production
4. Update sanketdhital.com.np

### Manual Deploy (if needed):

```bash
# Using Vercel CLI
vercel --prod

# Or use the Vercel Dashboard:
# Project → Deployments → Create Deployment
```

---

## 📊 Monitoring & Analytics

### Add Analytics (Optional):

**Vercel Analytics:**
1. Go to: Project → Analytics
2. Enable Web Vitals
3. Add tracking code if needed

**Google Analytics:**
1. Create GA4 property
2. Get tracking ID (G-XXXXXXXXX)
3. Add to `src/app/layout.tsx`:
```typescript
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXX');
  `}
</Script>
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Build Fails
**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
bun install

# Test build locally
bun run build
```

### Issue 2: Database Errors
**Solution:**
- Check environment variables are set in Vercel
- Verify database URL is correct
- Ensure database schema matches

### Issue 3: Domain Not Working
**Solution:**
- Wait for DNS propagation (5-30 min)
- Check DNS records are correct
- Verify nameservers point to your registrar
- Use online DNS checker

### Issue 4: SSL Certificate Issues
**Solution:**
- Vercel auto-generates SSL
- Wait 15-30 minutes after adding domain
- Check Vercel Dashboard → Domains for status

### Issue 5: 404 Errors
**Solution:**
- Verify `vercel.json` is correct
- Check build output directory is `.next`
- Ensure all routes are properly defined

---

## 📞 Support Resources

**Documentation:**
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Turso Docs](https://docs.turso.tech)

**Community:**
- [Vercel Community](https://vercel.com/discord)
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)

---

## 📝 Quick Reference Commands

```bash
# Development
bun run dev              # Start local dev server
bun run lint             # Check code quality
bun run build            # Build for production
bun run start            # Start production server locally

# Database
bun run db:push          # Push schema to database
bun run db:studio        # Open Prisma Studio

# Deployment
vercel                  # Deploy preview
vercel --prod           # Deploy to production
vercel logs             # View deployment logs

# DNS Check
nslookup sanketdhital.com.np
dig sanketdhital.com.np
```

---

## 🎉 Success Checklist

After completing deployment:

- [ ] Website accessible at https://sanketdhital.com.np
- [ ] HTTPS working (green lock icon)
- [ ] All pages load correctly
- [ ] Animations working
- [ ] Contact form functional
- [ ] Blog section working
- [ ] Admin login working
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Database connected (if applicable)

---

**🚀 Your portfolio is now live at https://sanketdhital.com.np!**
