"use client";

/**
 * AuthPage.tsx
 *
 * Signup  → POST /auth/register  { full_name, email, password }
 *           Saves profiles row with only NOT NULL fields.
 *           All other data (phone, links, experience…) filled in dashboard.
 *
 * Login   → POST /auth/login     { email, password }
 *           Saves access_token + refresh_token to localStorage.
 *
 * Set NEXT_PUBLIC_API_URL in .env.local  (default: http://localhost:8000)
 */

import { useState, useRef, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "login" | "signup";

interface FieldErrors {
  loginEmail?: string;
  loginPassword?: string;
  signupName?: string;
  signupEmail?: string;
  signupPassword?: string;
  signupConfirm?: string;
}

// ── API helpers ───────────────────────────────────────────────────────────────

async function apiPost<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as any).detail ?? "Something went wrong");
  return json as T;
}

interface LoginResponse {
  status: string;
  access_token: string;
  refresh_token: string;
  user: { id: string; email: string };
}

interface RegisterResponse {
  status: string;
  user_id: string;
}

// ── InputField ────────────────────────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  error?: string;
}

function InputField({
  label, type, placeholder, value, onChange, autoComplete, error,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;

  return (
    <div className="relative mb-5">
      <label
        className={`absolute left-0 font-mono text-xs tracking-widest uppercase transition-all duration-300 pointer-events-none select-none ${
          focused || filled
            ? "top-0 text-stone-500 opacity-100"
            : "top-5 text-stone-400 opacity-70"
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={focused ? placeholder : ""}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent border-b-2 pt-6 pb-2 text-stone-800 text-sm outline-none transition-all duration-300 placeholder:text-stone-300 ${
          error ? "border-red-400" : focused ? "border-stone-800" : "border-stone-200"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-400 font-mono">{error}</p>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("login");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup fields (only full_name + email + password — schema-aligned)
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Panel height animation
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (panelRef.current) setPanelHeight(panelRef.current.scrollHeight);
  }, [tab, submitted, fieldErrors, apiError]);

  const switchTab = (t: Tab) => {
    setTab(t);
    setApiError(null);
    setFieldErrors({});
  };

  // ── Validation ──────────────────────────────────────────────────────────────

  function validateLogin(): boolean {
    const e: FieldErrors = {};
    if (!loginEmail.trim()) e.loginEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) e.loginEmail = "Enter a valid email";
    if (!loginPassword) e.loginPassword = "Password is required";
    setFieldErrors(e);
    return !Object.keys(e).length;
  }

  function validateSignup(): boolean {
    const e: FieldErrors = {};
    if (!signupName.trim()) e.signupName = "Name is required";
    if (!signupEmail.trim()) e.signupEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(signupEmail)) e.signupEmail = "Enter a valid email";
    if (!signupPassword) e.signupPassword = "Password is required";
    else if (signupPassword.length < 8) e.signupPassword = "Min. 8 characters";
    if (signupConfirm !== signupPassword) e.signupConfirm = "Passwords do not match";
    setFieldErrors(e);
    return !Object.keys(e).length;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setApiError(null);

    if (tab === "login") {
      if (!validateLogin()) return;
      setLoading(true);
      try {
        const data = await apiPost<LoginResponse>("/auth/login", {
          email: loginEmail,
          password: loginPassword,
        });
        // Persist tokens — attached as Bearer <token> on all subsequent API calls
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user_id", data.user.id);
        setSubmitted(true);
      } catch (err: any) {
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      if (!validateSignup()) return;
      setLoading(true);
      try {
        /**
         * Only sends: { full_name, email, password }
         * Backend creates auth user + inserts minimal profiles row.
         * Dashboard handles the rest (phone, location, links, summary…).
         */
        await apiPost<RegisterResponse>("/auth/register", {
          full_name: signupName,
          email: signupEmail,
          password: signupPassword,
        });
        setSubmitted(true);
      } catch (err: any) {
        // 409 = duplicate email — surface it clearly
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setApiError(null);
    setFieldErrors({});
    setLoginEmail(""); setLoginPassword("");
    setSignupName(""); setSignupEmail(""); setSignupPassword(""); setSignupConfirm("");
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        body { margin: 0; }

        .auth-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background-color: #faf9f7;
          background-image:
            radial-gradient(ellipse at 20% 50%, rgba(212,196,175,0.18) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(180,160,130,0.12) 0%, transparent 50%);
          display: flex; align-items: center; justify-content: center; padding: 2rem 1rem;
        }
        .grain-overlay {
          pointer-events: none; position: fixed; inset: 0; z-index: 0; opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 180px;
        }
        .serif { font-family: 'Cormorant Garamond', serif; }

        .panel-animate { transition: height 0.42s cubic-bezier(0.4,0,0.2,1); overflow: hidden; }

        .submit-btn {
          position: relative; overflow: hidden; background: #1c1a18; color: #faf9f7;
          border: none; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(28,26,24,0.22); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px; border: 2px solid rgba(250,249,247,0.3);
          border-top-color: #faf9f7; border-radius: 50%;
          animation: spin 0.7s linear infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .fade-in { animation: fadeIn 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }

        .social-btn {
          border: 1.5px solid #e5e2dc; background: transparent; color: #4a4540; cursor: pointer;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
        }
        .social-btn:hover { border-color: #1c1a18; background: #f0ede8; color: #1c1a18; }
        .divider-line { flex: 1; height: 1px; background: #e5e2dc; }

        .left-panel {
          background: linear-gradient(155deg, #2a2520 0%, #1c1a18 60%, #0f0e0c 100%);
          position: relative; overflow: hidden;
        }
        .left-panel::before {
          content:''; position:absolute; top:-30%; left:-20%; width:70%; height:70%; border-radius:50%;
          background: radial-gradient(circle, rgba(180,150,100,0.15) 0%, transparent 70%);
        }
        .left-panel::after {
          content:''; position:absolute; bottom:-10%; right:-10%; width:50%; height:60%; border-radius:50%;
          background: radial-gradient(circle, rgba(120,90,50,0.1) 0%, transparent 70%);
        }
        .quote-mark {
          font-family:'Cormorant Garamond',serif; font-size:8rem; line-height:0.6;
          color:rgba(212,180,130,0.2); font-style:italic; font-weight:300; user-select:none;
        }
        .error-banner {
          background:#fef2f2; border:1px solid #fecaca; border-radius:10px;
          padding:10px 14px; margin-bottom:14px;
          display:flex; align-items:flex-start; gap:8px;
          animation: fadeIn 0.3s ease;
        }
        .info-note {
          background:#f5f3ef; border:1px solid #e8e3d8; border-radius:10px;
          padding:10px 14px; margin-bottom:14px;
          display:flex; align-items:flex-start; gap:8px;
        }

        @media (max-width: 768px) {
          .left-panel { display:none !important; }
          .auth-card  { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div className="auth-root">
        <div className="grain-overlay" />

        <div
          className="auth-card relative z-10 w-full max-w-4xl rounded-3xl overflow-hidden"
          style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            boxShadow: "0 32px 80px rgba(28,26,24,0.14), 0 2px 8px rgba(28,26,24,0.06)",
          }}
        >

          {/* ── LEFT PANEL ── */}
          <div className="left-panel flex flex-col justify-between p-10" style={{ minHeight: 580 }}>
            <div>
              {/* Logo */}
              <div className="flex items-center gap-2 mb-16">
                <div style={{
                  width:32, height:32, borderRadius:10,
                  background:"linear-gradient(135deg,#c9a96e,#a07840)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="#faf9f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="serif text-amber-100 font-light text-lg" style={{ letterSpacing:"0.06em" }}>
                  Luminary
                </span>
              </div>

              {/* Quote */}
              <div className="quote-mark">"</div>
              <p className="serif mt-2 text-amber-50 font-light"
                style={{ fontSize:"1.45rem", lineHeight:1.65, opacity:0.88 }}>
                Design is not just what it looks like and feels like.
                Design is how it works.
              </p>
              <p className="mt-4 font-mono text-xs"
                style={{ color:"rgba(201,169,110,0.7)", letterSpacing:"0.12em" }}>
                — STEVE JOBS
              </p>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-3 mt-12">
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width:i===0?28:8, height:8, borderRadius:9999,
                  background:i===0?"#c9a96e":"rgba(201,169,110,0.25)",
                }} />
              ))}
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="bg-white flex flex-col justify-center px-10 py-12">

            {/* ── SUCCESS STATE ── */}
            {submitted ? (
              <div className="fade-in text-center py-8">
                <div className="mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-full"
                  style={{ background:"#f0ede8", border:"2px solid #e5e2dc" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#1c1a18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="serif text-3xl font-light text-stone-800 mb-2">
                  {tab === "login" ? "Welcome back." : "You're in."}
                </h2>
                <p className="text-stone-400 text-sm mt-1 mb-3">
                  {tab === "login"
                    ? "You've been signed in successfully."
                    : "Account created successfully."}
                </p>
                {tab === "signup" && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-left">
                    📬 Check your email to verify your address before signing in.
                    Then head to your dashboard to complete your profile.
                  </p>
                )}
                <button onClick={resetForm}
                  className="text-xs font-mono tracking-widest text-stone-400 underline underline-offset-4 cursor-pointer bg-transparent border-none"
                  style={{ letterSpacing:"0.1em" }}>
                  BACK TO {tab === "login" ? "LOGIN" : "SIGN UP"}
                </button>
              </div>

            ) : (
              <>
                {/* ── HEADER ── */}
                <div className="mb-8">
                  <h1 className="serif font-light text-stone-800" style={{ fontSize:"2rem", lineHeight:1.2 }}>
                    {tab === "login"
                      ? <><span>Welcome</span><br /><span className="italic text-stone-400">back.</span></>
                      : <><span>Create your</span><br /><span className="italic text-stone-400">account.</span></>
                    }
                  </h1>
                </div>

                {/* ── TABS ── */}
                <div className="flex mb-8 border-b-2 border-stone-100">
                  {(["login", "signup"] as Tab[]).map(t => (
                    <button key={t} onClick={() => switchTab(t)}
                      className={`pb-3 mr-6 text-xs font-mono tracking-widest uppercase bg-transparent border-none cursor-pointer transition-colors duration-200 ${
                        tab===t ? "text-stone-800" : "text-stone-300 hover:text-stone-500"
                      }`}
                      style={{
                        letterSpacing:"0.12em",
                        borderBottom: tab===t ? "2px solid #1c1a18" : "2px solid transparent",
                        marginBottom:"-2px",
                      }}>
                      {t==="login" ? "Sign In" : "Sign Up"}
                    </button>
                  ))}
                </div>

                {/* ── SOCIAL BUTTONS ── */}
                <div className="flex gap-3 mb-6">
                  <button className="social-btn flex-1 rounded-xl py-3 px-4">
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button className="social-btn flex-1 rounded-xl py-3 px-4">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    GitHub
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="divider-line" />
                  <span className="font-mono text-xs text-stone-300" style={{ letterSpacing:"0.1em" }}>OR</span>
                  <div className="divider-line" />
                </div>

                {/* ── API ERROR ── */}
                {apiError && (
                  <div className="error-banner">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}>
                      <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="2"/>
                      <path d="M12 8v4M12 16h.01" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="text-xs text-red-500 font-mono">{apiError}</span>
                  </div>
                )}

                {/* Signup info note — shown before form, not after */}
                {tab === "signup" && !apiError && (
                  <div className="info-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}>
                      <circle cx="12" cy="12" r="10" stroke="#a07840" strokeWidth="2"/>
                      <path d="M12 11v5M12 8h.01" stroke="#a07840" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="text-xs font-mono" style={{ color:"#7a5c30", lineHeight:1.55 }}>
                      Only your name and email are saved now. Complete your profile in the dashboard after signup.
                    </span>
                  </div>
                )}

                {/* ── FORM FIELDS ── */}
                <div ref={panelRef} className="panel-animate" style={{ height: panelHeight }}>
                  {tab === "login" ? (
                    <div className="fade-in">
                      <InputField label="Email" type="email" placeholder="you@example.com"
                        value={loginEmail} onChange={setLoginEmail}
                        autoComplete="email" error={fieldErrors.loginEmail} />
                      <InputField label="Password" type="password" placeholder="••••••••"
                        value={loginPassword} onChange={setLoginPassword}
                        autoComplete="current-password" error={fieldErrors.loginPassword} />
                      <div className="flex justify-end mb-6">
                        <button className="font-mono text-xs text-stone-400 hover:text-stone-700 bg-transparent border-none cursor-pointer transition-colors"
                          style={{ letterSpacing:"0.08em" }}>
                          Forgot password?
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="fade-in">
                      {/* Only 4 fields — matches /auth/register payload exactly */}
                      <InputField label="Full Name" type="text" placeholder="Jane Doe"
                        value={signupName} onChange={setSignupName}
                        autoComplete="name" error={fieldErrors.signupName} />
                      <InputField label="Email" type="email" placeholder="you@example.com"
                        value={signupEmail} onChange={setSignupEmail}
                        autoComplete="email" error={fieldErrors.signupEmail} />
                      <InputField label="Password" type="password" placeholder="Min. 8 characters"
                        value={signupPassword} onChange={setSignupPassword}
                        autoComplete="new-password" error={fieldErrors.signupPassword} />
                      <InputField label="Confirm Password" type="password" placeholder="Repeat password"
                        value={signupConfirm} onChange={setSignupConfirm}
                        autoComplete="new-password" error={fieldErrors.signupConfirm} />
                      <p className="text-xs text-stone-400 mb-4" style={{ lineHeight:1.6 }}>
                        By continuing you agree to our{" "}
                        <span className="text-stone-600 underline underline-offset-2 cursor-pointer">Terms</span>
                        {" "}and{" "}
                        <span className="text-stone-600 underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
                      </p>
                    </div>
                  )}
                </div>

                {/* ── SUBMIT ── */}
                <button
                  className="submit-btn w-full rounded-2xl py-4 text-sm tracking-wider font-mono mt-2"
                  style={{ letterSpacing:"0.1em" }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading
                    ? <span className="spinner" />
                    : tab === "login" ? "SIGN IN" : "CREATE ACCOUNT"
                  }
                </button>

                <p className="mt-5 text-center text-xs text-stone-400">
                  {tab === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => switchTab(tab === "login" ? "signup" : "login")}
                    className="text-stone-700 font-medium underline underline-offset-2 bg-transparent border-none cursor-pointer"
                  >
                    {tab === "login" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}