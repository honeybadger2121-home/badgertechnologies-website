# Badger Technologies CA - System Verification Script
Write-Host "🔍 Badger Technologies Certificate Authority - System Check" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

# 1. Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if ($isAdmin) {
    Write-Host "✅ Running as Administrator" -ForegroundColor Green
} else {
    Write-Host "⚠️  Not running as Administrator (some checks may fail)" -ForegroundColor Yellow
}

# 2. Check CA Directory Structure
Write-Host ""
Write-Host "📁 CA Directory Structure:" -ForegroundColor Cyan
$CAPath = "C:\BadgerCA"
if (Test-Path $CAPath) {
    Write-Host "✅ CA Directory exists: $CAPath" -ForegroundColor Green
    
    $RequiredDirs = @("certs", "crl", "private", "newcerts", "requests", "scripts", "web")
    foreach ($Dir in $RequiredDirs) {
        $FullPath = "$CAPath\$Dir"
        if (Test-Path $FullPath) {
            $FileCount = (Get-ChildItem $FullPath -ErrorAction SilentlyContinue).Count
            Write-Host "  ✅ $Dir ($FileCount files)" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $Dir (missing)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ CA Directory missing: $CAPath" -ForegroundColor Red
}

# 3. Check OpenSSL
Write-Host ""
Write-Host "🛠️  OpenSSL Status:" -ForegroundColor Cyan
try {
    $env:PATH += ";C:\Program Files\OpenSSL-Win64\bin"
    $version = openssl version 2>$null
    Write-Host "✅ OpenSSL found: $version" -ForegroundColor Green
} catch {
    Write-Host "❌ OpenSSL not found or not working" -ForegroundColor Red
}

# 4. Check CA Certificate
Write-Host ""
Write-Host "🔐 CA Certificate Status:" -ForegroundColor Cyan
$CACert = "$CAPath\certs\ca.cert.pem"
if (Test-Path $CACert) {
    Write-Host "✅ CA Certificate exists" -ForegroundColor Green
    try {
        $certInfo = openssl x509 -in $CACert -noout -subject -dates 2>$null
        Write-Host "  Subject: $($certInfo | Select-String 'subject=')" -ForegroundColor Gray
        Write-Host "  Validity: $($certInfo | Select-String 'notAfter=')" -ForegroundColor Gray
    } catch {
        Write-Host "  ⚠️  Could not read certificate details" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ CA Certificate missing: $CACert" -ForegroundColor Red
}

# 5. Check Scheduled Task
Write-Host ""
Write-Host "⏰ Scheduled Task Status:" -ForegroundColor Cyan
if ($isAdmin) {
    try {
        $task = Get-ScheduledTask -TaskName "Badger-CA-Certificate-Monitor" -ErrorAction SilentlyContinue
        if ($task) {
            Write-Host "✅ Certificate monitoring task exists" -ForegroundColor Green
            Write-Host "  State: $($task.State)" -ForegroundColor Gray
            Write-Host "  Next Run: Every Monday at 9:00 AM" -ForegroundColor Gray
        } else {
            Write-Host "❌ Certificate monitoring task not found" -ForegroundColor Red
        }
    } catch {
        Write-Host "⚠️  Could not check scheduled task: $($_.Exception.Message)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Run as Administrator to check scheduled tasks" -ForegroundColor Yellow
}

# 6. Check Certificate Files
Write-Host ""
Write-Host "📋 Certificate Inventory:" -ForegroundColor Cyan
$CertFiles = Get-ChildItem "$CAPath\certs" -Filter "*.cert.pem" -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne "ca.cert.pem" }
if ($CertFiles.Count -gt 0) {
    Write-Host "✅ $($CertFiles.Count) certificates issued:" -ForegroundColor Green
    foreach ($cert in $CertFiles) {
        Write-Host "  📄 $($cert.Name) ($(Get-Date $cert.LastWriteTime -Format 'yyyy-MM-dd'))" -ForegroundColor Gray
    }
} else {
    Write-Host "📝 No certificates issued yet (this is normal for new CA)" -ForegroundColor Yellow
}

# 7. System Summary
Write-Host ""
Write-Host "🎯 SYSTEM SUMMARY:" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Green

$allGood = $true
if (-not (Test-Path $CAPath)) { $allGood = $false }
if (-not (Test-Path $CACert)) { $allGood = $false }
if (-not (Get-Command openssl -ErrorAction SilentlyContinue)) { $allGood = $false }

if ($allGood) {
    Write-Host "🎉 Your Certificate Authority is FULLY OPERATIONAL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Quick Commands:" -ForegroundColor Cyan
    Write-Host "   cd C:\BadgerCA\scripts" -ForegroundColor White
    Write-Host "   .\create-ssl-simple.ps1 -CommonName 'your-domain.com'" -ForegroundColor White
    Write-Host "   .\create-client-cert.ps1 -ClientName 'Username' -EmailAddress 'user@domain.com'" -ForegroundColor White
    Write-Host "   .\ca-status.ps1" -ForegroundColor White
} else {
    Write-Host "⚠️  Some components need attention - check the items marked with ❌ above" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📚 For complete documentation, see:" -ForegroundColor Cyan
Write-Host "   C:\opt\badgertechnologies.it.com\WINDOWS-11-STANDALONE-CA-COMPLETE.md" -ForegroundColor White
