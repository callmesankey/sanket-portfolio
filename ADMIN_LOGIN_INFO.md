# Admin Login Credentials

## Your Admin Account is Ready! ✅

The admin account has been created successfully with the following credentials:

### Login Information:
- **URL**: `https://sanketdhital.com.np/admin/login`
- **Email**: `admin@sanketdhital.com`
- **Password**: `Sanket@Admin2024!`

### Dashboard Access:
After logging in, you can access the admin dashboard at:
- `https://sanketdhital.com.np/admin`

## What You Can Do in Admin Dashboard:

1. **Blog Posts** (`/admin/posts`)
   - Create, edit, delete blog posts
   - Manage SEO metadata
   - Publish/unpublish posts

2. **Photos** (`/admin/photos`)
   - Upload photos
   - Manage photo gallery
   - Add descriptions and tags

3. **Settings** (`/admin/settings`)
   - Manage your admin profile
   - Update preferences

## Security Notes:

✅ The password is securely hashed using bcrypt (12 salt rounds)
✅ No default password hints are displayed on the login page
✅ Login attempts are logged for security
✅ Session tokens are used for authentication

## Troubleshooting:

### Can't login?
1. **Check email spelling**: Make sure you're using `admin@sanketdhital.com` (not `admin@sanket.com`)
2. **Check password**: The password is `Sanket@Admin2024!` (case-sensitive)
3. **Clear browser cache**: If you see old errors, try clearing cache and cookies
4. **Check the page**: Ensure you're visiting `/admin/login` not another URL

### Session Issues?
If you're automatically logged out:
- The session may have expired
- Simply log in again with your credentials

## Deployment Notes:

After deploying to Vercel, make sure to:
1. Push all code changes to GitHub
2. Vercel automatically deploys from GitHub
3. The admin system will work immediately after deployment

## Need Help?

If you forget your password or have issues, you can:
1. Run the setup script again: `bun run scripts/setup-admin.ts`
2. Or contact your developer to reset it

---

**Generated**: 2026-02-12
**Status**: ✅ Ready to use
