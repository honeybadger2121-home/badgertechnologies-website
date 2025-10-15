# Badger Technologies Website

[![Live Site](https://img.shields.io/badge/live-badgertechnologies.us-blue)](https://badgertechnologies.us)
[![License](https://img.shields.io/badge/license-Proprietary-red)]()

Professional IT consulting and cybersecurity services website for Badger Technologies, LLC.

---

## 🏢 About Badger Technologies

Badger Technologies provides enterprise-grade IT consulting, cybersecurity assessments, and managed services to small and medium-sized businesses. We specialize in:

- **IT Security Assessments** - Comprehensive 5-day assessments using OpenVAS, PRTG, Azure Migrate
- **Compliance Reviews** - HIPAA, PCI-DSS, and regulatory compliance auditing
- **Cloud Migration** - Azure cloud migration planning and implementation
- **Managed IT Services** - Active Directory, PKI, backup & disaster recovery
- **Vulnerability Management** - Network security analysis and remediation

---

## 📁 Repository Structure

```
badgertechnologies-website/
│
├── 📄 HTML Pages (Root)
│   ├── index.html              # Homepage
│   ├── about.html              # About Us
│   ├── services.html           # Services Overview
│   ├── contact.html            # Contact Form
│   └── [20+ service & legal pages]
│
├── 📋 contracts/               # Employment Contracts
│   ├── IT-Consultant-Employment-Contract.md
│   ├── Internship-Agreement-Template.md
│   └── Sana-Hawa-Employment-Contract-Clean.md
│
├── 📚 docs/                    # Documentation & Templates
│   ├── BUILD_INSTRUCTIONS.md
│   ├── Client-Engagement-Workflow.md
│   ├── Professional-Email-Templates.md
│   └── email-signature-professional.md
│
├── 📖 guides/                  # Technical Setup Guides
│   ├── Azure-Migrate-Setup-Guide.md
│   ├── OpenVAS-Setup-Guide.md
│   ├── PRTG-Setup-Guide.md
│   ├── Professional-Assessment-Tools-Setup.md
│   └── Windows-Server-Infrastructure-Enhancement-Guide.md
│
├── 💼 job-descriptions/        # Job Postings
│   ├── IT-Consultant-Job-Description.md
│   ├── IT-Consulting-Intern-Job-Description.md
│   └── Sales-Representative-Job-Description.md
│
├── 🖼️ images/                  # Logos & Graphics
│   ├── badger-logo-*.png       # Various logo variants
│   └── favicon.ico
│
├── ⚙️ scripts/                 # Build Scripts
├── 🔧 src/                     # Source Code
│   └── worker.js               # Cloudflare Worker
│
└── 📋 Configuration Files
    ├── package.json            # Node.js dependencies
    ├── wrangler.toml           # Cloudflare Workers config
    ├── _headers                # HTTP security headers
    ├── _redirects              # URL redirects
    └── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (see `.nvmrc`)
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/honeybadger2121-home/badgertechnologies-website.git
cd badgertechnologies-website

# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build
```

See [docs/BUILD_INSTRUCTIONS.md](docs/BUILD_INSTRUCTIONS.md) for detailed build steps.

---

## 🛠️ Technical Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Hosting:** Cloudflare Pages (Auto-deployment from GitHub)
- **CDN:** Cloudflare Global Network
- **Security:** Content Security Policy, HSTS, PGP key available
- **CI/CD:** GitHub Actions + Cloudflare Pages (Deploy on push to main)
- **Build:** Node.js 18, Custom build script

---

## 📞 Contact & Support

- **Website:** [badgertechnologies.us](https://badgertechnologies.us)
- **Email:** careers@badgertechnologies.us
- **Security:** security@badgertechnologies.us
- **PGP Key:** [pgp-key.txt](pgp-key.txt)

---

## 📄 Key Documents

### For Clients
- [Service Level Agreement](sla.html)
- [Privacy Policy](privacy.html)
- [Terms of Service](terms.html)
- [Security Policy](security-policy.html)

### For Job Seekers
- [IT Consultant Position](job-descriptions/IT-Consultant-Job-Description.md)
- [Internship Opportunities](job-descriptions/IT-Consulting-Intern-Job-Description.md)
- [Careers Page](careers.html)

### For Developers
- [Build Instructions](docs/BUILD_INSTRUCTIONS.md)
- [Client Engagement Workflow](docs/Client-Engagement-Workflow.md)
- [Assessment Tools Setup](guides/Professional-Assessment-Tools-Setup.md)

---

## 🔒 Security

We take security seriously. If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email security@badgertechnologies.us
3. Use our [PGP key](pgp-key.txt) for sensitive communications
4. See [Security Policy](security-policy.html) for our responsible disclosure process

---

## 🏆 Services Offered

### IT Consulting
- [IT Consulting Services](it-consulting.html)
- [Managed IT Support](managed-it-support.html)
- [Network Management](network-management.html)

### Cybersecurity
- [Cybersecurity Services](cybersecurity-services.html)
- [Security Assessments](assessment.html)
- [Vendor Management](vendor-management.html)

### Cloud & Infrastructure
- [Cloud Services](cloud-services.html)
- [Data Management](data-management.html)
- [Hardware Procurement](hardware-procurement.html)

---

## 📊 Project Status

**Status:** ✅ Active Development  
**Version:** 1.0  
**Last Updated:** October 15, 2025

---

## 🤝 Contributing

This is a private business website. Contributions are limited to Badger Technologies team members.

For team members:
1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Get approval from Benjamin Sherman

---

## 📜 License

© 2025 Badger Technologies, LLC. All rights reserved.

This is proprietary software. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 🎯 Company Mission

To provide Fortune 500-grade IT security and consulting services to growing businesses that can't yet afford enterprise-sized IT departments.

**Built with 🦡 by Badger Technologies**
