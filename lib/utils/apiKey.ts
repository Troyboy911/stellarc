import { randomBytes } from 'crypto';
import { redis, KEYS } from '../redis/client';

export function generateApiKey(): string {
  const prefix = 'sd_live_';
  const randomPart = randomBytes(32).toString('hex');
  return `${prefix}${randomPart}`;
}

export async function createApiKey(
  userId: string,
  itemId: string,
  itemType: 'automation' | 'scraper'
): Promise<string> {
  const apiKey = generateApiKey();
  
  await redis.set(
    KEYS.API_KEY(apiKey),
    JSON.stringify({
      userId,
      itemId,
      itemType,
      createdAt: Date.now(),
      isActive: true,
    })
  );

  // Store in user's API keys list
  await redis.sadd(`user:${userId}:apikeys`, apiKey);

  return apiKey;
}

export async function validateApiKey(apiKey: string): Promise<{
  valid: boolean;
  userId?: string;
  itemId?: string;
  itemType?: string;
}> {
  const data = await redis.get(KEYS.API_KEY(apiKey));
  
  if (!data) {
    return { valid: false };
  }

  const keyData = JSON.parse(data);
  
  if (!keyData.isActive) {
    return { valid: false };
  }

  return {
    valid: true,
    userId: keyData.userId,
    itemId: keyData.itemId,
    itemType: keyData.itemType,
  };
}

export async function revokeApiKey(apiKey: string): Promise<boolean> {
  const data = await redis.get(KEYS.API_KEY(apiKey));
  
  if (!data) {
    return false;
  }

  const keyData = JSON.parse(data);
  keyData.isActive = false;
  
  await redis.set(KEYS.API_KEY(apiKey), JSON.stringify(keyData));
  
  return true;
}

export async function getUserApiKeys(userId: string): Promise<string[]> {
  return await redis.smembers(`user:${userId}:apikeys`);
}