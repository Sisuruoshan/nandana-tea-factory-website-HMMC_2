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
      where: { id: params.itemId },
      include: { cart: true, product: true },
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

    // Calculate quantity difference and restore/deduct stock accordingly
    const quantityDiff = quantity - cartItem.quantity
    
    if (quantityDiff !== 0 && cartItem.product.stock !== null && cartItem.product.stock !== undefined) {
      if (quantityDiff > 0) {
        // Increasing quantity - check if enough stock
        if (cartItem.product.stock < quantityDiff) {
          return NextResponse.json(
            { error: `Insufficient stock. Only ${cartItem.product.stock} more units available.` },
            { status: 400 }
          )
        }
        // Deduct additional stock
        await prisma.product.update({
          where: { id: cartItem.productId },
          data: { stock: cartItem.product.stock - quantityDiff },
        })
      } else {
        // Decreasing quantity - restore stock
        await prisma.product.update({
          where: { id: cartItem.productId },
          data: { stock: cartItem.product.stock - quantityDiff }, // quantityDiff is negative, so this adds
        })
      }
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
      where: { id: params.itemId },
      include: { cart: true, product: true },
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

    // Restore stock when item is removed from cart
    if (cartItem.product.stock !== null && cartItem.product.stock !== undefined) {
      await prisma.product.update({
        where: { id: cartItem.productId },
        data: { stock: cartItem.product.stock + cartItem.quantity },
      })
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
