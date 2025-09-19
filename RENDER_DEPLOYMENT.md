# Render.com Deployment Guide

This guide will help you deploy your Receptionist Agent to Render.com using your GitHub repository.

## Prerequisites

- GitHub account with your code pushed
- Render.com account (free tier available)
- Your OpenMic API key

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create Web Service on Render

1. **Go to [render.com](https://render.com)** and sign in
2. **Click "New +"** and select **"Web Service"**
3. **Connect your GitHub repository**:
   - Select "Build and deploy from a Git repository"
   - Choose your GitHub account
   - Select your `receptionist-agent` repository
   - Click "Connect"

### 3. Configure Build Settings

Use these settings for your Render deployment:

**Basic Settings:**
- **Name**: `receptionist-agent` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users (Ohio for US East, Frankfurt for Europe)
- **Branch**: `main`
- **Root Directory**: `receptionist-agent` (if your app is in a subdirectory, otherwise leave blank)

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Advanced Settings:**
- **Auto Deploy**: `Yes` (deploys automatically when you push to GitHub)
- **Health Check Path**: `/api/health`

### 4. Environment Variables

Add these environment variables in the Render dashboard:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Production environment |
| `OPENMIC_API_KEY` | `your_actual_api_key` | Your OpenMic API key |
| `NEXT_PUBLIC_APP_URL` | `https://your-app-name.onrender.com` | Your Render app URL |
| `WEBHOOK_BASE_URL` | `https://your-app-name.onrender.com` | Base URL for webhooks |

**To add environment variables:**
1. Go to your service dashboard
2. Click "Environment" tab
3. Click "Add Environment Variable"
4. Enter key and value
5. Click "Save Changes"

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy your application
3. Wait for the build to complete (usually 2-5 minutes)
4. Your app will be available at `https://your-app-name.onrender.com`

### 6. Update OpenMic Configuration

Once deployed, update your OpenMic bot configuration with your new URLs:

**Webhook URLs:**
- Pre-call: `https://your-app-name.onrender.com/api/webhooks/pre-call`
- Post-call: `https://your-app-name.onrender.com/api/webhooks/post-call`

**Function URL:**
- Employee lookup: `https://your-app-name.onrender.com/api/functions/employee-lookup`

## Render Configuration File (Optional)

You can use the `render.yaml` file included in your project for Infrastructure as Code deployment:

1. **Connect via Blueprint**:
   - Instead of "Web Service", choose "Blueprint"
   - Connect your repository
   - Render will read the `render.yaml` file automatically

## Testing Your Deployment

### 1. Health Check
Visit `https://your-app-name.onrender.com/api/health` to verify the app is running.

### 2. Test API Endpoints
```bash
# Test employee lookup
curl -X POST https://your-app-name.onrender.com/api/functions/employee-lookup \
  -H "Content-Type: application/json" \
  -d '{"employee_name": "Sarah Johnson"}'

# Test webhook endpoints
curl -X GET https://your-app-name.onrender.com/api/webhooks/pre-call
curl -X GET https://your-app-name.onrender.com/api/webhooks/post-call
```

### 3. Test Frontend
Visit `https://your-app-name.onrender.com` to see your bot management interface.

## Render.com Benefits for Your Project

✅ **Free tier available** - Perfect for getting started
✅ **Automatic HTTPS** - SSL certificates included
✅ **Auto-deploys** - Deploys when you push to GitHub
✅ **Easy scaling** - Upgrade plans as needed
✅ **Built-in monitoring** - View logs and metrics
✅ **Custom domains** - Use your own domain (paid plans)

## Troubleshooting

### Build Failures
1. Check the build logs in Render dashboard
2. Verify `package.json` scripts are correct
3. Ensure all dependencies are listed

### Runtime Issues
1. Check the service logs in Render dashboard
2. Verify environment variables are set correctly
3. Test endpoints individually

### OpenMic Integration
1. Verify webhook URLs are accessible
2. Check OpenMic dashboard for function call logs
3. Test function endpoints directly

## Cost Considerations

**Free Tier:**
- 750 hours/month (enough for continuous running)
- 512MB RAM, 0.1 CPU
- Perfect for development/testing

**Paid Plans:**
- Start at $7/month
- More resources and features
- Custom domains included

## Updating Your App

To update your deployed application:

1. **Make changes locally**
2. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Update receptionist agent"
   git push origin main
   ```
3. **Render auto-deploys** - No manual action needed!

## Monitor Your Deployment

- **Service logs**: Available in Render dashboard
- **Metrics**: CPU, memory usage, response times
- **Health checks**: Automatic monitoring of `/api/health`
- **Alerts**: Set up notifications for downtime

## Next Steps After Deployment

1. **Test thoroughly** with OpenMic integration
2. **Monitor performance** and adjust resources if needed
3. **Set up custom domain** (optional, paid plans)
4. **Configure production logging** and monitoring
5. **Set up backup/restore** procedures if you add a database later

Your Receptionist Agent is now ready for production use on Render.com! 🚀
