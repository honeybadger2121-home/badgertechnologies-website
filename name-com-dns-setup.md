# Name.com DNS Configuration Guide for badgertechnologies.us
# Step-by-step instructions for Name.com DNS Manager

## Accessing Name.com DNS Manager
1. Log into your Name.com account
2. Go to "My Domains" 
3. Click on "badgertechnologies.us"
4. Click "DNS Records" tab

## Phase 1: Essential Records (High Priority)

### 1. Email Authentication Records (CRITICAL)

#### Add SPF Record:
- **Record Type**: TXT
- **Host**: @ (or leave blank)
- **Answer**: `v=spf1 include:_spf.google.com ~all`
- **TTL**: 3600 (1 hour)

#### Add DMARC Record:
- **Record Type**: TXT  
- **Host**: _dmarc
- **Answer**: `v=DMARC1; p=quarantine; rua=mailto:dmarc@badgertechnologies.us; fo=1`
- **TTL**: 3600

#### Add DKIM Record (if using Google Workspace/Gmail):
- **Record Type**: TXT
- **Host**: google._domainkey
- **Answer**: `v=DKIM1; k=rsa; p=[get this from Google Admin Console]`
- **TTL**: 3600

### 2. Professional Email Setup

#### For Google Workspace MX Records:
- **Record Type**: MX | **Host**: @ | **Answer**: smtp.google.com | **Priority**: 1 | **TTL**: 3600
- **Record Type**: MX | **Host**: @ | **Answer**: alt1.smtp.google.com | **Priority**: 5 | **TTL**: 3600
- **Record Type**: MX | **Host**: @ | **Answer**: alt2.smtp.google.com | **Priority**: 5 | **TTL**: 3600
- **Record Type**: MX | **Host**: @ | **Answer**: alt3.smtp.google.com | **Priority**: 10 | **TTL**: 3600
- **Record Type**: MX | **Host**: @ | **Answer**: alt4.smtp.google.com | **Priority**: 10 | **TTL**: 3600

### 3. Security Records (Name.com Compatible)

#### Certificate Security TXT Records (Alternative to CAA):
Since Name.com doesn't support CAA records, use these TXT records instead:

- **Record Type**: TXT | **Host**: @ | **Answer**: `ca-policy=letsencrypt-authorized` | **TTL**: 3600
- **Record Type**: TXT | **Host**: @ | **Answer**: `security-contact=security@badgertechnologies.us` | **TTL**: 3600
- **Record Type**: TXT | **Host**: @ | **Answer**: `certificate-transparency=enabled` | **TTL**: 3600
- **Record Type**: TXT | **Host**: @ | **Answer**: `ssl-policy=strict-transport-security` | **TTL**: 3600

## Phase 2: Professional Subdomains

### Business Subdomains (shows active operations):
- **Record Type**: CNAME | **Host**: mail | **Answer**: badgertechnologies.us | **TTL**: 3600
- **Record Type**: CNAME | **Host**: support | **Answer**: badgertechnologies.us | **TTL**: 3600  
- **Record Type**: CNAME | **Host**: secure | **Answer**: badgertechnologies.us | **TTL**: 3600
- **Record Type**: CNAME | **Host**: portal | **Answer**: badgertechnologies.us | **TTL**: 3600
- **Record Type**: CNAME | **Host**: remote | **Answer**: badgertechnologies.us | **TTL**: 3600

## Phase 3: Verification Records

### Search Engine Verification:
- **Record Type**: TXT | **Host**: @ | **Answer**: `google-site-verification=your-verification-code` | **TTL**: 3600
- **Record Type**: TXT | **Host**: @ | **Answer**: `MS=your-bing-verification-code` | **TTL**: 3600

### Business Verification:
- **Record Type**: TXT | **Host**: @ | **Answer**: `v=businessinfo; contact=info@badgertechnologies.us; phone=+18153676989` | **TTL**: 3600

## Name.com Specific Tips

### 1. TTL Settings in Name.com:
- **300** = 5 minutes (avoid - looks suspicious)
- **3600** = 1 hour (recommended for most records)
- **86400** = 24 hours (good for stable records)

### 2. Host Field Rules:
- Use **@** for root domain records
- Use **www** for www subdomain
- Use **_dmarc** for DMARC records
- Use **google._domainkey** for DKIM

### 3. Record Priority:
- Lower numbers = higher priority for MX records
- Use priorities: 1, 5, 5, 10, 10 for Google Workspace

## Current DNS Status Check Commands

Run these to verify your current Name.com DNS setup:

```powershell
# Check your current records
nslookup -type=A badgertechnologies.us
nslookup -type=MX badgertechnologies.us
nslookup -type=TXT badgertechnologies.us
nslookup -type=TXT _dmarc.badgertechnologies.us
```

## Name.com DNS Propagation

### Typical propagation times:
- **A/CNAME records**: 15-30 minutes
- **MX records**: 30-60 minutes  
- **TXT records**: 15-45 minutes
- **Global propagation**: 24-48 hours

### Check propagation status:
- Use whatsmydns.net
- Use dnschecker.org
- Test from multiple locations

## Email Provider Setup

### If using Google Workspace:
1. Set up MX records (above)
2. Get DKIM key from Google Admin Console → Apps → Google Workspace → Gmail → Authenticate email
3. Add DKIM TXT record with the provided key

### If using Microsoft 365:
1. **MX Record**: `badgertechnologies-us.mail.protection.outlook.com` (Priority: 0)
2. Get DKIM keys from Microsoft 365 Admin Center
3. Add CNAME records for DKIM selectors

## Advanced Reputation Features

### SRV Records for Microsoft Teams/Business Phone:
- **Record Type**: SRV | **Host**: _sip._tls | **Answer**: `100 1 443 sipdir.online.lync.com` | **TTL**: 3600
- **Record Type**: SRV | **Host**: _sipfederationtls._tcp | **Answer**: `100 1 5061 sipfed.online.lync.com` | **TTL**: 3600

## Implementation Checklist

### Week 1:
- [ ] Add SPF record
- [ ] Add DMARC record  
- [ ] Configure MX records
- [ ] Add CAA records
- [ ] Create professional subdomains

### Week 2:
- [ ] Add DKIM record (after email provider setup)
- [ ] Add search engine verification records
- [ ] Test email deliverability
- [ ] Monitor DNS propagation

### Ongoing:
- [ ] Monitor DMARC reports
- [ ] Check domain reputation scores
- [ ] Add SRV records if needed
- [ ] Regular DNS health checks

## Troubleshooting Common Name.com Issues

### 1. Record not propagating:
- Check TTL settings (use 3600 or higher)
- Verify syntax in Answer field
- Clear DNS cache: `ipconfig /flushdns`

### 2. Email authentication failing:
- Verify SPF syntax with SPF checker tools
- Check DMARC alignment
- Ensure DKIM selector matches provider

### 3. CAA records not working:
- Name.com format: `0 issue "letsencrypt.org"`
- Don't include quotes in some interfaces
- Test with CAA checker tools

## Expected Results Timeline

### 24-48 hours:
- DNS records fully propagated
- Basic legitimacy signals active

### 1-2 weeks:  
- Email reputation improving
- Security scanners recognizing proper setup

### 30-90 days:
- Domain reputation significantly improved
- May be removed from "newly registered" blocks

This comprehensive DNS setup will make your domain appear much more established and legitimate to security systems like WatchGuard.
