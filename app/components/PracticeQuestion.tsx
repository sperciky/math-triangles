'use client';

import { useState } from 'react';
import { Problem } from '../math/types';
import SolutionDisplay from './SolutionDisplay';
import TriangleVisualizer from './TriangleVisualizer';

interface Props {
  problem: Problem;
  onCorrect?: (points: number) => void;
  showIndex?: number;
}

type State = 'idle' | 'correct' | 'wrong';

export default function PracticeQuestion({ problem, onCorrect, showIndex }: Props) {
  const [selected, setSelected] = useState<string>('');
  const [inputVal, setInputVal] = useState('');
  const [state, setState] = useState<State>('idle');
  const [attempts, setAttempts] = useState(0);

  const checkMC = (choiceId: string) => {
    if (state === 'correct') return;
    setSelected(choiceId);
    const correct = choiceId === problem.correctAnswer;
    setState(correct ? 'correct' : 'wrong');
    setAttempts((a) => a + 1);
    if (correct) onCorrect?.(attempts === 0 ? problem.points : Math.max(1, problem.points - attempts));
  };

  const checkNumerical = () => {
    if (state === 'correct') return;
    const val = parseFloat(inputVal.replace(',', '.'));
    if (isNaN(val)) { setState('wrong'); setAttempts((a) => a + 1); return; }
    const correct = Math.abs(val - (problem.correctAnswer as number)) <= (problem.tolerance ?? 0.01);
    setState(correct ? 'correct' : 'wrong');
    setAttempts((a) => a + 1);
    if (correct) onCorrect?.(attempts === 0 ? problem.points : Math.max(1, problem.points - attempts));
  };

  const retry = () => {
    setState('idle');
    setSelected('');
    setInputVal('');
  };

  return (
    <div className={`border rounded-xl p-5 mb-4 transition-colors ${
      state === 'correct' ? 'border-emerald-300 bg-emerald-50' :
      state === 'wrong'   ? 'border-red-200 bg-red-50' :
                            'border-slate-200 bg-white'
    }`}>
      <div className="flex items-start gap-3 mb-3">
        <span className="shrink-0 w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
          {showIndex ?? '?'}
        </span>
        <div className="flex-1">
          <p className="text-slate-900 font-medium leading-snug">{problem.question}</p>
          {problem.hint && state === 'wrong' && (
            <p className="text-amber-700 text-sm mt-1">💡 Nápověda: {problem.hint}</p>
          )}
        </div>
        <span className="shrink-0 text-xs text-slate-400 font-mono">{problem.points} b.</span>
      </div>

      {/* Triangle diagram */}
      {problem.triangleData && problem.diagramType !== 'none' && (
        <div className="mb-4 flex justify-center">
          <TriangleVisualizer
            triangle={problem.triangleData}
            rightAngleAt={problem.diagramType === 'right' ? 'C' : undefined}
            width={300}
            height={180}
          />
        </div>
      )}

      {/* Multiple choice */}
      {problem.type === 'multiple-choice' && problem.choices && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {problem.choices.map((c) => {
            const isSelected = selected === c.id;
            const isCorrect = c.id === problem.correctAnswer;
            let cls = 'border rounded-lg px-4 py-2.5 text-sm text-left cursor-pointer transition-colors font-mono ';
            if (state === 'idle') {
              cls += isSelected ? 'border-blue-400 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white hover:border-blue-300 text-slate-700';
            } else if (state === 'correct') {
              cls += isCorrect ? 'border-emerald-400 bg-emerald-100 text-emerald-800 font-semibold' : 'border-slate-200 bg-white text-slate-400';
            } else {
              cls += isCorrect ? 'border-emerald-400 bg-emerald-100 text-emerald-800 font-semibold'
                    : isSelected ? 'border-red-400 bg-red-100 text-red-700'
                    : 'border-slate-200 bg-white text-slate-400';
            }
            return (
              <button key={c.id} onClick={() => checkMC(c.id)} disabled={state === 'correct'} className={cls}>
                <span className="font-bold mr-2">{c.id.toUpperCase()})</span>{c.text}
              </button>
            );
          })}
        </div>
      )}

      {/* Numerical input */}
      {problem.type === 'numerical' && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && state === 'idle' && checkNumerical()}
            disabled={state === 'correct'}
            placeholder="Vaše odpověď..."
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-slate-50"
          />
          {state === 'idle' && (
            <button
              onClick={checkNumerical}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Zkontrolovat
            </button>
          )}
        </div>
      )}

      {/* Feedback */}
      {state === 'correct' && (
        <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold mb-2">
          <span>✓</span>
          <span>Správně!{attempts > 1 ? ` (na ${attempts}. pokus)` : ''}</span>
        </div>
      )}
      {state === 'wrong' && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-600 text-sm font-semibold">✗ Nesprávná odpověď.</span>
          <button onClick={retry} className="text-blue-600 text-sm underline hover:no-underline">Zkusit znovu</button>
        </div>
      )}

      <SolutionDisplay
        steps={problem.solution}
        points={problem.points}
        earnedPoints={state === 'correct' ? (attempts === 1 ? problem.points : Math.max(1, problem.points - attempts + 1)) : undefined}
      />
    </div>
  );
}
