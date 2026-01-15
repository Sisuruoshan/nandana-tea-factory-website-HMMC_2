import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      slug,
      price,
      image,
      origin,
      notes,
      brewingGuide,
      longDescription,
      stock,
      isWholesale,
      wholesalePrice,
    } = body

    // Validate required fields
    if (!name || !slug || !price) {
      return NextResponse.json(
        { error: 'Name, slug, and price are required' },
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

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        slug,
        price: parseFloat(price),
        image: image || null,
        origin: origin || null,
        notes: notes || null,
        brewingGuide: brewingGuide || null,
        longDescription: longDescription || null,
        stock: parseInt(stock) || 0,
        isWholesale: isWholesale || false,
        wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product,
    })
  } catch (error: any) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product: ' + error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      description,
      slug,
      price,
      image,
      origin,
      notes,
      brewingGuide,
      longDescription,
      stock,
      isWholesale,
      wholesalePrice,
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        slug,
        price: parseFloat(price),
        image: image || null,
        origin: origin || null,
        notes: notes || null,
        brewingGuide: brewingGuide || null,
        longDescription: longDescription || null,
        stock: parseInt(stock) || 0,
        isWholesale: isWholesale || false,
        wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    })
  } catch (error: any) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product: ' + error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error: any) {
    console.error('Product delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product: ' + error.message },
      { status: 500 }
    )
  }
}
