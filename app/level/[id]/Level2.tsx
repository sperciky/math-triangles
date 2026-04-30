'use client';

import TheoryBlock from '../../components/TheoryBlock';
import Formula from '../../components/Formula';
import TriangleVisualizer from '../../components/TriangleVisualizer';
import LevelPractice from '../../components/LevelPractice';
import { degToRad } from '../../math/goniometry';

const DEMO_TRIANGLE = {
  a: 3, b: 4, c: 5,
  alpha: degToRad(36.87),
  beta: degToRad(53.13),
  gamma: degToRad(90),
};

export default function Level2() {
  return (
    <div className="space-y-2">
      <TheoryBlock title="Pravoúhlý trojúhelník — přehled" defaultOpen>
        <p className="mb-3">
          Pravoúhlý trojúhelník má jeden vnitřní úhel rovný 90°. Označení: pravý úhel u vrcholu <em>C</em>,
          přepona <em>c</em> (naproti pravému úhlu), odvěsny <em>a</em>, <em>b</em>.
        </p>
        <div className="flex justify-center mb-4">
          <TriangleVisualizer triangle={DEMO_TRIANGLE} rightAngleAt="C" width={320} height={200} />
        </div>
        <Formula>{`sin α = a/c     cos α = b/c     tg α = a/b
sin β = b/c     cos β = a/c     tg β = b/a
α + β = 90°    (komplementární úhly)`}</Formula>
      </TheoryBlock>

      <TheoryBlock title="Pythagorova věta" variant="derivation">
        <p className="mb-2">
          Základní vztah mezi stranami pravoúhlého trojúhelníku:
        </p>
        <Formula label="Pythagorova věta">a² + b² = c²</Formula>
        <p className="mb-2">
          Odvozeno z plochy čtverců nad stranami trojúhelníku. Platí pouze pro pravoúhlý trojúhelník
          (pro obecný trojúhelník používáme kosinovou větu).
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
          <strong>Pythagorovy trojice</strong> (celá čísla): (3, 4, 5) · (5, 12, 13) · (8, 15, 17) · (7, 24, 25)
        </div>
      </TheoryBlock>

      <TheoryBlock title="Výpočtové vzorce" variant="example">
        <p className="mb-3">Ze dvou libovolných prvků pravoúhlého trojúhelníku (alespoň jedna strana) lze určit zbylé:</p>
        <div className="overflow-x-auto">
          <table className="text-sm w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-3 py-2 text-left">Dáno</th>
                <th className="border border-slate-200 px-3 py-2 text-left">Hledáme</th>
                <th className="border border-slate-200 px-3 py-2 text-left">Vzorec</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {[
                ['c, α', 'a', 'a = c · sin α'],
                ['c, α', 'b', 'b = c · cos α'],
                ['a, α', 'c', 'c = a / sin α'],
                ['a, α', 'b', 'b = a / tg α'],
                ['a, b', 'c', 'c = √(a² + b²)'],
                ['a, b', 'α', 'α = arctg(a/b)'],
                ['a, c', 'α', 'α = arcsin(a/c)'],
              ].map(([given, find, formula], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="border border-slate-200 px-3 py-1.5">{given}</td>
                  <td className="border border-slate-200 px-3 py-1.5">{find}</td>
                  <td className="border border-slate-200 px-3 py-1.5 text-blue-700">{formula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TheoryBlock>

      <TheoryBlock title="Vzorový příklad — výpočet trojúhelníku" variant="example">
        <p className="mb-2 font-semibold">Zadání: c = 10 cm, α = 35°. Vypočtěte a, b, β.</p>
        <Formula>{`β = 90° − 35° = 55°
a = c · sin α = 10 · sin(35°) ≈ 10 · 0,5736 ≈ 5,74 cm
b = c · cos α = 10 · cos(35°) ≈ 10 · 0,8192 ≈ 8,19 cm`}</Formula>
        <p className="text-sm text-slate-500">Ověření: a² + b² = 32,95 + 67,08 ≈ 100 = c² ✓</p>
      </TheoryBlock>

      <TheoryBlock title="Praktická aplikace — příklad" variant="example">
        <p className="mb-2 font-semibold">Zadání: Stožár výšky h stojí na rovném terénu. Ze vzdálenosti d = 50 m svírá vrchol stožáru s horizontem úhel α = 28°. Jak vysoký je stožár?</p>
        <Formula>{`tg α = h / d  ⟹  h = d · tg α = 50 · tg(28°) ≈ 50 · 0,5317 ≈ 26,6 m`}</Formula>
      </TheoryBlock>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <LevelPractice levelId={2} />
      </div>
    </div>
  );
}
