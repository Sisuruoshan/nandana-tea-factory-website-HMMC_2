'use client'

import { useState, useEffect } from 'react'

export default function AboutPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [
    '/srs/v1.png',
    '/srs/v2.jpg',
    '/srs/v3.png',
    '/srs/nandana-tea-factory_02.jpg'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="about-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="tea-decoration">
        <img src="/images/tea-cup-1.png" className="tea-cup tea-cup-1" alt="Tea Cup" />
        <img src="/images/tea-cup-2.png" className="tea-cup tea-cup-2" alt="Tea Cup" />
        <img src="/images/tea-cup-3.png" className="tea-cup tea-cup-3" alt="Tea Cup" />
        <img src="/images/tea-cup-4.png" className="tea-cup tea-cup-4" alt="Tea Cup" />
        <img src="/images/tea-cup-5.png" className="tea-cup tea-cup-5" alt="Tea Cup" />
        <img src="/images/tea-cup-6.png" className="tea-cup tea-cup-6" alt="Tea Cup" />
        <img src="/images/tea-cup-7.png" className="tea-cup tea-cup-7" alt="Tea Cup" />
        <img src="/images/tea-cup-8.png" className="tea-cup tea-cup-8" alt="Tea Cup" />
      </div>

      <section className="page-header1">
        <div className="container">
          <br />
          <h1 className="professional-heading">About Nandana Tea Factory</h1>

          <p className="professional-subtitle">
            Discover the rich heritage and unwavering commitment to quality that defines Nandana Tea Factory, a premier Sri
            Lankan tea manufacturer and distributor.
          </p>
          <br />
          <br />
        </div>
      </section>

      <main className="container">

        <section className="about-section" style={{ display: 'block' }}>
          <div className="about-text">
            <h2>Our Story</h2>
            <p>
              Matara, a southern Sri Lankan coastal terrain, a land well known for its thriving fishing, diverse vegetation, stretch of paddy cultivation, intellectual pursuits, rich culture & heritage, and architecture until late Mr. D.A Wanigasekara (1860-1955), one of the pioneer tea planters in this region made the history by venturing into tea culture in 1910.

              Nandana Tea Factory (NTF) is situated in Akuressa, bordering the wide expanse of waters: the Nilwala Ganga (Blue River). NTF makes premium orthodox black tea, maintaining the age old tradition, preserving intrinsic aroma, taste and quality. NTF stamped its mark in the country as the best producers of low-grown tea. NTF processes 120K to 150K Kg of green leaf monthly under the proficient guidance of its managing director, Mr. Gunasoma Wanigasekara.<br /><br />

              Its own brand image is present in a variety of countries including New Zealand, Australia, Japan, Germany and the United Kingdom. Handpicked-golden buds, state-of-the-art machinery and most importantly experienced staff is what allows us to bring a superior brew to you. Implementation of the famous Japanese 5-S system for greater production efficiencies, maintenance of high standard and stringent hygienic conditions undoubtedly do contribute towards the production of premium quality tea and timely delivery. The accolades that come our way from world over, acknowledging the quality of our teas and the service we provide is what we value most.<br />
            </p>
          </div>
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
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {images.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`Tea factory image ${index + 1}`}
                style={{
                  position: index === 0 ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: `translateX(${(index - currentImageIndex) * 100}%)`,
                  transition: 'transform 0.8s ease-in-out'
                }}
              />
            ))}
          </div>
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
    </div>
  )
}
