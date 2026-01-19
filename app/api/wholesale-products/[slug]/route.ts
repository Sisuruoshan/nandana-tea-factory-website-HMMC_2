import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('slug', '==', params.slug),
      where('isWholesale', '==', true)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      const response = NextResponse.json({ error: 'Product not found' }, { status: 404 })
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
      return response
    }

    const docData = snapshot.docs[0].data();
    const product = {
      id: snapshot.docs[0].id,
      ...docData,
      createdAt: docData.createdAt?.toDate?.() || new Date(docData.createdAt),
      updatedAt: docData.updatedAt?.toDate?.() || new Date(docData.updatedAt)
    };

    const response = NextResponse.json(product)
    // Cache wholesale product pages
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')

    return response
  } catch (error) {
    console.error('Get wholesale product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

