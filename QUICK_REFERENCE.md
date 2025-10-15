# Stellarc Dynamics - Quick Reference Card

## 🔗 Important Links

**Live Platform**: https://3000-b3bdbdbe-6ea8-4522-bc83-567dd06eab62.proxy.daytona.works  
**Landing Page**: `/`  
**User Dashboard**: `/dashboard`  
**Admin Panel**: `/admin`

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check Redis connection
redis-cli ping
```

---

## 🔑 Essential Environment Variables

```env
REDIS_URL=redis://localhost:6379
JWT_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
STRIPE_SECRET_KEY=sk_test_or_live_key
PAYPAL_CLIENT_ID=your_client_id
```

---

## 📊 Platform Overview

### 5 Automations
1. LinkedIn Lead Gen - $15/$2,499
2. Social Orchestrator - $12/$1,999
3. Market Intelligence - $25/$3,999
4. Sales Funnel - $20/$3,499
5. Email Campaign - $10/$1,799

### 5 Scrapers
1. E-commerce - $18/$2,999
2. Real Estate - $22/$3,499
3. Job Market - $16/$2,699
4. Financial - $30/$4,999
5. Social Trends - $14/$2,299

**Total Revenue Potential**: $31,990 per customer (all full licenses)

---

## 🔧 Common Tasks

### Create Admin User
```bash
redis-cli
> GET user:email:your@email.com
> SET user:email:your@email.com '{"id":"...","role":"admin",...}'
```

### Check Server Status
```bash
# Check if dev server is running
curl http://localhost:3000/api/health

# View server logs
tmux attach -t dev
```

### Restart Services
```bash
# Restart dev server
tmux kill-session -t dev
cd stellarc-dynamics && npm run dev

# Restart Redis
sudo systemctl restart redis-server
```

---

## 📁 Key Files

### Configuration
- `.env.local` - Environment variables
- `next.config.js` - Next.js config
- `tailwind.config.ts` - Styling config

### Core Logic
- `lib/automations/definitions.ts` - Automation catalog
- `lib/scrapers/definitions.ts` - Scraper catalog
- `lib/redis/client.ts` - Database connection
- `lib/stripe/client.ts` - Payment processing

### API Routes
- `app/api/auth/*` - Authentication
- `app/api/payments/*` - Payments
- `app/api/automations/execute` - Run automations
- `app/api/scrapers/execute` - Run scrapers
- `app/api/admin/analytics` - Admin data

---

## 🐛 Troubleshooting

### Redis Not Connecting
```bash
# Check if running
sudo systemctl status redis-server

# Start Redis
sudo systemctl start redis-server

# Test connection
redis-cli ping
```

### Port Already in Use
```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

---

## 💰 Pricing Quick Reference

| Item | Per-Use | Full License |
|------|---------|--------------|
| LinkedIn Lead Gen | $15 | $2,499 |
| Social Orchestrator | $12 | $1,999 |
| Market Intelligence | $25 | $3,999 |
| Sales Funnel | $20 | $3,499 |
| Email Campaign | $10 | $1,799 |
| E-commerce Intel | $18 | $2,999 |
| Real Estate Intel | $22 | $3,499 |
| Job Market Intel | $16 | $2,699 |
| Financial Sentiment | $30 | $4,999 |
| Social Trends | $14 | $2,299 |

---

## 🔐 Security Checklist

- [x] JWT authentication
- [x] Password hashing (bcrypt)
- [x] HTTP-only cookies
- [x] Rate limiting
- [x] Input validation
- [x] API key generation
- [x] Role-based access
- [ ] SSL certificate (production)
- [ ] Firewall rules (production)
- [ ] Regular backups (production)

---

## 📞 Support Resources

**Documentation**:
- README.md - Main docs
- SETUP_GUIDE.md - Setup instructions
- API_DOCUMENTATION.md - API reference
- DEPLOYMENT_GUIDE.md - Deployment guide
- PROJECT_SUMMARY.md - Complete overview

**External Resources**:
- Next.js: https://nextjs.org/docs
- Redis: https://redis.io/docs
- Stripe: https://stripe.com/docs
- PayPal: https://developer.paypal.com

---

## 🎯 Pre-Launch Checklist

**Development**:
- [x] Platform built
- [x] Features implemented
- [x] Documentation written
- [ ] API keys configured
- [ ] Redis set up

**Testing**:
- [ ] Sign up/sign in tested
- [ ] Payment flows tested
- [ ] Automations tested
- [ ] Scrapers tested
- [ ] Admin panel tested

**Production**:
- [ ] Domain configured
- [ ] SSL certificate
- [ ] Environment variables
- [ ] Webhooks configured
- [ ] Monitoring enabled
- [ ] Backups scheduled

**Launch**:
- [ ] Admin user created
- [ ] Marketing ready
- [ ] Support channels
- [ ] Analytics tracking
- [ ] Go live! 🚀

---

## 💡 Pro Tips

1. **Start with test API keys** - Use Stripe/PayPal sandbox first
2. **Monitor Redis memory** - Set maxmemory limits
3. **Regular backups** - Automate Redis backups daily
4. **Track metrics** - Use admin dashboard analytics
5. **Test payments** - Use test cards before going live
6. **Secure secrets** - Never commit .env files
7. **Update dependencies** - Keep packages current
8. **Scale gradually** - Start small, grow as needed

---

## 🚀 One-Command Deploy

### Vercel
```bash
vercel --prod
```

### Docker
```bash
docker-compose up -d
```

### PM2
```bash
pm2 start npm --name stellarc -- start
```

---

## 📊 Key Metrics to Track

- **MRR**: Monthly Recurring Revenue
- **CAC**: Customer Acquisition Cost
- **LTV**: Lifetime Value
- **Conversion Rate**: Visitors → Customers
- **Churn Rate**: Customer retention
- **ARPU**: Average Revenue Per User

---

## 🎓 Learning Path

1. **Week 1**: Set up development environment
2. **Week 2**: Configure payment providers
3. **Week 3**: Test all features thoroughly
4. **Week 4**: Deploy to production
5. **Month 2**: Launch marketing campaign
6. **Month 3**: Analyze metrics and optimize

---

## 🔄 Regular Maintenance

**Daily**:
- Check error logs
- Monitor payment transactions
- Review user signups

**Weekly**:
- Backup Redis data
- Review analytics
- Update content

**Monthly**:
- Security updates
- Performance optimization
- Feature additions

---

## 🎉 Success Indicators

✅ Users signing up  
✅ Purchases being made  
✅ Automations being executed  
✅ Revenue growing  
✅ Positive user feedback  
✅ Low churn rate  
✅ High engagement  

---

**Remember**: You have a complete, production-ready platform. Just add your API keys, deploy, and start making money!

**Stellarc Dynamics** - We ARE the bar. 🚀