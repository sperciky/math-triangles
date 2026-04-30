'use client';

import { useState } from 'react';
import { SolutionStep } from '../math/types';
import Formula from './Formula';

interface Props {
  steps: SolutionStep[];
  points?: number;
  earnedPoints?: number;
}

export default function SolutionDisplay({ steps, points, earnedPoints }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 border border-blue-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold text-sm text-left transition-colors"
      >
        <span>📐 Postup řešení</span>
        <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="bg-white px-4 py-4 space-y-4">
          {points !== undefined && (
            <div className="text-xs text-slate-500 pb-2 border-b border-slate-100">
              Bodová hodnota: <strong>{points} b.</strong>
              {earnedPoints !== undefined && (
                <> | Získáno: <strong className={earnedPoints === points ? 'text-emerald-600' : 'text-red-600'}>{earnedPoints} b.</strong></>
              )}
            </div>
          )}
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-800 text-sm mb-1">{step.title}</div>
                {step.content && <p className="text-slate-700 text-sm mb-1">{step.content}</p>}
                {step.formula && <Formula>{step.formula}</Formula>}
                {step.result && (
                  <div className="mt-1 inline-block bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-mono px-3 py-1 rounded">
                    ✓ {step.result}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
