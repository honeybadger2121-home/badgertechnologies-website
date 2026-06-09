# Azure Migrate Setup Guide - Badger Technologies



## Overview

Azure Migrate provides free assessment tools to evaluate on-premises infrastructure for cloud readiness, cost estimation, and migration planning.


## Setup Process



### 1. Azure Account Setup

```

1. Create free Azure account: https://azure.microsoft.com/free/

2. Sign up with your business Microsoft account

3. No credit card required for assessment tools

4. Access Azure Migrate from the portal

```


### 2. Create Migration Project

```
Azure Portal > Azure Migrate > Create Project
Project Name: [Client-Name]-Assessment
Resource Group: Create new: [Client-Name]-Migration-RG  
Geography: United States (or client location)
```


### 3. Assessment Tools Setup



#### For VMware Environments

1. **Download Azure Migrate Appliance**

   - Download OVA template
   - Deploy to VMware environment
   - Configure appliance with Azure credentials


#### For Physical Servers

1. **Download Discovery Agent**

   - Install on representative servers
   - Configure with Azure Migrate credentials
   - Run discovery process


#### For Hyper-V

1. **Download Hyper-V Assessment Tool**

   - Install on Hyper-V host
   - Configure with Azure credentials
   - Start discovery process


## Client Assessment Workflow



### Phase 1: Discovery (Day 1)

1. Install appropriate discovery agent

2. Configure credentials for server access

3. Start discovery process (runs 24-48 hours)

4. Verify all servers are discovered



### Phase 2: Assessment (Day 2-3)  

1. Create assessment groups based on:

   - Application dependencies  
   - Business criticality
   - Current performance tiers

2. Configure assessment properties:

   - Target Azure region
   - VM sizing criteria
   - Cost preferences
   - Comfort factor


### Phase 3: Analysis (Day 4)

1. Review readiness assessment:

   - Azure readiness status
   - Suggested VM sizes
   - Monthly cost estimates
   - Migration blockers

2. Generate detailed reports

3. Export to Excel for custom formatting



## Key Assessment Reports



### 1. Azure Readiness Report

- Ready for Azure: Percentage breakdown

- Conditionally ready: Issues and solutions

- Not ready: Blockers and alternatives

- Unknown readiness: Missing data points



### 2. Cost Assessment Report  

- Monthly compute costs

- Storage cost estimates

- Network cost projections

- Total cost of ownership (TCO) comparison



### 3. Dependency Analysis

- Application interdependencies

- Network connectivity requirements

- Shared storage dependencies

- Service dependencies mapping



## Client Deliverables



### Executive Summary

```
Current Infrastructure: X servers, Y VMs
Azure Readiness: X% ready, Y% conditional  
Estimated Monthly Cost: $X,XXX
Recommended Migration Approach: Lift-and-shift vs. Modernization
Timeline: X months for full migration
```


### Technical Assessment

- Server-by-server readiness analysis

- Recommended Azure VM sizes

- Network architecture requirements

- Security and compliance considerations

- Migration wave planning



### Cost-Benefit Analysis

- Current on-premises costs

- Projected Azure costs

- Break-even timeline

- ROI projections over 3 years



## Best Practices



### Pre-Assessment

- Get inventory of all servers and applications

- Document current performance baselines

- Identify business-critical applications

- Understand compliance requirements



### During Assessment  

- Monitor discovery process for completion

- Validate server performance data

- Review dependency mapping accuracy

- Test assessment scenarios (different VM sizes, regions)



### Post-Assessment

- Present findings to technical and business stakeholders

- Provide clear next steps and recommendations

- Offer pilot migration planning

- Document lessons learned for future assessments



## Integration with Other Tools

- Combine with PRTG data for performance validation

- Cross-reference with security scan findings

- Use with network analysis for bandwidth planning

- Export data for custom reporting templates

