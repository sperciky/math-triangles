'use client';

import TheoryBlock from '../../components/TheoryBlock';
import Formula from '../../components/Formula';
import GonioTable from '../../components/GonioTable';
import UnitCircle from '../../components/UnitCircle';
import LevelPractice from '../../components/LevelPractice';

export default function Level1() {
  return (
    <div className="space-y-2">
      {/* ── Intuice ── */}
      <TheoryBlock title="Úvod — proč goniometrické funkce?" defaultOpen variant="default">
        <p className="mb-2">
          Goniometrické funkce vznikly z potřeby popsat vztahy mezi stranami a úhly v trojúhelnících.
          V pravoúhlém trojúhelníku závisí poměr stran <em>pouze</em> na velikosti úhlu — nezáleží na velikosti trojúhelníku.
        </p>
        <p>
          Tento princip umožňuje řešit trojúhelníky, navigovat lodě, modelovat vlnění i analyzovat zvukové signály.
          Na gymnáziu studujeme funkce <strong>sinus, kosinus a tangens</strong>.
        </p>
      </TheoryBlock>

      {/* ── Definice v pravoúhlém trojúhelníku ── */}
      <TheoryBlock title="Definice v pravoúhlém trojúhelníku" defaultOpen variant="default">
        <p className="mb-3">
          Mějme pravoúhlý trojúhelník s pravým úhlem u vrcholu <em>C</em>. Strany:
          <strong> a</strong> (protilehlá k α), <strong>b</strong> (přilehlá k α), <strong>c</strong> (přepona).
        </p>
        <Formula>sin α  =  a / c  =  protilehlá odvěsna / přepona</Formula>
        <Formula>cos α  =  b / c  =  přilehlá odvěsna / přepona</Formula>
        <Formula>tg α   =  a / b  =  protilehlá / přilehlá  =  sin α / cos α</Formula>
        <p className="text-sm text-slate-500 mt-2">
          Mnemotechnika: <strong>S</strong>inus — <strong>P</strong>rotilehlá / <strong>P</strong>řepona
          · <strong>K</strong>osinus — <strong>P</strong>řilehlá / <strong>P</strong>řepona
        </p>
      </TheoryBlock>

      {/* ── Jednotková kružnice ── */}
      <TheoryBlock title="Rozšíření — jednotková kružnice" variant="derivation">
        <p className="mb-3">
          Pro úhly mimo interval (0°, 90°) definujeme goniometrické funkce pomocí{' '}
          <strong>jednotkové kružnice</strong> (kružnice se středem v počátku a poloměrem 1).
        </p>
        <p className="mb-4">
          Bod <em>P</em> na kružnici odpovídající úhlu α (měřeného od kladné osy x proti směru hodinových ručiček) má souřadnice:
        </p>
        <Formula>P = (cos α,  sin α)</Formula>
        <p className="mb-4">
          Tato definice souhlasí s definicí v pravoúhlém trojúhelníku pro α ∈ (0°, 90°)
          a přirozeně rozšiřuje funkce na celou číselnou osu.
        </p>
        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-600 mb-3">Interaktivní jednotková kružnice — posunujte úhel:</p>
          <UnitCircle />
        </div>
      </TheoryBlock>

      {/* ── Tabulka hodnot ── */}
      <TheoryBlock title="Tabulka přesných hodnot" variant="default">
        <p className="mb-3 text-sm text-slate-600">
          Hodnoty pro základní úhly je nutné znát zpaměti. Postup pro sin: 0, √1/2, √2/2, √3/2, √4/2 (= 1). Pro cos opačně.
        </p>
        <GonioTable />
      </TheoryBlock>

      {/* ── Pythagorova identita ── */}
      <TheoryBlock title="Základní identita a odvozené vztahy" variant="derivation">
        <p className="mb-2">Z definice přes jednotkovou kružnici plyne okamžitě:</p>
        <Formula label="Pythagorova identita">sin²α + cos²α = 1</Formula>
        <p className="mb-2">Vydělením cos²α:</p>
        <Formula>tg²α + 1 = 1 / cos²α</Formula>
        <p className="mb-2 mt-3">Tangens není definován pro cos α = 0, tj. α = π/2 + kπ (k ∈ ℤ).</p>

        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <strong>Příklad použití:</strong> Je dáno sin α = 0,6. Vypočtěte cos α pro α ∈ (0°, 90°).
          <Formula>cos α = √(1 − sin²α) = √(1 − 0,36) = √0,64 = 0,8</Formula>
        </div>
      </TheoryBlock>

      {/* ── Redukční vzorce ── */}
      <TheoryBlock title="Znaménka podle kvadrantů a redukční vzorce" variant="default">
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          {[
            { q: 'I. (0° – 90°)', sin: '+', cos: '+', tan: '+' },
            { q: 'II. (90° – 180°)', sin: '+', cos: '−', tan: '−' },
            { q: 'III. (180° – 270°)', sin: '−', cos: '−', tan: '+' },
            { q: 'IV. (270° – 360°)', sin: '−', cos: '+', tan: '−' },
          ].map((r) => (
            <div key={r.q} className="border border-slate-200 rounded-lg p-2">
              <div className="font-semibold text-slate-700 mb-1">{r.q}</div>
              <div className="font-mono text-xs space-y-0.5">
                <div className={r.sin === '+' ? 'text-emerald-600' : 'text-red-500'}>sin: {r.sin}</div>
                <div className={r.cos === '+' ? 'text-emerald-600' : 'text-red-500'}>cos: {r.cos}</div>
                <div className={r.tan === '+' ? 'text-emerald-600' : 'text-red-500'}>tg: {r.tan}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm mb-2 font-semibold">Nejdůležitější redukční vzorce:</p>
        <Formula>{`sin(π − α) =  sin α       cos(π − α) = −cos α
sin(π + α) = −sin α       cos(π + α) = −cos α
sin(2π − α) = −sin α      cos(2π − α) =  cos α
sin(π/2 − α) = cos α      cos(π/2 − α) = sin α`}</Formula>
      </TheoryBlock>

      {/* ── Cvičení ── */}
      <div className="mt-8 border-t border-slate-200 pt-6">
        <LevelPractice levelId={1} />
      </div>
    </div>
  );
}
