# DNS Configuration for Domain Reputation - badgertechnologies.us

## Core DNS Records for Legitimacy

### 1. Basic Website Records
```
A record:     @           -> [your-server-ip]
A record:     www         -> [your-server-ip]
CNAME:        www         -> badgertechnologies.us
```

### 2. Email Authentication Records (CRITICAL for reputation)

#### SPF Record - Prevents email spoofing
```
Type: TXT
Name: @
Value: "v=spf1 include:_spf.google.com include:spf.protection.outlook.com ~all"
TTL: 3600
```

#### DMARC Record - Email security policy
```
Type: TXT  
Name: _dmarc
Value: "v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@badgertechnologies.us; ruf=mailto:dmarc-failures@badgertechnologies.us; fo=1"
TTL: 3600
```

#### DKIM Record - Email signing (get from your email provider)
```
Type: TXT
Name: selector1._domainkey
Value: "v=DKIM1; k=rsa; p=[your-public-key-from-email-provider]"
TTL: 3600
```

### 3. Professional Email Setup (MX Records)

#### For Google Workspace:
```
Type: MX
Priority: 1    Value: smtp.google.com
Priority: 5    Value: alt1.smtp.google.com  
Priority: 5    Value: alt2.smtp.google.com
Priority: 10   Value: alt3.smtp.google.com
Priority: 10   Value: alt4.smtp.google.com
TTL: 3600
```

#### For Microsoft 365:
```
Type: MX
Priority: 0    Value: badgertechnologies-us.mail.protection.outlook.com
TTL: 3600
```

### 4. Security Records (Shows enterprise-level security)

#### CAA Records - Certificate Authority Authorization  
```
Type: CAA
Name: @
Value: 0 issue "letsencrypt.org"
TTL: 3600

Type: CAA
Name: @  
Value: 0 issue "digicert.com"
TTL: 3600

Type: CAA
Name: @
Value: 0 iodef "mailto:security@badgertechnologies.us"
TTL: 3600
```

### 5. Service Records (Shows active services)

#### SIP/VoIP Records (if you have business phone service)
```
Type: SRV
Name: _sip._tcp
Value: 10 5 5060 sip.provider.com
TTL: 3600
```

#### Microsoft Teams/Skype for Business
```
Type: SRV
Name: _sip._tls
Value: 100 1 443 sipdir.online.lync.com
TTL: 3600

Type: SRV  
Name: _sipfederationtls._tcp
Value: 100 1 5061 sipfed.online.lync.com
TTL: 3600
```

### 6. Additional Legitimacy Records

#### Subdomain for services (shows active business operations)
```
Type: A
Name: mail        Value: [your-server-ip]
Name: ftp         Value: [your-server-ip]  
Name: remote      Value: [your-server-ip]
Name: support     Value: [your-server-ip]
Name: portal      Value: [your-server-ip]
Name: secure      Value: [your-server-ip]
```

#### TXT Records for verification and policies
```
Type: TXT
Name: @
Value: "google-site-verification=your-google-verification-code"
TTL: 3600

Type: TXT
Name: @  
Value: "MS=ms-verification-code"
TTL: 3600

Type: TXT
Name: @
Value: "v=verifyme; contact=admin@badgertechnologies.us"
TTL: 3600
```

## DNS Configuration Best Practices

### 1. Use Professional DNS Providers
- Cloudflare (free tier available)
- Route 53 (AWS)
- Google Cloud DNS
- Azure DNS

### 2. TTL Settings for Reputation
- Use longer TTLs (3600-86400) to show stability
- Avoid very short TTLs (under 300) which look suspicious

### 3. Consistent Naming Convention
- Use professional subdomain names
- Avoid random or suspicious-looking subdomains
- Follow industry standards

## Implementation Priority

### Phase 1 (Immediate - High Impact):
1. SPF Record ⭐⭐⭐
2. DMARC Record ⭐⭐⭐  
3. MX Records ⭐⭐⭐
4. CAA Records ⭐⭐

### Phase 2 (Within 1 week):
1. DKIM Record ⭐⭐⭐
2. Professional subdomains ⭐⭐
3. Google/Bing verification records ⭐⭐

### Phase 3 (Ongoing):
1. Service-specific SRV records ⭐
2. Additional TXT records ⭐

## Monitoring Your DNS Reputation

### Tools to check DNS health:
- MXToolbox.com - Comprehensive DNS checker
- DNSChecker.org - Global DNS propagation
- SecurityTrails.com - DNS history and reputation
- WhatsMyDNS.net - Global DNS lookup

### Email reputation tools:
- mail-tester.com - Email deliverability test
- Google Postmaster Tools
- Microsoft SNDS

## Expected Timeline
- **24-48 hours**: DNS propagation complete
- **1-2 weeks**: Email reputation improvement  
- **2-4 weeks**: General domain reputation boost
- **30-90 days**: Security services may re-evaluate domain

Note: The combination of proper email authentication, professional DNS setup, and legitimate business records significantly improves how security systems perceive your domain.
