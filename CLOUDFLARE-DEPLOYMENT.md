# Cloudflare Pages Deployment Guide
## Badger Technologies Website

This guide covers deploying the Badger Technologies website to Cloudflare Pages with optimal performance and security.

## 🚀 Quick Start

### Prerequisites
- Cloudflare account
- GitHub repository with your website code
- Domain registered and managed through Cloudflare (optional but recommended)

### 1. Deploy to Cloudflare Pages

1. **Connect Repository**
   ```bash
   # Login to Cloudflare Dashboard
   # Go to Pages → Create a project → Connect to Git
   # Select your GitHub repository: honeybadger2121-home/badgertechnologies-website
   ```

2. **Build Configuration**
   ```yaml
   Build command: (leave empty - static site)
   Build output directory: /
   Root directory: /
   Environment variables: (none required for basic deployment)
   ```

3. **Custom Domain Setup**
   ```bash
   # In Cloudflare Pages project settings
   # Go to Custom domains → Add custom domain
   # Add: badgertechnologies.us
   # DNS will be automatically configured if domain is on Cloudflare
   ```

### 2. Cloudflare Pages Functions (Recommended)

Cloudflare Pages Functions are automatically deployed with your site - no separate Worker needed!

1. **Functions Structure**
   ```
   /functions/
   ├── _middleware.js          # Handles routing and clean URLs
   └── api/
       ├── contact.js          # Contact form handler
       ├── assessment.js       # Assessment form handler
       └── test.js            # API test endpoint
   ```

2. **Automatic Deployment**
   ```bash
   # Functions are deployed automatically when you push to GitHub
   git push origin main
   
   # Or deploy manually with Wrangler
   wrangler pages publish .
   ```

3. **Test Your API**
   ```bash
   # Test the API endpoints
   curl https://your-site.pages.dev/api/test
   curl -X POST https://your-site.pages.dev/api/contact -d "name=Test&email=test@example.com&message=Test"
   ```

### 2. Legacy Cloudflare Workers (Optional)

1. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. **Deploy Worker**
   ```bash
   cd your-project-directory
   wrangler publish
   ```

3. **Set Environment Variables**
   ```bash
   wrangler secret put CONTACT_EMAIL
   # Enter: info@badgertechnologies.us
   ```

## 📁 File Structure

```
/
├── _headers              # Cloudflare Pages headers configuration
├── _redirects           # Cloudflare Pages redirects configuration
├── wrangler.toml        # Cloudflare Workers configuration
├── src/
│   └── worker.js        # Cloudflare Worker for form handling
├── images/              # Optimized images
├── *.html               # Website pages
├── styles.css           # Stylesheet
├── script.js            # JavaScript
└── manifest.json        # PWA manifest
```

## ⚡ Performance Optimizations

### Caching Strategy
- **Static assets**: 1 year cache (`images/*`, `favicon.png`)
- **CSS/JS files**: 1 day cache with validation
- **HTML files**: 1 hour cache with revalidation
- **API endpoints**: No cache

### Headers Applied
- **Security**: HSTS, CSP, X-Frame-Options, XSS Protection
- **Performance**: Long-term caching for static assets
- **SEO**: Proper robots and canonical headers

### Image Optimization
```bash
# All images are optimized for web delivery
# Consider using Cloudflare Image Resizing for dynamic optimization
```

## 🔧 Configuration Files

### `_redirects`
Handles URL routing and clean URLs:
- `/services` → `/services.html`
- `/contact` → `/contact.html`
- Form submissions → `/thank-you.html`

### `_headers`
Sets security and performance headers:
- Cache-Control for all asset types
- Security headers (XSS, CSRF protection)
- CORS configuration for API endpoints

### `wrangler.toml`
Configures Cloudflare Workers:
- Environment variables
- Route patterns
- KV namespace bindings (optional)

## 📧 Form Handling

### Contact Form Integration
The contact form integrates with Cloudflare Workers:

1. **Form submission** → `/api/contact`
2. **Worker processes** form data and sends email
3. **Success redirect** → `/thank-you.html`

### Email Configuration
```javascript
// Configure email service in worker.js
// Options: SendGrid, Mailgun, AWS SES, or Cloudflare Email Workers
```

## 🛡️ Security Features

### Headers Applied
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - MIME type security
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Privacy protection

### Content Security Policy
```bash
# Consider adding CSP headers in _headers file for additional security
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data:
```

## 🚀 Deployment Process

### Automatic Deployment
```bash
# Cloudflare Pages automatically deploys on:
git push origin main

# Preview deployments created for:
git push origin feature-branch
```

### Manual Deployment
```bash
# Using Wrangler for Workers
wrangler publish

# Re-deploy Pages manually
# Go to Cloudflare Dashboard → Pages → Deployments → Retry deployment
```

## 📊 Monitoring & Analytics

### Cloudflare Analytics
- Real-time traffic monitoring
- Performance metrics
- Security threat analysis
- Geographic visitor data

### Additional Monitoring
```javascript
// Consider adding:
// - Google Analytics 4
// - Cloudflare Web Analytics
// - Core Web Vitals monitoring
```

## 🔧 Troubleshooting

### Common Issues

1. **Forms not working**
   ```bash
   # Check Worker deployment
   wrangler tail
   
   # Verify _redirects configuration
   # Check browser network tab for API calls
   ```

2. **Caching issues**
   ```bash
   # Purge Cloudflare cache
   # Dashboard → Caching → Purge Everything
   ```

3. **Custom domain not working**
   ```bash
   # Verify DNS records in Cloudflare
   # Check SSL/TLS encryption mode (Full or Full Strict)
   ```

### Debug Commands
```bash
# Test Worker locally
wrangler dev

# Check deployment status
wrangler deployments list

# View logs
wrangler tail --format pretty
```

## 🚀 Performance Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Cloudflare Optimizations
- **Auto Minify**: HTML, CSS, JS
- **Brotli Compression**: Enabled
- **HTTP/2**: Enabled
- **Early Hints**: Enabled for faster resource loading

## 📱 PWA Features

### Service Worker (Future Enhancement)
```javascript
// Consider adding service worker for:
// - Offline functionality
// - Push notifications
// - App-like experience
```

### Manifest.json
Already configured for basic PWA functionality:
- App icons
- Theme colors
- Display mode

## 🔄 Updates & Maintenance

### Regular Tasks
1. **Monitor performance** via Cloudflare Analytics
2. **Update dependencies** in Worker if using external packages
3. **Review security headers** and update as needed
4. **Test form submissions** monthly
5. **Monitor Core Web Vitals** via PageSpeed Insights

### Version Control
```bash
# Tag releases for better tracking
git tag -a v1.0.0 -m "Initial Cloudflare Pages deployment"
git push origin v1.0.0
```

---

## 📞 Support

For deployment issues:
- Check Cloudflare Pages documentation
- Review Worker logs in Wrangler
- Monitor Cloudflare Dashboard for alerts

For custom modifications or advanced features, contact the development team.

---

**Last Updated**: September 2025  
**Version**: 1.0  
**Environment**: Production ready for Cloudflare Pages