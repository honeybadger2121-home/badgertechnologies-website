# Badger Technologies - Professional IT Services

A modern, responsive website for Badger Technologies IT Services with integrated Certificate Authority functionality.

## 🌐 Website Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **SEO Optimized**: Proper meta tags, structured data, and semantic HTML
- **Contact Form**: Netlify-powered contact form with email notifications
- **Fast Loading**: Optimized CSS and JavaScript for performance

## 🔐 Certificate Authority Features

- **Complete Windows 11 CA**: Self-hosted certificate authority
- **SSL/TLS Certificates**: Create certificates for websites and services
- **Client Authentication**: Generate client certificates for secure access
- **Code Signing**: Create certificates for application signing
- **Automated Monitoring**: Certificate expiry tracking and alerts

## 🚀 Quick Start

### Website Deployment
1. **Local Testing**: Run `python server.py` for local development
2. **Live Deployment**: Deploy to Netlify using the included configuration

### Certificate Authority Setup
1. **Run Setup**: Execute `.\setup-ca-clean.ps1` as Administrator
2. **Create Certificates**: Use the scripts in `C:\BadgerCA\scripts\`
3. **Monitor Status**: Run `.\ca-status.ps1` to check system health

## 📁 File Structure

```
badgertechnologies.it.com/
├── 🌐 Website Files
│   ├── index.html              # Main website
│   ├── thank-you.html          # Contact form success page  
│   ├── styles.css              # All styling
│   ├── script.js               # Website functionality
│   ├── manifest.json           # PWA configuration
│   ├── robots.txt              # SEO configuration
│   ├── sitemap.xml             # Search engine sitemap
│   └── netlify.toml            # Netlify deployment config
│
├── 🔐 Certificate Authority
│   ├── setup-ca-clean.ps1      # Main CA setup script
│   ├── badger-ca.conf          # OpenSSL CA configuration
│   ├── create-ssl-simple.ps1   # SSL certificate creator
│   ├── create-client-cert.ps1  # Client certificate creator
│   ├── create-codesign-cert.ps1 # Code signing certificate creator
│   ├── check-renewals.ps1      # Certificate expiry monitor
│   ├── ca-status.ps1           # CA system status checker
│   ├── ca-system-check.ps1     # Complete system verification
│   ├── ca-operations-guide.ps1 # Automated monitoring setup
│   └── ca-web-interface.html   # Web management interface
│
└── 📚 Documentation
    ├── README.md               # This file
    ├── DEPLOYMENT.md           # Website deployment guide
    ├── GIT-SETUP.md           # Git integration guide
    ├── NETLIFY-DEPLOYMENT.md  # Netlify-specific deployment
    └── WINDOWS-11-STANDALONE-CA-COMPLETE.md # CA setup guide
```

## 🛠️ Technologies Used

**Website:**
- HTML5, CSS3, JavaScript
- Netlify Forms for contact functionality
- Font Awesome icons, Google Fonts

**Certificate Authority:**
- OpenSSL 3.5.2
- PowerShell automation scripts
- Windows Task Scheduler for monitoring
- IIS for web interface (optional)

## 📋 Certificate Authority Usage

### Create SSL Certificate
```powershell
cd C:\BadgerCA\scripts
.\create-ssl-simple.ps1 -CommonName "your-domain.com"
```

### Create Client Certificate  
```powershell
.\create-client-cert.ps1 -ClientName "John Doe" -EmailAddress "john@company.com"
```

### Check System Status
```powershell
.\ca-status.ps1
```

### Monitor Certificate Expiry
```powershell
.\check-renewals.ps1 -DaysBeforeExpiry 30
```

## 🎯 Live Website

Visit: **https://badgertechnologies.us**

## 🔧 Support

For technical support or questions about the Certificate Authority setup, refer to the comprehensive documentation in `WINDOWS-11-STANDALONE-CA-COMPLETE.md`.

---

**Built with ❤️ for professional IT services and enterprise certificate management.**
