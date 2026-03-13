"use client";

import { useState } from "react";
import { ProfileTab } from "@/components/pages/ProfileTab";
import { SkillsTab } from "@/components/pages/SkillsTab";
import { ExperienceTab } from "@/components/pages/ExperienceTab";
import { ProjectsTab } from "@/components/pages/ProjectsTab";
import { EducationTab } from "@/components/pages/EducationTab";
import { CertificationsTab } from "@/components/pages/CertificationTab";
import { GenerateTab } from "@/components/pages/GenerateTab";
import { Tab } from "@/types/type";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "profile", label: "Profile", icon: "◈" },
  { id: "skills", label: "Skills", icon: "◎" },
  { id: "experience", label: "Experience", icon: "◆" },
  { id: "projects", label: "Projects", icon: "◇" },
  { id: "education", label: "Education", icon: "◉" },
  { id: "certifications", label: "Certifications", icon: "◐" },
  { id: "generate", label: "Generate Resume", icon: "⚡" },
];

export default function DashboardPage() {
  const [active, setActive] = useState<Tab>("profile");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #0d1117; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
      `}</style>

      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          minHeight: "100vh",
          background: "#0d1117",
          color: "#e6edf3",
        }}
      >
        <header
          style={{ borderBottom: "1px solid #21262d", background: "#161b22" }}
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: "linear-gradient(135deg,#58a6ff,#388bfd)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 14 }}>◈</span>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#e6edf3",
                    margin: 0,
                  }}
                >
                  Resume Autobot
                </p>
                <p style={{ fontSize: 10, color: "#8b949e", margin: 0 }}>
                  dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#2ea043",
                }}
              />
              <span style={{ fontSize: 11, color: "#8b949e" }}>connected</span>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8 flex gap-6">
          <aside style={{ width: 200, flexShrink: 0 }}>
            <p
              style={{
                fontSize: 10,
                color: "#8b949e",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Navigation
            </p>
            <nav className="space-y-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  style={{ fontFamily: "'JetBrains Mono',monospace" }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm text-left transition-all ${
                    active === t.id
                      ? "border-[#58a6ff] bg-[#161b22] text-[#e6edf3]"
                      : "border-transparent text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22]"
                  } ${t.id === "generate" ? "mt-4 !border-dashed !border-[#238636] !text-[#2ea043]" : ""}`}
                >
                  <span style={{ fontSize: 12, opacity: 0.8 }}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </nav>
            <div
              style={{
                marginTop: 32,
                padding: 12,
                background: "#161b22",
                borderRadius: 10,
                border: "1px solid #21262d",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  color: "#8b949e",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                1. Fill each section
                <br />
                2. Save each section
                <br />
                3. Go to Generate
                <br />
                4. Paste Job Description
                <br />
                5. Download resume
              </p>
            </div>
          </aside>

          <main style={{ flex: 1, minWidth: 0 }}>
            {active === "profile" && <ProfileTab />}
            {active === "skills" && <SkillsTab />}
            {active === "experience" && <ExperienceTab />}
            {active === "projects" && <ProjectsTab />}
            {active === "education" && <EducationTab />}
            {active === "certifications" && <CertificationsTab />}
            {active === "generate" && <GenerateTab />}
          </main>
        </div>
      </div>
    </>
  );
}
