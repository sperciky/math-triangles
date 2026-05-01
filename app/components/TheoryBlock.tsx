'use client';

import { useState, ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  variant?: 'default' | 'derivation' | 'example' | 'warning';
}

const VARIANT_STYLES: Record<string, string> = {
  default: 'border-slate-300 bg-slate-50',
  derivation: 'border-blue-300 bg-blue-50',
  example: 'border-emerald-300 bg-emerald-50',
  warning: 'border-amber-300 bg-amber-50',
};

const VARIANT_HEADER: Record<string, string> = {
  default: 'bg-slate-100 text-slate-800',
  derivation: 'bg-blue-100 text-blue-900',
  example: 'bg-emerald-100 text-emerald-900',
  warning: 'bg-amber-100 text-amber-900',
};

const VARIANT_ICON: Record<string, string> = {
  default: '📖',
  derivation: '∫',
  example: '✏️',
  warning: '⚠️',
};

export default function TheoryBlock({ title, children, defaultOpen = false, variant = 'default' }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`border rounded-lg mb-4 overflow-hidden ${VARIANT_STYLES[variant]}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 font-semibold text-left select-none ${VARIANT_HEADER[variant]}`}
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">{VARIANT_ICON[variant]}</span>
          <span>{title}</span>
        </span>
        <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && <div className="px-5 py-4 text-slate-800 leading-relaxed">{children}</div>}
    </div>
  );
}
