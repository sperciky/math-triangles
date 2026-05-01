'use client';

import { Triangle } from '../math/types';
import { radToDeg, round } from '../math/goniometry';

interface Props {
  triangle: Triangle;
  rightAngleAt?: 'C' | 'A' | 'B';
  highlight?: 'a' | 'b' | 'c' | 'alpha' | 'beta' | 'gamma';
  width?: number;
  height?: number;
}

function layoutTriangle(t: Triangle, w: number, h: number) {
  const { a = 1, b = 1, c = 1 } = t;
  const pad = 40;
  const scaleW = (w - 2 * pad) / c;
  const scale = Math.min(scaleW, (h - 2 * pad) / (b * 0.9));

  // Place A at bottom-left, B at bottom-right
  const ax = pad;
  const ay = h - pad;
  const bx = pad + c * scale;
  const by = h - pad;

  // C from law of cosines
  const alpha = t.alpha ?? 0;
  const cx = ax + b * scale * Math.cos(alpha);
  const cy = ay - b * scale * Math.sin(alpha);

  return { ax, ay, bx, by, cx, cy, scale };
}

function RightAngleMarker({ x, y, angle, size = 10 }: { x: number; y: number; angle: number; size?: number }) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const p1x = x + size * cos;
  const p1y = y - size * sin;
  const p2x = x + size * cos + size * sin;
  const p2y = y - size * sin + size * cos;
  const p3x = x + size * sin;
  const p3y = y + size * cos;
  return (
    <polyline
      points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`}
      fill="none"
      stroke="#475569"
      strokeWidth="1.2"
    />
  );
}

export default function TriangleVisualizer({
  triangle,
  rightAngleAt,
  highlight,
  width = 340,
  height = 220,
}: Props) {
  if (!triangle.a || !triangle.b || !triangle.c || triangle.alpha === undefined) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-400 text-sm italic border border-slate-200 rounded-lg">
        Doplňte hodnoty trojúhelníku
      </div>
    );
  }

  const { ax, ay, bx, by, cx, cy } = layoutTriangle(triangle, width, height);
  const { alpha, beta, gamma } = triangle;

  const HL = 'stroke-amber-500';
  const NORM = 'stroke-slate-700';

  const sideA = highlight === 'a' ? HL : NORM;
  const sideB = highlight === 'b' ? HL : NORM;
  const sideC = highlight === 'c' ? HL : NORM;

  const fmtAngle = (r: number | undefined) =>
    r !== undefined ? `${round(radToDeg(r), 1)}°` : '';

  const fmtSide = (v: number | undefined) =>
    v !== undefined ? `${round(v, 2)}` : '';

  // Midpoints for labels
  const midA = { x: (bx + cx) / 2, y: (by + cy) / 2 };
  const midB = { x: (ax + cx) / 2, y: (ay + cy) / 2 };
  const midC = { x: (ax + bx) / 2, y: (ay + by) / 2 };

  // Offset labels away from interior
  const labelOffset = 14;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="bg-white rounded-lg border border-slate-200">
      {/* Triangle sides */}
      <line x1={bx} y1={by} x2={cx} y2={cy} strokeWidth={highlight === 'a' ? 2.5 : 2} className={sideA} />
      <line x1={ax} y1={ay} x2={cx} y2={cy} strokeWidth={highlight === 'b' ? 2.5 : 2} className={sideB} />
      <line x1={ax} y1={ay} x2={bx} y2={by} strokeWidth={highlight === 'c' ? 2.5 : 2} className={sideC} />

      {/* Right angle marker */}
      {rightAngleAt === 'C' && <RightAngleMarker x={cx} y={cy} angle={-(Math.PI - (alpha ?? 0))} />}
      {rightAngleAt === 'A' && <RightAngleMarker x={ax} y={ay} angle={0} />}
      {rightAngleAt === 'B' && <RightAngleMarker x={bx} y={by} angle={Math.PI} />}

      {/* Vertex labels */}
      <text x={ax - 14} y={ay + 4} fontSize="13" fontWeight="bold" fill="#1e293b">A</text>
      <text x={bx + 4} y={by + 4} fontSize="13" fontWeight="bold" fill="#1e293b">B</text>
      <text x={cx - 4} y={cy - 8} fontSize="13" fontWeight="bold" fill="#1e293b">C</text>

      {/* Side labels */}
      <text
        x={midA.x + labelOffset * Math.sign(midA.x - (ax + bx) / 2 || 1)}
        y={midA.y}
        fontSize="12"
        fill={highlight === 'a' ? '#d97706' : '#3b82f6'}
        fontWeight={highlight === 'a' ? 'bold' : 'normal'}
        textAnchor="middle"
      >
        a = {fmtSide(triangle.a)}
      </text>
      <text
        x={midB.x - labelOffset}
        y={midB.y}
        fontSize="12"
        fill={highlight === 'b' ? '#d97706' : '#3b82f6'}
        fontWeight={highlight === 'b' ? 'bold' : 'normal'}
        textAnchor="middle"
      >
        b = {fmtSide(triangle.b)}
      </text>
      <text
        x={midC.x}
        y={midC.y + labelOffset}
        fontSize="12"
        fill={highlight === 'c' ? '#d97706' : '#3b82f6'}
        fontWeight={highlight === 'c' ? 'bold' : 'normal'}
        textAnchor="middle"
      >
        c = {fmtSide(triangle.c)}
      </text>

      {/* Angle labels */}
      <text x={ax + 14} y={ay - 6} fontSize="11" fill="#ef4444">α={fmtAngle(alpha)}</text>
      <text x={bx - 44} y={by - 6} fontSize="11" fill="#ef4444">β={fmtAngle(beta)}</text>
      <text x={cx + 4} y={cy + 16} fontSize="11" fill="#ef4444">γ={fmtAngle(gamma)}</text>
    </svg>
  );
}
