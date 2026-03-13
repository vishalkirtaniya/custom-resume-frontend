export function ViewCard({
  children,
  onEdit,
  editing = false,
}: {
  children: React.ReactNode;
  onEdit?: () => void;
  editing?: boolean;
}) {
  return (
    <div
      style={{
        background: "#161b22",
        border: `1px solid ${editing ? "#58a6ff" : "#30363d"}`,
        borderRadius: 12,
        padding: 24,
      }}
    >
      {children}
    </div>
  );
}