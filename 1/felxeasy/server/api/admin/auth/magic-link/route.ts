export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server-admin';

export async function POST(req: NextRequest) {
  try {
    const { email, redirectTo } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 });

    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo },
    });
    if (error) throw error;

    return NextResponse.json({ ok: true, link: data?.properties?.action_link });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}
