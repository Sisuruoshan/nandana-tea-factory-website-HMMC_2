'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  description: string
  slug: string
  price: number
  image: string | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    const handleHeaderSearch = (event: CustomEvent) => {
      setSearchQuery(event.detail)
    }
    window.addEventListener('headerSearch', handleHeaderSearch as EventListener)
    return () => {
      window.removeEventListener('headerSearch', handleHeaderSearch as EventListener)
    }
  }, [])

  const loadProducts = async () => {
    try {
      // Add cache and deduplication
      const res = await fetch('/api/products?is_wholesale=false', {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      })
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase()
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    )
  })

  const formatPrice = (value: number) => {
    return `Rs. ${value.toFixed(2)}`
  }

  const resolveImage = (path: string | null) => {
    if (!path) return '/images/image.png'
    if (path.startsWith('data:')) return path
    if (path.startsWith('http')) return path
    return `/${path.replace(/^\//, '')}`
  }

  return (
    <main className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <section className="page-header">
        <h1>Our Teas</h1>
      </section>

      <div className="product-controls">
        <Link href="/products" className="btn active">Retail</Link>
        <Link href="/wholesale" className="btn">Wholesale</Link>
      </div>

      {loading ? (
        <div id="product-loading" style={{ padding: '20px', textAlign: 'center', color: '#555' }}>
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div id="no-results" style={{ padding: '20px', textAlign: 'center', color: '#555' }}>
          No matching products found.
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <Image
                src={resolveImage(product.image)}
                alt={product.name}
                width={240}
                height={180}
                style={{ objectFit: 'cover' }}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="price">{formatPrice(product.price)}</div>
              <Link href={`/product?id=${encodeURIComponent(product.slug)}`}>View More</Link>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
