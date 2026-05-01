// Conversion utilities
export const degToRad = (deg: number): number => (deg * Math.PI) / 180;
export const radToDeg = (rad: number): number => (rad * 180) / Math.PI;

// Round to given decimal places
export const round = (x: number, decimals = 4): number =>
  Math.round(x * 10 ** decimals) / 10 ** decimals;

// Format angle for display
export const formatAngle = (rad: number, mode: 'deg' | 'rad' = 'deg'): string => {
  if (mode === 'deg') return `${round(radToDeg(rad), 2)}°`;
  return `${round(rad, 4)} rad`;
};

// Format number to specified decimals
export const formatNum = (x: number, dec = 2): string => round(x, dec).toFixed(dec);

// Special angle values in radians
export const SPECIAL_ANGLES_RAD = [
  0,
  Math.PI / 6,   // 30°
  Math.PI / 4,   // 45°
  Math.PI / 3,   // 60°
  Math.PI / 2,   // 90°
  (2 * Math.PI) / 3, // 120°
  (3 * Math.PI) / 4, // 135°
  (5 * Math.PI) / 6, // 150°
  Math.PI,           // 180°
];

export interface GonioTableRow {
  degrees: number;
  radians: string;
  radiansValue: number;
  sin: string;
  cos: string;
  tan: string;
}

// Exact symbolic values for special angles
export const GONIO_TABLE: GonioTableRow[] = [
  { degrees: 0,   radians: '0',       radiansValue: 0,              sin: '0',            cos: '1',            tan: '0' },
  { degrees: 30,  radians: 'π/6',     radiansValue: Math.PI / 6,    sin: '1/2',          cos: '√3/2',         tan: '1/√3 = √3/3' },
  { degrees: 45,  radians: 'π/4',     radiansValue: Math.PI / 4,    sin: '√2/2',         cos: '√2/2',         tan: '1' },
  { degrees: 60,  radians: 'π/3',     radiansValue: Math.PI / 3,    sin: '√3/2',         cos: '1/2',          tan: '√3' },
  { degrees: 90,  radians: 'π/2',     radiansValue: Math.PI / 2,    sin: '1',            cos: '0',            tan: '±∞' },
  { degrees: 120, radians: '2π/3',    radiansValue: 2 * Math.PI/3,  sin: '√3/2',         cos: '−1/2',         tan: '−√3' },
  { degrees: 135, radians: '3π/4',    radiansValue: 3 * Math.PI/4,  sin: '√2/2',         cos: '−√2/2',        tan: '−1' },
  { degrees: 150, radians: '5π/6',    radiansValue: 5 * Math.PI/6,  sin: '1/2',          cos: '−√3/2',        tan: '−1/√3' },
  { degrees: 180, radians: 'π',       radiansValue: Math.PI,        sin: '0',            cos: '−1',           tan: '0' },
];

// Evaluate goniometric functions with exact results for special angles
export const sinExact = (rad: number): number => Math.sin(rad);
export const cosExact = (rad: number): number => Math.cos(rad);
export const tanExact = (rad: number): number => Math.tan(rad);

// Determine sign of sin/cos/tan in each quadrant
export const getQuadrant = (rad: number): 1 | 2 | 3 | 4 => {
  const normalized = ((rad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  if (normalized < Math.PI / 2) return 1;
  if (normalized < Math.PI) return 2;
  if (normalized < (3 * Math.PI) / 2) return 3;
  return 4;
};

export const QUADRANT_SIGNS = {
  1: { sin: '+', cos: '+', tan: '+' },
  2: { sin: '+', cos: '−', tan: '−' },
  3: { sin: '−', cos: '−', tan: '+' },
  4: { sin: '−', cos: '+', tan: '−' },
};

// Reference angle reduction formulas
export const REDUCTION_FORMULAS = [
  { from: 'sin(π − α)', to: 'sin α', note: 'druhý kvadrant' },
  { from: 'cos(π − α)', to: '−cos α', note: 'druhý kvadrant' },
  { from: 'sin(π + α)', to: '−sin α', note: 'třetí kvadrant' },
  { from: 'cos(π + α)', to: '−cos α', note: 'třetí kvadrant' },
  { from: 'sin(2π − α)', to: '−sin α', note: 'čtvrtý kvadrant' },
  { from: 'cos(2π − α)', to: 'cos α', note: 'čtvrtý kvadrant' },
  { from: 'sin(π/2 − α)', to: 'cos α', note: 'komplementární úhel' },
  { from: 'cos(π/2 − α)', to: 'sin α', note: 'komplementární úhel' },
];

// Pythagorean identity and derived identities
export const IDENTITIES = [
  { formula: 'sin²α + cos²α = 1', name: 'základní pythagorova identita' },
  { formula: 'tan α = sin α / cos α', name: 'definice tangensu' },
  { formula: '1 + tan²α = 1/cos²α', name: 'odvozená identita' },
];
