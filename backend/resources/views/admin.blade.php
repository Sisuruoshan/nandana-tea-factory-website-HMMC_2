@extends('layouts.app')

@section('title','Admin Dashboard')

@section('content')
    <section class="page-header">
        <h1>Admin Dashboard</h1>
    </section>
    <div class="container" style="padding:2rem 0;">
        <p style="color:var(--text-medium);">Admin tools are client-side demo only. Use Shift+A to jump to admin login.</p>
        <div id="admin-sections" style="margin-top:1rem;">
            <p>Products, Inquiries and Wholesale management are available if you explore the admin UI.</p>
        </div>
    </div>
@endsection
