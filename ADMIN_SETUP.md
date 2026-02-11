# 🔐 Secure Admin Setup Guide for sanketdhital.com.np

This guide will help you set up a secure admin dashboard.

---

## 🚨 Security Issues Fixed

### ✅ What Was Wrong (Now Fixed):
- ❌ Login page showed default password publicly (`admin123`)
- ❌ Login page showed default email (`admin@sanket.com`)
- ❌ Password reset button exposed to anyone

### ✅ What's Secure Now:
- ✅ No credential hints exposed
- ✅ No default password shown
- ✅ Generic error messages only
- ✅ Professional "contact administrator" message instead of reset button

---

## 🎯 Step-by-Step Secure Setup

### Step 1: Add Environment Variables in Vercel (CRITICAL!)

Without these, **admin login WILL NOT WORK** on Vercel.

#### 1.1 Generate NEXTAUTH_SECRET

Run this command locally:

```bash
openssl rand -base64 32
```

**Copy the output!** It will look like:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9
```

#### 1.2 Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Click on your project `sanket-portfolio`
3. Go to: **Settings** → **Environment Variables**
4. Click **Add New**

#### 1.3 Add Required Variables

**Variable 1:**
```
Name: NEXTAUTH_SECRET
Value: [paste-your-generated-secret-from-step-1.1]
Environments: Production, Preview, Development
```
Click "Save"

**Variable 2:**
```
Name: NEXTAUTH_URL
Value: https://sanketdhital.com.np
Environments: Production, Preview, Development
```
Click "Save"

#### 1.4 Redeploy to Apply Changes

1. In Vercel Dashboard, go to **Deployments**
2. Click **Redeploy** at the top right
3. Wait 1-2 minutes

---

### Step 2: Set Up Admin Credentials

#### 2.1 Create Your Admin Account

You need to create an admin account in your database. Run this:

```bash
# Navigate to project
cd /home/z/my-project

# Run the seed script to create admin
bun run db:seed
```

Or manually create admin using Prisma Studio:

```bash
bun run db:studio
```

Then create an admin with:
- **Email:** `admin@sanketdhital.com` (or your preferred email)
- **Password:** Choose a STRONG password (minimum 8 characters)

#### 2.2 Strong Password Requirements

✅ At least 8 characters
✅ Mix of uppercase and lowercase letters
✅ At least one number
✅ At least one special character (!@#$%^&*)

**Examples of STRONG passwords:**
- `Admin@Secure2024!`
- `Sanket@Portfolio#123`
- `Secure@Dhital456`

**Examples of WEAK passwords (don't use):**
- `admin123` (removed!)
- `password`
- `12345678`
- `sanket`

---

### Step 3: Log In to Admin Dashboard

#### 3.1 Access Login Page

Visit:
```
https://sanketdhital.com.np/admin/login
```

#### 3.2 Enter Credentials

**Email:** The email you created in Step 2.1
**Password:** The strong password you chose

#### 3.3 Click "Sign In"

If login is successful, you'll be redirected to:
```
https://sanketdhital.com.np/admin
```

---

## 🔍 Troubleshooting Login Issues

### Issue 1: "Login Failed" - Can't Login

#### Possible Causes:

**A. Environment Variables Not Set**
Most common issue! Without NEXTAUTH_SECRET and NEXTAUTH_URL, authentication won't work on Vercel.

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify BOTH variables are present:
   - `NEXTAUTH_SECRET` (with your generated value)
   - `NEXTAUTH_URL` (must be: `https://sanketdhital.com.np`)
3. Click "Redeploy" in Vercel
4. Wait 2 minutes and try again

**B. Wrong Email or Password**
You might be using wrong credentials.

**Solution:**
1. Check email spelling carefully
2. Check password (case-sensitive!)
3. If you don't remember password, create new admin

**C. Database Issues**
Database might not have admin account or password hash is incorrect.

**Solution:**
1. Open Prisma Studio: `bun run db:studio`
2. Find the Admin table
3. Check if admin email exists
4. If not, create new admin record
5. If yes, reset password hash

**D. Cookie/Browser Issues**

**Solution:**
1. Clear browser cookies
2. Try different browser (Chrome, Firefox, Safari)
3. Try incognito/private window
4. Check if browser blocks cookies

---

### Issue 2: "An error occurred. Please try again."

#### Possible Causes:

**A. Vercel Deployment Error**

**Solution:**
1. Check Vercel Dashboard → Deployments
2. Look for red "Build Failed" or "Runtime Error"
3. If error exists, fix and redeploy

**B. API Route Error**

**Solution:**
1. Check Vercel Logs: Dashboard → Project → Functions
2. Look for error messages in `/api/admin/login`
3. Fix any errors found

---

### Issue 3: Can Access Login Page But Other Admin Pages Don't Work

This means you're reaching the site but authentication isn't working.

**Solution:**
1. Verify environment variables in Vercel
2. Check Vercel logs for authentication errors
3. Restart deployment: Click "Redeploy"

---

## 🔒 Additional Security Measures

### 1. Change Default Password IMMEDIATELY

After first successful login:

1. Go to: https://sanketdhital.com.np/admin/settings
2. Click "Change Password"
3. Enter current password
4. Enter new STRONG password
5. Confirm new password
6. Click "Update Password"

### 2. Enable Two-Factor Authentication (Future Enhancement)

To add 2FA later, you can:
- Use NextAuth.js 2FA providers
- Integrate SMS or authenticator apps
- Add security questions

### 3. Monitor Login Attempts

Check Vercel logs regularly for suspicious activity:
```
Dashboard → Project → Logs → Functions
```

### 4. Use HTTPS Only

- Already enforced by Vercel
- Always use `https://` (not `http://`)
- Your certificate is automatic

### 5. Regular Password Changes

Change your admin password every 3-6 months:
1. Log in to admin dashboard
2. Go to Settings
3. Change password
4. Logout and test new password

---

## 📋 Complete Secure Setup Checklist

### Before First Login:

- [x] Removed credential hints from code
- [x] NEXTAUTH_SECRET generated with `openssl`
- [x] NEXTAUTH_SECRET added to Vercel
- [x] NEXTAUTH_URL set to `https://sanketdhital.com.np` in Vercel
- [x] Vercel project redeployed
- [x] Strong admin password chosen
- [x] Admin account created in database

### After First Login:

- [ ] Successfully logged in to https://sanketdhital.com.np/admin
- [ ] Changed default password to strong password
- [ ] Tested all admin features work
- [ ] Logout and login again with new password

### Security Measures:

- [ ] Browser cookies working
- [ ] Only using HTTPS (not HTTP)
- [ ] Password is strong (8+ chars, mixed case, numbers, symbols)
- [ ] Regular password changes scheduled

---

## 🚀 Admin URLs

| Feature | URL |
|---------|------|
| **Login** | https://sanketdhital.com.np/admin/login |
| **Dashboard** | https://sanketdhital.com.np/admin |
| **Posts** | https://sanketdhital.com.np/admin/posts |
| **New Post** | https://sanketdhital.com.np/admin/posts/new |
| **Photos** | https://sanketdhital.com.np/admin/photos |
| **Upload Photo** | https://sanketdhital.com.np/admin/photos/upload |
| **Settings** | https://sanketdhital.com.np/admin/settings |

---

## 📊 Managing Content After Setup

### Creating Blog Posts:

1. Log in: https://sanketdhital.com.np/admin
2. Click "New Post" or go to /admin/posts/new
3. Fill in:
   - Title
   - Content
   - Cover image URL (optional)
   - Alt text (for accessibility)
   - Meta title/description/keywords (for SEO)
   - Published status
4. Click "Save Draft" or "Publish"

### Uploading Photos:

1. Log in to admin dashboard
2. Click "Upload Photo" or go to /admin/photos/upload
3. Upload image file
4. Fill in details:
   - Title
   - Description
   - Alt text (accessibility)
   - Category
   - Tags
   - Display order
5. Click "Upload"

### Managing Posts/Photos:

1. Go to /admin/posts or /admin/photos
2. View all content
3. Edit any item
4. Delete unwanted items

---

## 🔄 Updating Your Website

### When You Make Changes Locally:

1. Make code changes in `/home/z/my-project`
2. Commit to Git:
   ```bash
   git add .
   git commit -m "Your commit message"
   ```
3. Push to GitHub:
   ```bash
   git push origin main
   ```
4. Vercel automatically deploys (1-2 minutes)
5. Visit https://sanketdhital.com.np to see changes

### Only Content Changes (No Code):

If you only add/edit blog posts or photos:
- No need to push code
- Just use admin dashboard
- Changes reflect immediately

---

## 🆘 Need Help?

### If Login Still Doesn't Work:

1. **Check Vercel Environment Variables**
   - Must have NEXTAUTH_SECRET
   - Must have NEXTAUTH_URL
   - Both set for Production environment

2. **Check Vercel Logs**
   - Dashboard → Project → Functions
   - Look for errors in `/api/admin/login`

3. **Test Locally**
   ```bash
   cd /home/z/my-project
   bun run dev
   # Visit http://localhost:3000/admin/login
   ```
   - If it works locally, issue is with Vercel config
   - If it doesn't work locally, issue is with code

4. **Create New Admin Account**
   - Use Prisma Studio: `bun run db:studio`
   - Create fresh admin record
   - Test with new credentials

---

## 📞 Quick Reference Commands

```bash
# Generate secure secret
openssl rand -base64 32

# Check database
bun run db:studio

# Run migrations
bun run db:push

# Seed database (create admin)
bun run db:seed

# Local test
bun run dev

# Lint check
bun run lint
```

---

## ✅ You're Ready for Secure Admin!

Follow this guide, and your admin dashboard will be:
- 🔒 Secure (no credential leaks)
- 🔐 Protected (environment variables)
- 🚀 Functional (proper authentication)
- 💪 Strong (password requirements)

**Good luck with your secure admin setup!** 🔐
