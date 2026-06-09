# Badger Technologies Website


[![Live Site](https://img.shields.io/badge/live-badgertechnologies.us-blue)](https://badgertechnologies.us)
[![License](https://img.shields.io/badge/license-Proprietary-red)](LICENSE)

Professional IT services website for Badger Technologies, featuring managed IT support, cybersecurity services, technology consulting, and comprehensive training programs.

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


```text
badgertechnologies-website/
│
├── 📄 HTML Pages (Root)
│   ├── index.html              # Homepage

│   ├── about.html              # About Us

│   ├── services.html           # Services Overview

│   ├── solutions.html          # Solutions

│   ├── contact.html            # Contact Form

│   ├── careers.html            # Careers Page

│   ├── assessment-form.html    # IT Assessment Form

│   └── thank-you.html          # Thank You Page

│
├── 🎨 assets/                  # Website Assets

│   ├── css/
│   │   └── styles.css          # Main stylesheet

│   └── js/
│       └── script.js           # Main JavaScript

│
├── 🖼️ images/                  # Logos & Graphics

│   ├── logos/                  # Company logos

│   └── icons/                  # Icon assets

│
├── 📋 contracts/               # Employment Contracts

│   ├── IT-Consultant-Employment-Contract.md
│   ├── Client-Acquisition-Specialist-Employment-Contract.md
│   ├── Internship-Agreement-Template.md
│   └── Company-Device-Equipment-Agreement.md
│
├── 💼 job-descriptions/        # Job Postings

│   ├── IT-Consultant-Job-Description.md
│   ├── IT-Consulting-Intern-Job-Description.md
│   └── Client-Acquisition-Specialist-Job-Description.md
│
├── 📚 docs/                    # Documentation & Templates

│   ├── business-planning/      # Business Strategy Documents

│   │   ├── BADGER-TECHNOLOGIES-OVERVIEW.md
│   │   ├── BADGER-TECHNOLOGIES-OVERVIEW.pdf
│   │   ├── MANAGED-IT-PIVOT-SUMMARY.md
│   │   └── SALES-TOOLKIT-SUMMARY.md
│   ├── deployment/             # Deployment Documentation

│   │   ├── DEPLOYMENT-TROUBLESHOOTING.md
│   │   ├── QUICK-START-GUIDE.md
│   │   └── training-subdomain-setup.md
│   ├── build/                  # Build Instructions

│   │   ├── BUILD_INSTRUCTIONS.md
│   │   └── OLD_README.md
│   ├── templates/              # Email & Document Templates

│   │   ├── email-signature-professional.md
│   │   ├── gmail-signature-setup-guide.md
│   │   └── Professional-Email-Templates.md
│   ├── workflows/              # Business Workflows

│   │   └── Client-Engagement-Workflow.md
│   ├── CLEANUP-SUMMARY.md      # Repository cleanup log

│   ├── PAGES-DEPLOYMENT-GUIDE.md
│   └── pgp-key.txt             # PGP Public Key

│
├── 📖 guides/                  # Technical Setup Guides

│   ├── Azure-Migrate-Setup-Guide.md
│   ├── OpenVAS-Setup-Guide.md
│   ├── PRTG-Setup-Guide.md
│   ├── Professional-Assessment-Tools-Setup.md
│   └── Windows-Server-Infrastructure-Enhancement-Guide.md
│
├── 🎓 trainings/               # Internal Training Materials

│   ├── IT-Mastery-Course.md
│   ├── Sales-Client-Acquisition-Training.md
│   ├── client-engagement-training.html
│   ├── product-overview.html
│   ├── index.html
│   ├── course-styles.css
│   ├── course-script.js
│   └── TRAINING-IMPLEMENTATION-GUIDE.md
│
├── 💰 sales-toolkit/           # Sales Resources

│   ├── collateral/             # Sales collateral

│   ├── email-templates/        # Email templates

│   ├── proposals/              # Proposal templates

│   ├── scripts/                # Sales scripts

│   ├── tracking/               # Lead tracking

│   └── README.md
│
├── � leads/                   # Lead Generation

│   ├── email-campaign-plan.md
│   ├── email-templates.md
│   ├── contacts.csv
│   ├── mailchimp-setup-guide.md
│   └── [campaign files]
│
├── 📄 pages/                   # Additional Pages

│   ├── legal/                  # Legal pages

│   └── services/               # Service-specific pages

│
├── ⚙️ config/                  # Configuration Files

│   ├── .htmlhintrc             # HTML linting config

│   ├── .nvmrc                  # Node version

│   ├── .pages.toml             # Cloudflare Pages config

│   ├── wrangler.toml           # Cloudflare Workers config

│   ├── _headers                # HTTP security headers

│   └── _redirects              # URL redirects

│
├── ⚙️ scripts/                 # Automation Scripts

│   ├── build.mjs               # Build script

│   └── fix-email-templates.ps1 # Email template fixer

│
└── 📋 Root Configuration
    ├── package.json            # Node.js dependencies

    ├── manifest.json           # PWA manifest

    ├── robots.txt              # SEO robots file

    ├── sitemap.xml             # SEO sitemap

    ├── .gitignore              # Git ignore rules

    └── .nojekyll               # Disable Jekyll on GitHub Pages

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

- **Email:** [careers@badgertechnologies.us](mailto:careers@badgertechnologies.us)

- **Security:** [security@badgertechnologies.us](mailto:security@badgertechnologies.us)

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

2. Email [security@badgertechnologies.us](mailto:security@badgertechnologies.us)

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



### Proprietary License - All Rights Reserved


© 2025 Badger Technologies, LLC. All rights reserved.

This is proprietary software. Unauthorized copying, distribution, modification, or use is strictly prohibited and will be prosecuted to the maximum extent of the law.

**Authorized Use Only:**


- Authorized Badger Technologies employees

- Contractors under written agreement

- Individuals with explicit written permission


For licensing inquiries: [benjamin@badgertechnologies.us](mailto:benjamin@badgertechnologies.us)

See [LICENSE](LICENSE) file for complete terms.

---


## 🎯 Company Mission


To provide Fortune 500-grade IT security and consulting services to growing businesses that can't yet afford enterprise-sized IT departments.

Built with 🦡 by Badger Technologies
