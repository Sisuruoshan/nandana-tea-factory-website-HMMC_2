import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

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

    const inquiriesRef = collection(db, 'wholesale_inquiries');

    const newInquiry = {
      name,
      company,
      email,
      phone: phone || null,
      address: address || null,
      details,
      status: 'new',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(inquiriesRef, newInquiry);

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted! We will contact you soon.',
      inquiry: { id: docRef.id, ...newInquiry },
    })
  } catch (error) {
    console.error('Wholesale inquiry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
