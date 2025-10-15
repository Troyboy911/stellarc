import { Automation } from '../types';

export const AUTOMATIONS: Automation[] = [
  {
    id: 'linkedin-lead-gen',
    name: 'AI-Powered LinkedIn Lead Generation & Outreach',
    description: 'Revolutionary AI system that identifies high-value prospects on LinkedIn, analyzes their profiles, and crafts personalized outreach messages with 3x higher response rates. Includes automated follow-ups and CRM integration.',
    category: 'Sales & Marketing',
    pricePerUse: 15.00,
    fullPurchasePrice: 2499.00,
    features: [
      'AI-powered prospect identification using GPT-4',
      'Automated profile analysis and scoring',
      'Personalized message generation',
      'Smart follow-up sequences',
      'CRM integration (Salesforce, HubSpot)',
      'Real-time engagement tracking',
      'A/B testing for message optimization',
      'Compliance with LinkedIn policies'
    ],
    icon: '🎯',
    status: 'active',
    requiredApiKeys: ['OPENAI_API_KEY', 'LINKEDIN_API_KEY']
  },
  {
    id: 'social-orchestrator',
    name: 'Multi-Platform Social Media Content Orchestrator',
    description: 'Next-generation content distribution system that creates, optimizes, and schedules content across all major platforms (Twitter, LinkedIn, Instagram, Facebook, TikTok) with AI-driven timing and engagement optimization.',
    category: 'Social Media',
    pricePerUse: 12.00,
    fullPurchasePrice: 1999.00,
    features: [
      'AI content generation and adaptation per platform',
      'Optimal posting time prediction',
      'Cross-platform analytics dashboard',
      'Automated hashtag research and optimization',
      'Image and video optimization',
      'Engagement monitoring and response suggestions',
      'Competitor content analysis',
      'ROI tracking and reporting'
    ],
    icon: '🚀',
    status: 'active',
    requiredApiKeys: ['OPENAI_API_KEY', 'TWITTER_API_KEY']
  },
  {
    id: 'market-intelligence',
    name: 'Real-Time Market Intelligence & Competitor Analysis',
    description: 'Advanced AI engine that monitors competitors, tracks market trends, analyzes pricing strategies, and provides actionable insights in real-time. Includes predictive analytics for market movements.',
    category: 'Business Intelligence',
    pricePerUse: 25.00,
    fullPurchasePrice: 3999.00,
    features: [
      'Real-time competitor monitoring',
      'Price tracking and optimization suggestions',
      'Market trend prediction using ML',
      'SWOT analysis automation',
      'News and sentiment analysis',
      'Product launch detection',
      'Market share estimation',
      'Custom alert system'
    ],
    icon: '📊',
    status: 'active',
    requiredApiKeys: ['OPENAI_API_KEY']
  },
  {
    id: 'sales-funnel-optimizer',
    name: 'Automated Customer Journey & Sales Funnel Optimizer',
    description: 'Intelligent system that analyzes customer behavior, identifies bottlenecks, and automatically optimizes your sales funnel. Uses predictive AI to personalize customer journeys and increase conversion rates by up to 40%.',
    category: 'Sales & Conversion',
    pricePerUse: 20.00,
    fullPurchasePrice: 3499.00,
    features: [
      'Real-time funnel analytics',
      'AI-powered bottleneck identification',
      'Automated A/B testing',
      'Personalized customer journey mapping',
      'Predictive churn analysis',
      'Dynamic content optimization',
      'Multi-channel attribution',
      'Revenue forecasting'
    ],
    icon: '💰',
    status: 'active',
    requiredApiKeys: ['OPENAI_API_KEY']
  },
  {
    id: 'email-campaign-ai',
    name: 'Smart Email Campaign Manager with AI Personalization',
    description: 'Revolutionary email marketing system that uses AI to craft hyper-personalized emails, predict optimal send times, and automatically segment audiences. Achieves 5x higher open rates and 3x better conversions.',
    category: 'Email Marketing',
    pricePerUse: 10.00,
    fullPurchasePrice: 1799.00,
    features: [
      'AI-powered email content generation',
      'Predictive send-time optimization',
      'Dynamic audience segmentation',
      'Automated subject line testing',
      'Behavioral trigger campaigns',
      'Advanced personalization engine',
      'Deliverability optimization',
      'Real-time performance analytics'
    ],
    icon: '📧',
    status: 'active',
    requiredApiKeys: ['OPENAI_API_KEY']
  }
];

export function getAutomationById(id: string): Automation | undefined {
  return AUTOMATIONS.find(a => a.id === id);
}

export function getActiveAutomations(): Automation[] {
  return AUTOMATIONS.filter(a => a.status === 'active');
}