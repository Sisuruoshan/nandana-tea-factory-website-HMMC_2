export default function PrivacyPage() {
  return (
    <main>
      <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: '900px' }}>
        <section className="page-header" style={{ paddingTop: 0, paddingBottom: '2rem' }}>
          <h1>Privacy Policy</h1>
          <p>Your privacy matters to us. This page explains what we collect, why we collect it, and how we protect it.</p>
        </section>

        <div className="policy-section" style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="policy-card" style={{ background: 'var(--secondary-light-green)', border: '2px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 16px var(--shadow-green)' }}>
            <h3 style={{ color: 'var(--accent-dark-green)' }}>Information We Collect</h3>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.2rem', color: 'var(--text-dark)' }}>
              <li>Contact details (name, email, phone) when you submit inquiries or create an account.</li>
              <li>Order and cart information to fulfill purchases.</li>
              <li>Website usage data (via cookies/analytics) to improve site performance.</li>
            </ul>
          </div>

          <div className="policy-card" style={{ background: 'var(--secondary-light-green)', border: '2px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 16px var(--shadow-green)' }}>
            <h3 style={{ color: 'var(--accent-dark-green)' }}>How We Use Your Data</h3>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.2rem', color: 'var(--text-dark)' }}>
              <li>Respond to your inquiries and process wholesale requests.</li>
              <li>Provide customer support and order confirmations.</li>
              <li>Improve our products, services, and website experience.</li>
            </ul>
          </div>

          <div className="policy-card" style={{ background: 'var(--secondary-light-green)', border: '2px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 16px var(--shadow-green)' }}>
            <h3 style={{ color: 'var(--accent-dark-green)' }}>Sharing &amp; Security</h3>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.2rem', color: 'var(--text-dark)' }}>
              <li>We do not sell your personal data.</li>
              <li>We share data only with trusted providers necessary to run the site (e.g., hosting, email).</li>
              <li>We apply reasonable technical and organizational measures to protect your information.</li>
            </ul>
          </div>

          <div className="policy-card" style={{ background: 'var(--secondary-light-green)', border: '2px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 16px var(--shadow-green)' }}>
            <h3 style={{ color: 'var(--accent-dark-green)' }}>Your Choices</h3>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.2rem', color: 'var(--text-dark)' }}>
              <li>You can request access, updates, or deletion of your data by contacting us.</li>
              <li>You can opt out of non-essential communications at any time.</li>
              <li>You can adjust cookie settings in your browser to limit tracking.</li>
            </ul>
          </div>

          <div className="policy-card" style={{ background: 'var(--secondary-light-green)', border: '2px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 16px var(--shadow-green)' }}>
            <h3 style={{ color: 'var(--accent-dark-green)' }}>Contact</h3>
            <p style={{ marginTop: '0.75rem', color: 'var(--text-dark)' }}>
              For privacy questions or requests, email{' '}
              <a href="mailto:info@nandanatea.com" style={{ color: 'var(--accent-dark-green)', fontWeight: '600' }}>info@nandanatea.com</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
