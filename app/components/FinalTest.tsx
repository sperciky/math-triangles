'use client';

import { useState, useMemo } from 'react';
import { TEST_PROBLEMS } from '../data/testProblems';
import { useProgress } from '../hooks/useProgress';
import SolutionDisplay from './SolutionDisplay';

type Answers = Record<string, string>;
type Results = Record<string, { correct: boolean; earned: number; userVal: number | null }>;

export default function FinalTest() {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Results>({});
  const { completeTest } = useProgress();

  const maxScore = useMemo(() => TEST_PROBLEMS.reduce((s, p) => s + p.points, 0), []);

  const handleInput = (id: string, val: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const handleSubmit = () => {
    const res: Results = {};
    let total = 0;
    for (const p of TEST_PROBLEMS) {
      const raw = answers[p.id] ?? '';
      const val = parseFloat(raw.replace(',', '.'));
      const correct = !isNaN(val) && Math.abs(val - (p.correctAnswer as number)) <= (p.tolerance ?? 0.1);
      const earned = correct ? p.points : 0;
      total += earned;
      res[p.id] = { correct, earned, userVal: isNaN(val) ? null : val };
    }
    setResults(res);
    setSubmitted(true);
    completeTest(total, maxScore);
  };

  const totalEarned = Object.values(results).reduce((s, r) => s + r.earned, 0);
  const pct = Math.round((totalEarned / maxScore) * 100);

  return (
    <div>
      {submitted && (
        <div className={`mb-6 p-5 rounded-xl border text-center ${
          pct >= 75 ? 'bg-emerald-50 border-emerald-300' :
          pct >= 50 ? 'bg-amber-50 border-amber-300' :
                      'bg-red-50 border-red-300'
        }`}>
          <div className="text-3xl mb-1">{pct >= 75 ? '🏆' : pct >= 50 ? '📚' : '💪'}</div>
          <div className="text-2xl font-bold text-slate-800">{totalEarned} / {maxScore} bodů</div>
          <div className="text-sm text-slate-600 mt-1">
            {pct >= 75 ? 'Výborný výsledek — jste připraveni na písemku!'
            : pct >= 50 ? 'Dobrý základ, zopakujte si slabší části.'
            : 'Doporučujeme projít teorii znovu.'}
          </div>
          <div className="mt-3 h-3 bg-slate-200 rounded-full overflow-hidden mx-auto max-w-xs">
            <div
              className={`h-full rounded-full transition-all ${pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-5">
        {TEST_PROBLEMS.map((p, i) => {
          const res = results[p.id];
          return (
            <div
              key={p.id}
              className={`border rounded-xl p-5 ${
                !submitted ? 'border-slate-200 bg-white' :
                res?.correct ? 'border-emerald-300 bg-emerald-50' :
                               'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-slate-900 font-medium leading-snug">{p.question}</p>
                  {p.hint && submitted && !res?.correct && (
                    <p className="text-amber-700 text-sm mt-1">💡 {p.hint}</p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-slate-400 font-mono">{p.points} b.</span>
              </div>

              <div className="flex gap-2 items-center mb-2">
                <input
                  type="text"
                  value={answers[p.id] ?? ''}
                  onChange={(e) => handleInput(p.id, e.target.value)}
                  disabled={submitted}
                  placeholder="Vaše odpověď…"
                  className={`flex-1 border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    submitted
                      ? res?.correct
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                        : 'border-red-300 bg-red-50 text-red-700'
                      : 'border-slate-300'
                  }`}
                />
                {submitted && (
                  <span className={`shrink-0 font-semibold text-sm ${res?.correct ? 'text-emerald-700' : 'text-red-600'}`}>
                    {res?.correct ? `✓ +${res.earned} b.` : `✗ 0 b.`}
                  </span>
                )}
              </div>

              {submitted && !res?.correct && (
                <p className="text-xs text-slate-500 mb-2">
                  Správná odpověď: <strong className="font-mono text-slate-700">{p.correctAnswer}</strong>
                  {res?.userVal !== null && res?.userVal !== undefined && (
                    <> · Vaše odpověď: <span className="font-mono text-red-600">{res.userVal}</span></>
                  )}
                </p>
              )}

              {submitted && (
                <SolutionDisplay steps={p.solution} points={p.points} earnedPoints={res?.earned} />
              )}
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-colors shadow"
          >
            Odevzdat test →
          </button>
        </div>
      ) : (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => { setSubmitted(false); setAnswers({}); setResults({}); }}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors"
          >
            Zkusit znovu
          </button>
        </div>
      )}
    </div>
  );
}
