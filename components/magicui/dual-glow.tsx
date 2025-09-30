'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export default function CubeBg({ className = '' }: { className?: string }) {
  const { theme, systemTheme } = useTheme();
  const mode = theme === 'system' ? systemTheme : theme;
  const isDark = mode === 'dark';

  // Colores base para claro/oscuro
  const c1 = isDark ? '#0b0b0b' : '#f6f6f6';
  const c2 = isDark ? '#121212' : '#eaeaea';
  const c3 = isDark ? '#1a1a1a' : '#dcdcdc';

  const size = 40; // tamaño del patrón

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 -z-10', className)}
      style={{
        backgroundColor: c1,
        // patrón de cubos (3 losas en 60°)
        backgroundImage: `
          linear-gradient(30deg, ${c2} 12%, transparent 12.5%, transparent 87%, ${c2} 87.5%, ${c2}),
          linear-gradient(150deg, ${c2} 12%, transparent 12.5%, transparent 87%, ${c2} 87.5%, ${c2}),
          linear-gradient(90deg, ${c3} 12%, transparent 12.5%, transparent 87%, ${c3} 87.5%, ${c3})
        `,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: '0 0, 0 0, 0 0',
      }}
    />
  );
}
