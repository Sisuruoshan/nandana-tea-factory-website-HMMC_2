import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { quantity } = body

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      )
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(params.itemId) },
      include: { cart: true },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Verify cart belongs to user
    if (cartItem.cart.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const newSubtotal = Number(cartItem.price) * quantity

    await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: {
        quantity,
        subtotal: newSubtotal,
      },
    })

    // Update cart total
    const cart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: { items: true },
    })

    if (cart) {
      const totalAmount = cart.items.reduce(
        (sum, item) => sum + Number(item.subtotal),
        0
      )

      await prisma.cart.update({
        where: { id: cart.id },
        data: { totalAmount },
      })

      return NextResponse.json({
        success: true,
        subtotal: newSubtotal,
        cart_total: totalAmount,
      })
    }

    return NextResponse.json({
      success: true,
      subtotal: newSubtotal,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update cart item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const user = await requireAuth()

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(params.itemId) },
      include: { cart: true },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Verify cart belongs to user
    if (cartItem.cart.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const cartId = cartItem.cartId
    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    })

    // Update cart total
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    })

    if (cart) {
      const totalAmount = cart.items.reduce(
        (sum, item) => sum + Number(item.subtotal),
        0
      )

      await prisma.cart.update({
        where: { id: cart.id },
        data: { totalAmount },
      })

      return NextResponse.json({
        success: true,
        message: 'Item removed from cart.',
        cart_total: totalAmount,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart.',
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Remove cart item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
