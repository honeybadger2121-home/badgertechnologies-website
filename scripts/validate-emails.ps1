param(
    [string]$Path = "",
    [string]$Out = "",
    [switch]$SmtpProbe
)

function Test-EmailSyntax {
    param([string]$Email)
    try {
        $null = [System.Net.Mail.MailAddress]::new($Email)
        return $true
    } catch {
        return $false
    }
}

function Get-DomainFromEmail {
    param([string]$Email)
    if (-not $Email -or ($Email -notmatch '@')) { return $null }
    $parts = $Email.Split('@')
    return $parts[-1].Trim()
}

function Get-MxRecords {
    param([string]$Domain)
    try {
        $mx = Resolve-DnsName -Name $Domain -Type MX -ErrorAction SilentlyContinue
        return $mx
    } catch {
        return $null
    }
}

function Get-ARecords {
    param([string]$Domain)
    try {
        $a = Resolve-DnsName -Name $Domain -Type A -ErrorAction SilentlyContinue
        return $a
    } catch {
        return $null
    }
}

function Test-SmtpPortOpen {
    param([string]$Host)
    try {
        $result = Test-NetConnection -ComputerName $Host -Port 25 -InformationLevel Quiet
        return [bool]$result
    } catch {
        return $false
    }
}

if (-not $Path -or -not (Test-Path -LiteralPath $Path)) {
    Write-Error "Input file not found: $Path"
    exit 1
}

if (-not $Out) {
    $Out = Join-Path (Split-Path -Parent $Path) "email-validation.csv"
}

$emails = Get-Content -LiteralPath $Path | ForEach-Object { $_.Trim() } | Where-Object { $_ } | ForEach-Object { $_ }
# Case-insensitive dedupe while preserving first occurrence
$emails = ($emails | Group-Object { $_.ToLowerInvariant() } | ForEach-Object { $_.Group[0] })

$results = @()
$counts = [ordered]@{
    total = 0
    syntax_invalid = 0
    domain_unresolvable = 0
    no_mx = 0
    ok = 0
    smtp_closed = 0
}

foreach ($email in $emails) {
    $counts.total++
    $syntaxOk = Test-EmailSyntax -Email $email
    $domain = Get-DomainFromEmail -Email $email
    $mx = $null
    $a = $null
    $hasMx = $false
    $hasA = $false
    $mxHosts = @()
    $smtpOpen = $null

    if ($syntaxOk -and $domain) {
        $mx = Get-MxRecords -Domain $domain
        if ($mx) {
            # Some PowerShell versions include additional A/AAAA records in MX lookups;
            # filter only records that actually have a NameExchange property.
            $mxHosts = ($mx | Where-Object { $_.PSObject.Properties["NameExchange"] -ne $null } | Select-Object -ExpandProperty NameExchange)
            $hasMx = ($mxHosts -and $mxHosts.Count -gt 0)
        }
        $a = Get-ARecords -Domain $domain
        $hasA = ($a -and $a.Count -gt 0)

        if ($SmtpProbe -and $hasMx) {
            foreach ($host in $mxHosts) {
                if (Test-SmtpPortOpen -Host $host) { $smtpOpen = $true; break }
            }
            if (-not $smtpOpen) { $smtpOpen = $false }
        }
    }

    $status = ""
    if (-not $syntaxOk) {
        $counts.syntax_invalid++
        $status = "invalid-syntax"
    } elseif (-not $hasMx -and -not $hasA) {
        $counts.domain_unresolvable++
        $status = "domain-not-resolvable"
    } elseif (-not $hasMx) {
        $counts.no_mx++
        $status = "no-mx"
    } else {
        $counts.ok++
        $status = "ok"
        if ($SmtpProbe -and $smtpOpen -eq $false) {
            $counts.smtp_closed++
            $status = "mx-port-closed"
        }
    }

    $results += [pscustomobject]@{
        email = $email
        localPart = ($email.Split('@')[0])
        domain = $domain
        isSyntaxValid = $syntaxOk
        hasMx = $hasMx
        hasARecord = $hasA
        mxHosts = ($mxHosts -join ';')
        smtpPort25Open = if ($SmtpProbe) { $smtpOpen } else { $null }
        status = $status
    }
}

$dir = Split-Path -Parent $Out
if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
$results | Export-Csv -Path $Out -NoTypeInformation -Encoding UTF8

Write-Host ("Total: {0}" -f $counts.total)
Write-Host ("OK: {0}" -f $counts.ok)
Write-Host ("Invalid syntax: {0}" -f $counts.syntax_invalid)
Write-Host ("Domain unresolvable: {0}" -f $counts.domain_unresolvable)
Write-Host ("No MX: {0}" -f $counts.no_mx)
if ($SmtpProbe) { Write-Host ("MX port closed: {0}" -f $counts.smtp_closed) }

Write-Host "Output -> $Out"