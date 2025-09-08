# Cloudflare DNS Migration Guide for badgertechnologies.us

## Phase 1: Cloudflare Account Setup

### Step 1: Create Cloudflare Account
1. Go to https://dash.cloudflare.com/sign-up
2. Create account with your email
3. Choose Free plan (sufficient for most needs)

### Step 2: Add Domain to Cloudflare
1. Click "Add a site" 
2. Enter: `badgertechnologies.us`
3. Click "Add site"
4. Choose "Free" plan
5. Click "Continue"

### Step 3: Cloudflare Will Scan Your DNS
Cloudflare will automatically detect most of your current records. We'll verify and add missing ones.

## Phase 2: DNS Records Configuration in Cloudflare

### A Records
```
Type: A | Name: @ | Content: 75.2.60.5 | Proxy: Orange Cloud (Proxied) | TTL: Auto
```

### AAAA Records  
```
Type: AAAA | Name: @ | Content: 2600:1f18:16e:df01::258 | Proxy: Orange Cloud (Proxied) | TTL: Auto
```

### CNAME Records
```
Type: CNAME | Name: www | Content: badgertechnologies.us | Proxy: Orange Cloud (Proxied) | TTL: Auto
Type: CNAME | Name: alias | Content: apex-loadbalancer.netlify.com | Proxy: DNS Only (Gray) | TTL: Auto
Type: CNAME | Name: mail | Content: badgertechnologies.us | Proxy: DNS Only (Gray) | TTL: Auto
Type: CNAME | Name: portal | Content: badgertechnologies.us | Proxy: DNS Only (Gray) | TTL: Auto
Type: CNAME | Name: remote | Content: badgertechnologies.us | Proxy: DNS Only (Gray) | TTL: Auto
Type: CNAME | Name: secure | Content: badgertechnologies.us | Proxy: DNS Only (Gray) | TTL: Auto
Type: CNAME | Name: support | Content: badgertechnologies.us | Proxy: DNS Only (Gray) | TTL: Auto
```

### MX Records (Google Workspace)
```
Type: MX | Name: @ | Content: aspmx.l.google.com | Priority: 1 | TTL: Auto
Type: MX | Name: @ | Content: alt1.aspmx.l.google.com | Priority: 5 | TTL: Auto  
Type: MX | Name: @ | Content: alt2.aspmx.l.google.com | Priority: 5 | TTL: Auto
Type: MX | Name: @ | Content: alt3.aspmx.l.google.com | Priority: 10 | TTL: Auto
Type: MX | Name: @ | Content: alt4.aspmx.l.google.com | Priority: 10 | TTL: Auto
```

### TXT Records
```
Type: TXT | Name: @ | Content: "v=spf1 include:_spf.google.com ~all" | TTL: Auto
Type: TXT | Name: @ | Content: "v=caa1 issue letsencrypt.org" | TTL: Auto
Type: TXT | Name: @ | Content: "v=verification badger-technologies-2025" | TTL: Auto
Type: TXT | Name: @ | Content: business-type=technology-consulting | TTL: Auto
Type: TXT | Name: @ | Content: ca-policy=letsencrypt-authorized | TTL: Auto
Type: TXT | Name: @ | Content: certificate-transparency=enabled | TTL: Auto
Type: TXT | Name: @ | Content: established=2025 | TTL: Auto
Type: TXT | Name: @ | Content: industry=information-technology | TTL: Auto
Type: TXT | Name: @ | Content: security-contact=security@badgertechnologies.us | TTL: Auto
Type: TXT | Name: @ | Content: "services=cybersecurity,managed-it,cloud-solution" | TTL: Auto
Type: TXT | Name: @ | Content: ssl-policy=strict-transport-security | TTL: Auto
Type: TXT | Name: @ | Content: google-site-verification=-8cqIK3K1-oJYa7O3pcEuS7cPDt7oOv691q4C2s49yw | TTL: Auto
Type: TXT | Name: @ | Content: google-site-verification=8Qk_zp70UR53rdQMZhsBXX-v5IkXosxNIo8vvqWo5gc | TTL: Auto
Type: TXT | Name: @ | Content: google-site-verification=O9G17_7TphijVZhNvlT3fZh9q88klahPkUM6FWbnf8c | TTL: Auto
```

### DKIM Record
```
Type: TXT | Name: google._domainkey | Content: "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp5QI3BI9FjaXJ8Qj3rrztEI9dWFTdKAIhB4t1ByBvmwX8Jz6Jo8G0RrQA0HzfF7tBwDeXlcQcp8bLJyqht4WWgxeNpVR9wsxGbD/U6XZKn+AtODeFPoUCuIcNKVJ6Km+2ds6R+9Rt37HAVjxaHrJng/3v2JEvrEnwgskAz4lN4ampajEPX6IPJCvMNJaipLDnv45wXWgA7g1spkVXL7Qsg07BIAxeAe+tsrlvNBfC7zZ3u+Y+QUAnOzFaD7XUbJhXD+BKbJBKTiBc5QFQ11HoPMdFbVWiEl+uYRvqHj5pb2WkadjTJ6Jm1eDv/B/FVwmL1/1tDDS7yN5Y/zvvclEgQIDAQAB" | TTL: Auto
```

### DMARC Record
```
Type: TXT | Name: _dmarc | Content: "v=DMARC1; p=quarantine; rua=mailto:admin@badgertechnologies.us; ruf=mailto:admin@badgertechnologies.us; sp=quarantine; adkim=r; aspf=r; fo=1" | TTL: Auto
```

### SRV Record
```
Type: SRV | Name: _https._tcp | Content: 0 1 443 badgertechnologies.us | TTL: Auto
```

### CAA Records (Real CAA support in Cloudflare!)
```
Type: CAA | Name: @ | Content: 0 issue "letsencrypt.org" | TTL: Auto
Type: CAA | Name: @ | Content: 0 issue "digicert.com" | TTL: Auto
Type: CAA | Name: @ | Content: 0 iodef "mailto:security@badgertechnologies.us" | TTL: Auto
```

## Phase 3: Cloudflare Nameserver Configuration

### Cloudflare Nameservers (You'll Get These After Adding Your Domain)
Cloudflare will provide you with nameservers like:
```
ns1.cloudflare.com
ns2.cloudflare.com
```

### Update Nameservers at Name.com
1. Log into Name.com
2. Go to **My Domains** → **badgertechnologies.us**
3. Click **Nameservers** tab
4. Select **Custom DNS**
5. Replace with Cloudflare nameservers:
   - Primary: `ns1.cloudflare.com` (example - use your actual ones)
   - Secondary: `ns2.cloudflare.com` (example - use your actual ones)
6. Save changes

## Phase 4: Cloudflare Security & Performance Settings

### SSL/TLS Settings
1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode: **Full (strict)**
3. Enable **Always Use HTTPS**

### Security Settings
1. Go to **Security** → **Settings**
2. Set Security Level: **Medium**
3. Enable **Bot Fight Mode**
4. Enable **Email Obfuscation**

### Performance Settings  
1. Go to **Speed** → **Optimization**
2. Enable **Auto Minify** (CSS, JS, HTML)
3. Enable **Brotli** compression
4. Set **Browser Cache TTL**: 1 month

### Page Rules (Optional)
1. Go to **Rules** → **Page Rules**
2. Create rule: `badgertechnologies.us/*`
   - Setting: **Always Use HTTPS**
3. Create rule: `www.badgertechnologies.us/*`
   - Setting: **Forwarding URL** (301 redirect)
   - Destination: `https://badgertechnologies.us/$1`

## Phase 5: Verification & Testing

### DNS Propagation Check
```powershell
# Check nameservers
nslookup -type=NS badgertechnologies.us

# Check A record
nslookup badgertechnologies.us

# Check MX records
nslookup -type=MX badgertechnologies.us

# Check TXT records
nslookup -type=TXT badgertechnologies.us
```

### Website Testing
1. Visit https://badgertechnologies.us
2. Check SSL certificate (should show Cloudflare)
3. Test email functionality
4. Verify all subdomains work

## Benefits of Cloudflare Migration

### Performance
- ✅ Global CDN network
- ✅ Automatic image optimization
- ✅ Minification and compression
- ✅ Faster DNS resolution

### Security
- ✅ DDoS protection
- ✅ Web Application Firewall (WAF)
- ✅ Bot protection
- ✅ SSL certificate management

### Features
- ✅ Real CAA record support
- ✅ Advanced DNS management
- ✅ Analytics and insights
- ✅ Page rules and redirects

## Timeline

### Immediate (0-5 minutes):
- Cloudflare account setup
- Domain addition to Cloudflare

### Short term (15-30 minutes):
- DNS record configuration
- Nameserver changes at Name.com

### Medium term (2-24 hours):
- DNS propagation worldwide
- SSL certificate provisioning

### Long term (24-48 hours):
- Complete global propagation
- All services fully operational

## Rollback Plan (If Needed)

If issues occur, you can rollback:
1. Go to Name.com nameserver settings
2. Change back to Name.com nameservers:
   - `dns1.name.com`
   - `dns2.name.com`
   - `dns3.name.com`
   - `dns4.name.com`
3. Wait 24-48 hours for propagation

## Important Notes

- Keep domain registration at Name.com (only DNS changes)
- Cloudflare Free plan includes most features you need
- Orange cloud = Proxied through Cloudflare (CDN + security)
- Gray cloud = DNS only (direct to your server)
- Email records should be gray cloud (DNS only)
