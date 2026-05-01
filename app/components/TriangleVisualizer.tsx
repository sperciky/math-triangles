'use client';

import { Triangle } from '../math/types';
import { radToDeg, round } from '../math/goniometry';

export type HighlightEl = 'a' | 'b' | 'c' | 'alpha' | 'beta' | 'gamma';

interface Props {
  triangle: Triangle;
  rightAngleAt?: 'C' | 'A' | 'B';
  highlight?: HighlightEl[];
  width?: number;
  height?: number;
  fullWidth?: boolean;
}

function layoutTriangle(t: Triangle, w: number, h: number) {
  const { a = 1, b = 1, c = 1 } = t;
  const pad = 40;
  const scaleW = (w - 2 * pad) / c;
  const scale = Math.min(scaleW, (h - 2 * pad) / (b * 0.9));

  const ax = pad;
  const ay = h - pad;
  const bx = pad + c * scale;
  const by = h - pad;

  const alpha = t.alpha ?? 0;
  const cx = ax + b * scale * Math.cos(alpha);
  const cy = ay - b * scale * Math.sin(alpha);

  return { ax, ay, bx, by, cx, cy, scale };
}

// SVG arc path for the interior angle at vertex V between rays VP1 and VP2
function angleArcPath(
  vx: number, vy: number,
  p1x: number, p1y: number,
  p2x: number, p2y: number,
  r: number,
): string {
  const d1x = p1x - vx, d1y = p1y - vy;
  const d2x = p2x - vx, d2y = p2y - vy;
  const len1 = Math.hypot(d1x, d1y);
  const len2 = Math.hypot(d2x, d2y);
  const sx = vx + r * d1x / len1;
  const sy = vy + r * d1y / len1;
  const ex = vx + r * d2x / len2;
  const ey = vy + r * d2y / len2;
  // In SVG (y-down): cross > 0 → d1→d2 is clockwise → sweep=1 gives the short arc
  const cross = d1x * d2y - d1y * d2x;
  const sweep = cross > 0 ? 1 : 0;
  return `M ${sx.toFixed(2)},${sy.toFixed(2)} A ${r},${r} 0 0 ${sweep} ${ex.toFixed(2)},${ey.toFixed(2)}`;
}

function RightAngleMarker({
  x, y, angle, size = 10, color = '#475569',
}: { x: number; y: number; angle: number; size?: number; color?: string }) {
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
      stroke={color}
      strokeWidth="1.5"
    />
  );
}

export default function TriangleVisualizer({
  triangle,
  rightAngleAt,
  highlight = [],
  width = 340,
  height = 220,
  fullWidth = false,
}: Props) {
  if (!triangle.a || !triangle.b || !triangle.c || triangle.alpha === undefined) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-400 text-sm italic border border-slate-200 rounded-lg">
        Doplňte hodnoty trojúhelníku
      </div>
    );
  }

  const { ax, ay, bx, by, cx, cy } = layoutTriangle(triangle, width, height);
  const { alpha, beta } = triangle;

  const hl = new Set(highlight);
  const AMBER = '#f59e0b';
  const arcR = Math.max(16, Math.min(24, Math.hypot(bx - ax, by - ay) * 0.13));

  const fmtAngle = (r: number | undefined) =>
    r !== undefined ? `${round(radToDeg(r), 1)}°` : '';
  const fmtSide = (v: number | undefined) =>
    v !== undefined ? `${round(v, 2)}` : '';

  const midA = { x: (bx + cx) / 2, y: (by + cy) / 2 };
  const midB = { x: (ax + cx) / 2, y: (ay + cy) / 2 };
  const midC = { x: (ax + bx) / 2, y: (ay + by) / 2 };
  const labelOffset = 14;

  return (
    <svg
      width={fullWidth ? '100%' : width}
      height={fullWidth ? undefined : height}
      viewBox={`0 0 ${width} ${height}`}
      className="bg-white rounded-lg border border-slate-200"
    >

      {/* ── Sides ── */}
      <line x1={bx} y1={by} x2={cx} y2={cy}
        stroke={hl.has('a') ? AMBER : '#475569'}
        strokeWidth={hl.has('a') ? 3 : 2} />
      <line x1={ax} y1={ay} x2={cx} y2={cy}
        stroke={hl.has('b') ? AMBER : '#475569'}
        strokeWidth={hl.has('b') ? 3 : 2} />
      <line x1={ax} y1={ay} x2={bx} y2={by}
        stroke={hl.has('c') ? AMBER : '#475569'}
        strokeWidth={hl.has('c') ? 3 : 2} />

      {/* ── Angle arcs — all three vertices always shown ── */}
      <path
        d={angleArcPath(ax, ay, bx, by, cx, cy, arcR)}
        fill="none"
        stroke={hl.has('alpha') ? AMBER : '#94a3b8'}
        strokeWidth={hl.has('alpha') ? 2.5 : 1.5}
      />
      <path
        d={angleArcPath(bx, by, ax, ay, cx, cy, arcR)}
        fill="none"
        stroke={hl.has('beta') ? AMBER : '#94a3b8'}
        strokeWidth={hl.has('beta') ? 2.5 : 1.5}
      />
      <path
        d={angleArcPath(cx, cy, ax, ay, bx, by, arcR)}
        fill="none"
        stroke={hl.has('gamma') ? AMBER : '#94a3b8'}
        strokeWidth={hl.has('gamma') ? 2.5 : 1.5}
      />

      {/* ── Right-angle square markers (drawn on top of arc) ── */}
      {rightAngleAt === 'C' && (
        <RightAngleMarker x={cx} y={cy} angle={-(Math.PI - (alpha ?? 0))}
          color={hl.has('gamma') ? AMBER : '#475569'} />
      )}
      {rightAngleAt === 'A' && (
        <RightAngleMarker x={ax} y={ay} angle={0}
          color={hl.has('alpha') ? AMBER : '#475569'} />
      )}
      {rightAngleAt === 'B' && (
        <RightAngleMarker x={bx} y={by} angle={Math.PI}
          color={hl.has('beta') ? AMBER : '#475569'} />
      )}

      {/* ── Vertex labels ── */}
      <text x={ax - 14} y={ay + 4} fontSize="13" fontWeight="bold" fill="#1e293b">A</text>
      <text x={bx + 4}  y={by + 4} fontSize="13" fontWeight="bold" fill="#1e293b">B</text>
      <text x={cx - 4}  y={cy - 8} fontSize="13" fontWeight="bold" fill="#1e293b">C</text>

      {/* ── Side labels ── */}
      <text
        x={midA.x + labelOffset * Math.sign(midA.x - (ax + bx) / 2 || 1)}
        y={midA.y}
        fontSize="12"
        fill={hl.has('a') ? AMBER : '#3b82f6'}
        fontWeight={hl.has('a') ? 'bold' : 'normal'}
        textAnchor="middle"
      >a = {fmtSide(triangle.a)}</text>
      <text
        x={midB.x - labelOffset}
        y={midB.y}
        fontSize="12"
        fill={hl.has('b') ? AMBER : '#3b82f6'}
        fontWeight={hl.has('b') ? 'bold' : 'normal'}
        textAnchor="middle"
      >b = {fmtSide(triangle.b)}</text>
      <text
        x={midC.x}
        y={midC.y + labelOffset}
        fontSize="12"
        fill={hl.has('c') ? AMBER : '#3b82f6'}
        fontWeight={hl.has('c') ? 'bold' : 'normal'}
        textAnchor="middle"
      >c = {fmtSide(triangle.c)}</text>

      {/* ── Angle labels (α and β only; γ is indicated by the square marker) ── */}
      <text x={ax + arcR + 6} y={ay - 6} fontSize="11"
        fill={hl.has('alpha') ? AMBER : '#ef4444'}
        fontWeight={hl.has('alpha') ? 'bold' : 'normal'}>
        α={fmtAngle(alpha)}
      </text>
      <text x={bx - 52} y={by - 6} fontSize="11"
        fill={hl.has('beta') ? AMBER : '#ef4444'}
        fontWeight={hl.has('beta') ? 'bold' : 'normal'}>
        β={fmtAngle(beta)}
      </text>
    </svg>
  );
}
