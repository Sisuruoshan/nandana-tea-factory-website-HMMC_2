import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test the database connection
    const result = await prisma.$queryRaw`db.adminCommand({ ping: 1 })`

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
    })
  } catch (error: any) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        error: error.message,
      },
      { status: 503 }
    )
  }
}
