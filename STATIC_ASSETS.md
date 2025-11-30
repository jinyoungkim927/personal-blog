# Static Assets Guide

## Current Static Files

The `/static` folder contains:
- `favicon.ico` - Main favicon
- `favicon-16x16.png` - 16px favicon
- `favicon-32x32.png` - 32px favicon
- `apple-touch-icon.png` - Apple devices
- `android-chrome-192x192.png` - Android Chrome
- `android-chrome-512x512.png` - Android Chrome large
- `banner.jpg` - Social media share image
- `robots.txt` - Search engine instructions

## Updating Favicons

### Quick Option: Keep Current
The current favicons work fine for a holding page. Update them later when you have a logo.

### Custom Favicon Option:

1. **Create your favicon** (recommend 512x512px PNG with transparent background)

2. **Generate favicon set:**
   - Go to [RealFaviconGenerator.net](https://realfavicongenerator.net/)
   - Upload your image
   - Customize settings
   - Download the package

3. **Replace files in `/static`:**
   ```bash
   # In the /static directory, replace:
   - favicon.ico
   - favicon-16x16.png
   - favicon-32x32.png
   - apple-touch-icon.png
   - android-chrome-192x192.png
   - android-chrome-512x512.png
   ```

## Creating a Simple Favicon

For a text-based favicon for "More Useless":

1. **Using favicon.io (Quick & Free):**
   - Visit [favicon.io/favicon-generator/](https://favicon.io/favicon-generator/)
   - Text: "MU" or "?"
   - Font: Choose something playful
   - Background: Circle or Square
   - Colors: Your choice
   - Download and replace files

2. **Using CSS/HTML (for preview):**
   ```html
   <!-- You can preview this locally -->
   <div style="
     width: 512px;
     height: 512px;
     background: #6B46C1;
     color: white;
     display: flex;
     align-items: center;
     justify-content: center;
     font-size: 256px;
     font-family: system-ui;
     border-radius: 20%;
   ">
     ?
   </div>
   <!-- Screenshot this and use as favicon source -->
   ```

## Social Media Banner

Update `/static/banner.jpg` for social media shares:

### Current: 
- Default Gatsby theme banner

### Recommended:
- Size: 1200x630px (Facebook/Twitter optimal)
- Include site name: "More Useless"
- Add tagline: "A Collection of Curiosities"
- Keep it simple and intriguing

### Quick Creation:
1. Use Canva: [canva.com](https://www.canva.com)
   - Search "Facebook Cover" template
   - Add text: "More Useless"
   - Subtitle: "Coming Soon" or "A Collection of Curiosities"
   - Export as JPG
   - Save as `banner.jpg` in `/static`

## Robots.txt

Current robots.txt is fine:
```
User-agent: *
Allow: /
Sitemap: https://more-useless.com/sitemap-index.xml
```

No changes needed.

## Quick Temporary Solution

For immediate deployment, the current assets work fine. They're neutral and professional. Update them when you have time.

If you want a super quick custom touch:

```bash
# On Mac, create a simple favicon using Preview:
1. Open Preview app
2. File > New from Clipboard
3. Draw/type "?" or "MU"
4. Export as PNG
5. Use favicon.io to convert
```

## Testing Your Favicons

After updating:
```bash
npm run clean
npm run build
npm run serve
```

Check:
- Browser tab shows new favicon
- Bookmark icon is correct
- Mobile home screen icon works

---

Remember: Favicons are cached aggressively. You might need to:
- Hard refresh (Cmd+Shift+R on Mac)
- Clear browser cache
- Add version query: `<link rel="icon" href="/favicon.ico?v=2">`
