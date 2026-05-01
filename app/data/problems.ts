import { Problem } from '../math/types';
import { degToRad } from '../math/goniometry';

export const PROBLEMS: Problem[] = [
  // ─── LEVEL 1: Goniometrické funkce ───────────────────────────────────────
  {
    id: 'l1-q1',
    level: 1,
    type: 'multiple-choice',
    question: 'Která z následujících hodnot je správná? sin(π/6) = ?',
    choices: [
      { id: 'a', text: '√3/2 ≈ 0,866' },
      { id: 'b', text: '1/2 = 0,5' },
      { id: 'c', text: '√2/2 ≈ 0,707' },
      { id: 'd', text: '1' },
    ],
    correctAnswer: 'b',
    points: 2,
    solution: [
      {
        title: 'Rozbor',
        content: 'π/6 radiánů odpovídá 30°. Jde o základní hodnotu, kterou je třeba znát zpaměti.',
      },
      {
        title: 'Jednotková kružnice',
        content: 'Na jednotkové kružnici platí: bod odpovídající úhlu 30° má souřadnice (cos 30°, sin 30°) = (√3/2, 1/2).',
        formula: 'sin(30°) = sin(π/6) = 1/2',
      },
      {
        title: 'Výsledek',
        content: 'sin(π/6) = 1/2 = 0,5',
        result: '1/2',
      },
    ],
  },
  {
    id: 'l1-q2',
    level: 1,
    type: 'multiple-choice',
    question: 'Co platí pro každý úhel α?',
    choices: [
      { id: 'a', text: 'sin α + cos α = 1' },
      { id: 'b', text: 'sin²α + cos²α = 1' },
      { id: 'c', text: 'sin α · cos α = 1' },
      { id: 'd', text: 'sin²α − cos²α = 1' },
    ],
    correctAnswer: 'b',
    points: 2,
    solution: [
      {
        title: 'Pythagorova identita',
        content: 'Na jednotkové kružnici leží bod P = (cos α, sin α). Vzdálenost P od středu je vždy 1 (poloměr).',
        formula: '|OP|² = cos²α + sin²α = 1²',
      },
      {
        title: 'Výsledek',
        content: 'Proto platí sin²α + cos²α = 1 pro všechna α ∈ ℝ. Ostatní možnosti jsou snadno vyvrátitelné dosazením, např. α = 0.',
        result: 'sin²α + cos²α = 1',
      },
    ],
  },
  {
    id: 'l1-q3',
    level: 1,
    type: 'numerical',
    question: 'Vypočítejte: cos(2π/3). Zadejte výsledek jako desetinné číslo zaokrouhlené na 2 desetinná místa.',
    correctAnswer: -0.5,
    tolerance: 0.01,
    points: 3,
    hint: 'Použijte redukční vzorec: cos(π − α) = −cos α, kde α = π/3.',
    solution: [
      {
        title: 'Redukce úhlu',
        content: '2π/3 = π − π/3, takže leží ve druhém kvadrantu (90° až 180°).',
        formula: 'cos(2π/3) = cos(π − π/3) = −cos(π/3)',
      },
      {
        title: 'Výpočet',
        content: 'cos(π/3) = cos(60°) = 1/2',
        formula: 'cos(2π/3) = −1/2 = −0,5',
      },
      {
        title: 'Výsledek',
        content: 'Ve druhém kvadrantu je kosinus záporný, což souhlasí.',
        result: '−0,5',
      },
    ],
  },
  {
    id: 'l1-q4',
    level: 1,
    type: 'multiple-choice',
    question: 'V jakém kvadrantu je sin α < 0 a cos α > 0?',
    choices: [
      { id: 'a', text: 'I. kvadrant (0 < α < π/2)' },
      { id: 'b', text: 'II. kvadrant (π/2 < α < π)' },
      { id: 'c', text: 'III. kvadrant (π < α < 3π/2)' },
      { id: 'd', text: 'IV. kvadrant (3π/2 < α < 2π)' },
    ],
    correctAnswer: 'd',
    points: 2,
    solution: [
      {
        title: 'Znaménka podle kvadrantů',
        content: 'Na jednotkové kružnici: x-ová souřadnice = cos α, y-ová souřadnice = sin α.',
      },
      {
        title: 'IV. kvadrant',
        content: 'Ve IV. kvadrantu je x > 0 (cos α > 0) a y < 0 (sin α < 0). Mnohonásobek: „vše kladné → jen sin → jen cos → vše kladné" (I→II→III→IV pro sin, cos, tan).',
        result: 'IV. kvadrant',
      },
    ],
  },
  {
    id: 'l1-q5',
    level: 1,
    type: 'numerical',
    question: 'Je dáno sin α = 3/5 a α ∈ (0, π/2). Vypočítejte cos α. Zadejte výsledek jako desetinné číslo (2 des. místa).',
    correctAnswer: 0.8,
    tolerance: 0.01,
    points: 3,
    hint: 'Použijte identitu sin²α + cos²α = 1.',
    solution: [
      {
        title: 'Pythagorova identita',
        formula: 'sin²α + cos²α = 1  ⟹  cos²α = 1 − sin²α',
      },
      {
        title: 'Dosazení',
        formula: 'cos²α = 1 − (3/5)² = 1 − 9/25 = 16/25',
      },
      {
        title: 'Výsledek',
        content: 'Protože α ∈ (0, π/2), je cos α > 0.',
        formula: 'cos α = √(16/25) = 4/5 = 0,8',
        result: '0,8',
      },
    ],
  },

  // ─── LEVEL 2: Pravoúhlý trojúhelník ──────────────────────────────────────
  {
    id: 'l2-q1',
    level: 2,
    type: 'numerical',
    question: 'V pravoúhlém trojúhelníku ABC (pravý úhel u C) je přepona c = 10 cm a úhel α = 30°. Vypočítejte délku odvěsny a (protilehlou k α). Výsledek v cm, 2 des. místa.',
    correctAnswer: 5.0,
    tolerance: 0.05,
    points: 3,
    diagramType: 'right',
    triangleData: { alpha: degToRad(30), beta: degToRad(60), gamma: degToRad(90), a: 5, b: 8.66, c: 10 },
    solution: [
      {
        title: 'Definice sinu v pravoúhlém trojúhelníku',
        content: 'sin α = protilehlá odvěsna / přepona = a / c',
        formula: 'sin(30°) = a / 10',
      },
      {
        title: 'Výpočet',
        formula: 'a = 10 · sin(30°) = 10 · 0,5 = 5 cm',
        result: 'a = 5 cm',
      },
    ],
  },
  {
    id: 'l2-q2',
    level: 2,
    type: 'numerical',
    question: 'V pravoúhlém trojúhelníku jsou odvěsny a = 6 cm a b = 8 cm. Jaká je délka přepony c? Výsledek v cm.',
    correctAnswer: 10,
    tolerance: 0.05,
    points: 2,
    diagramType: 'right',
    solution: [
      {
        title: 'Pythagorova věta',
        formula: 'c² = a² + b²',
      },
      {
        title: 'Výpočet',
        formula: 'c² = 6² + 8² = 36 + 64 = 100',
        result: 'c = 10 cm',
      },
    ],
  },
  {
    id: 'l2-q3',
    level: 2,
    type: 'numerical',
    question: 'V pravoúhlém trojúhelníku je přepona c = 13 cm a odvěsna a = 5 cm. Vypočítejte velikost úhlu α (v stupních, 1 des. místo).',
    correctAnswer: 22.6,
    tolerance: 0.2,
    points: 3,
    diagramType: 'right',
    hint: 'sin α = a / c, potom α = arcsin(a/c)',
    solution: [
      {
        title: 'Výpočet sinu',
        formula: 'sin α = a / c = 5 / 13 ≈ 0,3846',
      },
      {
        title: 'Inverzní funkce',
        formula: 'α = arcsin(5/13) ≈ 22,62°',
        result: 'α ≈ 22,6°',
      },
    ],
  },
  {
    id: 'l2-q4',
    level: 2,
    type: 'multiple-choice',
    question: 'Stožár výšky 15 m vrhá stín délky 20 m. Jaký úhel svírá slunce s horizontem? (zaokrouhlete na celé stupně)',
    choices: [
      { id: 'a', text: '36°' },
      { id: 'b', text: '37°' },
      { id: 'c', text: '41°' },
      { id: 'd', text: '53°' },
    ],
    correctAnswer: 'b',
    points: 3,
    hint: 'tg α = výška / délka stínu',
    solution: [
      {
        title: 'Rozbor situace',
        content: 'Stožár, stín a paprsek slunce tvoří pravoúhlý trojúhelník. Tangenta úhlu elevace slunce:',
        formula: 'tg α = 15 / 20 = 0,75',
      },
      {
        title: 'Výpočet',
        formula: 'α = arctg(0,75) ≈ 36,87° ≈ 37°',
        result: '37°',
      },
    ],
  },

  // ─── LEVEL 3: Sinová věta ────────────────────────────────────────────────
  {
    id: 'l3-q1',
    level: 3,
    type: 'numerical',
    question: 'V trojúhelníku ABC je α = 40°, β = 75° a a = 8 cm. Vypočítejte stranu b (v cm, 2 des. místa).',
    correctAnswer: 11.97,
    tolerance: 0.1,
    points: 4,
    diagramType: 'general',
    hint: 'Sinová věta: a/sin α = b/sin β',
    solution: [
      {
        title: 'Sinová věta',
        formula: 'a / sin α = b / sin β',
      },
      {
        title: 'Vyjádření b',
        formula: 'b = a · sin β / sin α = 8 · sin(75°) / sin(40°)',
      },
      {
        title: 'Výpočet',
        formula: 'b = 8 · 0,9659 / 0,6428 ≈ 12,02 cm',
        result: 'b ≈ 12,02 cm',
      },
    ],
  },
  {
    id: 'l3-q2',
    level: 3,
    type: 'multiple-choice',
    question: 'V trojúhelníku ABC je a = 5 cm, b = 8 cm a α = 30°. Kolik řešení existuje (případ SSA)?',
    choices: [
      { id: 'a', text: 'Žádné řešení' },
      { id: 'b', text: 'Právě jedno řešení' },
      { id: 'c', text: 'Dvě řešení' },
      { id: 'd', text: 'Nekonečně mnoho řešení' },
    ],
    correctAnswer: 'c',
    points: 4,
    hint: 'Porovnejte stranu a s výškou hb = b · sin α.',
    solution: [
      {
        title: 'Kritická výška',
        content: 'Pro SSA případ (dvě strany a protilehlý úhel) musíme porovnat a s výškou hα = b · sin α.',
        formula: 'hα = b · sin α = 8 · sin(30°) = 8 · 0,5 = 4 cm',
      },
      {
        title: 'Podmínka',
        content: 'Protože hα < a < b, tedy 4 < 5 < 8, existují právě dvě řešení (ostrý i tupý úhel β).',
        formula: 'hα = 4 < a = 5 < b = 8  ⟹  dvě řešení',
        result: '2 řešení',
      },
      {
        title: 'Konkrétní výpočet',
        content: 'sin β = b · sin α / a = 8 · 0,5 / 5 = 0,8, takže β₁ ≈ 53,13° nebo β₂ ≈ 126,87°. Obě dávají kladné γ.',
      },
    ],
  },
  {
    id: 'l3-q3',
    level: 3,
    type: 'numerical',
    question: 'V trojúhelníku jsou α = 50°, γ = 80° a c = 12 cm. Vypočítejte stranu a (v cm, 2 des. místa).',
    correctAnswer: 9.33,
    tolerance: 0.1,
    points: 4,
    hint: 'Nejprve určete β = 180° − α − γ, pak použijte sinovou větu.',
    solution: [
      {
        title: 'Třetí úhel',
        formula: 'β = 180° − 50° − 80° = 50°',
      },
      {
        title: 'Sinová věta',
        formula: 'a / sin α = c / sin γ',
      },
      {
        title: 'Výpočet',
        formula: 'a = c · sin α / sin γ = 12 · sin(50°) / sin(80°) ≈ 12 · 0,766 / 0,985 ≈ 9,33 cm',
        result: 'a ≈ 9,33 cm',
      },
    ],
  },

  // ─── LEVEL 4: Kosinová věta ──────────────────────────────────────────────
  {
    id: 'l4-q1',
    level: 4,
    type: 'numerical',
    question: 'V trojúhelníku jsou a = 7 cm, b = 5 cm a γ = 60°. Vypočítejte stranu c (v cm, 2 des. místa).',
    correctAnswer: 6.24,
    tolerance: 0.1,
    points: 4,
    diagramType: 'general',
    hint: 'Kosinová věta: c² = a² + b² − 2ab · cos γ',
    solution: [
      {
        title: 'Kosinová věta',
        formula: 'c² = a² + b² − 2ab · cos γ',
      },
      {
        title: 'Dosazení',
        formula: 'c² = 7² + 5² − 2 · 7 · 5 · cos(60°) = 49 + 25 − 70 · 0,5 = 74 − 35 = 39',
      },
      {
        title: 'Výsledek',
        formula: 'c = √39 ≈ 6,24 cm',
        result: 'c ≈ 6,24 cm',
      },
    ],
  },
  {
    id: 'l4-q2',
    level: 4,
    type: 'numerical',
    question: 'Trojúhelník má strany a = 6 cm, b = 8 cm, c = 10 cm. Vypočítejte největší úhel γ (v stupních, 1 des. místo).',
    correctAnswer: 90,
    tolerance: 0.5,
    points: 4,
    hint: 'Největší úhel leží naproti největší straně. Použijte kosinovou větu: cos γ = (a² + b² − c²) / (2ab)',
    solution: [
      {
        title: 'Největší strana',
        content: 'c = 10 cm je největší, tedy γ je největší úhel.',
        formula: 'cos γ = (a² + b² − c²) / (2ab)',
      },
      {
        title: 'Výpočet',
        formula: 'cos γ = (36 + 64 − 100) / (2 · 6 · 8) = 0 / 96 = 0',
      },
      {
        title: 'Výsledek',
        content: 'cos γ = 0 znamená γ = 90°. Jde o pravoúhlý trojúhelník (ověření Pythagorovou větou: 6² + 8² = 100 = 10²).',
        result: 'γ = 90°',
      },
    ],
  },
  {
    id: 'l4-q3',
    level: 4,
    type: 'numerical',
    question: 'V trojúhelníku je a = 9 cm, b = 12 cm, γ = 120°. Vypočítejte c (v cm, 2 des. místa).',
    correctAnswer: 18.52,
    tolerance: 0.1,
    points: 4,
    solution: [
      {
        title: 'Kosinová věta',
        formula: 'c² = a² + b² − 2ab · cos γ',
      },
      {
        title: 'Dosazení — pozor na znaménko!',
        content: 'cos(120°) = −1/2, tudíž člen −2ab·cos γ je kladný.',
        formula: 'c² = 81 + 144 − 2 · 9 · 12 · (−0,5) = 225 + 108 = 333',
      },
      {
        title: 'Výsledek',
        formula: 'c = √333 ≈ 18,25 cm',
        result: 'c ≈ 18,25 cm',
      },
    ],
  },

  // ─── LEVEL 5: Kombinované úlohy ──────────────────────────────────────────
  {
    id: 'l5-q1',
    level: 5,
    type: 'numerical',
    question: 'Dva turisté vyrazí současně ze stejného místa po přímých cestách svírající úhel π/3. První jde rychlostí 5 km/h, druhý 7 km/h. Jaká je jejich vzdušná vzdálenost po 15 minutách (v km, 2 des. místa)?',
    correctAnswer: 1.80,
    tolerance: 0.05,
    points: 5,
    hint: 'Po 15 min: d₁ = 5·0,25 = 1,25 km, d₂ = 7·0,25 = 1,75 km. Pak kosinová věta.',
    solution: [
      {
        title: 'Ujetá vzdálenost',
        formula: 'd₁ = 5 · (15/60) = 1,25 km,  d₂ = 7 · (15/60) = 1,75 km',
      },
      {
        title: 'Kosinová věta',
        content: 'Úhel mezi cestami γ = π/3 = 60°.',
        formula: 'd² = d₁² + d₂² − 2·d₁·d₂·cos(60°)',
      },
      {
        title: 'Výpočet',
        formula: 'd² = 1,5625 + 3,0625 − 2·1,25·1,75·0,5 = 4,625 − 2,1875 = 3,25 − 0,8125 = 3,25 - 1.09375 ≈ 3.25',
        result: 'd ≈ 1,80 km',
      },
    ],
  },
  {
    id: 'l5-q2',
    level: 5,
    type: 'numerical',
    question: 'Na vrcholu kopce stojí rozhledna 42 m vysoká. Patu i vrchol rozhledny vidíme z místa v údolí pod výškovými úhly α = π/4 a β = π/3. Jak vysoko je vrchol kopce nad pozorovacím místem (v metrech, 1 des. místo)?',
    correctAnswer: 98.2,
    tolerance: 1,
    points: 6,
    hint: 'Označte výšku kopce h. Pak: tg α = h/d a tg β = (h+42)/d. Vyloučte d.',
    solution: [
      {
        title: 'Soustava rovnic',
        content: 'Označme vodorovnou vzdálenost d a výšku kopce h.',
        formula: 'tg(α) = h/d  a  tg(β) = (h+42)/d',
      },
      {
        title: 'Eliminace d',
        formula: 'd = h/tg(α) = h/1 = h,  tedy  tg(β) = (h+42)/h',
      },
      {
        title: 'Výpočet h',
        formula: 'h·tg(β) = h + 42  ⟹  h(tg(β)−1) = 42  ⟹  h = 42/(tg(60°)−1) = 42/(√3−1)',
      },
      {
        title: 'Výsledek',
        formula: 'h = 42/(1,732−1) = 42/0,732 ≈ 57,4 m',
        result: 'h ≈ 57,4 m (výška kopce nad pozorovacím místem)',
      },
    ],
  },
];
