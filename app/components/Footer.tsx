import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="container footer-content footer-grid">
        <div className="footer-brand">
          <div className="footer-logo"><i className="fa-solid fa-leaf"></i> Nandana Tea</div>
          <p className="footer-tagline">Crafted in Sri Lanka. Sustainably sourced, ethically produced.</p>
          <div className="footer-social">
            <a href="https://www.facebook.com/share/1Ay4bEF4K6/" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/nandanatea?igsh=MTJsd3h5ZXpyaGFmbQ==" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="https://youtube.com/@nandanatea735?si=KXzxNZLEeoAutpl3" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Explore</h4>
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <a href="mailto:info@nandanatea.com">info@nandanatea.com</a>
          <a href="tel:+94112223344">+94 11 222 3344</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Nandana Tea Factory. All rights reserved.</p>
        <p>123 Tea Estate Road, Akuressa, Sri Lanka</p>
      </div>
    </footer>
  )
}
