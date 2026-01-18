import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { isWholesale: true }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Optimize query: only select needed fields
    const products = await prisma.product.findMany({
      where,
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
      skip,
      take: limit,
    })
    
    const response = NextResponse.json({
      products,
      page,
      limit,
      total: products.length,
    })
    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
    
    return response
  } catch (error) {
    console.error('Get wholesale products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

