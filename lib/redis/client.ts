import Redis from 'ioredis';

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  throw new Error('REDIS_URL is not defined');
};

// Create Redis client
export const redis = new Redis(getRedisUrl(), {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Redis key prefixes
export const KEYS = {
  USER: (id: string) => `user:${id}`,
  SESSION: (token: string) => `session:${token}`,
  PURCHASE: (id: string) => `purchase:${id}`,
  USAGE: (userId: string, automationId: string) => `usage:${userId}:${automationId}`,
  API_KEY: (key: string) => `apikey:${key}`,
  RATE_LIMIT: (userId: string, endpoint: string) => `ratelimit:${userId}:${endpoint}`,
  ANALYTICS: (date: string) => `analytics:${date}`,
  AUTOMATION_RESULT: (id: string) => `automation:result:${id}`,
};

// Helper functions
export const redisHelpers = {
  // User operations
  async getUser(userId: string) {
    const data = await redis.get(KEYS.USER(userId));
    return data ? JSON.parse(data) : null;
  },

  async setUser(userId: string, userData: any, ttl = 3600) {
    await redis.setex(KEYS.USER(userId), ttl, JSON.stringify(userData));
  },

  // Usage tracking
  async incrementUsage(userId: string, automationId: string) {
    const key = KEYS.USAGE(userId, automationId);
    await redis.incr(key);
    await redis.expire(key, 86400 * 30); // 30 days
  },

  async getUsage(userId: string, automationId: string) {
    const usage = await redis.get(KEYS.USAGE(userId, automationId));
    return usage ? parseInt(usage) : 0;
  },

  // Rate limiting
  async checkRateLimit(userId: string, endpoint: string, limit: number, window: number) {
    const key = KEYS.RATE_LIMIT(userId, endpoint);
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }
    
    return current <= limit;
  },

  // Analytics
  async trackEvent(event: string, data: any) {
    const date = new Date().toISOString().split('T')[0];
    const key = KEYS.ANALYTICS(date);
    await redis.rpush(key, JSON.stringify({ event, data, timestamp: Date.now() }));
    await redis.expire(key, 86400 * 90); // 90 days
  },

  // API Key management
  async storeApiKey(apiKey: string, userId: string, automationId: string, expiresIn?: number) {
    const data = { userId, automationId, createdAt: Date.now() };
    if (expiresIn) {
      await redis.setex(KEYS.API_KEY(apiKey), expiresIn, JSON.stringify(data));
    } else {
      await redis.set(KEYS.API_KEY(apiKey), JSON.stringify(data));
    }
  },

  async validateApiKey(apiKey: string) {
    const data = await redis.get(KEYS.API_KEY(apiKey));
    return data ? JSON.parse(data) : null;
  },
};

export default redis;