import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, blockedDates } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function isAuthenticated() {
  const sessionCookie = cookies().get('admin_session');
  return sessionCookie?.value === 'authenticated';
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  await db.delete(blockedDates).where(eq(blockedDates.id, id));

  return NextResponse.json({ success: true });
}
