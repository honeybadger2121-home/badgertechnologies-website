# PowerShell script to remove inline styles from email templates
$templates = @(
    "tier2-manufacturing.html",
    "tier3-general-it-consultation.html", 
    "followup-security-urgency.html",
    "final-value-add.html"
)

$basePath = "c:\Users\bsherman\OneDrive - Ecker Center for Behavioral Health\Desktop\badgertechnologies-website\leads\mailchimp-templates"

foreach ($template in $templates) {
    $filePath = Join-Path $basePath $template
    if (Test-Path $filePath) {
        Write-Host "Processing $template..."
        
        $content = Get-Content $filePath -Raw
        
        # Common replacements
        $content = $content -replace 'style="margin-top: 0; color: #[^"]*"', 'class="section-title"'
        $content = $content -replace 'style="color: #2c3e50;"', 'class="section-title"'
        $content = $content -replace 'style="text-align: center; margin: 30px 0;"', 'class="button-container"'
        $content = $content -replace 'style="margin-top: 0; color: #[^"]*"', 'class="success-story-title"'
        $content = $content -replace 'style="font-size: 12px; color: #666; margin-top: 20px;"', 'class="footer-text"'
        $content = $content -replace 'style="margin-top: 15px; font-size: 11px; color: #bdc3c7;"', 'class="footer-links"'
        $content = $content -replace 'style="color: #bdc3c7;"', ''
        $content = $content -replace 'style="margin: [^"]*;"', ''
        $content = $content -replace 'style="margin-left: 20px; color: #555;"', ''
        
        Set-Content $filePath $content -NoNewline
        Write-Host "Completed $template"
    }
}

Write-Host "All templates processed!"