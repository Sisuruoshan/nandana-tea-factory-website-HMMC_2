import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company, name, email, phone, address } = body

    if (!company || !name || !email) {
      return NextResponse.json(
        { error: 'Company, name, and email are required' },
        { status: 400 }
      )
    }

    const inquiriesRef = collection(db, 'wholesale_inquiries');

    // Check for existing email to mimic unique constraint
    const q = query(inquiriesRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    const newInquiry = {
      company,
      name,
      email,
      phone: phone || null,
      address: address || null,
      details: 'Wholesale Account Signup',
      status: 'new',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(inquiriesRef, newInquiry);

    return NextResponse.json({
      success: true,
      message: 'Signup submitted! An admin will review your application.',
      inquiry: { id: docRef.id, ...newInquiry },
    })
  } catch (error: any) {
    console.error('Wholesale signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
