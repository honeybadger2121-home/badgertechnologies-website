# Code Signing Certificate Creation Script
param(
    [Parameter(Mandatory=$true)]
    [string]$DeveloperName,
    
    [Parameter(Mandatory=$false)]
    [int]$ValidDays = 1095,  # 3 years for code signing
    
    [Parameter(Mandatory=$false)]
    [string]$Country = "US",
    
    [Parameter(Mandatory=$false)]
    [string]$State = "Illinois",
    
    [Parameter(Mandatory=$false)]
    [string]$City = "Chicago",
    
    [Parameter(Mandatory=$false)]
    [string]$Organization = "Badger Technologies"
)

Write-Host "📝 Creating code signing certificate for $DeveloperName..." -ForegroundColor Green

$CAPath = "C:\BadgerCA"
Set-Location $CAPath

# Generate filenames
$SafeName = $DeveloperName -replace '[^\w\.]', '_'
$KeyFile = "private\$SafeName-codesign.key.pem"
$CsrFile = "requests\$SafeName-codesign.csr.pem"
$CertFile = "certs\$SafeName-codesign.cert.pem"
$PfxFile = "certs\$SafeName-codesign.pfx"

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
    $Subject = "/C=$Country/ST=$State/L=$City/O=$Organization/CN=$DeveloperName Code Signing"
    openssl req -config badger-ca.conf -key $KeyFile -new -sha256 -out $CsrFile -subj $Subject
    if ($LASTEXITCODE -ne 0) { throw "Failed to create CSR" }

    # Sign the certificate for code signing
    Write-Host "Signing code signing certificate (valid for $ValidDays days)..."
    openssl ca -config badger-ca.conf -extensions codesign_cert -days $ValidDays -notext -md sha256 -in $CsrFile -out $CertFile -batch
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

    Write-Host "✅ Code Signing Certificate created successfully!" -ForegroundColor Green
    Write-Host "Developer: $DeveloperName" -ForegroundColor Yellow
    Write-Host "Certificate file: $CertFile" -ForegroundColor Yellow
    Write-Host "PFX file: $PfxFile" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 To use for signing PowerShell scripts:" -ForegroundColor Cyan
    Write-Host "   1. Import PFX: Import-PfxCertificate -FilePath '$PfxFile' -CertStoreLocation 'Cert:\CurrentUser\My'" -ForegroundColor Gray
    Write-Host "   2. Sign script: Set-AuthenticodeSignature -FilePath 'script.ps1' -Certificate (Get-ChildItem 'Cert:\CurrentUser\My' | Where Subject -Match '$DeveloperName')" -ForegroundColor Gray

} catch {
    Write-Host "❌ Error creating code signing certificate: $($_.Exception.Message)" -ForegroundColor Red
    return $false
}

return $true
