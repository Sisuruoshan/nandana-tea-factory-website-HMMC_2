<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sign Up - Nandana Tea</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        .auth-page{ display:flex; align-items:center; justify-content:center; min-height:100vh; background:#012403; position:relative; }
        .auth-page::before { content:''; position:absolute; top:0; left:0; width:100%; height:100%; background:url('srs/tea4.jpg') no-repeat center center fixed; background-size:cover; z-index:-1; filter: blur(2px); }
        .auth-card{ background:var(--secondary-dark-green); padding:1.5rem; border-radius:12px; width:100%; max-width:450px; border:1px solid var(--border-color); position:relative; z-index:1; text-align:center; }
        .auth-card h2{ margin-bottom:0.75rem; }
        .form-actions{ display:flex; gap:0.75rem; align-items:stretch; margin-top:1rem; }
        .form-actions button, .form-actions a { flex:1; }
    </style>
</head>
<body class="auth-page">
    <div class="auth-card">
        <h2>Create Your Account</h2>
       
        <form id="signup-form" method="POST" action="{{ url('/signup') }}">
            @csrf
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required>
            </div>
            <div class="form-group">
                <label>Phone (optional)</label>
                <input type="text" name="phone">
            </div>
            <div class="form-group">
                <label>Address (optional)</label>
                <textarea name="address" rows="2"></textarea>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Create Account</button>
                <a href="user-login.html" class="btn btn-secondary">Already have an account</a>
            </div>
        </form>
    </div>

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
        window.location.href = 'index.blade.php';
    });
</script>
<script src="main.js"></script>
    <script src="{{ asset('js/main.js') }}"></script>
</body>
</html>