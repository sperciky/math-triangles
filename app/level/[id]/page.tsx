import { notFound } from 'next/navigation';
import Level1 from './Level1';
import Level2 from './Level2';
import Level3 from './Level3';
import Level4 from './Level4';
import Level5 from './Level5';

const TITLES: Record<number, string> = {
  1: 'Goniometrické funkce',
  2: 'Pravoúhlý trojúhelník',
  3: 'Sinová věta',
  4: 'Kosinová věta',
  5: 'Kombinované úlohy',
};

const COMPONENTS: Record<number, React.ComponentType> = {
  1: Level1,
  2: Level2,
  3: Level3,
  4: Level4,
  5: Level5,
};

export async function generateStaticParams() {
  return [1, 2, 3, 4, 5].map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const num = parseInt(id);
  return { title: `${TITLES[num] ?? 'Lekce'} | Trigonometrie` };
}

export default async function LevelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const num = parseInt(id);
  if (!TITLES[num]) notFound();

  const Component = COMPONENTS[num];
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">Lekce {num}</div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{TITLES[num]}</h1>
      <Component />
    </div>
  );
}
