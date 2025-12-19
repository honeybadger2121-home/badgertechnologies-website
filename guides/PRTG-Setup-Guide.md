# PRTG Network Monitor Setup Guide - Badger Technologies



## Overview

PRTG Free Version monitors up to 100 sensors - perfect for small to medium business assessments. Provides real-time monitoring and historical data analysis.


## Installation Process



### Download and Install

1. Download PRTG from: https://www.paessler.com/prtg/download

2. Run installer as Administrator

3. Choose "Free Version" during license selection

4. Configure initial server settings



### Initial Configuration

```
Server Name: [Client-Name]-PRTG
Web Port: 80/443 (HTTPS recommended)
Admin Password: [Strong password]
Email Settings: [Your business email]
```


## Essential Sensors for Client Assessments



### 1. Network Infrastructure

- **Ping Sensor**: Monitor device availability

- **SNMP Traffic Sensor**: Bandwidth utilization

- **Port Sensor**: Critical service monitoring

- **DNS Sensor**: Resolution time monitoring



### 2. Performance Monitoring  

- **HTTP/HTTPS Sensor**: Website response times

- **Database Sensors**: SQL Server, MySQL performance

- **File Server Monitoring**: Share availability

- **Printer Monitoring**: Network printer status



### 3. Security Monitoring

- **Certificate Sensor**: SSL certificate expiration

- **Event Log Sensor**: Windows security events

- **Failed Login Sensor**: Brute force detection

- **Antivirus Status**: Endpoint protection monitoring



## Client Assessment Workflow



### Day 1: Setup and Discovery

1. Install PRTG on client network (temporary)

2. Run Auto-Discovery to find devices

3. Configure essential sensors based on client needs

4. Set up initial dashboards



### Day 2-3: Data Collection

1. Allow 48-72 hours for baseline data

2. Monitor during business hours

3. Identify peak usage periods

4. Document any performance issues



### Day 4: Analysis and Reporting

1. Export performance graphs

2. Generate utilization reports  

3. Identify bottlenecks and recommendations

4. Create executive summary with visuals



## Reporting Templates



### Executive Dashboard

- Network availability percentage

- Bandwidth utilization graphs

- Top 10 busiest devices

- Performance recommendations



### Technical Report

- Detailed sensor readings

- Historical performance data

- Alerting thresholds and violations

- Infrastructure upgrade recommendations



## Best Practices for Client Engagements

- Always get permission before installing monitoring

- Use descriptive sensor names for clarity

- Set appropriate monitoring intervals (avoid overwhelming small networks)

- Configure email alerts for critical issues

- Document baseline performance before making recommendations

- Remove PRTG after assessment unless client wants ongoing monitoring



## Integration with Other Tools

- Export data to Excel for custom reporting

- Combine with Wireshark for detailed packet analysis  

- Use SNMP data for network mapping

- Correlate with security scan findings

