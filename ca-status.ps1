# CA Status Monitor for Badger Technologies
$CAPath = "C:\BadgerCA"

Write-Host "🔍 Badger Technologies CA Status Report" -ForegroundColor Green
Write-Host "Generated: $(Get-Date)" -ForegroundColor Gray
Write-Host ""

# Check directory structure
Write-Host "📁 Directory Structure:" -ForegroundColor Yellow
$RequiredDirs = @("certs", "crl", "private", "newcerts", "requests", "scripts")
foreach ($Dir in $RequiredDirs) {
    $Path = "$CAPath\$Dir"
    if (Test-Path $Path) {
        $Count = (Get-ChildItem $Path -File -ErrorAction SilentlyContinue).Count
        Write-Host "  ✅ $Dir ($Count files)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $Dir (missing)" -ForegroundColor Red
    }
}

# Check CA certificate validity
Write-Host ""
Write-Host "🔐 CA Certificate Status:" -ForegroundColor Yellow
$CACert = "$CAPath\certs\ca.cert.pem"
if (Test-Path $CACert) {
    try {
        $CertInfo = openssl x509 -in $CACert -noout -dates -subject
        Write-Host "  ✅ CA Certificate found" -ForegroundColor Green
        $CertInfo | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
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
    $OpenSSLVersion = openssl version
    Write-Host "  ✅ $OpenSSLVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ OpenSSL not found in PATH" -ForegroundColor Red
}

# List issued certificates
Write-Host ""
Write-Host "📋 Issued Certificates:" -ForegroundColor Yellow
$IssuedCerts = Get-ChildItem -Path "$CAPath\certs" -Filter "*.cert.pem" -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne "ca.cert.pem" }
if ($IssuedCerts.Count -gt 0) {
    foreach ($Cert in $IssuedCerts) {
        try {
            $CertInfo = openssl x509 -in $Cert.FullName -noout -subject -dates
            $Subject = ($CertInfo | Select-String "subject=").ToString().Split("=")[-1]
            $Expires = ($CertInfo | Select-String "notAfter=").ToString().Split("=")[-1]
            Write-Host "  📄 $($Cert.BaseName): $Subject" -ForegroundColor Cyan
            Write-Host "     Expires: $Expires" -ForegroundColor Gray
        } catch {
            Write-Host "  ❌ Error reading $($Cert.Name)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  📝 No certificates issued yet" -ForegroundColor Gray
}

# Check disk space
Write-Host ""
Write-Host "💾 System Resources:" -ForegroundColor Yellow
$Drive = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'"
$FreeSpaceGB = [math]::Round($Drive.FreeSpace / 1GB, 2)
$TotalSpaceGB = [math]::Round($Drive.Size / 1GB, 2)
$UsagePercent = [math]::Round((($Drive.Size - $Drive.FreeSpace) / $Drive.Size) * 100, 1)

if ($FreeSpaceGB -lt 10) {
    Write-Host "  💾 Disk C: $FreeSpaceGB GB free of $TotalSpaceGB GB ($UsagePercent% used)" -ForegroundColor Red
} else {
    Write-Host "  💾 Disk C: $FreeSpaceGB GB free of $TotalSpaceGB GB ($UsagePercent% used)" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 CA Status Check Complete" -ForegroundColor Green
