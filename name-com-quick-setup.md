# Name.com Quick Setup - Critical DNS Records for badgertechnologies.us

## PRIORITY 1: Email Authentication (Add these FIRST)

### SPF Record (Prevents email spoofing)
- Type: TXT
- Host: @
- Answer: v=spf1 include:_spf.google.com ~all
- TTL: 3600

### DMARC Record (Email security policy)  
- Type: TXT
- Host: _dmarc
- Answer: v=DMARC1; p=quarantine; rua=mailto:dmarc@badgertechnologies.us; fo=1
- TTL: 3600

## PRIORITY 2: Professional Email (Choose one)

### Google Workspace MX Records:
- Type: MX | Host: @ | Answer: smtp.google.com | Priority: 1 | TTL: 3600
- Type: MX | Host: @ | Answer: alt1.smtp.google.com | Priority: 5 | TTL: 3600
- Type: MX | Host: @ | Answer: alt2.smtp.google.com | Priority: 5 | TTL: 3600

### OR Microsoft 365 MX Record:
- Type: MX | Host: @ | Answer: badgertechnologies-us.mail.protection.outlook.com | Priority: 0 | TTL: 3600

## PRIORITY 3: Security Records

### CAA Records (Shows certificate security):
- Type: CAA | Host: @ | Answer: 0 issue "letsencrypt.org" | TTL: 3600
- Type: CAA | Host: @ | Answer: 0 iodef "mailto:security@badgertechnologies.us" | TTL: 3600

## PRIORITY 4: Professional Subdomains

### Business subdomains (shows active operations):
- Type: CNAME | Host: mail | Answer: badgertechnologies.us | TTL: 3600
- Type: CNAME | Host: support | Answer: badgertechnologies.us | TTL: 3600
- Type: CNAME | Host: secure | Answer: badgertechnologies.us | TTL: 3600

## After Setup - Verification Commands:
```powershell
# Run this PowerShell script to verify:
.\check-dns.ps1

# Or check individual records:
nslookup -type=TXT badgertechnologies.us
nslookup -type=MX badgertechnologies.us
```

## Expected Impact Timeline:
- 24-48 hours: DNS propagation complete
- 1-2 weeks: Email reputation improvement
- 30-90 days: Domain reputation significantly improved

Start with Priority 1 records - these have the biggest impact on domain reputation!
