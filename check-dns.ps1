# DNS Verification Script for Badger Technologies
# Run these commands to verify your DNS configuration

Write-Host "🔍 Checking DNS Configuration for badgertechnologies.us" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Yellow

Write-Host "`n1. Checking Name Servers..." -ForegroundColor Green
nslookup -type=NS badgertechnologies.us

Write-Host "`n2. Checking A Records..." -ForegroundColor Green  
nslookup badgertechnologies.us

Write-Host "`n3. Checking CNAME Records..." -ForegroundColor Green
nslookup alias.badgertechnologies.us

Write-Host "`n4. Checking MX Records (Email)..." -ForegroundColor Green
nslookup -type=MX badgertechnologies.us

Write-Host "`n5. Checking SPF Record..." -ForegroundColor Green
nslookup -type=TXT badgertechnologies.us | Select-String "spf"

Write-Host "`n6. Checking DMARC Record..." -ForegroundColor Green
nslookup -type=TXT _dmarc.badgertechnologies.us

Write-Host "`n7. Checking CAA Records..." -ForegroundColor Green
nslookup -type=CAA badgertechnologies.us

Write-Host "`n✅ DNS Check Complete!" -ForegroundColor Green
Write-Host "🚨 CRITICAL: If you see 'apex-loadbalancer.netlify.com' in the results above," -ForegroundColor Red
Write-Host "   you MUST remove the Netlify alias CNAME record immediately!" -ForegroundColor Red

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Remove: alias.badgertechnologies.us CNAME apex-loadbalancer.netlify.com"
Write-Host "2. Add your domain in Cloudflare Pages: Custom domains → Add badgertechnologies.us"
Write-Host "3. Let Cloudflare auto-configure the DNS records"
Write-Host "4. Re-run this script to verify changes"
