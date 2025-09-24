// app/admin/page.tsx
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

  const { data: me, error: meErr } = await userDb
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (meErr || me?.role !== 'admin') redirect('/');

  // 2) Datos admin (service role)
  const adminDb = createAdminClient();

  // KPI usuarios
  const { count: usersCount } = await adminDb
    .from('users')
    .select('*', { head: true, count: 'exact' });

  // KPI suscripciones activas
  const { count: activeSubs } = await adminDb
    .from('subscriptions')
    .select('*', { head: true, count: 'exact' })
    .eq('status', 'active');

  // KPI MRR
  const [{ data: activeRows }, { data: priceRows }] = await Promise.all([
    adminDb.from('subscriptions').select('user_id, price_id, quantity, status, current_period_end').eq('status','active'),
    adminDb.from('prices').select('id, unit_amount, nickname'),
  ]);
  const unitByPrice = new Map((priceRows ?? []).map(p => [p.id, p.unit_amount ?? 0]));
  const nickByPrice = new Map((priceRows ?? []).map(p => [p.id, p.nickname ?? p.id]));
  const mrrCents = (activeRows ?? []).reduce((acc, s) => acc + (s.quantity ?? 1) * (unitByPrice.get(s.price_id!) ?? 0), 0);

  // Suscripciones (últimas 25)
  const { data: subs } = await adminDb
    .from('subscriptions')
    .select('user_id, price_id, status, current_period_end, quantity')
    .order('current_period_end', { ascending: false })
    .limit(25);

  // Emails vía Admin API
  const ids = Array.from(new Set((subs ?? []).map(s => s.user_id).filter(Boolean)));
  const emails = new Map<string, string>();
  if (ids.length) {
    const { data: usersPage } = await adminDb.auth.admin.listUsers({ page: 1, perPage: 100 });
    for (const u of usersPage.users) {
      if (ids.includes(u.id)) emails.set(u.id, u.email ?? u.id);
    }
  }

  // Usuarios recientes vía Admin API (+ map a role en public.users)
  const recentUsersRes = await adminDb.auth.admin.listUsers({ page: 1, perPage: 25 });
  const recentUsers = recentUsersRes.data?.users ?? [];
  const idsRecent = recentUsers.map(u => u.id);
  const { data: roleRows } = await adminDb.from('users').select('id, role').in('id', idsRecent);
  const roleById = new Map((roleRows ?? []).map(r => [r.id, r.role ?? 'user']));

  return (
    <main className="space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">Solo lectura</span>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CardKPI title="Usuarios" value={usersCount ?? 0} />
        <CardKPI title="Suscripciones activas" value={activeSubs ?? 0} />
        <CardKPI title="MRR (USD)" value={money(mrrCents)} />
      </section>

      {/* Acciones de autenticación */}
      <AdminAuthActions />

      {/* Tablas */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsersTable rows={recentUsers.map(u => ({
          email: u.email ?? '—',
          role: roleById.get(u.id) ?? 'user',
          created_at: u.created_at ?? null, // CORREGIDO: Solo usa created_at
        }))} />
        <SubsTable rows={(subs ?? []).map(s => ({
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