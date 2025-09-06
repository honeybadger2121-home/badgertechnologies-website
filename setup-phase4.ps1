# Phase 4: Create Certificate Management Scripts
# Run this after Phase 3 completes

Write-Host "📋 Phase 4: Setting up certificate management scripts..." -ForegroundColor Green

$CAPath = "C:\BadgerCA"
$ScriptsPath = "$CAPath\scripts"

# Copy scripts to CA directory
Write-Host "Copying certificate creation scripts..."
Copy-Item -Path "C:\opt\badgertechnologies.it.com\create-ssl-cert.ps1" -Destination "$ScriptsPath\" -Force
Copy-Item -Path "C:\opt\badgertechnologies.it.com\create-client-cert.ps1" -Destination "$ScriptsPath\" -Force
Copy-Item -Path "C:\opt\badgertechnologies.it.com\create-codesign-cert.ps1" -Destination "$ScriptsPath\" -Force

# Create CA status monitoring script
$StatusScript = @"
# CA Status Monitor for Badger Technologies
`$CAPath = "C:\BadgerCA"

Write-Host "🔍 Badger Technologies CA Status Report" -ForegroundColor Green
Write-Host "Generated: `$(Get-Date)" -ForegroundColor Gray
Write-Host ""

# Check directory structure
Write-Host "📁 Directory Structure:" -ForegroundColor Yellow
`$RequiredDirs = @("certs", "crl", "private", "newcerts", "requests", "scripts")
foreach (`$Dir in `$RequiredDirs) {
    `$Path = "`$CAPath\`$Dir"
    if (Test-Path `$Path) {
        `$Count = (Get-ChildItem `$Path -File -ErrorAction SilentlyContinue).Count
        Write-Host "  ✅ `$Dir (`$Count files)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ `$Dir (missing)" -ForegroundColor Red
    }
}

# Check CA certificate validity
Write-Host ""
Write-Host "🔐 CA Certificate Status:" -ForegroundColor Yellow
`$CACert = "`$CAPath\certs\ca.cert.pem"
if (Test-Path `$CACert) {
    try {
        `$CertInfo = openssl x509 -in `$CACert -noout -dates -subject
        Write-Host "  ✅ CA Certificate found" -ForegroundColor Green
        `$CertInfo | ForEach-Object { Write-Host "     `$_" -ForegroundColor Gray }
    } catch {
        Write-Host "  ❌ Cannot read CA certificate" -ForegroundColor Red
    }
} else {
    Write-Host "  ❌ CA Certificate missing" -ForegroundColor Red
}

# Check OpenSSL availability
Write-Host ""
Write-Host "🛠️ OpenSSL Status:" -ForegroundColor Yellow
try {
    `$OpenSSLVersion = openssl version
    Write-Host "  ✅ `$OpenSSLVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ OpenSSL not found in PATH" -ForegroundColor Red
}

# List issued certificates
Write-Host ""
Write-Host "📋 Issued Certificates:" -ForegroundColor Yellow
`$IssuedCerts = Get-ChildItem -Path "`$CAPath\certs" -Filter "*.cert.pem" -ErrorAction SilentlyContinue | Where-Object { `$_.Name -ne "ca.cert.pem" }
if (`$IssuedCerts.Count -gt 0) {
    foreach (`$Cert in `$IssuedCerts) {
        try {
            `$CertInfo = openssl x509 -in `$Cert.FullName -noout -subject -dates
            `$Subject = (`$CertInfo | Select-String "subject=").ToString().Split("=")[-1]
            `$Expires = (`$CertInfo | Select-String "notAfter=").ToString().Split("=")[-1]
            Write-Host "  📄 `$(`$Cert.BaseName): `$Subject" -ForegroundColor Cyan
            Write-Host "     Expires: `$Expires" -ForegroundColor Gray
        } catch {
            Write-Host "  ❌ Error reading `$(`$Cert.Name)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  📝 No certificates issued yet" -ForegroundColor Gray
}

# Check disk space
Write-Host ""
Write-Host "💾 System Resources:" -ForegroundColor Yellow
`$Drive = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'"
`$FreeSpaceGB = [math]::Round(`$Drive.FreeSpace / 1GB, 2)
`$TotalSpaceGB = [math]::Round(`$Drive.Size / 1GB, 2)
`$UsagePercent = [math]::Round(((`$Drive.Size - `$Drive.FreeSpace) / `$Drive.Size) * 100, 1)

Write-Host "  💾 Disk C: `$FreeSpaceGB GB free of `$TotalSpaceGB GB (`$UsagePercent% used)" -ForegroundColor (`$FreeSpaceGB -lt 10 ? "Red" : "Green")

Write-Host ""
Write-Host "🎯 CA Status Check Complete" -ForegroundColor Green
"@

Set-Content -Path "$ScriptsPath\ca-status.ps1" -Value $StatusScript

# Create certificate renewal script
# Certificate Renewal Monitor for Badger Technologies CA
param(
    [int]$DaysBeforeExpiry = 30,
    [switch]$EmailAlert
)

$CAPath = "C:\BadgerCA"
$CertPath = "$CAPath\certs"

Write-Host "🔄 Checking certificates expiring within $DaysBeforeExpiry days..." -ForegroundColor Green

$ExpiringCerts = @()

Get-ChildItem -Path $CertPath -Filter "*.cert.pem" | Where-Object { $_.Name -ne "ca.cert.pem" } | ForEach-Object {
    $CertFile = $_.FullName
    try {
        $CertInfo = openssl x509 -in $CertFile -noout -dates -subject
        $Subject = ($CertInfo | Select-String "subject=").ToString().Split("=")[-1]
        $ExpiryLine = $CertInfo | Select-String "notAfter="
        
        if ($ExpiryLine) {
            $ExpiryDateStr = $ExpiryLine.ToString().Split("=", 2)[1].Trim()
            $ExpiryDate = [DateTime]::ParseExact($ExpiryDateStr, "MMM dd HH:mm:ss yyyy GMT", $null)
            $DaysLeft = ($ExpiryDate - (Get-Date)).Days
            
            if ($DaysLeft -le $DaysBeforeExpiry) {
                $ExpiringCert = [PSCustomObject]@{
                    File = $_.Name
                    Subject = $Subject
                    ExpiryDate = $ExpiryDate
                    DaysLeft = $DaysLeft
                }
                $ExpiringCerts += $ExpiringCert
                
                if ($DaysLeft -le 0) {
                    Write-Host "  🔴 EXPIRED: $($_.BaseName) - $Subject" -ForegroundColor Red
                } elseif ($DaysLeft -le 7) {
                    Write-Host "  🟠 CRITICAL: $($_.BaseName) expires in $DaysLeft days - $Subject" -ForegroundColor Red
                } else {
                    Write-Host "  🟡 WARNING: $($_.BaseName) expires in $DaysLeft days - $Subject" -ForegroundColor Yellow
                }
            }
        }
    } catch {
        Write-Host "  ❌ Error reading $($_.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

if ($ExpiringCerts.Count -eq 0) {
    Write-Host "✅ No certificates expiring within $DaysBeforeExpiry days" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "📧 Consider renewing these certificates:" -ForegroundColor Yellow
    $ExpiringCerts | ForEach-Object {
        Write-Host "   - $($_.File): $($_.Subject) (expires $($_.ExpiryDate.ToString('yyyy-MM-dd')))" -ForegroundColor Gray
    }
}

return $ExpiringCerts

Write-Host "✅ Certificate management scripts created:" -ForegroundColor Green
Write-Host "  📄 create-ssl-cert.ps1 - Create SSL/TLS certificates"
Write-Host "  👤 create-client-cert.ps1 - Create client authentication certificates"  
Write-Host "  📝 create-codesign-cert.ps1 - Create code signing certificates"
Write-Host "  🔍 ca-status.ps1 - Check CA status and health"
Write-Host "  🔄 check-renewals.ps1 - Monitor certificate expiration"

Write-Host ""
Write-Host "🎯 Phase 4 complete! Certificate management ready." -ForegroundColor Green
