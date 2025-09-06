# Logo Installation Instructions

## To Replace with Your Actual Logo:

1. **Save your logo image** as `badger-logo.png` 
2. **Copy it to**: `C:\opt\badgertechnologies.it.com\images\badger-logo.png`
3. **Update the HTML files** to use `.png` instead of `.svg`

## Quick PowerShell Command to Update:
```powershell
# After saving your PNG file, run this to update all HTML files:
(Get-Content "index.html") -replace "badger-logo\.svg", "badger-logo.png" | Set-Content "index.html"
(Get-Content "assessment.html") -replace "badger-logo\.svg", "badger-logo.png" | Set-Content "assessment.html"
(Get-Content "tools.html") -replace "badger-logo\.svg", "badger-logo.png" | Set-Content "tools.html"
(Get-Content "terms.html") -replace "badger-logo\.svg", "badger-logo.png" | Set-Content "terms.html"
(Get-Content "privacy.html") -replace "badger-logo\.svg", "badger-logo.png" | Set-Content "privacy.html"
(Get-Content "sla.html") -replace "badger-logo\.svg", "badger-logo.png" | Set-Content "sla.html"
(Get-Content "thank-you.html") -replace "badger-logo\.svg", "badger-logo.png" | Set-Content "thank-you.html"
```

## Current Status:
- Using SVG placeholder version for now
- Ready to switch to your PNG logo when saved
