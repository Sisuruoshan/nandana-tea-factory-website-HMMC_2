import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

const FALLBACK_IMAGE = '/images/image.png'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart) {
      return NextResponse.json({
        items: [],
        total: 0,
        count: 0,
      })
    }

    return NextResponse.json({
      items: cart.items.map((item) => ({
        id: item.id,
        product_id: item.productId,
        product_name: item.product.name,
        product_image: item.product.image || FALLBACK_IMAGE,
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.subtotal),
      })),
      total: Number(cart.totalAmount),
      count: cart.items.length,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { product_id, quantity } = body

    if (!product_id || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(product_id) },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Use wholesale price for wholesale products if available
    const effectivePrice =
      (product.isWholesale && product.wholesalePrice != null)
        ? Number(product.wholesalePrice)
        : Number(product.price)

    // Get or create cart
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
          totalAmount: 0,
        },
      })
    }

    // Check if product already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: product.id,
      },
    })

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity
      const newSubtotal = effectivePrice * newQuantity

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
          subtotal: newSubtotal,
        },
      })
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity,
          price: effectivePrice,
          subtotal: effectivePrice * quantity,
        },
      })
    }

    // Update cart total
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: true,
      },
    })

    if (updatedCart) {
      const totalAmount = updatedCart.items.reduce(
        (sum, item) => sum + Number(item.subtotal),
        0
      )

      await prisma.cart.update({
        where: { id: cart.id },
        data: { totalAmount },
      })

      return NextResponse.json({
        success: true,
        message: 'Product added to cart successfully.',
        cart_count: updatedCart.items.length,
        cart_total: totalAmount,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Product added to cart successfully.',
      cart_count: 0,
      cart_total: 0,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth()

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      })

      await prisma.cart.update({
        where: { id: cart.id },
        data: { totalAmount: 0 },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully.',
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Clear cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
