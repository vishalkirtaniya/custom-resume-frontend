export function EmptyState({
  message,
  onAdd,
}: {
  message: string;
  onAdd?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "#161b22",
          border: "1px dashed #30363d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="text-[#484f58] text-lg">+</span>
      </div>
      <p className="text-[#484f58] text-xs font-mono">{message}</p>
      {onAdd && (
        <button
          onClick={onAdd}
          className="px-4 py-2 rounded-lg border border-dashed border-[#30363d] text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff] text-xs font-mono transition-colors"
        >
          + Add now
        </button>
      )}
    </div>
  );
}