// app/auth/callback/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // ✅ Elimina la importación de 'cookies'

const ADMIN_PANEL_PATH = '/admin';
const USER_PANEL_PATH = '/dashboard/account';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get('code');

  // ✅ CORRECTO: createClient() sin parámetros
  const supabase = createClient();

  // 1) Magic link / recovery: exchange code -> session
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('[auth/callback] exchange error:', error.message);
      return NextResponse.redirect(new URL('/signin', origin));
    }
  }

  // 2) Current user (from server-side cookies)
  const { data: { user }, error: uErr } = await supabase.auth.getUser();
  if (uErr) console.warn('[auth/callback] getUser error:', uErr.message);
  if (!user) return NextResponse.redirect(new URL('/signin', origin));

  // 3) Role from public.users (accept admin OR manager)
  const { data: me, error: rErr } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  if (rErr) console.warn('[auth/callback] role query error:', rErr.message);

  const role = (me as any)?.role ?? 'user';
  const dest = (role === 'admin' || role === 'manager')
    ? ADMIN_PANEL_PATH
    : USER_PANEL_PATH;

  // 4) Clean redirect (no status query params)
  return NextResponse.redirect(new URL(dest, origin));
}