"use client";

import { useState, useRef, useEffect } from "react";
import { API } from "@/lib/config";
import { inputCls } from "./SharedUi";

export function LoginPage({
  onLogin,
}: {
  onLogin: (a: string, r: string, email: string) => void;
}) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupDone, setSignupDone] = useState(false);

  const submit = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    if (tab === "signup" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (tab === "signup" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      if (tab === "login") {
        const res = await fetch(`${API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail ?? "Login failed");
        onLogin(data.access_token, data.refresh_token, data.user.email);
      } else {
        const res = await fetch(`${API}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ full_name: name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail ?? "Registration failed");
        setSignupDone(true);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'JetBrains Mono',monospace",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: 16,
          padding: 32,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg,#58a6ff,#388bfd)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 16 }}>◈</span>
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: "#e6edf3",
                margin: 0,
              }}
            >
              Resume Autobot
            </p>
            <p style={{ fontSize: 10, color: "#8b949e", margin: 0 }}>
              AI-powered resume tailoring
            </p>
          </div>
        </div>

        {signupDone ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(46,160,67,0.1)",
                border: "1px solid #2ea043",
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
                stroke="#2ea043"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p
              style={{
                color: "#e6edf3",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Account created!
            </p>
            <p
              style={{
                color: "#8b949e",
                fontSize: 12,
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              Check your email to verify your address, then sign in.
            </p>
            <button
              onClick={() => {
                setTab("login");
                setSignupDone(false);
                setPassword("");
                setConfirm("");
              }}
              style={{
                background: "#1f6feb",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                padding: "10px 24px",
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Go to Sign In
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: 4,
                background: "#0d1117",
                borderRadius: 10,
                padding: 4,
                marginBottom: 24,
              }}
            >
              {(["login", "signup"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setError("");
                  }}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontFamily: "'JetBrains Mono',monospace",
                    transition: "all 0.2s",
                    background: tab === t ? "#161b22" : "transparent",
                    color: tab === t ? "#e6edf3" : "#8b949e",
                    boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.4)" : "none",
                  }}
                >
                  {t === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "rgba(248,81,73,0.1)",
                  border: "1px solid rgba(248,81,73,0.3)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f85149"
                  strokeWidth="2"
                  style={{ flexShrink: 0 }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: 12, color: "#f85149" }}>{error}</span>
              </div>
            )}

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {tab === "signup" && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 10,
                      color: "#8b949e",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 6,
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className={inputCls}
                  />
                </div>
              )}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    color: "#8b949e",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 6,
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    color: "#8b949e",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 6,
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder={
                    tab === "signup" ? "Min. 8 characters" : "••••••••"
                  }
                  className={inputCls}
                />
              </div>
              {tab === "signup" && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 10,
                      color: "#8b949e",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 6,
                    }}
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    placeholder="Repeat password"
                    className={inputCls}
                  />
                </div>
              )}
            </div>

            <button
              onClick={submit}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: 20,
                padding: "12px 0",
                background: loading ? "#1f3a6e" : "#1f6feb",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 13,
                letterSpacing: "0.08em",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background 0.2s",
              }}
            >
              {loading && (
                <svg
                  className="animate-spin w-4 h-4"
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
              )}
              {loading
                ? "Please wait…"
                : tab === "login"
                  ? "SIGN IN"
                  : "CREATE ACCOUNT"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}