# GitHub Pages Deployment

The site is now configured for **static export** and automatic deployment to GitHub Pages.

## What was changed

1. **`web/next.config.ts`**: Added `output: "export"` to enable static export builds
2. **`.github/workflows/deploy.yml`**: Created GitHub Actions workflow to build and deploy automatically
3. **`web/.nojekyll`**: Added to prevent GitHub from processing files with Jekyll

## How to deploy

### Option 1: Automatic (Recommended)
Once you push to GitHub:
1. Go to your repository **Settings → Pages**
2. Under "Build and deployment", select:
   - **Source**: GitHub Actions
   - **Branch**: (already configured in the workflow)

The workflow will run automatically on every push to `main` and deploy to GitHub Pages.

### Option 2: Manual
Build and deploy locally:
```bash
cd web
npm run build
# Now web/out/ contains the static site
```

Then push both changes and the workflow will deploy.

## Verification

After deployment, your site will be at:
- `https://<username>.github.io/` (for user/org repo) or
- `https://<username>.github.io/<repo-name>/` (for a project repo)

The GitHub Actions workflow runs each time you push to `main` and:
1. Installs dependencies
2. Runs `npm run build` to generate static files in `web/out/`
3. Uploads to GitHub Pages

## Build output

- **Source**: `web/` (Next.js app with React)
- **Built site**: `web/out/` (static HTML/CSS/JS)
- **Deployed to**: GitHub Pages `gh-pages` branch (automatic)

## Offline and service worker

The service worker (`public/sw.js`) will work with the static export. The site remains fully functional offline after the first visit.

## What's next

1. Push these changes to GitHub
2. Check Settings → Pages to verify the deployment source
3. The site should be live within a few minutes
