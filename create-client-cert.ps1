# Client Certificate Creation Script
param(
    [Parameter(Mandatory=$true)]
    [string]$ClientName,
    
    [Parameter(Mandatory=$true)]
    [string]$EmailAddress,
    
    [Parameter(Mandatory=$false)]
    [int]$ValidDays = 365,
    
    [Parameter(Mandatory=$false)]
    [string]$Country = "US",
    
    [Parameter(Mandatory=$false)]
    [string]$State = "Illinois",
    
    [Parameter(Mandatory=$false)]
    [string]$City = "Chicago",
    
    [Parameter(Mandatory=$false)]
    [string]$Organization = "Badger Technologies"
)

Write-Host "👤 Creating client certificate for $ClientName ($EmailAddress)..." -ForegroundColor Green

$CAPath = "C:\BadgerCA"
Set-Location $CAPath

# Generate filenames
$SafeName = $ClientName -replace '[^\w\.]', '_'
$KeyFile = "private\$SafeName-client.key.pem"
$CsrFile = "requests\$SafeName-client.csr.pem"
$CertFile = "certs\$SafeName-client.cert.pem"
$PfxFile = "certs\$SafeName-client.pfx"

Write-Host "Files will be created as:"
Write-Host "  Key: $KeyFile"
Write-Host "  CSR: $CsrFile"
Write-Host "  Certificate: $CertFile"
Write-Host "  PFX: $PfxFile"

try {
    # Generate private key
    Write-Host "Generating private key..."
    openssl genrsa -out $KeyFile 2048
    if ($LASTEXITCODE -ne 0) { throw "Failed to generate private key" }

    # Create certificate signing request
    Write-Host "Creating certificate signing request..."
    $Subject = "/C=$Country/ST=$State/L=$City/O=$Organization/CN=$ClientName/emailAddress=$EmailAddress"
    openssl req -config badger-ca.conf -key $KeyFile -new -sha256 -out $CsrFile -subj $Subject
    if ($LASTEXITCODE -ne 0) { throw "Failed to create CSR" }

    # Sign the certificate for client authentication
    Write-Host "Signing client certificate (valid for $ValidDays days)..."
    openssl ca -config badger-ca.conf -extensions client_cert -days $ValidDays -notext -md sha256 -in $CsrFile -out $CertFile -batch
    if ($LASTEXITCODE -ne 0) { throw "Failed to sign certificate" }

    # Create PFX file
    Write-Host "Creating PFX file..."
    Write-Host "You will be prompted to enter a password for the PFX file." -ForegroundColor Yellow
    openssl pkcs12 -export -out $PfxFile -inkey $KeyFile -in $CertFile -certfile certs\ca.cert.pem
    if ($LASTEXITCODE -ne 0) { throw "Failed to create PFX file" }

    # Verify certificate
    Write-Host "Verifying certificate..."
    $CertInfo = openssl x509 -in $CertFile -noout -text | Select-String "Subject:", "Extended Key Usage", "Not Before", "Not After"
    $CertInfo | ForEach-Object { Write-Host "  $_" -ForegroundColor Cyan }

    Write-Host "✅ Client Certificate created successfully!" -ForegroundColor Green
    Write-Host "Client: $ClientName" -ForegroundColor Yellow
    Write-Host "Email: $EmailAddress" -ForegroundColor Yellow
    Write-Host "Certificate file: $CertFile" -ForegroundColor Yellow
    Write-Host "PFX file: $PfxFile" -ForegroundColor Yellow

} catch {
    Write-Host "❌ Error creating client certificate: $($_.Exception.Message)" -ForegroundColor Red
    return $false
}

return $true
