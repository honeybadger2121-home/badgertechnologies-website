# Ultra-Simple Badger Technologies Certificate Authority Setup
# This version avoids all complex operations

Write-Host "🔐 BADGER TECHNOLOGIES CERTIFICATE AUTHORITY" -ForegroundColor Green
Write-Host "Ultra-Simple Setup" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green

# Check Administrator privileges
$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host ""
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "   Please right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "✅ Running as Administrator" -ForegroundColor Green

# Create CA directory structure
Write-Host ""
Write-Host "📁 Creating CA directory structure..." -ForegroundColor Cyan

$CAPath = "C:\BadgerCA"
$Directories = @("certs", "crl", "newcerts", "private", "requests", "scripts", "web")

Write-Host "Creating $CAPath..." -ForegroundColor Gray
New-Item -Path $CAPath -ItemType Directory -Force | Out-Null

foreach ($Dir in $Directories) {
    $FullPath = Join-Path $CAPath $Dir
    Write-Host "Creating $FullPath..." -ForegroundColor Gray
    New-Item -Path $FullPath -ItemType Directory -Force | Out-Null
    Write-Host "✅ Created: $Dir" -ForegroundColor Green
}

# Create CA database files
Write-Host ""
Write-Host "📋 Creating CA database files..." -ForegroundColor Cyan

$IndexFile = Join-Path $CAPath "index.txt"
$SerialFile = Join-Path $CAPath "serial"
$CrlNumberFile = Join-Path $CAPath "crlnumber"

if (-not (Test-Path $IndexFile)) {
    "" | Out-File -FilePath $IndexFile -Encoding ASCII
    Write-Host "✅ Created index.txt" -ForegroundColor Green
}

if (-not (Test-Path $SerialFile)) {
    "1000" | Out-File -FilePath $SerialFile -Encoding ASCII -NoNewline
    Write-Host "✅ Created serial file" -ForegroundColor Green
}

if (-not (Test-Path $CrlNumberFile)) {
    "1000" | Out-File -FilePath $CrlNumberFile -Encoding ASCII -NoNewline
    Write-Host "✅ Created CRL number file" -ForegroundColor Green
}

# Copy configuration files
Write-Host ""
Write-Host "📋 Copying configuration and scripts..." -ForegroundColor Cyan

$ConfigFiles = @(
    "badger-ca.conf",
    "create-ssl-cert.ps1",
    "create-client-cert.ps1", 
    "create-codesign-cert.ps1",
    "ca-status.ps1",
    "check-renewals.ps1"
)

foreach ($File in $ConfigFiles) {
    $SourcePath = Join-Path (Get-Location) $File
    if (Test-Path $SourcePath) {
        if ($File -eq "badger-ca.conf") {
            $DestPath = Join-Path $CAPath $File
        } else {
            $DestPath = Join-Path "$CAPath\scripts" $File
        }
        Copy-Item -Path $SourcePath -Destination $DestPath -Force
        Write-Host "✅ Copied: $File" -ForegroundColor Green
    } else {
        Write-Host "⚠️ File not found: $File" -ForegroundColor Yellow
    }
}

# Installation complete
Write-Host ""
Write-Host "🎉 CA STRUCTURE SETUP COMPLETE!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "📁 CA Location: C:\BadgerCA" -ForegroundColor Cyan
Write-Host "📋 Scripts Location: C:\BadgerCA\scripts" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Install OpenSSL (if not already installed):" -ForegroundColor White
Write-Host "   - Download from: https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Gray
Write-Host "   - Or use Chocolatey: choco install openssl" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test your setup:" -ForegroundColor White
Write-Host "   cd C:\BadgerCA\scripts" -ForegroundColor Cyan
Write-Host "   .\ca-status.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Create your Root CA certificate:" -ForegroundColor White
Write-Host "   cd C:\BadgerCA" -ForegroundColor Cyan
Write-Host "   openssl req -new -x509 -days 7300 -config badger-ca.conf \" -ForegroundColor Cyan
Write-Host "           -keyout private\ca.key.pem -out certs\ca.cert.pem" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Basic CA structure is ready!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
