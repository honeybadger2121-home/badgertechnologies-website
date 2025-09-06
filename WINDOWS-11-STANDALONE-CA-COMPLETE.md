# 🏢 Windows 11 Standalone Certificate Authority - Complete Setup

## 🎯 **Badger Technologies CA for Windows 11 Standalone**

This guide sets up a complete certificate authority on Windows 11 for:
- ✅ **SSL/TLS certificates** for websites and services
- ✅ **Client authentication** certificates for secure access
- ✅ **Code signing** certificates for applications
- ✅ **Email encryption** certificates (S/MIME)

---

## 🚀 **Step 1: Enable Windows Features**

### **Run in Administrator PowerShell:**
```powershell
# Enable IIS and required features for Windows 11
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole -All
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServer -All
Enable-WindowsOptionalFeature -Online -FeatureName IIS-CommonHttpFeatures -All
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpErrors -All
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpLogging -All
Enable-WindowsOptionalFeature -Online -FeatureName IIS-Security -All
Enable-WindowsOptionalFeature -Online -FeatureName IIS-RequestFiltering -All
Enable-WindowsOptionalFeature -Online -FeatureName IIS-StaticContent -All
Enable-WindowsOptionalFeature -Online -FeatureName IIS-ASPNET45 -All

# Install Certificate Services (Windows 11 method)
Enable-WindowsOptionalFeature -Online -FeatureName CertificateServices -All

# Restart required after feature installation
Restart-Computer
```

---

## 🔧 **Step 2: Manual CA Configuration (Windows 11)**

Since Windows 11 doesn't have full AD CS PowerShell cmdlets, we'll use a hybrid approach:

### **Create CA Directory Structure:**
```powershell
# Create CA directories
$CAPath = "C:\BadgerCA"
New-Item -Path $CAPath -ItemType Directory -Force
New-Item -Path "$CAPath\certs" -ItemType Directory -Force
New-Item -Path "$CAPath\crl" -ItemType Directory -Force
New-Item -Path "$CAPath\newcerts" -ItemType Directory -Force
New-Item -Path "$CAPath\private" -ItemType Directory -Force
New-Item -Path "$CAPath\requests" -ItemType Directory -Force

# Set permissions
icacls "$CAPath\private" /grant:r "$($env:USERNAME):(F)" /inheritance:r
```

### **Create OpenSSL Configuration for Windows:**
Create `C:\BadgerCA\badger-ca.conf`:

```ini
# Badger Technologies CA Configuration
HOME = C:\BadgerCA
RANDFILE = $ENV::HOME\private\.rnd

[ca]
default_ca = CA_default

[CA_default]
dir = C:\BadgerCA
certs = $dir\certs
crl_dir = $dir\crl
new_certs_dir = $dir\newcerts
database = $dir\index.txt
serial = $dir\serial
RANDFILE = $dir\private\.rand

private_key = $dir\private\ca.key.pem
certificate = $dir\certs\ca.cert.pem

crlnumber = $dir\crlnumber
crl = $dir\crl\ca.crl.pem
crl_extensions = crl_ext
default_crl_days = 30

default_md = sha256
name_opt = ca_default
cert_opt = ca_default
default_days = 365
preserve = no
policy = policy_strict

[policy_strict]
countryName = match
stateOrProvinceName = match
organizationName = match
organizationalUnitName = optional
commonName = supplied
emailAddress = optional

[policy_loose]
countryName = optional
stateOrProvinceName = optional
localityName = optional
organizationName = optional
organizationalUnitName = optional
commonName = supplied
emailAddress = optional

[req]
default_bits = 2048
distinguished_name = req_distinguished_name
string_mask = utf8only
default_md = sha256
x509_extensions = v3_ca

[req_distinguished_name]
countryName = Country Name (2 letter code)
countryName_default = US
stateOrProvinceName = State or Province Name
stateOrProvinceName_default = Illinois
localityName = Locality Name
localityName_default = Chicago
0.organizationName = Organization Name
0.organizationName_default = Badger Technologies
organizationalUnitName = Organizational Unit Name
commonName = Common Name
emailAddress = Email Address
emailAddress_default = benjamin@badgertechnologies.us

[v3_ca]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical,CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[v3_intermediate_ca]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

# SSL/TLS Server Certificate Extensions
[server_cert]
basicConstraints = CA:FALSE
nsCertType = server
nsComment = "Badger Technologies SSL Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer:always
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

# Client Authentication Certificate Extensions
[client_cert]
basicConstraints = CA:FALSE
nsCertType = client, email
nsComment = "Badger Technologies Client Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
keyUsage = critical, nonRepudiation, digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth, emailProtection

# Code Signing Certificate Extensions
[codesign_cert]
basicConstraints = CA:FALSE
nsComment = "Badger Technologies Code Signing Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
keyUsage = critical, digitalSignature
extendedKeyUsage = codeSigning

# Email Certificate Extensions
[email_cert]
basicConstraints = CA:FALSE
nsComment = "Badger Technologies Email Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = emailProtection, clientAuth

[crl_ext]
authorityKeyIdentifier=keyid:always

[alt_names]
DNS.1 = localhost
DNS.2 = *.badgertechnologies.us
DNS.3 = badgertechnologies.us
DNS.4 = *.local
IP.1 = 127.0.0.1
IP.2 = ::1
```

---

## 🔐 **Step 3: Install OpenSSL for Windows**

```powershell
# Download and install OpenSSL
$OpenSSLUrl = "https://slproweb.com/download/Win64OpenSSL-3_1_3.exe"
$OpenSSLPath = "$env:TEMP\OpenSSL-Win64.exe"

# Download OpenSSL
Invoke-WebRequest -Uri $OpenSSLUrl -OutFile $OpenSSLPath

# Install OpenSSL (run the installer)
Start-Process -FilePath $OpenSSLPath -Wait

# Add OpenSSL to PATH
$env:PATH += ";C:\Program Files\OpenSSL-Win64\bin"
[Environment]::SetEnvironmentVariable("PATH", $env:PATH, "Machine")
```

### **Alternative: Use Chocolatey**
```powershell
# Install Chocolatey package manager
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install OpenSSL via Chocolatey
choco install openssl -y
```

---

## 🏗️ **Step 4: Create Root Certificate Authority**

```powershell
# Navigate to CA directory
cd C:\BadgerCA

# Initialize database files
New-Item -Path "index.txt" -ItemType File -Force
Set-Content -Path "serial" -Value "1000"
Set-Content -Path "crlnumber" -Value "1000"

# Generate CA private key (4096-bit for security)
openssl genrsa -aes256 -out private\ca.key.pem 4096

# Create CA certificate (20-year validity)
openssl req -config badger-ca.conf -key private\ca.key.pem -new -x509 -days 7300 -sha256 -extensions v3_ca -out certs\ca.cert.pem

# Verify CA certificate
openssl x509 -noout -text -in certs\ca.cert.pem

# Install CA certificate to Windows trusted root store
certutil -addstore -f "ROOT" certs\ca.cert.pem
```

---

## 🌐 **Step 5: Create Certificate Templates and Scripts**

### **SSL Certificate Creation Script:**
Create `C:\BadgerCA\scripts\create-ssl-cert.ps1`:

```powershell
param(
    [Parameter(Mandatory=$true)]
    [string]$CommonName,
    
    [Parameter(Mandatory=$false)]
    [string[]]$SubjectAltNames = @(),
    
    [Parameter(Mandatory=$false)]
    [int]$ValidDays = 365
)

$CAPath = "C:\BadgerCA"
Set-Location $CAPath

# Create private key
$KeyFile = "private\$CommonName.key.pem"
$CsrFile = "requests\$CommonName.csr.pem"  
$CertFile = "certs\$CommonName.cert.pem"

# Generate private key
openssl genrsa -out $KeyFile 2048

# Create certificate signing request
$Subject = "/C=US/ST=Illinois/L=Chicago/O=Badger Technologies/CN=$CommonName"
openssl req -config badger-ca.conf -key $KeyFile -new -sha256 -out $CsrFile -subj $Subject

# Update alt_names section if provided
if ($SubjectAltNames.Count -gt 0) {
    $AltNamesSection = ""
    for ($i = 0; $i -lt $SubjectAltNames.Count; $i++) {
        $AltNamesSection += "DNS.$($i + 5) = $($SubjectAltNames[$i])`n"
    }
    
    # Append to config file temporarily
    Add-Content -Path "badger-ca.conf" -Value $AltNamesSection
}

# Sign the certificate
openssl ca -config badger-ca.conf -extensions server_cert -days $ValidDays -notext -md sha256 -in $CsrFile -out $CertFile -batch

# Create PFX file for Windows
$PfxFile = "certs\$CommonName.pfx"
openssl pkcs12 -export -out $PfxFile -inkey $KeyFile -in $CertFile -certfile certs\ca.cert.pem

Write-Host "SSL Certificate created for $CommonName"
Write-Host "Certificate: $CertFile"
Write-Host "Private Key: $KeyFile"
Write-Host "PFX File: $PfxFile"
```

### **Client Certificate Creation Script:**
Create `C:\BadgerCA\scripts\create-client-cert.ps1`:

```powershell
param(
    [Parameter(Mandatory=$true)]
    [string]$ClientName,
    
    [Parameter(Mandatory=$true)]
    [string]$EmailAddress,
    
    [Parameter(Mandatory=$false)]
    [int]$ValidDays = 365
)

$CAPath = "C:\BadgerCA"
Set-Location $CAPath

$KeyFile = "private\$ClientName.key.pem"
$CsrFile = "requests\$ClientName.csr.pem"
$CertFile = "certs\$ClientName.cert.pem"

# Generate private key
openssl genrsa -out $KeyFile 2048

# Create certificate signing request
$Subject = "/C=US/ST=Illinois/L=Chicago/O=Badger Technologies/CN=$ClientName/emailAddress=$EmailAddress"
openssl req -config badger-ca.conf -key $KeyFile -new -sha256 -out $CsrFile -subj $Subject

# Sign the certificate for client authentication
openssl ca -config badger-ca.conf -extensions client_cert -days $ValidDays -notext -md sha256 -in $CsrFile -out $CertFile -batch

# Create PFX file
$PfxFile = "certs\$ClientName.pfx"
openssl pkcs12 -export -out $PfxFile -inkey $KeyFile -in $CertFile -certfile certs\ca.cert.pem

Write-Host "Client Certificate created for $ClientName"
Write-Host "Email: $EmailAddress"
Write-Host "PFX File: $PfxFile"
```

### **Code Signing Certificate Script:**
Create `C:\BadgerCA\scripts\create-codesign-cert.ps1`:

```powershell
param(
    [Parameter(Mandatory=$true)]
    [string]$DeveloperName,
    
    [Parameter(Mandatory=$false)]
    [int]$ValidDays = 1095
)

$CAPath = "C:\BadgerCA"
Set-Location $CAPath

$KeyFile = "private\$DeveloperName-codesign.key.pem"
$CsrFile = "requests\$DeveloperName-codesign.csr.pem"
$CertFile = "certs\$DeveloperName-codesign.cert.pem"

# Generate private key
openssl genrsa -out $KeyFile 2048

# Create certificate signing request
$Subject = "/C=US/ST=Illinois/L=Chicago/O=Badger Technologies/CN=$DeveloperName Code Signing"
openssl req -config badger-ca.conf -key $KeyFile -new -sha256 -out $CsrFile -subj $Subject

# Sign the certificate for code signing
openssl ca -config badger-ca.conf -extensions codesign_cert -days $ValidDays -notext -md sha256 -in $CsrFile -out $CertFile -batch

# Create PFX file
$PfxFile = "certs\$DeveloperName-codesign.pfx"
openssl pkcs12 -export -out $PfxFile -inkey $KeyFile -in $CertFile -certfile certs\ca.cert.pem

Write-Host "Code Signing Certificate created for $DeveloperName"
Write-Host "PFX File: $PfxFile"
```

---

## 📧 **Step 6: Web Interface for Certificate Management**

Create `C:\BadgerCA\web\index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Badger Technologies Certificate Authority</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-8 mx-auto">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h3><i class="fas fa-certificate"></i> Badger Technologies Certificate Authority</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h5>SSL/TLS Certificates</h5>
                                <form action="/create-ssl" method="post">
                                    <div class="mb-3">
                                        <label class="form-label">Common Name</label>
                                        <input type="text" name="commonName" class="form-control" placeholder="server.badgertechnologies.us" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Subject Alternative Names</label>
                                        <input type="text" name="altNames" class="form-control" placeholder="www.example.com,api.example.com">
                                    </div>
                                    <button type="submit" class="btn btn-primary">Create SSL Certificate</button>
                                </form>
                            </div>
                            
                            <div class="col-md-6">
                                <h5>Client Certificates</h5>
                                <form action="/create-client" method="post">
                                    <div class="mb-3">
                                        <label class="form-label">Client Name</label>
                                        <input type="text" name="clientName" class="form-control" placeholder="John Doe" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Email Address</label>
                                        <input type="email" name="email" class="form-control" placeholder="john@badgertechnologies.us" required>
                                    </div>
                                    <button type="submit" class="btn btn-success">Create Client Certificate</button>
                                </form>
                            </div>
                        </div>
                        
                        <hr>
                        
                        <div class="row mt-4">
                            <div class="col-md-6">
                                <h5>Code Signing Certificate</h5>
                                <form action="/create-codesign" method="post">
                                    <div class="mb-3">
                                        <label class="form-label">Developer Name</label>
                                        <input type="text" name="developerName" class="form-control" placeholder="Badger Technologies" required>
                                    </div>
                                    <button type="submit" class="btn btn-warning">Create Code Signing Certificate</button>
                                </form>
                            </div>
                            
                            <div class="col-md-6">
                                <h5>Download CA Certificate</h5>
                                <p>Install this on client machines to trust certificates from this CA.</p>
                                <a href="/ca-cert" class="btn btn-info">Download CA Certificate</a>
                                <a href="/crl" class="btn btn-secondary">Download CRL</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

### **Python Web Interface (Optional):**
Create `C:\BadgerCA\ca-web-server.py`:

```python
from flask import Flask, request, render_template, send_file, redirect
import subprocess
import os

app = Flask(__name__)
app.config['CA_PATH'] = 'C:\\BadgerCA'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create-ssl', methods=['POST'])
def create_ssl():
    common_name = request.form['commonName']
    alt_names = request.form.get('altNames', '').split(',')
    
    # Run PowerShell script
    cmd = f'powershell -ExecutionPolicy Bypass -File "C:\\BadgerCA\\scripts\\create-ssl-cert.ps1" -CommonName "{common_name}"'
    subprocess.run(cmd, shell=True)
    
    return redirect('/')

@app.route('/ca-cert')
def download_ca_cert():
    return send_file('C:\\BadgerCA\\certs\\ca.cert.pem', as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8443, ssl_context='adhoc')
```

---

## 🔧 **Step 7: Automated Management Scripts**

### **Certificate Renewal Script:**
Create `C:\BadgerCA\scripts\renew-expiring-certs.ps1`:

```powershell
param(
    [int]$DaysBeforeExpiry = 30
)

$CAPath = "C:\BadgerCA"
$CertPath = "$CAPath\certs"

# Find expiring certificates
Get-ChildItem -Path $CertPath -Filter "*.cert.pem" | ForEach-Object {
    $CertFile = $_.FullName
    $CertInfo = openssl x509 -in $CertFile -noout -dates
    
    # Parse expiry date
    $ExpiryLine = $CertInfo -split "`n" | Where-Object { $_ -match "notAfter" }
    if ($ExpiryLine) {
        $ExpiryDate = [DateTime]::Parse(($ExpiryLine -split "=")[1])
        $DaysLeft = ($ExpiryDate - (Get-Date)).Days
        
        if ($DaysLeft -le $DaysBeforeExpiry) {
            Write-Host "Certificate $($_.BaseName) expires in $DaysLeft days - renewal needed"
            # Add renewal logic here
        }
    }
}
```

### **CA Status Monitor:**
Create `C:\BadgerCA\scripts\ca-status-monitor.ps1`:

```powershell
# CA Health Check for Windows 11
$CAPath = "C:\BadgerCA"

# Check directory structure
$RequiredDirs = @("certs", "crl", "private", "newcerts", "requests")
foreach ($Dir in $RequiredDirs) {
    $Path = "$CAPath\$Dir"
    if (Test-Path $Path) {
        Write-Host "✓ Directory $Dir exists"
    } else {
        Write-Host "✗ Directory $Dir missing" -ForegroundColor Red
    }
}

# Check CA certificate validity
$CACert = "$CAPath\certs\ca.cert.pem"
if (Test-Path $CACert) {
    $CertInfo = openssl x509 -in $CACert -noout -dates
    Write-Host "✓ CA Certificate: $CertInfo"
} else {
    Write-Host "✗ CA Certificate missing" -ForegroundColor Red
}

# Check disk space
$Drive = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'"
$FreeSpaceGB = [math]::Round($Drive.FreeSpace / 1GB, 2)
Write-Host "💾 Free disk space: $FreeSpaceGB GB"

# List issued certificates
$IssuedCerts = Get-ChildItem -Path "$CAPath\certs" -Filter "*.cert.pem" | Where-Object { $_.Name -ne "ca.cert.pem" }
Write-Host "📋 Issued certificates: $($IssuedCerts.Count)"
```

---

## 📋 **Step 8: Daily Operations**

### **Create certificates for common scenarios:**

#### **1. Create SSL certificate for your website:**
```powershell
C:\BadgerCA\scripts\create-ssl-cert.ps1 -CommonName "badgertechnologies.us" -SubjectAltNames @("www.badgertechnologies.us", "api.badgertechnologies.us")
```

#### **2. Create client certificate for user:**
```powershell
C:\BadgerCA\scripts\create-client-cert.ps1 -ClientName "Benjamin" -EmailAddress "benjamin@badgertechnologies.us"
```

#### **3. Create code signing certificate:**
```powershell
C:\BadgerCA\scripts\create-codesign-cert.ps1 -DeveloperName "BadgerTech"
```

### **Install certificates on local machine:**
```powershell
# Install client certificate
certutil -user -importpfx "C:\BadgerCA\certs\Benjamin.pfx"

# Install SSL certificate for IIS
Import-PfxCertificate -FilePath "C:\BadgerCA\certs\badgertechnologies.us.pfx" -CertStoreLocation "Cert:\LocalMachine\My"
```

---

## 🎯 **Step 9: Integration Examples**

### **Use SSL certificate in IIS:**
```powershell
# Import certificate to IIS
Import-Module WebAdministration
$Cert = Import-PfxCertificate -FilePath "C:\BadgerCA\certs\badgertechnologies.us.pfx" -CertStoreLocation "Cert:\LocalMachine\My"

# Bind to website
New-WebBinding -Name "Default Web Site" -Protocol "https" -Port 443 -HostHeader "badgertechnologies.us" -SslFlags 1
$Binding = Get-WebBinding -Name "Default Web Site" -Protocol "https" -Port 443
$Binding.AddSslCertificate($Cert.Thumbprint, "my")
```

### **Use client certificate for authentication:**
```powershell
# Configure IIS for client certificate authentication
Set-WebConfiguration -PSPath "MACHINE/WEBROOT/APPHOST/Default Web Site" -Filter "system.webServer/security/authentication/clientCertificateMappingAuthentication" -Value @{enabled=$true}
```

### **Sign PowerShell scripts:**
```powershell
# Sign a PowerShell script with your code signing certificate
$Cert = Get-ChildItem -Path "Cert:\CurrentUser\My" | Where-Object { $_.Subject -match "BadgerTech Code Signing" }
Set-AuthenticodeSignature -FilePath "script.ps1" -Certificate $Cert
```

---

## ✅ **Final Setup Checklist:**

- [ ] **OpenSSL installed** and in PATH
- [ ] **CA directory structure** created
- [ ] **Root CA certificate** generated and installed
- [ ] **Certificate creation scripts** configured
- [ ] **Web interface** (optional) set up
- [ ] **Management scripts** in place
- [ ] **Test certificates** created successfully
- [ ] **CA certificate distributed** to client machines

---

## 🚀 **Quick Start Commands:**

```powershell
# Create SSL certificate
.\scripts\create-ssl-cert.ps1 -CommonName "test.badgertechnologies.us"

# Create client certificate  
.\scripts\create-client-cert.ps1 -ClientName "TestUser" -EmailAddress "test@badgertechnologies.us"

# Create code signing certificate
.\scripts\create-codesign-cert.ps1 -DeveloperName "TestDev"

# Check CA status
.\scripts\ca-status-monitor.ps1
```

**Your Windows 11 standalone CA is now ready for all certificate types! Need help with any specific implementation or have questions about certificate deployment?**
