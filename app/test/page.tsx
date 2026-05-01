import FinalTest from '../components/FinalTest';

export const metadata = { title: 'Závěrečný test | Trigonometrie' };

export default function TestPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Závěrečný test</h1>
        <p className="text-slate-600 text-sm">
          Zapište číselné odpovědi (desetinnou čárku nebo tečku). Po odevzdání se zobrazí detailní postup řešení každé úlohy.
        </p>
      </div>
      <FinalTest />
    </div>
  );
}
