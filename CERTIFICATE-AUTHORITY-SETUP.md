# 🔐 Self-Hosted Certificate Authority (CA) Server Setup Guide

## 🎯 **Options for Running Your Own CA:**

### **Option 1: OpenSSL CA (Simple/Traditional)**
### **Option 2: Step CA (Modern/Automated)**  
### **Option 3: EJBCA (Enterprise)**
### **Option 4: Windows Certificate Services**

---

## 🚀 **Option 1: OpenSSL Certificate Authority (Recommended Start)**

### **Step 1: Create CA Directory Structure**

```bash
# Create CA directory
mkdir /opt/myca
cd /opt/myca

# Create directory structure
mkdir -p {certs,crl,newcerts,private}
chmod 700 private

# Create index and serial files
touch index.txt
echo 1000 > serial
echo 1000 > crlnumber
```

### **Step 2: Create CA Configuration File**

Create `/opt/myca/openssl.cnf`:

```ini
[ ca ]
default_ca = CA_default

[ CA_default ]
dir               = /opt/myca
certs             = $dir/certs
crl_dir           = $dir/crl
new_certs_dir     = $dir/newcerts
database          = $dir/index.txt
serial            = $dir/serial
RANDFILE          = $dir/private/.rand

private_key       = $dir/private/ca.key.pem
certificate       = $dir/certs/ca.cert.pem

crlnumber         = $dir/crlnumber
crl               = $dir/crl/ca.crl.pem
crl_extensions    = crl_ext
default_crl_days  = 30

default_md        = sha256
name_opt          = ca_default
cert_opt          = ca_default
default_days      = 375
preserve          = no
policy            = policy_strict

[ policy_strict ]
countryName             = match
stateOrProvinceName     = match
organizationName        = match
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = optional

[ req ]
default_bits        = 2048
distinguished_name  = req_distinguished_name
string_mask         = utf8only
default_md          = sha256
x509_extensions     = v3_ca

[ req_distinguished_name ]
countryName                     = Country Name (2 letter code)
stateOrProvinceName             = State or Province Name
localityName                    = Locality Name
0.organizationName              = Organization Name
organizationalUnitName          = Organizational Unit Name
commonName                      = Common Name
emailAddress                    = Email Address

[ v3_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ v3_intermediate_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ server_cert ]
basicConstraints = CA:FALSE
nsCertType = server
nsComment = "OpenSSL Generated Server Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer:always
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[ client_cert ]
basicConstraints = CA:FALSE
nsCertType = client, email
nsComment = "OpenSSL Generated Client Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
keyUsage = critical, nonRepudiation, digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth, emailProtection

[ alt_names ]
DNS.1 = localhost
DNS.2 = *.badgertechnologies.us
DNS.3 = badgertechnologies.us
IP.1 = 127.0.0.1
IP.2 = 192.168.1.100
```

### **Step 3: Create Root CA Certificate**

```bash
# Generate CA private key
openssl genrsa -aes256 -out private/ca.key.pem 4096
chmod 400 private/ca.key.pem

# Create CA certificate
openssl req -config openssl.cnf -key private/ca.key.pem \
    -new -x509 -days 7300 -sha256 -extensions v3_ca \
    -out certs/ca.cert.pem

# Verify CA certificate
openssl x509 -noout -text -in certs/ca.cert.pem
```

### **Step 4: Issue Server Certificates**

```bash
# Generate server private key
openssl genrsa -out private/server.key.pem 2048
chmod 400 private/server.key.pem

# Create certificate signing request
openssl req -config openssl.cnf -key private/server.key.pem \
    -new -sha256 -out certs/server.csr.pem

# Sign the server certificate
openssl ca -config openssl.cnf -extensions server_cert \
    -days 375 -notext -md sha256 \
    -in certs/server.csr.pem \
    -out certs/server.cert.pem

# Verify server certificate
openssl x509 -noout -text -in certs/server.cert.pem
```

---

## ⚡ **Option 2: Step CA (Modern/Automated)**

### **Installation:**

```bash
# Download Step CA
wget https://github.com/smallstep/certificates/releases/download/v0.25.0/step-ca_linux_0.25.0_amd64.tar.gz
tar -xzf step-ca_linux_0.25.0_amd64.tar.gz
sudo mv step-ca_0.25.0/bin/step-ca /usr/local/bin/

# Download Step CLI
wget https://github.com/smallstep/cli/releases/download/v0.25.0/step_linux_0.25.0_amd64.tar.gz
tar -xzf step_linux_0.25.0_amd64.tar.gz
sudo mv step_0.25.0/bin/step /usr/local/bin/
```

### **Initialize CA:**

```bash
# Initialize Step CA
step ca init --deployment-type standalone \
    --name "Badger Technologies CA" \
    --dns "ca.badgertechnologies.us" \
    --address ":8443"

# Start CA server
step-ca ~/.step/config/ca.json
```

### **Issue Certificates:**

```bash
# Get CA root certificate
step ca root > ca.crt

# Create server certificate
step ca certificate "server.badgertechnologies.us" server.crt server.key

# Create client certificate
step ca certificate "client@badgertechnologies.us" client.crt client.key
```

---

## 🏢 **Option 3: Docker-based CA Server**

### **Create Docker Compose:**

```yaml
# docker-compose.yml
version: '3.8'
services:
  step-ca:
    image: smallstep/step-ca:latest
    container_name: badger-ca
    ports:
      - "8443:9000"
    volumes:
      - ./step-ca-data:/home/step
    environment:
      - DOCKER_STEPCA_INIT_NAME=Badger Technologies CA
      - DOCKER_STEPCA_INIT_DNS_NAMES=ca.badgertechnologies.us,localhost
      - DOCKER_STEPCA_INIT_REMOTE_MANAGEMENT=true
    restart: unless-stopped

  # Optional: CA Management UI
  step-ca-ui:
    image: nginx:alpine
    container_name: badger-ca-ui
    ports:
      - "8080:80"
    volumes:
      - ./ca-ui:/usr/share/nginx/html
    depends_on:
      - step-ca
```

### **Start CA Server:**

```bash
docker-compose up -d
```

---

## 🔧 **Option 4: Windows Certificate Services**

### **Install Certificate Services:**

```powershell
# Install Windows Feature
Install-WindowsFeature -Name ADCS-Cert-Authority -IncludeManagementTools

# Configure CA
Install-AdcsCertificationAuthority -CAType StandaloneRootCA \
    -CACommonName "Badger Technologies Root CA" \
    -HashAlgorithm SHA256 -KeyLength 4096
```

---

## 🌐 **Web Interface for Certificate Management**

### **Simple Python CA Web Interface:**

```python
# ca_server.py
from flask import Flask, render_template, request, send_file
import subprocess
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/issue_cert', methods=['POST'])
def issue_cert():
    common_name = request.form['common_name']
    
    # Generate certificate using OpenSSL
    subprocess.run([
        'openssl', 'req', '-new', '-newkey', 'rsa:2048',
        '-nodes', '-out', f'{common_name}.csr',
        '-keyout', f'{common_name}.key',
        '-subj', f'/CN={common_name}'
    ])
    
    # Sign certificate
    subprocess.run([
        'openssl', 'ca', '-config', 'openssl.cnf',
        '-out', f'{common_name}.crt',
        '-in', f'{common_name}.csr'
    ])
    
    return send_file(f'{common_name}.crt', as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, ssl_context='adhoc')
```

---

## 🔐 **Security Considerations:**

### **Protect Your CA:**
- ✅ **Air-gapped system** for root CA
- ✅ **Hardware Security Module (HSM)** for key storage
- ✅ **Strong passphrases** on private keys
- ✅ **Regular backups** of CA database
- ✅ **Certificate Revocation Lists (CRL)**
- ✅ **Audit logging** enabled

### **Network Security:**
- ✅ **Firewall rules** limiting CA access
- ✅ **VPN access** for certificate requests
- ✅ **HTTPS only** for web interfaces
- ✅ **Client authentication** for sensitive operations

---

## 📋 **Management Scripts:**

### **Certificate Renewal Script:**

```bash
#!/bin/bash
# renew_certs.sh

CA_DIR="/opt/myca"
CERT_DIR="/etc/ssl/certs"

# Function to check certificate expiry
check_expiry() {
    cert_file=$1
    days_until_expiry=$(openssl x509 -in "$cert_file" -noout -checkend $((30*24*60*60)) 2>/dev/null)
    
    if [ $? -ne 0 ]; then
        echo "Certificate $cert_file expires within 30 days - renewing..."
        renew_certificate "$cert_file"
    fi
}

# Function to renew certificate
renew_certificate() {
    cert_file=$1
    # Renewal logic here
}

# Check all certificates
for cert in "$CERT_DIR"/*.crt; do
    check_expiry "$cert"
done
```

---

## 🎯 **Recommended Setup for Your Environment:**

### **For Development/Internal Use:**
1. **Step CA with Docker** - Easy to deploy and manage
2. **Web interface** for certificate requests
3. **Automatic renewal** with ACME protocol

### **For Production/Enterprise:**
1. **OpenSSL CA** - Full control and customization
2. **Hardware Security Module** - Maximum security
3. **Dedicated server** - Air-gapped if possible

### **Quick Start Command:**

```bash
# Clone this setup
git clone https://github.com/yourusername/badger-ca-setup
cd badger-ca-setup
docker-compose up -d
```

**What's your primary use case? Internal network certificates, development SSL, or full enterprise CA?**
