import { Scraper } from '../types';

export const SCRAPERS: Scraper[] = [
  {
    id: 'ecommerce-intelligence',
    name: 'E-commerce Price Intelligence & Product Data Aggregator',
    description: 'Enterprise-grade scraper that monitors millions of products across major e-commerce platforms (Amazon, eBay, Walmart, Shopify stores). Tracks pricing, inventory, reviews, and competitor strategies in real-time.',
    category: 'E-commerce',
    pricePerUse: 18.00,
    fullPurchasePrice: 2999.00,
    features: [
      'Multi-platform product monitoring',
      'Real-time price tracking',
      'Inventory level monitoring',
      'Review sentiment analysis',
      'Competitor SKU mapping',
      'Historical price trends',
      'Stock alert system',
      'API access for integration'
    ],
    icon: '🛒',
    status: 'active',
    dataPoints: [
      'Product prices',
      'Stock levels',
      'Customer reviews',
      'Seller information',
      'Product specifications',
      'Images and media',
      'Shipping costs',
      'Promotional data'
    ]
  },
  {
    id: 'real-estate-intel',
    name: 'Real Estate Market Data & Investment Opportunity Finder',
    description: 'Advanced scraper that aggregates property listings, market trends, and investment opportunities from Zillow, Realtor.com, Redfin, and MLS databases. Includes AI-powered investment scoring.',
    category: 'Real Estate',
    pricePerUse: 22.00,
    fullPurchasePrice: 3499.00,
    features: [
      'Multi-source property aggregation',
      'Market trend analysis',
      'Investment opportunity scoring',
      'Neighborhood analytics',
      'Price prediction models',
      'Rental yield calculations',
      'Historical sales data',
      'Off-market property detection'
    ],
    icon: '🏠',
    status: 'active',
    dataPoints: [
      'Property listings',
      'Sale prices',
      'Rental rates',
      'Property features',
      'Neighborhood data',
      'School ratings',
      'Crime statistics',
      'Market trends'
    ]
  },
  {
    id: 'job-market-intel',
    name: 'Job Market Intelligence & Talent Acquisition Data Miner',
    description: 'Comprehensive job market scraper that monitors LinkedIn, Indeed, Glassdoor, and 50+ job boards. Provides salary insights, skill demand trends, and talent pool analysis for strategic hiring.',
    category: 'HR & Recruitment',
    pricePerUse: 16.00,
    fullPurchasePrice: 2699.00,
    features: [
      'Multi-platform job aggregation',
      'Salary benchmarking',
      'Skills demand tracking',
      'Competitor hiring analysis',
      'Candidate profile enrichment',
      'Market talent availability',
      'Remote work trends',
      'Industry-specific insights'
    ],
    icon: '💼',
    status: 'active',
    dataPoints: [
      'Job postings',
      'Salary ranges',
      'Required skills',
      'Company information',
      'Application counts',
      'Posting duration',
      'Location data',
      'Benefits packages'
    ]
  },
  {
    id: 'financial-sentiment',
    name: 'Financial News & Stock Market Sentiment Analyzer',
    description: 'Real-time financial data scraper that monitors news, social media, SEC filings, and analyst reports. Uses NLP to gauge market sentiment and predict stock movements with 75% accuracy.',
    category: 'Finance',
    pricePerUse: 30.00,
    fullPurchasePrice: 4999.00,
    features: [
      'Real-time news aggregation',
      'Social media sentiment analysis',
      'SEC filing monitoring',
      'Analyst rating tracking',
      'Insider trading detection',
      'Market correlation analysis',
      'Predictive sentiment scoring',
      'Custom alert system'
    ],
    icon: '📈',
    status: 'active',
    dataPoints: [
      'News articles',
      'Social mentions',
      'Stock prices',
      'Trading volumes',
      'Analyst ratings',
      'SEC filings',
      'Insider transactions',
      'Market sentiment scores'
    ]
  },
  {
    id: 'social-trend-analyzer',
    name: 'Social Media Trend & Influencer Analytics Harvester',
    description: 'Next-gen social intelligence scraper that tracks viral trends, influencer performance, and audience engagement across all major platforms. Identifies emerging trends 48 hours before they peak.',
    category: 'Social Media',
    pricePerUse: 14.00,
    fullPurchasePrice: 2299.00,
    features: [
      'Cross-platform trend detection',
      'Influencer performance tracking',
      'Audience demographic analysis',
      'Engagement rate calculations',
      'Viral content prediction',
      'Hashtag performance tracking',
      'Competitor social monitoring',
      'ROI measurement tools'
    ],
    icon: '🌟',
    status: 'active',
    dataPoints: [
      'Trending topics',
      'Influencer metrics',
      'Engagement rates',
      'Follower growth',
      'Content performance',
      'Hashtag analytics',
      'Audience demographics',
      'Viral coefficients'
    ]
  }
];

export function getScraperById(id: string): Scraper | undefined {
  return SCRAPERS.find(s => s.id === id);
}

export function getActiveScrapers(): Scraper[] {
  return SCRAPERS.filter(s => s.status === 'active');
}