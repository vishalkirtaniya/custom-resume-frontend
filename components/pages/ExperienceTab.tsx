"use client";

import { ExpItem } from "@/types/type";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { SectionTitle } from "../SectionTitle";
import { ViewCard } from "../ViewCard";
import { CancelBtn } from "../ButtonComponents";
import { blankExp } from "../Blanks";
import { Field } from "../Field";
import { InfoRow, SaveBtn, Chip } from "../SharedUi";
import { LoadingCard } from "../LoadingCard";
import { CardHeader } from "../CardHeader";
import { EmptyState } from "../EmptyState";
import { expToForm, formToExp } from "../ExperienceForm";

export function ExperienceTab() {
  const [items, setItems] = useState<ExpItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState(false);
  const [forms, setForms] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch("/profile/experience")
      .then((r) => {
        setItems(r.items ?? []);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const startEdit = () => {
    setForms(items.map(expToForm));
    setEditing(true);
  };
  const cancel = () => setEditing(false);

  const setField = (i: number, k: string) => (v: string | boolean) =>
    setForms((arr) => arr.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));

  const save = async () => {
    setSaving(true);
    try {
      const payload = forms.map(formToExp);
      await apiFetch("/profile/experience", "POST", payload);
      setItems(payload);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (fetching) return <LoadingCard />;

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Work Experience"
        desc="Roles and internships — highlights are shown as bullet points on the resume"
      />

      {/* View cards */}
      {items.length === 0 ? (
        <ViewCard>
          <EmptyState
            message="No experience saved yet"
            onAdd={() => {
              setForms([expToForm(blankExp())]);
              setEditing(true);
            }}
          />
        </ViewCard>
      ) : (
        items.map((exp, i) => (
          <ViewCard key={i}>
            <CardHeader
              title={`${exp.role} @ ${exp.company}`}
              subtitle={`${exp.start_date} – ${exp.end_date}${exp.location ? " · " + exp.location : ""}${exp.is_internship ? " · Internship" : ""}`}
              onEdit={startEdit}
              editing={editing && i === 0}
            />
            {(exp.stack ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {(exp.stack ?? []).map((s, j) => (
                  <Chip key={j} label={s} />
                ))}
              </div>
            )}
            {(exp.highlights ?? []).length > 0 && (
              <ul className="space-y-1 mt-2">
                {(exp.highlights ?? []).map((h, j) => (
                  <li key={j} className="flex gap-2 text-sm text-[#8b949e]">
                    <span className="text-[#484f58] mt-0.5">▸</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </ViewCard>
        ))
      )}

      {/* Single edit button if items exist and not editing */}
      {items.length > 0 && !editing && (
        <button
          onClick={startEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#30363d] text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff] text-xs font-mono transition-colors"
        >
          ✎ Edit all experience
        </button>
      )}

      {/* Edit form */}
      {editing && (
        <ViewCard editing>
          <p className="text-[#58a6ff] text-xs font-mono uppercase tracking-wider mb-4">
            Editing experience
          </p>
          <div className="space-y-6">
            {forms.map((form, i) => (
              <div
                key={i}
                className="pb-6"
                style={{
                  borderBottom:
                    i < forms.length - 1 ? "1px solid #21262d" : "none",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#8b949e] text-xs font-mono">
                    Entry {i + 1}
                  </p>
                  {forms.length > 1 && (
                    <button
                      onClick={() =>
                        setForms((f) => f.filter((_, idx) => idx !== i))
                      }
                      className="text-xs text-[#f85149] hover:text-[#ff7b72] font-mono transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Field
                    label="Company"
                    value={form.company}
                    onChange={setField(i, "company")}
                    placeholder="Totality Corp"
                  />
                  <Field
                    label="Role"
                    value={form.role}
                    onChange={setField(i, "role")}
                    placeholder="Software Engineer I"
                  />
                  <Field
                    label="Location"
                    value={form.location}
                    onChange={setField(i, "location")}
                    placeholder="Mumbai, India"
                  />
                  <Field
                    label="Start Date"
                    value={form.start_date}
                    onChange={setField(i, "start_date")}
                    placeholder="April 2025"
                  />
                  <Field
                    label="End Date"
                    value={form.end_date}
                    onChange={setField(i, "end_date")}
                    placeholder="Present"
                  />
                  <div className="flex items-center gap-3 self-end pb-2">
                    <input
                      type="checkbox"
                      id={`intern-${i}`}
                      checked={form.is_internship}
                      onChange={(e) =>
                        setField(i, "is_internship")(e.target.checked)
                      }
                      className="accent-[#58a6ff]"
                    />
                    <label
                      htmlFor={`intern-${i}`}
                      className="text-[#8b949e] text-xs font-mono"
                    >
                      Internship
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <Field
                    label="Stack (comma-separated)"
                    value={form.stack}
                    onChange={setField(i, "stack")}
                    placeholder="Python, Node.js, Next.js"
                  />
                  <Field
                    label="Highlights (one per line)"
                    value={form.highlights}
                    onChange={setField(i, "highlights")}
                    textarea
                    placeholder={
                      "Built trading system with 20% returns.\nDesigned pipelines with 100% uptime."
                    }
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setForms((f) => [...f, expToForm(blankExp())])}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[#30363d] text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff] text-xs font-mono transition-colors"
            >
              + Add another role
            </button>
            <div className="flex gap-3">
              <CancelBtn onClick={cancel} />
              <SaveBtn onClick={save} loading={saving} saved={saved} />
            </div>
          </div>
        </ViewCard>
      )}
    </div>
  );
}
