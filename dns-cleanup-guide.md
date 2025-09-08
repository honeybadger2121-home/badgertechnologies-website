# DNS Cleanup Guide for badgertechnologies.us

## Current DNS Issues

### Problem 1: Conflicting Root Domain Records
You currently have:
```
A record:     badgertechnologies.us → 75.2.60.5
ANAME record: badgertechnologies.us → delicate-gecko-e525fb.netlify.app
```

This creates conflicts. You need to choose ONE approach.

### Problem 2: Wrong Netlify Site Reference
Your ANAME points to `delicate-gecko-e525fb.netlify.app` but you want `badgertechnologiesllc.netlify.app`.

## Recommended Fix

### Step 1: Update ANAME Record in Name.com
1. Log into Name.com
2. Go to DNS Records for badgertechnologies.us  
3. Find the ANAME record that points to `delicate-gecko-e525fb.netlify.app`
4. **Change it to:** `badgertechnologiesllc.netlify.app`
5. Keep TTL at 3600

### Step 2: Remove Conflicting A Record (Optional)
Since you have ANAME, you can remove the A record:
- **Delete:** `A,badgertechnologies.us,75.2.60.5,300,`

### Step 3: Keep Everything Else
Your other records look great:
- ✅ Google Workspace MX records
- ✅ SPF/DMARC email authentication  
- ✅ Professional subdomains
- ✅ Security TXT records

## Alternative Approach (If ANAME doesn't work)

### If ANAME Record Causes Issues:
1. **Delete** the ANAME record
2. **Keep** the A record: `badgertechnologies.us → 75.2.60.5`
3. **Add** www CNAME: `www.badgertechnologies.us → badgertechnologiesllc.netlify.app`

## Why You Can't Add Root Domain CNAME

### DNS Rules:
- ❌ **Can't have:** CNAME for root domain (`@` or `badgertechnologies.us`)
- ❌ **Can't mix:** CNAME with other record types for same name
- ✅ **Can have:** CNAME for subdomains (`www`, `mail`, etc.)
- ✅ **Can have:** ANAME as alternative to CNAME for root

## Your Current Good Records (Keep These):

### Email Setup (Perfect!):
```
MX: aspmx.l.google.com (Priority 1)
MX: alt1.aspmx.l.google.com (Priority 5)
TXT: "v=spf1 include:_spf.google.com ~all"
TXT: "v=DMARC1; p=quarantine; rua=mailto:admin@badgertechnologies.us..."
DKIM: google._domainkey with proper key
```

### Professional Subdomains (Great!):
```
CNAME: www.badgertechnologies.us → badgertechnologies.us
CNAME: mail.badgertechnologies.us → badgertechnologies.us
CNAME: support.badgertechnologies.us → badgertechnologies.us
CNAME: secure.badgertechnologies.us → badgertechnologies.us
```

### Security Records (Excellent!):
```
TXT: ca-policy=letsencrypt-authorized
TXT: security-contact=security@badgertechnologies.us
TXT: certificate-transparency=enabled
TXT: business-type=technology-consulting
```

## Action Items

### Immediate Fix:
1. **Change ANAME record** from `delicate-gecko-e525fb.netlify.app` to `badgertechnologiesllc.netlify.app`
2. **Wait 15-30 minutes** for propagation
3. **Test:** Visit https://badgertechnologies.us

### If That Doesn't Work:
1. **Delete ANAME record**  
2. **Keep A record** pointing to `75.2.60.5`
3. **Ensure www CNAME** points to your Netlify site

## Verification Commands

After making changes, run:
```powershell
# Check root domain resolution
nslookup badgertechnologies.us

# Check www subdomain  
nslookup www.badgertechnologies.us

# Test website loading
Start-Process "https://badgertechnologies.us"
```

## Expected Results

After the fix:
- ✅ `badgertechnologies.us` loads your Netlify site
- ✅ Address bar shows `badgertechnologies.us` 
- ✅ `badgertechnologiesllc.netlify.app` redirects to custom domain
- ✅ All subdomains work properly
- ✅ Email continues to work with Google Workspace

The key issue is just updating that one ANAME record to point to the correct Netlify site!
