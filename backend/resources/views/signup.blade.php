@extends('layouts.app')

@section('title', 'Sign Up - Nandana Tea')

@section('content')
    <div class="auth-page" style="min-height:100vh; display:flex; align-items:center; justify-content:center;">
        <div class="auth-card" style="background:var(--secondary-dark-green); padding:1.5rem; border-radius:12px; width:100%; max-width:450px; border:1px solid var(--border-color); text-align:center;">
            <h2>Create Your Account</h2>
            <form id="signup-form">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="password" required>
                </div>
                <div class="form-group">
                    <label>Phone (optional)</label>
                    <input type="text" id="phone">
                </div>
                <div class="form-group">
                    <label>Address (optional)</label>
                    <textarea id="address" rows="2"></textarea>
                </div>
                <div class="form-actions" style="display:flex; gap:.75rem;">
                    <button type="submit" class="btn btn-primary">Create Account</button>
                    <a href="{{ url('/login') }}" class="btn btn-secondary">Already have an account</a>
                </div>
            </form>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    document.getElementById('signup-form').addEventListener('submit', (e)=>{
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();

        if (!name || !email || !password) { alert('Please fill required fields'); return; }

        const result = createUser({ name, email, password, phone, address });
        if (!result.ok) { alert(result.message); return; }
        // Auto-login
        authenticateUser(email, password);
        alert('Account created. You are now signed in.');
        window.location.href = '{{ url('/') }}';
    });
</script>
@endpush
