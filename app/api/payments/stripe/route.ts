import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { redis } from '@/lib/redis/client';
import { v4 as uuidv4 } from 'uuid';
import { createApiKey } from '@/lib/utils/apiKey';

export async function POST(request: NextRequest) {
  try {
    const { userId, itemId, itemType, purchaseType, amount } = await request.json();

    // Validate input
    if (!userId || !itemId || !itemType || !purchaseType || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId,
        itemId,
        itemType,
        purchaseType,
      },
    });

    // Create purchase record
    const purchaseId = uuidv4();
    const purchase = {
      id: purchaseId,
      userId,
      itemId,
      itemType,
      purchaseType,
      amount,
      status: 'pending',
      paymentMethod: 'stripe',
      transactionId: paymentIntent.id,
      createdAt: new Date().toISOString(),
    };

    await redis.set(`purchase:${purchaseId}`, JSON.stringify(purchase));
    await redis.sadd(`user:${userId}:purchases`, purchaseId);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      purchaseId,
    });
  } catch (error) {
    console.error('Stripe payment error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}