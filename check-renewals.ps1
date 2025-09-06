# Certificate Renewal Monitor for Badger Technologies CA
param(
    [int]$DaysBeforeExpiry = 30
)

$CAPath = "C:\BadgerCA"
$CertPath = "$CAPath\certs"

Write-Host "🔄 Checking certificates expiring within $DaysBeforeExpiry days..." -ForegroundColor Green

$ExpiringCerts = @()

Get-ChildItem -Path $CertPath -Filter "*.cert.pem" -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne "ca.cert.pem" } | ForEach-Object {
    $CertFile = $_.FullName
    try {
        $CertInfo = openssl x509 -in $CertFile -noout -dates -subject
        $Subject = ($CertInfo | Select-String "subject=").ToString().Split("=")[-1]
        $ExpiryLine = $CertInfo | Select-String "notAfter="
        
        if ($ExpiryLine) {
            $ExpiryDateStr = $ExpiryLine.ToString().Split("=", 2)[1].Trim()
            try {
                $ExpiryDate = [DateTime]::ParseExact($ExpiryDateStr, "MMM dd HH:mm:ss yyyy GMT", $null)
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
                }
            } catch {
                Write-Host "  ⚠️ Could not parse expiry date for $($_.Name)" -ForegroundColor Yellow
            }
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
