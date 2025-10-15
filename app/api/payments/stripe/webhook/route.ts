import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { redis } from '@/lib/redis/client';
import { createApiKey } from '@/lib/utils/apiKey';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const { userId, itemId, itemType, purchaseType } = paymentIntent.metadata;

      // Find purchase record
      const purchases = await redis.smembers(`user:${userId}:purchases`);
      let purchaseData = null;
      let purchaseId = null;

      for (const pid of purchases) {
        const data = await redis.get(`purchase:${pid}`);
        if (data) {
          const purchase = JSON.parse(data);
          if (purchase.transactionId === paymentIntent.id) {
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
        if (purchaseType === 'full') {
          const apiKey = await createApiKey(userId, itemId, itemType as 'automation' | 'scraper');
          purchaseData.apiKey = apiKey;
        }

        // If per-use, add credits
        if (purchaseType === 'per-use') {
          await redis.hincrby(`user:${userId}:credits`, itemId, 1);
        }

        await redis.set(`purchase:${purchaseId}`, JSON.stringify(purchaseData));

        // Track analytics
        await redis.hincrby('analytics:revenue', new Date().toISOString().split('T')[0], Math.round(purchaseData.amount * 100));
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}