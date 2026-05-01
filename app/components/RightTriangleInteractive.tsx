'use client';

import { useState } from 'react';
import TriangleVisualizer, { HighlightEl } from './TriangleVisualizer';
import { Triangle } from '../math/types';

interface FormulaBtn {
  id: string;
  formula: string;
  desc: string;
  hl: HighlightEl[];
}

const FORMULAS: FormulaBtn[] = [
  { id: 'sin-a', formula: 'sin α = a / c', desc: 'protilehlá / přepona',   hl: ['a', 'c', 'alpha'] },
  { id: 'cos-a', formula: 'cos α = b / c', desc: 'přilehlá / přepona',     hl: ['b', 'c', 'alpha'] },
  { id: 'tg-a',  formula: 'tg α  = a / b', desc: 'protilehlá / přilehlá',  hl: ['a', 'b', 'alpha'] },
  { id: 'sin-b', formula: 'sin β = b / c', desc: 'protilehlá / přepona',   hl: ['b', 'c', 'beta']  },
  { id: 'cos-b', formula: 'cos β = a / c', desc: 'přilehlá / přepona',     hl: ['a', 'c', 'beta']  },
  { id: 'tg-b',  formula: 'tg β  = b / a', desc: 'protilehlá / přilehlá',  hl: ['b', 'a', 'beta']  },
  { id: 'kompl', formula: 'α + β = 90°',   desc: 'komplementární úhly',    hl: ['alpha', 'beta']   },
  { id: 'pyth',  formula: 'a² + b² = c²',  desc: 'Pythagorova věta',       hl: ['a', 'b', 'c']     },
];

interface Props {
  triangle: Triangle;
  rightAngleAt?: 'C' | 'A' | 'B';
}

export default function RightTriangleInteractive({ triangle, rightAngleAt }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = FORMULAS.find(f => f.id === activeId);
  const highlight = active?.hl ?? [];

  return (
    <div className="flex flex-col gap-4">

      {/* Full-width triangle diagram */}
      <TriangleVisualizer
        triangle={triangle}
        rightAngleAt={rightAngleAt}
        highlight={highlight}
        width={700}
        height={280}
        fullWidth
      />

      {/* Formula buttons below in 2-column grid */}
      <p className="text-xs text-slate-500">
        Klikněte na vztah — trojúhelník zvýrazní příslušné prvky:
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {FORMULAS.map(f => {
          const on = activeId === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveId(on ? null : f.id)}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all cursor-pointer ${
                on
                  ? 'bg-amber-50 border-amber-400 shadow-sm ring-1 ring-amber-200'
                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span className={`font-mono text-sm font-semibold shrink-0 ${on ? 'text-amber-700' : 'text-slate-800'}`}>
                {f.formula}
              </span>
              <span className={`text-xs hidden sm:block ${on ? 'text-amber-600' : 'text-slate-400'}`}>
                {f.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
