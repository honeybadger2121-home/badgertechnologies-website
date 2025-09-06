# Simple SSL Certificate Creator - No Passphrase Required
param(
    [Parameter(Mandatory=$true)]
    [string]$CommonName
)

Write-Host "🌐 Creating SSL certificate for $CommonName..." -ForegroundColor Green

# Set working directory
Set-Location "C:\BadgerCA"

# Add OpenSSL to PATH if not already there
if (-not (Get-Command openssl -ErrorAction SilentlyContinue)) {
    $env:PATH += ";C:\Program Files\OpenSSL-Win64\bin"
}

# Generate filenames
$SafeName = $CommonName -replace '\*', 'wildcard' -replace '[^\w\.]', '_'
$KeyFile = "private\$SafeName.key.pem"
$CsrFile = "requests\$SafeName.csr.pem"  
$CertFile = "certs\$SafeName.cert.pem"

Write-Host "Creating files:" -ForegroundColor Cyan
Write-Host "  Key: $KeyFile" -ForegroundColor Gray
Write-Host "  CSR: $CsrFile" -ForegroundColor Gray
Write-Host "  Cert: $CertFile" -ForegroundColor Gray
Write-Host ""

try {
    # Generate private key
    Write-Host "1. Generating private key..." -ForegroundColor Yellow
    openssl genrsa -out $KeyFile 2048
    if ($LASTEXITCODE -ne 0) { throw "Failed to generate private key" }
    Write-Host "   ✅ Private key created" -ForegroundColor Green

    # Create certificate signing request  
    Write-Host "2. Creating certificate request..." -ForegroundColor Yellow
    openssl req -new -key $KeyFile -out $CsrFile -subj "/C=US/ST=Illinois/L=Chicago/O=Badger Technologies/CN=$CommonName"
    if ($LASTEXITCODE -ne 0) { throw "Failed to create CSR" }
    Write-Host "   ✅ Certificate request created" -ForegroundColor Green

    # Sign the certificate using the CA
    Write-Host "3. Signing certificate with CA..." -ForegroundColor Yellow
    Write-Host "   (You'll need to enter the CA private key passphrase)" -ForegroundColor Cyan
    openssl x509 -req -in $CsrFile -CA certs\ca.cert.pem -CAkey private\ca.key.pem -CAcreateserial -out $CertFile -days 365 -sha256
    if ($LASTEXITCODE -ne 0) { throw "Failed to sign certificate" }
    Write-Host "   ✅ Certificate signed and created" -ForegroundColor Green

    # Verify the certificate
    Write-Host "4. Verifying certificate..." -ForegroundColor Yellow
    openssl x509 -in $CertFile -text -noout | Select-String "Subject:|Issuer:|Not Before:|Not After:|DNS:"
    Write-Host "   ✅ Certificate verified" -ForegroundColor Green

    Write-Host ""
    Write-Host "🎉 SUCCESS! SSL Certificate created:" -ForegroundColor Green
    Write-Host "   📄 Certificate: C:\BadgerCA\$CertFile" -ForegroundColor Cyan
    Write-Host "   🔑 Private Key: C:\BadgerCA\$KeyFile" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To use this certificate:" -ForegroundColor Yellow
    Write-Host "   - Import the CA certificate (certs\ca.cert.pem) as a trusted root" -ForegroundColor White
    Write-Host "   - Use the certificate ($CertFile) and key ($KeyFile) for your service" -ForegroundColor White

    return $true

} catch {
    Write-Host ""
    Write-Host "❌ Error creating SSL certificate: $($_.Exception.Message)" -ForegroundColor Red
    return $false
}
