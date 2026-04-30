'use client';

import { useState, useMemo } from 'react';
import { PROBLEMS } from '../data/problems';
import PracticeQuestion from './PracticeQuestion';
import { useProgress } from '../hooks/useProgress';

interface Props {
  levelId: number;
}

export default function LevelPractice({ levelId }: Props) {
  const problems = useMemo(() => PROBLEMS.filter((p) => p.level === levelId), [levelId]);
  const maxScore = useMemo(() => problems.reduce((s, p) => s + p.points, 0), [problems]);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);
  const { completeLevel } = useProgress();

  const handleCorrect = (problemId: string, earned: number) => {
    if (answered.has(problemId)) return;
    setAnswered((prev) => new Set([...prev, problemId]));
    setScore((s) => s + earned);
  };

  const handleFinish = () => {
    completeLevel(levelId, score, maxScore);
    setFinished(true);
  };

  const pct = Math.round((answered.size / problems.length) * 100);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Cvičení</h2>
        <div className="text-sm text-slate-500">
          <span className="font-mono text-blue-700 font-semibold">{score}</span> / {maxScore} bodů
        </div>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1">{answered.size} z {problems.length} úloh zodpovězeno</p>
      </div>

      {problems.map((problem, i) => (
        <PracticeQuestion
          key={problem.id}
          problem={problem}
          showIndex={i + 1}
          onCorrect={(earned) => handleCorrect(problem.id, earned)}
        />
      ))}

      {!finished ? (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleFinish}
            disabled={answered.size < problems.length}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {answered.size < problems.length
              ? `Zodpovězte ještě ${problems.length - answered.size} úloh…`
              : 'Dokončit lekci ✓'}
          </button>
        </div>
      ) : (
        <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-center">
          <div className="text-2xl mb-1">🎉</div>
          <div className="font-bold text-emerald-800 text-lg">
            Lekce dokončena! {score} / {maxScore} bodů
          </div>
          <div className="text-sm text-emerald-700 mt-1">
            {score === maxScore ? 'Perfektní výsledek!' : score >= maxScore * 0.7 ? 'Výborně!' : 'Zkuste si zopakovat teorii.'}
          </div>
        </div>
      )}
    </section>
  );
}
