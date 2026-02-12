import type { VercelRequest, VercelResponse } from '@vercel/node'
import { testConnection } from '../lib/db.js'

/**
 * Keep-warm endpoint for Neon database
 * This prevents autosuspension by executing a query every few minutes
 * Called by Vercel Cron every 4 minutes
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Security: Only allow requests from Vercel Cron or with secret
  const authHeader = req.headers.authorization
  const isVercelCron = req.headers['x-vercel-signature'] || 
                       req.headers['user-agent']?.includes('vercel-cron')
  
  if (!isVercelCron && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Execute simple query to keep database warm
    const result = await testConnection()
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Database warmed successfully',
        timestamp: result.timestamp,
        responseTime: result.responseTime
      })
    } else {
      return res.status(500).json({
        success: false,
        message: 'Database warm-up failed',
        error: result.error
      })
    }
  } catch (error) {
    console.error('Keep-warm error:', error)
    return res.status(500).json({
      success: false,
      message: 'Keep-warm endpoint error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
