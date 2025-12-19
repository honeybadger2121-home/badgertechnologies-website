# Setting Up training.badgertechnologies.us Subdomain



## Steps to Configure in Cloudflare



### Option 1: Separate Cloudflare Pages Project (Recommended)



1. **Create New Pages Project:**

   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project"
   - Connect to your GitHub repository: `badgertechnologies-website`
   - Name it: `badger-training`
   

2. **Build Configuration:**

   - Build command: (leave empty)
   - Build output directory: `/trainings`
   - Root directory: `trainings`


3. **Custom Domain:**

   - After deployment, go to project settings
   - Click "Custom domains"
   - Add custom domain: `training.badgertechnologies.us`
   - Cloudflare will automatically configure DNS


### Option 2: DNS CNAME Record (Simpler)



1. **Go to Cloudflare Dashboard:**

   - Navigate to your domain: `badgertechnologies.us`
   - Click on "DNS" → "Records"


2. **Add CNAME Record:**

   - Type: `CNAME`
   - Name: `training`
   - Target: `badgertechnologies-website.pages.dev` (your main Pages domain)
   - Proxy status: Proxied (orange cloud)
   - TTL: Auto


3. **Add Page Rule (if needed):**

   - Go to "Rules" → "Page Rules"
   - Create rule for: `training.badgertechnologies.us/*`
   - Setting: Forwarding URL (301 - Permanent Redirect)
   - Destination URL: `https://badgertechnologies.us/trainings/$1`


## Current Setup

The training content is located in the `/trainings` directory and is ready to be deployed as a subdomain.


## Files Ready for Deployment

- trainings/index.html (main training hub)

- trainings/client-engagement-training.html

- trainings/product-overview.html

- trainings/course-script.js

- trainings/course-styles.css

- All supporting files



## Note

After configuring in Cloudflare, the training system will be accessible at:

- https://training.badgertechnologies.us


Instead of:

- https://badgertechnologies.us/trainings

