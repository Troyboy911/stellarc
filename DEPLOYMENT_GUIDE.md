# Stellarc Dynamics - Production Deployment Guide

## 🚀 Deployment Checklist

Before deploying to production, ensure you have:

- [ ] Redis instance (production-ready)
- [ ] Stripe account with live API keys
- [ ] PayPal account with production credentials
- [ ] Domain name configured
- [ ] SSL certificate (automatic with Vercel/Netlify)
- [ ] Environment variables configured
- [ ] Admin user created
- [ ] Payment webhooks configured
- [ ] Monitoring and logging set up

---

## Option 1: Vercel Deployment (Recommended)

### Why Vercel?
- Zero-config deployment
- Automatic SSL certificates
- Global CDN
- Serverless functions
- Easy environment variable management
- Automatic preview deployments

### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/stellarc-dynamics.git
git push -u origin main
```

2. **Import to Vercel**
- Go to https://vercel.com
- Click "Import Project"
- Select your GitHub repository
- Configure project settings

3. **Add Environment Variables**

In Vercel dashboard, add all variables from `.env.local`:

```
REDIS_URL=your-production-redis-url
REDIS_PASSWORD=your-redis-password
NEXTAUTH_URL=https://stellarcdynamics.com
NEXTAUTH_SECRET=your-production-secret
JWT_SECRET=your-production-jwt-secret
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PAYPAL_CLIENT_ID=your_production_client_id
PAYPAL_CLIENT_SECRET=your_production_secret
PAYPAL_MODE=production
ADMIN_EMAIL=admin@stellarcdynamics.com
```

4. **Deploy**
- Click "Deploy"
- Wait for build to complete
- Your site is live!

5. **Configure Custom Domain**
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records as instructed
- SSL certificate is automatic

6. **Set Up Webhooks**

**Stripe Webhook:**
- URL: `https://stellarcdynamics.com/api/payments/stripe/webhook`
- Events: `payment_intent.succeeded`

**PayPal Webhook:**
- Configure in PayPal Developer Dashboard
- URL: `https://stellarcdynamics.com/api/payments/paypal/webhook`

---

## Option 2: AWS Deployment

### Architecture
- **Frontend**: AWS Amplify or S3 + CloudFront
- **Backend**: AWS Lambda (via API Gateway)
- **Database**: AWS ElastiCache (Redis)
- **Payments**: Stripe/PayPal webhooks via API Gateway

### Steps

1. **Set Up ElastiCache Redis**
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id stellarc-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

2. **Deploy with AWS Amplify**
```bash
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify publish
```

3. **Configure Environment Variables**
- Add all environment variables in Amplify Console
- Ensure Redis URL points to ElastiCache endpoint

4. **Set Up CloudWatch Monitoring**
- Enable CloudWatch logs
- Set up alarms for errors and performance

---

## Option 3: Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_URL=https://stellarcdynamics.com
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID}
      - PAYPAL_CLIENT_SECRET=${PAYPAL_CLIENT_SECRET}
      - PAYPAL_MODE=production
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  redis-data:
```

### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Option 4: Traditional VPS (DigitalOcean, Linode, etc.)

### Prerequisites
- Ubuntu 22.04 LTS server
- Domain name pointing to server IP
- SSH access

### Installation Script

```bash
#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Redis
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Install Nginx
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Clone repository
cd /var/www
git clone https://github.com/yourusername/stellarc-dynamics.git
cd stellarc-dynamics

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
REDIS_URL=redis://localhost:6379
NEXTAUTH_URL=https://stellarcdynamics.com
NEXTAUTH_SECRET=your-secret
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret
PAYPAL_MODE=production
EOF

# Build application
npm run build

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start npm --name "stellarc-dynamics" -- start
pm2 save
pm2 startup

# Configure Nginx
sudo tee /etc/nginx/sites-available/stellarc-dynamics << EOF
server {
    listen 80;
    server_name stellarcdynamics.com www.stellarcdynamics.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/stellarc-dynamics /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d stellarcdynamics.com -d www.stellarcdynamics.com

echo "Deployment complete!"
```

---

## Post-Deployment Tasks

### 1. Create Admin User

```bash
# SSH into server
ssh user@your-server

# Access Redis
redis-cli

# Find user by email
GET user:email:admin@stellarcdynamics.com

# Update role to admin
SET user:email:admin@stellarcdynamics.com '{"id":"...","role":"admin",...}'
```

### 2. Test Payment Flows

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

**PayPal Sandbox:**
- Use PayPal sandbox accounts for testing

### 3. Configure Monitoring

**Vercel:**
- Built-in analytics available
- Set up error tracking with Sentry

**AWS:**
- CloudWatch for logs and metrics
- Set up alarms for critical errors

**VPS:**
```bash
# Install monitoring tools
sudo apt install -y htop iotop

# Monitor with PM2
pm2 monit

# View logs
pm2 logs stellarc-dynamics
```

### 4. Set Up Backups

**Redis Backups:**
```bash
# Automated Redis backup script
cat > /usr/local/bin/backup-redis.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
redis-cli BGSAVE
sleep 5
cp /var/lib/redis/dump.rdb /backups/redis-$DATE.rdb
find /backups -name "redis-*.rdb" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-redis.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /usr/local/bin/backup-redis.sh" | crontab -
```

### 5. Security Hardening

```bash
# Enable firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Install fail2ban
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## Performance Optimization

### 1. Enable Caching

Add to `next.config.js`:
```javascript
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  images: {
    domains: ['via.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
```

### 2. Redis Optimization

```bash
# Edit Redis config
sudo nano /etc/redis/redis.conf

# Add/modify:
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### 3. Nginx Caching

```nginx
# Add to Nginx config
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;

location / {
    proxy_cache my_cache;
    proxy_cache_valid 200 60m;
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
    # ... rest of proxy config
}
```

---

## Monitoring & Alerts

### Set Up Health Checks

Create `/api/health/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/client';

export async function GET() {
  try {
    await redis.ping();
    return NextResponse.json({ status: 'healthy' });
  } catch (error) {
    return NextResponse.json({ status: 'unhealthy' }, { status: 503 });
  }
}
```

### UptimeRobot Configuration
- Monitor: `https://stellarcdynamics.com/api/health`
- Interval: 5 minutes
- Alert: Email/SMS on downtime

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (AWS ALB, Nginx)
- Multiple app instances
- Shared Redis instance
- Session persistence

### Vertical Scaling
- Increase server resources
- Optimize Redis memory
- Enable Redis clustering

### Database Scaling
- Redis Cluster for high availability
- Read replicas for read-heavy workloads
- Implement caching layers

---

## Troubleshooting

### Common Issues

**Redis Connection Failed:**
```bash
# Check Redis status
sudo systemctl status redis-server

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log

# Test connection
redis-cli ping
```

**Payment Webhook Not Working:**
- Verify webhook URL is accessible
- Check webhook signature validation
- Review webhook logs in Stripe/PayPal dashboard

**High Memory Usage:**
```bash
# Check memory
free -h

# Check Redis memory
redis-cli INFO memory

# Clear Redis cache if needed
redis-cli FLUSHDB
```

---

## Rollback Procedure

### Vercel
- Go to Deployments
- Click on previous deployment
- Click "Promote to Production"

### Docker
```bash
# List images
docker images

# Run previous version
docker run -d previous-image-tag
```

### PM2
```bash
# List processes
pm2 list

# Restart with previous code
git checkout previous-commit
npm run build
pm2 restart stellarc-dynamics
```

---

## Support

For deployment support:
- Email: devops@stellarcdynamics.com
- Slack: #deployment-help
- Documentation: https://docs.stellarcdynamics.com/deployment

---

**Last Updated**: January 2025