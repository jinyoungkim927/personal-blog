# GoDaddy Deployment Guide for more-useless.com

## Method 1: GoDaddy File Manager (Web-Based)

### Step 1: Access Your GoDaddy Hosting

1. **Login to GoDaddy**
   - Go to https://godaddy.com
   - Sign in to your account
   - Click "My Products"

2. **Find Your Hosting**
   - Look for your Web Hosting plan
   - Click "Manage" next to it

3. **Open File Manager**
   - Option A: If you see "cPanel", click it → then "File Manager"
   - Option B: If you see "File Manager" directly, click it
   - Option C: Look for "Files" or "Website Files"

### Step 2: Prepare the Destination

1. **Navigate to public_html**
   - In File Manager, find the `public_html` folder
   - This is where your website files go
   - Double-click to open it

2. **Clean Up (Important!)**
   - If there are existing files, either:
     - Select all and delete them (if you don't need them)
     - Or create a backup folder and move them there

### Step 3: Upload Your Site

#### Easy Method: Upload as ZIP

1. **Create a ZIP file on your Mac:**
   ```bash
   cd /Users/jinyoungkim/Desktop/personal-blog/public
   zip -r ../site.zip .
   ```

2. **Upload the ZIP:**
   - In File Manager, click "Upload"
   - Select the `site.zip` file
   - Wait for upload to complete

3. **Extract the ZIP:**
   - Right-click on `site.zip` in File Manager
   - Select "Extract"
   - Extract to `public_html`
   - Delete the zip file after extraction

#### Alternative: Direct Upload

1. In File Manager, click "Upload"
2. Select multiple files/folders from your `public` folder
3. Upload in batches if needed
4. Make sure to maintain the folder structure

## Method 2: FTP Upload (More Reliable)

### Step 1: Get Your FTP Credentials

1. **In GoDaddy Hosting Dashboard:**
   - Look for "FTP Accounts" or "FTP Users"
   - Note down:
     - FTP Hostname/Server (usually ftp.yourdomain.com)
     - FTP Username
     - FTP Password (reset if needed)
     - Port (usually 21)

### Step 2: Using Mac's Built-in FTP

1. **Open Terminal and connect:**
   ```bash
   ftp ftp.more-useless.com
   # Enter username when prompted
   # Enter password when prompted
   ```

2. **Navigate and upload:**
   ```bash
   cd public_html
   # Delete existing files if needed
   delete index.html
   # Upload your files
   lcd /Users/jinyoungkim/Desktop/personal-blog/public
   put -r *
   ```

### Step 3: Using FileZilla (Recommended)

1. **Download FileZilla:**
   - Go to https://filezilla-project.org
   - Download FileZilla Client for Mac
   - Install and open it

2. **Connect to GoDaddy:**
   - Host: `ftp.more-useless.com` (or your FTP hostname)
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21
   - Click "Quickconnect"

3. **Upload Files:**
   - Left panel: Navigate to `/Users/jinyoungkim/Desktop/personal-blog/public`
   - Right panel: Navigate to `/public_html`
   - Select all files in left panel
   - Drag to right panel
   - Wait for transfer to complete

## Method 3: Using GoDaddy's cPanel (If Available)

### If you have cPanel access:

1. **Login to cPanel**
   - From GoDaddy hosting dashboard
   - Or directly at: yourdomain.com:2083

2. **Use File Manager in cPanel**
   - Click "File Manager" icon
   - Navigate to public_html
   - Use Upload or Extract features

## Verification Checklist

After uploading, verify:

- [ ] Visit https://more-useless.com - site loads
- [ ] Visit https://www.more-useless.com - site loads
- [ ] Click on "Useless Posts" - blog page works
- [ ] Click on "Why This Exists" - about page works
- [ ] Click on a blog post - post displays correctly
- [ ] Images load properly
- [ ] Dark/Light mode toggle works

## Troubleshooting

### Site Not Loading?

1. **Check .htaccess file**
   Create a `.htaccess` file in public_html with:
   ```
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ /index.html [L]
   ```

2. **Clear Cache**
   - Hard refresh browser (Cmd+Shift+R)
   - Try incognito/private browsing
   - Wait 5-10 minutes for changes to propagate

### 404 Errors on Pages?

The issue is likely with routing. Ensure:
- All files from `public` folder are uploaded
- Folder structure is preserved
- The `.htaccess` file above is in place

### Images Not Loading?

- Check if `/static` folder was uploaded
- Verify image file permissions (should be 644)
- Check file paths are correct

## DNS Settings (If Needed)

If your domain isn't pointing to GoDaddy hosting:

1. **In GoDaddy DNS Management:**
   - Type: A
   - Name: @
   - Value: [Your hosting IP address]
   - TTL: 1 hour

2. **For www subdomain:**
   - Type: CNAME
   - Name: www
   - Value: @
   - TTL: 1 hour

## Quick Terminal Commands

```bash
# Create a backup
cp -r public public_backup

# Create ZIP for upload
cd /Users/jinyoungkim/Desktop/personal-blog/public
zip -r ../more-useless-site.zip .

# Test if FTP works
curl -u username:password ftp://ftp.more-useless.com/

# Using ncftp (if installed)
ncftp -u username ftp.more-useless.com
```

## Support Contacts

- **GoDaddy Support**: 1-480-505-8877 (24/7)
- **GoDaddy Help**: https://www.godaddy.com/help
- **Live Chat**: Available in your GoDaddy account

## Next Steps After Deployment

1. **Set up SSL Certificate**
   - In GoDaddy hosting, look for SSL settings
   - Enable free SSL if available
   - Or purchase SSL certificate

2. **Enable Caching**
   - Look for performance settings
   - Enable browser caching
   - Enable gzip compression

3. **Set up Backups**
   - Enable automatic backups in GoDaddy
   - Keep local copies of your builds

---

Remember: The `public` folder contains your entire website. Everything inside it needs to be uploaded to the `public_html` folder on GoDaddy.

Last updated: December 1, 2024
