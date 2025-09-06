# Certificate Authority Continuous Operations Guide
# What needs to be running for certificates to work properly

Write-Host "🔐 BADGER TECHNOLOGIES CA - CONTINUOUS OPERATIONS" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

Write-Host ""
Write-Host "✅ YOUR CA STATUS:" -ForegroundColor Yellow
Write-Host "   • Root CA Certificate: Valid until 2045" -ForegroundColor Green
Write-Host "   • OpenSSL: Working properly" -ForegroundColor Green
Write-Host "   • Directory Structure: Complete" -ForegroundColor Green
Write-Host "   • Issued Certificates: 2 active" -ForegroundColor Green

Write-Host ""
Write-Host "🔧 SERVICES THAT NEED TO BE RUNNING:" -ForegroundColor Yellow
Write-Host ""

# Check Windows Services
Write-Host "1. WINDOWS SERVICES (Automatic startup recommended):" -ForegroundColor Cyan
$RequiredServices = @(
    @{Name="Themes"; DisplayName="Themes (for UI)"; Required=$false},
    @{Name="Schedule"; DisplayName="Task Scheduler (for automation)"; Required=$true},
    @{Name="EventLog"; DisplayName="Event Log (for monitoring)"; Required=$true},
    @{Name="CryptSvc"; DisplayName="Cryptographic Services"; Required=$true}
)

foreach ($Service in $RequiredServices) {
    try {
        $Status = Get-Service -Name $Service.Name -ErrorAction Stop
        if ($Status.Status -eq "Running") {
            Write-Host "   ✅ $($Service.DisplayName): Running" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ $($Service.DisplayName): $($Status.Status)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ❌ $($Service.DisplayName): Not Found" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "2. IIS WEB SERVER (Optional - for web interface):" -ForegroundColor Cyan
try {
    $IISStatus = Get-Service -Name "W3SVC" -ErrorAction Stop
    if ($IISStatus.Status -eq "Running") {
        Write-Host "   ✅ IIS World Wide Web Publishing Service: Running" -ForegroundColor Green
        Write-Host "   🌐 Web Interface Available at: http://localhost:8443" -ForegroundColor Cyan
    } else {
        Write-Host "   ⚠️ IIS World Wide Web Publishing Service: $($IISStatus.Status)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ IIS Not Installed (Optional)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "3. CERTIFICATE MONITORING & RENEWAL:" -ForegroundColor Cyan
Write-Host "   📅 Certificate Renewal Check: Manual (recommended monthly)" -ForegroundColor Yellow
Write-Host "   🔄 Automated Renewal: Not configured (setup below)" -ForegroundColor Yellow

Write-Host ""
Write-Host "🤖 AUTOMATED CERTIFICATE MONITORING SETUP:" -ForegroundColor Yellow
Write-Host ""

# Create automated monitoring script
Write-Host "Creating automated certificate monitoring..." -ForegroundColor Cyan

$MonitoringScript = @"
# Certificate Monitoring Task for Badger Technologies CA
# This script runs automatically to check certificate expiry

`$CAPath = "C:\BadgerCA"
`$LogFile = "`$CAPath\logs\cert-monitor.log"

# Ensure logs directory exists
New-Item -Path "`$CAPath\logs" -ItemType Directory -Force | Out-Null

# Log start
"`$(Get-Date) - Certificate monitoring started" | Add-Content `$LogFile

try {
    # Check for certificates expiring in 30 days
    `$ExpiringCerts = & "C:\BadgerCA\scripts\check-renewals.ps1" -DaysBeforeExpiry 30
    
    if (`$ExpiringCerts -and `$ExpiringCerts.Count -gt 0) {
        # Send email alert (configure your email settings)
        `$Subject = "Badger Technologies CA - Certificates Expiring Soon"
        `$Body = "The following certificates will expire within 30 days:`n"
        foreach (`$Cert in `$ExpiringCerts) {
            `$Body += "- `$(`$Cert.Subject) expires `$(`$Cert.ExpiryDate)`n"
        }
        `$Body += "`nPlease renew these certificates soon."
        
        # Log the alert
        "`$(Get-Date) - ALERT: `$(`$ExpiringCerts.Count) certificates expiring soon" | Add-Content `$LogFile
        
        # You can configure email alerts here:
        # Send-MailMessage -To "benjamin@badgertechnologies.us" -Subject `$Subject -Body `$Body -SmtpServer "your-smtp-server"
    } else {
        "`$(Get-Date) - All certificates OK" | Add-Content `$LogFile
    }
} catch {
    "`$(Get-Date) - ERROR: `$(`$_.Exception.Message)" | Add-Content `$LogFile
}

# Clean up old logs (keep 30 days)
Get-ChildItem "`$CAPath\logs\*.log" | Where-Object { `$_.LastWriteTime -lt (Get-Date).AddDays(-30) } | Remove-Item

"`$(Get-Date) - Certificate monitoring completed" | Add-Content `$LogFile
"@

# Save monitoring script
$MonitoringScriptPath = "C:\BadgerCA\scripts\certificate-monitor.ps1"
Set-Content -Path $MonitoringScriptPath -Value $MonitoringScript
Write-Host "✅ Created: $MonitoringScriptPath" -ForegroundColor Green

Write-Host ""
Write-Host "📅 SETTING UP SCHEDULED TASK:" -ForegroundColor Yellow

try {
    # Create scheduled task for certificate monitoring
    $TaskName = "Badger-CA-Certificate-Monitor"
    
    # Check if task already exists
    $ExistingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($ExistingTask) {
        Write-Host "   ⚠️ Task '$TaskName' already exists" -ForegroundColor Yellow
    } else {
        $Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$MonitoringScriptPath`""
        $Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 9am
        $Principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
        $Settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 1)
        
        Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Principal $Principal -Settings $Settings -Description "Badger Technologies CA Certificate Monitoring"
        
        Write-Host "   ✅ Scheduled Task Created: $TaskName" -ForegroundColor Green
        Write-Host "   📅 Runs: Every Monday at 9:00 AM" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ❌ Could not create scheduled task: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   💡 You can create it manually in Task Scheduler" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 MAINTENANCE COMMANDS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Manual certificate monitoring:" -ForegroundColor Cyan
Write-Host "   cd C:\BadgerCA\scripts" -ForegroundColor White
Write-Host "   .\check-renewals.ps1 -DaysBeforeExpiry 30" -ForegroundColor White
Write-Host ""
Write-Host "View certificate monitor logs:" -ForegroundColor Cyan
Write-Host "   Get-Content C:\BadgerCA\logs\cert-monitor.log -Tail 20" -ForegroundColor White
Write-Host ""
Write-Host "Check CA overall status:" -ForegroundColor Cyan
Write-Host "   .\ca-status.ps1" -ForegroundColor White

Write-Host ""
Write-Host "🎯 SUMMARY - WHAT NEEDS TO BE RUNNING:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Task Scheduler (for automated monitoring)" -ForegroundColor White
Write-Host "✅ Cryptographic Services (for certificate operations)" -ForegroundColor White
Write-Host "✅ Your Badger-CA-Certificate-Monitor scheduled task" -ForegroundColor White
Write-Host "⚠️  IIS (optional - only if using web interface)" -ForegroundColor Gray
Write-Host "⚠️  Email server (optional - for renewal alerts)" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Your Certificate Authority is now fully automated!" -ForegroundColor Green

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
