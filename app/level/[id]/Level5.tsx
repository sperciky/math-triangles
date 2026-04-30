'use client';

import TheoryBlock from '../../components/TheoryBlock';
import Formula from '../../components/Formula';
import LevelPractice from '../../components/LevelPractice';

export default function Level5() {
  return (
    <div className="space-y-2">
      <TheoryBlock title="Strategie řešení slovních úloh" defaultOpen>
        <p className="mb-3">Při řešení geometrické slovní úlohy postupujte systematicky:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
          <li>Nakreslete <strong>náčrt</strong> a označte všechny dané a hledané veličiny.</li>
          <li>Identifikujte trojúhelníky v úloze.</li>
          <li>Rozhodněte, jaká věta je použitelná (sinová / kosinová / pravoúhlý trojúhelník).</li>
          <li>Sestavte rovnici / soustavu a vyřešte.</li>
          <li>Ověřte fyzikální smysl výsledku (kladné délky, součet úhlů 180°).</li>
        </ol>
      </TheoryBlock>

      <TheoryBlock title="Volba metody — přehled" variant="default">
        <div className="overflow-x-auto">
          <table className="text-sm w-full border-collapse">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="px-3 py-2 text-left border border-slate-600">Dáno</th>
                <th className="px-3 py-2 text-left border border-slate-600">Metoda</th>
                <th className="px-3 py-2 text-left border border-slate-600">Věta</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Pravý úhel + 2 prvky', 'Přímý výpočet', 'sin/cos/tg + Pythagoras'],
                ['ASA nebo AAS', 'Sinová věta', 'a/sinα = b/sinβ'],
                ['SAS', 'Kosinová věta', 'c² = a²+b²−2ab cosγ'],
                ['SSS', 'Kosinová věta', 'cosγ = (a²+b²−c²)/2ab'],
                ['SSA', 'Sinová věta ⚠️', 'Kontrola počtu řešení!'],
              ].map(([given, method, theorem], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="border border-slate-200 px-3 py-2 font-mono text-xs">{given}</td>
                  <td className="border border-slate-200 px-3 py-2 font-semibold text-sm">{method}</td>
                  <td className="border border-slate-200 px-3 py-2 text-blue-700 text-xs font-mono">{theorem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TheoryBlock>

      <TheoryBlock title="Příklad: Turisté a vzdálenost" variant="example">
        <p className="mb-2 font-semibold">
          Zadání: Dva turisté vyrazí ze stejného bodu. Cesty svírají úhel 60°. Po 1 hodině urazí první 5 km, druhý 7 km. Jaká je jejich vzdušná vzdálenost?
        </p>
        <Formula>{`Označení: d₁ = 5 km, d₂ = 7 km, γ = 60°

Kosinová věta:
d² = d₁² + d₂² − 2·d₁·d₂·cos γ
   = 25 + 49 − 2·5·7·cos(60°)
   = 74 − 70·0,5
   = 74 − 35 = 39

d = √39 ≈ 6,24 km`}</Formula>
      </TheoryBlock>

      <TheoryBlock title="Příklad: Výška rozhledny" variant="example">
        <p className="mb-2 font-semibold">
          Zadání: Rozhledna výšky h stojí na kopci. Z bodu v údolí vidíme patu pod úhlem α = 30° a vrchol pod úhlem β = 45°. Výška rozhledny je 20 m. Jak vysoký je kopec?
        </p>
        <Formula>{`Označení: h = výška kopce, d = vodorovná vzdálenost

tg(30°) = h/d      ⟹  d = h/tg(30°) = h√3
tg(45°) = (h+20)/d ⟹  d = (h+20)/tg(45°) = h+20

Rovnice:  h√3 = h + 20
          h(√3 − 1) = 20
          h = 20/(√3 − 1) = 20(√3+1)/2 = 10(√3+1) ≈ 27,3 m`}</Formula>
      </TheoryBlock>

      <TheoryBlock title="Příklad: Zorný úhel" variant="example">
        <p className="mb-2 font-semibold">
          Zadání: Obraz šířky 3 m visí na stěně. Pozorovatel stojí tak, že je od levého okraje 4 m a od pravého 5 m. Pod jakým úhlem obraz vidí?
        </p>
        <Formula>{`Trojúhelník se stranami 3, 4, 5. Zorný úhel φ leží naproti straně 3.

cos φ = (4² + 5² − 3²) / (2·4·5)
      = (16 + 25 − 9) / 40
      = 32/40 = 0,8

φ = arccos(0,8) ≈ 36,9°`}</Formula>
      </TheoryBlock>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <LevelPractice levelId={5} />
      </div>
    </div>
  );
}
