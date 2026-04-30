import { Triangle, TriangleSolution } from './types';
import { round } from './goniometry';

const EPS = 1e-9;

// Validate a fully determined triangle
function validateTriangle(t: Triangle): boolean {
  const { a, b, c, alpha, beta, gamma } = t;
  if (!a || !b || !c || alpha === undefined || beta === undefined || gamma === undefined)
    return false;
  if (a <= 0 || b <= 0 || c <= 0) return false;
  if (alpha <= 0 || beta <= 0 || gamma <= 0) return false;
  const angleSum = alpha + beta + gamma;
  if (Math.abs(angleSum - Math.PI) > 1e-6) return false;
  return true;
}

function roundTriangle(t: Triangle): Triangle {
  return {
    a: t.a !== undefined ? round(t.a, 6) : undefined,
    b: t.b !== undefined ? round(t.b, 6) : undefined,
    c: t.c !== undefined ? round(t.c, 6) : undefined,
    alpha: t.alpha !== undefined ? round(t.alpha, 8) : undefined,
    beta: t.beta !== undefined ? round(t.beta, 8) : undefined,
    gamma: t.gamma !== undefined ? round(t.gamma, 8) : undefined,
  };
}

// SSS – three sides given
export function solveSSS(a: number, b: number, c: number): TriangleSolution {
  if (a <= 0 || b <= 0 || c <= 0)
    return { triangle: {}, valid: false, error: 'Strany musí být kladné.' };
  if (a + b <= c || a + c <= b || b + c <= a)
    return { triangle: {}, valid: false, error: 'Trojúhelníková nerovnost není splněna.' };

  // Kosínová věta: cos α = (b² + c² − a²) / (2bc)
  const cosAlpha = (b * b + c * c - a * a) / (2 * b * c);
  const cosBeta  = (a * a + c * c - b * b) / (2 * a * c);
  const alpha = Math.acos(cosAlpha);
  const beta  = Math.acos(cosBeta);
  const gamma = Math.PI - alpha - beta;

  const t = roundTriangle({ a, b, c, alpha, beta, gamma });
  return { triangle: t, valid: validateTriangle(t) };
}

// SAS – two sides and the included angle
export function solveSAS(a: number, gamma: number, b: number): TriangleSolution {
  if (a <= 0 || b <= 0)
    return { triangle: {}, valid: false, error: 'Strany musí být kladné.' };
  if (gamma <= 0 || gamma >= Math.PI)
    return { triangle: {}, valid: false, error: 'Úhel γ musí být v intervalu (0, π).' };

  // c² = a² + b² − 2ab·cos γ
  const c2 = a * a + b * b - 2 * a * b * Math.cos(gamma);
  if (c2 <= EPS)
    return { triangle: {}, valid: false, error: 'Trojúhelník neexistuje.' };
  const c = Math.sqrt(c2);

  // Sinová věta pro zbývající úhly
  const sinAlpha = (a * Math.sin(gamma)) / c;
  const alpha = Math.asin(Math.min(1, Math.abs(sinAlpha))) * Math.sign(sinAlpha);
  const beta = Math.PI - alpha - gamma;

  const t = roundTriangle({ a, b, c, alpha, beta, gamma });
  return { triangle: t, valid: validateTriangle(t) };
}

// ASA – angle, included side, angle
export function solveASA(alpha: number, c: number, beta: number): TriangleSolution {
  if (c <= 0)
    return { triangle: {}, valid: false, error: 'Strana musí být kladná.' };
  if (alpha <= 0 || beta <= 0 || alpha + beta >= Math.PI)
    return { triangle: {}, valid: false, error: 'Součet úhlů musí být menší než π.' };

  const gamma = Math.PI - alpha - beta;
  // Sinová věta: a/sin α = c/sin γ
  const a = (c * Math.sin(alpha)) / Math.sin(gamma);
  const b = (c * Math.sin(beta))  / Math.sin(gamma);

  const t = roundTriangle({ a, b, c, alpha, beta, gamma });
  return { triangle: t, valid: validateTriangle(t) };
}

// AAS – two angles and a non-included side
export function solveAAS(alpha: number, beta: number, a: number): TriangleSolution {
  if (a <= 0)
    return { triangle: {}, valid: false, error: 'Strana musí být kladná.' };
  if (alpha <= 0 || beta <= 0 || alpha + beta >= Math.PI)
    return { triangle: {}, valid: false, error: 'Součet úhlů musí být menší než π.' };

  const gamma = Math.PI - alpha - beta;
  const b = (a * Math.sin(beta))  / Math.sin(alpha);
  const c = (a * Math.sin(gamma)) / Math.sin(alpha);

  const t = roundTriangle({ a, b, c, alpha, beta, gamma });
  return { triangle: t, valid: validateTriangle(t) };
}

// SSA – two sides and non-included angle (ambiguous case / případ nejednoznačnosti)
// Given: side a (opposite to α), side b, angle α
export function solveSSA(a: number, b: number, alpha: number): TriangleSolution {
  if (a <= 0 || b <= 0)
    return { triangle: {}, valid: false, error: 'Strany musí být kladné.' };
  if (alpha <= 0 || alpha >= Math.PI)
    return { triangle: {}, valid: false, error: 'Úhel musí být v intervalu (0, π).' };

  // sin β = b·sin α / a
  const sinBeta = (b * Math.sin(alpha)) / a;

  if (sinBeta > 1 + EPS)
    return { triangle: {}, valid: false, error: 'Trojúhelník neexistuje (sin β > 1).' };

  if (Math.abs(sinBeta - 1) < EPS) {
    // Exactly one solution: β = π/2 (right triangle)
    const beta = Math.PI / 2;
    const gamma = Math.PI - alpha - beta;
    const c = (a * Math.sin(gamma)) / Math.sin(alpha);
    const t = roundTriangle({ a, b, c, alpha, beta, gamma });
    return { triangle: t, valid: true };
  }

  // Two potential solutions
  const beta1 = Math.asin(sinBeta);
  const beta2 = Math.PI - beta1;

  const solutions: Triangle[] = [];

  // Solution 1
  const gamma1 = Math.PI - alpha - beta1;
  if (gamma1 > EPS) {
    const c1 = (a * Math.sin(gamma1)) / Math.sin(alpha);
    const t1 = roundTriangle({ a, b, c: c1, alpha, beta: beta1, gamma: gamma1 });
    if (validateTriangle(t1)) solutions.push(t1);
  }

  // Solution 2
  const gamma2 = Math.PI - alpha - beta2;
  if (gamma2 > EPS) {
    const c2 = (a * Math.sin(gamma2)) / Math.sin(alpha);
    const t2 = roundTriangle({ a, b, c: c2, alpha, beta: beta2, gamma: gamma2 });
    if (validateTriangle(t2)) solutions.push(t2);
  }

  if (solutions.length === 0)
    return { triangle: {}, valid: false, error: 'Trojúhelník neexistuje.' };

  if (solutions.length === 2)
    return { triangle: solutions[0], valid: true, ambiguous: true, solutions };

  return { triangle: solutions[0], valid: true, ambiguous: false };
}

// Solve right triangle given hypotenuse c and angle alpha
export function solveRightTriangle(
  given: Partial<{ a: number; b: number; c: number; alpha: number; beta: number }>
): TriangleSolution {
  const gamma = Math.PI / 2; // right angle at C

  let { a, b, c, alpha, beta } = given;

  // Derive from known values
  if (c !== undefined && alpha !== undefined) {
    a = c * Math.sin(alpha);
    b = c * Math.cos(alpha);
    beta = Math.PI / 2 - alpha;
  } else if (c !== undefined && beta !== undefined) {
    b = c * Math.sin(beta);
    a = c * Math.cos(beta);
    alpha = Math.PI / 2 - beta;
  } else if (a !== undefined && alpha !== undefined) {
    c = a / Math.sin(alpha);
    b = a / Math.tan(alpha);
    beta = Math.PI / 2 - alpha;
  } else if (a !== undefined && b !== undefined) {
    c = Math.sqrt(a * a + b * b);
    alpha = Math.atan(a / b);
    beta = Math.PI / 2 - alpha;
  } else if (a !== undefined && c !== undefined) {
    b = Math.sqrt(c * c - a * a);
    alpha = Math.asin(a / c);
    beta = Math.PI / 2 - alpha;
  } else {
    return { triangle: {}, valid: false, error: 'Nedostatečné vstupní údaje.' };
  }

  const t = roundTriangle({ a, b, c, alpha, beta, gamma });
  return { triangle: t, valid: validateTriangle(t) };
}

// Area of triangle from three sides (Heron's formula)
export function heronArea(a: number, b: number, c: number): number {
  const s = (a + b + c) / 2;
  return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}

// Area from two sides and included angle
export function areaFromSAS(a: number, b: number, gamma: number): number {
  return 0.5 * a * b * Math.sin(gamma);
}

// Circumradius R = a / (2 sin α)
export function circumRadius(a: number, alpha: number): number {
  return a / (2 * Math.sin(alpha));
}

// Inradius r = Area / s
export function inRadius(a: number, b: number, c: number): number {
  const s = (a + b + c) / 2;
  return heronArea(a, b, c) / s;
}
