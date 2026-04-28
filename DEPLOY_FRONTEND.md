# Frontend Deployment Guide (Vercel)

Now that your backend is live at `https://library-backend-1-eazh.onrender.com`, follow these steps to deploy your Shikshaintel frontend to Vercel!

## Step 1: Push Frontend to GitHub

Before deploying, ensure all your latest frontend changes are pushed to GitHub. This includes the updated branding (Shikshaintel) and the dynamic `Constants.tsx` file.

1. Open your terminal in the `library_frontend` folder.
2. Run standard git commands (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Vercel"
   git push
   ```

## Step 2: Set Up Vercel

1. **Create Account**: Go to [Vercel.com](https://vercel.com/) and sign up using your GitHub account.
2. **Add New Project**:
   - From your Vercel dashboard, click **Add New** -> **Project**.
   - Find your frontend repository (e.g., `library_frontend`) under the "Import Git Repository" section and click **Import**.
3. **Configure Project**:
   - Vercel should automatically detect that this is a **Next.js** framework project.
   - **Important**: If your Next.js project is not in the root directory (for example, if it's inside `library_frontend/library_frontend`), you must edit the **Root Directory** setting to point to the folder containing `package.json`.

## Step 3: Add Environment Variables

This is the most critical step. You must tell your Vercel frontend where your live Render backend is located!

1. Expand the **Environment Variables** tab in Vercel.
2. Add the following key-value pair:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://library-backend-1-eazh.onrender.com/api`
3. Click **Add**.

_Note: Ensure there is no trailing slash (`/`) at the very end of the URL value._

## Step 4: Deploy & Verify

1. Click the big **Deploy** button.
2. Vercel will install dependencies, build the site, and assign you a live domain (e.g., `https://library-frontend-sigma.vercel.app`).
3. Once deployed, click the preview window to visit your live site!
4. **Verification**: Try logging in or creating a test student. If it works, your frontend and backend are successfully talking to each other in the cloud!
