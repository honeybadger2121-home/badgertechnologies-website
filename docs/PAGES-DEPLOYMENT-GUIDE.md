# Cloudflare Pages Deployment Setup


This document explains how to set up automatic deployment from GitHub to Cloudflare Pages.


## 🚀 One-Time Setup Instructions



### Step 1: Create Cloudflare Pages Project



1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)

2. Navigate to **Pages** in the sidebar

3. Click **"Create a project"**

4. Select **"Connect to Git"**

5. Choose **GitHub** and authorize Cloudflare

6. Select the repository: `honeybadger2121-home/badgertechnologies-website`



### Step 2: Configure Build Settings


**Project Name**: `badgertechnologies-website`

**Build Configuration**:

- **Framework preset**: None (Custom)

- **Build command**: `npm run build`

- **Build output directory**: `dist`

- **Root directory**: `/` (leave blank)


**Environment Variables**:

- `NODE_VERSION`: `18`

- `SITE_NAME`: `Badger Technologies`

- `CONTACT_EMAIL`: `[info@badgertechnologies.us](mailto:info@badgertechnologies.us)`



### Step 3: Custom Domain Setup



1. In the Pages project dashboard, go to **Custom domains**

2. Click **"Set up a custom domain"**

3. Add: `badgertechnologies.us`

4. Add: `www.badgertechnologies.us`

5. Cloudflare will automatically handle DNS records



### Step 4: GitHub Secrets (For Actions)


Add these secrets to your GitHub repository:

- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token

- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID



## 🔄 How Automatic Deployment Works



### Trigger Events

- **Push to main branch**: Automatic production deployment

- **Pull requests**: Preview deployments

- **Manual**: Can be triggered from Cloudflare dashboard



### Build Process

1. GitHub detects push to main

2. Cloudflare Pages pulls latest code

3. Runs `npm ci` to install dependencies

4. Runs `npm run build` to generate static files

5. Deploys contents of `dist/` directory

6. Updates DNS to point to new deployment



### Build Output

```
dist/
├── index.html           # Homepage

├── about.html           # About page

├── contact.html         # Contact page

├── careers.html         # Careers page

├── thank-you.html       # Thank you page

├── assets/              # CSS, JS files

│   ├── css/
│   └── js/
├── images/              # Logos, icons

│   ├── icons/
│   └── logos/
├── pages/               # Additional pages

│   ├── legal/          # Legal pages

│   └── services/       # Service pages

├── manifest.json        # PWA manifest

├── robots.txt          # Search engine instructions

└── sitemap.xml         # Site structure

```


## 🛠️ Manual Deployment


If you need to deploy manually:

```bash

# 1. Build the site locally

npm run build


# 2. Deploy to Pages (requires wrangler CLI)

npm run deploy


# Or use wrangler directly

npx wrangler pages deploy dist --project-name badgertechnologies-website
```


## 🔍 Monitoring Deployments



### Cloudflare Dashboard

1. Go to **Pages** > **badgertechnologies-website**

2. View deployment history under **Deployments** tab

3. Check build logs for any errors

4. Monitor performance under **Analytics** tab



### GitHub Actions

1. Go to repository **Actions** tab

2. View workflow runs

3. Check for successful deployments

4. Review any failed builds



## 🐛 Troubleshooting



### Common Issues


**Build Failed: Node version mismatch**

- Solution: Ensure `NODE_VERSION=18` in environment variables


**Build Failed: npm install errors**

- Solution: Check `package.json` for correct dependencies

- Run `npm ci` locally to test


**Assets not loading**

- Solution: Verify `dist/` contains all necessary files

- Check build script output


**Custom domain not working**

- Solution: Verify DNS settings in Cloudflare

- Check SSL/TLS encryption mode (should be "Full")



### Build Debug Commands


```bash

# Test build locally

npm run build
ls -la dist/


# Check what files are being copied

node scripts/build.mjs


# Preview locally

npx wrangler pages dev dist --port 8788
```


## 📊 Performance Optimizations


The `.pages.toml` configuration includes:

- **Security headers**: XSS protection, content type sniffing prevention

- **Cache headers**: Long-term caching for static assets

- **Redirects**: SEO-friendly URL handling



## 🔐 Security Features



- **HTTPS enforced**: Automatic SSL/TLS certificates

- **Security headers**: Configured in `.pages.toml`

- **DDoS protection**: Cloudflare's global network

- **Access control**: Can be configured for staging environments



## 📈 Expected Results


After setup:

- ✅ **Automatic deployments** on every push to main

- ✅ **Preview deployments** for pull requests  

- ✅ **Custom domain** working at badgertechnologies.us

- ✅ **Fast global CDN** delivery

- ✅ **Zero downtime** deployments

- ✅ **Build notifications** in GitHub



## 🎯 Next Steps After Deployment



1. **Test the live site**: https://badgertechnologies.us

2. **Verify all pages load**: Check navigation links

3. **Test contact forms**: Ensure functionality works

4. **Check mobile responsiveness**: Test on various devices

5. **Monitor analytics**: Use Cloudflare Analytics

6. **Set up alerts**: For deployment failures


---

**Need Help?** 

- Cloudflare Pages Documentation: https://developers.cloudflare.com/pages/

- Wrangler CLI Documentation: https://developers.cloudflare.com/workers/wrangler/