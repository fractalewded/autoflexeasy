import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server-admin';

export async function POST(req: Request) {
  try {
    const { email, redirectTo } = await req.json();
    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email requerido' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'invite',
      email,
      options: { redirectTo },
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true, userId: data.user?.id ?? null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Error inesperado' }, { status: 500 });
  }
}
