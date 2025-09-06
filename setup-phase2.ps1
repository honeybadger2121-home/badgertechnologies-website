# Phase 2: Create CA Directory Structure and Configuration
# Run this after Phase 1 completes

Write-Host "🏗️ Phase 2: Creating Badger Technologies CA structure..." -ForegroundColor Green

# Create CA directory structure
$CAPath = "C:\BadgerCA"
Write-Host "Creating CA directory structure at $CAPath..."

$Directories = @("certs", "crl", "newcerts", "private", "requests", "scripts", "web")
foreach ($Dir in $Directories) {
    $Path = "$CAPath\$Dir"
    New-Item -Path $Path -ItemType Directory -Force | Out-Null
    Write-Host "✅ Created directory: $Dir"
}

# Set secure permissions on private directory
Write-Host "Setting permissions on private directory..."
icacls "$CAPath\private" /grant:r "$($env:USERNAME):(F)" /inheritance:r | Out-Null

# Initialize CA database files
Write-Host "Initializing CA database files..."
New-Item -Path "$CAPath\index.txt" -ItemType File -Force | Out-Null
Set-Content -Path "$CAPath\serial" -Value "1000"
Set-Content -Path "$CAPath\crlnumber" -Value "1000"

Write-Host "✅ CA directory structure created successfully!" -ForegroundColor Green
