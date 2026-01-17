import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET() {
  try {
    // Optimize query: only select needed fields
    const products = await prisma.product.findMany({
      where: { isWholesale: true },
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        price: true,
        wholesalePrice: true,
        image: true,
        stock: true,
        isWholesale: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    
    const response = NextResponse.json(products)
    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
    
    return response
  } catch (error) {
    console.error('Get wholesale products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

