import { nanoid } from 'nanoid';
import { NextResponse, type NextRequest } from 'next/server';
import { redis } from './lib/redis-setup/redis';

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
    return NextResponse.next();
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

  return response;
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: '/room/:path*',
};
