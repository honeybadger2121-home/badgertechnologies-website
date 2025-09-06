# Phase 4: Create Certificate Management Scripts - FIXED VERSION
# Run this after Phase 3 completes

Write-Host "📋 Phase 4: Setting up certificate management scripts..." -ForegroundColor Green

$CAPath = "C:\BadgerCA"
$ScriptsPath = "$CAPath\scripts"

# Copy scripts to CA directory
Write-Host "Copying certificate creation scripts..."
Copy-Item -Path "C:\opt\badgertechnologies.it.com\create-ssl-cert.ps1" -Destination "$ScriptsPath\" -Force
Copy-Item -Path "C:\opt\badgertechnologies.it.com\create-client-cert.ps1" -Destination "$ScriptsPath\" -Force
Copy-Item -Path "C:\opt\badgertechnologies.it.com\create-codesign-cert.ps1" -Destination "$ScriptsPath\" -Force

Write-Host "✅ Certificate management scripts copied:" -ForegroundColor Green
Write-Host "  📄 create-ssl-cert.ps1 - Create SSL/TLS certificates"
Write-Host "  👤 create-client-cert.ps1 - Create client authentication certificates"  
Write-Host "  📝 create-codesign-cert.ps1 - Create code signing certificates"

Write-Host ""
Write-Host "🎯 Phase 4 complete! Certificate management ready." -ForegroundColor Green
