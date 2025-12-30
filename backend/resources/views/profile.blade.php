@extends('layouts.app')

@section('title', 'Profile - Nandana Tea')

@section('content')
    <section class="page-header">
        <h1>Your Profile</h1>
    </section>
    <div class="container" style="padding:2rem 0;">
        <div id="profile-card" style="background:var(--secondary-dark-green); padding:1.5rem; border-radius:12px;">
            <h3 id="profile-name">Name</h3>
            <p id="profile-email" style="color:var(--text-medium);">email@example.com</p>
            <p id="profile-phone" style="color:var(--text-medium);"></p>
            <p id="profile-address" style="color:var(--text-medium);"></p>
            <div style="margin-top:1rem;">
                <button id="logout-btn" class="btn btn-secondary">Logout</button>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    // Populate profile from client-side storage
    document.addEventListener('DOMContentLoaded', () => {
        const user = getCurrentUser();
        if (!user) {
            alert('You are not logged in.');
            window.location.href = '/login';
            return;
        }
        document.getElementById('profile-name').textContent = user.name || 'User';
        document.getElementById('profile-email').textContent = user.email || '';
        document.getElementById('profile-phone').textContent = user.phone ? ('Phone: ' + user.phone) : '';
        document.getElementById('profile-address').textContent = user.address ? ('Address: ' + user.address) : '';

        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logoutUser(); window.location.href = '/'; });
    });
</script>
@endpush
