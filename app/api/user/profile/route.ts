import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis/client';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
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

    // Get user data
    const userData = await redis.get(`user:${userId}`);
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = JSON.parse(userData);

    // Get purchases
    const purchaseIds = await redis.smembers(`user:${userId}:purchases`);
    const purchases = [];
    for (const pid of purchaseIds) {
      const purchaseData = await redis.get(`purchase:${pid}`);
      if (purchaseData) {
        purchases.push(JSON.parse(purchaseData));
      }
    }

    // Get credits
    const credits = await redis.hgetall(`user:${userId}:credits`);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      purchases,
      credits,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}