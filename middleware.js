// Vercel Edge Middleware — HTTP Basic Auth gate for the private review build.
//
// Credentials live in Vercel env vars (BASIC_AUTH_USER / BASIC_AUTH_PASSWORD),
// never in this (public) repo. To make the site public again later, delete this
// file or unset the env vars — with no creds set, the gate fails open.
import { next } from '@vercel/edge';

export const config = {
  // Gate every route except Vercel's internal endpoints.
  matcher: '/((?!_vercel).*)',
};

export default function middleware(request) {
  const USER = process.env.BASIC_AUTH_USER;
  const PASS = process.env.BASIC_AUTH_PASSWORD;

  // Fail open if creds aren't configured, so a missing env var can't lock everyone out.
  if (!USER || !PASS) return next();

  const header = request.headers.get('authorization') || '';
  if (header.startsWith('Basic ')) {
    let decoded = '';
    try { decoded = atob(header.slice(6)); } catch { decoded = ''; }
    const sep = decoded.indexOf(':');
    if (sep !== -1 && decoded.slice(0, sep) === USER && decoded.slice(sep + 1) === PASS) {
      return next();
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Qubix — private review", charset="UTF-8"',
      'Content-Type': 'text/plain',
    },
  });
}
