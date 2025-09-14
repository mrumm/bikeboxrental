import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');

  if (sessionCookie?.value === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  } else {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}