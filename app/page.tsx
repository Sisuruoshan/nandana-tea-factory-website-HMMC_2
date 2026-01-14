import Link from 'next/link'

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Experience the Essence of Ceylon</h1>
        <p>Discover the rich heritage and exquisite flavors of Nandana Tea, crafted with passion and tradition.</p>
        <div className="hero-btns">
          <Link href="/products" className="btn btn-primary">Shop Now</Link>
          <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
        </div>
      </div>
    </section>
  )
}
