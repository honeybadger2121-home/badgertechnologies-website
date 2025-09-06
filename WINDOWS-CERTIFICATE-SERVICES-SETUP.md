# 🏢 Windows Certificate Services Setup Guide

## 🎯 **Setting Up Your Badger Technologies Certificate Authority**

This guide will help you install and configure Windows Certificate Services to run your own enterprise-grade certificate authority.

---

## 🚀 **Step 1: Install Certificate Services Role**

### **Using Server Manager (GUI):**
1. **Open Server Manager**
2. **Click "Add Roles and Features"**
3. **Select "Role-based or feature-based installation"**
4. **Choose your server**
5. **Server Roles → Check "Active Directory Certificate Services"**
6. **Add Features** when prompted
7. **Role Services → Check:**
   - ✅ **Certification Authority**
   - ✅ **Certification Authority Web Enrollment** (recommended)
   - ✅ **Certificate Enrollment Web Service** (optional)
   - ✅ **Certificate Enrollment Policy Web Service** (optional)

### **Using PowerShell (Faster):**
```powershell
# Install Certificate Services features
Install-WindowsFeature -Name ADCS-Cert-Authority, ADCS-Web-Enrollment -IncludeManagementTools

# Verify installation
Get-WindowsFeature -Name ADCS*
```

---

## 🔧 **Step 2: Configure the Certificate Authority**

### **Configure Root CA (PowerShell):**
```powershell
# Configure standalone root CA
Install-AdcsCertificationAuthority `
    -CAType StandaloneRootCA `
    -CACommonName "Badger Technologies Root CA" `
    -CADistinguishedNameSuffix "DC=badgertechnologies,DC=us" `
    -CryptoProviderName "RSA#Microsoft Software Key Storage Provider" `
    -KeyLength 4096 `
    -HashAlgorithmName SHA256 `
    -ValidityPeriod Years `
    -ValidityPeriodUnits 20 `
    -DatabaseDirectory "C:\Windows\System32\CertLog" `
    -LogDirectory "C:\Windows\System32\CertLog" `
    -Force

# Configure web enrollment if installed
Install-AdcsWebEnrollment -Force
```

### **Configure Using GUI:**
1. **Server Manager → Notifications (flag icon)**
2. **Click "Configure Active Directory Certificate Services"**
3. **Credentials:** Use current credentials or specify admin account
4. **Role Services:** Select installed services to configure
5. **Setup Type:** 
   - **Standalone CA** (for standalone/workgroup)
   - **Enterprise CA** (if joined to domain)
6. **CA Type:** **Root CA**
7. **Private Key:** **Create new private key**
8. **Cryptography:**
   - **Provider:** RSA#Microsoft Software Key Storage Provider
   - **Key Length:** 4096
   - **Hash Algorithm:** SHA256
9. **CA Name:** `Badger Technologies Root CA`
10. **Validity Period:** 20 years
11. **Certificate Database:** Accept defaults or specify custom location
12. **Configure** and wait for completion

---

## 🌐 **Step 3: Configure Web Enrollment (Optional but Recommended)**

### **Enable IIS Features:**
```powershell
# Enable required IIS features
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServer
Enable-WindowsOptionalFeature -Online -FeatureName IIS-CommonHttpFeatures
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpErrors
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpLogging
Enable-WindowsOptionalFeature -Online -FeatureName IIS-Security
Enable-WindowsOptionalFeature -Online -FeatureName IIS-RequestFiltering
Enable-WindowsOptionalFeature -Online -FeatureName IIS-StaticContent
Enable-WindowsOptionalFeature -Online -FeatureName IIS-ASPNET45
```

### **Access Web Enrollment:**
- **URL:** `https://your-server-name/certsrv`
- **Local:** `https://localhost/certsrv`

---

## 📋 **Step 4: Create Certificate Templates**

### **Common Templates to Create:**

#### **1. Web Server Template:**
```powershell
# Duplicate existing web server template
$Template = Get-CATemplate -Name "WebServer"
$NewTemplate = $Template | New-CATemplate -Name "BadgerWebServer" -DisplayName "Badger Web Server"

# Modify template properties
Set-CATemplate -Template $NewTemplate -Property @{
    "ValidityPeriod" = "Years"
    "ValidityPeriodUnits" = 2
    "RenewalPeriod" = "Weeks"  
    "RenewalPeriodUnits" = 6
}

# Publish template
Publish-CATemplate -Name "BadgerWebServer"
```

#### **2. Client Authentication Template:**
```powershell
# Create client auth template
$ClientTemplate = Get-CATemplate -Name "User" | New-CATemplate -Name "BadgerClientAuth" -DisplayName "Badger Client Authentication"

# Configure for client authentication
Set-CATemplate -Template $ClientTemplate -Property @{
    "ValidityPeriod" = "Years"
    "ValidityPeriodUnits" = 1
    "KeyUsage" = "DigitalSignature,KeyEncipherment"
    "ExtendedKeyUsage" = "ClientAuthentication"
}

# Publish template
Publish-CATemplate -Name "BadgerClientAuth"
```

### **Using Certificate Templates Console:**
1. **Run:** `certtmpl.msc`
2. **Right-click template folder → New → Certificate Template to Issue**
3. **Select base template** (Web Server, Computer, User, etc.)
4. **Configure properties:**
   - **General:** Template name, validity period
   - **Subject Name:** How to build subject name
   - **Extensions:** Key usage, application policies
   - **Security:** Who can enroll

---

## 🔐 **Step 5: Security Configuration**

### **CA Security Settings:**
```powershell
# Set CA security
certutil -setreg CA\SecurityDescriptor "D:PAI(A;;0xf01ff;;;SY)(A;;0xf01ff;;;BA)(A;;0x1;;;AU)"

# Configure audit settings
certutil -setreg CA\AuditFilter 0x7f

# Enable CRL distribution
certutil -setreg CA\CRLFlags +CRLF_DELETE_EXPIRED_CRLS

# Set CRL publication interval (hours)
certutil -setreg CA\CRLPeriod "Hours"
certutil -setreg CA\CRLPeriodUnits 24

# Restart CA service
Restart-Service -Name CertSvc
```

### **Firewall Configuration:**
```powershell
# Allow CA web enrollment
New-NetFirewallRule -DisplayName "Certificate Authority Web Enrollment" -Direction Inbound -Protocol TCP -LocalPort 80,443 -Action Allow

# Allow RPC for certificate enrollment
New-NetFirewallRule -DisplayName "Certificate Authority RPC" -Direction Inbound -Protocol TCP -LocalPort 135 -Action Allow
```

---

## 📊 **Step 6: Certificate Management**

### **Issue Certificates via PowerShell:**
```powershell
# Request certificate for web server
$Request = @"
-----BEGIN NEW CERTIFICATE REQUEST-----
[Base64 encoded certificate request]
-----END NEW CERTIFICATE REQUEST-----
"@

# Submit and retrieve certificate
$RequestId = certreq -submit -config "ServerName\CA Name" $Request
certreq -retrieve -config "ServerName\CA Name" $RequestId cert.cer
```

### **Manage via Certificate Authority Console:**
```powershell
# Open CA management console
certsrv.msc
```

**Common Tasks:**
- **View issued certificates**
- **Revoke certificates** 
- **Publish CRL**
- **Backup CA database**

---

## 🔄 **Step 7: Automated Certificate Deployment**

### **Group Policy Certificate Deployment:**
```powershell
# Create GPO for certificate deployment
New-GPO -Name "Badger CA Certificate Deployment" | New-GPLink -Target "OU=Computers,DC=badgertechnologies,DC=us"

# Import CA certificate to trusted roots
Import-Certificate -FilePath "C:\ca-cert.cer" -CertStoreLocation "Cert:\LocalMachine\Root"
```

### **PowerShell Script for Bulk Certificate Request:**
```powershell
# bulk_cert_request.ps1
param(
    [Parameter(Mandatory=$true)]
    [string[]]$ComputerNames,
    
    [Parameter(Mandatory=$true)]
    [string]$Template = "BadgerWebServer"
)

foreach ($Computer in $ComputerNames) {
    # Create certificate request
    $Request = New-SelfSignedCertificate -DnsName $Computer -CertStoreLocation "cert:\LocalMachine\My" -KeyExportPolicy Exportable
    
    # Submit to CA
    $Cert = Get-Certificate -Template $Template -SubjectName "CN=$Computer" -CertStoreLocation "cert:\LocalMachine\My"
    
    Write-Host "Certificate issued for $Computer - Thumbprint: $($Cert.Certificate.Thumbprint)"
}
```

---

## 🛡️ **Step 8: Backup and Recovery**

### **Backup CA Database:**
```powershell
# Create backup directory
New-Item -Path "C:\CA-Backup" -ItemType Directory -Force

# Backup CA database and keys
certutil -backup "C:\CA-Backup"

# Backup CA certificate
certutil -ca.cert "C:\CA-Backup\ca-cert.cer"

# Backup registry settings
certutil -backup "C:\CA-Backup" -p "BackupPassword"
```

### **Automated Backup Script:**
```powershell
# ca_backup.ps1
$BackupPath = "C:\CA-Backup\$(Get-Date -Format 'yyyy-MM-dd')"
New-Item -Path $BackupPath -ItemType Directory -Force

# Backup database
certutil -backup $BackupPath -p "YourSecurePassword"

# Copy to network location
Copy-Item -Path $BackupPath -Destination "\\backup-server\ca-backups\" -Recurse

# Schedule this script to run daily
```

---

## 📋 **Step 9: Monitoring and Maintenance**

### **CA Health Check Script:**
```powershell
# ca_health_check.ps1

# Check CA service status
$CAService = Get-Service -Name CertSvc
Write-Host "CA Service Status: $($CAService.Status)"

# Check certificate database
$DBStatus = certutil -dump
if ($LASTEXITCODE -eq 0) {
    Write-Host "CA Database: OK"
} else {
    Write-Host "CA Database: ERROR"
}

# Check CRL validity
$CRL = certutil -getcrl
Write-Host "CRL Status: $(if($LASTEXITCODE -eq 0){'Current'}else{'Expired/Error'})"

# Check disk space
$Disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'"
$FreeSpace = [math]::Round($Disk.FreeSpace/1GB, 2)
Write-Host "Free Disk Space: $FreeSpace GB"

# Email report if issues found
if ($CAService.Status -ne "Running" -or $LASTEXITCODE -ne 0 -or $FreeSpace -lt 10) {
    Send-MailMessage -To "benjamin@badgertechnologies.us" -Subject "CA Health Alert" -Body "CA requires attention"
}
```

### **Performance Monitoring:**
```powershell
# Monitor CA performance counters
Get-Counter "\Certification Authority(*)\*" | Select-Object -ExpandProperty CounterSamples
```

---

## 🔧 **Step 10: Advanced Configuration**

### **Custom Extensions:**
```powershell
# Add custom certificate extensions
certutil -setreg CA\CRLPublicationURLs "1:C:\Windows\System32\CertSrv\CertEnroll\%3%8.crl\n2:http://ca.badgertechnologies.us/certenroll/%3%8.crl"

certutil -setreg CA\CACertPublicationURLs "1:C:\Windows\System32\CertSrv\CertEnroll\%1_%3%4.crt\n2:http://ca.badgertechnologies.us/certenroll/%1_%3%4.crt"
```

### **OCSP Configuration:**
```powershell
# Install Online Certificate Status Protocol
Install-WindowsFeature -Name ADCS-Online-Cert

# Configure OCSP
Install-AdcsOnlineResponder
```

---

## ✅ **Post-Installation Checklist:**

- [ ] **CA service** running properly
- [ ] **Web enrollment** accessible at https://server/certsrv
- [ ] **Certificate templates** created and published
- [ ] **Firewall rules** configured
- [ ] **Backup system** in place
- [ ] **CRL distribution** configured
- [ ] **Monitoring** scripts deployed
- [ ] **Documentation** updated

---

## 🎯 **Quick Commands Reference:**

```powershell
# Start/Stop CA service
Start-Service CertSvc
Stop-Service CertSvc

# View CA configuration
certutil -getreg

# Issue certificate from request file
certutil -submit request.req

# Revoke certificate
certutil -revoke SerialNumber Reason

# Publish new CRL
certutil -crl

# View pending requests
certutil -view -restrict "RequestId>=1000" -out RequestId,RequesterName,Request.StatusCode
```

---

## 🚀 **Next Steps:**

1. **Install and configure** CA using steps above
2. **Test certificate issuance** via web enrollment
3. **Create custom templates** for your specific needs
4. **Set up monitoring** and backup procedures
5. **Deploy CA certificate** to client machines

**Need help with any specific step or want me to create additional automation scripts?**
