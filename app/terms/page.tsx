export default function TermsPage() {
  return (
    <main>
      <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: '900px' }}>
        <section className="page-header" style={{ paddingTop: 0, paddingBottom: '2rem' }}>
          <h1>Terms of Service</h1>
          <p>Please review these terms that govern your use of Nandana Tea’s website and services.</p>
        </section>

        <div className="policy-section" style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="policy-card" style={{ background: 'var(--secondary-light-green)', border: '2px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 16px var(--shadow-green)' }}>
            <h3 style={{ color: 'var(--accent-dark-green)' }}>Using Our Site</h3>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.2rem', color: 'var(--text-dark)' }}>
              <li>Use the site lawfully and do not interfere with its operation.</li>
              <li>Account holders are responsible for keeping login credentials secure.</li>
            </ul>
          </div>

          <div className="policy-card" style={{ background: 'var(--secondary-light-green)', border: '2px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 16px var(--shadow-green)' }}>
            <h3 style={{ color: 'var(--accent-dark-green)' }}>Orders &amp; Pricing</h3>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.2rem', color: 'var(--text-dark)' }}>
              <li>Prices and availability may change; we will notify you of material changes affecting an order.</li>
              <li>Wholesale minimums and pricing apply as displayed or agreed with our team.</li>
            </ul>
          </div>

          <div className="policy-card" style={{ background: 'var(--secondary-light-green)', border: '2px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 16px var(--shadow-green)' }}>
            <h3 style={{ color: 'var(--accent-dark-green)' }}>Content &amp; IP</h3>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.2rem', color: 'var(--text-dark)' }}>
              <li>All site content is owned by Nandana Tea or its licensors; please do not reuse without permission.</li>
              <li>Trademarks and branding are protected; unauthorized use is prohibited.</li>
            </ul>
          </div>

          <div className="policy-card" style={{ background: 'var(--secondary-light-green)', border: '2px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 16px var(--shadow-green)' }}>
            <h3 style={{ color: 'var(--accent-dark-green)' }}>Disclaimers &amp; Liability</h3>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.2rem', color: 'var(--text-dark)' }}>
              <li>Services are provided “as is”; we aim for accuracy but do not warrant error-free operation.</li>
              <li>To the extent permitted by law, our liability is limited to amounts you paid for affected orders.</li>
            </ul>
          </div>

          <div className="policy-card" style={{ background: 'var(--secondary-light-green)', border: '2px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 16px var(--shadow-green)' }}>
            <h3 style={{ color: 'var(--accent-dark-green)' }}>Changes &amp; Contact</h3>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.2rem', color: 'var(--text-dark)' }}>
              <li>We may update these terms; continued use means acceptance of the latest version.</li>
              <li>
                Questions? Email{' '}
                <a href="mailto:info@nandanatea.com" style={{ color: 'var(--accent-dark-green)', fontWeight: '600' }}>info@nandanatea.com</a>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
