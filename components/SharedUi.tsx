export const inputCls =
  "w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-[#e6edf3] text-sm outline-none focus:border-[#58a6ff] transition-colors placeholder:text-[#484f58]";

export function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[#8b949e] text-xs font-mono tracking-wider uppercase mb-0.5">
        {label}
      </p>
      <p className="text-[#e6edf3] text-sm font-mono">
        {value || <span className="text-[#484f58] italic">not set</span>}
      </p>
    </div>
  );
}

export function SaveBtn({
  onClick,
  loading,
  saved,
}: {
  onClick: () => void;
  loading: boolean;
  saved: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`px-5 py-2 rounded-lg text-sm font-mono tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        saved
          ? "bg-[#1a3a2a] border border-[#2ea043] text-[#2ea043]"
          : "bg-[#1f6feb] hover:bg-[#388bfd] text-white border border-transparent"
      }`}
    >
      {loading ? "Saving…" : saved ? "✓ Saved" : "Save"}
    </button>
  );
}

export function Chip({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#1f2937] border border-[#374151] text-[#93c5fd] text-xs font-mono">
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-[#6b7280] hover:text-[#f87171] ml-1 transition-colors"
        >
          ×
        </button>
      )}
    </span>
  );
}
