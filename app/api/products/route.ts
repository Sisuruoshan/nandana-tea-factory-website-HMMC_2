import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
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
