# Complete Badger Technologies Certificate Authority Setup
# Master setup script - runs all phases in sequence

Write-Host @"
🔐 ================================================
   BADGER TECHNOLOGIES CERTIFICATE AUTHORITY
   Complete Windows 11 Standalone Setup
================================================

This script will set up a complete Certificate Authority with:
✅ SSL/TLS Certificates
✅ Client Authentication Certificates  
✅ Code Signing Certificates
✅ Email Certificates (S/MIME)
✅ Web Management Interface
✅ PowerShell Management Scripts

"@ -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "   Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✅ Running as Administrator - proceeding with setup..." -ForegroundColor Green
Write-Host ""

# Phase 1: Enable Windows Features
Write-Host "🚀 Starting Phase 1: Windows Features..." -ForegroundColor Cyan
try {
    & ".\setup-phase1.ps1"
    Write-Host "✅ Phase 1 completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Phase 1 failed: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}

# Check if restart is needed
Write-Host ""
Write-Host "⚠️  Some Windows features may require a restart." -ForegroundColor Yellow
$restart = Read-Host "Do you need to restart now? (y/n)"
if ($restart -eq 'y' -or $restart -eq 'Y') {
    Write-Host "Please restart your computer and run this script again." -ForegroundColor Yellow
    pause
    exit 0
}

# Phase 2: Create CA Structure  
Write-Host ""
Write-Host "🏗️ Starting Phase 2: CA Directory Structure..." -ForegroundColor Cyan
try {
    & ".\setup-phase2.ps1"
    Write-Host "✅ Phase 2 completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Phase 2 failed: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}

# Phase 3: Create Root CA
Write-Host ""
Write-Host "🔐 Starting Phase 3: Root Certificate Authority..." -ForegroundColor Cyan
Write-Host "You will be prompted for CA private key passphrase and certificate details." -ForegroundColor Yellow
Write-Host ""
pause
try {
    & ".\setup-phase3.ps1"
    Write-Host "✅ Phase 3 completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Phase 3 failed: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}

# Phase 4: Setup Management Scripts
Write-Host ""
Write-Host "📋 Starting Phase 4: Management Scripts..." -ForegroundColor Cyan
try {
    & ".\setup-phase4.ps1"
    Write-Host "✅ Phase 4 completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Phase 4 failed: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}

# Phase 5: Setup Web Interface
Write-Host ""
Write-Host "🌐 Starting Phase 5: Web Interface..." -ForegroundColor Cyan
try {
    & ".\setup-phase5.ps1"
    Write-Host "✅ Phase 5 completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Phase 5 failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Web interface setup failed, but CA is still functional." -ForegroundColor Yellow
}

# Final setup completion
Write-Host ""
Write-Host @"
🎉 ================================================
   BADGER TECHNOLOGIES CA SETUP COMPLETE!
================================================

Your Certificate Authority is now ready for use:

📁 CA Location: C:\BadgerCA
🌐 Web Interface: http://localhost:8443
📋 Scripts: C:\BadgerCA\scripts\

QUICK TEST COMMANDS:
└─ SSL Certificate:     .\scripts\create-ssl-cert.ps1 -CommonName "test.badgertechnologies.us"
└─ Client Certificate:  .\scripts\create-client-cert.ps1 -ClientName "TestUser" -EmailAddress "test@badgertechnologies.us"
└─ Code Signing:        .\scripts\create-codesign-cert.ps1 -DeveloperName "BadgerTech"
└─ CA Status:           .\scripts\ca-status.ps1

MANAGEMENT:
└─ Check Renewals:      .\scripts\check-renewals.ps1
└─ Web Interface:       http://localhost:8443

NEXT STEPS:
1. Test certificate creation with the commands above
2. Install CA certificate on client machines: C:\BadgerCA\certs\ca.cert.pem
3. Configure applications to use your certificates
4. Set up automated backup of C:\BadgerCA directory

"@ -ForegroundColor Green

Write-Host "Press any key to exit..." -ForegroundColor Yellow
pause
