'use client';

import { useState } from 'react';

export default function AdminAuthActions() {
  const [email, setEmail] = useState('');
  const [redirectTo, setRedirectTo] = useState('https://www.autoflexeasy.com/auth/callback');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  // Parser robusto: intenta JSON; si falla, devuelve el texto crudo.
  async function safeParse(res: Response) {
    const text = await res.text();
    try {
      return { data: text ? JSON.parse(text) : null, raw: text };
    } catch {
      return { data: null, raw: text };
    }
  }

  async function call(path: string) {
    setMsg(null);
    setLoading(path);

    try {
      const body = { email: email.trim(), redirectTo: redirectTo.trim() };

      const res = await fetch(path, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });

      const { data, raw } = await safeParse(res);
      // Log de depuración (Vas a verlo en la consola del navegador)
      console.log('[AdminAuthActions]', { path, status: res.status, data, raw });

      if (!res.ok) {
        const serverMsg =
          data?.error || data?.message || raw || res.statusText || 'Error desconocido';
        throw new Error(serverMsg);
      }

      setMsg('Hecho ✅');
    } catch (e: any) {
      setMsg(`Error: ${e?.message || 'falló la solicitud'}`);
    } finally {
      setLoading(null);
    }
  }

  const Btn = ({ path, label }: { path: string; label: string }) => (
    <button
      onClick={() => call(path)}
      className="px-3 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800 disabled:opacity-50"
      disabled={!email.trim() || !!loading}
    >
      {loading === path ? 'Enviando…' : label}
    </button>
  );

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/70 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <h3 className="text-base font-semibold mb-3">Acciones de autenticación</h3>

      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className="px-3 py-2 text-sm border rounded-xl bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
          placeholder="email@dominio.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="px-3 py-2 text-sm border rounded-xl bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
          placeholder="Redirect URL"
          value={redirectTo}
          onChange={e => setRedirectTo(e.target.value)}
        />
      </div>

      <div className="flex gap-2 flex-wrap mt-3">
        <Btn path="/server/api/admin/auth/invite" label="Invitar" />
        <Btn path="/server/api/admin/auth/magic-link" label="Magic Link" />
        <Btn path="/server/api/admin/auth/recovery" label="Recuperar clave" />
      </div>

      {msg && <div className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">{msg}</div>}
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
        Asegurá la Redirect URL en Supabase → Auth → URL Configuration.
      </p>
    </div>
  );
}
