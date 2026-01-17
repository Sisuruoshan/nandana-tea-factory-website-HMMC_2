import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findFirst({
      where: { slug: params.slug, isWholesale: true },
    })

    if (!product) {
      const response = NextResponse.json({ error: 'Product not found' }, { status: 404 })
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
      return response
    }

    const response = NextResponse.json(product)
    // Cache wholesale product pages
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
    
    return response
  } catch (error) {
    console.error('Get wholesale product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

