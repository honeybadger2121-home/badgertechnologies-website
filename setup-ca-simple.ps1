# Simple Badger Technologies Certificate Authority Setup
# This version avoids the y/n prompt issue

Write-Host "🔐 BADGER TECHNOLOGIES CERTIFICATE AUTHORITY" -ForegroundColor Green
Write-Host "Simple Setup Version" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
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
Write-Host "🚀 Phase 1: Installing Windows Features and OpenSSL..." -ForegroundColor Cyan
Write-Host "This may take several minutes..." -ForegroundColor Yellow

try {
    # Install Chocolatey if not present
    if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Host "Installing Chocolatey..."
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    }
    
    # Install OpenSSL
    Write-Host "Installing OpenSSL..."
    choco install openssl -y
    
    # Refresh environment variables
    $machinePath = [System.Environment]::GetEnvironmentVariable("PATH", "Machine")
    $userPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
    $env:PATH = "$machinePath;$userPath"
    
    Write-Host "✅ Phase 1 completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Phase 1 failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You may need to install OpenSSL manually." -ForegroundColor Yellow
}

# Phase 2: Create CA Structure  
Write-Host ""
Write-Host "🏗️ Phase 2: Creating CA Directory Structure..." -ForegroundColor Cyan

$CAPath = "C:\BadgerCA"
$Directories = @("certs", "crl", "newcerts", "private", "requests", "scripts", "web")

foreach ($Dir in $Directories) {
    $Path = "$CAPath\$Dir"
    if (-not (Test-Path $Path)) {
        New-Item -Path $Path -ItemType Directory -Force | Out-Null
        Write-Host "✅ Created directory: $Dir"
    } else {
        Write-Host "✅ Directory exists: $Dir"
    }
}

# Set secure permissions on private directory
try {
    icacls "$CAPath\private" /grant:r "$($env:USERNAME):(F)" /inheritance:r | Out-Null
    Write-Host "✅ Permissions set on private directory"
} catch {
    Write-Host "⚠️ Could not set permissions on private directory" -ForegroundColor Yellow
}

# Initialize CA database files
if (-not (Test-Path "$CAPath\index.txt")) {
    New-Item -Path "$CAPath\index.txt" -ItemType File -Force | Out-Null
}
if (-not (Test-Path "$CAPath\serial")) {
    Set-Content -Path "$CAPath\serial" -Value "1000"
}
if (-not (Test-Path "$CAPath\crlnumber")) {
    Set-Content -Path "$CAPath\crlnumber" -Value "1000"
}

Write-Host "✅ Phase 2 completed successfully" -ForegroundColor Green

# Copy configuration file
Write-Host ""
Write-Host "📋 Copying CA configuration..." -ForegroundColor Cyan
try {
    Copy-Item -Path ".\badger-ca.conf" -Destination "$CAPath\badger-ca.conf" -Force
    Write-Host "✅ Configuration file copied" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not copy badger-ca.conf" -ForegroundColor Yellow
}

# Copy certificate creation scripts
Write-Host ""
Write-Host "📋 Copying certificate creation scripts..." -ForegroundColor Cyan
try {
    $ScriptFiles = @("create-ssl-cert.ps1", "create-client-cert.ps1", "create-codesign-cert.ps1", "ca-status.ps1", "check-renewals.ps1")
    foreach ($Script in $ScriptFiles) {
        if (Test-Path ".\$Script") {
            Copy-Item -Path ".\$Script" -Destination "$CAPath\scripts\" -Force
            Write-Host "✅ Copied $Script"
        }
    }
} catch {
    Write-Host "⚠️ Some scripts may not have been copied" -ForegroundColor Yellow
}

# Final instructions
Write-Host ""
Write-Host "🎯 BASIC SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. To create your Root CA certificate, run:" -ForegroundColor White
Write-Host "   cd C:\BadgerCA" -ForegroundColor Cyan
Write-Host "   openssl req -new -x509 -days 7300 -config badger-ca.conf -keyout private\ca.key.pem -out certs\ca.cert.pem" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Test your setup:" -ForegroundColor White
Write-Host "   cd C:\BadgerCA\scripts" -ForegroundColor Cyan
Write-Host "   .\ca-status.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "📁 CA Location: C:\BadgerCA" -ForegroundColor Yellow
Write-Host "📋 Scripts: C:\BadgerCA\scripts\" -ForegroundColor Yellow
Write-Host ""
Write-Host "Setup completed successfully! ✅" -ForegroundColor Green
Read-Host "Press Enter to exit"
