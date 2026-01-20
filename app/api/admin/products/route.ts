import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc, Timestamp } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      slug,
      price,
      image,
      image2,
      origin,
      notes,
      brewingGuide,
      longDescription,
      stock,
      isWholesale,
      wholesalePrice,
      minWholesaleQty,
    } = body

    // Validate required fields
    if (!name || !slug || !price) {
      return NextResponse.json(
        { error: 'Name, slug, and price are required' },
        { status: 400 }
      )
    }

    // Validate image size for Firestore (if present)
    // 950,000 chars allows for some other fields metadata before hitting 1MB limit
    if (image && image.length > 950000) {
      return NextResponse.json(
        { error: 'Image is too large. Max size is ~900KB for Base64 storage.' },
        { status: 400 }
      )
    }

    // Validate image2 size
    if (image2 && image2.length > 950000) {
      return NextResponse.json(
        { error: 'Image 2 is too large. Max size is ~900KB for Base64 storage.' },
        { status: 400 }
      )
    }

    const productsRef = collection(db, 'products');

    // Check if slug already exists
    const q = query(productsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      )
    }

    // Create product
    const newProduct = {
      name,
      description: description || '',
      slug,
      price: parseFloat(price),
      image: image || null,
      image2: image2 || null,
      origin: origin || null,
      notes: notes || null,
      brewingGuide: brewingGuide || null,
      longDescription: longDescription || null,
      stock: parseInt(stock) || 0,
      isWholesale: isWholesale || false,
      wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : null,
      minWholesaleQty: minWholesaleQty ? parseInt(minWholesaleQty) : 10,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(productsRef, newProduct);

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: { id: docRef.id, ...newProduct },
    })
  } catch (error: any) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product: ' + error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      description,
      slug,
      price,
      image,
      image2,
      origin,
      notes,
      brewingGuide,
      longDescription,
      stock,
      isWholesale,
      wholesalePrice,
      minWholesaleQty,
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Validate image size
    if (image && image.length > 950000) {
      return NextResponse.json(
        { error: 'Image is too large. Max size is ~900KB for Base64 storage.' },
        { status: 400 }
      )
    }

    // Validate image2 size
    if (image2 && image2.length > 950000) {
      return NextResponse.json(
        { error: 'Image 2 is too large. Max size is ~900KB for Base64 storage.' },
        { status: 400 }
      )
    }

    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const updateData = {
      name,
      description: description || '',
      slug,
      price: parseFloat(price),
      image: image || null,
      image2: image2 || null,
      origin: origin || null,
      notes: notes || null,
      brewingGuide: brewingGuide || null,
      longDescription: longDescription || null,
      stock: parseInt(stock) || 0,
      isWholesale: isWholesale || false,
      wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : null,
      minWholesaleQty: minWholesaleQty ? parseInt(minWholesaleQty) : 10,
      updatedAt: Timestamp.now(),
    };

    // Update product
    await updateDoc(productRef, updateData);

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: { id, ...updateData },
    })
  } catch (error: any) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product: ' + error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const productRef = doc(db, 'products', id);
    // Firestore deleteDoc doesn't error if doc missing, but finding first is good for user feedback or existence check
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete product
    await deleteDoc(productRef);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error: any) {
    console.error('Product delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product: ' + error.message },
      { status: 500 }
    )
  }
}
