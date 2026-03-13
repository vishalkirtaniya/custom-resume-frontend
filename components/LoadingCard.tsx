export function LoadingCard() {
  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #30363d",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <div className="flex items-center gap-3 py-4">
        <svg
          className="animate-spin w-4 h-4 text-[#8b949e]"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="40"
            strokeDashoffset="10"
          />
        </svg>
        <span className="text-[#8b949e] text-sm font-mono">Loading…</span>
      </div>
    </div>
  );
}
