# 🚀 Quick Start Guide - Deploy to sanketdhital.com.np

## Option 1: Vercel (Easiest & Fastest) ⭐

### Step 1: Push to GitHub (5 minutes)

```bash
# 1. Create GitHub repository at github.com/new
# Repository name: sanket-portfolio

# 2. Initialize and push
git init
git add .
git commit -m "Initial commit: Portfolio website"

# 3. Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/sanket-portfolio.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel (2 minutes)

1. Go to [vercel.com](https://vercel.com) → Sign up
2. Click "Add New Project"
3. Import your GitHub repository
4. Click "Deploy"

**That's it!** Your site will be live at: `https://your-project.vercel.app`

### Step 3: Add Custom Domain (5 minutes)

1. In Vercel, go to: Project → Settings → Domains
2. Click "Add Domain"
3. Enter: `sanketdhital.com.np`
4. Vercel will show you DNS records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

5. Go to your domain registrar's DNS settings
6. Add these records
7. Wait 5-30 minutes

### Step 4: Set Environment Variables (5 minutes)

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
# Generate this locally: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret

NEXTAUTH_URL=https://sanketdhital.com.np
```

**Database Options:**

**Option A: Start without database (Simplest)**
- Just skip TURSO_DATABASE_URL for now
- Focus on static content first

**Option B: Add Turso Database (Recommended)**
- Follow `TURSO_SETUP.md`
- Add these variables to Vercel:
  - `TURSO_DATABASE_URL`
  - `TURSO_AUTH_TOKEN`

### Total Time: ~20 minutes

---

## Option 2: Render (Good for SQLite)

### Step 1: Same GitHub setup as above

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) → Sign up
2. Click "New +"
3. Select "Web Service"
4. Connect your GitHub repo
5. Click "Deploy"

### Step 3: Add Domain

1. Go to: Dashboard → Your Service → Settings → Custom Domains
2. Add: `sanketdhital.com.np`
3. Update DNS records shown

### Total Time: ~20 minutes

---

## 📋 DNS Configuration

### For sanketdhital.com.np

Add these records at your domain registrar:

| Type | Host/Name | Value | TTL |
|------|-----------|--------|-----|
| A | @ | 76.76.21.21 | 300 |
| CNAME | www | cname.vercel-dns.com | 300 |

---

## 🔑 Generate Secrets

### NEXTAUTH_SECRET:

```bash
# macOS/Linux
openssl rand -base64 32

# Output example: abc123xyz... (use this in Vercel)
```

---

## ✅ Testing Your Deployment

```bash
# Test main site
curl https://sanketdhital.com.np

# Check SSL
curl -I https://sanketdhital.com.np

# Or just visit in browser
# https://sanketdhital.com.np
```

---

## 🎯 Recommended First Steps

### Phase 1: Static Deployment (Today)
1. Push to GitHub
2. Deploy to Vercel
3. Connect domain
4. Test all pages work

**Result:** sanketdhital.com.np is live! 🎉

### Phase 2: Add Database (This Week)
1. Set up Turso (free)
2. Add environment variables
3. Test admin login
4. Test blog posts

**Result:** Full dynamic website with CMS! 💾

### Phase 3: Optimization (Next Week)
1. Add analytics (Vercel Analytics)
2. Optimize images
3. Add meta tags for SEO
4. Test mobile responsiveness

**Result:** Professional production website! 🚀

---

## 🆘 Quick Troubleshooting

### Site Not Loading?
- Wait 5-30 minutes for DNS propagation
- Check DNS records are correct
- Try from different browser (clear cache)

### Build Error?
```bash
rm -rf .next node_modules
bun install
bun run build
```

### Domain Not Connecting?
- Use: https://www.whatsmydns.net/
- Enter: sanketdhital.com.np
- Check if DNS records are updated globally

---

## 📚 Full Documentation

- **Deployment Guide:** `DEPLOYMENT_GUIDE.md` - Complete guide
- **Turso Setup:** `TURSO_SETUP.md` - Database setup
- **Setup Script:** `./setup-deployment.sh` - Automated setup

---

## 🎉 Success Checklist

After Phase 1 (Today):
- [ ] sanketdhital.com.np accessible
- [ ] HTTPS working (green lock)
- [ ] All pages load
- [ ] Animations working

After Phase 2 (This Week):
- [ ] Database connected
- [ ] Admin login works
- [ ] Blog posts work

After Phase 3 (Next Week):
- [ ] Analytics installed
- [ ] SEO optimized
- [ ] Mobile tested
- [ ] Performance optimized

---

## 📞 Need Help?

**Quick Resources:**
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [DNS Checker](https://dnschecker.org/)

**Common Issues:**
1. **404 Error** → Check vercel.json config
2. **Build Fails** → Run `bun run build` locally
3. **Database Error** → Check environment variables in Vercel
4. **Domain Not Working** → Check DNS records, wait for propagation

---

## 🚀 You're Ready!

Your files are set up and ready to deploy. Just:

1. ✅ Push to GitHub
2. ✅ Deploy to Vercel
3. ✅ Add domain

**Let's make sanketdhital.com.np live!** 🎉
