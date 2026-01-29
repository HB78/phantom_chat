import { nanoid } from 'nanoid';
import { NextResponse, type NextRequest } from 'next/server';
import { redis } from './lib/redis-setup/redis';

const isDevelopment = process.env.NODE_ENV === 'development';

const allowedOrigins = [
  'https://phantomchat.app',
  'https://www.phantomchat.app',
  'https://phantomchat-bice.vercel.app',
];

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const roomMatch = pathname.match(/^\/room\/([^/]+)$/);

  if (!roomMatch) return NextResponse.redirect(new URL('/create', request.url));

  const roomId = roomMatch[1];

  const meta = await redis.hgetall<{ connected: string[]; createdAt: number }>(
    `meta:${roomId}`
  );

  if (!meta) {
    return NextResponse.redirect(
      new URL('/create?error=room-not-found', request.url)
    );
  }

  const existingToken = request.cookies.get('x-auth-token')?.value;

  //USER IS ALLOWED TO JOINT ROOM
  // User already has valid token - let them in
  if (existingToken && meta.connected.includes(existingToken)) {
    const response = NextResponse.next();
    appendSecurityHeaders(response.headers, request.headers.get('origin'));
    return response;
  }

  //USER IS NOT ALLOWED TO JOINT ROOM OR ROOM FULL
  // New user but room is full - reject
  if (!existingToken && meta.connected.length >= 2) {
    return NextResponse.redirect(new URL('/create?error=room-full', request.url));
  }

  //IF NO COOKIE AND ROOM NOT FULL
  // New user and room has space - create token and add to room
  const response = NextResponse.next();

  const token = nanoid();

  response.cookies.set('x-auth-token', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  await redis.hset(`meta:${roomId}`, { connected: [...meta.connected, token] });

  appendSecurityHeaders(response.headers, request.headers.get('origin'));

  return response;
}

function appendCorsHeaders(headers: Headers, origin: string | null) {
  if (origin && allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Content-Type, Content-Length, Accept, Accept-Version, Date, X-Api-Version'
    );
  }
}

function appendCspHeaders(headers: Headers) {
  // Upstash Realtime URLs
  const upstashRealtimeUrl = process.env.UPSTASH_REALTIME_URL || '';
  const upstashRedisUrl = process.env.UPSTASH_REDIS_REST_URL || '';

  // Extract hostnames for CSP
  const realtimeHost = upstashRealtimeUrl
    ? new URL(upstashRealtimeUrl).hostname
    : '*.upstash.io';
  const redisHost = upstashRedisUrl
    ? new URL(upstashRedisUrl).hostname
    : '*.upstash.io';

  const policy = isDevelopment
    ? `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data:;
      font-src 'self' data:;
      connect-src 'self' ws: wss: https://*.upstash.io;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `
    : `
      default-src 'self';
      script-src 'self' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data:;
      font-src 'self' data:;
      connect-src 'self' https://phantomchat.app https://www.phantomchat.app https://phantomchat-bice.vercel.app https://${realtimeHost} https://${redisHost} wss://${realtimeHost};
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `;

  headers.set('Content-Security-Policy', policy.replace(/\s{2,}/g, ' ').trim());
}

function appendSecurityHeaders(headers: Headers, origin: string | null) {
  appendCorsHeaders(headers, origin);
  appendCspHeaders(headers);

  // Additional security headers
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  if (!isDevelopment) {
    headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: '/room/:path*',
};
