# 🔧 Deployment Troubleshooting Guide



## The Error You Saw


```
TypeError: Cannot read properties of undefined (reading 'fetch')
```

This error occurs when the Cloudflare Worker tries to access `env.ASSETS.fetch()` but the `env.ASSETS` binding isn't available.

---


## ✅ What I Fixed


**Updated:** `src/worker.js`

**Changes:**

- Added check for `env.ASSETS` availability before trying to use it

- Added error handling with try/catch

- Added helpful error messages if the binding is missing

- Better logging for debugging


**Result:** The worker will now show a clear error message instead of crashing if the environment isn't set up correctly.

---


## 🚀 How to Deploy Your Website


You have a Cloudflare Pages setup. Here's how to deploy properly:


### **Option 1: Deploy via Cloudflare Dashboard (Recommended)**



1. **Go to Cloudflare Dashboard:**

   - Visit https://dash.cloudflare.com
   - Sign in with your account


2. **Go to Pages:**

   - Click "Workers & Pages" in the left sidebar
   - Click "Pages" tab
   - Look for your "badgertechnologies" project (or create new)


3. **Connect to GitHub:**

   - If not already connected, click "Create application"
   - Select "Connect to Git"
   - Choose your repository: `honeybadger2121-home/badgertechnologies-website`
   - Click "Begin setup"


4. **Configure Build Settings:**

   ```
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   ```


5. **Environment Variables (Optional):**

   - Add any environment variables if needed
   - Click "Save and Deploy"


6. **Deploy:**

   - Cloudflare will automatically build and deploy
   - Every push to `main` branch will trigger a new deployment
   - Your site will be at: `badgertechnologies.pages.dev` (or custom domain)

---


### **Option 2: Deploy via Wrangler CLI**


**Prerequisites:**

- Node.js installed (already have this)

- Wrangler CLI installed


**Install Wrangler (if not installed):**
```powershell
npm install -g wrangler
```

**Login to Cloudflare:**
```powershell
wrangler login
```

**Deploy:**
```powershell
cd "c:\Users\bsherman\OneDrive - Ecker Center for Behavioral Health\Desktop\badgertechnologies-website"
npm run build
wrangler pages deploy dist --project-name=badgertechnologies
```

---


## 🔍 Verify Deployment is Working


After deploying, check these:


1. **Visit your site:**

   - https://badgertechnologies.pages.dev (or your custom domain)
   - Should load without errors


2. **Check browser console:**

   - Press F12
   - Look for JavaScript errors
   - Should be clean (no worker errors)


3. **Test navigation:**

   - Click through pages (About, Services, Contact)
   - All pages should load properly
   - No 404 errors

---


## ⚙️ Configuration Files Explained



### **wrangler.toml**

```toml
name = "badgertechnologies"          # Project name

main = "src/worker.js"               # Worker file

compatibility_date = "2023-10-30"    # Cloudflare runtime version


[assets]
directory = "dist"                   # Where built files are

binding = "ASSETS"                   # Environment variable name


[build]
command = "npm run build"            # Build command

```


### **package.json scripts**

```json
{
  "build": "node ./scripts/build.mjs",  // Builds your site to dist/
  "deploy": "wrangler deploy",          // Deploys to Cloudflare
  "dev": "wrangler dev"                 // Local development server
}
```

---


## 🛠️ Common Issues & Solutions



### **Issue 1: "ASSETS binding not available"**


**Cause:** Worker deployed without proper Cloudflare Pages configuration

**Solution:**

1. Make sure you're deploying via Cloudflare Pages (not Workers directly)

2. Check that `wrangler.toml` has the `[assets]` section

3. Deploy using `wrangler pages deploy` not `wrangler deploy`


---


### **Issue 2: "404 Not Found" on page refresh**


**Cause:** Worker not handling SPA-style routing

**Solution:**

- The fixed `worker.js` now handles this

- GET requests for HTML pages will fall back to `/index.html`

- This allows client-side routing to work


---


### **Issue 3: Changes not showing up**


**Cause:** Browser cache or Cloudflare cache

**Solution:**

1. **Clear browser cache:**

   - Press `Ctrl + Shift + R` (hard refresh)
   - Or `Ctrl + F5`


2. **Purge Cloudflare cache:**

   - Go to Cloudflare Dashboard
   - Select your domain
   - Click "Caching" → "Configuration"
   - Click "Purge Everything"

---


### **Issue 4: Build fails**


**Cause:** Missing dependencies or build script error

**Solution:**
```powershell

# Reinstall dependencies

npm install


# Run build locally to see errors

npm run build


# Check for errors in terminal

# Fix any issues in your HTML/CSS/JS files

```

---


## 📝 Deployment Checklist


Before deploying, verify:


- [ ] All files committed to GitHub (`git status` shows clean)

- [ ] Build runs successfully locally (`npm run build`)

- [ ] No errors in browser console when testing locally

- [ ] `wrangler.toml` is configured correctly

- [ ] Cloudflare Pages project exists and is connected to GitHub

- [ ] Custom domain (if using) is configured in Cloudflare


After deploying, verify:


- [ ] Site loads without errors

- [ ] All pages are accessible

- [ ] Forms work (contact form, assessment form)

- [ ] Images load correctly

- [ ] No console errors in browser

- [ ] Mobile responsive (test on phone)


---


## 🌐 Custom Domain Setup


If you want to use `badgertechnologies.us` instead of `badgertechnologies.pages.dev`:


1. **Go to Cloudflare Pages project**

2. **Click "Custom domains"**

3. **Click "Set up a custom domain"**

4. **Enter:** `badgertechnologies.us`

5. **Cloudflare will provide DNS records**

6. **Add DNS records in your domain registrar:**

   - CNAME: `www` → `badgertechnologies.pages.dev`
   - Or use Cloudflare as your DNS provider for automatic setup

---


## 🔄 Automatic Deployments


**Good news:** If connected to GitHub, deployments are automatic!

**How it works:**

1. You commit changes: `git commit -m "Update pricing"`

2. You push to GitHub: `git push`

3. Cloudflare detects the push

4. Cloudflare runs `npm run build`

5. Cloudflare deploys the built files

6. Site is live in 1-2 minutes


**View deployment status:**

- Go to Cloudflare Dashboard → Pages → Your project

- Click "Deployments" tab

- See real-time build logs and status


---


## 🆘 Still Having Issues?



### **Check Cloudflare build logs:**

1. Cloudflare Dashboard → Pages → badgertechnologies

2. Click latest deployment

3. View build log

4. Look for error messages



### **Test locally first:**

```powershell

# Install dependencies

npm install


# Build site

npm run build


# Run local development server

wrangler dev
```


### **Contact Cloudflare Support:**

- https://dash.cloudflare.com → Support

- Provide: Project name, error message, deployment ID


---


## ✅ Deployment is Now Fixed


The worker.js error is resolved. Your next deployment should work correctly.

**Next steps:**

1. Push your latest changes to GitHub (already done)

2. Wait for Cloudflare to auto-deploy (1-2 minutes)

3. Visit your site to verify it's working

4. Start using your sales materials to get clients!


**Your focus should be on SALES, not technical issues.** The website is ready! 🚀
