'use client';

import TheoryBlock from '../../components/TheoryBlock';
import Formula from '../../components/Formula';
import LevelPractice from '../../components/LevelPractice';

export default function Level3() {
  return (
    <div className="space-y-2">
      <TheoryBlock title="Sinová věta — formulace" defaultOpen>
        <p className="mb-3">
          V <strong>libovolném trojúhelníku ABC</strong> platí:
        </p>
        <Formula label="sinová věta">a / sin α  =  b / sin β  =  c / sin γ  =  2R</Formula>
        <p className="text-sm text-slate-600 mt-2">
          kde R je poloměr opsané kružnice. Věta platí pro všechny trojúhelníky — pravoúhlé i obecné.
        </p>
      </TheoryBlock>

      <TheoryBlock title="Odvození sinové věty" variant="derivation">
        <p className="mb-2">
          Sestrojíme výšku h z vrcholu C na stranu c. Trojúhelník se rozdělí na dva pravoúhlé trojúhelníky.
        </p>
        <Formula>{`Z △ACH:  sin α = h / b  ⟹  h = b · sin α
Z △BCH:  sin β = h / a  ⟹  h = a · sin β`}</Formula>
        <p className="my-2">Obě vyjádření h jsou si rovna:</p>
        <Formula>{`b · sin α = a · sin β
⟹  a / sin α = b / sin β`}</Formula>
        <p className="mt-2">
          Analogicky pro druhou dvojici dostaneme <em>b/sin β = c/sin γ</em>.
          Člen 2R plyne z věty o úsečkovém úhlu (opsaná kružnice).
        </p>
      </TheoryBlock>

      <TheoryBlock title="Kdy použít sinovou větu" variant="example">
        <div className="space-y-2 text-sm">
          {[
            { case: 'ASA', desc: 'Dva úhly a libovolná strana', ok: true },
            { case: 'AAS', desc: 'Dva úhly a strana naproti jednomu z nich', ok: true },
            { case: 'SSA', desc: 'Dvě strany a úhel naproti jedné z nich', ok: true, warn: '⚠️ Případ nejednoznačnosti!' },
          ].map((r) => (
            <div key={r.case} className={`flex items-start gap-2 p-2 rounded border ${r.warn ? 'border-amber-300 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
              <span className="font-mono font-bold text-slate-700 w-10 shrink-0">{r.case}</span>
              <span className="text-slate-700">{r.desc}</span>
              {r.warn && <span className="ml-auto text-amber-700 text-xs">{r.warn}</span>}
            </div>
          ))}
        </div>
      </TheoryBlock>

      <TheoryBlock title="⚠️ Případ SSA — nejednoznačnost (ambiguous case)" variant="warning">
        <p className="mb-2">
          Jsou dány strany <em>a</em>, <em>b</em> a úhel α (naproti <em>a</em>). Hledáme úhel β.
        </p>
        <Formula>sin β = b · sin α / a</Formula>
        <p className="mb-3">Počet řešení závisí na porovnání <em>a</em> s výškou hα = b · sin α:</p>
        <div className="overflow-x-auto">
          <table className="text-sm w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-3 py-2 text-left">Podmínka</th>
                <th className="border border-slate-200 px-3 py-2 text-left">Počet řešení</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['a < hα = b·sinα', '0 — trojúhelník neexistuje'],
                ['a = hα (α ostrý)', '1 — pravoúhlý trojúhelník'],
                ['hα < a < b (α ostrý)', '2 — ostrý i tupý β'],
                ['a ≥ b (α ostrý)', '1 — pouze ostrý β'],
                ['α tupý a a ≤ b', '0 — neexistuje'],
                ['α tupý a a > b', '1 — jediné řešení'],
              ].map(([cond, res], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="border border-slate-200 px-3 py-1.5 font-mono text-xs">{cond}</td>
                  <td className="border border-slate-200 px-3 py-1.5 text-sm">{res}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm">
          <strong>Praktický postup:</strong> Vypočtěte sin β. Je-li sin β &gt; 1 → neexistuje. Je-li sin β ≤ 1 →
          β₁ = arcsin(sin β) i β₂ = 180° − β₁ jsou kandidáti — ověřte, zda dávají kladné γ.
        </div>
      </TheoryBlock>

      <TheoryBlock title="Vzorový příklad" variant="example">
        <p className="mb-2 font-semibold">Zadání: α = 35°, β = 80°, a = 10 cm. Určete b a c.</p>
        <Formula>{`γ = 180° − 35° − 80° = 65°

Sinová věta:  a/sin α = b/sin β = c/sin γ

b = a · sin β / sin α = 10 · sin(80°)/sin(35°) ≈ 10 · 0,9848/0,5736 ≈ 17,17 cm
c = a · sin γ / sin α = 10 · sin(65°)/sin(35°) ≈ 10 · 0,9063/0,5736 ≈ 15,80 cm`}</Formula>
      </TheoryBlock>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <LevelPractice levelId={3} />
      </div>
    </div>
  );
}
