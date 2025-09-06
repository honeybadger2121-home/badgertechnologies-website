# Google Workspace DNS Configuration for badgertechnologies.us

## Current Status
✅ **MX Records**: Correctly configured for Google Workspace
✅ **Domain Verification**: Google verification records are present

## Missing Required Records

### 1. SPF Record (Email Authentication)
**Type:** TXT
**Host:** badgertechnologies.us
**Value:** `v=spf1 include:_spf.google.com ~all`
**TTL:** 3600

### 2. DKIM Record (Email Signing)
You'll need to get this from your Google Admin Console:
1. Go to Google Admin Console → Apps → Google Workspace → Gmail → Authenticate email
2. Generate DKIM key for your domain
3. Add the provided TXT record (usually looks like):
**Type:** TXT
**Host:** google._domainkey.badgertechnologies.us
**Value:** (Long key provided by Google)
**TTL:** 3600

### 3. Calendar Auto-Discovery (Optional but Recommended)
**Type:** CNAME
**Host:** calendar.badgertechnologies.us
**Value:** ghs.googlehosted.com
**TTL:** 3600

### 4. Drive Auto-Discovery (Optional but Recommended)
**Type:** CNAME
**Host:** drive.badgertechnologies.us
**Value:** ghs.googlehosted.com
**TTL:** 3600

### 5. Sites Auto-Discovery (Optional)
**Type:** CNAME
**Host:** sites.badgertechnologies.us
**Value:** ghs.googlehosted.com
**TTL:** 3600

## Current DMARC Policy Review
Your current DMARC record: `v=DMARC1; p=quarantine; rua=mailto:dmarc@badgertechnologies.us; ruf=mailto:dmarc@badgertechnologies.us; sp=quarantine; adkim=r; aspf=r;`

**Recommendation:** This is good, but you should update the email addresses to valid Google Workspace addresses once you have them set up.

## Priority Actions Needed

### Immediate (Required):
1. **Add SPF record** for email authentication
2. **Set up DKIM** in Google Admin Console and add the DNS record
3. **Update DMARC email addresses** to use your @badgertechnologies.us addresses

### Optional (Recommended):
4. Add CNAME records for Google services auto-discovery
5. Consider adding Google Site Verification for additional services

## Email Setup Instructions

1. **Access Google Admin Console** at admin.google.com
2. **Verify domain ownership** (already done based on your verification records)
3. **Set up DKIM authentication**:
   - Apps → Google Workspace → Gmail → Authenticate email
   - Select your domain → Generate new record
   - Add the provided DNS record to your domain
4. **Test email flow** once SPF and DKIM are configured

## DNS Health Check
After adding the missing records, use these tools to verify:
- **MX Toolbox**: mxtoolbox.com/SuperTool.aspx
- **Google Admin Console**: Built-in DNS verification
- **Mail Tester**: mail-tester.com

## Contact Information
If you need help with the Google Admin Console setup:
- Google Workspace Support: support.google.com
- Your domain registrar (Name.com) support for DNS changes
