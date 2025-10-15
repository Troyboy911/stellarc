import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { redis } from '@/lib/redis/client';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user from Redis
    const userData = await redis.get(`user:email:${email}`);
    if (!userData) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = JSON.parse(userData);

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Store session in Redis
    await redis.setex(`session:${token}`, 604800, JSON.stringify(user)); // 7 days

    const response = NextResponse.json(
      { message: 'Sign in successful', user: { id: user.id, email: user.email, name: user.name, role: user.role } },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 604800, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}