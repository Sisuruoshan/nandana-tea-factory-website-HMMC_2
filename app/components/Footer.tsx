'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import ScrollReveal from './ScrollReveal'

export default function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null

  return (
    <footer className={pathname === '/' ? '' : 'footer-with-bg'}>
      <div className="container footer-content footer-grid">
        <ScrollReveal key={`${pathname}-brand`} animation="slide-in-left" duration={0.8} className="footer-brand">
          <div className="footer-logo"><i className="fa-solid fa-leaf"></i> Nandana Tea</div>
          <p className="footer-tagline">Crafted in Sri Lanka. Sustainably sourced, ethically produced.</p>
          <div className="footer-social">
            <a href="https://www.facebook.com/share/1Ay4bEF4K6/" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/nandanatea?igsh=MTJsd3h5ZXpyaGFmbQ==" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="https://youtube.com/@nandanatea735?si=KXzxNZLEeoAutpl3" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          </div>
        </ScrollReveal>

        <ScrollReveal key={`${pathname}-explore`} animation="fade-up" delay={0.2} duration={0.8} className="footer-links">
          <h4>Explore</h4>
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
        </ScrollReveal>

        <ScrollReveal key={`${pathname}-support`} animation="slide-in-right" delay={0.3} duration={0.8} className="footer-links">
          <h4>Support</h4>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <a href="mailto:info@nandanatea.com">info@nandanatea.com</a>
          <a href="tel:+94777920019">077 792 0019</a>
          <p>No: 123, Nandana Tea Factory,  Akuressa, Sri Lanka</p>
        </ScrollReveal>
      </div>
      <ScrollReveal key={`${pathname}-copyright`} animation="fade-up" delay={0.4} duration={0.6} className="container footer-bottom">
        <p>© {new Date().getFullYear()} Nandana Tea Factory. All rights reserved.</p>
      </ScrollReveal>
    </footer>
  )
}
