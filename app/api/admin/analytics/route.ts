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

    // Verify token and check admin role
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get total users
    const userIds = await redis.smembers('users:all');
    const totalUsers = userIds.length;

    // Get revenue data
    const revenueData = await redis.hgetall('analytics:revenue');
    const totalRevenue = Object.values(revenueData).reduce((sum: number, val: any) => sum + parseInt(val), 0) / 100;

    // Format revenue by day
    const revenueByDay = Object.entries(revenueData)
      .map(([date, amount]) => ({
        date,
        amount: parseInt(amount as string) / 100,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days

    // Get usage statistics
    const usageKeys = await redis.keys('usage:*');
    const totalUsage = usageKeys.length;

    // Calculate growth rate (mock for now)
    const growthRate = 15.5;

    // Get top automations and scrapers (mock data for now)
    const topAutomations = [
      { id: 'linkedin-lead-gen', name: 'LinkedIn Lead Gen', usage: 145 },
      { id: 'social-orchestrator', name: 'Social Orchestrator', usage: 98 },
      { id: 'market-intelligence', name: 'Market Intelligence', usage: 87 },
    ];

    const topScrapers = [
      { id: 'ecommerce-intelligence', name: 'E-commerce Intel', usage: 132 },
      { id: 'real-estate-intel', name: 'Real Estate Intel', usage: 76 },
      { id: 'job-market-intel', name: 'Job Market Intel', usage: 65 },
    ];

    return NextResponse.json({
      totalUsers,
      totalRevenue,
      totalUsage,
      growthRate,
      revenueByDay,
      topAutomations,
      topScrapers,
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}