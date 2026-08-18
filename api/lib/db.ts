import { drizzle } from 'drizzle-orm/node-postgres'
import { sql } from 'drizzle-orm'
import { Pool } from 'pg'
import * as schema from '../../drizzle/schema.js'

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null
let poolInstance: Pool | null = null

// Initialize database connection (Railway PostgreSQL via node-postgres pool)
export const getDb = () => {
  if (!dbInstance) {
    poolInstance = new Pool({
      connectionString: process.env.DATABASE_URL!,
    })
    dbInstance = drizzle(poolInstance, { schema })
  }
  return dbInstance
}

// Export db instance for direct use
export const db = getDb()

// Re-export schema for use in queries
export { schema }

// Connection test function for keep-warm endpoint
export const testConnection = async () => {
  try {
    const startTime = Date.now()
    const result = await db.execute(sql`SELECT 1 as connected`)
    const duration = Date.now() - startTime
    
    return { 
      success: true, 
      timestamp: new Date().toISOString(),
      responseTime: `${duration}ms`
    }
  } catch (error) {
    console.error('Database connection test failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Connection failed' 
    }
  }
}

// Type-safe query helper for projects with images
export type ProjectWithImages = schema.Project & {
  images: schema.ProjectImage[]
}
