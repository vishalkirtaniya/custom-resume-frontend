export function SessionExpiredModal({ onLogin }: { onLogin: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(1,4,9,0.85)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#161b22",
          border: "1px solid #f85149",
          borderRadius: 16,
          padding: 32,
          maxWidth: 380,
          width: "90%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(248,81,73,0.1)",
            border: "1px solid #f85149",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f85149"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
          </svg>
        </div>
        <p
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 15,
            fontWeight: 600,
            color: "#e6edf3",
            marginBottom: 8,
          }}
        >
          Session Expired
        </p>
        <p
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 12,
            color: "#8b949e",
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          Your session has timed out for security.
          <br />
          Please sign in again to continue.
        </p>
        <button
          onClick={onLogin}
          style={{
            width: "100%",
            padding: "12px 0",
            background: "#1f6feb",
            border: "none",
            borderRadius: 10,
            color: "#fff",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Sign In Again
        </button>
      </div>
    </div>
  );
}