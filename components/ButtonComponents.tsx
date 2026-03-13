export function EditBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#30363d] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#58a6ff] text-xs font-mono transition-colors"
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
      Edit
    </button>
  );
}

export function CancelBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg border border-[#30363d] text-[#8b949e] hover:text-[#e6edf3] text-sm font-mono transition-colors"
    >
      Cancel
    </button>
  );
}
