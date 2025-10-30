# PowerShell script to fix common Markdown linting issues
# Fixes MD022 (blanks around headings), MD032 (blanks around lists), MD034 (bare URLs)

Write-Host "Starting Markdown linting fixes..." -ForegroundColor Green

# Get all markdown files
$markdownFiles = Get-ChildItem -Path "." -Filter "*.md" -Recurse

foreach ($file in $markdownFiles) {
    Write-Host "Processing: $($file.FullName)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix MD022: Add blank lines around headings
    # Add blank line before headings (but not at start of file)
    $content = $content -replace '(?<!^|\n\n)(\n)(#{1,6}\s)', "`n`n`$2"
    
    # Add blank line after headings
    $content = $content -replace '(#{1,6}[^\n]*\n)(?!\n)', "`$1`n"
    
    # Fix MD032: Add blank lines around lists
    # Add blank line before lists (but not at start of file)
    $content = $content -replace '(?<!^|\n\n)(\n)([-\*\+]\s|[0-9]+\.\s)', "`n`n`$2"
    
    # Add blank line after lists
    $content = $content -replace '((?:^|\n)(?:[-\*\+]|\d+\.)\s[^\n]*(?:\n(?:[-\*\+]|\d+\.)\s[^\n]*)*)\n(?!\n|[-\*\+]|\d+\.)', "`$1`n`n"
    
    # Fix MD034: Convert bare URLs to markdown links
    # Email addresses
    $content = $content -replace '\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?!\]\(|\))', '[$1](mailto:$1)'
    
    # Clean up multiple consecutive blank lines (max 2)
    $content = $content -replace '\n{3,}', "`n`n"
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "  No changes: $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host "Markdown linting fixes completed!" -ForegroundColor Green
Write-Host "Note: Some issues may require manual review (duplicate headings, emphasis as headings, etc.)" -ForegroundColor Yellow