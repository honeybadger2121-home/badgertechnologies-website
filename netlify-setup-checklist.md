# Netlify Custom Domain Setup Checklist

## ✅ Step-by-Step Setup Process

### Phase 1: Netlify Configuration (Do First)
- [ ] 1. Log into Netlify (https://app.netlify.com)
- [ ] 2. Go to your "badgertechnologiesllc" site
- [ ] 3. Click **Site settings** → **Domain management**
- [ ] 4. Click **Add custom domain**
- [ ] 5. Enter `badgertechnologies.us` and verify
- [ ] 6. Add `www.badgertechnologies.us` as well
- [ ] 7. Set `badgertechnologies.us` as **Primary domain**

### Phase 2: DNS Configuration at Name.com (Do Second)
- [ ] 8. Log into Name.com
- [ ] 9. Go to **My Domains** → **badgertechnologies.us** → **DNS Records**
- [ ] 10. Add A record: `@` → `75.2.60.5`
- [ ] 11. Add CNAME record: `www` → `badgertechnologiesllc.netlify.app`
- [ ] 12. Save DNS changes

### Phase 3: SSL Certificate (Automatic)
- [ ] 13. Wait for DNS to propagate (15-30 minutes minimum)
- [ ] 14. In Netlify, go back to **Domain management**
- [ ] 15. Under **HTTPS**, click **Verify DNS configuration**
- [ ] 16. Click **Provision certificate** (should happen automatically)
- [ ] 17. Wait for certificate to be issued (1-2 minutes)

### Phase 4: Optional Security Settings
- [ ] 18. Enable **Force HTTPS** in Netlify
- [ ] 19. Enable **Force redirect www to primary domain** (optional)

### Phase 5: Verification
- [ ] 20. Run PowerShell script: `.\check-netlify-domain.ps1`
- [ ] 21. Test in browser: `https://badgertechnologies.us`
- [ ] 22. Verify address bar shows your custom domain
- [ ] 23. Test `https://badgertechnologiesllc.netlify.app` redirects

## 🕐 Timeline Expectations

### Immediate (0-5 minutes):
- Netlify custom domain configuration
- DNS record changes at Name.com

### Short term (15-30 minutes):
- DNS propagation starts
- Initial domain resolution

### Medium term (1-2 hours):
- Full DNS propagation to local ISPs
- SSL certificate provisioning

### Long term (24-48 hours):
- Global DNS propagation complete
- All edge cases working worldwide

## 🔧 Troubleshooting

### If domain doesn't resolve:
1. Check DNS records are correct at Name.com
2. Wait for propagation (can take up to 48 hours)
3. Test with `nslookup badgertechnologies.us 8.8.8.8`

### If SSL certificate fails:
1. Ensure DNS is fully propagated first
2. Try reprovisioning certificate in Netlify
3. Check that A record points to correct Netlify IP

### If site loads but shows wrong domain:
1. Check browser cache (hard refresh: Ctrl+F5)
2. Verify custom domain is set as primary in Netlify
3. Check for any conflicting redirects

## 📋 Final Result

### What users will see:
✅ **badgertechnologies.us** in address bar
✅ Your website content loads normally  
✅ HTTPS/SSL automatically enabled
✅ Fast loading via Netlify CDN
✅ Professional appearance

### What happens technically:
1. DNS points `badgertechnologies.us` to Netlify servers
2. Netlify serves your site content
3. SSL certificate automatically managed
4. Old Netlify subdomain redirects to custom domain
