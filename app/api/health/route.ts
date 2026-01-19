import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, limit, query } from 'firebase/firestore'

export async function GET() {
  try {
    // Test the database connection by trying to fetch one document
    const q = query(collection(db, 'products'), limit(1));
    await getDocs(q);

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      backend: 'firebase'
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
