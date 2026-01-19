import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc, Timestamp, writeBatch } from 'firebase/firestore'
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

    // Find User's Cart to verify ownership and get cartId
    const cartsRef = collection(db, 'carts');
    const q = query(cartsRef, where('userId', '==', user.id));
    const cartSnapshot = await getDocs(q);

    if (cartSnapshot.empty) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    const cartDoc = cartSnapshot.docs[0];
    const cartId = cartDoc.id;

    // Get Item reference
    const itemRef = doc(db, 'carts', cartId, 'items', params.itemId);
    const itemSnap = await getDoc(itemRef);

    if (!itemSnap.exists()) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    const itemData = itemSnap.data();

    // Get Product to check stock
    const productRef = doc(db, 'products', itemData.productId);
    const productSnap = await getDoc(productRef);
    const productData = productSnap.exists() ? productSnap.data() : null;

    if (!productData) {
      // Should probably delete item if product missing, but for now error
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Stock check
    const quantityDiff = quantity - itemData.quantity;

    if (quantityDiff !== 0 && productData.stock !== null && productData.stock !== undefined) {
      if (quantityDiff > 0) {
        if (productData.stock < quantityDiff) {
          return NextResponse.json(
            { error: `Insufficient stock. Only ${productData.stock} more units available.` },
            { status: 400 }
          )
        }
        // Deduct stock
        await updateDoc(productRef, {
          stock: productData.stock - quantityDiff
        });
      } else {
        // Restore stock
        await updateDoc(productRef, {
          stock: productData.stock - quantityDiff // quantityDiff is negative
        });
      }
    }

    const newSubtotal = Number(itemData.price) * quantity;

    await updateDoc(itemRef, {
      quantity,
      subtotal: newSubtotal,
      updatedAt: Timestamp.now()
    });

    // Recalculate Cart Total
    const itemsRef = collection(db, 'carts', cartId, 'items');
    const allItemsSnapshot = await getDocs(itemsRef);
    const totalAmount = allItemsSnapshot.docs.reduce(
      (sum, item) => sum + Number(item.data().subtotal),
      0
    );

    await updateDoc(cartDoc.ref, {
      totalAmount,
      updatedAt: Timestamp.now()
    });

    return NextResponse.json({
      success: true,
      subtotal: newSubtotal,
      cart_total: totalAmount,
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

    // Find User's Cart
    const cartsRef = collection(db, 'carts');
    const q = query(cartsRef, where('userId', '==', user.id));
    const cartSnapshot = await getDocs(q);

    if (cartSnapshot.empty) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    const cartDoc = cartSnapshot.docs[0];
    const cartId = cartDoc.id;

    // Get Item
    const itemRef = doc(db, 'carts', cartId, 'items', params.itemId);
    const itemSnap = await getDoc(itemRef);

    if (!itemSnap.exists()) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    const itemData = itemSnap.data();

    // Restore stock
    if (itemData.productId) {
      const productRef = doc(db, 'products', itemData.productId);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        const productData = productSnap.data();
        if (productData.stock !== null && productData.stock !== undefined) {
          await updateDoc(productRef, {
            stock: productData.stock + itemData.quantity
          });
        }
      }
    }

    await deleteDoc(itemRef);

    // Recalculate Cart Total
    const itemsRef = collection(db, 'carts', cartId, 'items');
    const allItemsSnapshot = await getDocs(itemsRef);
    const totalAmount = allItemsSnapshot.docs.reduce(
      (sum, item) => sum + Number(item.data().subtotal),
      0
    );

    await updateDoc(cartDoc.ref, {
      totalAmount,
      updatedAt: Timestamp.now()
    });

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart.',
      cart_total: totalAmount,
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
