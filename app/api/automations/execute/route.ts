import { NextRequest, NextResponse } from 'next/server';
import { redis, redisHelpers } from '@/lib/redis/client';
import jwt from 'jsonwebtoken';
import { executeLinkedInLeadGen } from '@/lib/automations/linkedin-lead-gen';
import { executeSocialOrchestrator } from '@/lib/automations/social-orchestrator';

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

    const { automationId, params } = await request.json();

    if (!automationId || !params) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user has credits or full purchase
    const credits = await redis.hget(`user:${userId}:credits`, automationId);
    const purchases = await redis.smembers(`user:${userId}:purchases`);
    
    let hasAccess = false;
    let isFullPurchase = false;

    // Check for full purchase
    for (const pid of purchases) {
      const purchaseData = await redis.get(`purchase:${pid}`);
      if (purchaseData) {
        const purchase = JSON.parse(purchaseData);
        if (
          purchase.itemId === automationId &&
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

    // Execute automation based on ID
    let result;
    switch (automationId) {
      case 'linkedin-lead-gen':
        result = await executeLinkedInLeadGen(params);
        break;
      case 'social-orchestrator':
        result = await executeSocialOrchestrator(params);
        break;
      case 'market-intelligence':
        result = { message: 'Market Intelligence automation executed', data: [] };
        break;
      case 'sales-funnel-optimizer':
        result = { message: 'Sales Funnel Optimizer executed', data: [] };
        break;
      case 'email-campaign-ai':
        result = { message: 'Email Campaign AI executed', data: [] };
        break;
      default:
        return NextResponse.json(
          { error: 'Unknown automation' },
          { status: 400 }
        );
    }

    // Deduct credit if not full purchase
    if (!isFullPurchase) {
      await redis.hincrby(`user:${userId}:credits`, automationId, -1);
    }

    // Track usage
    await redisHelpers.incrementUsage(userId, automationId);
    await redisHelpers.trackEvent('automation_executed', {
      userId,
      automationId,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      success: true,
      result,
      creditsRemaining: isFullPurchase ? 'unlimited' : await redis.hget(`user:${userId}:credits`, automationId),
    });
  } catch (error) {
    console.error('Automation execution error:', error);
    return NextResponse.json(
      { error: 'Automation execution failed' },
      { status: 500 }
    );
  }
}