# Cloudflare Manual DNS Setup - Step by Step

Since bulk import can have issues, here's how to manually add each record:

## A Records
1. Click **+ Add record**
2. **Type**: A
3. **Name**: @ (or leave blank)
4. **IPv4 address**: 75.2.60.5
5. **Proxy status**: ✅ Proxied (Orange Cloud)
6. **TTL**: Auto
7. Click **Save**

## AAAA Records  
1. **Type**: AAAA
2. **Name**: @ (or leave blank)
3. **IPv6 address**: 2600:1f18:16e:df01::258
4. **Proxy status**: ✅ Proxied (Orange Cloud)
5. Click **Save**

## CNAME Records

### WWW Subdomain
1. **Type**: CNAME
2. **Name**: www
3. **Target**: badgertechnologies.us
4. **Proxy status**: ✅ Proxied (Orange Cloud)
5. Click **Save**

### Other Subdomains (DNS Only)
For each of these, use **🌫️ DNS only (Gray Cloud)**:

**alias subdomain:**
- **Type**: CNAME | **Name**: alias | **Target**: apex-loadbalancer.netlify.com | **Proxy**: DNS only

**mail subdomain:**
- **Type**: CNAME | **Name**: mail | **Target**: badgertechnologies.us | **Proxy**: DNS only

**portal subdomain:**
- **Type**: CNAME | **Name**: portal | **Target**: badgertechnologies.us | **Proxy**: DNS only

**remote subdomain:**
- **Type**: CNAME | **Name**: remote | **Target**: badgertechnologies.us | **Proxy**: DNS only

**secure subdomain:**
- **Type**: CNAME | **Name**: secure | **Target**: badgertechnologies.us | **Proxy**: DNS only

**support subdomain:**
- **Type**: CNAME | **Name**: support | **Target**: badgertechnologies.us | **Proxy**: DNS only

## MX Records (Email - IMPORTANT!)
**⚠️ All MX records must be DNS only (Gray Cloud)**

1. **Type**: MX | **Name**: @ | **Mail server**: aspmx.l.google.com | **Priority**: 1 | **Proxy**: DNS only
2. **Type**: MX | **Name**: @ | **Mail server**: alt1.aspmx.l.google.com | **Priority**: 5 | **Proxy**: DNS only
3. **Type**: MX | **Name**: @ | **Mail server**: alt2.aspmx.l.google.com | **Priority**: 5 | **Proxy**: DNS only
4. **Type**: MX | **Name**: @ | **Mail server**: alt3.aspmx.l.google.com | **Priority**: 10 | **Proxy**: DNS only
5. **Type**: MX | **Name**: @ | **Mail server**: alt4.aspmx.l.google.com | **Priority**: 10 | **Proxy**: DNS only

## TXT Records (All DNS Only)

### SPF Record (Email Authentication)
- **Type**: TXT | **Name**: @ | **Content**: `v=spf1 include:_spf.google.com ~all` | **Proxy**: DNS only

### DMARC Record (Email Security)
- **Type**: TXT | **Name**: _dmarc | **Content**: `v=DMARC1; p=quarantine; rua=mailto:admin@badgertechnologies.us; ruf=mailto:admin@badgertechnologies.us; sp=quarantine; adkim=r; aspf=r; fo=1` | **Proxy**: DNS only

### DKIM Record (Email Signing)
- **Type**: TXT | **Name**: google._domainkey | **Content**: `v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp5QI3BI9FjaXJ8Qj3rrztEI9dWFTdKAIhB4t1ByBvmwX8Jz6Jo8G0RrQA0HzfF7tBwDeXlcQcp8bLJyqht4WWgxeNpVR9wsxGbD/U6XZKn+AtODeFPoUCuIcNKVJ6Km+2ds6R+9Rt37HAVjxaHrJng/3v2JEvrEnwgskAz4lN4ampajEPX6IPJCvMNJaipLDnv45wXWgA7g1spkVXL7Qsg07BIAxeAe+tsrlvNBfC7zZ3u+Y+QUAnOzFaD7XUbJhXD+BKbJBKTiBc5QFQ11HoPMdFbVWiEl+uYRvqHj5pb2WkadjTJ6Jm1eDv/B/FVwmL1/1tDDS7yN5Y/zvvclEgQIDAQAB` | **Proxy**: DNS only

### Google Site Verification Records
- **Type**: TXT | **Name**: @ | **Content**: `google-site-verification=-8cqIK3K1-oJYa7O3pcEuS7cPDt7oOv691q4C2s49yw` | **Proxy**: DNS only
- **Type**: TXT | **Name**: @ | **Content**: `google-site-verification=8Qk_zp70UR53rdQMZhsBXX-v5IkXosxNIo8vvqWo5gc` | **Proxy**: DNS only  
- **Type**: TXT | **Name**: @ | **Content**: `google-site-verification=O9G17_7TphijVZhNvlT3fZh9q88klahPkUM6FWbnf8c` | **Proxy**: DNS only

### Business Information TXT Records
- **Type**: TXT | **Name**: @ | **Content**: `v=caa1 issue letsencrypt.org` | **Proxy**: DNS only
- **Type**: TXT | **Name**: @ | **Content**: `v=verification badger-technologies-2025` | **Proxy**: DNS only
- **Type**: TXT | **Name**: @ | **Content**: `business-type=technology-consulting` | **Proxy**: DNS only
- **Type**: TXT | **Name**: @ | **Content**: `ca-policy=letsencrypt-authorized` | **Proxy**: DNS only
- **Type**: TXT | **Name**: @ | **Content**: `certificate-transparency=enabled` | **Proxy**: DNS only
- **Type**: TXT | **Name**: @ | **Content**: `established=2025` | **Proxy**: DNS only
- **Type**: TXT | **Name**: @ | **Content**: `industry=information-technology` | **Proxy**: DNS only
- **Type**: TXT | **Name**: @ | **Content**: `security-contact=security@badgertechnologies.us` | **Proxy**: DNS only
- **Type**: TXT | **Name**: @ | **Content**: `services=cybersecurity,managed-it,cloud-solution` | **Proxy**: DNS only
- **Type**: TXT | **Name**: @ | **Content**: `ssl-policy=strict-transport-security` | **Proxy**: DNS only

## CAA Records (Major Upgrade!)
🎉 **Finally real CAA records instead of TXT workarounds!**

1. **Type**: CAA | **Name**: @ | **Tag**: issue | **CA domain name**: letsencrypt.org | **Proxy**: DNS only
2. **Type**: CAA | **Name**: @ | **Tag**: issue | **CA domain name**: digicert.com | **Proxy**: DNS only
3. **Type**: CAA | **Name**: @ | **Tag**: iodef | **Contact URL**: mailto:security@badgertechnologies.us | **Proxy**: DNS only

## Key Points to Remember

### Proxy Settings:
- **🟠 Proxied (Orange Cloud)**: @ and www records for performance/security
- **🌫️ DNS Only (Gray Cloud)**: Email, subdomains, TXT records

### Priority Order:
1. Add A and AAAA records first
2. Add MX records for email
3. Add SPF, DMARC, DKIM for email security
4. Add CNAME subdomains
5. Add CAA records
6. Add business TXT records last

### After Adding All Records:
1. Go to **SSL/TLS** → **Overview** → Set to **Full (strict)**
2. Go to **SSL/TLS** → **Edge Certificates** → Enable **Always Use HTTPS**
3. Wait 15-30 minutes, then change nameservers at Name.com

This manual approach ensures each record is added correctly!
