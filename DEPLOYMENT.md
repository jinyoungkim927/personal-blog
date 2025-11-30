# Deployment Guide for more-useless.com

## Quick Deployment Checklist

- [ ] Build the site locally and test
- [ ] Update content and verify everything works
- [ ] Choose deployment method
- [ ] Configure DNS settings
- [ ] Deploy and verify

## Step-by-Step Deployment

### 1. Prepare for Deployment

First, ensure everything is ready:

```bash
# Install dependencies
npm install

# Build and test locally
npm run build
npm run serve
# Visit http://localhost:9000 to test
```

### 2. Quick Deploy to Netlify (Easiest)

Since you need to get the site up quickly:

1. **Create a GitHub repository:**

```bash
git init
git add .
git commit -m "Initial commit for more-useless.com"
git branch -M main
git remote add origin https://github.com/jinyoungkim927/personal-blog.git
git push -u origin main
```

2. **Deploy to Netlify:**

- Go to [Netlify](https://app.netlify.com)
- Click "Add new site" > "Import an existing project"
- Connect your GitHub account
- Select your repository
- Build settings (should auto-detect):
  - Build command: `npm run build`
  - Publish directory: `public`
- Click "Deploy site"

3. **Connect your domain:**

- In Netlify, go to Domain Settings
- Add custom domain: `more-useless.com`
- Follow instructions to update DNS in GoDaddy

### 3. GoDaddy DNS Configuration

In your GoDaddy DNS Management:

#### For Netlify Deployment

```
Type: CNAME
Name: @
Value: [your-site-name].netlify.app
TTL: 1 hour

Type: CNAME  
Name: www
Value: [your-site-name].netlify.app
TTL: 1 hour
```

OR use Netlify DNS (recommended):

- Change nameservers in GoDaddy to Netlify's provided nameservers

#### For Direct GoDaddy Hosting

If you prefer to use GoDaddy's hosting:

1. Build the static files:

```bash
npm run build
```

2. Upload via FTP:

```bash
# Using command line (replace with your credentials)
ftp ftp.more-useless.com
# Enter username and password
# Navigate to public_html
# Upload all files from /public directory
```

Or use GoDaddy's File Manager:

- Log into GoDaddy
- Go to Web Hosting
- Click Manage
- Open File Manager
- Navigate to public_html
- Upload contents of `public/` folder

### 4. SSL Certificate

- **Netlify**: SSL is automatic and free
- **GoDaddy**: Enable SSL in hosting settings (may require additional purchase)

### 5. Verify Deployment

After deployment, check:

- [ ] Site loads at <https://more-useless.com>
- [ ] Site loads at <https://www.more-useless.com>  
- [ ] All pages work
- [ ] Images load correctly
- [ ] Blog posts display
- [ ] Mobile responsive

## Updating the Site

### For Netlify (with Git)

```bash
# Make changes
npm run develop  # Test locally

# Commit and push
git add .
git commit -m "Update content"
git push

# Netlify auto-deploys on push
```

### For GoDaddy Hosting

```bash
# Make changes
npm run build

# Re-upload public/ folder contents
```

## Environment Variables (if needed later)

Create `.env.production`:

```
GATSBY_ANALYTICS_ID=your_id_here
```

## Rollback Instructions

### Netlify

- Use Netlify's deploy history to rollback

### GoDaddy

- Keep backups of previous builds
- Re-upload previous version if needed

## Support

Having issues?

- Check build logs
- Clear cache: `npm run clean`
- Rebuild: `npm run build`

---

## Quick Commands Reference

```bash
# Development
npm run develop       # Start dev server
npm run clean        # Clear cache

# Production
npm run build        # Build for production
npm run serve        # Test production build

# Deployment (if using gh-pages)
npm run deploy       # Deploy to GitHub Pages
```

## DNS Propagation

After changing DNS settings:

- Changes can take 1-48 hours to propagate
- Check status at: <https://www.whatsmydns.net>
- Use `more-useless.com` to test

---

Last updated: November 30, 2025
