import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, company, email, phone, address, details } = body

    if (!name || !company || !email || !details) {
      return NextResponse.json(
        { error: 'Name, company, email, and details are required' },
        { status: 400 }
      )
    }

    const inquiry = await prisma.wholesaleInquiry.create({
      data: {
        name,
        company,
        email,
        phone: phone || null,
        address: address || null,
        details,
        status: 'new',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted! We will contact you soon.',
      inquiry,
    })
  } catch (error) {
    console.error('Wholesale inquiry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
