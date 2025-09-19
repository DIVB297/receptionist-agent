# Production Deployment Guide

This guide will help you deploy your Receptionist Agent to production using Nginx as a reverse proxy.

## Prerequisites

- Ubuntu/Debian server (VPS or dedicated server)
- Domain name pointing to your server
- SSH access to your server
- Basic knowledge of Linux commands

## Deployment Options

### Option 1: Manual Server Setup (Full Control)

#### 1. Server Setup

```bash
# Connect to your server
ssh user@your-server-ip

# Run the deployment script
./deploy.sh
```

#### 2. Upload Your Application

```bash
# On your local machine, upload files to server
scp -r . user@your-server-ip:/var/www/receptionist-agent/

# Or use git
cd /var/www/receptionist-agent
git clone https://github.com/your-username/receptionist-agent.git .
```

#### 3. Configure Environment Variables

```bash
cd /var/www/receptionist-agent
cp .env.production.example .env.production

# Edit the environment file
nano .env.production
```

#### 4. Build and Start Application

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 5. Configure Nginx

```bash
# Update domain name in nginx.conf
nano nginx.conf

# Copy Nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/receptionist-agent
sudo ln -s /etc/nginx/sites-available/receptionist-agent /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. Setup SSL Certificates

```bash
# Edit the SSL setup script with your domain and email
nano setup-ssl.sh

# Run SSL setup
sudo ./setup-ssl.sh
```

### Option 2: Cloud Platform Deployment (Easier)

#### Vercel (Recommended for Next.js)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `OPENMIC_API_KEY`
     - `NEXT_PUBLIC_APP_URL`
   - Deploy

3. **Update OpenMic Webhooks**:
   - Pre-call webhook: `https://your-app.vercel.app/api/webhooks/pre-call`
   - Post-call webhook: `https://your-app.vercel.app/api/webhooks/post-call`
   - Function URL: `https://your-app.vercel.app/api/functions/employee-lookup`

#### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `out`
3. **Add to package.json**:
   ```json
   {
     "scripts": {
       "build": "next build && next export"
     }
   }
   ```

#### Railway

1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### Option 3: Docker Deployment

Create a Dockerfile:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env.production` to version control
- Use strong secrets for API keys
- Rotate keys regularly

### 2. Nginx Security
- Enable rate limiting
- Configure fail2ban
- Regular security updates

### 3. SSL/TLS
- Use HTTPS only
- Configure HSTS headers
- Regular certificate renewal

### 4. Monitoring
- Set up log monitoring
- Configure PM2 monitoring
- Use uptime monitoring services

## Updating Your Application

```bash
# Pull latest changes
cd /var/www/receptionist-agent
git pull origin main

# Install new dependencies
npm install

# Rebuild application
npm run build

# Restart PM2
pm2 restart receptionist-agent

# Reload Nginx if config changed
sudo nginx -t && sudo systemctl reload nginx
```

## Troubleshooting

### Check Application Logs
```bash
pm2 logs receptionist-agent
```

### Check Nginx Logs
```bash
sudo tail -f /var/log/nginx/receptionist-agent-error.log
sudo tail -f /var/log/nginx/receptionist-agent-access.log
```

### Test Endpoints
```bash
curl -I https://your-domain.com/api/webhooks/pre-call
curl -I https://your-domain.com/api/functions/employee-lookup
```

## Performance Optimization

1. **Enable gzip compression** (already in nginx.conf)
2. **Configure caching headers** (already in nginx.conf)
3. **Use CDN** for static assets
4. **Database optimization** if you add one
5. **Monitor with PM2 Plus** or similar

## Backup Strategy

```bash
# Backup application data
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/receptionist-agent

# Backup logs
tar -czf logs-backup-$(date +%Y%m%d).tar.gz /var/log/pm2/ /var/log/nginx/
```

## Support

For issues with:
- **Next.js**: Check the [Next.js documentation](https://nextjs.org/docs)
- **Nginx**: Check `sudo nginx -t` for configuration errors
- **PM2**: Use `pm2 status` and `pm2 logs`
- **SSL**: Verify with `sudo certbot certificates`
