@extends('layouts.app')

@section('title', 'Privacy Policy - Nandana Tea')

@section('content')
<div class="container" style="padding-top: 8rem; padding-bottom: 4rem; max-width: 900px;">
    <section class="page-header" style="padding-top: 0; padding-bottom: 2rem;">
        <h1>Privacy Policy</h1>
        <p>Your privacy matters to us. This page explains what we collect, why we collect it, and how we protect it.</p>
    </section>

    <div class="policy-section" style="display: grid; gap: 1.5rem;">
        <div class="policy-card" style="background: var(--secondary-dark-green); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem;">
            <h3>Information We Collect</h3>
            <ul style="margin-top: 0.75rem; padding-left: 1.2rem; color: var(--text-medium);">
                <li>Contact details (name, email, phone) when you submit inquiries or create an account.</li>
                <li>Order and cart information to fulfill purchases.</li>
                <li>Website usage data (via cookies/analytics) to improve site performance.</li>
            </ul>
        </div>

        <div class="policy-card" style="background: var(--secondary-dark-green); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem;">
            <h3>How We Use Your Data</h3>
            <ul style="margin-top: 0.75rem; padding-left: 1.2rem; color: var(--text-medium);">
                <li>Respond to your inquiries and process wholesale requests.</li>
                <li>Provide customer support and order confirmations.</li>
                <li>Improve our products, services, and website experience.</li>
            </ul>
        </div>

        <div class="policy-card" style="background: var(--secondary-dark-green); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem;">
            <h3>Sharing & Security</h3>
            <ul style="margin-top: 0.75rem; padding-left: 1.2rem; color: var(--text-medium);">
                <li>We do not sell your personal data.</li>
                <li>We share data only with trusted providers necessary to run the site (e.g., hosting, email).</li>
                <li>We apply reasonable technical and organizational measures to protect your information.</li>
            </ul>
        </div>

        <div class="policy-card" style="background: var(--secondary-dark-green); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem;">
            <h3>Your Choices</h3>
            <ul style="margin-top: 0.75rem; padding-left: 1.2rem; color: var(--text-medium);">
                <li>You can request access, updates, or deletion of your data by contacting us.</li>
                <li>You can opt out of non-essential communications at any time.</li>
                <li>You can adjust cookie settings in your browser to limit tracking.</li>
            </ul>
        </div>

        <div class="policy-card" style="background: var(--secondary-dark-green); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem;">
            <h3>Contact</h3>
            <p style="margin-top: 0.75rem; color: var(--text-medium);">For privacy questions or requests, email <a href="mailto:info@nandanatea.com" style="color: var(--accent-mint-green);">info@nandanatea.com</a>.</p>
        </div>
    </div>
</div>
@endsection
