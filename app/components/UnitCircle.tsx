'use client';

import { useState, useCallback, useMemo } from 'react';
import { degToRad, radToDeg, round } from '../math/goniometry';

// ── Unit circle constants ────────────────────────────────────────────────────
const UC_R  = 100;
const UC_CX = 130;
const UC_CY = 130;
const UC_W  = 260;
const UC_H  = 260;

function polarToSvg(angle: number, r: number): [number, number] {
  return [UC_CX + r * Math.cos(angle), UC_CY - r * Math.sin(angle)];
}

// ── Function graph constants ─────────────────────────────────────────────────
const GW      = 440;   // total SVG width
const GH      = 220;   // total SVG height
const GP_L    = 36;    // left padding  (y-axis labels)
const GP_R    = 12;    // right padding
const GP_T    = 18;    // top padding
const GP_B    = 32;    // bottom padding (x-axis labels)
const PLOT_W  = GW - GP_L - GP_R;
const PLOT_H  = GH - GP_T - GP_B;
const MID_Y   = GP_T + PLOT_H / 2;  // y = 0 line in SVG coords

// Map angle [0, 2π] → SVG x
function xToSvg(a: number): number {
  return GP_L + (a / (2 * Math.PI)) * PLOT_W;
}
// Map value [-1, 1] → SVG y
function yToSvg(v: number): number {
  return MID_Y - v * (PLOT_H / 2);
}

// Generate polyline points string for a trig function
function makeCurve(fn: (x: number) => number, steps = 360): string {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = (i / steps) * 2 * Math.PI;
    return `${xToSvg(a).toFixed(2)},${yToSvg(fn(a)).toFixed(2)}`;
  }).join(' ');
}

// ── Special-angle snapping + exact values ───────────────────────────────────
interface SpecialAngle {
  val: number;
  deg: number;
  rad: string;
  sin: string;
  cos: string;
  tan: string;
}

const SPECIAL: SpecialAngle[] = [
  { val: 0,                 deg: 0,   rad: '0',     sin: '0',       cos: '1',       tan: '0' },
  { val: Math.PI / 6,       deg: 30,  rad: 'π/6',   sin: '1/2',     cos: '√3/2',    tan: '√3/3' },
  { val: Math.PI / 4,       deg: 45,  rad: 'π/4',   sin: '√2/2',    cos: '√2/2',    tan: '1' },
  { val: Math.PI / 3,       deg: 60,  rad: 'π/3',   sin: '√3/2',    cos: '1/2',     tan: '√3' },
  { val: Math.PI / 2,       deg: 90,  rad: 'π/2',   sin: '1',       cos: '0',       tan: '±∞' },
  { val: 2*Math.PI/3,       deg: 120, rad: '2π/3',  sin: '√3/2',    cos: '−1/2',    tan: '−√3' },
  { val: 3*Math.PI/4,       deg: 135, rad: '3π/4',  sin: '√2/2',    cos: '−√2/2',   tan: '−1' },
  { val: 5*Math.PI/6,       deg: 150, rad: '5π/6',  sin: '1/2',     cos: '−√3/2',   tan: '−√3/3' },
  { val: Math.PI,            deg: 180, rad: 'π',     sin: '0',       cos: '−1',      tan: '0' },
  { val: 7*Math.PI/6,       deg: 210, rad: '7π/6',  sin: '−1/2',    cos: '−√3/2',   tan: '√3/3' },
  { val: 5*Math.PI/4,       deg: 225, rad: '5π/4',  sin: '−√2/2',   cos: '−√2/2',   tan: '1' },
  { val: 4*Math.PI/3,       deg: 240, rad: '4π/3',  sin: '−√3/2',   cos: '−1/2',    tan: '√3' },
  { val: 3*Math.PI/2,       deg: 270, rad: '3π/2',  sin: '−1',      cos: '0',       tan: '±∞' },
  { val: 5*Math.PI/3,       deg: 300, rad: '5π/3',  sin: '−√3/2',   cos: '1/2',     tan: '−√3' },
  { val: 7*Math.PI/4,       deg: 315, rad: '7π/4',  sin: '−√2/2',   cos: '√2/2',    tan: '−1' },
  { val: 11*Math.PI/6,      deg: 330, rad: '11π/6', sin: '−1/2',    cos: '√3/2',    tan: '−√3/3' },
  { val: 2*Math.PI,         deg: 360, rad: '2π',    sin: '0',       cos: '1',       tan: '0' },
];

// Return exact symbolic values for a special angle, or null if between angles
function exactValues(a: number): Pick<SpecialAngle, 'sin'|'cos'|'tan'> | null {
  for (const s of SPECIAL) {
    if (Math.abs(a - s.val) < 0.0001) return { sin: s.sin, cos: s.cos, tan: s.tan };
  }
  return null;
}

const SNAP_THRESHOLD = 0.03; // ~1.7° — snaps slider to exact special angle

// Return the nearest special angle if within threshold, else the raw value
function snapAngle(a: number): number {
  for (const s of SPECIAL) {
    if (Math.abs(a - s.val) < SNAP_THRESHOLD) return s.val;
  }
  return a;
}

// Format radian value as symbolic π string when possible, else "x.xxx rad"
function formatRad(a: number): string {
  for (const s of SPECIAL) {
    if (Math.abs(a - s.val) < 0.0001) return s.rad;
  }
  return `${round(a, 3)} rad`;
}

// Format degree value as integer when on a special angle, else 1 decimal
function formatDeg(a: number): string {
  for (const s of SPECIAL) {
    if (Math.abs(a - s.val) < 0.0001) return `${s.deg}°`;
  }
  return `${round(radToDeg(a), 1)}°`;
}

// ── Colour tokens ────────────────────────────────────────────────────────────
const SIN_COLOR = '#ef4444';   // red-500
const COS_COLOR = '#10b981';   // emerald-500

// ── Mirror angles ────────────────────────────────────────────────────────────
// sin(π − α) = sin α  →  mirror_sin = π − α  (mod 2π, clamped to [0, 2π])
function sinMirror(a: number): number {
  const m = Math.PI - a;
  return ((m % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}
// cos(2π − α) = cos α  →  mirror_cos = 2π − α
function cosMirror(a: number): number {
  const m = 2 * Math.PI - a;
  return ((m % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

const EPS = 0.04; // angle distance below which mirror ≈ current (no line drawn)

// ── X-axis tick config ───────────────────────────────────────────────────────
const TICKS_DEG = [
  { a: 0,              label_deg: '0°',    label_rad: '0' },
  { a: Math.PI / 2,    label_deg: '90°',   label_rad: 'π/2' },
  { a: Math.PI,        label_deg: '180°',  label_rad: 'π' },
  { a: 3 * Math.PI / 2,label_deg: '270°',  label_rad: '3π/2' },
  { a: 2 * Math.PI,    label_deg: '360°',  label_rad: '2π' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function FunctionGraph({ angle, useDeg }: { angle: number; useDeg: boolean }) {
  const sinCurve = useMemo(() => makeCurve(Math.sin), []);
  const cosCurve = useMemo(() => makeCurve(Math.cos), []);

  const sv  = Math.sin(angle);
  const cv  = Math.cos(angle);
  const sm  = sinMirror(angle);
  const cm  = cosMirror(angle);
  const smClose = Math.abs(sm - angle) < EPS;
  const cmClose = Math.abs(cm - angle) < EPS || Math.abs(cm - (angle + 2 * Math.PI)) < EPS;

  // SVG coords for current + mirror dots
  const sx  = xToSvg(angle);
  const sy  = yToSvg(sv);
  const smx = xToSvg(sm);

  const cx2  = xToSvg(angle);
  const cy2  = yToSvg(cv);
  const cmx  = xToSvg(cm);
  const cmy  = yToSvg(cv);

  return (
    <svg
      width={GW}
      height={GH}
      viewBox={`0 0 ${GW} ${GH}`}
      className="bg-white rounded-lg border border-slate-200 w-full"
    >
      {/* ── Grid ── */}
      {[-1, -0.5, 0.5, 1].map(v => (
        <line
          key={v}
          x1={GP_L} y1={yToSvg(v)} x2={GP_L + PLOT_W} y2={yToSvg(v)}
          stroke="#f1f5f9" strokeWidth="1"
        />
      ))}

      {/* ── Axes ── */}
      {/* x-axis (y = 0) */}
      <line x1={GP_L} y1={MID_Y} x2={GP_L + PLOT_W} y2={MID_Y} stroke="#94a3b8" strokeWidth="1" />
      {/* y-axis */}
      <line x1={GP_L} y1={GP_T} x2={GP_L} y2={GP_T + PLOT_H} stroke="#94a3b8" strokeWidth="1" />

      {/* ── Y-axis labels ── */}
      {[1, 0.5, 0, -0.5, -1].map(v => (
        <text key={v} x={GP_L - 4} y={yToSvg(v) + 4} fontSize="9" fill="#94a3b8" textAnchor="end">
          {v}
        </text>
      ))}

      {/* ── X-axis ticks & labels ── */}
      {TICKS_DEG.map(t => (
        <g key={t.label_deg}>
          <line x1={xToSvg(t.a)} y1={MID_Y - 3} x2={xToSvg(t.a)} y2={MID_Y + 3} stroke="#94a3b8" strokeWidth="1" />
          <text
            x={xToSvg(t.a)}
            y={GP_T + PLOT_H + 18}
            fontSize="9"
            fill="#64748b"
            textAnchor="middle"
          >
            {useDeg ? t.label_deg : t.label_rad}
          </text>
        </g>
      ))}

      {/* ── Curves ── */}
      <polyline points={cosCurve} fill="none" stroke={COS_COLOR} strokeWidth="2" opacity="0.85" />
      <polyline points={sinCurve} fill="none" stroke={SIN_COLOR} strokeWidth="2" opacity="0.85" />

      {/* ── Current angle vertical marker ── */}
      <line
        x1={sx} y1={GP_T} x2={sx} y2={GP_T + PLOT_H}
        stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,3" opacity="0.6"
      />

      {/* ── Sin horizontal connector ── */}
      {!smClose && (
        <line
          x1={sx} y1={sy} x2={smx} y2={sy}
          stroke={SIN_COLOR} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.8"
        />
      )}
      {/* sin: mirror dot (open) */}
      {!smClose && (
        <circle cx={smx} cy={sy} r="4" fill="white" stroke={SIN_COLOR} strokeWidth="2" />
      )}
      {/* sin: current dot (filled) */}
      <circle cx={sx} cy={sy} r="4.5" fill={SIN_COLOR} stroke="white" strokeWidth="1.5" />

      {/* ── Cos horizontal connector ── */}
      {!cmClose && (
        <line
          x1={cx2} y1={cy2} x2={cmx} y2={cmy}
          stroke={COS_COLOR} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.8"
        />
      )}
      {/* cos: mirror dot (open) */}
      {!cmClose && (
        <circle cx={cmx} cy={cmy} r="4" fill="white" stroke={COS_COLOR} strokeWidth="2" />
      )}
      {/* cos: current dot (filled) */}
      <circle cx={cx2} cy={cy2} r="4.5" fill={COS_COLOR} stroke="white" strokeWidth="1.5" />

      {/* ── Legend ── */}
      <g transform={`translate(${GP_L + 8}, ${GP_T + 8})`}>
        <rect x="0" y="0" width="80" height="34" rx="4" fill="white" opacity="0.85" />
        <line x1="6" y1="10" x2="18" y2="10" stroke={SIN_COLOR} strokeWidth="2" />
        <circle cx="12" cy="10" r="3" fill={SIN_COLOR} />
        <text x="22" y="14" fontSize="10" fill={SIN_COLOR} fontWeight="bold">sin α</text>
        <line x1="6" y1="24" x2="18" y2="24" stroke={COS_COLOR} strokeWidth="2" />
        <circle cx="12" cy="24" r="3" fill={COS_COLOR} />
        <text x="22" y="28" fontSize="10" fill={COS_COLOR} fontWeight="bold">cos α</text>
      </g>
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

// Snap degree value to nearest special angle within 4°
function snapDeg(d: number): number {
  for (const s of SPECIAL) {
    if (Math.abs(d - s.deg) < 4) return s.deg;
  }
  return d;
}

export default function UnitCircle() {
  // Store angle in degrees — avoids float precision issues with the range input
  const [deg, setDeg]       = useState(45);
  const [useDeg, setUseDeg] = useState(true);

  const angle  = degToRad(deg);           // radians for all math
  const sinVal = round(Math.sin(angle), 4);
  const cosVal = round(Math.cos(angle), 4);
  const tanVal = Math.abs(Math.cos(angle)) < 0.0001 ? '±∞' : String(round(Math.tan(angle), 4));

  const [px, py] = polarToSvg(angle, UC_R);

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDeg(snapDeg(Number(e.target.value)));
  }, []);

  const quadrant =
    deg < 90  ? 'I'   :
    deg < 180 ? 'II'  :
    deg < 270 ? 'III' : 'IV';

  return (
    <div className="flex flex-col gap-4">

      {/* ── Top row: unit circle + graph ── */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">

        {/* Unit circle */}
        <div className="shrink-0">
          <svg
            width={UC_W}
            height={UC_H}
            viewBox={`0 0 ${UC_W} ${UC_H}`}
            className="border border-slate-200 rounded-lg bg-white"
          >
            {/* Axes */}
            <line x1="16" y1={UC_CY} x2={UC_W - 10} y2={UC_CY} stroke="#94a3b8" strokeWidth="1" />
            <line x1={UC_CX} y1="10"  x2={UC_CX} y2={UC_H - 10} stroke="#94a3b8" strokeWidth="1" />
            <text x={UC_W - 12} y={UC_CY + 4} fontSize="11" fill="#64748b">x</text>
            <text x={UC_CX + 4} y="16"         fontSize="11" fill="#64748b">y</text>

            {/* Unit circle */}
            <circle cx={UC_CX} cy={UC_CY} r={UC_R} fill="none" stroke="#334155" strokeWidth="1.5" />

            {/* Angle arc */}
            {(() => {
              const [ax, ay] = polarToSvg(angle, 28);
              const large = angle > Math.PI ? 1 : 0;
              return (
                <path
                  d={`M ${UC_CX + 28} ${UC_CY} A 28 28 0 ${large} 0 ${ax} ${ay}`}
                  fill="rgba(59,130,246,0.12)"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                />
              );
            })()}

            {/* Radius */}
            <line x1={UC_CX} y1={UC_CY} x2={px} y2={py} stroke="#3b82f6" strokeWidth="2" />

            {/* sin projection */}
            <line x1={px} y1={py} x2={px} y2={UC_CY} stroke={SIN_COLOR} strokeWidth="1.5" strokeDasharray="4,3" />
            <text
              x={px + (px > UC_CX ? 4 : -26)}
              y={(py + UC_CY) / 2 + 4}
              fontSize="10" fill={SIN_COLOR} fontWeight="bold"
            >sin</text>

            {/* cos projection */}
            <line x1={UC_CX} y1={UC_CY} x2={px} y2={UC_CY} stroke={COS_COLOR} strokeWidth="1.5" strokeDasharray="4,3" />
            <text
              x={(UC_CX + px) / 2}
              y={UC_CY + (py > UC_CY ? -6 : 14)}
              fontSize="10" fill={COS_COLOR} fontWeight="bold" textAnchor="middle"
            >cos</text>

            {/* Point */}
            <circle cx={px} cy={py} r="5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
            <text x={px + 7} y={py - 6} fontSize="10" fill="#1e40af">P</text>

            {/* α label */}
            <text x={UC_CX + 32} y={UC_CY - 7} fontSize="10" fill="#3b82f6">α</text>

            {/* Quadrant labels */}
            <text x={UC_CX + 52} y={UC_CY - 52} fontSize="9" fill="#cbd5e1">I</text>
            <text x={UC_CX - 64} y={UC_CY - 52} fontSize="9" fill="#cbd5e1">II</text>
            <text x={UC_CX - 64} y={UC_CY + 62} fontSize="9" fill="#cbd5e1">III</text>
            <text x={UC_CX + 52} y={UC_CY + 62} fontSize="9" fill="#cbd5e1">IV</text>
          </svg>
        </div>

        {/* Function graph */}
        <div className="flex-1 min-w-0">
          <FunctionGraph angle={angle} useDeg={useDeg} />
        </div>
      </div>

      {/* ── Angle display + controls ── */}
      <div className="flex flex-col sm:flex-row items-center gap-4">

        {/* Large angle badge */}
        <div className="shrink-0 text-center bg-blue-50 border-2 border-blue-200 rounded-2xl py-3 px-6 min-w-[140px]">
          <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">Úhel α</div>
          <div className="text-4xl font-extrabold text-blue-700 leading-none tracking-tight">
            {formatDeg(angle)}
          </div>
          <div className="text-lg font-bold text-blue-500 mt-1">
            {formatRad(angle)}
          </div>
        </div>

        {/* Slider + clickable dots */}
        <div className="flex-1 w-full">
          {/* Range input — integer degrees → no float precision issues */}
          <input
            type="range"
            min="0"
            max="360"
            step="0.5"
            value={deg}
            onChange={handleSlider}
            className="w-full accent-blue-600"
          />

          {/* Clickable yellow dots at every special angle.
              8 px h-padding matches the slider thumb inset so dots align
              with the track endpoints. */}
          <div className="relative h-5 mt-0.5" style={{ paddingLeft: 8, paddingRight: 8 }}>
            {SPECIAL.map(s => {
              const pct = (s.deg / 360) * 100;
              const isActive = s.deg === deg;
              return (
                <button
                  key={s.deg}
                  onClick={() => setDeg(s.deg)}
                  title={`${s.deg}° = ${s.rad}`}
                  style={{ left: `${pct}%` }}
                  className={`absolute top-0 -translate-x-1/2 w-3 h-3 rounded-full border-2 transition-transform hover:scale-150 focus:outline-none
                    ${isActive
                      ? 'bg-blue-500 border-blue-700 scale-125 z-10'
                      : 'bg-yellow-400 border-yellow-600 hover:bg-yellow-300'}`}
                />
              );
            })}
          </div>

          {/* Axis labels */}
          <div className="flex justify-between text-xs text-slate-400 mt-1" style={{ paddingLeft: 8, paddingRight: 8 }}>
            <span>{useDeg ? '0°' : '0'}</span>
            <span>{useDeg ? '90°' : 'π/2'}</span>
            <span>{useDeg ? '180°' : 'π'}</span>
            <span>{useDeg ? '270°' : '3π/2'}</span>
            <span>{useDeg ? '360°' : '2π'}</span>
          </div>
        </div>

        {/* Degree / Radian toggle */}
        <button
          onClick={() => setUseDeg(d => !d)}
          className="shrink-0 px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          {useDeg ? '→ rad' : '→ °'}
        </button>
      </div>

      {/* ── Value badges ── */}
      {(() => {
        const exact = exactValues(angle);
        return (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-2">
              <div className="text-xs text-red-500 font-semibold mb-0.5">sin α</div>
              <div className="font-mono font-bold text-red-700 text-base leading-tight">
                {exact ? exact.sin : sinVal}
              </div>
              {exact && exact.sin !== String(sinVal) && (
                <div className="text-xs text-red-400 mt-0.5">≈ {sinVal}</div>
              )}
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
              <div className="text-xs text-emerald-500 font-semibold mb-0.5">cos α</div>
              <div className="font-mono font-bold text-emerald-700 text-base leading-tight">
                {exact ? exact.cos : cosVal}
              </div>
              {exact && exact.cos !== String(cosVal) && (
                <div className="text-xs text-emerald-400 mt-0.5">≈ {cosVal}</div>
              )}
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
              <div className="text-xs text-purple-500 font-semibold mb-0.5">tg α</div>
              <div className="font-mono font-bold text-purple-700 text-base leading-tight">
                {exact ? exact.tan : tanVal}
              </div>
              {exact && exact.tan !== tanVal && (
                <div className="text-xs text-purple-400 mt-0.5">≈ {tanVal}</div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── Info boxes ── */}
      {(() => {
        const sm = snapAngle(sinMirror(angle));
        const cm = snapAngle(cosMirror(angle));
        const smClose = Math.abs(sm - angle) < EPS;
        const cmClose = Math.abs(cm - angle) < EPS;
        return (
          <div className="flex flex-col gap-2">
            {/* Quadrant / identity row */}
            <p className="text-xs text-slate-500 text-center">
              Kvadrant:&nbsp;<strong>{quadrant}</strong>
              &nbsp;·&nbsp;P = ({cosVal},&nbsp;{sinVal})
              &nbsp;·&nbsp;sin²α + cos²α = {round(sinVal ** 2 + cosVal ** 2, 4)}
            </p>

            {/* Mirror-angle box */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 text-center leading-relaxed">
              {smClose && cmClose ? (
                <span>Tento úhel je zrcadlovým bodem sám sobě pro obě funkce.</span>
              ) : (
                <>
                  Stejnou hodnotu nabývá funkce&nbsp;
                  <span style={{ color: SIN_COLOR }} className="font-semibold">sin</span>
                  {smClose
                    ? <> i v tomto úhlu</>
                    : <> i v úhlu&nbsp;<strong>{useDeg ? formatDeg(sm) : formatRad(sm)}</strong></>}
                  ,&nbsp;
                  <span style={{ color: COS_COLOR }} className="font-semibold">cos</span>
                  {cmClose
                    ? <> i v tomto úhlu.</>
                    : <> v úhlu&nbsp;<strong>{useDeg ? formatDeg(cm) : formatRad(cm)}</strong>.</>}
                </>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
