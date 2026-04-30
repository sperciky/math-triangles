'use client';

import Link from 'next/link';
import { useProgress } from './hooks/useProgress';

const LEVELS = [
  {
    id: 1,
    title: 'Goniometrické funkce',
    desc: 'Definice, jednotková kružnice, tabulka hodnot, pythagorova identita, kvadranty.',
    icon: '📈',
    topics: ['sin, cos, tg — definice', 'Jednotková kružnice', 'Přesné hodnoty', 'Redukční vzorce'],
  },
  {
    id: 2,
    title: 'Pravoúhlý trojúhelník',
    desc: 'Výpočty stran a úhlů pomocí goniometrických funkcí. Pythagorova věta.',
    icon: '📐',
    topics: ['sin α = a/c, cos α = b/c', 'tg α = a/b', 'Pythagorova věta', 'Praktické úlohy'],
  },
  {
    id: 3,
    title: 'Sinová věta',
    desc: 'Obecný trojúhelník — sinová věta, derivace, případ nejednoznačnosti (SSA).',
    icon: '△',
    topics: ['a/sin α = b/sin β = c/sin γ = 2R', 'Odvození věty', 'Případ SSA — dvě řešení', 'Aplikace'],
  },
  {
    id: 4,
    title: 'Kosinová věta',
    desc: 'Obecný trojúhelník — kosinová věta. Zobecnění Pythagorovy věty.',
    icon: '⊿',
    topics: ['c² = a² + b² − 2ab·cos γ', 'Odvození z Pythagorovy věty', 'Výpočet úhlů (SSS)', 'Aplikace'],
  },
  {
    id: 5,
    title: 'Kombinované úlohy',
    desc: 'Slovní úlohy kombinující sinovou i kosinovou větu. Reálné situace.',
    icon: '🌍',
    topics: ['Turisté a vzdálenosti', 'Výška kopce, rozhledna', 'Zorný úhel', 'Tečny a kružnice'],
  },
];

export default function HomePage() {
  const { progress, isLevelUnlocked, levelsCompleted, totalLevels, loaded } = useProgress();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Trigonometrie — gymnázium 2. ročník</h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          Interaktivní příprava na písemnou práci. Projděte si teorii, procvičujte a nakonec změřte síly v závěrečném testu.
        </p>
        {loaded && (
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 max-w-xs h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${Math.round((levelsCompleted / totalLevels) * 100)}%` }}
              />
            </div>
            <span className="text-sm text-slate-500">{levelsCompleted} / {totalLevels} lekcí</span>
          </div>
        )}
      </div>

      {/* Level cards */}
      <div className="space-y-4">
        {LEVELS.map((level) => {
          const unlocked = isLevelUnlocked(level.id);
          const lp = progress.levels[level.id];
          const completed = lp?.completed ?? false;

          return (
            <div
              key={level.id}
              className={`border rounded-xl p-5 transition-all ${
                completed
                  ? 'border-emerald-300 bg-emerald-50'
                  : unlocked
                  ? 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
                  : 'border-slate-200 bg-slate-50 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl shrink-0 mt-0.5">{level.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lekce {level.id}</span>
                    {completed && <span className="text-xs bg-emerald-200 text-emerald-800 rounded-full px-2 py-0.5 font-semibold">✓ Dokončeno · {lp.score}/{lp.maxScore} b.</span>}
                    {!unlocked && <span className="text-xs text-slate-400">🔒 Odemkněte předchozí lekci</span>}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mb-1">{level.title}</h2>
                  <p className="text-sm text-slate-600 mb-3">{level.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {level.topics.map((t) => (
                      <span key={t} className="text-xs bg-slate-100 text-slate-600 rounded px-2 py-0.5 font-mono">{t}</span>
                    ))}
                  </div>
                  {unlocked && (
                    <Link
                      href={`/level/${level.id}`}
                      className={`inline-block px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        completed
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {completed ? 'Zopakovat lekci →' : 'Začít lekci →'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Final test card */}
      <div className={`mt-6 border-2 rounded-xl p-5 ${
        progress.finalTestCompleted
          ? 'border-amber-400 bg-amber-50'
          : isLevelUnlocked(6) || Object.values(progress.levels).every(l => l.completed)
          ? 'border-amber-300 bg-amber-50'
          : 'border-slate-200 bg-slate-50 opacity-60'
      }`}>
        <div className="flex items-start gap-4">
          <div className="text-3xl">🏆</div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Závěrečný test</h2>
            <p className="text-sm text-slate-600 mb-3">
              8 úloh z celého učiva — sinová věta, kosinová věta, slovní úlohy. Po odevzdání zobrazí detailní řešení.
            </p>
            {progress.finalTestCompleted && (
              <div className="mb-3 text-sm font-semibold text-amber-700">
                Nejlepší výsledek: {progress.finalTestScore} / {progress.finalTestMaxScore} bodů
              </div>
            )}
            <Link
              href="/test"
              className="inline-block px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              {progress.finalTestCompleted ? 'Zkusit znovu →' : 'Spustit test →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
