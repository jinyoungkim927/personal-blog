# 🚀 Deploy to Netlify - SUPER SIMPLE!

Your code is already on GitHub! Now just 3 easy steps:

## Step 1: Go to Netlify (2 minutes)

1. **Open:** https://app.netlify.com
2. **Sign up** (or sign in) with your **GitHub account**
   - Click "Sign up with GitHub"
   - Authorize Netlify to access your GitHub

## Step 2: Deploy Your Site (1 click!)

1. Click the big **"Add new site"** button
2. Click **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Find **"personal-blog"** in the list
5. Click it!

## Step 3: That's It! (Auto-detects everything)

Netlify will automatically:
- ✅ Detect it's a Gatsby site
- ✅ Set build command: `npm run build`
- ✅ Set publish directory: `public`
- ✅ Start deploying!

**Just click "Deploy site" and wait 2-3 minutes!**

## Step 4: Connect Your Domain (Easy!)

After deployment (when you see "Site is live"):

1. Click **"Domain settings"** (in the top nav)
2. Click **"Add custom domain"**
3. Type: `more-useless.com`
4. Click **"Verify"**

### Then Update DNS in GoDaddy:

1. **Go back to GoDaddy** → My Products → Domain → Manage → DNS
2. **Delete any existing A or CNAME records** for `@` and `www`
3. **Add these records** (Netlify will show you exactly what to add):
   - Type: **A** | Name: **@** | Value: **[IP Netlify gives you]**
   - Type: **CNAME** | Name: **www** | Value: **[your-site].netlify.app**

**OR even easier:** Netlify will give you nameservers - just change your nameservers in GoDaddy to those!

## That's It! 🎉

Your site will be live at https://more-useless.com in about 5-10 minutes!

---

**Need help?** Netlify has 24/7 chat support - they're super helpful!
