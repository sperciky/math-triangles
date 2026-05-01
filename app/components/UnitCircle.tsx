'use client';

import { useState, useCallback } from 'react';
import { radToDeg, round } from '../math/goniometry';

const R = 110; // circle radius in SVG units
const CX = 150;
const CY = 150;
const SIZE = 300;

function polarToSvg(angle: number, r: number): [number, number] {
  // SVG y-axis is flipped
  return [CX + r * Math.cos(angle), CY - r * Math.sin(angle)];
}

export default function UnitCircle() {
  const [angle, setAngle] = useState(Math.PI / 4); // radians

  const deg = round(radToDeg(angle), 1);
  const sinVal = round(Math.sin(angle), 4);
  const cosVal = round(Math.cos(angle), 4);
  const tanVal = Math.abs(Math.cos(angle)) < 0.01 ? '±∞' : String(round(Math.tan(angle), 4));

  const [px, py] = polarToSvg(angle, R);

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAngle(Number(e.target.value));
  }, []);

  // Quadrant label
  const quadrant = angle >= 0 && angle < Math.PI / 2 ? 'I'
    : angle < Math.PI ? 'II'
    : angle < 1.5 * Math.PI ? 'III'
    : 'IV';

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="border border-slate-200 rounded-lg bg-white">
        {/* Axes */}
        <line x1="20" y1={CY} x2={SIZE - 20} y2={CY} stroke="#94a3b8" strokeWidth="1" />
        <line x1={CX} y1="20" x2={CX} y2={SIZE - 20} stroke="#94a3b8" strokeWidth="1" />

        {/* Axis labels */}
        <text x={SIZE - 18} y={CY + 4} fontSize="12" fill="#64748b">x</text>
        <text x={CX + 4} y="18" fontSize="12" fill="#64748b">y</text>

        {/* Unit circle */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#334155" strokeWidth="1.5" />

        {/* Angle arc */}
        {(() => {
          const sweep = angle < 0 ? 0 : 1;
          const [ax, ay] = polarToSvg(angle, 30);
          const largeArc = Math.abs(angle) > Math.PI ? 1 : 0;
          return (
            <path
              d={`M ${CX + 30} ${CY} A 30 30 0 ${largeArc} ${sweep} ${ax} ${ay}`}
              fill="rgba(59,130,246,0.15)"
              stroke="#3b82f6"
              strokeWidth="1.5"
            />
          );
        })()}

        {/* Radius line */}
        <line x1={CX} y1={CY} x2={px} y2={py} stroke="#3b82f6" strokeWidth="2" />

        {/* sin projection (vertical) */}
        <line x1={px} y1={py} x2={px} y2={CY} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x={px + 4} y={(py + CY) / 2} fontSize="11" fill="#ef4444" fontWeight="bold">sin</text>

        {/* cos projection (horizontal) */}
        <line x1={CX} y1={CY} x2={px} y2={CY} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x={(CX + px) / 2} y={CY + 14} fontSize="11" fill="#10b981" fontWeight="bold">cos</text>

        {/* Point on circle */}
        <circle cx={px} cy={py} r="5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
        <text x={px + 7} y={py - 6} fontSize="11" fill="#1e40af">P</text>

        {/* Angle label */}
        <text x={CX + 35} y={CY - 8} fontSize="11" fill="#3b82f6">α</text>

        {/* Quadrant labels */}
        <text x={CX + 60} y={CY - 60} fontSize="10" fill="#cbd5e1">I</text>
        <text x={CX - 75} y={CY - 60} fontSize="10" fill="#cbd5e1">II</text>
        <text x={CX - 75} y={CY + 70} fontSize="10" fill="#cbd5e1">III</text>
        <text x={CX + 60} y={CY + 70} fontSize="10" fill="#cbd5e1">IV</text>
      </svg>

      {/* Slider */}
      <div className="w-full max-w-xs">
        <label className="block text-sm text-slate-600 mb-1 text-center">
          Úhel α = <strong className="text-blue-700">{deg}°</strong> = <strong className="text-blue-700">{round(angle, 3)} rad</strong>
        </label>
        <input
          type="range"
          min="0"
          max={2 * Math.PI}
          step="0.01"
          value={angle}
          onChange={handleSlider}
          className="w-full accent-blue-600"
        />
      </div>

      {/* Live values */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
          <div className="text-xs text-red-500 font-semibold mb-0.5">sin α</div>
          <div className="font-mono font-bold text-red-700">{sinVal}</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
          <div className="text-xs text-emerald-500 font-semibold mb-0.5">cos α</div>
          <div className="font-mono font-bold text-emerald-700">{cosVal}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
          <div className="text-xs text-purple-500 font-semibold mb-0.5">tg α</div>
          <div className="font-mono font-bold text-purple-700">{tanVal}</div>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Kvadrant: <strong>{quadrant}</strong> · P = ({cosVal}, {sinVal}) · sin²α + cos²α = {round(sinVal ** 2 + cosVal ** 2, 4)}
      </p>
    </div>
  );
}
