# Phase 1: Enable Windows 11 Features for Certificate Authority
# Run this script as Administrator in PowerShell

Write-Host "🚀 Phase 1: Enabling Windows 11 features..." -ForegroundColor Green

# Enable IIS features
Write-Host "Installing IIS features..."
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole -All -NoRestart
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServer -All -NoRestart
Enable-WindowsOptionalFeature -Online -FeatureName IIS-CommonHttpFeatures -All -NoRestart
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpErrors -All -NoRestart
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpLogging -All -NoRestart
Enable-WindowsOptionalFeature -Online -FeatureName IIS-Security -All -NoRestart
Enable-WindowsOptionalFeature -Online -FeatureName IIS-RequestFiltering -All -NoRestart
Enable-WindowsOptionalFeature -Online -FeatureName IIS-StaticContent -All -NoRestart
Enable-WindowsOptionalFeature -Online -FeatureName IIS-ASPNET45 -All -NoRestart

# Install Chocolatey for OpenSSL
Write-Host "Installing Chocolatey package manager..."
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
try {
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    Write-Host "✅ Chocolatey installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install Chocolatey: $($_.Exception.Message)" -ForegroundColor Red
}

# Install OpenSSL
Write-Host "Installing OpenSSL..."
try {
    choco install openssl -y
    Write-Host "✅ OpenSSL installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install OpenSSL: $($_.Exception.Message)" -ForegroundColor Red
}

# Refresh environment variables
$env:PATH = [Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [Environment]::GetEnvironmentVariable("PATH", "User")
refreshenv

Write-Host "🎯 Phase 1 complete! Ready for Phase 2." -ForegroundColor Green
Write-Host "Note: A restart may be required after this phase." -ForegroundColor Yellow
