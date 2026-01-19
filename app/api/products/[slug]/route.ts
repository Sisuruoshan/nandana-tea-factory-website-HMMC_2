import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', params.slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      const response = NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
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
    // Cache product pages for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')

    return response
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()

    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', params.slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const docSnapshot = snapshot.docs[0];
    const productRef = doc(db, 'products', docSnapshot.id);

    // Update timestamp
    const updateData = {
      ...body,
      updatedAt: Timestamp.now()
    };

    await updateDoc(productRef, updateData);

    // Return updated data
    const updatedProduct = {
      id: docSnapshot.id,
      ...docSnapshot.data(), // old data
      ...updateData, // new data
      // Helper for return
      createdAt: docSnapshot.data().createdAt?.toDate?.() || new Date(docSnapshot.data().createdAt),
      updatedAt: updateData.updatedAt.toDate()
    };

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', params.slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const productRef = doc(db, 'products', snapshot.docs[0].id);
    await deleteDoc(productRef);

    return NextResponse.json({ message: 'Product deleted' })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
