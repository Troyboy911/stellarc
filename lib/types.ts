export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  category: string;
  pricePerUse: number;
  fullPurchasePrice: number;
  features: string[];
  icon: string;
  status: 'active' | 'inactive';
  requiredApiKeys?: string[];
}

export interface Scraper {
  id: string;
  name: string;
  description: string;
  category: string;
  pricePerUse: number;
  fullPurchasePrice: number;
  features: string[];
  icon: string;
  status: 'active' | 'inactive';
  dataPoints: string[];
}

export interface Purchase {
  id: string;
  userId: string;
  itemId: string;
  itemType: 'automation' | 'scraper';
  purchaseType: 'per-use' | 'full';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'stripe' | 'paypal';
  transactionId?: string;
  apiKey?: string;
  createdAt: Date;
}

export interface UsageRecord {
  id: string;
  userId: string;
  itemId: string;
  itemType: 'automation' | 'scraper';
  timestamp: Date;
  status: 'success' | 'failed';
  creditsUsed: number;
  result?: any;
}

export interface ApiKey {
  key: string;
  userId: string;
  itemId: string;
  itemType: 'automation' | 'scraper';
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface AnalyticsData {
  totalUsers: number;
  totalRevenue: number;
  totalUsage: number;
  revenueByDay: { date: string; amount: number }[];
  topAutomations: { id: string; name: string; usage: number }[];
  topScrapers: { id: string; name: string; usage: number }[];
}