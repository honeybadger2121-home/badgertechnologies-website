# Netlify Custom Domain Setup for badgertechnologies.us

## Step 1: Configure Netlify Site Settings

### In Netlify Dashboard:
1. Go to https://app.netlify.com/
2. Click on your "badgertechnologiesllc" site
3. Go to **Site settings** → **Domain management**
4. Click **Add custom domain**
5. Enter: `badgertechnologies.us`
6. Click **Verify** and **Add domain**
7. Also add: `www.badgertechnologies.us`

### Enable HTTPS:
1. In the same Domain management section
2. Under **HTTPS**, click **Verify DNS configuration**
3. Once verified, click **Provision certificate**
4. Wait for SSL certificate to be issued (usually 1-2 minutes)

## Step 2: Configure DNS at Name.com

### Primary Domain (badgertechnologies.us):
- **Type**: A
- **Host**: @ (or blank)
- **Answer**: 75.2.60.5
- **TTL**: 3600

### WWW Subdomain:
- **Type**: CNAME  
- **Host**: www
- **Answer**: badgertechnologiesllc.netlify.app
- **TTL**: 3600

### Alternative DNS Setup (CNAME for root):
If Name.com supports CNAME flattening:
- **Type**: CNAME
- **Host**: @
- **Answer**: badgertechnologiesllc.netlify.app
- **TTL**: 3600

## Step 3: Verify Setup

### Test Commands:
```powershell
# Check if domain resolves to Netlify
nslookup badgertechnologies.us

# Check CNAME for www
nslookup www.badgertechnologies.us

# Test HTTPS
curl -I https://badgertechnologies.us
```

## Step 4: DNS Propagation

### Timeline:
- **Name.com propagation**: 15-30 minutes
- **Global propagation**: 24-48 hours
- **SSL certificate**: 1-2 minutes after DNS resolves

### Check propagation:
- https://whatsmydns.net/
- https://dnschecker.org/

## Step 5: Force HTTPS Redirect (Optional)

### In Netlify Site Settings:
1. Go to **Site settings** → **Domain management**
2. Under **HTTPS**, enable:
   - ✅ **Force HTTPS**
   - ✅ **Force redirect www to primary domain** (optional)

## What This Achieves:

### User Experience:
- ✅ `badgertechnologies.us` shows in address bar
- ✅ Site loads from Netlify infrastructure  
- ✅ SSL certificate automatically managed
- ✅ Fast global CDN delivery
- ✅ Professional domain appearance

### Technical Setup:
- Domain registration: Name.com
- DNS management: Name.com  
- Web hosting: Netlify
- SSL certificates: Netlify (Let's Encrypt)

## Troubleshooting

### If domain doesn't resolve:
1. Check DNS records at Name.com
2. Verify A record points to 75.2.60.5
3. Wait for DNS propagation (up to 48 hours)

### If SSL certificate fails:
1. Ensure DNS is fully propagated
2. Check that domain resolves correctly
3. Re-provision certificate in Netlify

### If site shows Netlify subdomain:
1. Clear browser cache
2. Check DNS propagation
3. Verify custom domain is set as primary in Netlify

## Expected Results:

### After setup:
- `badgertechnologies.us` → loads your site, shows custom domain
- `www.badgertechnologies.us` → redirects to main domain  
- `badgertechnologiesllc.netlify.app` → redirects to custom domain
- All traffic uses HTTPS automatically
