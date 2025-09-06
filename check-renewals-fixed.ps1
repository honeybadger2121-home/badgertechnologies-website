# Certificate Renewal Monitor for Badger Technologies CA - FIXED VERSION
param(
    [int]$DaysBeforeExpiry = 30
)

$CAPath = "C:\BadgerCA"
$CertPath = "$CAPath\certs"

Write-Host "🔄 Checking certificates expiring within $DaysBeforeExpiry days..." -ForegroundColor Green

$ExpiringCerts = @()

# Add OpenSSL to PATH if needed
if (-not (Get-Command openssl -ErrorAction SilentlyContinue)) {
    $env:PATH += ";C:\Program Files\OpenSSL-Win64\bin"
}

Get-ChildItem -Path $CertPath -Filter "*.cert.pem" -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne "ca.cert.pem" } | ForEach-Object {
    $CertFile = $_.FullName
    
    # Check if file has content
    if ($_.Length -eq 0) {
        Write-Host "  ⚠️ Empty certificate file: $($_.Name)" -ForegroundColor Yellow
        return
    }
    
    try {
        # Test if file is a valid certificate first
        $TestCmd = openssl x509 -in $CertFile -noout -text 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  ⚠️ Invalid certificate format: $($_.Name)" -ForegroundColor Yellow
            return
        }
        
        $CertInfo = openssl x509 -in $CertFile -noout -dates -subject 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  ⚠️ Could not read certificate: $($_.Name)" -ForegroundColor Yellow
            return
        }
        
        # Parse subject
        $SubjectLine = $CertInfo | Select-String "subject="
        if ($SubjectLine) {
            $Subject = $SubjectLine.ToString().Split("=", 2)[1].Trim()
            # Extract Common Name if available
            if ($Subject -match "CN=([^,]+)") {
                $Subject = $matches[1]
            }
        } else {
            $Subject = "Unknown"
        }
        
        # Parse expiry date
        $ExpiryLine = $CertInfo | Select-String "notAfter="
        
        if ($ExpiryLine) {
            $ExpiryDateStr = $ExpiryLine.ToString().Split("=", 2)[1].Trim()
            try {
                # Try different date formats
                $ExpiryDate = $null
                $DateFormats = @(
                    "MMM dd HH:mm:ss yyyy GMT",
                    "MMM  d HH:mm:ss yyyy GMT", 
                    "MMM dd HH:mm:ss yyyy 'GMT'",
                    "MMM  d HH:mm:ss yyyy 'GMT'"
                )
                
                foreach ($Format in $DateFormats) {
                    try {
                        $ExpiryDate = [DateTime]::ParseExact($ExpiryDateStr, $Format, $null)
                        break
                    } catch {
                        continue
                    }
                }
                
                if (-not $ExpiryDate) {
                    Write-Host "  ⚠️ Could not parse date format: $ExpiryDateStr for $($_.Name)" -ForegroundColor Yellow
                    return
                }
                
                $DaysLeft = ($ExpiryDate - (Get-Date)).Days
                
                if ($DaysLeft -le $DaysBeforeExpiry) {
                    $ExpiringCert = [PSCustomObject]@{
                        File = $_.Name
                        Subject = $Subject
                        ExpiryDate = $ExpiryDate
                        DaysLeft = $DaysLeft
                    }
                    $ExpiringCerts += $ExpiringCert
                    
                    if ($DaysLeft -le 0) {
                        Write-Host "  🔴 EXPIRED: $($_.BaseName) - $Subject" -ForegroundColor Red
                    } elseif ($DaysLeft -le 7) {
                        Write-Host "  🟠 CRITICAL: $($_.BaseName) expires in $DaysLeft days - $Subject" -ForegroundColor Red
                    } else {
                        Write-Host "  🟡 WARNING: $($_.BaseName) expires in $DaysLeft days - $Subject" -ForegroundColor Yellow
                    }
                } else {
                    Write-Host "  ✅ OK: $($_.BaseName) - $Subject (expires in $DaysLeft days)" -ForegroundColor Green
                }
            } catch {
                Write-Host "  ⚠️ Could not parse expiry date for $($_.Name): $($_.Exception.Message)" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  ⚠️ No expiry date found in $($_.Name)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ❌ Error reading $($_.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

if ($ExpiringCerts.Count -eq 0) {
    Write-Host "✅ No certificates expiring within $DaysBeforeExpiry days" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "📧 Consider renewing these certificates:" -ForegroundColor Yellow
    $ExpiringCerts | ForEach-Object {
        Write-Host "   - $($_.File): $($_.Subject) (expires $($_.ExpiryDate.ToString('yyyy-MM-dd')))" -ForegroundColor Gray
    }
}

return $ExpiringCerts
