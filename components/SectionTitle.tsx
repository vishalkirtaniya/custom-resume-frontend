export function SectionTitle({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-[#e6edf3] font-semibold text-base">{title}</h2>
      <p className="text-[#8b949e] text-xs font-mono mt-0.5">{desc}</p>
    </div>
  );
}