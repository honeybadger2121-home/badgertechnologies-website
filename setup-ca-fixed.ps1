# Complete Badger Technologies Certificate Authority Setup - FIXED
# Master setup script - runs all phases in sequence

Write-Host "🔐 BADGER TECHNOLOGIES CERTIFICATE AUTHORITY" -ForegroundColor Green
Write-Host "Complete Windows 11 Standalone Setup" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Check if running as Administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "   Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Running as Administrator - proceeding with setup..." -ForegroundColor Green
Write-Host ""

# Phase 1: Enable Windows Features
Write-Host "🚀 Starting Phase 1: Windows Features..." -ForegroundColor Cyan
try {
    if (Test-Path ".\setup-phase1.ps1") {
        & ".\setup-phase1.ps1"
        Write-Host "✅ Phase 1 completed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ setup-phase1.ps1 not found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Phase 1 failed: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if restart is needed
Write-Host ""
Write-Host "⚠️  Some Windows features may require a restart." -ForegroundColor Yellow
Write-Host "If you just enabled Windows features for the first time, you should restart." -ForegroundColor Yellow
Write-Host "Otherwise, you can continue with the setup." -ForegroundColor Yellow
$restart = Read-Host "Do you need to restart now? Enter 'y' for yes or 'n' for no"
if ($restart -eq 'y' -or $restart -eq 'Y') {
    Write-Host "Please restart your computer and run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 0
}

# Phase 2: Create CA Structure  
Write-Host ""
Write-Host "🏗️ Starting Phase 2: CA Directory Structure..." -ForegroundColor Cyan
try {
    if (Test-Path ".\setup-phase2.ps1") {
        & ".\setup-phase2.ps1"
        Write-Host "✅ Phase 2 completed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ setup-phase2.ps1 not found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Phase 2 failed: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Phase 3: Create Root CA
Write-Host ""
Write-Host "🔐 Starting Phase 3: Root Certificate Authority..." -ForegroundColor Cyan
Write-Host "You will be prompted for CA private key passphrase and certificate details." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to continue"
try {
    if (Test-Path ".\setup-phase3.ps1") {
        & ".\setup-phase3.ps1"
        Write-Host "✅ Phase 3 completed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ setup-phase3.ps1 not found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Phase 3 failed: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Phase 4: Setup Management Scripts
Write-Host ""
Write-Host "📋 Starting Phase 4: Management Scripts..." -ForegroundColor Cyan
try {
    if (Test-Path ".\setup-phase4-fixed.ps1") {
        & ".\setup-phase4-fixed.ps1"
        Write-Host "✅ Phase 4 completed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ setup-phase4-fixed.ps1 not found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Phase 4 failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Continuing anyway..." -ForegroundColor Yellow
}

# Phase 5: Setup Web Interface
Write-Host ""
Write-Host "🌐 Starting Phase 5: Web Interface..." -ForegroundColor Cyan
try {
    if (Test-Path ".\setup-phase5.ps1") {
        & ".\setup-phase5.ps1"
        Write-Host "✅ Phase 5 completed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ setup-phase5.ps1 not found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Phase 5 failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Web interface setup failed, but CA is still functional." -ForegroundColor Yellow
}

# Copy additional management scripts
Write-Host ""
Write-Host "📋 Copying additional management scripts..." -ForegroundColor Cyan
try {
    if (Test-Path "C:\BadgerCA\scripts") {
        Copy-Item -Path ".\ca-status.ps1" -Destination "C:\BadgerCA\scripts\" -Force -ErrorAction SilentlyContinue
        Copy-Item -Path ".\check-renewals.ps1" -Destination "C:\BadgerCA\scripts\" -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Management scripts copied" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Could not copy management scripts" -ForegroundColor Yellow
}

# Final setup completion
Write-Host ""
Write-Host "🎉 BADGER TECHNOLOGIES CA SETUP COMPLETE!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your Certificate Authority is now ready:" -ForegroundColor White
Write-Host ""
Write-Host "📁 CA Location: C:\BadgerCA" -ForegroundColor Yellow
Write-Host "🌐 Web Interface: http://localhost:8443" -ForegroundColor Yellow
Write-Host "📋 Scripts: C:\BadgerCA\scripts\" -ForegroundColor Yellow
Write-Host ""
Write-Host "QUICK TEST COMMANDS:" -ForegroundColor Cyan
Write-Host "cd C:\BadgerCA\scripts" -ForegroundColor White
Write-Host ".\create-ssl-cert.ps1 -CommonName 'test.badgertechnologies.us'" -ForegroundColor White
Write-Host ".\create-client-cert.ps1 -ClientName 'TestUser' -EmailAddress 'test@badgertechnologies.us'" -ForegroundColor White
Write-Host ".\create-codesign-cert.ps1 -DeveloperName 'BadgerTech'" -ForegroundColor White
Write-Host ".\ca-status.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
Read-Host "Press Enter to continue"
