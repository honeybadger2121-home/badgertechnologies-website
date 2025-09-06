# Git Deployment Setup for Netlify

## Quick Git Setup (One-time)

### Step 1: Initialize Git Repository
```bash
cd c:\opt\badgertechnologies.it.com
git init
git add .
git commit -m "Initial website setup with email functionality"
```

### Step 2: Create GitHub Repository
1. Go to [github.com](https://github.com) and create new repository
2. Name it: `badgertechnologies-website`
3. Don't initialize with README (we already have files)
4. Copy the repository URL

### Step 3: Connect to GitHub
```bash
git remote add origin https://github.com/yourusername/badgertechnologies-website.git
git branch -M main
git push -u origin main
```

### Step 4: Connect Netlify to GitHub
1. In Netlify dashboard, go to "Site settings"
2. Click "Build & deploy" → "Link repository"
3. Choose GitHub and select your repository
4. Set build settings:
   - Build command: (leave empty)
   - Publish directory: (leave empty or set to ".")

## Future Updates (30 seconds each)

After Git setup, updating is super easy:

```bash
cd c:\opt\badgertechnologies.it.com
git add .
git commit -m "Updated contact form and styling"
git push
```

**That's it!** Netlify automatically deploys when you push to GitHub.

## Benefits of Git Method:
✅ **Instant deployments** - Push and it's live
✅ **Version history** - Track all changes
✅ **Rollback capability** - Undo if needed
✅ **Team collaboration** - Multiple people can contribute
✅ **Automatic builds** - No manual uploading
