interface CacheEntry<T> {
  data: T
  timestamp: number
}

class Cache {
  private store: Map<string, CacheEntry<any>> = new Map()
  private readonly ttl: number

  constructor(ttlMinutes: number = 5) {
    this.ttl = ttlMinutes * 60 * 1000
  }

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined

    if (Date.now() - entry.timestamp > this.ttl) {
      this.store.delete(key)
      return undefined
    }

    return entry.data
  }

  set<T>(key: string, data: T): void {
    this.store.set(key, { data, timestamp: Date.now() })
  }

  invalidate(key: string): void {
    this.store.delete(key)
  }

  invalidatePattern(pattern: string): void {
    for (const key of this.store.keys()) {
      if (key.includes(pattern)) {
        this.store.delete(key)
      }
    }
  }

  clear(): void {
    this.store.clear()
  }
}

export const cache5min = new Cache(5)
