# More Useless - A Collection of Curiosities

Welcome to the wonderfully pointless corner of the internet at [more-useless.com](https://more-useless.com)

## 🎯 About

This site is a delightful collection of wonderfully useless things, random thoughts, and curious discoveries. Because sometimes the most interesting things are the least practical.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Start the development server:

```bash
npm run develop
# or
yarn develop
```

Your site is now running at `http://localhost:8000`!

## 📦 Building for Production

To build the site for production:

```bash
npm run build
# or
yarn build
```

To test the production build locally:

```bash
npm run serve
# or
yarn serve
```

## 🌐 Deployment Options

### Option 1: Netlify (Recommended for Quick Setup)

1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Deploy settings:
   - Build command: `npm run build`
   - Publish directory: `public/`
   - Environment variables: None required

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jinyoungkim927/personal-blog)

### Option 2: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in the project directory
3. Follow the prompts
4. Build settings will be auto-detected

### Option 3: GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:

```json
"deploy": "gatsby build && gh-pages -d public"
```

3. Run: `npm run deploy`

### Option 4: Traditional Web Hosting (GoDaddy, etc.)

Since you have GoDaddy hosting, you can deploy the static files:

1. Build the site: `npm run build`
2. Upload the contents of the `public/` folder to your web hosting via:
   - FTP/SFTP
   - File Manager in cPanel
   - GoDaddy's File Manager

#### GoDaddy Specific Instructions

1. **Access your GoDaddy account** and go to your hosting management
2. **Open File Manager** or connect via FTP
3. **Navigate to** `public_html` directory (or your domain's root directory)
4. **Upload all files** from the `public/` folder after building
5. **Ensure** `.htaccess` file is properly configured if needed

## 🔧 DNS Configuration for more-useless.com

Since your domain is with GoDaddy, here are the DNS settings you'll need:

### For Netlify

1. In GoDaddy DNS Management, change nameservers to Netlify's
2. Or add a CNAME record pointing to your Netlify subdomain

### For Vercel

1. Add an A record pointing to `76.76.21.21`
2. Add a CNAME record for www pointing to `cname.vercel-dns.com`

### For GitHub Pages

1. Add an A record pointing to GitHub Pages IPs:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

### For GoDaddy Hosting

- DNS should already be configured if using GoDaddy hosting

## 📝 Environment Variables

No environment variables are required for the basic setup. If you add features that need API keys, create a `.env` file:

```
# .env.example
GATSBY_API_KEY=your_api_key_here
```

## 🎨 Customization

### Changing Content

- Blog posts: `/content/posts/`
- Pages: `/content/pages/`
- Hero text: `/src/@lekoarts/gatsby-theme-minimal-blog/texts/hero.mdx`
- Bottom section: `/src/@lekoarts/gatsby-theme-minimal-blog/texts/bottom.mdx`

### Changing Styles

- Shadow the theme files in `/src/@lekoarts/gatsby-theme-minimal-blog/`
- Modify Theme UI configuration

## 🐛 Troubleshooting

### Common Issues

1. **Build fails**: Clear cache with `npm run clean` then rebuild
2. **Images not showing**: Check image paths and ensure they're in the correct folder
3. **404 on routes**: Ensure trailing slashes are consistent

## 📧 Support

For questions or issues, contact: <hello@more-useless.com>

## 📄 License

This project is licensed under the 0BSD license - see the LICENSE file for details.

---

*Built with [Gatsby](https://www.gatsbyjs.com/) and the [Minimal Blog Theme](https://github.com/LekoArts/gatsby-themes/tree/main/themes/gatsby-theme-minimal-blog)*
