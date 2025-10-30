# OpenVAS Setup Guide - Badger Technologies



## Overview

OpenVAS is a free, open-source vulnerability scanner that can scan unlimited IPs (unlike Nessus Essentials which limits to 16 IPs). Perfect for comprehensive client assessments.


## Installation Options



### Option 1: Docker Installation (Recommended)

```bash

# Install Docker Desktop on Windows

# Download from: https://docker.com/products/docker-desktop



# Pull and run Greenbone Community Edition

docker run -d -p 443:443 --name openvas securecompliance/gvm


# Access web interface at: https://localhost:443

# Default credentials: admin / admin

```


### Option 2: Linux VM Installation

```bash

# Ubuntu/Debian

sudo apt update
sudo apt install openvas
sudo gvm-setup
sudo gvm-start
```


## Initial Configuration

1. **Update Vulnerability Feeds**

   - Run: `sudo greenbone-nvt-sync`
   - Wait 30-60 minutes for initial sync
   - Schedule daily updates


2. **Create Scan Configs**

   - Full and fast scan templates
   - Compliance-specific scans (HIPAA, SOC 2)
   - Custom scans for different client types


3. **Setup Reporting Templates**

   - Executive summary format
   - Technical details format
   - Compliance mapping format


## Client Engagement Process

1. **Pre-Scan**: Get written permission to scan

2. **Discovery**: Identify target IPs and services  

3. **Scanning**: Run appropriate scan template

4. **Analysis**: Review and prioritize findings

5. **Reporting**: Generate client-facing report



## Best Practices

- Always get written authorization before scanning

- Start with authenticated scans for accuracy

- Use scan scheduling for ongoing clients

- Maintain vulnerability database updates

- Document false positives for future reference



## Integration with Client Workflow

- Export results to XML/PDF

- Import into reporting templates

- Cross-reference with compliance frameworks

- Provide remediation timelines and costs

