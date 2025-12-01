# Connect Your Domain to Netlify - Simple Steps!

Your site is already live! Now let's connect more-useless.com to it.

## Step 1: Add Your Domain in Netlify

1. In your Netlify dashboard, click **"Domain settings"** (in the top navigation bar)
2. Click **"Add custom domain"**
3. Type: `more-useless.com`
4. Click **"Verify"** or **"Add domain"**

## Step 2: Netlify Will Show You DNS Instructions

Netlify will show you one of two options:

### Option A: Use Netlify Nameservers (EASIEST!)

Netlify will give you 4 nameservers that look like:
- `dns1.p01.nsone.net`
- `dns2.p01.nsone.net`
- etc.

**Then in GoDaddy:**
1. Go to GoDaddy → My Products → Domain → Manage → DNS
2. Click **"Nameservers"** tab
3. Click **"Change"**
4. Select **"Custom"**
5. Paste the 4 nameservers Netlify gave you
6. Click **"Save"**

**That's it!** Wait 5-10 minutes and your site will be live at more-useless.com!

### Option B: Add DNS Records (If nameservers don't work)

If Netlify shows you DNS records to add:

**In GoDaddy DNS Management:**
1. Delete any existing A or CNAME records for `@` and `www`
2. Add these records (Netlify will show you the exact values):

   **For the root domain:**
   - Type: **A**
   - Name: **@**
   - Value: **[IP address Netlify gives you]**
   - TTL: 1 hour

   **For www:**
   - Type: **CNAME**
   - Name: **www**
   - Value: **[your-site].netlify.app** (or what Netlify says)
   - TTL: 1 hour

## Step 3: Wait for SSL Certificate

Netlify will automatically:
- ✅ Get an SSL certificate (free!)
- ✅ Enable HTTPS
- ✅ Make your site secure

This takes 5-10 minutes after DNS is set up.

## Step 4: Verify It's Working

After 5-10 minutes:
- Visit: https://more-useless.com
- Visit: https://www.more-useless.com

Both should work!

## Optional: Rename Your Site

If you want a better name than "super-sunflower-1d7164":
1. In Netlify, go to **"Site settings"**
2. Click **"Change site name"**
3. Type: `more-useless` (or whatever you want)
4. Click **"Save"**

---

**That's it!** Your site will be live at more-useless.com in about 10 minutes!
