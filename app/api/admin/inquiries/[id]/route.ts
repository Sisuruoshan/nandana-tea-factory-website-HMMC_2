import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.inquiry.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ message: 'Inquiry deleted' })
  } catch (error) {
    console.error('Delete inquiry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { reply } = body

    if (!reply) {
      return NextResponse.json(
        { error: 'Reply is required' },
        { status: 400 }
      )
    }

    const inquiry = await prisma.inquiry.update({
      where: { id: parseInt(params.id) },
      data: {
        reply,
        status: 'replied',
      },
    })

    // TODO: Send email notification
    // For now, we'll just return success

    return NextResponse.json({
      message: 'Reply sent and saved successfully',
      inquiry,
    })
  } catch (error) {
    console.error('Reply to inquiry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
