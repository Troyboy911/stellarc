import { NextRequest, NextResponse } from 'next/server';
import { captureOrder } from '@/lib/paypal/client';
import { redis } from '@/lib/redis/client';
import { createApiKey } from '@/lib/utils/apiKey';

export async function POST(request: NextRequest) {
  try {
    const { orderId, userId } = await request.json();

    if (!orderId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Capture PayPal order
    const captureData = await captureOrder(orderId);

    if (captureData.status === 'COMPLETED') {
      // Find purchase record
      const purchases = await redis.smembers(`user:${userId}:purchases`);
      let purchaseData = null;
      let purchaseId = null;

      for (const pid of purchases) {
        const data = await redis.get(`purchase:${pid}`);
        if (data) {
          const purchase = JSON.parse(data);
          if (purchase.transactionId === orderId) {
            purchaseData = purchase;
            purchaseId = pid;
            break;
          }
        }
      }

      if (purchaseData && purchaseId) {
        // Update purchase status
        purchaseData.status = 'completed';
        purchaseData.completedAt = new Date().toISOString();

        // If full purchase, generate API key
        if (purchaseData.purchaseType === 'full') {
          const apiKey = await createApiKey(
            userId,
            purchaseData.itemId,
            purchaseData.itemType as 'automation' | 'scraper'
          );
          purchaseData.apiKey = apiKey;
        }

        // If per-use, add credits
        if (purchaseData.purchaseType === 'per-use') {
          await redis.hincrby(`user:${userId}:credits`, purchaseData.itemId, 1);
        }

        await redis.set(`purchase:${purchaseId}`, JSON.stringify(purchaseData));

        // Track analytics
        await redis.hincrby(
          'analytics:revenue',
          new Date().toISOString().split('T')[0],
          Math.round(purchaseData.amount * 100)
        );

        return NextResponse.json({
          success: true,
          apiKey: purchaseData.apiKey,
        });
      }
    }

    return NextResponse.json(
      { error: 'Payment capture failed' },
      { status: 400 }
    );
  } catch (error) {
    console.error('PayPal capture error:', error);
    return NextResponse.json(
      { error: 'Payment capture failed' },
      { status: 500 }
    );
  }
}