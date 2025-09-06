# Phase 5: Setup Web Interface
# Run this after Phase 4 completes

Write-Host "🌐 Phase 5: Setting up web interface..." -ForegroundColor Green

$CAPath = "C:\BadgerCA"
$WebPath = "$CAPath\web"

# Copy web interface files
Write-Host "Copying web interface files..."
Copy-Item -Path "C:\opt\badgertechnologies.it.com\ca-web-interface.html" -Destination "$WebPath\index.html" -Force

# Configure IIS website
Write-Host "Configuring IIS for Certificate Authority web interface..."

# Import WebAdministration module
Import-Module WebAdministration -ErrorAction SilentlyContinue

try {
    # Remove default website
    Remove-Website -Name "Default Web Site" -ErrorAction SilentlyContinue
    
    # Create CA website
    New-Website -Name "BadgerCA" -Port 8443 -PhysicalPath $WebPath -ErrorAction SilentlyContinue
    
    # Set directory browsing off
    Set-WebConfiguration -Filter "system.webServer/directoryBrowse" -PSPath "MACHINE/WEBROOT/APPHOST/BadgerCA" -Value @{enabled=$false}
    
    # Set default document
    Clear-WebConfiguration -Filter "system.webServer/defaultDocument/files" -PSPath "MACHINE/WEBROOT/APPHOST/BadgerCA"
    Add-WebConfiguration -Filter "system.webServer/defaultDocument/files" -PSPath "MACHINE/WEBROOT/APPHOST/BadgerCA" -Value @{value="index.html"}
    
    Write-Host "✅ IIS website 'BadgerCA' created on port 8443" -ForegroundColor Green
    
} catch {
    Write-Host "⚠️ Could not configure IIS automatically: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "You can manually browse to: $WebPath\index.html" -ForegroundColor Gray
}

# Create firewall rule
Write-Host "Creating firewall rule for port 8443..."
try {
    New-NetFirewallRule -DisplayName "Badger CA Web Interface" -Direction Inbound -Protocol TCP -LocalPort 8443 -Action Allow -ErrorAction SilentlyContinue
    Write-Host "✅ Firewall rule created for port 8443" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not create firewall rule. You may need to do this manually." -ForegroundColor Yellow
}

# Create simple PowerShell web server as backup
$WebServerScript = @"
# Simple PowerShell web server for Badger CA
# Run this if IIS is not available

Add-Type -AssemblyName System.Net.Http
Add-Type -AssemblyName System.Web

`$listener = New-Object System.Net.HttpListener
`$listener.Prefixes.Add('http://localhost:8443/')
`$listener.Start()

Write-Host "🌐 Badger CA Web Server started at http://localhost:8443" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow

try {
    while (`$listener.IsListening) {
        `$context = `$listener.GetContext()
        `$request = `$context.Request
        `$response = `$context.Response
        
        `$path = `$request.Url.AbsolutePath
        
        if (`$path -eq '/' -or `$path -eq '/index.html') {
            `$content = Get-Content 'C:\BadgerCA\web\index.html' -Raw
            `$buffer = [System.Text.Encoding]::UTF8.GetBytes(`$content)
            `$response.ContentType = 'text/html; charset=utf-8'
        } else {
            `$content = '<h1>404 - Not Found</h1>'
            `$buffer = [System.Text.Encoding]::UTF8.GetBytes(`$content)
            `$response.StatusCode = 404
            `$response.ContentType = 'text/html; charset=utf-8'
        }
        
        `$response.ContentLength64 = `$buffer.Length
        `$response.OutputStream.Write(`$buffer, 0, `$buffer.Length)
        `$response.OutputStream.Close()
    }
} finally {
    `$listener.Stop()
    Write-Host "Web server stopped" -ForegroundColor Red
}
"@

Set-Content -Path "$WebPath\start-web-server.ps1" -Value $WebServerScript

Write-Host ""
Write-Host "✅ Phase 5 complete! Web interface is ready." -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access your CA web interface at:" -ForegroundColor Cyan
Write-Host "   Primary: http://localhost:8443 (if IIS is working)" -ForegroundColor White
Write-Host "   Backup:  Run C:\BadgerCA\web\start-web-server.ps1 for PowerShell server" -ForegroundColor White
Write-Host ""
Write-Host "📁 Web files location: $WebPath" -ForegroundColor Gray
