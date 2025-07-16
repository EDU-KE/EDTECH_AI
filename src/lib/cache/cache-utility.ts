/**
 * General Cache Utility
 * Provides caching functionality for various system components
 */

interface CacheConfig {
  ttl?: number;
  maxSize?: number;
  onEvict?: (key: string, value: any) => void;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccess: number;
}

export class Cache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private readonly defaultTTL: number;
  private readonly maxSize: number;
  private readonly onEvict?: (key: string, value: T) => void;

  constructor(config: CacheConfig = {}) {
    this.defaultTTL = config.ttl || 5 * 60 * 1000; // 5 minutes default
    this.maxSize = config.maxSize || 1000;
    this.onEvict = config.onEvict;
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictLRU(): void {
    if (this.cache.size <= this.maxSize) return;

    // Find least recently used entry
    let lruKey: string | null = null;
    let lruTime = Date.now();

    for (const [key, entry] of this.cache) {
      if (entry.lastAccess < lruTime) {
        lruTime = entry.lastAccess;
        lruKey = key;
      }
    }

    if (lruKey) {
      const entry = this.cache.get(lruKey);
      if (entry && this.onEvict) {
        this.onEvict(lruKey, entry.data);
      }
      this.cache.delete(lruKey);
    }
  }

  public set(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      accessCount: 0,
      lastAccess: Date.now()
    };

    this.cache.set(key, entry);
    this.evictLRU();
  }

  public get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccess = Date.now();
    
    return entry.data;
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry !== undefined && !this.isExpired(entry);
  }

  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }

  public keys(): string[] {
    return Array.from(this.cache.keys());
  }

  public getStats(): {
    size: number;
    hitRate: number;
    totalAccess: number;
    averageAge: number;
  } {
    const now = Date.now();
    let totalAccess = 0;
    let totalAge = 0;

    for (const entry of this.cache.values()) {
      totalAccess += entry.accessCount;
      totalAge += now - entry.timestamp;
    }

    return {
      size: this.cache.size,
      hitRate: this.cache.size > 0 ? totalAccess / this.cache.size : 0,
      totalAccess,
      averageAge: this.cache.size > 0 ? totalAge / this.cache.size : 0
    };
  }

  public cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  public getOrSet(key: string, factory: () => T | Promise<T>, ttl?: number): T | Promise<T> {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    const result = factory();
    
    if (result instanceof Promise) {
      return result.then(data => {
        this.set(key, data, ttl);
        return data;
      });
    } else {
      this.set(key, result, ttl);
      return result;
    }
  }
}

// Global cache instances
export const componentCache = new Cache<any>({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 500
});

export const apiCache = new Cache<any>({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 200
});

export const uiCache = new Cache<any>({
  ttl: 2 * 60 * 1000, // 2 minutes
  maxSize: 1000
});

// Performance monitoring
export const cacheMonitor = {
  getSystemStats() {
    return {
      component: componentCache.getStats(),
      api: apiCache.getStats(),
      ui: uiCache.getStats()
    };
  },

  cleanup() {
    componentCache.cleanup();
    apiCache.cleanup();
    uiCache.cleanup();
  }
};

// Auto cleanup every 5 minutes
setInterval(() => {
  cacheMonitor.cleanup();
}, 5 * 60 * 1000);
