import { EditBtn } from "./ButtonComponents";

export function CardHeader({
  title,
  subtitle,
  onEdit,
  editing,
}: {
  title: string;
  subtitle?: string;
  onEdit?: () => void;
  editing?: boolean;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        {title && (
          <h3 className="text-[#e6edf3] font-semibold text-sm">{title}</h3>
        )}
        {subtitle && (
          <p className="text-[#8b949e] text-xs font-mono mt-0.5">{subtitle}</p>
        )}
      </div>
      {onEdit && !editing && <EditBtn onClick={onEdit} />}
      {editing && (
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#58a6ff",
            }}
          />
          <span className="text-[#58a6ff] text-xs font-mono">editing</span>
        </div>
      )}
    </div>
  );
}
