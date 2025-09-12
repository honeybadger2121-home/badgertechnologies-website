# Cloudflare DNS Configuration for Badger Technologies
# Optimal DNS setup for Cloudflare Pages deployment

## REQUIRED CHANGES FOR CLOUDFLARE PAGES

### 1. REMOVE NETLIFY REMNANTS (CRITICAL)
```
# DELETE THIS RECORD:
alias.badgertechnologies.us. CNAME apex-loadbalancer.netlify.com.
```

### 2. ADD APEX DOMAIN RECORDS
```
# ADD THESE A RECORDS (replace the alias CNAME):
badgertechnologies.us. A 192.0.2.1  # Cloudflare proxy placeholder
# OR use CNAME to your Pages domain:
badgertechnologies.us. CNAME badgertechnologies.pages.dev.
```

### 3. VERIFY CLOUDFLARE PAGES CUSTOM DOMAIN
In Cloudflare Pages dashboard:
- Go to your project → Custom domains
- Add: badgertechnologies.us
- Add: www.badgertechnologies.us
- Cloudflare will automatically configure the DNS

## CURRENT DNS AUDIT

### ✅ CORRECT RECORDS (Keep these)
```
# Name servers - CORRECT
badgertechnologies.us. NS anton.ns.cloudflare.com.
badgertechnologies.us. NS fatima.ns.cloudflare.com.

# Google Workspace email - CORRECT
badgertechnologies.us. MX 1 aspmx.l.google.com.
badgertechnologies.us. MX 5 alt1.aspmx.l.google.com.
badgertechnologies.us. MX 5 alt2.aspmx.l.google.com.
badgertechnologies.us. MX 10 alt3.aspmx.l.google.com.
badgertechnologies.us. MX 10 alt4.aspmx.l.google.com.

# DKIM for Google Workspace - CORRECT
google._domainkey.badgertechnologies.us. TXT "v=DKIM1; k=rsa; p=..."

# Google Site Verification - CORRECT (consolidate to one)
badgertechnologies.us. TXT "google-site-verification=O9G17_7TphijVZhNvlT3fZh9q88klahPkUM6FWbnf8c"
```

### ⚠️ NEEDS FIXING
```
# CONFLICTING SPF RECORDS - CONSOLIDATE TO ONE:
# REMOVE: "v=spf1 -all"
# KEEP: "v=spf1 include:_spf.google.com ~all"

# DMARC CONFLICTS - CONSOLIDATE:
# Remove the duplicate DMARC record, keep the more comprehensive one

# CAA RECORDS - UPDATE FOR CLOUDFLARE:
badgertechnologies.us. CAA 0 issue "digicert.com"
badgertechnologies.us. CAA 0 issue "letsencrypt.org"
badgertechnologies.us. CAA 0 issue "cloudflare.com"  # ADD THIS
```

### 🗑️ REMOVE UNNECESSARY RECORDS
```
# Remove redundant TXT records:
- "ssl-policy=strict-transport-security"  # Handled by Cloudflare
- "certificate-transparency=enabled"      # Handled by Cloudflare
- "v=caa1 issue letsencrypt.org"         # Duplicate of CAA record
- Duplicate Google verification records
- Custom business metadata TXT records (optional cleanup)
```

## OPTIMIZED DNS CONFIGURATION

### A/AAAA Records (Primary)
```
badgertechnologies.us.     A     192.0.2.1        # Cloudflare proxy
www.badgertechnologies.us. CNAME badgertechnologies.us.
```

### Subdomains (Keep current structure)
```
mail.badgertechnologies.us.    CNAME badgertechnologies.us.
portal.badgertechnologies.us.  CNAME badgertechnologies.us.
remote.badgertechnologies.us.  CNAME badgertechnologies.us.
secure.badgertechnologies.us.  CNAME badgertechnologies.us.
support.badgertechnologies.us. CNAME badgertechnologies.us.
```

### Email Records (Keep as-is)
```
# MX Records - Google Workspace
badgertechnologies.us. MX 1  aspmx.l.google.com.
badgertechnologies.us. MX 5  alt1.aspmx.l.google.com.
badgertechnologies.us. MX 5  alt2.aspmx.l.google.com.
badgertechnologies.us. MX 10 alt3.aspmx.l.google.com.
badgertechnologies.us. MX 10 alt4.aspmx.l.google.com.

# SPF Record (Consolidated)
badgertechnologies.us. TXT "v=spf1 include:_spf.google.com ~all"

# DMARC (Single record)
_dmarc.badgertechnologies.us. TXT "v=DMARC1; p=quarantine; rua=mailto:a1e46bc8b26544c48d2e6eff4135e8a9@dmarc-reports.cloudflare.net,mailto:admin@badgertechnologies.us; ruf=mailto:admin@badgertechnologies.us; sp=quarantine; adkim=r; aspf=r; fo=1"

# DKIM (Keep existing)
google._domainkey.badgertechnologies.us. TXT "v=DKIM1; k=rsa; p=..."
```

### Security Records
```
# CAA Records (Certificate Authority Authorization)
badgertechnologies.us. CAA 0 issue "digicert.com"
badgertechnologies.us. CAA 0 issue "letsencrypt.org"
badgertechnologies.us. CAA 0 issue "cloudflare.com"
badgertechnologies.us. CAA 0 iodef "mailto:security@badgertechnologies.us"
```

### Essential TXT Records
```
# Google Site Verification (keep one)
badgertechnologies.us. TXT "google-site-verification=O9G17_7TphijVZhNvlT3fZh9q88klahPkUM6FWbnf8c"

# Security contact
badgertechnologies.us. TXT "security-contact=security@badgertechnologies.us"
```

## IMPLEMENTATION STEPS

### Step 1: Configure Cloudflare Pages Custom Domain
1. Go to Cloudflare Pages dashboard
2. Select your project
3. Go to Custom domains
4. Add: `badgertechnologies.us`
5. Add: `www.badgertechnologies.us`
6. Let Cloudflare auto-configure DNS

### Step 2: Clean up DNS records
1. Remove Netlify alias CNAME
2. Consolidate SPF records
3. Remove duplicate DMARC
4. Clean up redundant TXT records

### Step 3: Verify configuration
1. Test domain resolution: `nslookup badgertechnologies.us`
2. Test SSL: `curl -I https://badgertechnologies.us`
3. Test email: Send test email
4. Check DNS propagation: whatsmydns.net

## VERIFICATION COMMANDS

```bash
# Test DNS resolution
nslookup badgertechnologies.us
nslookup www.badgertechnologies.us

# Test SSL certificate
openssl s_client -connect badgertechnologies.us:443 -servername badgertechnologies.us

# Test email configuration
dig MX badgertechnologies.us
dig TXT badgertechnologies.us

# Test SPF/DMARC
dig TXT _dmarc.badgertechnologies.us
```

## MONITORING

### Regular checks:
- SSL certificate auto-renewal
- DNS propagation status
- Email deliverability
- Site availability from multiple locations

---

**Priority**: Fix the Netlify alias CNAME immediately to prevent routing conflicts with Cloudflare Pages.