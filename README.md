# Stellarc Dynamics - Elite Automation Platform

## 🚀 Overview

Stellarc Dynamics is a cutting-edge automation and data intelligence platform that provides premium solutions for businesses. The platform features:

- **5 Elite Automations**: AI-powered automation solutions for sales, marketing, and business intelligence
- **5 Elite Scrapers**: Enterprise-grade data extraction tools for e-commerce, real estate, jobs, finance, and social media
- **Dual Payment Options**: Pay-per-use credits or full license purchase
- **Stripe & PayPal Integration**: Flexible payment processing
- **Admin Dashboard**: Comprehensive analytics and user management
- **API Key System**: Download and self-host purchased automations

## 🎯 Features

### Automations
1. **LinkedIn Lead Generation & Outreach** - AI-powered prospect identification
2. **Multi-Platform Social Media Orchestrator** - Content creation across all platforms
3. **Real-Time Market Intelligence** - Competitor analysis and market trends
4. **Sales Funnel Optimizer** - Automated customer journey optimization
5. **Smart Email Campaign Manager** - AI-powered email personalization

### Scrapers
1. **E-commerce Price Intelligence** - Multi-platform product monitoring
2. **Real Estate Market Data** - Property listings and investment analysis
3. **Job Market Intelligence** - Talent acquisition and salary insights
4. **Financial Sentiment Analyzer** - Stock market and news analysis
5. **Social Trend Analyzer** - Influencer and viral content tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: Redis (for fast data access and caching)
- **Payments**: Stripe, PayPal
- **Authentication**: JWT-based auth with secure cookies
- **Charts**: Recharts for analytics visualization

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- Redis server running (local or cloud)
- Stripe account (for payment processing)
- PayPal developer account (for PayPal payments)

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd stellarc-dynamics
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Application Configuration
ADMIN_EMAIL=admin@stellarcdynamics.com
JWT_SECRET=your-jwt-secret-here-generate-with-openssl

# Optional: API Keys for Automations
OPENAI_API_KEY=sk-your-openai-key
LINKEDIN_API_KEY=your-linkedin-key
TWITTER_API_KEY=your-twitter-key
```

### 3. Generate Secrets

Generate secure secrets for JWT and NextAuth:

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

### 4. Start Redis

**Option A: Local Redis**
```bash
# Install Redis (macOS)
brew install redis
brew services start redis

# Install Redis (Ubuntu/Debian)
sudo apt-get install redis-server
sudo systemctl start redis

# Install Redis (Windows)
# Download from: https://github.com/microsoftarchive/redis/releases
```

**Option B: Cloud Redis**
- Use Redis Cloud, AWS ElastiCache, or similar
- Update REDIS_URL in .env.local

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the landing page.

## 🔑 Setting Up Payment Providers

### Stripe Setup

1. Create account at https://stripe.com
2. Get API keys from Dashboard → Developers → API keys
3. Set up webhook endpoint:
   - URL: `http://localhost:3000/api/payments/stripe/webhook`
   - Events: `payment_intent.succeeded`
4. Copy webhook secret to `.env.local`

### PayPal Setup

1. Create developer account at https://developer.paypal.com
2. Create REST API app
3. Get Client ID and Secret
4. Set mode to `sandbox` for testing

## 👤 Creating Admin User

To access the admin dashboard, create an admin user:

1. Sign up through the UI at `http://localhost:3000`
2. Connect to Redis and update user role:

```bash
redis-cli
> GET user:email:your-email@example.com
# Copy the user data
> SET user:email:your-email@example.com '{"id":"user-id","email":"your-email@example.com","name":"Your Name","password":"hashed-password","role":"admin","credits":0,"createdAt":"...","updatedAt":"..."}'
```

Or use a Redis GUI tool to update the role field to "admin".

3. Access admin dashboard at `http://localhost:3000/admin`

## 📊 Platform Structure

```
stellarc-dynamics/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── payments/     # Payment processing
│   │   ├── automations/  # Automation execution
│   │   ├── scrapers/     # Scraper execution
│   │   ├── admin/        # Admin endpoints
│   │   └── user/         # User profile
│   ├── dashboard/        # User dashboard
│   ├── admin/           # Admin panel
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # Reusable UI components
│   ├── landing/         # Landing page sections
│   ├── auth/            # Auth components
│   ├── dashboard/       # Dashboard components
│   └── admin/           # Admin components
├── lib/
│   ├── automations/     # Automation implementations
│   ├── scrapers/        # Scraper implementations
│   ├── redis/           # Redis client and helpers
│   ├── stripe/          # Stripe integration
│   ├── paypal/          # PayPal integration
│   ├── auth/            # Authentication logic
│   └── utils/           # Utility functions
└── public/              # Static assets
```

## 🎨 Customization

### Adding New Automations

1. Create implementation in `lib/automations/your-automation.ts`
2. Add definition to `lib/automations/definitions.ts`
3. Update execution logic in `app/api/automations/execute/route.ts`

### Adding New Scrapers

1. Create implementation in `lib/scrapers/your-scraper.ts`
2. Add definition to `lib/scrapers/definitions.ts`
3. Update execution logic in `app/api/scrapers/execute/route.ts`

## 💰 Pricing Strategy

Current pricing is set competitively:

- **Automations**: $10-$30 per use, $1,799-$4,999 full license
- **Scrapers**: $14-$30 per use, $2,299-$4,999 full license

Adjust prices in `lib/automations/definitions.ts` and `lib/scrapers/definitions.ts`.

## 🔐 Security Features

- JWT-based authentication with secure HTTP-only cookies
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Secure payment processing through Stripe/PayPal
- API key validation for downloaded automations
- Admin role-based access control

## 📈 Analytics & Monitoring

The admin dashboard provides:
- Total revenue tracking
- User registration metrics
- Usage statistics per automation/scraper
- Revenue trends over time
- Top performing products

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## 🔧 API Keys Required

For full functionality, you'll need:

- **OpenAI API Key**: For AI-powered content generation
- **LinkedIn API Key**: For LinkedIn automation (or use data provider)
- **Twitter API Key**: For Twitter automation
- Platform-specific keys for scrapers (optional, uses mock data by default)

## 📝 License

Proprietary - Stellarc Dynamics © 2025

## 🤝 Support

For support and inquiries:
- Email: admin@stellarcdynamics.com
- Documentation: Coming soon

## 🎯 Roadmap

- [ ] Additional automation solutions
- [ ] More scraper integrations
- [ ] Mobile app
- [ ] API documentation
- [ ] Webhook integrations
- [ ] Team collaboration features
- [ ] Advanced analytics
- [ ] White-label options

---

**Stellarc Dynamics** - We don't just raise the bar, we ARE the bar.