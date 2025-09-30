'use client';

import { cn } from '@/lib/utils';

export default function CubesBg({ className = '' }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 -z-10', className)}
      style={{
        // mismo color base y mismas 6 capas de linear-gradient
        backgroundColor: '#0a0a0a',
        backgroundImage: `
          linear-gradient(30deg, #1a1a1a 12%, transparent 12.5%, transparent 87%, #1a1a1a 87.5%, #1a1a1a),
          linear-gradient(150deg, #1a1a1a 12%, transparent 12.5%, transparent 87%, #1a1a1a 87.5%, #1a1a1a),
          linear-gradient(30deg, #1a1a1a 12%, transparent 12.5%, transparent 87%, #1a1a1a 87.5%, #1a1a1a),
          linear-gradient(150deg, #1a1a1a 12%, transparent 12.5%, transparent 87%, #1a1a1a 87.5%, #1a1a1a),
          linear-gradient(60deg, #1a1a1a77 25%, transparent 25.5%, transparent 75%, #1a1a1a77 75%, #1a1a1a77),
          linear-gradient(60deg, #1a1a1a77 25%, transparent 25.5%, transparent 75%, #1a1a1a77 75%, #1a1a1a77)
        `,
        // tamaños y posiciones EXACTOS del HTML
        backgroundSize: '80px 140px',
        backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px',
      }}
    />
  );
}
