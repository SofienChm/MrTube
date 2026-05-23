import { Injectable } from '@nestjs/common';

interface CacheEntry {
  data: any;
  expiresAt: number;
}

/**
 * Simple in-memory cache service with TTL support.
 */
@Injectable()
export class CacheService {
  private cache = new Map<string, CacheEntry>();

  /**
   * Store a value in cache with a TTL in seconds.
   */
  set(key: string, data: any, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  /**
   * Retrieve a value from cache. Returns null if not found or expired.
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  /**
   * Build a namespaced cache key from parts.
   */
  buildKey(...parts: string[]): string {
    return parts.join(':');
  }
}
