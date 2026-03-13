import { API } from "@/lib/config";

// ── Auth token manager ────────────────────────────────────────────────────────

export const Auth = {
  getAccess: () =>
    typeof window !== "undefined"
      ? (localStorage.getItem("access_token") ?? "")
      : "",
  getRefresh: () =>
    typeof window !== "undefined"
      ? (localStorage.getItem("refresh_token") ?? "")
      : "",
  setTokens: (a: string, r: string) => {
    localStorage.setItem("access_token", a);
    localStorage.setItem("refresh_token", r);
    // 55 min — 5 min safety margin before Supabase's 1hr expiry
    localStorage.setItem("token_expiry", String(Date.now() + 55 * 60 * 1000));
  },
  clear: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("user_email");
  },
  isExpired: () => {
    const expiry =
      typeof window !== "undefined"
        ? localStorage.getItem("token_expiry")
        : null;
    if (!expiry) return true;
    return Date.now() > Number(expiry);
  },
  isLoggedIn: () =>
    typeof window !== "undefined"
      ? !!localStorage.getItem("access_token")
      : false,
};

// ── Session expired callback — registered by DashboardPage ───────────────────

export let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredCallback(fn: (() => void) | null) {
  onSessionExpired = fn;
}

// ── Silent token refresh ──────────────────────────────────────────────────────

export async function refreshAccessToken(): Promise<boolean> {
  const refresh = Auth.getRefresh();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    Auth.setTokens(data.access_token, data.refresh_token ?? refresh);
    return true;
  } catch {
    return false;
  }
}

// ── Main fetch wrapper ────────────────────────────────────────────────────────

export async function apiFetch(
  path: string,
  method = "GET",
  body?: object,
): Promise<any> {
  // Proactively refresh if near expiry
  if (Auth.isExpired()) {
    const ok = await refreshAccessToken();
    if (!ok) {
      onSessionExpired?.();
      throw new Error("SESSION_EXPIRED");
    }
  }

  const makeRequest = () =>
    fetch(`${API}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Auth.getAccess()}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

  let res = await makeRequest();

  // 401 — token rejected server-side, try refresh once then retry
  if (res.status === 401) {
    const ok = await refreshAccessToken();
    if (!ok) {
      onSessionExpired?.();
      throw new Error("SESSION_EXPIRED");
    }
    res = await makeRequest();
    if (res.status === 401) {
      onSessionExpired?.();
      throw new Error("SESSION_EXPIRED");
    }
  }

  // 429 — rate limited
  if (res.status === 429) {
    throw new Error(
      path.includes("generate")
        ? "Generation limit reached (5/hour). Please wait."
        : path.includes("compile")
          ? "PDF limit reached (10/hour). Please wait."
          : "Too many requests — please wait a moment.",
    );
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as any).detail ?? "Request failed");
  return json;
}
