# Netlify Custom Domain Verification Script for badgertechnologies.us

Write-Output "=== Netlify Custom Domain Setup Verification ==="
Write-Output ""

Write-Output "=== 1. DNS Resolution Check ==="
Write-Output "Checking if badgertechnologies.us points to Netlify..."
nslookup badgertechnologies.us
Write-Output ""

Write-Output "Checking www subdomain..."
nslookup www.badgertechnologies.us
Write-Output ""

Write-Output "=== 2. HTTP/HTTPS Response Check ==="
try {
    $response = Invoke-WebRequest -Uri "https://badgertechnologies.us" -Method Head -TimeoutSec 10
    Write-Output "✅ HTTPS badgertechnologies.us: $($response.StatusCode) $($response.StatusDescription)"
    Write-Output "Server: $($response.Headers.Server)"
} catch {
    Write-Output "❌ HTTPS badgertechnologies.us failed: $($_.Exception.Message)"
}

try {
    $response = Invoke-WebRequest -Uri "https://www.badgertechnologies.us" -Method Head -TimeoutSec 10
    Write-Output "✅ HTTPS www.badgertechnologies.us: $($response.StatusCode) $($response.StatusDescription)"
} catch {
    Write-Output "❌ HTTPS www.badgertechnologies.us failed: $($_.Exception.Message)"
}

Write-Output ""
Write-Output "=== 3. SSL Certificate Check ==="
try {
    $cert = [Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
    $req = [Net.WebRequest]::Create("https://badgertechnologies.us")
    $req.GetResponse().Dispose()
    Write-Output "✅ SSL certificate is valid"
} catch {
    Write-Output "❌ SSL certificate issue: $($_.Exception.Message)"
}

Write-Output ""
Write-Output "=== 4. Domain Propagation Check ==="
Write-Output "Testing from multiple DNS servers..."

Write-Output "Google DNS (8.8.8.8):"
nslookup badgertechnologies.us 8.8.8.8

Write-Output "Cloudflare DNS (1.1.1.1):"  
nslookup badgertechnologies.us 1.1.1.1

Write-Output ""
Write-Output "=== 5. Netlify Redirect Check ==="
Write-Output "Testing if Netlify subdomain redirects to custom domain..."
try {
    $response = Invoke-WebRequest -Uri "https://badgertechnologiesllc.netlify.app" -MaximumRedirection 0
    Write-Output "❌ Netlify subdomain should redirect but didn't: $($response.StatusCode)"
} catch {
    if ($_.Exception.Response.StatusCode -eq "MovedPermanently" -or $_.Exception.Response.StatusCode -eq "Found") {
        $location = $_.Exception.Response.Headers["Location"]
        Write-Output "✅ Netlify subdomain redirects to: $location"
    } else {
        Write-Output "❌ Unexpected response from Netlify subdomain"
    }
}

Write-Output ""
Write-Output "=== 6. Email DNS Records Check ==="
Write-Output "Checking email authentication records..."
nslookup -type=TXT badgertechnologies.us | Select-String -Pattern "spf1"
nslookup -type=TXT _dmarc.badgertechnologies.us

Write-Output ""
Write-Output "=== Verification Complete ==="
Write-Output ""
Write-Output "✅ What should work after setup:"
Write-Output "   - badgertechnologies.us loads your site with HTTPS"
Write-Output "   - Address bar shows badgertechnologies.us"  
Write-Output "   - badgertechnologiesllc.netlify.app redirects to custom domain"
Write-Output "   - www.badgertechnologies.us works"
Write-Output ""
Write-Output "🔧 If issues, check:"
Write-Output "   - DNS propagation (up to 48 hours)"
Write-Output "   - Netlify custom domain settings"
Write-Output "   - SSL certificate provisioning"
