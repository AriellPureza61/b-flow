import React from 'react';

// Logotipo B.Flow — "B." Azul Corporativo + "Flow" em degradê Azul Tech → Verde Crescimento com seta de crescimento
export default function Logo({ size = 'md', showTagline = true, className = '' }) {
  const sizes = {
    sm: { text: 'text-xl', tag: 'text-[9px]', arrow: 14 },
    md: { text: 'text-2xl', tag: 'text-[10px]', arrow: 18 },
    lg: { text: 'text-4xl', tag: 'text-xs', arrow: 26 }
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`leading-none select-none ${className}`}>
      <div className={`flex items-end font-black tracking-tight ${s.text}`}>
        <span className="text-[#0F214A] bflow-logo-b">B.</span>
        <span className="bg-gradient-to-r from-[#00A6D4] via-[#13b5a6] to-[#22C55E] bg-clip-text text-transparent">
          Flow
        </span>
        <svg
          width={s.arrow}
          height={s.arrow}
          viewBox="0 0 24 24"
          fill="none"
          className="-ml-0.5 mb-[0.55em]"
        >
          <path
            d="M3 19 L13 9 M8 7 H15 V14"
            stroke="#22C55E"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {showTagline && (
        <div className={`mt-1 font-semibold text-[#0F214A]/80 bflow-logo-tag ${s.tag}`}>
          Gestão Comercial Simplificada
        </div>
      )}
    </div>
  );
}
