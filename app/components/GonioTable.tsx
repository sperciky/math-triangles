import { GONIO_TABLE } from '../math/goniometry';

export default function GonioTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="px-3 py-2 text-left border border-slate-600">Úhel (°)</th>
            <th className="px-3 py-2 text-left border border-slate-600">Úhel (rad)</th>
            <th className="px-3 py-2 text-center border border-slate-600">sin</th>
            <th className="px-3 py-2 text-center border border-slate-600">cos</th>
            <th className="px-3 py-2 text-center border border-slate-600">tg</th>
          </tr>
        </thead>
        <tbody>
          {GONIO_TABLE.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="px-3 py-2 font-semibold border border-slate-200">{row.degrees}°</td>
              <td className="px-3 py-2 font-mono text-blue-700 border border-slate-200">{row.radians}</td>
              <td className="px-3 py-2 text-center font-mono border border-slate-200">{row.sin}</td>
              <td className="px-3 py-2 text-center font-mono border border-slate-200">{row.cos}</td>
              <td className={`px-3 py-2 text-center font-mono border border-slate-200 ${row.tan === '±∞' ? 'text-red-500' : ''}`}>
                {row.tan}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-slate-500 mt-2">
        * Přesné hodnoty. Desetinné aproximace: sin(30°)=0,500 · sin(45°)≈0,707 · sin(60°)≈0,866
      </p>
    </div>
  );
}
