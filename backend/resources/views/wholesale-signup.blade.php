@extends('layouts.app')

@section('title','Wholesale Signup')

@section('content')
    <section class="page-header">
        <h1>Wholesale Signup</h1>
    </section>
    <div class="container" style="padding:2rem 0;">
        <form id="wholesale-signup-form">
            <div class="form-group"><label>Company</label><input id="ws-signup-company" required></div>
            <div class="form-group"><label>Contact Name</label><input id="ws-signup-name" required></div>
            <div class="form-group"><label>Email</label><input id="ws-signup-email" type="email" required></div>
            <div class="form-group"><label>Phone</label><input id="ws-signup-phone"></div>
            <div class="form-group"><label>Password</label><input id="ws-signup-password" type="password" required></div>
            <div class="form-group"><label>Confirm Password</label><input id="ws-signup-password-confirm" type="password" required></div>
            <button class="btn btn-primary" type="submit">Create Account</button>
        </form>
    </div>
@endsection
