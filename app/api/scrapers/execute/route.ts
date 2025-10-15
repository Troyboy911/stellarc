import { NextRequest, NextResponse } from 'next/server';
import { redis, redisHelpers } from '@/lib/redis/client';
import jwt from 'jsonwebtoken';
import { executeEcommerceIntelligence } from '@/lib/scrapers/ecommerce-intelligence';
import { executeRealEstateIntel } from '@/lib/scrapers/real-estate-intel';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userId = decoded.userId;

    const { scraperId, params } = await request.json();

    if (!scraperId || !params) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user has credits or full purchase
    const credits = await redis.hget(`user:${userId}:credits`, scraperId);
    const purchases = await redis.smembers(`user:${userId}:purchases`);
    
    let hasAccess = false;
    let isFullPurchase = false;

    // Check for full purchase
    for (const pid of purchases) {
      const purchaseData = await redis.get(`purchase:${pid}`);
      if (purchaseData) {
        const purchase = JSON.parse(purchaseData);
        if (
          purchase.itemId === scraperId &&
          purchase.purchaseType === 'full' &&
          purchase.status === 'completed'
        ) {
          hasAccess = true;
          isFullPurchase = true;
          break;
        }
      }
    }

    // Check for credits
    if (!hasAccess && credits && parseInt(credits) > 0) {
      hasAccess = true;
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Insufficient credits or no purchase found' },
        { status: 403 }
      );
    }

    // Execute scraper based on ID
    let result;
    switch (scraperId) {
      case 'ecommerce-intelligence':
        result = await executeEcommerceIntelligence(params);
        break;
      case 'real-estate-intel':
        result = await executeRealEstateIntel(params);
        break;
      case 'job-market-intel':
        result = { message: 'Job Market Intelligence scraper executed', data: [] };
        break;
      case 'financial-sentiment':
        result = { message: 'Financial Sentiment scraper executed', data: [] };
        break;
      case 'social-trend-analyzer':
        result = { message: 'Social Trend Analyzer executed', data: [] };
        break;
      default:
        return NextResponse.json(
          { error: 'Unknown scraper' },
          { status: 400 }
        );
    }

    // Deduct credit if not full purchase
    if (!isFullPurchase) {
      await redis.hincrby(`user:${userId}:credits`, scraperId, -1);
    }

    // Track usage
    await redisHelpers.incrementUsage(userId, scraperId);
    await redisHelpers.trackEvent('scraper_executed', {
      userId,
      scraperId,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      success: true,
      result,
      creditsRemaining: isFullPurchase ? 'unlimited' : await redis.hget(`user:${userId}:credits`, scraperId),
    });
  } catch (error) {
    console.error('Scraper execution error:', error);
    return NextResponse.json(
      { error: 'Scraper execution failed' },
      { status: 500 }
    );
  }
}