# Badger Technologies Certificate Authority - Clean Setup
Write-Host "Badger Technologies Certificate Authority Setup" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "Running as Administrator - OK" -ForegroundColor Green

# Create CA directory structure
Write-Host "Creating CA directory structure..." -ForegroundColor Cyan

$CAPath = "C:\BadgerCA"
$Directories = @("certs", "crl", "newcerts", "private", "requests", "scripts", "web")

New-Item -Path $CAPath -ItemType Directory -Force | Out-Null

foreach ($Dir in $Directories) {
    $FullPath = "$CAPath\$Dir"
    New-Item -Path $FullPath -ItemType Directory -Force | Out-Null
    Write-Host "Created: $Dir" -ForegroundColor Green
}

# Create CA database files
Write-Host "Creating CA database files..." -ForegroundColor Cyan

$IndexFile = "$CAPath\index.txt"
$SerialFile = "$CAPath\serial"
$CrlFile = "$CAPath\crlnumber"

New-Item -Path $IndexFile -ItemType File -Force | Out-Null
Set-Content -Path $SerialFile -Value "1000"
Set-Content -Path $CrlFile -Value "1000"

Write-Host "Created database files" -ForegroundColor Green

# Copy configuration files
Write-Host "Copying configuration files..." -ForegroundColor Cyan

if (Test-Path "badger-ca.conf") {
    Copy-Item -Path "badger-ca.conf" -Destination "$CAPath\badger-ca.conf" -Force
    Write-Host "Copied: badger-ca.conf" -ForegroundColor Green
}

# Copy scripts
$ScriptFiles = @("create-ssl-cert.ps1", "create-client-cert.ps1", "create-codesign-cert.ps1", "ca-status.ps1", "check-renewals.ps1")

foreach ($Script in $ScriptFiles) {
    if (Test-Path $Script) {
        Copy-Item -Path $Script -Destination "$CAPath\scripts\$Script" -Force
        Write-Host "Copied: $Script" -ForegroundColor Green
    }
}

# Complete
Write-Host ""
Write-Host "SETUP COMPLETE!" -ForegroundColor Green
Write-Host "CA Location: C:\BadgerCA" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Install OpenSSL if not already installed" -ForegroundColor White
Write-Host "2. Run: cd C:\BadgerCA\scripts" -ForegroundColor White  
Write-Host "3. Run: .\ca-status.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
