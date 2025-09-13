# Cloudflare Migration Checklist for badgertechnologies.us

## Pre-Migration Preparation
- [ ] 1. Backup current Name.com DNS settings (already have CSV export)
- [ ] 2. Note current nameservers for rollback if needed
- [ ] 3. Inform team about potential brief downtime

## Phase 1: Cloudflare Setup (15 minutes)
- [ ] 1. Create Cloudflare account at https://dash.cloudflare.com/sign-up
- [ ] 2. Add site: `badgertechnologies.us`
- [ ] 3. Choose Free plan
- [ ] 4. Let Cloudflare scan existing DNS records
- [ ] 5. Review and verify scanned records match your CSV

## Phase 2: DNS Configuration (10 minutes)
- [ ] 6. Add any missing records that weren't auto-detected
- [ ] 7. Add real CAA records (advantage over Name.com):
  - [ ] `0 issue "letsencrypt.org"`
  - [ ] `0 issue "digicert.com"`  
  - [ ] `0 iodef "mailto:security@badgertechnologies.us"`
- [ ] 8. Set proxy status:
  - [ ] Orange cloud (proxied): @ and www records
  - [ ] Gray cloud (DNS only): mail, MX, TXT records
- [ ] 9. Verify all Google Workspace MX records are present

## Phase 3: Nameserver Migration (5 minutes)
- [ ] 10. Copy Cloudflare nameservers (provided by Cloudflare)
- [ ] 11. Go to Name.com → My Domains → badgertechnologies.us → Nameservers  
- [ ] 12. Change from Name.com nameservers to Cloudflare nameservers
- [ ] 13. Save changes at Name.com

## Phase 4: Cloudflare Optimization (10 minutes)
- [ ] 14. SSL/TLS → Overview → Set to "Full (strict)"
- [ ] 15. SSL/TLS → Edge Certificates → Enable "Always Use HTTPS"
- [ ] 16. Security → Settings → Set Security Level to "Medium"
- [ ] 17. Speed → Optimization → Enable Auto Minify (CSS, JS, HTML)
- [ ] 18. Speed → Optimization → Enable Brotli

## Phase 5: Verification (30 minutes)
- [ ] 19. Wait 15-30 minutes for initial propagation
- [ ] 20. Test website: https://badgertechnologies.us
- [ ] 21. Check SSL certificate shows Cloudflare
- [ ] 22. Test all subdomains (www, mail, support, etc.)
- [ ] 23. Send test email to verify Google Workspace still works
- [ ] 24. Run DNS checks:
  ```powershell
  nslookup -type=NS badgertechnologies.us
  nslookup badgertechnologies.us
  nslookup -type=MX badgertechnologies.us
  ```

## Phase 6: Monitoring (24-48 hours)
- [ ] 25. Monitor website performance and availability
- [ ] 26. Check email delivery continues to work
- [ ] 27. Verify all subdomains resolve correctly
- [ ] 28. Use https://whatsmydns.net/ to check global propagation

## Post-Migration Benefits to Verify
- [ ] ✅ Real CAA records (not TXT workarounds)
- [ ] ✅ Faster page load times (CDN)
- [ ] ✅ Better SSL management
- [ ] ✅ DDoS protection active
- [ ] ✅ Advanced DNS management features

## Emergency Rollback (If Needed)
If major issues occur:
- [ ] 1. Go back to Name.com nameserver settings
- [ ] 2. Change nameservers back to Name.com defaults:
  - dns1.name.com
  - dns2.name.com
  - dns3.name.com
  - dns4.name.com
- [ ] 3. Wait 2-4 hours for rollback propagation
- [ ] 4. Troubleshoot Cloudflare config before re-attempting

## Timeline Summary
- **Setup**: 15 minutes
- **Configuration**: 10 minutes  
- **Nameserver change**: 5 minutes
- **Initial propagation**: 30 minutes
- **Full global propagation**: 24-48 hours

## Key Advantages After Migration
1. **Real CAA Records**: Proper certificate authority control
2. **Performance**: Global CDN with edge caching
3. **Security**: DDoS protection and WAF
4. **Analytics**: Detailed traffic insights
5. **SSL Management**: Automatic certificate renewal
6. **Advanced Features**: Page rules, redirects, etc.

## Contact Info During Migration
Keep this handy in case you need to contact providers:
- **Name.com Support**: For nameserver issues
- **Cloudflare Support**: For DNS/proxy issues  
- **Google Workspace**: For email delivery problems

Total estimated time: 1 hour setup + 24-48 hours full propagation
