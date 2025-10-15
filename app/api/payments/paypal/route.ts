import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/paypal/client';
import { redis } from '@/lib/redis/client';
import { v4 as uuidv4 } from 'uuid';

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

    // Create PayPal order
    const order = await createOrder(amount);

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
      paymentMethod: 'paypal',
      transactionId: order.id,
      createdAt: new Date().toISOString(),
    };

    await redis.set(`purchase:${purchaseId}`, JSON.stringify(purchase));
    await redis.sadd(`user:${userId}:purchases`, purchaseId);

    return NextResponse.json({
      orderId: order.id,
      purchaseId,
    });
  } catch (error) {
    console.error('PayPal payment error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}