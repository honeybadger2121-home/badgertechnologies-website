# Phase 3: Create Root Certificate Authority
# Run this after Phase 2 completes

Write-Host "🔐 Phase 3: Creating Badger Technologies Root CA..." -ForegroundColor Green

# Set working directory
Set-Location "C:\BadgerCA"

# Copy configuration file
Copy-Item -Path "C:\opt\badgertechnologies.it.com\badger-ca.conf" -Destination "C:\BadgerCA\badger-ca.conf" -Force

# Test OpenSSL installation
Write-Host "Testing OpenSSL installation..."
try {
    $openssl_version = openssl version
    Write-Host "✅ OpenSSL found: $openssl_version" -ForegroundColor Green
} catch {
    Write-Host "❌ OpenSSL not found. Please install OpenSSL first." -ForegroundColor Red
    exit 1
}

# Generate CA private key
Write-Host "Generating CA private key (4096-bit)..."
Write-Host "You will be prompted to enter a passphrase for the CA private key." -ForegroundColor Yellow
Write-Host "Please use a strong passphrase and remember it!" -ForegroundColor Yellow

try {
    openssl genrsa -aes256 -out private\ca.key.pem 4096
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ CA private key generated successfully" -ForegroundColor Green
    } else {
        throw "OpenSSL genrsa failed"
    }
} catch {
    Write-Host "❌ Failed to generate CA private key: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create CA certificate
Write-Host "Creating CA certificate (20-year validity)..."
Write-Host "You will be prompted for certificate details. Here are the recommended values:" -ForegroundColor Yellow
Write-Host "Country Name: US" -ForegroundColor Cyan
Write-Host "State: Illinois" -ForegroundColor Cyan
Write-Host "City: Chicago" -ForegroundColor Cyan
Write-Host "Organization: Badger Technologies" -ForegroundColor Cyan
Write-Host "Organizational Unit: IT Department" -ForegroundColor Cyan
Write-Host "Common Name: Badger Technologies Root CA" -ForegroundColor Cyan
Write-Host "Email: benjamin@badgertechnologies.us" -ForegroundColor Cyan

try {
    openssl req -config badger-ca.conf -key private\ca.key.pem -new -x509 -days 7300 -sha256 -extensions v3_ca -out certs\ca.cert.pem
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ CA certificate created successfully" -ForegroundColor Green
    } else {
        throw "OpenSSL req failed"
    }
} catch {
    Write-Host "❌ Failed to create CA certificate: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Verify CA certificate
Write-Host "Verifying CA certificate..."
openssl x509 -noout -text -in certs\ca.cert.pem | Select-String "Subject:", "Validity", "Public Key Algorithm"

# Install CA certificate to Windows trusted root store
Write-Host "Installing CA certificate to Windows trusted root store..."
try {
    certutil -addstore -f "ROOT" certs\ca.cert.pem
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ CA certificate installed to Windows root store" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Failed to install CA certificate to root store" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Could not install to root store: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "🎉 Phase 3 complete! Root CA is ready!" -ForegroundColor Green
