'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface DualGlowProps { className?: string }

export default function DualGlow({ className }: DualGlowProps) {
  const { theme, systemTheme } = useTheme();
  const mode = theme === 'system' ? systemTheme : theme;
  const isDark = mode === 'dark';

  return (
    <div className={cn('pointer-events-none absolute inset-0 -z-10', className)}>
      <div
        className={cn(
          'absolute -top-1/3 left-1/2 -translate-x-1/2',
          'h-[80vh] w-[80vh] rounded-full blur-[60px]',
          isDark ? 'opacity-70' : 'opacity-50'
        )}
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.0) 60%)'
            : 'radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.0) 60%)',
        }}
      />
      <div
        className={cn(
          'absolute -bottom-1/4 -right-1/6',
          'h-[60vh] w-[60vh] rounded-full blur-[70px]',
          isDark ? 'opacity-40' : 'opacity-30'
        )}
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.0) 60%)'
            : 'radial-gradient(ellipse at center, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.0) 60%)',
        }}
      />
      <div
        className={cn('absolute inset-0 mix-blend-overlay', isDark ? 'opacity-[0.06]' : 'opacity-[0.05]')}
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          color: isDark ? '#FFFFFF' : '#000000',
        }}
      />
    </div>
  );
}
