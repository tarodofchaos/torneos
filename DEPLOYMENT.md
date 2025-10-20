# Deployment Guide for Render.com

This guide will help you deploy your tournament management application to Render.com.

## Prerequisites

1. A GitHub account with your code repository
2. A Render.com account
3. Google OAuth credentials (optional, for authentication)

## Step 1: Prepare Your Repository

1. **Commit all changes** to your repository:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Remove sensitive files** from your repository:
   ```bash
   git rm client_secret_2_744849945743-e7gult938fnf1u3efiqadh35qifl1k7b.apps.googleusercontent.com.json
   git commit -m "Remove sensitive Google OAuth file"
   ```

## Step 2: Set Up Google OAuth (Optional)

If you want to use Google authentication:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://your-api-url.onrender.com/auth/google/callback`
5. Note down your Client ID and Client Secret

## Step 3: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. **Connect your repository** to Render:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

2. **Configure environment variables** in the Render dashboard:
   - Go to your API service settings
   - Add these environment variables:
     ```
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     ADMIN_EMAILS=admin@example.com,another-admin@example.com
     ```

### Option B: Manual Setup

If you prefer manual setup:

1. **Create the Database**:
   - Go to Render Dashboard → "New +" → "PostgreSQL"
   - Name: `torneos-db`
   - Plan: Free
   - Note the connection string

2. **Create the Backend Service**:
   - Go to "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `torneos-api`
     - **Environment**: Node
     - **Build Command**: 
       ```bash
       npm install
       cd server && npm install
       cd ../web && npm install
       cd ../web && npm run build
       cd ../server && npm run deploy
       ```
     - **Start Command**: `cd server && npm start`
     - **Environment Variables**:
       - `NODE_ENV`: `production`
       - `DATABASE_URL`: (from your database)
       - `SESSION_SECRET`: (generate a random string)
       - `GOOGLE_CLIENT_ID`: (your Google client ID)
       - `GOOGLE_CLIENT_SECRET`: (your Google client secret)
       - `ADMIN_EMAILS`: (comma-separated admin emails)
       - `FRONTEND_URL`: `https://your-frontend-url.onrender.com`

3. **Create the Frontend Service**:
   - Go to "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `torneos-web`
     - **Build Command**: 
       ```bash
       npm install
       cd web && npm install
       cd web && npm run build
       ```
     - **Publish Directory**: `web/dist`
     - **Add redirects** for API routes:
       - `/api/*` → `https://your-api-url.onrender.com/api/*`
       - `/auth/*` → `https://your-api-url.onrender.com/auth/*`
       - `/logout` → `https://your-api-url.onrender.com/logout`

## Step 4: Update Configuration

After deployment, update your frontend configuration:

1. **Update API base URL** in your frontend code if needed
2. **Update Google OAuth redirect URI** to match your deployed API URL
3. **Test the deployment** by visiting your frontend URL

## Step 5: Database Migration

The deployment script will automatically:
- Generate Prisma client
- Push the database schema
- Set up the database tables

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `SESSION_SECRET` | Secret for session encryption | Yes | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No | - |
| `ADMIN_EMAILS` | Comma-separated admin emails | No | - |
| `FRONTEND_URL` | Frontend URL for OAuth redirects | Yes | - |
| `NODE_ENV` | Environment mode | Yes | `production` |

## Troubleshooting

### Common Issues:

1. **Build fails**: Check that all dependencies are properly installed
2. **Database connection fails**: Verify the `DATABASE_URL` is correct
3. **OAuth redirect fails**: Ensure the redirect URI matches your deployed URL
4. **Frontend can't reach API**: Check that API routes are properly configured

### Logs:

- Check Render dashboard logs for detailed error messages
- API logs: Go to your API service → "Logs" tab
- Frontend logs: Go to your static site → "Logs" tab

## Security Notes

1. **Never commit sensitive files** like OAuth credentials
2. **Use environment variables** for all secrets
3. **Enable HTTPS** (Render provides this automatically)
4. **Regularly update dependencies** for security patches

## Cost Considerations

- **Free tier limitations**:
  - Services sleep after 15 minutes of inactivity
  - Database has limited storage
  - Limited build minutes per month

- **Upgrade options**:
  - Starter plan ($7/month) for always-on services
  - Pro plan ($25/month) for production workloads

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)

---

Your tournament management application should now be live on Render.com! 🎉
