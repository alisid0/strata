// Vercel Edge Middleware — password gate for the private review build.
//
// Uses a cookie + login form (NOT HTTP Basic Auth): Vercel strips the
// WWW-Authenticate header from middleware responses, so the browser's native
// auth dialog never appears. A form posting to /__auth, which sets a cookie,
// works reliably instead.
//
// The password lives in a Vercel env var (BASIC_AUTH_PASSWORD), never in this
// (public) repo. With no password set the gate fails open. Delete this file to
// make the site public again.
import { next } from '@vercel/edge';

export const config = {
  // Gate every route except Vercel's internal endpoints.
  matcher: '/((?!_vercel).*)',
};

const COOKIE = 'qx_review';

async function tokenFor(pass) {
  const data = new TextEncoder().encode('qubix-review::' + pass);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function loginPage(error = '') {
  const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Qubix — private review</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
    background:radial-gradient(ellipse at 50% 8%,#1D1A15,#141310 80%),#141310;color:#F2EADB;
    font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased}
  .card{width:min(360px,90vw);text-align:center}
  .brand{font-size:13px;font-weight:900;letter-spacing:.18em;color:#D28A5E;margin-bottom:14px}
  h1{font-size:22px;font-weight:800;margin:0 0 6px}
  p{font-size:14px;color:#CFC6B4;margin:0 0 22px;line-height:1.5}
  form{display:flex;flex-direction:column;gap:10px}
  input{padding:13px 14px;border-radius:12px;border:1.5px solid #3A342A;background:#211B12;color:#fff;font-size:15px;outline:none}
  input:focus{border-color:#D28A5E}
  button{padding:13px;border-radius:12px;border:none;background:#D28A5E;color:#141310;font-size:15px;font-weight:800;cursor:pointer}
  .err{color:#EC4B31;font-size:13px;min-height:18px;margin-top:2px}
</style></head>
<body><div class="card">
  <div class="brand">QUBIX</div>
  <h1>Private review</h1>
  <p>This build is shared with reviewers only. Enter the access password to continue.</p>
  <form method="POST" action="/__auth">
    <input type="password" name="password" placeholder="Access password" autofocus autocomplete="current-password" required>
    <button type="submit">Enter</button>
    <div class="err">${error}</div>
  </form>
</div></body></html>`;
  return new Response(html, {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export default async function middleware(request) {
  const PASS = process.env.BASIC_AUTH_PASSWORD;
  if (!PASS) return next(); // fail open if unconfigured

  const token = await tokenFor(PASS);
  const url = new URL(request.url);

  // Login submit.
  if (request.method === 'POST' && url.pathname === '/__auth') {
    const form = await request.formData();
    if ((form.get('password') || '') === PASS) {
      return new Response(null, {
        status: 303,
        headers: {
          'Location': '/',
          'Set-Cookie': `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
        },
      });
    }
    return loginPage('Wrong password — try again.');
  }

  // Already authenticated?
  const cookie = request.headers.get('cookie') || '';
  if (cookie.split(/;\s*/).some(c => c === `${COOKIE}=${token}`)) {
    return next();
  }

  return loginPage();
}
