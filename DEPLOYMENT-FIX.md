# CLOUDFLARE PAGES DEPLOYMENT INSTRUCTIONS

## ⚠️ URGENT: Fix Required in Cloudflare Pages Dashboard

The build is failing because Cloudflare Pages is configured to run `npx wrangler deploy` which is for Workers, not static sites.

### 🔧 FIX: Update Build Settings in Cloudflare Pages

1. **Go to Cloudflare Dashboard**
   - Navigate to Pages → Your Project → Settings → Builds & deployments

2. **Update Build Configuration:**
   ```
   Framework preset: None
   Build command: npm run build
   Build output directory: . (root directory)
   ```

3. **❌ REMOVE Custom Deploy Command:**
   - If there's a "Deploy command" field, **LEAVE IT EMPTY**
   - Do NOT use: `npx wrangler deploy`
   - Static sites don't need custom deploy commands

4. **Environment Variables:**
   - Leave empty (none needed for static sites)

### ✅ Correct Settings Should Be:

```yaml
Framework: None (Static Site)
Build command: npm run build
Build output directory: .
Deploy command: (EMPTY - leave blank)
Root directory: (EMPTY - leave blank)
```

### 🚀 After Making Changes:

1. Save the settings in Cloudflare Pages
2. Trigger a new deployment
3. The build should complete successfully
4. Your site will be live with:
   - ✅ Static HTML/CSS/JS files served
   - ✅ Functions from `/functions/` directory deployed automatically
   - ✅ Redirects from `_redirects` file applied
   - ✅ Headers from `_headers` file applied

### 📋 Expected Successful Build Log:

```
✅ Installing dependencies: bun install
✅ Executing build command: npm run build
✅ Static site - no build required
✅ Build completed successfully
✅ Deploying to Cloudflare Pages...
✅ Functions deployed from /functions/
✅ Site deployed successfully
```

### 🆘 If Still Having Issues:

1. Check that NO `wrangler.toml` file exists in the repository
2. Verify `package.json` has no deploy scripts
3. Ensure Cloudflare Pages project type is set to "Static site" not "Worker"

---

**Current Status**: Build configuration files updated in repository. Dashboard settings need to be fixed.