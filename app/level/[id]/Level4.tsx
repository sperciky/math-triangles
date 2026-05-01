'use client';

import TheoryBlock from '../../components/TheoryBlock';
import Formula from '../../components/Formula';
import LevelPractice from '../../components/LevelPractice';

export default function Level4() {
  return (
    <div className="space-y-2">
      <TheoryBlock title="Kosinová věta — formulace" defaultOpen>
        <p className="mb-3">
          V libovolném trojúhelníku ABC platí:
        </p>
        <Formula label="kosinová věta">{`c² = a² + b² − 2ab · cos γ
a² = b² + c² − 2bc · cos α
b² = a² + c² − 2ac · cos β`}</Formula>
        <p className="text-sm text-slate-600 mt-2">
          Pro γ = 90° dostaneme cos γ = 0, a věta se redukuje na Pythagorovu: c² = a² + b². Kosinová věta je tedy zobecněním Pythagorovy věty.
        </p>
      </TheoryBlock>

      <TheoryBlock title="Odvození kosinové věty" variant="derivation">
        <p className="mb-2">
          Umístíme trojúhelník do souřadnicové soustavy: A = (0, 0), B = (c, 0). Pak C = (b·cos α, b·sin α).
        </p>
        <Formula>{`a² = |BC|² = (b·cos α − c)² + (b·sin α)²
   = b²cos²α − 2bc·cos α + c² + b²sin²α
   = b²(cos²α + sin²α) + c² − 2bc·cos α
   = b² + c² − 2bc·cos α`}</Formula>
        <p className="mt-2 text-sm text-slate-600">
          Odvození je čistě algebraické a platí pro všechny hodnoty α (tedy i tupé úhly — cos je pak záporný, člen −2bc·cos α kladný, výsledná strana delší).
        </p>
      </TheoryBlock>

      <TheoryBlock title="Kdy použít kosinovou větu" variant="example">
        <div className="space-y-2 text-sm">
          {[
            { case: 'SAS', desc: 'Dvě strany a svírající úhel → vypočteme třetí stranu', formula: 'c² = a² + b² − 2ab·cos γ' },
            { case: 'SSS', desc: 'Všechny tři strany → vypočteme libovolný úhel', formula: 'cos γ = (a² + b² − c²) / (2ab)' },
          ].map((r) => (
            <div key={r.case} className="p-3 border border-emerald-200 bg-emerald-50 rounded">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-slate-700">{r.case}</span>
                <span className="text-slate-700">{r.desc}</span>
              </div>
              <code className="text-xs text-blue-700">{r.formula}</code>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Pro případ AAS nebo ASA je výhodnější sinová věta. Pro SSA — viz Level 3 (nejednoznačnost).
        </p>
      </TheoryBlock>

      <TheoryBlock title="Výpočet úhlů ze tří stran (SSS)" variant="example">
        <p className="mb-2 font-semibold">Zadání: a = 5, b = 7, c = 8. Určete všechny úhly.</p>
        <Formula>{`cos α = (b² + c² − a²) / (2bc) = (49 + 64 − 25) / (2·7·8) = 88/112 ≈ 0,7857
α = arccos(0,7857) ≈ 38,2°

cos β = (a² + c² − b²) / (2ac) = (25 + 64 − 49) / (2·5·8) = 40/80 = 0,5
β = arccos(0,5) = 60°

γ = 180° − 38,2° − 60° = 81,8°
Ověření: a/sinα = 5/sin(38,2°) ≈ 8,07 ≈ c/sinγ = 8/sin(81,8°) ≈ 8,08 ✓`}</Formula>
      </TheoryBlock>

      <TheoryBlock title="Heronův vzorec — obsah trojúhelníku" variant="default">
        <p className="mb-2">Ze tří stran lze vypočítat obsah bez výpočtu úhlů:</p>
        <Formula>{`s = (a + b + c) / 2    (poloobvod)
S = √(s(s−a)(s−b)(s−c))`}</Formula>
        <p className="text-sm text-slate-600 mt-2">
          Alternativně: S = (1/2)·a·b·sin γ (ze dvou stran a svírajícího úhlu).
        </p>
      </TheoryBlock>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <LevelPractice levelId={4} />
      </div>
    </div>
  );
}
