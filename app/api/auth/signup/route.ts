import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '@/lib/redis/client';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await redis.get(`user:email:${email}`);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    const user = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      role: 'user',
      credits: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store user in Redis
    await redis.set(`user:${userId}`, JSON.stringify(user));
    await redis.set(`user:email:${email}`, JSON.stringify(user));

    // Add to users list
    await redis.sadd('users:all', userId);

    return NextResponse.json(
      { message: 'User created successfully', userId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}