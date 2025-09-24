// app/admin/page.tsx
export const dynamic = 'force-dynamic';
import 'server-only';
import { redirect } from 'next/navigation';
import { createUserClient } from '@/utils/supabase/server-user';
import { createAdminClient } from '@/utils/supabase/server-admin';
import AdminAuthActions from '@/components/admin/AdminAuthActions';

function money(cents: number) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export default async function AdminPage() {
  // 1) Sesión + permiso
  const userDb = createUserClient();
  const { data: { user } } = await userDb.auth.getUser();
  if (!user) redirect('/signin');

  const { data: me } = await userDb
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  // ✅ acepta 'admin' o 'manager' (dejaste manager en la DB)
  const role = me?.role ?? '';
  if (!['admin', 'manager'].includes(role)) redirect('/');

  // 2) Datos admin (service role)
  const adminDb = createAdminClient();

  // KPI usuarios (public.users)
  let usersCount = 0;
  {
    const { count } = await adminDb
      .from('users')
      .select('*', { head: true, count: 'exact' });
    usersCount = count ?? 0;
  }

  // KPI suscripciones activas (si no tienes estas tablas, no romper)
  let activeSubs = 0;
  try {
    const { count } = await adminDb
      .from('subscriptions')
      .select('*', { head: true, count: 'exact' })
      .eq('status', 'active');
    activeSubs = count ?? 0;
  } catch {
    activeSubs = 0;
  }

  // KPI MRR (suma de unit_amount * quantity de subs activas)
  let mrrCents = 0;
  let unitByPrice = new Map<string, number>();
  let nickByPrice = new Map<string, string>();
  try {
    const [{ data: activeRows }, { data: priceRows }] = await Promise.all([
      adminDb.from('subscriptions').select('user_id, price_id, quantity, status, current_period_end').eq('status','active'),
      adminDb.from('prices').select('id, unit_amount, nickname'),
    ]);
    unitByPrice = new Map((priceRows ?? []).map((p: any) => [p.id, p.unit_amount ?? 0]));
    nickByPrice = new Map((priceRows ?? []).map((p: any) => [p.id, p.nickname ?? p.id]));
    mrrCents = (activeRows ?? []).reduce((acc: number, s: any) => {
      const unit = unitByPrice.get(s.price_id!) ?? 0;
      const qty = s.quantity ?? 1;
      return acc + unit * qty;
    }, 0);
  } catch {
    mrrCents = 0;
  }

  // Suscripciones (últimas 25)
  let subs: Array<{ user_id: string; price_id: string; status: string; current_period_end: number | null; quantity: number | null }> = [];
  try {
    const { data } = await adminDb
      .from('subscriptions')
      .select('user_id, price_id, status, current_period_end, quantity')
      .order('current_period_end', { ascending: false })
      .limit(25);
    subs = data ?? [];
  } catch {
    subs = [];
  }

  // Emails vía Admin API (seguro contra null)
  const ids = Array.from(new Set((subs ?? []).map(s => s.user_id).filter(Boolean) as string[]));
  const emails = new Map<string, string>();
  if (ids.length) {
    const { data } = await adminDb.auth.admin.listUsers({ page: 1, perPage: 100 });
    const usersList = (data as any)?.users ?? [];
    for (const u of usersList) {
      if (ids.includes(u.id)) emails.set(u.id, u.email ?? u.id);
    }
  }

  // Usuarios recientes vía Admin API (+ map a role en public.users)
  const { data: ru } = await adminDb.auth.admin.listUsers({ page: 1, perPage: 25 });
  const recentUsers = (ru as any)?.users ?? [];
  const idsRecent = recentUsers.map((u: any) => u.id);
  const { data: roleRows } = await adminDb.from('users').select('id, role').in('id', idsRecent);
  const roleById = new Map((roleRows ?? []).map((r: any) => [r.id, r.role ?? 'user']));

  return (
    <main className="space-y-8 px-4 py-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">Solo lectura</span>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CardKPI title="Usuarios" value={usersCount} />
        <CardKPI title="Suscripciones activas" value={activeSubs} />
        <CardKPI title="MRR (USD)" value={money(mrrCents)} />
      </section>

      {/* Acciones de autenticación (comenta esta línea si no tienes el componente) */}
      <AdminAuthActions />

      {/* Tablas */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsersTable rows={recentUsers.map((u: any) => ({
          email: u.email ?? '—',
          role: roleById.get(u.id) ?? 'user',
          created_at: u.created_at ?? null, // ✅ sin u.createdAt
        }))} />
        <SubsTable rows={(subs ?? []).map((s: any) => ({
          email: emails.get(s.user_id!) ?? s.user_id,
          plan: nickByPrice.get(s.price_id!) ?? s.price_id,
          status: s.status,
          renewsAt: s.current_period_end ? new Date(s.current_period_end * 1000) : null,
          amount: (unitByPrice.get(s.price_id!) ?? 0) * (s.quantity ?? 1),
        }))} />
      </section>
    </main>
  );
}

function CardKPI({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/70 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{title}</div>
      <div className="text-3xl font-semibold mt-2">{value}</div>
    </div>
  );
}

function UsersTable({ rows }: { rows: { email: string; role: string; created_at: string | null }[] }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/70 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Usuarios recientes</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500 dark:text-neutral-400">
              <th className="py-2">Email</th>
              <th className="py-2">Rol</th>
              <th className="py-2">Creado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="py-2">{r.email}</td>
                <td className="py-2">
                  <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {r.role}
                  </span>
                </td>
                <td className="py-2">{r.created_at ? new Date(r.created_at).toISOString().slice(0,10) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubsTable({ rows }: { rows: { email: string; plan: string; status: string; renewsAt: Date | null; amount: number }[] }) {
  const badge = (status: string) => {
    const base = 'px-2 py-1 rounded-lg text-xs';
    if (status === 'active') return <span className={`${base} bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300`}>active</span>;
    if (status === 'past_due') return <span className={`${base} bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300`}>past_due</span>;
    if (status === 'canceled') return <span className={`${base} bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300`}>canceled</span>;
    return <span className={`${base} bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300`}>{status}</span>;
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/70 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Suscripciones</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500 dark:text-neutral-400">
              <th className="py-2">Email</th>
              <th className="py-2">Plan</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Renueva</th>
              <th className="py-2">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="py-2">{r.email}</td>
                <td className="py-2">{r.plan}</td>
                <td className="py-2">{badge(r.status)}</td>
                <td className="py-2">{r.renewsAt ? r.renewsAt.toISOString().slice(0,10) : '—'}</td>
                <td className="py-2">{money(r.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
