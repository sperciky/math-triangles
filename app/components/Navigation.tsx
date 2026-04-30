'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgress } from '../hooks/useProgress';

const LEVELS = [
  { id: 1, title: 'Goniometrické funkce', short: 'sin, cos, tg' },
  { id: 2, title: 'Pravoúhlý trojúhelník', short: 'Pyth. věta, definice' },
  { id: 3, title: 'Sinová věta', short: 'Obecný trojúhelník I' },
  { id: 4, title: 'Kosinová věta', short: 'Obecný trojúhelník II' },
  { id: 5, title: 'Kombinované úlohy', short: 'Slovní úlohy' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { progress, isLevelUnlocked, isTestUnlocked, levelsCompleted, totalLevels } = useProgress();

  const pct = Math.round((levelsCompleted / totalLevels) * 100);

  return (
    <nav className="w-64 shrink-0 bg-slate-900 text-white min-h-screen flex flex-col p-4 gap-1">
      <Link href="/" className="mb-4 block">
        <h1 className="text-lg font-bold text-white leading-tight">📐 Trojúhelníky</h1>
        <p className="text-xs text-slate-400">Gymnázium — interaktivní výuka</p>
      </Link>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Celkový postup</span>
          <span>{levelsCompleted}/{totalLevels} lekcí</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 px-1">Lekce</div>

      {LEVELS.map((level) => {
        const unlocked = isLevelUnlocked(level.id);
        const lp = progress.levels[level.id];
        const completed = lp?.completed ?? false;
        const active = pathname === `/level/${level.id}`;

        return (
          <Link
            key={level.id}
            href={unlocked ? `/level/${level.id}` : '#'}
            aria-disabled={!unlocked}
            className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active
                ? 'bg-blue-600 text-white'
                : unlocked
                ? 'text-slate-200 hover:bg-slate-700'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <span className="shrink-0 mt-0.5">
              {completed ? '✅' : unlocked ? '🔓' : '🔒'}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-medium truncate">{level.id}. {level.title}</span>
              <span className="block text-xs opacity-70 truncate">{level.short}</span>
            </span>
            {completed && lp && (
              <span className="shrink-0 text-xs text-emerald-400 font-mono mt-0.5">
                {lp.score}/{lp.maxScore}
              </span>
            )}
          </Link>
        );
      })}

      <div className="mt-2 text-xs text-slate-500 uppercase tracking-wider mb-1 px-1">Test</div>

      <Link
        href={isTestUnlocked() ? '/test' : '#'}
        aria-disabled={!isTestUnlocked()}
        className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
          pathname === '/test'
            ? 'bg-amber-500 text-white'
            : isTestUnlocked()
            ? 'text-slate-200 hover:bg-slate-700'
            : 'text-slate-600 cursor-not-allowed'
        }`}
      >
        <span>{progress.finalTestCompleted ? '🏆' : isTestUnlocked() ? '📝' : '🔒'}</span>
        <span>
          <span className="block font-medium">Závěrečný test</span>
          {progress.finalTestCompleted && (
            <span className="text-xs text-amber-300">{progress.finalTestScore}/{progress.finalTestMaxScore} b.</span>
          )}
        </span>
      </Link>

      <div className="mt-auto pt-4 border-t border-slate-700 text-xs text-slate-500 text-center">
        Gymnázium · 2. ročník · Trigonometrie
      </div>
    </nav>
  );
}
