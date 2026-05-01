'use client';

import TriangleVisualizer from './TriangleVisualizer';

const CLS = 'bg-white rounded-lg border border-slate-200';

// ── Pre-computed triangle data (all sides/angles required by TriangleVisualizer) ──
const T1 = {
  alpha: 2 * Math.PI / 3,            // 120°
  beta:  Math.PI / 12,               // 15°
  gamma: Math.PI / 4,                // 45°
  c: 3,                              // |AB| = 3
  a: 3 * Math.sin(2*Math.PI/3) / Math.sin(Math.PI/4),  // ≈ 3.67
  b: 3 * Math.sin(Math.PI/12)  / Math.sin(Math.PI/4),  // ≈ 1.10
};
const T2 = {
  alpha: Math.PI / 6,                // 30°
  beta:  Math.asin(3 * Math.sin(Math.PI/6) / Math.sqrt(34 - 30*Math.cos(Math.PI/6))),
  gamma: Math.PI - Math.PI/6 - Math.asin(3 * Math.sin(Math.PI/6) / Math.sqrt(34 - 30*Math.cos(Math.PI/6))),
  b: 3, c: 5,
  a: Math.sqrt(34 - 30 * Math.cos(Math.PI/6)),   // ≈ 2.83
};
const T3 = {
  alpha: 2 * Math.PI / 3,            // 120°
  beta:  Math.PI / 4,                // 45°
  gamma: Math.PI / 12,               // 15°
  a: 2 * Math.sqrt(6),
  c: 4,
  b: 2 * Math.sqrt(6) * Math.sin(Math.PI/12) / Math.sin(2*Math.PI/3),  // ≈ 1.46
};

// ── t4: Two tourists diverging at 60° ─────────────────────────────────────
function TouristSVG() {
  const ox = 20, oy = 130;
  const ang = Math.PI / 3;
  const p1x = ox + 155, p1y = oy;
  const p2x = ox + 125 * Math.cos(ang);
  const p2y = oy  - 125 * Math.sin(ang);
  const arcR = 36;
  return (
    <svg width={220} height={155} viewBox="0 0 220 155" className={CLS}>
      <line x1={ox} y1={oy} x2={p1x} y2={p1y} stroke="#475569" strokeWidth="2" />
      <line x1={ox} y1={oy} x2={p2x} y2={p2y} stroke="#475569" strokeWidth="2" />
      <line x1={p1x} y1={p1y} x2={p2x} y2={p2y} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,3" />
      <path
        d={`M ${ox+arcR},${oy} A ${arcR},${arcR} 0 0 0 ${ox+arcR*Math.cos(ang)},${oy-arcR*Math.sin(ang)}`}
        fill="none" stroke="#3b82f6" strokeWidth="1.5"
      />
      <text x={(ox+p1x)/2} y={oy+14} textAnchor="middle" fontSize="11" fill="#475569">d₁ = 1,25 km</text>
      <text x={(ox+p2x)/2-6} y={(oy+p2y)/2-2} textAnchor="end" fontSize="11" fill="#475569">d₂ = 1,75 km</text>
      <text x={ox+42} y={oy-8} fontSize="10" fill="#3b82f6">π/3</text>
      <text x={(p1x+p2x)/2+6} y={(p1y+p2y)/2} fontSize="11" fill="#ef4444" fontWeight="bold">d = ?</text>
      <circle cx={ox}  cy={oy}  r="3" fill="#1e293b" />
      <circle cx={p1x} cy={p1y} r="3" fill="#475569" />
      <circle cx={p2x} cy={p2y} r="3" fill="#475569" />
      <text x={ox-3} y={oy+14} fontSize="11" fontWeight="bold" fill="#1e293b" textAnchor="middle">O</text>
    </svg>
  );
}

// ── t5: Viewing angle ──────────────────────────────────────────────────────
function ViewingAngleSVG() {
  // Scale: 7 m → 105 px  (15 px/m)
  const sc = 15;
  const ax = 50, ay = 112;
  const bx = ax + 7*sc, by = ay;
  // cosine rule for angle at A
  const cosA = (5*5 + 7*7 - 8*8) / (2*5*7);   // = 1/7
  const sinA = Math.sqrt(1 - cosA*cosA);
  const ox = ax + 5*sc*cosA;
  const oy = ay - 5*sc*sinA;
  // small arc at O for angle φ
  const d1x = ax - ox, d1y = ay - oy;
  const d2x = bx - ox, d2y = by - oy;
  const l1 = Math.hypot(d1x, d1y), l2 = Math.hypot(d2x, d2y);
  const r = 22;
  const arcSx = ox + r*d1x/l1, arcSy = oy + r*d1y/l1;
  const arcEx = ox + r*d2x/l2, arcEy = oy + r*d2y/l2;
  const cross = d1x*d2y - d1y*d2x;
  const sweep = cross > 0 ? 1 : 0;
  return (
    <svg width={210} height={135} viewBox="0 0 210 135" className={CLS}>
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#3b82f6" strokeWidth="3" />
      <line x1={ox} y1={oy} x2={ax} y2={ay} stroke="#475569" strokeWidth="2" />
      <line x1={ox} y1={oy} x2={bx} y2={by} stroke="#475569" strokeWidth="2" />
      <path d={`M ${arcSx},${arcSy} A ${r},${r} 0 0 ${sweep} ${arcEx},${arcEy}`}
        fill="none" stroke="#ef4444" strokeWidth="2" />
      <text x={(ax+bx)/2} y={ay+14} textAnchor="middle" fontSize="11" fill="#3b82f6">7 m (předmět)</text>
      <text x={(ox+ax)/2-4} y={(oy+ay)/2+4} textAnchor="end" fontSize="11" fill="#475569">5 m</text>
      <text x={(ox+bx)/2+4} y={(oy+by)/2+4} fontSize="11" fill="#475569">8 m</text>
      <text x={ox+4} y={oy+18} fontSize="11" fill="#ef4444" fontWeight="bold">φ = ?</text>
      <circle cx={ox} cy={oy} r="3" fill="#1e293b" />
      <text x={ox} y={oy-7} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">O</text>
      <text x={ax-12} y={ay+4} fontSize="11" fontWeight="bold" fill="#1e293b">A</text>
      <text x={bx+4} y={by+4} fontSize="11" fontWeight="bold" fill="#1e293b">B</text>
    </svg>
  );
}

// ── t6: Tower on hill ──────────────────────────────────────────────────────
function TowerSVG() {
  // P = observer, H = hill peak (base of tower), T = tower top
  // α=45°: angle from P to H;  β=60°: angle from P to T
  // With horizontal distance d=55: H=(75,65), T=(75,25) — verified below:
  //   tan(45°)=(120-65)/55=1 ✓   tan(60°)=(120-25)/55=95/55≈1.727≈√3 ✓
  const px = 20, py = 120;
  const hx = 75, hy = 65;
  const tx = 75, ty = 25;
  const alpha = Math.PI / 4, beta = Math.PI / 3;
  const arcA = 38, arcB = 22;
  return (
    <svg width={210} height={140} viewBox="0 0 210 140" className={CLS}>
      {/* ground */}
      <line x1={px} y1={py} x2={200} y2={py} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3" />
      {/* hill slope */}
      <line x1={px} y1={py} x2={hx} y2={hy} stroke="#475569" strokeWidth="2" />
      {/* tower */}
      <line x1={hx} y1={hy} x2={tx} y2={ty} stroke="#475569" strokeWidth="3" />
      {/* dotted sight lines */}
      <line x1={px} y1={py} x2={hx} y2={hy} stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" opacity=".7"/>
      <line x1={px} y1={py} x2={tx} y2={ty} stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,3" opacity=".7"/>
      {/* angle arcs at P */}
      <path
        d={`M ${px+arcA},${py} A ${arcA},${arcA} 0 0 0 ${px+arcA*Math.cos(alpha)},${py-arcA*Math.sin(alpha)}`}
        fill="none" stroke="#ef4444" strokeWidth="1.5"
      />
      <path
        d={`M ${px+arcB},${py} A ${arcB},${arcB} 0 0 0 ${px+arcB*Math.cos(beta)},${py-arcB*Math.sin(beta)}`}
        fill="none" stroke="#3b82f6" strokeWidth="1.5"
      />
      {/* labels */}
      <text x={px+46} y={py-8}  fontSize="10" fill="#ef4444">α = π/4</text>
      <text x={px+24} y={py-24} fontSize="10" fill="#3b82f6">β = π/3</text>
      <text x={tx+6} y={(hy+ty)/2+4} fontSize="10" fill="#475569">42 m</text>
      <text x={hx+6} y={hy+14}        fontSize="10" fill="#1e293b">h = ?</text>
      <circle cx={px} cy={py} r="3" fill="#1e293b" />
      <text x={px-14} y={py+4} fontSize="11" fontWeight="bold" fill="#1e293b">P</text>
      <circle cx={hx} cy={hy} r="2.5" fill="#475569" />
      <circle cx={tx} cy={ty} r="2.5" fill="#475569" />
    </svg>
  );
}

// ── t7: Circle with tangent lines ──────────────────────────────────────────
function CircleSVG() {
  const sx = 72, sy = 85, r = 48;
  const vx = 200, vy = 85;
  const vs  = Math.hypot(vx-sx, vy-sy);    // 128
  const tl  = Math.sqrt(vs*vs - r*r);       // tangent length
  const cA  = tl / vs, sA = r / vs;         // cos/sin of tangent half-angle
  // T1 (top), T2 (bottom): measured from V along tangent directions
  const t1x = vx - tl*cA, t1y = vy - tl*sA;
  const t2x = vx - tl*cA, t2y = vy + tl*sA;
  // Midpoint M of T1T2
  const mx = (t1x+t2x)/2, my = (t1y+t2y)/2;
  // right-angle mark helper (small L at tangent point)
  function raSquare(tx2: number, ty2: number, toS: [number,number], toV: [number,number], size=6) {
    const nS = [toS[0]/Math.hypot(...toS), toS[1]/Math.hypot(...toS)];
    const nV = [toV[0]/Math.hypot(...toV), toV[1]/Math.hypot(...toV)];
    const px2 = tx2 + size*nS[0], py2 = ty2 + size*nS[1];
    const qx  = px2   + size*nV[0], qy  = py2   + size*nV[1];
    const rx2 = tx2 + size*nV[0], ry2 = ty2 + size*nV[1];
    return `M ${px2},${py2} L ${qx},${qy} L ${rx2},${ry2}`;
  }
  const ra1 = raSquare(t1x, t1y, [sx-t1x, sy-t1y], [vx-t1x, vy-t1y]);
  const ra2 = raSquare(t2x, t2y, [sx-t2x, sy-t2y], [vx-t2x, vy-t2y]);
  return (
    <svg width={230} height={175} viewBox="0 0 230 175" className={CLS}>
      <circle cx={sx} cy={sy} r={r} fill="none" stroke="#475569" strokeWidth="2" />
      {/* radii */}
      <line x1={sx} y1={sy} x2={t1x} y2={t1y} stroke="#94a3b8" strokeWidth="1.2" />
      <line x1={sx} y1={sy} x2={t2x} y2={t2y} stroke="#94a3b8" strokeWidth="1.2" />
      {/* tangent lines */}
      <line x1={vx} y1={vy} x2={t1x} y2={t1y} stroke="#475569" strokeWidth="2" />
      <line x1={vx} y1={vy} x2={t2x} y2={t2y} stroke="#475569" strokeWidth="2" />
      {/* chord T1T2 */}
      <line x1={t1x} y1={t1y} x2={t2x} y2={t2y} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5,3" />
      {/* S–V dashed line of symmetry */}
      <line x1={sx} y1={sy} x2={vx} y2={vy} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" opacity=".5" />
      {/* right-angle marks */}
      <path d={ra1} fill="none" stroke="#475569" strokeWidth="1.2" />
      <path d={ra2} fill="none" stroke="#475569" strokeWidth="1.2" />
      {/* labels */}
      <text x={sx} y={sy-r-7} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e293b">S</text>
      <text x={vx+6} y={vy+4} fontSize="12" fontWeight="bold" fill="#1e293b">V</text>
      <text x={t1x-20} y={t1y-5} fontSize="11" fill="#1e293b">T₁</text>
      <text x={t2x-20} y={t2y+14} fontSize="11" fill="#1e293b">T₂</text>
      <text x={(sx+t1x)/2-14} y={(sy+t1y)/2+2} fontSize="10" fill="#94a3b8">r = 5</text>
      <text x={mx+5} y={my+4} fontSize="10" fill="#3b82f6">|T₁T₂| = 8</text>
      <text x={(sx+vx)/2} y={sy+16} textAnchor="middle" fontSize="10" fill="#ef4444">|VS| = ?</text>
      <circle cx={sx} cy={sy} r="3" fill="#475569" />
      <circle cx={vx} cy={vy} r="3" fill="#1e293b" />
      <circle cx={t1x} cy={t1y} r="2.5" fill="#475569" />
      <circle cx={t2x} cy={t2y} r="2.5" fill="#475569" />
    </svg>
  );
}

// ── t8: Quadrilateral ABCD with diagonal AC ────────────────────────────────
function QuadrilateralSVG() {
  // B bottom-left, A bottom-right, D top-right, C top-left
  const bx = 28,  by = 138;
  const ax = 185, ay = 138;
  const dx = 172, dy = 32;
  const cx = 48,  cy = 32;
  // equal-angle arc helper
  function angleArc(vx: number, vy: number, p1x: number, p1y: number,
                    p2x: number, p2y: number, ri: number, ro: number) {
    const d1x=p1x-vx, d1y=p1y-vy, d2x=p2x-vx, d2y=p2y-vy;
    const l1=Math.hypot(d1x,d1y), l2=Math.hypot(d2x,d2y);
    const sx=vx+ri*d1x/l1, sy=vy+ri*d1y/l1;
    const ex=vx+ri*d2x/l2, ey=vy+ri*d2y/l2;
    const cross=d1x*d2y-d1y*d2x;
    const sw=cross>0?1:0;
    // outer arc (slightly larger radius for double-arc mark)
    const sx2=vx+ro*d1x/l1, sy2=vy+ro*d1y/l1;
    const ex2=vx+ro*d2x/l2, ey2=vy+ro*d2y/l2;
    return { inner:`M ${sx},${sy} A ${ri},${ri} 0 0 ${sw} ${ex},${ey}`,
             outer:`M ${sx2},${sy2} A ${ro},${ro} 0 0 ${sw} ${ex2},${ey2}` };
  }
  // α pair: angle at A (in △ABC) and angle at C (in △ACD) — both between diagonal AC and a side
  const arcA = angleArc(ax, ay, cx, cy, bx, by, 22, 28);   // angle between AC and AB at A
  const arcC = angleArc(cx, cy, ax, ay, dx, dy, 22, 28);   // angle between CA and CD at C
  // β pair: angle at B and D
  const arcB = angleArc(bx, by, ax, ay, cx, cy, 22, 28);
  const arcD = angleArc(dx, dy, cx, cy, ax, ay, 22, 28);

  return (
    <svg width={220} height={168} viewBox="0 0 220 168" className={CLS}>
      {/* sides */}
      <line x1={bx} y1={by} x2={ax} y2={ay} stroke="#475569" strokeWidth="2" />
      <line x1={ax} y1={ay} x2={dx} y2={dy} stroke="#475569" strokeWidth="2" />
      <line x1={dx} y1={dy} x2={cx} y2={cy} stroke="#475569" strokeWidth="2" />
      <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#475569" strokeWidth="2" />
      {/* diagonal AC */}
      <line x1={ax} y1={ay} x2={cx} y2={cy} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5,3" />
      {/* equal angle arcs — α pair (single arc) */}
      <path d={arcA.inner} fill="none" stroke="#ef4444" strokeWidth="1.5" />
      <path d={arcC.inner} fill="none" stroke="#ef4444" strokeWidth="1.5" />
      {/* β pair (double arc) */}
      <path d={arcB.inner} fill="none" stroke="#10b981" strokeWidth="1.5" />
      <path d={arcB.outer} fill="none" stroke="#10b981" strokeWidth="1.5" />
      <path d={arcD.inner} fill="none" stroke="#10b981" strokeWidth="1.5" />
      <path d={arcD.outer} fill="none" stroke="#10b981" strokeWidth="1.5" />
      {/* vertex labels */}
      <text x={ax+5}  y={ay+5}  fontSize="12" fontWeight="bold" fill="#1e293b">A</text>
      <text x={bx-16} y={by+5}  fontSize="12" fontWeight="bold" fill="#1e293b">B</text>
      <text x={cx-16} y={cy-4}  fontSize="12" fontWeight="bold" fill="#1e293b">C</text>
      <text x={dx+5}  y={dy-4}  fontSize="12" fontWeight="bold" fill="#1e293b">D</text>
      {/* side length labels */}
      <text x={(ax+cx)/2+4} y={(ay+cy)/2-4} fontSize="10" fill="#3b82f6">AC = 4,2</text>
      <text x={(dx+cx)/2}   y={dy-10}        fontSize="10" fill="#475569" textAnchor="middle">CD = 5,6</text>
      <text x={cx-10}       y={(cy+by)/2+4}  fontSize="10" fill="#475569" textAnchor="end">BC = 2,7</text>
    </svg>
  );
}

// ── Main dispatcher ────────────────────────────────────────────────────────
export default function TestDiagram({ problemId }: { problemId: string }) {
  if (problemId === 't1') return <TriangleVisualizer triangle={T1} width={240} height={160} />;
  if (problemId === 't2') return <TriangleVisualizer triangle={T2} width={240} height={160} />;
  if (problemId === 't3') return <TriangleVisualizer triangle={T3} width={240} height={160} />;
  if (problemId === 't4') return <TouristSVG />;
  if (problemId === 't5') return <ViewingAngleSVG />;
  if (problemId === 't6') return <TowerSVG />;
  if (problemId === 't7') return <CircleSVG />;
  if (problemId === 't8') return <QuadrilateralSVG />;
  return null;
}
