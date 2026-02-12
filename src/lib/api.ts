import { Project } from './data';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 60 * 1000; // 1 minute
const cache: Record<string, CacheItem<any>> = {};

export async function fetchWithCache<T>(url: string): Promise<T> {
  const now = Date.now();
  const cached = cache[url];

  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  
  const data = await response.json();
  
  // Store in cache
  cache[url] = {
    data,
    timestamp: now
  };

  return data;
}

export function prefetch(url: string) {
  fetchWithCache(url).catch(() => {
    // Silently fail prefetch
  });
}

export type { Project };
