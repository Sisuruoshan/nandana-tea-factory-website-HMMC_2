import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isWholesale = searchParams.get('is_wholesale')

    const where: any = {}
    if (isWholesale === 'true') {
      where.isWholesale = true
    } else if (isWholesale === 'false') {
      where.isWholesale = false
    }

    const search = searchParams.get('search')
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const skip = (page - 1) * limit

    // Optimize query: only select needed fields
    const products = await prisma.product.findMany({
      where,
      take: limit,
      skip: skip,
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        price: true,
        image: true,
        stock: true,
        isWholesale: true,
        wholesalePrice: true,
        origin: true,
        notes: true,
        brewingGuide: true,
        longDescription: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get total count for pagination metadata
    const total = await prisma.product.count({ where })

    const response = NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')

    return response
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      slug,
      price,
      wholesalePrice,
      image,
      origin,
      notes,
      brewingGuide,
      longDescription,
      stock,
      isWholesale,
    } = body

    if (!name || !description || !slug || price === undefined) {
      return NextResponse.json(
        { error: 'Name, description, slug, and price are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        slug,
        price,
        wholesalePrice: wholesalePrice || null,
        image: image || null,
        origin: origin || null,
        notes: notes || null,
        brewingGuide: brewingGuide || null,
        longDescription: longDescription || null,
        stock: stock || 0,
        isWholesale: isWholesale || false,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Create product error:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
