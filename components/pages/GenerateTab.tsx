"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { API } from "@/lib/config";
import { SectionTitle } from "../SectionTitle";
import { ViewCard } from "../ViewCard";

export function GenerateTab() {
  const [jd, setJd] = useState("");
  const [texCode, setTexCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!jd.trim()) return;
    setLoading(true);
    setError("");
    setTexCode("");
    try {
      const data = await apiFetch("/generate", "POST", { job_description: jd });
      setTexCode(data.tex ?? "");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadTex = () => {
    const blob = new Blob([texCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tailored_resume.tex";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    setPdfLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API}/compile-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tex: texCode }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).detail ?? "PDF compilation failed");
      }

      // Stream the PDF blob and trigger browser download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tailored_resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(
        `PDF error: ${e.message}\n\nTry downloading the .tex file and compiling on Overleaf.`,
      );
    } finally {
      setPdfLoading(false);
    }
  };

  const copyTex = () => {
    navigator.clipboard.writeText(texCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Generate Resume"
        desc="Paste a job description — we match your saved profile and generate tailored LaTeX"
      />

      <ViewCard>
        <textarea
          rows={10}
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job description here…"
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-3 text-[#e6edf3] text-sm outline-none focus:border-[#58a6ff] transition-colors placeholder:text-[#484f58] resize-none font-mono"
        />
        {error && (
          <p className="text-[#f85149] text-xs font-mono mt-2">{error}</p>
        )}
        <div className="flex justify-end mt-3">
          <button
            onClick={generate}
            disabled={loading || !jd.trim()}
            className="px-6 py-2.5 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-mono rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
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
                Generating…
              </>
            ) : (
              "⚡ Generate Resume"
            )}
          </button>
        </div>
      </ViewCard>

      {texCode && (
        <ViewCard>
          <div className="flex gap-3 mb-4">
            <button
              onClick={downloadTex}
              className="flex items-center gap-2 px-4 py-2 bg-[#1f2937] hover:bg-[#374151] border border-[#374151] text-[#93c5fd] text-sm font-mono rounded-lg transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download .tex
            </button>
            <button
              onClick={downloadPdf}
              disabled={pdfLoading}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a3a2a] hover:bg-[#1f4733] border border-[#2ea043] text-[#2ea043] text-sm font-mono rounded-lg transition-colors disabled:opacity-50"
            >
              {pdfLoading ? (
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
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              )}
              {pdfLoading ? "Rendering…" : "Download PDF"}
            </button>
            <a
              href="https://www.overleaf.com/project"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#0d1117] hover:bg-[#161b22] border border-[#30363d] text-[#8b949e] hover:text-[#e6edf3] text-sm font-mono rounded-lg transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              Open Overleaf
            </a>
            <button
              onClick={copyTex}
              className={`flex items-center gap-2 px-4 py-2 border text-sm font-mono rounded-lg transition-colors ${
                copied
                  ? "bg-[#1a3a2a] border-[#2ea043] text-[#2ea043]"
                  : "bg-[#1f2937] hover:bg-[#374151] border-[#374151] text-[#93c5fd]"
              }`}
            >
              {copied ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-t-lg border-b-0">
            <div className="w-3 h-3 rounded-full bg-[#f85149]" />
            <div className="w-3 h-3 rounded-full bg-[#d29922]" />
            <div className="w-3 h-3 rounded-full bg-[#2ea043]" />
            <span className="ml-2 text-[#8b949e] text-xs font-mono">
              tailored_resume.tex
            </span>
          </div>
          <pre className="bg-[#0d1117] border border-[#30363d] rounded-b-lg p-4 overflow-auto max-h-[500px] text-xs text-[#e6edf3] font-mono leading-relaxed whitespace-pre-wrap">
            {texCode}
          </pre>
        </ViewCard>
      )}
    </div>
  );
}
