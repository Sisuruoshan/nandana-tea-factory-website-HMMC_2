@extends('layouts.app')

@section('title', 'Login - Nandana Tea')

@section('content')
    <div class="login-container" style="min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1rem;">
        <div class="login-card" style="background:var(--card-bg, rgba(12,66,44,0.95)); padding:2.5rem; border-radius:12px; width:100%; max-width:420px; text-align:center; border:1px solid var(--card-border, #334f4e);">
            <i class="fa-solid fa-leaf" style="color:var(--accent-mint-green); font-size:3rem; display:block; margin:0 auto;"></i>
            <h2>Welcome Back</h2>
            <form id="login-form">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="user-email" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="user-pass" required>
                </div>
                <button type="submit" class="btn btn-primary">Sign In</button>
            </form>
            <div class="signup-link" style="margin-top:1rem;">
                <a href="{{ url('/signup') }}" class="btn btn-secondary">Create an account</a>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('user-email').value.trim();
        const pass = document.getElementById('user-pass').value;
        const res = authenticateUser(email, pass);
        if (res.ok) {
            alert('Signed in');
            window.location.href = '{{ url('/') }}';
        } else {
            alert(res.message || 'Invalid credentials');
        }
    });
</script>
@endpush
