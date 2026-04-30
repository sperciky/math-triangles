// Renders a block math formula in a styled box
interface Props {
  children: string;
  inline?: boolean;
  label?: string;
}

export default function Formula({ children, inline = false, label }: Props) {
  if (inline) {
    return (
      <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono text-sm">
        {children}
      </code>
    );
  }

  return (
    <div className="my-3 flex items-start gap-3">
      <div className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-3 font-mono text-base text-slate-900 overflow-x-auto whitespace-pre">
        {children}
      </div>
      {label && (
        <span className="text-xs text-slate-400 mt-3 shrink-0">{label}</span>
      )}
    </div>
  );
}
