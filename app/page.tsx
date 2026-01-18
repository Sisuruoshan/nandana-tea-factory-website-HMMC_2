import Link from 'next/link'
import ScrollReveal from './components/ScrollReveal'

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-content">
        <ScrollReveal animation="fade-up" duration={0.8}>
          <h1>Experience the Essence of Ceylon</h1>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={0.2} duration={0.8}>
          <p>Discover the rich heritage and exquisite flavors of Nandana Tea, crafted with passion and tradition.</p>
        </ScrollReveal>

        <ScrollReveal animation="zoom-in" delay={0.4} duration={0.6}>
          <div className="hero-btns">
            <Link href="/products" className="btn btn-primary">Shop Now</Link>
            <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
