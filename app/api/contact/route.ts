import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        subject,
        message,
        status: 'new',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted! We will contact you soon.',
      inquiry,
    })
  } catch (error) {
    console.error('Contact inquiry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
