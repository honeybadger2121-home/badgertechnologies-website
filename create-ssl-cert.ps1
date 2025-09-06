# SSL Certificate Creation Script
param(
    [Parameter(Mandatory=$true)]
    [string]$CommonName,
    
    [Parameter(Mandatory=$false)]
    [string[]]$SubjectAltNames = @(),
    
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

Write-Host "🌐 Creating SSL certificate for $CommonName..." -ForegroundColor Green

$CAPath = "C:\BadgerCA"
Set-Location $CAPath

# Generate filenames
$SafeName = $CommonName -replace '\*', 'wildcard' -replace '[^\w\.]', '_'
$KeyFile = "private\$SafeName.key.pem"
$CsrFile = "requests\$SafeName.csr.pem"
$CertFile = "certs\$SafeName.cert.pem"
$PfxFile = "certs\$SafeName.pfx"

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
    $Subject = "/C=$Country/ST=$State/L=$City/O=$Organization/CN=$CommonName"
    openssl req -config badger-ca.conf -key $KeyFile -new -sha256 -out $CsrFile -subj $Subject
    if ($LASTEXITCODE -ne 0) { throw "Failed to create CSR" }

    # Handle Subject Alternative Names
    $TempConfig = "badger-ca-temp.conf"
    Copy-Item -Path "badger-ca.conf" -Destination $TempConfig

    if ($SubjectAltNames.Count -gt 0) {
        Write-Host "Adding Subject Alternative Names: $($SubjectAltNames -join ', ')"
        $AltNamesSection = "`n[alt_names_temp]`n"
        for ($i = 0; $i -lt $SubjectAltNames.Count; $i++) {
            if ($SubjectAltNames[$i] -match '^\d+\.\d+\.\d+\.\d+$') {
                $AltNamesSection += "IP.$($i + 1) = $($SubjectAltNames[$i])`n"
            } else {
                $AltNamesSection += "DNS.$($i + 1) = $($SubjectAltNames[$i])`n"
            }
        }
        Add-Content -Path $TempConfig -Value $AltNamesSection
        
        # Update server_cert section to use temp alt_names
        $ConfigContent = Get-Content $TempConfig -Raw
        $ConfigContent = $ConfigContent -replace "subjectAltName = @alt_names", "subjectAltName = @alt_names_temp"
        Set-Content -Path $TempConfig -Value $ConfigContent
    }

    # Sign the certificate
    Write-Host "Signing certificate (valid for $ValidDays days)..."
    openssl ca -config $TempConfig -extensions server_cert -days $ValidDays -notext -md sha256 -in $CsrFile -out $CertFile -batch
    if ($LASTEXITCODE -ne 0) { throw "Failed to sign certificate" }

    # Clean up temp config
    Remove-Item $TempConfig -ErrorAction SilentlyContinue

    # Create PFX file
    Write-Host "Creating PFX file..."
    Write-Host "You will be prompted to enter a password for the PFX file." -ForegroundColor Yellow
    openssl pkcs12 -export -out $PfxFile -inkey $KeyFile -in $CertFile -certfile certs\ca.cert.pem
    if ($LASTEXITCODE -ne 0) { throw "Failed to create PFX file" }

    # Verify certificate
    Write-Host "Verifying certificate..."
    $CertInfo = openssl x509 -in $CertFile -noout -text | Select-String "Subject:", "DNS:", "IP Address:", "Not Before", "Not After"
    $CertInfo | ForEach-Object { Write-Host "  $_" -ForegroundColor Cyan }

    Write-Host "✅ SSL Certificate created successfully!" -ForegroundColor Green
    Write-Host "Certificate file: $CertFile" -ForegroundColor Yellow
    Write-Host "Private key file: $KeyFile" -ForegroundColor Yellow
    Write-Host "PFX file: $PfxFile" -ForegroundColor Yellow

} catch {
    Write-Host "❌ Error creating SSL certificate: $($_.Exception.Message)" -ForegroundColor Red
    return $false
}

return $true
