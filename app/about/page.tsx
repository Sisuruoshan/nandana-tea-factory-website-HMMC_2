export default function AboutPage() {
  return (
    <main className="container">
      <section className="page-header1">
        <br />
        <h1>About Nandana Tea Factory</h1>
        <br />
        <p>
          Discover the rich heritage and unwavering commitment to quality that defines Nandana Tea Factory, a premier Sri
          Lankan tea manufacturer and distributor.
        </p>
        <br />
        <br />
      </section>

      <section className="about-section">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            The Nandana Tea Experiences are meaningful and will stir your soul on what is possible when authenticity,
            generous hospitality and values come together. Just ask anyone who has been to Nandana or go through the
            comments made about us online and in person, you’ll find out why. We welcome guests from all over the world
            to stay with us, share a meal with us and experience Tea EduTourism at it’s finest. We hope to see you soon.
          </p>
        </div>
        <img src="/srs/nandana-tea-monastery (1).jpg" alt="Tea cup and bowl" />
      </section>

      <section className="certifications">
        <h2>Our Certifications</h2>
        <div className="cert-grid">
          <div className="cert-card">
            <i className="fa-solid fa-certificate"></i>
            <br />
            <h3>ISO 22000:2005</h3>
          </div>
          <div className="cert-card">
            <i className="fa-solid fa-shield-halved"></i>
            <h3>prestigious Product Certification</h3>
          </div>
          <div className="cert-card">
            <i className="fa-solid fa-leaf"></i>
            <h3>Sustainable Practices</h3>
          </div>
        </div>
      </section>

      <section className="about-section">
        <img src="/srs/nandana-tea-factory_02.jpg" alt="Tea packaging and loose leaves" />
        <div className="about-text">
          <h2>Our Process & Vision</h2>
          <p>
            We want to show to the world that you can create a sustainable business leveraging an honest product while
            supporting your local community. Because together we can achieve so much!
          </p>
          <br />
          <br />
          <h2>Our Mission</h2>
          <p>
            We want to show to the world that you can create a sustainable business leveraging an honest product while
            supporting your local community. Because together we can achieve so much!
          </p>
        </div>
      </section>
    </main>
  )
}
