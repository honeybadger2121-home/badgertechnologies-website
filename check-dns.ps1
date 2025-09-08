# DNS Record Verification for badgertechnologies.us (Name.com)
# Run these commands to check your DNS records after configuration

Write-Output "=== Checking badgertechnologies.us DNS Records ==="
Write-Output ""

# Basic DNS Records
Write-Output "=== Basic DNS Records ==="
nslookup badgertechnologies.us
nslookup www.badgertechnologies.us

Write-Output ""
Write-Output "=== MX Records (Email Setup) ==="
nslookup -type=MX badgertechnologies.us

Write-Output ""
Write-Output "=== TXT Records (SPF, DMARC, Verification) ==="
nslookup -type=TXT badgertechnologies.us
Write-Output ""
Write-Output "Checking DMARC record:"
nslookup -type=TXT _dmarc.badgertechnologies.us

Write-Output ""
Write-Output "=== CAA Records (Certificate Security) ==="
nslookup -type=CAA badgertechnologies.us

Write-Output ""
Write-Output "=== DNS Propagation Check (Multiple Servers) ==="
Write-Output "Google DNS (8.8.8.8):"
nslookup badgertechnologies.us 8.8.8.8
Write-Output ""
Write-Output "Cloudflare DNS (1.1.1.1):"
nslookup badgertechnologies.us 1.1.1.1
Write-Output ""
Write-Output "OpenDNS (208.67.222.222):"
nslookup badgertechnologies.us 208.67.222.222

Write-Output ""
Write-Output "=== Professional Subdomain Records ==="
nslookup mail.badgertechnologies.us
nslookup support.badgertechnologies.us  
nslookup secure.badgertechnologies.us

Write-Output ""
Write-Output "=== DNS Check Complete ==="
Write-Output "Use online tools for additional verification:"
Write-Output "- whatsmydns.net"
Write-Output "- dnschecker.org" 
Write-Output "- mxtoolbox.com"
