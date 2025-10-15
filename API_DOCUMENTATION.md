# Stellarc Dynamics API Documentation

## Overview

The Stellarc Dynamics API provides programmatic access to all platform features including authentication, payments, automations, and scrapers.

**Base URL**: `https://your-domain.com/api`

## Authentication

All authenticated endpoints require a valid JWT token stored in an HTTP-only cookie.

### Sign Up

Create a new user account.

**Endpoint**: `POST /api/auth/signup`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** (201 Created):
```json
{
  "message": "User created successfully",
  "userId": "uuid-here"
}
```

**Error Responses**:
- `400 Bad Request`: Missing required fields
- `400 Bad Request`: User already exists

---

### Sign In

Authenticate and receive a session token.

**Endpoint**: `POST /api/auth/signin`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** (200 OK):
```json
{
  "message": "Sign in successful",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Sets Cookie**: `auth-token` (HTTP-only, 7 days expiry)

**Error Responses**:
- `400 Bad Request`: Missing credentials
- `401 Unauthorized`: Invalid credentials

---

### Sign Out

End the current session.

**Endpoint**: `POST /api/auth/signout`

**Response** (200 OK):
```json
{
  "message": "Signed out successfully"
}
```

---

## User Profile

### Get User Profile

Retrieve user profile, purchases, and credits.

**Endpoint**: `GET /api/user/profile`

**Authentication**: Required

**Response** (200 OK):
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "purchases": [
    {
      "id": "purchase-uuid",
      "itemId": "linkedin-lead-gen",
      "itemType": "automation",
      "purchaseType": "full",
      "amount": 2499.00,
      "status": "completed",
      "apiKey": "sd_live_...",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "credits": {
    "linkedin-lead-gen": 5,
    "ecommerce-intelligence": 3
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: User not found

---

## Payments

### Create Stripe Payment

Initiate a Stripe payment for an automation or scraper.

**Endpoint**: `POST /api/payments/stripe`

**Authentication**: Required

**Request Body**:
```json
{
  "userId": "user-uuid",
  "itemId": "linkedin-lead-gen",
  "itemType": "automation",
  "purchaseType": "per-use",
  "amount": 15.00
}
```

**Response** (200 OK):
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "purchaseId": "purchase-uuid"
}
```

**Error Responses**:
- `400 Bad Request`: Missing required fields
- `500 Internal Server Error`: Payment processing failed

---

### Stripe Webhook

Handle Stripe payment confirmations (internal use).

**Endpoint**: `POST /api/payments/stripe/webhook`

**Headers**:
- `stripe-signature`: Webhook signature

**Events Handled**:
- `payment_intent.succeeded`: Completes purchase, generates API key if full purchase

---

### Create PayPal Order

Initiate a PayPal payment.

**Endpoint**: `POST /api/payments/paypal`

**Authentication**: Required

**Request Body**:
```json
{
  "userId": "user-uuid",
  "itemId": "linkedin-lead-gen",
  "itemType": "automation",
  "purchaseType": "full",
  "amount": 2499.00
}
```

**Response** (200 OK):
```json
{
  "orderId": "paypal-order-id",
  "purchaseId": "purchase-uuid"
}
```

---

### Capture PayPal Payment

Complete a PayPal payment after user approval.

**Endpoint**: `POST /api/payments/paypal/capture`

**Authentication**: Required

**Request Body**:
```json
{
  "orderId": "paypal-order-id",
  "userId": "user-uuid"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "apiKey": "sd_live_xxx" // Only for full purchases
}
```

---

## Automations

### Execute Automation

Run an automation with specified parameters.

**Endpoint**: `POST /api/automations/execute`

**Authentication**: Required

**Request Body**:
```json
{
  "automationId": "linkedin-lead-gen",
  "params": {
    "targetIndustry": "SaaS",
    "targetRole": "VP of Marketing",
    "maxLeads": 50
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "result": [
    {
      "name": "Sarah Johnson",
      "title": "VP of Marketing",
      "company": "TechCorp Inc",
      "profileUrl": "https://linkedin.com/in/sarahjohnson",
      "score": 85,
      "personalizedMessage": "Hi Sarah, I noticed your work..."
    }
  ],
  "creditsRemaining": "unlimited" // or number
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Insufficient credits
- `400 Bad Request`: Invalid automation ID or params
- `500 Internal Server Error`: Execution failed

---

### Available Automations

#### 1. LinkedIn Lead Generation
**ID**: `linkedin-lead-gen`

**Parameters**:
```json
{
  "targetIndustry": "string (required)",
  "targetRole": "string (required)",
  "companySize": "string (optional)",
  "location": "string (optional)",
  "messageTemplate": "string (optional)",
  "maxLeads": "number (optional, default: 50)"
}
```

**Returns**: Array of lead objects with scores and personalized messages

---

#### 2. Social Media Orchestrator
**ID**: `social-orchestrator`

**Parameters**:
```json
{
  "contentTopic": "string (required)",
  "platforms": ["twitter", "linkedin", "instagram"] (required),
  "tone": "professional|casual|humorous|inspirational (optional)",
  "includeHashtags": "boolean (optional, default: true)",
  "scheduleTime": "string (optional)"
}
```

**Returns**: Array of platform-specific posts with optimal timing

---

#### 3. Market Intelligence
**ID**: `market-intelligence`

**Parameters**:
```json
{
  "competitors": ["string"] (required),
  "industry": "string (required)",
  "metrics": ["pricing", "features", "marketing"] (optional)
}
```

**Returns**: Competitive analysis and market insights

---

#### 4. Sales Funnel Optimizer
**ID**: `sales-funnel-optimizer`

**Parameters**:
```json
{
  "funnelStages": ["awareness", "consideration", "decision"],
  "currentMetrics": {
    "conversionRate": "number",
    "dropoffPoints": ["string"]
  }
}
```

**Returns**: Optimization recommendations and predicted improvements

---

#### 5. Email Campaign AI
**ID**: `email-campaign-ai`

**Parameters**:
```json
{
  "campaignGoal": "string (required)",
  "audienceSegment": "string (required)",
  "emailCount": "number (optional, default: 5)"
}
```

**Returns**: Personalized email sequences with subject lines

---

## Scrapers

### Execute Scraper

Run a scraper with specified parameters.

**Endpoint**: `POST /api/scrapers/execute`

**Authentication**: Required

**Request Body**:
```json
{
  "scraperId": "ecommerce-intelligence",
  "params": {
    "productKeyword": "laptop",
    "platforms": ["amazon", "ebay"],
    "priceRange": { "min": 500, "max": 2000 },
    "maxResults": 50
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "result": [
    {
      "title": "Premium Laptop - Professional Grade",
      "price": 1299.99,
      "rating": 4.7,
      "platform": "amazon",
      "url": "https://amazon.com/...",
      "priceHistory": [...]
    }
  ],
  "creditsRemaining": 2
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Insufficient credits
- `400 Bad Request`: Invalid scraper ID or params
- `500 Internal Server Error`: Execution failed

---

### Available Scrapers

#### 1. E-commerce Intelligence
**ID**: `ecommerce-intelligence`

**Parameters**:
```json
{
  "productKeyword": "string (required)",
  "platforms": ["amazon", "ebay", "walmart"] (optional),
  "priceRange": { "min": number, "max": number } (optional),
  "minRating": "number (optional, default: 0)",
  "maxResults": "number (optional, default: 50)"
}
```

**Returns**: Array of product data with pricing and reviews

---

#### 2. Real Estate Intelligence
**ID**: `real-estate-intel`

**Parameters**:
```json
{
  "location": "string (required)",
  "propertyType": "residential|commercial|land|all (optional)",
  "priceRange": { "min": number, "max": number } (optional),
  "bedrooms": "number (optional)",
  "bathrooms": "number (optional)",
  "investmentFocus": "boolean (optional, default: false)",
  "maxResults": "number (optional, default: 50)"
}
```

**Returns**: Array of property listings with investment scores

---

#### 3. Job Market Intelligence
**ID**: `job-market-intel`

**Parameters**:
```json
{
  "jobTitle": "string (required)",
  "location": "string (optional)",
  "experienceLevel": "entry|mid|senior (optional)",
  "salaryRange": { "min": number, "max": number } (optional)
}
```

**Returns**: Job listings with salary insights and market trends

---

#### 4. Financial Sentiment
**ID**: `financial-sentiment`

**Parameters**:
```json
{
  "symbols": ["AAPL", "GOOGL"] (required),
  "timeframe": "1d|1w|1m (optional, default: 1d)",
  "sources": ["news", "social", "analyst"] (optional)
}
```

**Returns**: Sentiment analysis and market predictions

---

#### 5. Social Trend Analyzer
**ID**: `social-trend-analyzer`

**Parameters**:
```json
{
  "platforms": ["twitter", "instagram", "tiktok"] (required),
  "category": "string (optional)",
  "timeframe": "24h|7d|30d (optional, default: 24h)"
}
```

**Returns**: Trending topics and influencer metrics

---

## Admin Endpoints

### Get Analytics

Retrieve platform-wide analytics (admin only).

**Endpoint**: `GET /api/admin/analytics`

**Authentication**: Required (Admin role)

**Response** (200 OK):
```json
{
  "totalUsers": 1250,
  "totalRevenue": 125000.50,
  "totalUsage": 5430,
  "growthRate": 15.5,
  "revenueByDay": [
    { "date": "2025-01-15", "amount": 2500.00 }
  ],
  "topAutomations": [
    { "id": "linkedin-lead-gen", "name": "LinkedIn Lead Gen", "usage": 145 }
  ],
  "topScrapers": [
    { "id": "ecommerce-intelligence", "name": "E-commerce Intel", "usage": 132 }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin

---

## Rate Limiting

All API endpoints are rate-limited to prevent abuse:

- **Authentication**: 5 requests per minute
- **Automation Execution**: 10 requests per minute
- **Scraper Execution**: 10 requests per minute
- **Other Endpoints**: 60 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642089600
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions or credits |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server-side error |

---

## Webhooks

### Stripe Webhook Events

Configure your Stripe webhook to send events to:
`https://your-domain.com/api/payments/stripe/webhook`

**Events**:
- `payment_intent.succeeded`: Payment completed successfully
- `payment_intent.payment_failed`: Payment failed

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// Sign up
const signup = async (name: string, email: string, password: string) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return response.json();
};

// Execute automation
const runAutomation = async (automationId: string, params: any) => {
  const response = await fetch('/api/automations/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ automationId, params }),
    credentials: 'include', // Include cookies
  });
  return response.json();
};
```

### Python

```python
import requests

# Sign in
def sign_in(email, password):
    response = requests.post(
        'https://your-domain.com/api/auth/signin',
        json={'email': email, 'password': password}
    )
    return response.json()

# Execute scraper
def run_scraper(scraper_id, params, cookies):
    response = requests.post(
        'https://your-domain.com/api/scrapers/execute',
        json={'scraperId': scraper_id, 'params': params},
        cookies=cookies
    )
    return response.json()
```

---

## Best Practices

1. **Always handle errors**: Check response status codes
2. **Store credentials securely**: Never expose API keys in client code
3. **Respect rate limits**: Implement exponential backoff
4. **Use HTTPS**: Always use secure connections
5. **Validate input**: Sanitize all user input before sending
6. **Monitor usage**: Track your credit consumption
7. **Cache results**: Reduce unnecessary API calls

---

## Support

For API support:
- Email: api-support@stellarcdynamics.com
- Documentation: https://docs.stellarcdynamics.com
- Status Page: https://status.stellarcdynamics.com

---

**Version**: 1.0.0  
**Last Updated**: January 2025