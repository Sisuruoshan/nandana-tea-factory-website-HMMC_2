@extends('layouts.app')

@section('title','Admin Login')

@section('content')
    <div style="min-height:80vh; display:flex; align-items:center; justify-content:center;">
        <div style="background:var(--secondary-dark-green); padding:2rem; border-radius:12px; width:360px; text-align:center;">
            <h2>Admin Login</h2>
            <form id="admin-login-form">
                <div class="form-group"><label style="text-align:left; display:block;">Username</label><input id="admin-user" required></div>
                <div class="form-group"><label style="text-align:left; display:block;">Password</label><input id="admin-pass" type="password" required></div>
                <button class="btn btn-primary" type="submit">Sign In</button>
            </form>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    document.getElementById('admin-login-form').addEventListener('submit', function(e){
        e.preventDefault();
        // simple local check for demo; in real app use server auth
        const u = document.getElementById('admin-user').value.trim();
        const p = document.getElementById('admin-pass').value;
        if (u === 'admin' && p === 'password') {
            sessionStorage.setItem('isAdmin','1');
            window.location.href = '/admin';
        } else {
            alert('Invalid admin credentials (demo)');
        }
    });
</script>
@endpush
